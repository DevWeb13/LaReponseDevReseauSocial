import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

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

  const displayMessage = () => {
    alert(
      'Vous devez vérifier votre adresse e-mail avant de pouvoir ajouter une épingle'
    );
  };

  if (user._id === '') return null;
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center flex-1 px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm '>
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
          onFocus={() => navigate('/search')}
        />
      </div>
      <div className='flex gap-3'>
        <Link
          to={`user-profile/${user?._id}`}
          className='hidden md:block  flex-none'>
          <img
            src={user.image}
            alt='user'
            className='w-12 h-12 rounded-lg'
          />
        </Link>
        {user?.verifiedEmail ? (
          <Link
            to={`create-pin`}
            className='bg-[#145da0] text-white rounded-lg  p-3 h-12 flex justify-center items-center text-center gap-1.5 hover:bg-[#145DA0]'>
            <IoMdAdd fontSize={21} />
            Ajoutez
          </Link>
        ) : (
          <button
            onClick={displayMessage}
            className='bg-[#145da0] text-white rounded-lg  p-3 h-12 flex justify-center items-center text-center gap-1.5 hover:bg-[#145DA0]'>
            <IoMdAdd fontSize={21} />
            Ajoutez
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
