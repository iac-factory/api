// enum Filter {
//
// }
//
// const Handler = async () => {
//     const { Client } = await import("..");
//
//     const filter = request.params.filter;
//     const error: { throw: boolean } = { throw: false };
//     const data: ( string | undefined | { Variables?: object; Function?: string; ARN?: string } )[] = [];
//
// }
//     switch ( filter ) {
//         case "name": {
//             const functions = await Lambda.Client.Functions();
//
//             ( functions ) && functions.filter( (lambda) => lambda )
//                 .forEach( (configuration) => data
//                     .push( configuration.FunctionName )
//                 );
//             break;
//         }
//
//         case "arn": {
//             const functions = await Lambda.Client.Functions();
//
//             ( functions ) && functions.filter( (lambda) => lambda )
//                 .forEach( (configuration) => data
//                     .push( configuration.FunctionArn )
//                 );
//             break;
//         }
//
//         case "role": {
//             const functions = await Lambda.Client.Functions();
//
//             ( functions ) && functions.filter( (lambda) => lambda )
//                 .forEach( (configuration) => data
//                     .push( configuration.Role )
//                 );
//             break;
//         }
//
//         case "environment-variables": {
//             const functions = await Lambda.Client.Functions();
//
//             ( functions ) && functions.filter( (lambda) => lambda )
//                 .forEach( (configuration) => data
//                     .push( {
//                         Variables: configuration.Environment?.Variables,
//                         Function: configuration.FunctionName,
//                         ARN: configuration.FunctionArn
//                     } )
//                 );
//             break;
//         }
//
//         default: {
//             error.throw = true;
//             break;
//         }
// }