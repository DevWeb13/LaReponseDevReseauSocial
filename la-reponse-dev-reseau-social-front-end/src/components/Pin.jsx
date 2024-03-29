import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { client, urlFor } from '../client';
import { useAuth0 } from '@auth0/auth0-react';

/**
 *
 * @param {object} props
 * @param {object} props.pin
 * @param {object} props.pin.postedBy
 * @param {string} props.pin.image
 * @param {string} props.pin._id
 * @param {string} props.pin.destination
 * @param {string} props.pin.save
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @param {string} props.user.email
 * @param {boolean} props.user.verifiedEmail
 * @returns  {JSX.Element}
 */
const Pin = ({ pin: { postedBy, image, _id, destination, save }, user }) => {
  const [postHovered, setPostHovered] = useState(false);

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth0();

  // L'opérateur !! (double négation) est un raccourci syntaxique utilisé pour convertir une valeur en un booléen.
  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?._id
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user?._id,
            postedBy: {
              _type: 'postedBy',
              _ref: user?._id,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  // Delete the save from the user's profile
  const unSavePin = (id) => {
    if (alreadySaved) {
      client
        .patch(id)
        .unset([`save[${save?.indexOf(user?._id)}]`])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className='m-2  rounded-lg  shadow shadow-[#145DA0] hover:shadow-none transition-all duration-150 ease-in'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto   overflow-hidden transition-all duration-500 ease-in-out  rounded-t-md  border border-[#145DA0]'>
        <img
          src={urlFor(image).width(250).url()}
          alt='user-post'
          className=' w-full'
        />
        {postHovered && isAuthenticated && user?.verifiedEmail && (
          <div
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50 '
            style={{ height: '100%' }}>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                  <MdDownloadForOffline className='h-8 w-8' />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type='button'
                  className='bg-[#145da0] text-white rounded-3xl px-5 py-1  flex justify-center items-center text-center gap-1.5 shadow-md shadow-[#00b0dc]  hover:shadow-none opacity-75 hover:opacity-100'
                  onClick={(e) => {
                    e.stopPropagation();
                    unSavePin(_id);
                  }}>
                  {save.length} Enregistré
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type='button'
                  className='bg-[#145da0] text-white rounded-3xl px-5 py-1  flex justify-center items-center text-center gap-1.5 shadow-md shadow-[#00b0dc]  hover:shadow-none opacity-75 hover:opacity-100'>
                  Sauvegarder
                </button>
              )}
            </div>
            <div className='flex justify-between items-center gap-2 w-full truncate'>
              {destination && (
                <a
                  href={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white  flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md   '>
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 10
                    ? `${destination.slice(0, 10)}...`
                    : destination}
                </a>
              )}
              {postedBy?._id === user?._id && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none'>
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`../../user-profile/${postedBy?._id}`}
        className='flex gap-2 items-center  border-t-0 p-1 rounded-b-md bg-white  border border-[#145DA0] '>
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy?.image}
          alt='user-profile'
        />
        <p className='capitalize  hover:text-[#145DA0] hover:font-semibold'>
          {postedBy?.userName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
