type LogLevel = "debug" | "info" | "warn" | "error";

interface Logger {
  debug: (msg: string, ...args: unknown[]) => void;
  info: (msg: string, ...args: unknown[]) => void;
  warn: (msg: string, ...args: unknown[]) => void;
  error: (msg: string, ...args: unknown[]) => void;
}

const isDev = import.meta.env.DEV;

function log(level: LogLevel, msg: string, ...args: unknown[]): void {
  if (!isDev && level === "debug") return;
  const entry = { level, msg, ts: new Date().toISOString(), ...(args.length ? { detail: args } : {}) };
  // eslint-disable-next-line no-console
  console[level](JSON.stringify(entry));
}

const logger: Logger = {
  debug: (msg, ...args) => log("debug", msg, ...args),
  info: (msg, ...args) => log("info", msg, ...args),
  warn: (msg, ...args) => log("warn", msg, ...args),
  error: (msg, ...args) => log("error", msg, ...args),
};

export default logger;
