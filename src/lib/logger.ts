import {
  logger as reactNativeLogs,
  consoleTransport,
  type LoggerInstance,
} from "react-native-logs";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogMethod = (...args: unknown[]) => void;

export interface AppLogger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  extend: (namespace: string) => AppLogger;
}

const DEV_TRANSPORT_COLORS = {
  info: "blueBright",
  warn: "yellowBright",
  error: "redBright",
  debug: "white",
} as const;

const NOOP: LogMethod = () => {};

function composeNamespace(parent?: string, child?: string): string | undefined {
  if (parent && child) return `${parent}:${child}`;
  return parent ?? child;
}

function createNoopLogger(namespace?: string): AppLogger {
  return {
    debug: NOOP,
    info: NOOP,
    warn: NOOP,
    error: NOOP,
    extend: (childNamespace: string) =>
      createNoopLogger(composeNamespace(namespace, childNamespace)),
  };
}

function createConsoleFallbackLogger(namespace?: string): AppLogger {
  const makeMethod =
    (level: LogLevel): LogMethod =>
    (...args: unknown[]) => {
      if (!__DEV__) return;

      const prefix = namespace ? `[${namespace}]` : "[app]";
      const target = console[level] ?? console.log;
      target(prefix, ...args);
    };

  return {
    debug: makeMethod("debug"),
    info: makeMethod("info"),
    warn: makeMethod("warn"),
    error: makeMethod("error"),
    extend: (childNamespace: string) =>
      createConsoleFallbackLogger(composeNamespace(namespace, childNamespace)),
  };
}

function wrapReactNativeLogsInstance(
  instance: LoggerInstance<LogLevel>,
  namespace?: string,
): AppLogger {
  const fallback = createConsoleFallbackLogger(namespace);

  return {
    debug: instance.debug ?? fallback.debug,
    info: instance.info ?? fallback.info,
    warn: instance.warn ?? fallback.warn,
    error: instance.error ?? fallback.error,
    extend: (childNamespace: string) => {
      const nextNamespace = composeNamespace(namespace, childNamespace);
      return wrapReactNativeLogsInstance(
        instance.extend(childNamespace),
        nextNamespace,
      );
    },
  };
}

function createDevLogger(): AppLogger {
  const rootLogger = reactNativeLogs.createLogger({
    severity: "debug",
    transport: consoleTransport,
    transportOptions: {
      colors: DEV_TRANSPORT_COLORS,
    },
    async: true,
    dateFormat: "time",
    printLevel: true,
    printDate: true,
    enabled: true,
  });

  return wrapReactNativeLogsInstance(rootLogger);
}

const rootLogger: AppLogger = __DEV__ ? createDevLogger() : createNoopLogger();

export function createLogger(namespace: string): AppLogger {
  return rootLogger.extend(namespace);
}

export const logger: AppLogger = rootLogger;
