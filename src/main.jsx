import { configure } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

setTimeout(() =>
	configure({
		enforceActions: 'never',
		reactionScheduler: (f) => setTimeout(f),
	}),
);

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<App />,
	// </React.StrictMode>
);
