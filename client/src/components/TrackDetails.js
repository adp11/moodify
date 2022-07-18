import "../App.css";
import React, { useContext, useState } from "react";
import AppContext from "./AppContext";

function TrackDetails() {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <div className="Track-details">
      <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
      <div className="details">
        <div className="superbold superbig">Hottest Hip Hop</div>
        <div className="gray bold">Find your favorites, discover the hottest new beats, and give me a follow. Find your favorites, discover the hottest new beats, and give me a follow.</div>
        <div className="superbold">John Novitsky</div>
        <button type="button">
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
