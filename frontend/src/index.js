import React from 'react';
import ReactDOM from 'react-dom';
import App from './views'
import registerServiceWorker from './registerServiceWorker';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
