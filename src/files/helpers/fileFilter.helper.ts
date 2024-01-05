export const fileFilter=(req:Express.Request,file:Express.Multer.File,callFunction:Function)=>{
    console.log({file});
    if(!file){
        return callFunction(new Error('Empty file'),false);
    }
    const fileExtension=file.mimetype.split('/')[1];//Que tipo de app es
    const validExtension=['jpg','jpeg','png','gif'];
    if(validExtension.includes(fileExtension)){
        return callFunction(null,true);
    }
    callFunction(null,false);
}