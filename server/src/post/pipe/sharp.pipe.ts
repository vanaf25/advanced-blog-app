import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import sizeof from 'image-size'
export type SharpResolvePipe={
    width:number,
    height:number,
    filename:string
}
@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File,  Promise<SharpResolvePipe>> {
    async transform( image: Express.Multer.File): Promise<SharpResolvePipe> {
        try {
            if (image){
                const originalName = path.parse(image.originalname).name;
                const filename = Date.now() + '-' + originalName + '.webp';
                await sharp(image.buffer)
                    .webp({ effort: 3 })
                    .toFile(path.join(`src/images/avatars`, filename));
                const {width,height} = sizeof(`src/images/avatars/${filename}`)
                return {filename,width,height};
            }
        }
        catch (e) {
            console.log('e',e);
        }
    }
}
