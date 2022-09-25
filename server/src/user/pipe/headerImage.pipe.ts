import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
@Injectable()
export class HeaderImagePipeSharpPipe implements PipeTransform<Express.Multer.File,  Promise<string>> {
    async transform( image: Express.Multer.File): Promise<string> {
        try {
            if (image){
                const originalName = path.parse(image.originalname).name;
                const filename = Date.now() + '-' + originalName + '.webp';
                await sharp(image.buffer)
                    .resize(960,280)
                    .webp({ effort: 3 })
                    .toFile(path.join(`src/images/headersImages`, filename));
                return filename;
            }
        }
        catch (e) {
            console.log('e',e);
        }
    }
}
