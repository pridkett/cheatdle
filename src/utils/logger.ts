export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

class Logger {
  private static instance: Logger;
  private currentLevel: LogLevel = LogLevel.NONE;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  debug(...args: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log('[DEBUG]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log('[INFO]', ...args);
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error('[ERROR]', ...args);
    }
  }
}

export const logger = Logger.getInstance();
