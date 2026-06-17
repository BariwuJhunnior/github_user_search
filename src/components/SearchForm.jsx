import { useState } from "react";

export default function SearchForm({ onSearch, isLoading = false }) {
  const initialSearchState = {
    keyword: "",
    location: "",
    repos: "",
  };

  const [formData, setFormData] = useState(initialSearchState);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.values(formData).some((value) => value.toString().trim())) {
      onSearch(formData);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
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
          <div className="md:col-span-2">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
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

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
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

          <div>
            <label htmlFor="repos" className="block text-sm font-medium text-gray-700">
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
