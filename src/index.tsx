/* tslint:disable-next-line */
import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

function unescape(s: any) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

const commits = window.__APP_INITIAL_COMMITS__;
const introduction = window.__APP_INITIAL_INTRODUCTION__;
const content = window.__APP_INITIAL_CONTENT__;
const diffItem = window.__APP_INITIAL_DIFFITEM__;
delete window.__APP_INITIAL_COMMITS__;
delete window.__APP_INITIAL_INTRODUCTION__;
delete window.__APP_INITIAL_CONTENT__;
delete window.__APP_INITIAL_DIFFITEM__;

hydrate(
  <BrowserRouter>
    <App
      commits={unescape(JSON.stringify(commits))}
      introduction={unescape(JSON.stringify(introduction))}
      content={unescape(JSON.stringify(content))}
      diffItem={unescape(JSON.stringify(diffItem))}
    />
  </BrowserRouter>,
  document.getElementById('root'),
);
