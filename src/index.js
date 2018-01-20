import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var root = document.getElementById('frame')

ReactDOM.render(<App />, root);
registerServiceWorker();
