
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true);
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  // const clientId = ''

  // function loginWithGithub() {
  //   window.location.assign("https://github.com/lgoin/outh/authorize?client_id=" +)
  // }

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200">
        {!isLoading && !user && (
          <>
            <h1 className="text-4xl text-gray-900 sm:text-5xl md:text-6xl font-bold mb-4">
             MiniGit
            </h1>
            <div className="flex">
              <a
                href="/api/auth/login"
                className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                Sign In
              </a>
              {/* <Link
                href="/api/auth/signup"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Sign Up
              </Link> */}
            </div>
          </>
        )}
        {/* {user && (
                <>
                  <div className="my-4">
                    <Link href="/profile" className="text-blue-500 hover:underline" passHref>
                      Profile
                    </Link>
                    <Link href="/dashboard" className="text-blue-500 hover:underline" passHref>
                      Dashboard
                    </Link> 
                  </div>
                </>
        )} */}
      </div>
    </>
    
     
      
  );
}




// import React from 'react'

// export default function Home() {

//   window.location.assign

//   return (
//     <div>
//       <button>
//         Login with Github
//       </button>
//     </div>
//   )
// }
