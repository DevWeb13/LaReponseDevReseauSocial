import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
/**
 *
 * @param {object} props
 * @param {string} props.searchTerm - The search term
 * @param {function} props.setSearchTerm - The search term setter
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @param {string} props.user.email
 * @param {boolean} props.user.verifiedEmail
 * @returns  {JSX.Element | null}
 */
const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const displayMessage = () => {
    alert(
      'Vous devez vérifier votre adresse e-mail avant de pouvoir ajouter une épingle'
    );
  };

  /**
   * Check if the user is authenticated and if their email is verified
   * Returns the appropriate JSX.Element based on the user's authentication status
   * @param {boolean} isAuthenticated - The authentication status
   * @param {object} user - The user object
   * @returns  {JSX.Element}
   */
  function checkBtCreatePin(isAuthenticated, user) {
    const buttonProps = {
      className:
        'bg-[#145da0] text-white rounded-lg p-3 h-12 flex justify-center items-center text-center gap-1.5 shadow-md shadow-[#00b0dc] hover:shadow-none transition-all duration-150 ease-in',
      children: (
        <>
          <IoMdAdd fontSize={21} />
          {window.innerWidth <= 768 ? 'Postez' : 'Postez une épingle'}
        </>
      ),
    };

    if (isAuthenticated && user.verifiedEmail) {
      return (
        <Link
          to='create-pin'
          {...buttonProps}
        />
      );
    } else if (isAuthenticated && !user.verifiedEmail) {
      return (
        <button
          onClick={displayMessage}
          {...buttonProps}
        />
      );
    }

    return (
      <LoginButton>
        <div {...buttonProps} />
      </LoginButton>
    );
  }
  console.log({ user });

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center flex-1 px-2 rounded-md bg-white border-none  outline-none shadow shadow-[#00b0dc] hover:shadow-lg hover:shadow-[#00b0dc] focus-within:shadow-md   focus-within:shadow-[#00b0dc] '>
        <IoMdSearch
          fontSize={25}
          className='ml-1 fill-[#145DA0]'
        />
        <input
          type='text'
          placeholder='Recherche'
          className='w-full p-2 bg-white outline-none'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={
            isAuthenticated
              ? () => navigate('/search')
              : () => loginWithRedirect()
          }
        />
      </div>
      <div className='flex gap-3'>
        {isAuthenticated && (
          <Link
            to={`user-profile/${user?._id}`}
            className='hidden md:block  flex-none shadow-md shadow-[#00b0dc]  hover:shadow-none rounded-full'>
            <img
              src={user.image}
              alt='user'
              className='w-12 h-12 rounded-full'
            />
          </Link>
        )}
        {checkBtCreatePin(isAuthenticated, user)}
      </div>
    </div>
  );
};

export default Navbar;
