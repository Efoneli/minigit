// import {
//   withApiAuthRequired,
//   getAccessToken,
//   getSession,
// } from "@auth0/nextjs-auth0";
// import axios from "axios";
// import { NextResponse, NextRequest } from "next/server";

// const GET = withApiAuthRequired(async (req, res) => {

//   const session = await getSession(req, res);

//   console.log(session, "this is session");

//   if (!session) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }

//   const githubAccessToken = session.accessToken;

//   const user = session.user;

//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const accessToken = searchParams.get("accessToken");

//     const data = await axios.get(
//       `https://api.github.com/users/${user.nickname}/repos`,
//       {
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//           Authorization: `Bearer ${accessToken}`,
//           accept: "application/vnd.github+json",
//         },
//         data: {
//           user: "Ov23liBWDEp78taeUgZO:3ab403608e7c98008d56307e041d33cbe0c0e2dc",
//           data: {
//             access_token: accessToken,
//           },
//         },
//       }
//     );

//     console.log(data);
//     return NextResponse.json({ data: data.data });
//   } catch (error) {
//     console.error(
//       "Error fetching repos:",
//       error.response ? error.response.data : error.message
//     );
//     console.log(error);
//     return NextResponse.json({ error });
//   }
// });

// export { GET };



import {
  withApiAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const GET = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  console.log(session, "this is session");

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const githubAccessToken = session.accessToken;
  const user = session.user;

  try {
    // Get the full URL from the request headers to handle dynamic base URL
    const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
    const fullUrl = new URL(req.url!, baseUrl);
    const searchParams = fullUrl.searchParams;
    const accessToken = searchParams.get("accessToken");

    const data = await axios.get(
      `https://api.github.com/users/${user.nickname}/repos`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${accessToken}`,
          accept: "application/vnd.github+json",
        },
        data: {
          user: "Ov23liBWDEp78taeUgZO:3ab403608e7c98008d56307e041d33cbe0c0e2dc",
          data: {
            access_token: accessToken,
          },
        },
      }
    );

    console.log(data);
    return res.status(200).json({ data: data.data });
  } catch (error) {
    const err = error as any;
    console.error(
      "Error fetching repos:",
      err.response ? err.response.data : err.message
    );
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

export { GET };
