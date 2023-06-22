import {FileService} from "../file.service.js";
import {promises as fs} from "fs";

class FileServiceImpl implements FileService {
    async exists(path: string): Promise<boolean> {
        try {
            await fs.stat(path);
            return true;
        } catch (error: any) {
            return false;
        }
    }

    async mkdir(path: string): Promise<void> {
        try {
            return await fs.mkdir(path);
        } catch (error: any) {
            throw new Error('An error occurred during creating the directory.')
        }
    }

    async readFile(path: string): Promise<Buffer> {
        try {
            return await fs.readFile(path);
        } catch (error: any) {
            throw new Error('An error occurred during reading the file.')
        }
    }

    writeFile(path: string, data: string): Promise<void> {
        try {
            return fs.writeFile(path, data);
        } catch (error: any) {
            throw new Error('An error occurred during writing the file.')
        }
    }

}

export {FileServiceImpl};
