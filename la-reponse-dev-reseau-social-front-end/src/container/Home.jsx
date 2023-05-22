import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Route, Routes, Link } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { client } from '../client';
// @ts-ignore
import logo from '../assets/logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import { formatNickname, cleanerSub } from '../utils/stringManager';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    _id: '',
    userName: '',
    image: '',
    email: '',
    verifiedEmail: false,
  });

  /** @type {{current: object}} */
  const scrollRef = useRef(null);

  /**
   * @typedef {Object} Auth0User
   * @property {string} sub
   * @property {string} nickname
   * @property {string} picture
   * @property {string} email
   * @property {boolean} email_verified
   */
  const { user } = useAuth0();

  /**
   * @param {user} user
   * @returns {Promise<void>}
   */
  const createOrGetUser = async (user) => {
    if (!user) return;
    let cleanSub = cleanerSub(user.sub);
    const doc = {
      _id: cleanSub,
      _type: 'user',
      userName: formatNickname(user.nickname),
      image: user.picture || '',
      email: user.email || '',
      verifiedEmail: user.email_verified || false,
    };
    setCurrentUser(doc);
    client.createOrReplace(doc);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      createOrGetUser(user);
    }
  }, [user]);

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen w-screen transaction-height duration-75 ease-out font-display'>
      <div className='hidden md:flex h-screen flex-initial '>
        <Sidebar
          user={currentUser}
          closeToggle={null}
        />
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu
            fontSize={40}
            className='cursor-pointer'
            onClick={() => setToggleSidebar(true)}
          />
          <Link to='/'>
            <img
              src={logo}
              alt='logo'
              className='w-28'
            />
          </Link>
          <Link to={`user-profile/${currentUser?._id}`}>
            <img
              src={currentUser?.image}
              alt='logo'
              className='w-28'
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle
                fontSize={30}
                className='cursor-pointer'
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar
              user={currentUser}
              closeToggle={setToggleSidebar}
            />
          </div>
        )}
      </div>
      <div
        className='pb-2 flex-1 h-screen overflow-y-scroll'
        ref={scrollRef}>
        <Routes>
          <Route
            path='/user-profile/:userId'
            element={<UserProfile currentUser={currentUser} />}
          />
          <Route
            path='/*'
            element={<Pins user={currentUser} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
