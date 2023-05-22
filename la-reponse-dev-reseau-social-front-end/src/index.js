import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { getConfig } from './config';
import { Auth0Provider } from '@auth0/auth0-react';
import history from './utils/history';

import App from './App';
import './index.css';

const container =
  document.getElementById('root') || document.createElement('div');
const root = createRoot(container);

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};
root.render(
  <Router>
    <Auth0Provider {...providerConfig}>
      <App />
    </Auth0Provider>
  </Router>
);
