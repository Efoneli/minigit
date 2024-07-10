"use client";
import React from "react";

const Integrations = () => {
  const IntegrateGithub = () => {
    const url = `https://github.com/login/oauth/authorize?client_id=${"Ov23liBWDEp78taeUgZO"}&redirect_uri=${"http://localhost:3000/integrations/github"}&scope=user,repo,admin:repo_hook&response_type=code`;
    window.open(url, "_blank");
  };
  return (
    <div className="h-[100vh] w-full flex justify-center items-center">
      <button
        className="bg-blue-500 px-5 py-2 rounded-md text-white hover:bg-black"
        onClick={IntegrateGithub}
      >
        Login Github
      </button>
    </div>
  );
};

export default Integrations;
