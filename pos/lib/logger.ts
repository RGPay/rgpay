import { logger as log, consoleTransport } from 'react-native-logs';

// Global logger configuration
export const logger = log.createLogger({
  transport: consoleTransport,
  severity: __DEV__ ? 'debug' : 'error',
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'greenBright',
    },
  },
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
});
