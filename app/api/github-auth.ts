
// // pages/api/github-auth.js

// import axios from 'axios';

// export default async function handler(req, res) {
//   const code = req.query.code;

//   if (!code) {
//     return res.status(400).send('Code is required');
//   }

//   try {
//     const response = await axios.post(
//       `https://github.com/login/oauth/access_token`,
//       {
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//       },
//       {
//         headers: {
//           Accept: 'application/json',
//         },
//       }
//     );

//     const { access_token } = response.data;
//     res.status(200).json({ access_token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }



// pages/api/github-auth.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('Code is required');
  }

  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = response.data;
    res.status(200).json({ access_token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
