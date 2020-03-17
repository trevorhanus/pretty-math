import * as React from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { App } from './App';
import { App2 } from './App2';

ReactDOMRender(<App2 />, document.getElementById('app'));
