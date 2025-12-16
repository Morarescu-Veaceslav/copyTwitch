import { type ArgumentMetadata, BadRequestException, type PipeTransform } from "@nestjs/common";
import { ReadStream } from "fs";
import { validateFileFormat, validateFileSize } from "../utils/file.util";



export class FileValidationPipe implements PipeTransform {
    public async transform(value: any, metadata: ArgumentMetadata) {

        if (!value.filename) {
            throw new BadRequestException('File not loaded.')
        }

        const { filename, createReadStream } = value

        const fileStream = createReadStream() as ReadStream

        const allowedFileFormats = ['jpg', 'jpeg', 'png']
        const isFileFormatValid = validateFileFormat(filename, allowedFileFormats)

        if (!isFileFormatValid) {
            throw new BadRequestException('Invalid format image.')
        }

        const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)

        if (!isFileSizeValid) {
            throw new BadRequestException('The image is larger than 10 mb.')
        }

        return value
    }
}