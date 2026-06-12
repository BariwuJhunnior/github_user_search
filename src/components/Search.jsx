import { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/githubService";

// --- Helper Component (kept inside for simplicity, still bad practice) ---
function UserCard({ user }) {
  if (!user) return null;

  const [followers, setFollowers] = useState(
    typeof user.followers === "number" ? user.followers : null,
  );

  useEffect(() => {
    let mounted = true;
    if (followers === null) {
      fetchUserProfile(user.login)
        .then((data) => {
          if (mounted && typeof data.followers === "number") {
            setFollowers(data.followers);
          }
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [user.login, followers]);

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-blue-600">{user.login}</h3>
          <p className="text-sm text-gray-500">
            Followers: {followers !== null ? followers : "—"}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          View Full Profile →
        </a>
      </div>
    </div>
  );
}

{
  /* Search Page Components */
}
export function SearchPage({
  users,
  isLoading,
  error,
  handleSearch,
  totalCount,
  handleLoadMore,
}) {
  const topUser = users?.length > 0 ? users[0] : null;

  //Renders the list of UserCard components
  const userList = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );

  //Results section
  let content;

  if (isLoading && users.length === 0) {
    content = <p className="text-center text-lg mt-8">Loading...</p>;
  } else if (error) {
    content = <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  } else if (users.length > 0) {
    content = userList;
  } else if (!isLoading && totalCount === 0) {
    content = (
      <p className="text-center text-gray-500 mt-8">
        No users found matching your criteria.
      </p>
    );
  } else {
    content = (
      <p className="text-center text-gray-500 mt-8">
        Start your advanced search above!
      </p>
    );
  }

  const showLoadMore = users.length > 0 && users.length < totalCount;

  return (
    <>
      <Search onSearch={handleSearch} isLoading={isLoading} />

      <main className="results-container p-4">
        {topUser && (
          <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <img
              src={topUser.avatar_url}
              alt={`${topUser.login} avatar`}
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <p className="text-sm text-gray-500">Top result</p>
              <a
                href={topUser.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {topUser.login}
              </a>
            </div>
          </div>
        )}

        {users.length > 0 && (
          <h2 className="text-xl font-bold mb-4">
            Found {totalCount} users. Displaying {users.length}.
          </h2>
        )}

        {content}

        {/* Load More Button  */}
        {showLoadMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-150 disabled:bg-gray-400"
            >
              {isLoading ? "Loading More..." : "Load More Users"}
            </button>
          </div>
        )}
      </main>
    </>
  );
}

function Search({ onSearch, isLoading }) {
  const initialSearchState = {
    keyword: "",
    location: "",
    repos: "",
  };

  const [formData, setFormData] = useState(initialSearchState);

  //Form Submission Handler
  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.values(formData).some((val) => val.trim())) {
      onSearch(formData);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="search-app-container">
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-100 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword/Username Input */}
          <div className="md:col-span-2">
            <label
              htmlFor="keyword"
              className="block text-sm font-medium text-gray-700"
            >
              Keyword / Username
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="e.g., react, javascript, octocat"
              value={formData.keyword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Location Input */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., London, New York"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Min Repositories Input */}
          <div>
            <label
              htmlFor="repos"
              className="block text-sm font-medium text-gray-700"
            >
              Min Repositories
            </label>
            <input
              type="number"
              id="repos"
              name="repos"
              placeholder="e.g., 10"
              value={formData.repos}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 md:mt-0 md:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-150 disabled:bg-gray-400"
          >
            {isLoading ? "Searching..." : "Search GitHub Users"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Search;
