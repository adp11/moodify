import React from "react";

const SERVER_URL = "https://moodify-adp.onrender.com";

function Login() {
  return (
    <div className="Login">
      <button type="button" className="btn-spotify">
        <a href={`${SERVER_URL}/auth/login`}>
          Login with Spotify
        </a>
      </button>
    </div>
  );
}

export default Login;
