import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  userCreatedPinsQuery,
  userSavedPinsQuery,
  userQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2  rounded-full w-30 outline-none ';
const notActiveBtnStyles =
  'bg-primary  text-black font-bold p-2  rounded-full w-30 outline-none';

/**
 *
 * @param {object} props
 * @param {object} props.currentUser
 * @param {string} props.currentUser._id
 * @param {string} props.currentUser.userName
 * @param {string} props.currentUser.image
 * @param {string} props.currentUser.email
 * @param {boolean} props.currentUser.verifiedEmail
 * @returns {JSX.Element}
 */
const UserProfile = ({ currentUser }) => {
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Créée');
  const [activeBtn, setActiveBtn] = useState('créée');
  const [user, setUser] = useState(null);

  const { logout } = useAuth0();

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'Créée') {
      const createdPinsQuery = userCreatedPinsQuery(user?._id);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(user?._id);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, user?._id]);

  if (!user) {
    return <Spinner message='Chargement du profil' />;
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage}
              alt='banner-pic'
              className='w-full h-370 2xl:h510 shadow-lg object-cover'
            />
            <img
              src={user?.image}
              alt='user-pic'
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user?.userName}
            </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              <AiOutlineLogout
                onClick={() => logout()}
                fontSize={30}
                className='cursor-pointer text-alert/50 hover:text-alert transition-all duration-300 ease-in-out'
              />
            </div>
          </div>

          <div className='text-center mb-7'>
            <button
              type='button'
              className={`${
                activeBtn === 'créée' ? activeBtnStyles : notActiveBtnStyles
              }`}
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('créée');
              }}>
              Créée
            </button>
            <button
              type='button'
              className={`${
                activeBtn === 'sauvegardée'
                  ? activeBtnStyles
                  : notActiveBtnStyles
              }`}
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('sauvegardée');
              }}>
              Sauvegardée
            </button>
          </div>

          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout
                pins={pins}
                user={currentUser}
              />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              Pas d'épingles trouvées
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
