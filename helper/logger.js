const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint, colorize, align, printf, splat } = format

const CATEGORY = ['myPUPQC-API Main Level']

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        verbose: 'cyan',
        debug: 'blue',
        silly: 'white',
    },
}

const parser = param => {
    if (!param) {
        return ''
    }
    if (typeof param === 'string') {
        return param
    }
    console.log('param', param)
    console.log(Object.keys(param).length)
    return Object.keys(param).length ? JSON.stringify(param, undefined, 2) : ''
}

const userLogger = createLogger({
    levels: customLevels.levels,
    format: combine(
        label({ label: CATEGORY[0] }),
        timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        prettyPrint(),
        colorize(),
        align(),
        printf(info => {
            const { timestamp, level, message } = info
            const ts = timestamp
            return `\n${ts} [${level}]${message}`
        })
    ),
    addColors: customLevels.colors,
    transports: [new transports.Console()],
})

module.exports = {
    userLogger: userLogger,
}
