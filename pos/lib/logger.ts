import { logger, consoleTransport } from 'react-native-logs';

// Global logger configuration
export const log = logger.createLogger({
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

// Create namespaced loggers for different parts of the app
export const authLog = log.extend('AUTH');
export const deviceLog = log.extend('DEVICE');
export const apiLog = log.extend('API');
export const uiLog = log.extend('UI');

// Export the main logger instance
export default log;
