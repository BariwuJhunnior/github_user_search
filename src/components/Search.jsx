import { useState } from "react";
import axios from "axios";

// Access the environment variable (must be done in this file now)
const GITHUB_API_BASE_URL = import.meta.env.VITE_APP_GITHUB_API_BASE_URL;

// --- Helper Component (kept inside for simplicity, still bad practice) ---
function UserCard({ user }) {
  if (!user) return null;

  // Display logic is contained right here
  return (
    <div
      key={user.id}
      className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200"
    >
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-blue-600">{user.login}</h3>
          <p className="text-sm text-gray-500">
            Score: {user.score.toFixed(2)}
          </p>
        </div>
      </div>

      {/* We need another API call to get 'location' and 'public_repos' 
          since the search API only returns summary data. 
          For now, we'll display the login and link. 
          The next assignment can focus on 'fetching full profile'.
      */}
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
  //Renders the list of UserCard components
  const userList = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );

  //Conditional rendering logic for results section
  let content;

  if (isLoading && users.length === 0) {
    content = <p className="text-center text-lg mt-8">Loading...</p>;
  } else if (error) {
    content = <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  } else if (users.length > 0) {
    content = userList;
  } else if (!isLoading && totalCount === 0) {
    //Only show this if a search has been attempted(i.e., totalCount is 0 after a search)
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

  //Determine if the "Load More" button should be visible
  const showLoadMore = users.length > 0 && users.length < totalCount;

  return (
    <>
      <Search onSearch={handleSearch} />

      <main className="results-container p-4">
        {users.length > 0 && (
          <h2 className="text-xl font-bold mb-4">
            Found {totalCount} users. Displaying {users.length}.
          </h2>
        )}

        {content}

        {/* Load More Button Logic */}
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

// ----------------------------------------------------------------------
// THE MAIN COMPONENT HANDLING EVERYTHING
// ----------------------------------------------------------------------

function Search() {
  const initialSearchState = {
    keyword: "",
    location: "",
    repos: "",
  };

  const [formData, setFormData] = useState(initialSearchState);

  // 1. State for the input field (Search's responsibility)
  const [searchTerm, setSearchTerm] = useState("");

  // 2. State for the API response (App's original responsibility)
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. API Call Logic (githubService's original responsibility)
  const fetchUserData = async (username) => {
    setError(null);
    setIsLoading(true);
    setUser(null);

    const url = `${GITHUB_API_BASE_URL}/users/${username}`;

    try {
      const response = await axios.get(url);
      setUser(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Looks like we cant find the user.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Form Submission Handler (Search's original responsibility)
  const handleSubmit = (event) => {
    event.preventDefault();

    // Pass the entire state object to the parent's search handler
    // Only search if at least one field is filled
    if (Object.values(formData).some((val) => val.trim())) {
      fetchUserData(formData);
    }
  };

  // 5. Conditional Rendering Logic (SearchPage's original responsibility)
  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p style={{ color: "red" }}>{error}</p>;
  } else if (user) {
    content = <UserCard user={user} />;
  } else {
    content = <p>Start searching for a GitHub user!</p>;
  }

  // Universal handler for all inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 6. The return statement combines the form and the display area
  return (
    <div className="search-app-container">
      {/* Input Form */}
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

        {/* Submit Button (Full width on small screens, grouped on large) */}
        <div className="mt-4 md:mt-0 md:col-span-4 flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-150"
          >
            Search GitHub Users
          </button>
        </div>
      </form>

      {/* Results Display */}
      <main className="results-container">
        <h2>Search Result</h2>
        {content}
      </main>
    </div>
  );
}

export default Search;
