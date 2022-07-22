import React from "react";

function Login() {
  return (
    <div className="Login">
      <button type="button" className="btn-spotify">
        <a href="http://localhost:5000/auth/login">
          Login with Spotify
        </a>
      </button>
    </div>
  );
}

export default Login;
