// components/CreateRepo.js
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';

const CreateRepo = () => {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/create-repo',
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${user.sub}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Repository Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create Repository</button>
    </form>
  );
};

export default CreateRepo;
