import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';

import logo from '../assets/logo.png';

import { categories } from '../utils/data';

const isNotActiveStyle =
  'flex px-5 gap-3 items-center hover:text-[#145DA0] hover:font-bold transition-all duration-200 ease-in-out capitalize';

const isActiveStyle =
  'flex px-5 gap-3 items-center font-extrabold border-r-2 border-[#145DA0]  transition-all duration-200 ease-in-out capitalize text-[#145DA0]';

/**
 *
 * @param {object} props
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @param {string} props.user.email
 * @param {boolean} props.user.verifiedEmail
 * @param {function | null} props.closeToggle
 * @returns
 */
const Sidebar = ({ user, closeToggle }) => {
  const { isAuthenticated } = useAuth0();
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className='flex flex-col justify-between bg-white h-screen overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col h-screen justify-around p-4'>
        <Link
          to='/'
          className='flex px-5 gap-2  pt-1 w-190 items-center'
          onClick={handleCloseSidebar}>
          <img
            src={logo}
            alt='logo'
            className='w-full'
          />
        </Link>
        <div className='flex flex-col flex-1  mb-10 justify-around'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}>
            <RiHomeFill />
            Accueil
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl text-[#145DA0] font-semibold'>
            Catégories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              key={category.name}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}>
              <img
                src={category.image}
                alt='category'
                className='w-8 h-8 rounded-full shadow-sm'
              />
              {category.name}
            </NavLink>
          ))}
        </div>

        {isAuthenticated ? (
          <NavLink
            to={`user-profile/${user._id}`}
            className='bg-[#145da0] text-white rounded-lg  p-3 h-12 flex justify-center items-center text-center gap-1.5 shadow-md shadow-[#00b0dc]  hover:shadow-none'
            onClick={handleCloseSidebar}>
            <img
              src={user.image}
              alt='user-profile'
              className='w-8 h-8 rounded-full'
            />
            {user.userName}
            <IoIosArrowForward />
          </NavLink>
        ) : (
          <LoginButton>
            <div className='bg-[#145da0] text-white rounded-lg  p-3 h-12 flex justify-center items-center text-center gap-1.5 shadow-md shadow-[#00b0dc]  hover:shadow-none'>
              Se connecter
              <IoIosArrowForward />
            </div>
          </LoginButton>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
