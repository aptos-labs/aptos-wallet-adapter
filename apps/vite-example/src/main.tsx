// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppContext } from './components/AppContext';

// order matters
import "./styles/global.css";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContext>
      <App />
    </AppContext>
  </React.StrictMode>,
);
