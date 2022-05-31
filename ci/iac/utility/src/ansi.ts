import Assert from "assert";
import Utility from "util"
import FS from "fs";

function emitNewlineEvents(stream) {
    /// Already emitting event(s)
    if ( stream?.emitting ) return;

    const write = stream.write;

    stream.write = function (data) {
        // eslint-disable-next-line prefer-rest-params
        const rtn = write.apply(stream, arguments);

        if ( stream.listeners("newline").length > 0 ) {
            // eslint-disable-next-line prefer-const
            const len = data.length
            let i = 0;
            // now try to calculate any deltas
            if ( typeof data == "string" ) {
                for ( ; i < len; i++ ) {
                    processByte(stream, data.charCodeAt(i));
                }
            } else {
                // buffer
                for ( ; i < len; i++ ) {
                    processByte(stream, data[ i ]);
                }
            }
        }

        return rtn;
    };

    stream.emitting = true;
}

/**
 * Processes an individual byte being written to a stream
 */

function processByte(stream, character) {
    Assert.equal(typeof character, "number");
    if ( character === "\n" ) {
        stream.emit("newline");
    }
}

const prefix = "\x1b["; // For all escape codes
const suffix = "m";     // Only for color codes

/**
 * The ANSI escape sequences.
 */

const codes = {
    up: "A",
    down: "B",
    forward: "C",
    back: "D",
    nextLine: "E",
    previousLine: "F",
    horizontalAbsolute: "G",
    eraseData: "J",
    eraseLine: "K",
    scrollUp: "S",
    scrollDown: "T",
    savePosition: "s",
    restorePosition: "u",
    queryPosition: "6n",
    hide: "?25l",
    show: "?25h"
};

/**
 * Rendering ANSI codes.
 */

const styles = {
    bold: 1, italic: 3, underline: 4, inverse: 7
};

/**
 * The negating ANSI code for the rendering modes.
 */

const reset = {
    bold: 22, italic: 23, underline: 24, inverse: 27
};

/**
 * The standard ANSI colors capable of being styled
 */

const colors = {
    white: 37,
    black: 30,
    blue: 34,
    cyan: 36,
    green: 32,
    magenta: 35,
    red: 31,
    yellow: 33,
    grey: 90,
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97
};

function Mutator(cursor) {
    ///if ( !( cursor instanceof Cursor ) ) throw new Error("Error - Mutator Argument !:= Cursor");

    const $ = {
        bold: cursor.bold,
        italic: cursor.italic,
        underline: cursor.underline,
        inverse: cursor.inverse,
    }

    return {};
}

/**
 * The `Cursor` class.
 */

function Cursor(stream?, options?) {
    if ( typeof stream != "object" || typeof stream.write != "function" ) {
        throw new Error("a valid Stream instance must be passed in");
    } else if ( !( this instanceof Cursor ) ) {
        // @ts-ignore
        return new Cursor(stream, options);
    }

    // the stream to use
    this.stream = stream;

    // when 'enabled' is false then all the functions are no-ops except for write()
    this.enabled = options && ( options?.enabled ?? true );
    if ( typeof this.enabled === "undefined" ) {
        this.enabled = stream.isTTY;
    }
    this.enabled = !!this.enabled;

    // then `buffering` is true, then `write()` calls are buffered in
    // memory until `flush()` is invoked
    this.buffering = !!( options && options.buffering );
    this.buffer = [];

    // controls the foreground and background colors
    this.fg = this.foreground = new Colorer(this, 0);
    this.bg = this.background = new Colorer(this, 10);

    this.newline = options?.newline ?? false;
    this.debug = options?.debug ?? false;

    this.mutator = Mutator(this);

    // keep track of the number of chains that get encountered
    this.chain = 0;

    // keep track of the number of "newlines" that get encountered
    this.newlines = 0;

    emitNewlineEvents(stream);
    stream.on("newline", function () {
        this.newlines++;
    }.bind(this));

    /// Ensure to flush the buffer, and reset the cursor prior to process exit
    process.on("beforeExit", () => {
        ( this.buffering ) && this.flush();

        ( ( this.stream?.fd ?? false ) === 1 ) && FS.fdatasyncSync(process.stdout.fd);

        this.reset();
    });
}

Cursor.prototype.log = function (data) {
    /// If a control character is encountered, and isn't, therefore, a *.write() call (unless nested, but
    /// such would be an anti-pattern given the chaining + buffering capabilities.
    /// --> The anti-pattern could be argued due to memory constraints... but if these are the circumstances,
    /// --> debugging should not be enabled, and a different zero-buffer related package or runtime
    /// --> language... should be used.
    if ( !data.includes(prefix) ) {
        // eslint-disable-next-line prefer-rest-params
        process.stdout.write("\n" + "[Debug] Write Event" + "(" + this.chain + ")" + " " + Utility.inspect(arguments, {
            colors: false,
            compact: false
        }) + "\n");
    } else if ( data !== "\x1B" + "[" + "0" + "m" ) {
        // The following conditional could be argued a performance
        // concern; again, if performance is the concern, don't allow
        // the conditional to progress this far by disabling debug mode.

        // eslint-disable-next-line prefer-rest-params
        process.stdout.write("[Debug] Write Event" + "(" + this.chain + ")" + " " + Utility.inspect(arguments, {
            colors: false,
            compact: false
        }) + "\n");
    }
};

/// Evaluate stream file-descriptor for a trailing newline, and attributed options for debug mode
Cursor.prototype.evaluate = function (data) {
    // eslint-disable-next-line prefer-rest-params
    ( this.debug ) || this.stream.write.apply(( ( this.debug ) ? "" : this.stream ), arguments);

    if ( !( data.includes(prefix) ) && !( this.debug ) ) {
        ( this.stream.fd === 1 ) && process.stdout.write("\n");
    }

    ( this.debug ) && this.log(data);
};

/**
 * Helper function that calls `write()` on the underlying Stream.
 * Returns `this` instead of the write() return value to keep
 * the chaining going.
 *
 * Additionally extended to call an evaluation callable for
 * better debugging and newline utility.
 */
Cursor.prototype.write = function (data) {
    if ( this.buffering ) {
        // eslint-disable-next-line prefer-rest-params
        this.buffer.push(arguments);
    } else this.evaluate(data);

    this.chain += 1;

    return this;
};

/**
 * Buffer `write()` calls into memory.
 *
 * @api public
 */

Cursor.prototype.buffer = function () {
    this.buffering = true;

    return this;
};

/**
 * Write out the in-memory buffer.
 *
 * @api public
 */

Cursor.prototype.flush = function () {
    this.buffering = false;

    const str = this.buffer.map(function (args) {
        if ( args.length !== 1 ) throw new Error("Invalid Invocation - *.buffer.map() takes exactly one arguments (received" + " " + args.length + ")");

        return args[ 0 ];
    }).join("");

    this.buffer.splice(0); // empty
    this.write(str);

    return this;
};

/**
 * The `Colorer` class manages both the background and foreground colors.
 */

function Colorer(cursor, base) {
    this.current = null;
    this.cursor = cursor;
    this.base = base;
}

/**
 * Write an ANSI color code, ensuring that the same code doesn't get rewritten.
 */

Colorer.prototype.setColorCode = function setColorCode(code) {
    const character = String(code);

    if ( this.current === character ) return;

    this.cursor.enabled && this.cursor.write(prefix + character + suffix);
    this.current = character;

    return this;
};

/**
 * Set up the positional ANSI codes.
 */

Object.keys(codes).forEach(function (name) {
    const code = String(codes[ name ]);
    Cursor.prototype[ name ] = function () {
        let c = code;
        if ( arguments.length > 0 ) {
            // eslint-disable-next-line prefer-rest-params
            c = toArray(arguments).map(Math.round).join(";") + code;
        }
        this.enabled && this.write(prefix + c);
        return this;
    };
});

/**
 * Set up the functions for the rendering ANSI codes.
 */

Object.keys(styles).forEach(function (style) {
    const name = style[ 0 ].toUpperCase() + style.substring(1)
    const character = styles[ style ];

    Reflect.set(reset, style, reset[ style ]);

    Cursor.prototype[ style ] = function () {
        if ( this[ name ] ) {
            return this;
        }

        this.enabled && this.write(prefix + character + suffix);
        this[ name ] = true;

        return this;
    };

    Cursor.prototype[ "reset" + name ] = function () {
        if ( !this[ name ] ) return this;
        this.enabled && this.write(prefix + character + suffix);
        this[ name ] = false;

        return this;
    };

});

/**
 * Setup the functions for the standard colors.
 */

Object.keys(colors).forEach(function (color) {
    const code = colors[ color ];

    Colorer.prototype[ color ] = function () {
        this.setColorCode(this.base + code);
        return this.cursor;
    };

    Cursor.prototype[ color ] = function () {
        return this.foreground[ color ]();
    };
});

/**
 * Makes a beep sound!
 */

Cursor.prototype.beep = function () {
    this.enabled && this.write("\x07");
    return this;
};

/**
 * Moves cursor to specific position
 */

Cursor.prototype.goto = function (x, y) {
    x = x | 0;
    y = y | 0;
    this.enabled && this.write(prefix + y + ";" + x + "H");
    return this;
};

/**
 * Resets the color.
 */

Colorer.prototype.reset = function () {
    this.setColorCode(this.base + 39);

    return this.cursor;
};

/**
 * Resets all ANSI formatting on the stream.
 */

Cursor.prototype.reset = function () {
    this.enabled && this.write(prefix + "0" + suffix);

    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.inverse = false;
    this.foreground = { current: null };
    this.background = { current: null };

    return this;
};

/**
 * Sets the foreground color with the given RGB values.
 * The closest match out of the 216 colors is picked.
 */

Colorer.prototype.rgb = function (r, g, b) {
    const base = this.base + 38;
    const code = rgb(r, g, b);

    this.setColorCode(base + ";5;" + code);

    return this.cursor;
};

/**
 * Same as `cursor.fg.rgb(r, g, b)`.
 */

Cursor.prototype.rgb = function (r, g, b) {
    return this.foreground.rgb(r, g, b);
};

/**
 * Accepts CSS color codes for use with ANSI escape codes.
 * For example: `#FF000` would be bright red.
 */

Colorer.prototype.hex = function (color) {
    // eslint-disable-next-line prefer-spread
    return this.rgb.apply(this, hex(color));
};

/**
 * Same as `cursor.fg.hex(color)`.
 */

Cursor.prototype.hex = function (color) {
    return this.foreground.hex(color);
};

// UTIL FUNCTIONS //

/**
 * Translates a 255 RGB value to a 0-5 ANSI RGV value,
 * then returns the single ANSI color code to use.
 */

function rgb(r, g, b) {
    const red = r / 255 * 5;
    const green = g / 255 * 5;
    const blue = b / 255 * 5;

    return rgb5(red, green, blue);
}

/**
 * Turns rgb 0-5 values into a single ANSI color code to use.
 */

function rgb5(r, g, b) {
    const red = Math.round(r);
    const green = Math.round(g);
    const blue = Math.round(b);

    return 16 + ( red * 36 ) + ( green * 6 ) + blue;
}

/***
 * Hex Color
 * ---
 *
 * Accepts a hex CSS color code string (# is optional) and
 * translates it into an Array of 3 RGB 0-255 values, which
 * can then be used with rgb().
 *
 * @param color
 * @returns {number[]}
 */
function hex(color) {
    const c = color[ 0 ] === "#" ? color.substring(1) : color;

    const r = c.substring(0, 2);
    const g = c.substring(2, 4);
    const b = c.substring(4, 6);

    return [ parseInt(r, 16), parseInt(g, 16), parseInt(b, 16) ];
}

/**
 * Turns an array-like object into a real array.
 */

const toArray = (array) => {
    const Length = array.length;
    const Array = [];

    let $ = 0;

    for ( $; $ < Length; $++ ) {
        Array.push(array[ $ ]);
    }

    return Array;
};

/**
 * Creates a Cursor instance based off the given `writable stream` instance.
 *
 * @example
 * const $ = ansi(process.stdout, {
 *     bold: true,
 *     enabled: true,
 *     buffering: false,
 *     newline: true,
 *     debug: false
 * });
 *
 * $.green().write("Hello World!");
 *
 * @todo - Include additional examples
 */

function ansi(stream: NodeJS.WriteStream & { fd: 1; } = process.stdout, options: { enabled: boolean; } = { enabled: true } ): NodeJS.WriteStream & { fd: 1 } {
    if ( Reflect.get(stream, "cursor") ) {
        return Reflect.get(stream, "cursor");
    } else {
        Reflect.set(stream, "cursor", Cursor(stream, options));
    }

    return stream;
}

export { Colorer, ansi };

export default ansi;
