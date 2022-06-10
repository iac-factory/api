/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import ORM, { Schema } from "mongoose";

export type Type = {
    user: ORM.Schema.Types.ObjectId,
    first: String,
    middle?: String,
    last?: String,
    preferred?: String,
    alias?: String,
    creation: Date;
    modification: Date;
};

export interface Methods {}

export type Representation = ORM.Model<Type, {}, Methods>;

export const schema = new Schema<Type, Representation, Methods>( {
    user: {
        required: false,
        type: ORM.Types.ObjectId,
        ref: "User",
        name: "user",
        alias: "User"
    },
    first: {
        name: "first",
        required: true,
        type: String,
        alias: "First",
        trim: true
    },
    middle: {
        name: "middle",
        required: false,
        type: String,
        default: null,
        alias: "Middle",
        trim: true
    },
    last: {
        name: "last",
        required: true,
        type: String,
        default: null,
        alias: "Last",
        trim: true
    },
    preferred: {
        name: "preferred",
        required: false,
        type: String,
        default: null,
        alias: "Preferred",
        trim: true
    }
}, {
    versionKey: "version",
    timestamps: {
        createdAt: "creation",
        updatedAt: "modification"
    }
} );

export const Model = ORM.model<Type, Representation, Methods>( "Name", schema, "Name" );
export type Model = typeof Model;
export default Model;

async function Initialize() {
    await import("..");

    try {
        await Model.createCollection({});
    } catch (exception) {}
}

void (async () => Initialize())();
