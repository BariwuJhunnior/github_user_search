import { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/githubService";

export function UserCard({ user }) {
  const [followers, setFollowers] = useState(
    user && typeof user.followers === "number" ? user.followers : null,
  );

  useEffect(() => {
    let mounted = true;

    if (!user || followers !== null) {
      return () => {
        mounted = false;
      };
    }

    fetchUserProfile(user.login)
      .then((data) => {
        if (mounted && typeof data.followers === "number") {
          setFollowers(data.followers);
        }
      })
      .catch(() => {})
      .finally(() => {
        mounted = false;
      });

    return () => {
      mounted = false;
    };
  }, [user, followers]);

  if (!user) return null;

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

export default UserCard;
