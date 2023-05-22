import React from 'react';
import Home from './container/Home';
import { useAuth0 } from '@auth0/auth0-react';
import Spinner from './components/Spinner';
import LoginButton from './components/LoginButton';

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Spinner message='Chargement' />;
  }
  return isAuthenticated ? (
    <Home />
  ) : (
    <LoginButton>
      <Home />
    </LoginButton>
  );
};

export default App;
