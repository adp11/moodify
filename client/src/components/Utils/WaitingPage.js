import React from "react";

const LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

function WaitingPage() {
  return (
    <div
      className="WaitingPage"
      style={{
        display: "grid", placeItems: "center", height: "100vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={LOADING_IMAGE_URL} alt="Page Not Found" style={{ width: "30px", height: "auto" }} />
      </div>
    </div>
  );
}

export default WaitingPage;
