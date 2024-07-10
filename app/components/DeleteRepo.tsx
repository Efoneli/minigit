// components/DeleteRepo.js
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';

const DeleteRepo = ({ owner, repo }) => {
  const { user } = useUser();

  const handleDelete = async () => {
    try {
      await axios.delete(
        '/api/delete-repo',
        {
          data: { owner, repo },
          headers: {
            Authorization: `Bearer ${user.sub}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteRepo;
