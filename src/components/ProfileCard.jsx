export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:space-x-8">
      <img
        src={profile.avatar_url}
        alt={`${profile.login}'s avatar`}
        className="w-32 h-32 rounded-full mb-4 md:mb-0 shadow-md"
      />
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800">
          {profile.name || profile.login}
        </h1>
        <p className="text-xl text-blue-600 mb-3">{profile.login}</p>

        {profile.bio && (
          <p className="text-gray-700 italic mb-3">"{profile.bio}"</p>
        )}

        <div className="text-md text-gray-600 space-y-1">
          {profile.location && <p>{profile.location}</p>}
          <p>Public Repos: {profile.public_repos}</p>
          <p>Followers: {profile.followers}</p>
        </div>
        <a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
