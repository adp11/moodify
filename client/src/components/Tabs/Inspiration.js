import "../../App.css";
import React from "react";

function Inspiration() {
  return (
    <div className="inspiration">
      <h3>Moodify</h3>
      <p>
        The inspiration for this app comes from my own experience of using Spotify: I categorize songs based on moods (rather than genres or artists). Instead of browsing through hundreds of songs, this is what I prefer: something that can read my face and play a song that matches my mood the most with least effort.
      </p>
      <p>Moodify is that something.</p>

      <h3>Access</h3>
      <p>The app needs your Spotify account and authorization. The experience with Moodify will be better if your account has more than 100 songs.</p>

      <h3>Privacy</h3>
      <p>No data (including your pictures and videos) will be saved from your usage. It only uses cookies to enhance user experience.</p>
    </div>
  );
}

export default Inspiration;
