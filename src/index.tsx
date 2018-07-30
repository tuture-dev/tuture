/* tslint:disable-next-line */
import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

const initialProps = window.__APP_INITIAL_PROPS__;
render(<App />, document.getElementById('root'));
