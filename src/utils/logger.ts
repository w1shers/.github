import util from 'node:util';
import chalk from 'chalk';

const logMethods = {
  info: chalk.blueBright.bold,
  event: chalk.magentaBright.bold,
  error: chalk.redBright.bold,
  warn: chalk.yellowBright.bold,
  ready: chalk.greenBright.bold,
} as const;

const types = Object.keys(logMethods) as (keyof typeof logMethods)[];
type LogType = (typeof types)[number];

function formatOutput(type: LogType, ...args: unknown[]) {
  const color = logMethods[type];
  const time = chalk.gray(
    `[${new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}]`
  );
  const label = color(type.padEnd(Math.max(...types.map((t) => t.length))));
  const message = args.map((arg) => (arg instanceof Error ? arg.stack || arg.message : typeof arg === 'string' ? arg : util.inspect(arg, { colors: true, depth: null, compact: false }))).join(' ');
  return `${time} ${label} ${chalk.gray('─')} ${message}`;
}

type LoggerMethods = {
  [K in LogType]: (...args: unknown[]) => void;
};

const logger = {} as LoggerMethods;

for (const type of types) {
  logger[type] = (...args: unknown[]) => {
    const output = formatOutput(type, ...args);
    if (type === 'error') {
      console.error(output);
    } else {
      console.log(output);
    }
  };
}

export { logger };
