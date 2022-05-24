import ORM from "mongoose";

export const Name = {
   User: { type: ORM.Schema.Types.ObjectId, ref: "User", required: true },

   First: {
       required: true,
       type: String,
       default: null,
       alias: "first",
       trim: true
   },
   Middle: {
       required: false,
       type: String,
       default: null,
       alias: "middle",
       trim: true
   },
   Last: {
       required: true,
       type: String,
       default: null,
       alias: "last",
       trim: true
   },

   Preferred: {
       required: false,
       type: String,
       default: null,
       alias: "preferred",
       trim: true
   },

   Alias: {
       required: false,
       type: String,
       default: null,
       alias: "alias",
       trim: true
   }
};

export const Schema = new ORM.Schema( Name );

export default ORM.model( "Name", Schema, "Name" );

