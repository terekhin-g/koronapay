import { PrintService } from '../print.service.js';
import chalk from 'chalk';

class PrintServiceImpl implements PrintService {
	error(message: string): void {
		console.log(chalk.bgRed('ERROR.') + ' ' + message);
	}

	success(message: string): void {
		console.info(chalk.bgGreen('SUCCESS.') + ' ' + message);
	}

	log(message: string): void {
		console.log(message);
	}

	warn(message: string): void {
		console.log(chalk.bgYellow('WARN.') + ' ' + message);
	}
}

export { PrintServiceImpl };
