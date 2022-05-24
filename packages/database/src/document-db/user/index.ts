const Global = Object.create({
    initialize: (process.env["INITIALIZE"] === "true")
});

import { Model, Schema } from "mongoose";

import { Hash } from "./../middleware";

import ORM from "mongoose";

interface Type {
    email?: string;
    username?: string;
    password?: string;
    login?: Date;
    role?: string;
    name?: string;
    creation: Date;
    modification: Date;
}

interface Methods {
    check(): boolean;

    hash(): Promise<void>;
}

type Representation = Model<Type, {}, Methods>;

export const schema = new Schema<Type, Representation, Methods>( {
    email: {
        name: "email",
        alias: "Email",
        type: String,
        required: true,
        index: true,
        unique: true,
        default: null,
        lowercase: true,
        uppercase: false,
        trim: true
    },

    username: {
        name: "username",
        alias: "Username",
        type: String,
        required: true,
        index: true,
        unique: true,
        default: null,
        lowercase: false,
        uppercase: false,
        trim: true
    },

    password: {
        name: "password",
        alias: "Password",
        type: String,
        required: true,
        index: false,
        unique: false,
        default: null,
        lowercase: false,
        uppercase: false,
        trim: true
    },

    login: { // Password Usage (Date)
        name: "login",
        alias: "Login",
        type: ORM.Schema.Types.Date,
        required: false,
        index: false,
        unique: false,
        default: null,
        lowercase: false,
        uppercase: false,
        trim: false
    }
}, {
    versionKey: "version",
    timestamps: {
        createdAt: "creation",
        updatedAt: "modification"
    }, autoCreate: true
} );

schema.methods.hash = Hash;

export const User = ORM.model<Type, Representation, Methods>( "User", schema, "User" );

async function Initialize () {
    await import("..");

    const empty = ( await User.collection.stats() ).count === 0;

    const Record = new User( { Email: "administrator@internal.io", Username: "Administrator", Password: "Kn0wledge!" } );

    (Global.initialize && empty) && Record.save( async (error: any) => {
        if ( error ) {
            Record.delete( { _id: Record.id } );

            await Record.save().catch((error) => {
                /*** [...] */
            });

            await Initialize();
        }

        await Record.hash();
        await Record.updateOne();
        await Record.save();
    } );
}

void (async () => Initialize())();

export default User;
