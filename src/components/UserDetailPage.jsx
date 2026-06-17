import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchUserProfile, fetchUserRepos } from "../services/githubService";
import RepoItem from "./RepoItem";
import ProfileCard from "./ProfileCard";

const UserDetailPage = () => {
  //Extract the dynamic URL parameter (the username)
  const { username } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (user) => {
    setIsLoading(true);
    setError(null);

    try {
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
  }, []);

  useEffect(() => {
    if (username) {
      fetchData(username);
    }
  }, [username, fetchData]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">
          Loading user profile and repositories for {username}...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <ProfileCard profile={userProfile} />

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
