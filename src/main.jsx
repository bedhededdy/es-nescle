import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Module from "./core/a.out.js";

new Module().then(module => {
  window.emuModule = module;
  window.emulator = new module.ESEmu();
  window.lastRenderTime = Date.now();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});
