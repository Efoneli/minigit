// "use client";
// import React, { useEffect } from "react";
// import axios from "axios";
// import { useSearchParams, useRouter } from "next/navigation";
// import { getAccessToken } from '@auth0/nextjs-auth0';

// const GithubIntegrations = () => {

//   const handleSubmit = async (code: string) => {
//     try {
//       const response = await axios.post(`/api/github-access?code=${code}`)


//       const githubToken = response.data.accessToken.split('&')[0].split('=')[1] ;

//       console.log(response, 'from accesstoken')
//       console.log(githubToken, " github Token")
  
//       // Store the access token in local storage or session storage
//       localStorage.setItem("gitAccessToken", githubToken);
  
//       // Redirect to the next page
//       router.push("/");
//     } catch (error) {
//       console.log(error)
//     }
//   };

//   const params = useSearchParams();
//   const router = useRouter();
//   const code = params.get("code");
//   useEffect(() => {
//     handleSubmit(code as string);
//   }, [handleSubmit, code]);
//   return <div className="text-center">You are getting Logged in!</div>;
// };

// export default GithubIntegrations;



"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const GithubIntegrations: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    const handleSubmit = async (code: string) => {
      try {
        const response = await axios.post(`/api/github-access?code=${code}`);
        const githubToken = response.data.accessToken.split('&')[0].split('=')[1];

        console.log(response, 'from accesstoken');
        console.log(githubToken, "github Token");

        // Store the access token in local storage
        localStorage.setItem("gitAccessToken", githubToken);

        // Redirect to the next page
        router.push("/");
      } catch (error) {
        console.error("Error during GitHub token retrieval:", error);
      }
    };

    if (code) {
      handleSubmit(code);
    }
  }, [code, router]);

  return <div className="text-center">You are getting logged in!</div>;
};

export default GithubIntegrations;
