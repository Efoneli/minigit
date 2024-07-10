'use client'
// components/Repositories.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';

const Repositories = () => {
  const { user, isLoading } = useUser();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/repos');
          console.log('Fetched Repos:', response.data);
          setRepos(response.data);
        } catch (error) {
          console.error('Error fetching repos:', error);
        }
      }
    };

    fetchRepos();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Repositories</h2>
      <ul>
        {repos?.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Repositories;
