import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

/**
 *
 * @param {object} props
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @returns  {JSX.Element}
 */
const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const uploadImage = (e) => {
    e.preventDefault();
    const { type, name } = e.target.files[0];
    if (
      type === 'image/png' ||
      type === 'image/jpeg' ||
      type === 'image/jpg' ||
      type === 'image/gif' ||
      type === 'image/svg' ||
      type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          console.log('Image téléchargée avec succès', document);
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Erreur de téléchargement d'image", err);
          setLoading(false);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { type, name } = e.dataTransfer.files[0];
    if (
      type === 'image/png' ||
      type === 'image/jpeg' ||
      type === 'image/jpg' ||
      type === 'image/gif' ||
      type === 'image/svg' ||
      type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', e.dataTransfer.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          console.log('Image téléchargée avec succès', document);
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Erreur de téléchargement d'image", err);
          setLoading(false);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && category && imageAsset?._id) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        navigate('/');
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
          Veuillez remplir tout les champs.
        </p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner message={null} />}
            {wrongImageType && <p>Mauvais type d'image</p>}
            {!imageAsset ? (
              <label
                className='h-full   '
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>
                      Cliquez ou glissez-déposez votre image ici
                    </p>
                  </div>
                  <p className='mt-32 text-gray-400 text-center'>
                    Utilisez des fichiers JPG, SVG, PNG, GIF de haute qualité de
                    moins de 20 Mo
                  </p>
                </div>
                <input
                  type='file'
                  name='upload-image'
                  className=' absolute top-0 left-0 opacity-0'
                  onChange={uploadImage}
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img
                  src={imageAsset?.url}
                  alt='uploaded-pic'
                  className='h-full w-full object-cover'
                />
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}>
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Ajoutez votre titre ici'
            className=' outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          {user && (
            <div className='flex  gap-2 my-2 items-center bg-white rounded-lg'>
              <img
                src={user.image}
                alt='user-profile'
                className='h-10 w-10 rounded-full'
              />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}
          <input
            type='text'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='Ajoutez votre description ici'
            className=' outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2'
          />
          <input
            type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Ajouter un lien de destination'
            className=' outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col'>
            <div>
              <p className='text-lg font-semibold mb-2 sm:text-xl'>
                Choisissez la catégorie
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
                <option
                  value='other'
                  className='bg-white'>
                  Choisissez une catégorie
                </option>
                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className='text-base border-0 outline-none capitalize bg-white text-black'>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                type='button'
                onClick={savePin}
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
