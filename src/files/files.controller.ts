import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Get('product/:imageName')
  getImage(
    @Res() res:Response,
    @Param('imageName') imageName:string){
    const path=this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
      
  }
  //Solo funciona si es express en fastyfy no funciona
  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter,
    storage:diskStorage({
      destination:'./static/products',
      filename:fileNamer
    })
  }))//nombre de la propiedad
  uploadFile(
    @UploadedFile()
    file:Express.Multer.File){
      if(!file){
        return new BadRequestException('Be sure yoru file is an image');
      }
    return `http://localhost:3002/files/product/`+file.filename;
  }

}
