import React from 'react';
import Home from './container/Home';
import { useAuth0 } from '@auth0/auth0-react';
import Spinner from './components/Spinner';

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Spinner message='Chargement' />;
  }
  return <Home />;
};

export default App;
