import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
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

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Créée');
  const [activeBtn, setActiveBtn] = useState('créée');

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'Créée') {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

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
              {userId === user?._id && (
                <AiOutlineLogout
                  color='red'
                  fontSize={30}
                  className='cursor-pointer bg-white rounded-full p-1 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out'
                  onClick={() => {
                    // delete the token from the local storage
                    localStorage.removeItem('user');
                    googleLogout();
                    navigate('/login');
                  }}
                />
              )}
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
              <MasonryLayout pins={pins} />
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
