import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = () => {
  return <Masonry className='flex animate-slide-fwd' bre></Masonry>;
};

export default MasonryLayout;
