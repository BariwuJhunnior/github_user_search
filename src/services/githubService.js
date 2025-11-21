import axios from "axios";

const GITHUB_BASE_URL = "https://api.github.com";

export const fetchUserProfile = async (username) => {
  const url = `${GITHUB_BASE_URL}/users/${username}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    //Handling 404 for a user profile
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

const buildAdvancedQuery = (params) => {
  let queryParts = [];

  // 1. Add the main keyword/username search
  if (params.keyword.trim()) {
    // Keywords can be searched directly
    queryParts.push(params.keyword.trim());
  }

  // 2. Add the location qualifier
  if (params.location.trim()) {
    // The syntax for location is 'location:value'
    queryParts.push(`Location: ${params.location.trim()}`);
  }

  // 3. Add the minimum repositories qualifier
  const repoCount = parseInt(params.repos);
  if (!isNaN(repoCount) && repoCount > 0) {
    // The syntax for minimum repositories is 'repos:>number'
    queryParts.push(`repos:>${repoCount}`);
  }

  // Combine all parts with '+' for the URL encoding needed by GitHub's API
  return queryParts.join("+");
};

export const fetchUserData = async (searchParams) => {
  const query = buildAdvancedQuery(searchParams);

  if (!query) {
    throw new Error("Please enter at least one search criterion.");
  }

  ["https://api.github.com/search/users?q", "minRepos"];

  const url = `${GITHUB_BASE_URL}/search/users`;

  try {
    const response = await axios.get(url, {
      params: {
        q: query, // The constructed query string
        per_page: 20, // Request 20 results per page for testing
        page: 1, //Start on the first page
      },
    });

    // The search endpoint returns an object with a property called 'items'
    // that holds the array of users.
    return response.data;
  } catch (error) {
    console.Error(
      "Error fetching user data: ",
      error.response || error.message
    );

    if (error.response && error.response.status === 422) {
      // 422 Unprocessable Entity often means an invalid search query syntax
      throw new Error("Invalid query or missing search term.");
    } else {
      throw new Error("An error occurred during the API request.");
    }
  }
};
