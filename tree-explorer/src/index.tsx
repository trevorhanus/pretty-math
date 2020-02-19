import * as React from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { App } from './App';

require('./style/style.scss');

ReactDOMRender(<App />, document.getElementById('app'));
