import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  const createOrGetUser = async (credentialResponse) => {
    /** @type {{ name: string , picture: string, sub: string}} */
    const decoded = jwt_decode(credentialResponse.credential);

    localStorage.setItem('user', JSON.stringify(decoded));
    const { name, picture, sub } = decoded;
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then((res) => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className='flex flex-col items-center justify-start h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          typeof='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='object-cover w-full h-full'
        />
        <div className=' absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
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
