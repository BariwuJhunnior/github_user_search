import SearchForm from "./SearchForm";
import UserCard from "./UserCard";

export function SearchPage({
  users = [],
  isLoading = false,
  error = null,
  handleSearch,
  totalCount = 0,
  handleLoadMore,
}) {
  const safeUsers = Array.isArray(users) ? users : [];
  const userCount = safeUsers.length;
  const topUser = userCount > 0 ? safeUsers[0] : null;

  const userList = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {safeUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );

  let content;

  if (isLoading && userCount === 0) {
    content = <p className="text-center text-lg mt-8">Loading...</p>;
  } else if (error) {
    content = <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  } else if (userCount > 0) {
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

  const showLoadMore = userCount > 0 && userCount < totalCount;

  return (
    <>
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

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

        {userCount > 0 && (
          <h2 className="text-xl font-bold mb-4">
            Found {totalCount} users. Displaying {userCount}.
          </h2>
        )}

        {content}

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

export default SearchPage;

