import { consoleTransport, logger as nativeLog } from 'react-native-logs';

export const logger = nativeLog.createLogger({
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
});
