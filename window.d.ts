import { AppProps } from './src/components/App';

declare global {
  interface Window {
    __APP_INITIAL_COMMITS__: any;
    __APP_INITIAL_INTRODUCTION__: any;
    __APP_INITIAL_CONTENT__: any;
    __APP_INITIAL_DIFFITEM__: any;
  }
}
