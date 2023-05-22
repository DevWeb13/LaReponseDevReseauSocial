import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Spinner from '../components/Spinner';

import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components';

/**
 *
 * @param {object} props
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @param {string} props.user.email
 * @param {boolean} props.user.verifiedEmail
 * @returns {JSX.Element}
 */
const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='px-2 md:px-5 flex flex-col h-full'>
      <div className='bg-gray-50'>
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className='flex-1'>
        <Routes>
          <Route
            path='/'
            element={<Feed user={user} />}
          />
          <Route
            path='/category/:categoryId'
            element={<Feed user={user} />}
          />
          <Route
            path='/pin-detail/:pinId'
            element={<PinDetail user={user} />}
          />
          <Route
            path='/create-pin'
            element={<CreatePin user={user} />}
          />
          <Route
            path='/search'
            element={
              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;

// export default withAuthenticationRequired(Pins, {
//   onRedirecting: () => <Spinner message='Chargement' />,
// });
