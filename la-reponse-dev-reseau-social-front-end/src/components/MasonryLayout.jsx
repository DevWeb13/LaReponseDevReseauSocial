import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1600: 4,
  1200: 3,
  1000: 2,
  500: 1,
};

/**
 *
 * @param {object} props
 * @param {object[]} props.pins
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @param {string} props.user.email
 * @param {boolean} props.user.verifiedEmail
 * @returns {JSX.Element}
 */
const MasonryLayout = ({ pins, user }) => {
  return (
    <Masonry
      className='flex animate-slide-fwd'
      breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Pin
          key={pin._id}
          pin={pin}
          user={user}
          className='w-max'
        />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
