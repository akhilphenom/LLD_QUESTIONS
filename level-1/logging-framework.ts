enum LOG_LEVEL {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    FATAL = "FATAL"
}

interface ILogMessage {
    timeStamp: Date,
    level: LOG_LEVEL,
    message: string
}

interface ILogOutput {
    log(message: ILogMessage): void
}

class ConsoleLogger implements ILogOutput {
    log(message: ILogMessage): void {
        console.log(`${moment(timeStamp).format('YYYY-MM-DD hh: mm: ss')} :: ${level} :: ${message}`)
    }
}

class FileLogger implements ILogOutput {
    constructor(
        private filePath: string
    ) {}

    log({ timeStamp, level, message }: ILogMessage): void {
        const fs = require('fs')
        fs.writeFileSync(this.filePath, `${moment(timeStamp).format('YYYY-MM-DD hh: mm: ss')} :: ${level} :: ${message}`)
    }
}

class Logger {
    constructor (
        private outputs: ILogOutput[],
        private minLogLevel: LOG_LEVEL
    ) { }

    log(level: LOG_LEVEL, message: string): void {
        if (Object.values(LOG_LEVEL).indexOf(level) < Object.values(LOG_LEVEL).indexOf(this.minLogLevel)) {
          return;
        }
    
        const logMessage: ILogMessage = { timeStamp: new Date(), level, message };
    
        this.outputs.forEach(output => output.log(logMessage));
    }
}

const logger = new Logger([new FileLogger('dist/log.txt'), new ConsoleLogger()], LOG_LEVEL.ERROR);

logger.log(LOG_LEVEL.DEBUG, "Debug Message")