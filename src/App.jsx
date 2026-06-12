import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchUserData } from "./services/githubService";
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

    if (page === 1) {
      setLastSearchParams(searchParams);
      setUsers([]); //Clear previous results only on a new search
      setCurrentPage(1);
    }

    try {
      const data = await fetchUserData(searchParams, page);

      //Append new results if loading more
      setUsers((prevUsers) =>
        page === 1 ? data.items : [...(prevUsers || []), ...data.items],
      );

      setTotalCount(data.total_count);
      setCurrentPage(page);
    } catch (error) {
      setError(error.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
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
                totalCount={totalCount}
                currentPage={currentPage}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                handleLoadMore={handleLoadMore}
              />
            }
          />

          <Route path="/user/:username" element={<UserDetailPage />} />
        </Routes>
      </BrowserRouter>

      <footer>
        <p>&copy; 2025 GitHub User Search Application</p>
      </footer>
    </div>
  );
}

export default App;
