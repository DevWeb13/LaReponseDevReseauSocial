import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

/**
 *
 * @param {object} props
 * @param {object} props.user
 * @param {string} props.user._id
 * @param {string} props.user.userName
 * @param {string} props.user.image
 * @param {string} props.user.email
 * @param {boolean} props.user.verifiedEmail
 * @returns {JSX.Element}
 */
const Feed = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((res) => {
        setPins(res);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((res) => {
        setPins(res);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return (
      <Spinner message='Nous ajoutons de nouvelles idées à votre flux !' />
    );
  }

  if (!pins?.length) {
    return <h2>Il n'y a pas d'épingles disponibles</h2>;
  }

  return (
    <div>
      {pins && (
        <MasonryLayout
          pins={pins}
          user={user}
        />
      )}
    </div>
  );
};

export default Feed;
