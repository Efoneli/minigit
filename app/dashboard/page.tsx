"use client";
import Header from "../components/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Repo {
  id: number;
  name: string;
  description: string | null;
}

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateRepoName, setUpdateRepoName] = useState("");
  const [updateRepoDescription, setUpdateRepoDescription] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const IntegrateGithub = () => {
    const url =
      "https://github.com/login/oauth/authorize?client_id=Ov23liBWDEp78taeUgZO&redirect_uri=http://localhost:3000/integrations/github&scope=user,repo,admin:repo_hook&response_type=code";
    window.location.assign(url, "blank");
  };

  useEffect(() => {
    if (!localStorage.getItem("gitAccessToken")) {
      IntegrateGithub();
    }
  }, []);

  useEffect(() => {
    async function fetchRepos() {
      setLoadingRepos(true);
      try {
        const response = await axios.get(
          `/api/repos?accessToken=${localStorage.getItem("gitAccessToken")}`
        );
        setRepos(response.data.data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoadingRepos(false);
      }
    }

  if (user) {
      fetchRepos();
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.github.com/user/repos", {
        name: newRepoName,
        description: newRepoDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gitAccessToken")}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

      setRepos([response.data, ...repos]);
      setNewRepoName("");
      setNewRepoDescription("");
      toast.success('Repo created successfully')
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating repo:", error);
      toast.error(error.response.data.message)
    }
  };

  const handleUpdateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    try {
      const response = await axios.patch(
        `https://api.github.com/repos/${user?.nickname}/${selectedRepo.name}`,
        {
          name: updateRepoName,
          description: updateRepoDescription,
          // other fields as needed
        },
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${localStorage.getItem("gitAccessToken")}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      const updatedRepos = repos.map((repo) =>
        repo.id === selectedRepo.id
          ? { ...repo, name: updateRepoName, description: updateRepoDescription }
          : repo
      );
      console.log(response, 'res from edit')
      setRepos(updatedRepos);
      toast.success('Repo updated successfully')
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating repo:", error);
      toast.error(error.response.data.message)
    }
  };

  const handleDeleteRepo = async (owner, repo) => {
    try {
      await axios.delete(`https://api.github.com/repos/${owner}/${repo}`, {
        data: { owner, repo },
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${localStorage.getItem("gitAccessToken")}`,
          "X-GitHub-Api-Version": "2022-11-28",
          },
      },
    );
      setRepos(repos.filter((r) => r.name !== repo));
      toast.success('Repo deleted successfully')
    } catch (error) {
      console.log("Error deleting repo:", error.response.data);
      toast.error(error.response.data.message)
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleUpdateModal = (repo: Repo) => {
    setSelectedRepo(repo);
    setUpdateRepoName(repo.name);
    setUpdateRepoDescription(repo.description || "");
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center"><LoadingSvg /></div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto p-4">

        <div className="flex items-end justify-end">
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mb-4"
          onClick={toggleModal}
        >
          New
        </button>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Your existing Repositories
            </h2>
            {loadingRepos ? (
              <div className="text-center"><LoadingSvg /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {repos?.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-white hover:bg-slate-200 p-4 shadow rounded flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-gray-700 text-xl font-bold mb-2">
                        {repo.name}
                      </h3>
                      <p className="text-gray-700 mb-4">{repo.description}</p>
                    </div>
                    <div className="flex justify-between mt-auto github">
                      <button
                        className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-2 rounded"
                        onClick={() =>
                          router.push(
                            `https://github.com/${user?.nickname}/${repo.name}`
                          )
                        }
                      >
                        <FaGithub />
                      </button>
                      <div className="flex justify-end github">
                        <button
                          className=" text-gray-700 px-2 py-2 rounded"
                          onClick={() => toggleUpdateModal(repo)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className=" text-gray-700 ml-2 px-2 py-2 rounded"
                          onClick={() => handleDeleteRepo(user?.nickname, repo.name)}
                        >
                          <RiDeleteBin5Line />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <div className="flex justify-end">
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={toggleModal}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateRepo}>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Repository Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 text-gray-600 rounded"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Description</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 text-gray-600 rounded"
                    value={newRepoDescription}
                    onChange={(e) => setNewRepoDescription(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
                >
                  Create Repository
                </button>
              </form>
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <div className="flex justify-end">
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateRepo}>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Repository Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 text-gray-600 rounded"
                    value={updateRepoName}
                    onChange={(e) => setUpdateRepoName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 text-gray-700">Description</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 text-gray-600 rounded"
                    value={updateRepoDescription}
                    onChange={(e) => setUpdateRepoDescription(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update Repository
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Dashboard;




function LoadingSvg() {
  return (
    <div className="flex justify-center items-center h-screen">
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
  )
}
