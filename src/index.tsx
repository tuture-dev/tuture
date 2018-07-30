/* tslint:disable-next-line */
import React from 'react';
import { render } from 'react-dom';

// @ts-ignore
import htmlEscaper from 'html-escaper';

function unescape(s: any) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

import App from './components/App';

const diff = window.__APP_INITIAL_DIFF__;
const tuture = window.__APP_INITIAL_TUTURE__;
render(
  <App
    tuture={unescape(JSON.stringify(tuture))}
    diff={unescape(JSON.stringify(diff))}
  />,
  document.getElementById('root'),
);
