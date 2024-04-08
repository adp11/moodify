import "../../App.css";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";

function TrackList() {
  const { trackList, currentTrack, setCurrentTrack } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState(trackList);

  function handleQuery(value) {
    if (value) {
      const filtered = trackList.filter((track) => (track.track.name.toLowerCase().includes(value)));
      setSearchResults(filtered);
    } else {
      setSearchResults(trackList);
    }
  }

  function convertToMinAndSec(ms) {
    const min = Math.floor(ms / 1000 / 60);
    const sec = Math.floor(ms / 1000) % 60;
    if (sec < 10) {
      return `${min}:0${sec}`;
    }
    return `${min}:${sec}`;
  }

  useEffect(() => {
    setSearchResults(trackList);
  }, [trackList]);

  return (
    <div className="Track-list">
      <div className="searchbox">
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
        <div className="info-on-hover">
          Table only displays a small portion of all of your playlists for presentation purposes. Please use search if needed.
        </div>
        <input onChange={(e) => { handleQuery(e.target.value.trim().toLowerCase()); }} type="search" placeholder="Search..." maxLength="30" />
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>TRACK</th>
            <th style={{ width: "20%" }}>ARTIST</th>
            <th style={{ width: "30%" }}>ALBUM</th>
            <th style={{ width: "10%" }}>TIME</th>
          </tr>

        </thead>
        <tbody>
          {searchResults.slice(0, 10).map((track) => (
            <tr onClick={() => { setCurrentTrack(track); }} key={track.track.uri} className={currentTrack && (currentTrack.track.uri === track.track.uri) ? "current" : ""}>
              <td className={currentTrack && (currentTrack.track.uri === track.track.uri) ? "bold current" : "bold"}>
                <img src={track.track.album.images[0].url} alt="track-img" />
                {track.track.name}
              </td>
              <td className={currentTrack && (currentTrack.track.uri === track.track.uri) ? "current" : ""}>{track.track.artists[0].name}</td>
              <td className={currentTrack && (currentTrack.track.uri === track.track.uri) ? "current" : ""}>{track.track.album.name}</td>
              <td className={currentTrack && (currentTrack.track.uri === track.track.uri) ? "current" : ""}>{convertToMinAndSec(track.track.duration_ms)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrackList;
