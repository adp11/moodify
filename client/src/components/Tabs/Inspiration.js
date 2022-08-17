import "../../App.css";
import React from "react";

function Inspiration() {
  return (
    <div className="inspiration">
      <h3>Moodify</h3>
      <p>
        The appplication starts from my own experience of using Spotify as I categorize tracks based on moods (rather than genres or artists). Instead of browsing through hundreds of tracks, this is what I'd prefer: something/someone that can read my face and play the track that
        {" "}
        <i>most</i>
        {" "}
        matches my mood with
        {" "}
        <i>least</i>
        {" "}
        effort.
      </p>
      <p>And Moodify is that something/someone.</p>

      <h3>Access</h3>
      <p>The app requires a Spotify account and needs your authorization. Your experience with Moodify will be better if your Spotify account has more than 100 tracks.</p>

      <h3>Privacy</h3>
      <p>No data (including your pictures and videos) will be saved from your usage. It only uses cookies to support better sessions and thus better user experience.</p>
    </div>
  );
}

export default Inspiration;
