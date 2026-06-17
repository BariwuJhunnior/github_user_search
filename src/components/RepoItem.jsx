export default function RepoItem({ repo }) {
  return (
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
}
