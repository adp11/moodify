import "../../App.css";
import React from "react";

function BlankPage() {
  return (
    <div className="BlankPage">
      <img src={`${window.location.origin}/images/blank.png`} alt="blank page" />
      <p>You're currently not logged in. Please log in to experience Moodify!</p>
    </div>
  );
}

export default BlankPage;
