import "../../App.css";
import React, { useContext } from "react";
import AppContext from "../AppContext";

function TrackDetails() {
  const { currentTrack, setPlayingTrack } = useContext(AppContext);

  return (
    <div className="Track-details">
      <img src={currentTrack && currentTrack.track.album.images[0].url} alt="track-img" />
      <div className="details">
        <div className="superbold superbig">{currentTrack && currentTrack.track.name}</div>
        <div className="gray bold">{currentTrack && currentTrack.track.album.name}</div>
        <div className="superbold">{currentTrack && currentTrack.track.artists[0].name}</div>
        <button type="button" onClick={() => { setPlayingTrack(currentTrack); }}>
          <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
            <path fill="#fff" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          Play
        </button>
      </div>
    </div>
  );
}

export default TrackDetails;
