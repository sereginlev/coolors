import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { HashRouter } from 'react-router-dom';
import './scss/index.scss';
import 'react-tooltip/dist/react-tooltip.css';

const elem = document.getElementById('root');

if (elem) {
	const root = ReactDOM.createRoot(elem);

	root.render(
		<React.StrictMode>
			<HashRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</HashRouter>
		</React.StrictMode>
	);
}