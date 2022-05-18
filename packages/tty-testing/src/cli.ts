export const Arguments = process.argv.splice( 2 );

export const Debug = Arguments.includes( "--debug" ) ?? null;

export const Spawn = (Arguments.includes( "--spawn" ) || Arguments.includes( "-s" )) ?? null;
export const Execute = (Arguments.includes( "--execute" ) || Arguments.includes( "--exec" ) || Arguments.includes( "-e")) ?? null;
export const Default = { evaluation: ( !( Spawn ) && !( Execute ) ) ? "spawn" : (Spawn) ? "spawn" : "execute" };

export default Default as Boolean & { evaluation: "spawn" | "execute" };