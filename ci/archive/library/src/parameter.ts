/**
 * Map the given param placeholder `name`(s) to the given callback.
 *
 * Parameter mapping is used to provide pre-conditions to routes
 * which use normalized placeholders. For example a _:user_id_ parameter
 * could automatically load a user's information from the database without
 * any additional code.
 *
 * The callback uses the same signature as middleware, the only difference
 * being that the value of the placeholder is passed, in this case the _id_
 * of the user. Once the `next()` function is invoked, just like middleware
 * it will continue on to execute the route, or subsequent parameter functions.
 *
 * Just like in middleware, you must either respond to the request or call next
 * to avoid stalling the request.
 *
 *  router.param('user_id', function(req, res, next, id){
 *    User.find(id, function(err, user){
 *      if (err) {
 *        return next(err)
 *      } else if (!user) {
 *        return next(new Error("failed to load user"))
 *      }
 *      req.user = user
 *      next()
 *    })
 *  })
 *
 * @param {string} name
 * @param {function} fn
 * @public
 */

import { Router } from ".";

export const Parameter = Router.prototype.param = function (name: string, functional: Function) {
    /// Negation of (if the context := instance), or evaluate
    switch ( !!( this ) || true ) {
        case ( !name ):
            throw new TypeError( "Argument \"name\" is required" );
        case ( functional === null ):
            throw new TypeError( "Argument \"functional\" is required" );
        case ( typeof functional !== "function" ):
            throw new TypeError( "Argument \"functional\" must be := Function" );

        default: {
            const parameters = this.params = ( ( this.params && this.params[ name ] ) ) ? this.params[ name ] : [];

            parameters.push( functional );

            return this;
        }
    }
};

export default Parameter;