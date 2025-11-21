import React, { useState } from "react";
import "./App.css";
import Search from "./components/Search";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchUserData } from "./services/githubService";
import UserCard from "./components/UserCard";
import { SearchPage } from "./components/Search";
import UserDetailPage from "./components/UserDetailPage";

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async (searchParams, page = 1) => {
    setSearchTerm(searchParams);
    setError(null);
    setIsLoading(true);
    setUsers(null);

    if (page === 1) {
      setLastSearchParams(searchParams);
      setUsers([]); //Clear previous results only on a new search
      setCurrentPage(1);
    }

    try {
      const data = await fetchUserData(searchParams, page);

      //Update the results: append new results if loading more
      setUsers((prevUsers) =>
        page === 1 ? data.items : [...prevUsers, ...data.items]
      );

      //Save the total number of users found
      setTotalCount(data.total_count);
      setCurrentPage(page);
    } catch (error) {
      setError(error.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  //NEW FUNCTION for the "Load More" button
  const handleLoadMore = () => {
    //Search again using the last saved parameters, incrementing the page number
    handleSearch(lastSearchParams, currentPage + 1);
  };

  return (
    <div className="app-container">
      <h1>GitHub User Search</h1>

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <SearchPage
                users={users}
                isLoading={isLoading}
                error={error}
                totalCount={totalCount} //Pass Count down
                currentPage={currentPage}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                handleLoadMore={handleLoadMore} //Pass load more handler down
              />
            }
          />

          <Route path="/user/:username" element={<UserDetailPage />} />
        </Routes>
      </BrowserRouter>

      <footer>
        <p>&copy; 2025 GitHub Search App</p>
      </footer>
    </div>
  );
}

export default App;
