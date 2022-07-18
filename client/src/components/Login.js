import React from "react";

function Login() {
  return (
    <div className="Login">
      <button type="button" className="btn-spotify">
        <a href="/auth/login">
          Login with Spotify
        </a>
      </button>
    </div>
  );
}

export default Login;
