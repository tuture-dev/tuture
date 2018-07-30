import { AppProps } from './src/components/App';

declare global {
  interface Window {
    __APP_INITIAL_PROPS__: string;
  }
}
