import { AppProps } from './src/components/App';

declare global {
  interface Window {
    __APP_INITIAL_TUTURE__: any;
    __APP_INITIAL_DIFF__: any;
  }
}
