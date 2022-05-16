import FS from "fs";
import Path from "path";
import API from "express";

import { Router as Controller } from "express";
export const Directory = (location: string) => {
    const extension = (location) ? Path.extname(location) : null;

    location = (extension === ".ts" || extension === ".js")
        ? (location) ? Path.dirname(location) : location
        : location;

    const directory = (location) ? location : Path.dirname(__filename);

    const directories = FS.readdirSync( directory, {
        withFileTypes: true,
        encoding: "utf-8"
    } );

    const data = directories.map( (descriptor) => {
        return ( descriptor.isDirectory() )
            ? descriptor.name : null;
    } ).filter( (handler) => handler );

    return { data, status: 200 };
};

export { Controller };

export const Application = API();

export default Application;