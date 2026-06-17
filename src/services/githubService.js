import axios from "axios";

const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL || "https://api.github.com";

export const fetchUserProfile = async (username) => {
  const url = `${GITHUB_BASE_URL}/users/${username}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    //404 for a user profile not found
    if (error.response && error.response.status === 404) {
      throw new Error(`Profile for user '${username}' not found.`);
    }
    throw new Error("Failed to fetch user profile.");
  }
};

export const fetchUserRepos = async (username) => {
  const url = `${GITHUB_BASE_URL}/users/${username}/repos`;

  try {
    const response = await axios.get(url, {
      params: {
        per_page: 10,
        sort: "updated",
        direction: "desc", //Most recently updated first
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user repositories. ${error}`);
  }
};

const buildAdvancedQuery = (params = {}) => {
  const queryParts = [];
  const keyword = (params.keyword || "").trim();
  const location = (params.location || "").trim();
  const repos = params.repos;

  if (keyword) queryParts.push(keyword);
  if (location) queryParts.push(`location:${location}`);

  const repoCount = parseInt(repos, 10);
  if (!isNaN(repoCount) && repoCount > 0)
    queryParts.push(`repos:>${repoCount}`);

  return queryParts.join(" ");
};

export const fetchUserData = async (searchParams, page = 1) => {
  const query = buildAdvancedQuery(searchParams || {});

  if (!query) {
    throw new Error("Please enter at least one search criterion.");
  }

  const url = `${GITHUB_BASE_URL}/search/users`;

  try {
    const response = await axios.get(url, {
      params: {
        q: query,
        per_page: 20,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.response || error.message);

    if (error.response && error.response.status === 422) {
      throw new Error("Invalid query or missing search term.");
    }
    throw new Error("An error occurred during the API request.");
  }
};
