import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/themes/lara-light-blue/theme.css'; // ✅ Importar un tema (Cambia según prefieras)
import 'primereact/resources/primereact.min.css'; // ✅ Estilos principales
import 'primeicons/primeicons.css'; // ✅ Iconos

const store = configureStore({ reducer: rootReducer, devTools: true });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={store}>
    <Toaster position="top-right" />
    <React.Fragment>
      <Router>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </Router>
    </React.Fragment>
  </Provider>,
);
