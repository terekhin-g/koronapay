import {PrintService} from "../print.service.js";
import chalk from 'chalk';

class PrintServiceImpl implements PrintService {
    error(message: string): void {
        console.log(chalk.bgRed('Ошибка.') + ' ' + message);
    }

    success(message: string): void {
        console.info(chalk.bgGreen('Успех.') + ' ' + message);
    }

    log(message: string): void {
        console.log(message);
    }

}

export {PrintServiceImpl}
