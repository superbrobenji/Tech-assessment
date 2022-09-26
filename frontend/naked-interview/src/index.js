import React from 'react';
import { createRoot} from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './components/App';
import reducers from './reducers';

const store = configureStore({
    reducer: reducers,
    devTools: process.env.NODE_ENV !== 'production',
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
	<Provider store={store}>
		    <App />
	</Provider>,
);