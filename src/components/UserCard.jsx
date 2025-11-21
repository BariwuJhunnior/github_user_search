import React from "react";

function UserCard({ user }) {
  if (!user) {
    return null;
  }
  return (
    <div className="user-card">
      <img
        src={user.avartar_url}
        alt={`${user.login}'s avatar`}
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />

      <h3>{user.name || user.login} </h3>
      <p>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
          View GitHub Profile
        </a>
      </p>
      {
        {
          /* We could add more details here later */
        }
      }
    </div>
  );
}

export default UserCard;
