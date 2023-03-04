import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import jwt_decode from 'jwt-decode';

import { client } from '../client';

const randomImage =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';

const Login = () => {
  const navigate = useNavigate();
  const createOrGetUser = async (credentialResponse) => {
    /** @type {{ name: string , picture: string, sub: string, email: string}} */
    const decoded = jwt_decode(credentialResponse.credential);

    localStorage.setItem('user', JSON.stringify(decoded));
    const { name, picture, sub, email } = decoded;
    console.log(email);
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
      email: email,
    };

    client.createOrReplace(doc).then((res) => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className='flex flex-col items-center justify-start h-screen'>
      <div className='relative w-full h-full'>
        <img
          src={randomImage}
          alt='random-pic'
          className='w-full h-full'
        />
        <div className=' absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay '>
          <div className='p-5 m-5  bg-black/50 rounded-full'>
            <img
              src={logo}
              alt='logo'
              width='130px'
            />
          </div>
          <div className='shadow-2x1'>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                createOrGetUser(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
