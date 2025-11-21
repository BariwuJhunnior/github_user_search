import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchUserProfile, fetchUserRepos } from "../services/githubService";

const RepoItem = ({ repo }) => (
  <div>
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
    >
      {repo.name}
    </a>

    <p className="text-gray-600 text-sm mt-1">
      {repo.description || "No description provided."}
    </p>
    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
      <span>{repo.stargazers_count}</span>
      <span>{repo.language}</span>
    </div>
  </div>
);

//Helper Component: Profile Card ----
const ProfileCard = ({ profile }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:space-x-8">
    <img
      src={profile.avartar_url}
      alt={`${profile.login}'s avatar`}
      className="w-32 h-32 rounded-full mb-4 md:mb-0 shadow-md"
    />
    <div>
      <h1 className="text-3xl font-extrabold text-gray-800">
        {profile.name || profile.login}
      </h1>
      <p className="text-xl text-blue-600 mb-3">{profile.login}</p>

      {profile.bio && (
        <p className="text-gray-700 italic mb-3">"{profile.bio}"</p>
      )}

      <div className="text-md text-gray-600 space-y-1">
        {profile.location && <p>{profile.location}</p>}
        <p>Public Repos: {profile.public_repos}</p>
        <p>Followers: {profile.followers}</p>
      </div>
      <a
        href={profile.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 tansition"
      >
        View on GitHub
      </a>
    </div>
  </div>
);

const UserDetailPage = () => {
  //Extract the dynamic URL parameter (the username)
  const { username } = useParams();

  //State management for the data and status
  const [userProfile, setUserProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Use useCallback to memoize the function, avoiding unneccessary re-renders
  const fetchData = useCallback(async (user) => {
    setIsLoading(true);
    setError(null);

    try {
      //Use Promise.all to fetch profile and repos simultaneiously
      const [profileData, reposData] = await Promise.all([
        fetchUserProfile(user),
        fetchUserRepos(user),
      ]);

      setUserProfile(profileData);
      setRepositories(reposData);
    } catch (error) {
      setError(error.message || "Failed to load user data.");
    } finally {
      setIsLoading(false);
    }
  }, []); //Empty dependency array means this function never changes

  useEffect(() => {
    if (username) {
      fetchData(username);
    }
  }, [username, fetchData]);

  //-- Conditional Rendering --
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">
          Loading user profileand repositories for {username}...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>{Error}</p>
      </div>
    );
  }

  // -- Final Success Display --
  return (
    <div className="p-8  space-y-8 bg-gray-50 min-h-screen">
      {/* 1. Profile Card */}
      <ProfileCard profile={userProfile} />

      {/* 2. Repositories List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">
          Top {repositories.length} Public Repositories
        </h2>
        <div className="divide-y divide-gray-100">
          {repositories.length > 0 ? (
            repositories.map((repo) => <RepoItem key={repo.id} repo={repo} />)
          ) : (
            <p className="text-gray-500">
              This user has no public repositories to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
