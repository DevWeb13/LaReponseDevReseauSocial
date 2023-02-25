import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './index.css';

const container =
  document.getElementById('root') || document.createElement('div');
const root = createRoot(container);
root.render(
  <Router>
    <App />
  </Router>
);
