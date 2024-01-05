import {v4 as uuid}from 'uuid'
export const fileNamer=(req:Express.Request,file:Express.Multer.File,callFunction:Function)=>{
    console.log({file});
    if(!file){
        return callFunction(new Error('Empty file'),false);
    }
    const fileExtension=file.mimetype.split("/")[1];
    const fileName=`${uuid()}.${fileExtension}`;
    callFunction(null,fileName);
}