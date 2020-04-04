enum LogLevel {
    INFO,
    WARN,
    DEBUG,
}

const LEVEL = LogLevel.DEBUG;

export const log = LEVEL <= LogLevel.INFO ? console.log : (..._: any) => {
};
export const warn = LEVEL <= LogLevel.WARN ? console.warn : (..._: any) => {
};
export const debug = LEVEL <= LogLevel.DEBUG ? console.debug : (..._: any) => {
};

