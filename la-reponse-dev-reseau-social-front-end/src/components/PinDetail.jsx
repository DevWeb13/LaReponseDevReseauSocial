import React, { useState, useEffect, useCallback } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

/**
 *
 * @param {object} props
 * @param {object} props.user - user object
 * @param {string} props.user._id - user id
 * @returns {JSX.Element}
 */
const PinDetail = ({ user: { _id } }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetails = useCallback(() => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  }, [pinId]);

  const addComment = () => {
    if (comment && pinId) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: _id,
            },
            comment,
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [fetchPinDetails]);

  if (!pinDetail) return <Spinner message='Chargement' />;

  return (
    <>
      <div
        className='flex xl-flex-row flex-col m-auto bg-white'
        style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className='rounded-t-3xl rounded-b-lg'
            alt='user-post'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetail.destination}
              target='_blank'
              rel='noreferrer'>
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetail.title}
            </h1>
            <p className=' mt-3'>{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img
              className='w-8 h-8 rounded-full object-cover'
              src={pinDetail.postedBy?.image}
              alt='user-profile'
            />
            <p className='capitalize font-semibold '>
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className='mt-5 text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetail?.comments?.map((comment, i) => (
              <div
                key={uuidv4()}
                className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                <img
                  className='w-10 h-10 rounded-full cursor-pointer'
                  src={comment.postedBy?.image}
                  alt='user-profile'
                />
                <div className='flex flex-col'>
                  <p className='font-bold '>{comment.postedBy?.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
              <img
                className='w-10 h-10 rounded-full cursor-pointer'
                src={pinDetail.postedBy?.image}
                alt='user-profile'
              />
            </Link>
            <input
              type='text'
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              placeholder='Ajoutez un commentaire...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white p-2 rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}>
              {addingComment
                ? 'Ajout du commentaire...'
                : 'Ajoutez un commentaire'}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            Autres épingles similaires
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Chargement d'autres épingles..." />
      )}
    </>
  );
};

export default PinDetail;
