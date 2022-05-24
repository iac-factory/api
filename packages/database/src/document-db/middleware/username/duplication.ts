// import { default as User } from "./../../model/user/index.js";
//
// export const Username = async (request, response, $) => {
//    User.findOne({
//        username: request.body.username
//    }).exec((error, user) => {
//        if ( error ) {
//            response.status(500).send({message: error});
//            return;
//        }
//
//        if ( user ) {
//            response.status(400).send({message: "Failed! Username is already in use!"});
//            return;
//        }
//
//        $();
//    });
// };
//
// export const Email = async (request, response, $) => {
//    User.findOne({
//        email: request.body.email
//    }).exec((error, user) => {
//        if ( error ) {
//            response.status(500).send({message: error});
//            return;
//        }
//
//        if ( user ) {
//            response.status(400).send({message: "Failed! Email is already in use!"});
//            return;
//        }
//
//        $();
//    });
// };
//
// export {}
