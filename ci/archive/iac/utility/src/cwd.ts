/// The actual current directory for the process if running external (`npx`)
const Initial = process.env?.[ "INIT_CWD" ] ?? null;

( Initial !== null ) && process.chdir( Initial );

/// Current Working Directory - `undefined` if running externally (oddly enough)
const CWD = process.cwd();

export { CWD };

export default CWD;
