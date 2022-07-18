import "./App.css";
import React, {
  useEffect, useState, useMemo, useRef,
} from "react";
import {
  Link, useNavigate, BrowserRouter, Routes, Route, useRoutes,
} from "react-router-dom";
import Inspiration from "./components/Inspiration";
import Login from "./components/Login";
import AppContext from "./components/AppContext";
import Moodify from "./components/Moodify";
import TrackDetails from "./components/TrackDetails";
import TrackList from "./components/TrackList";
import BlankPage from "./components/BlankPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const providerValue = useMemo(
    () => ({
      isLoggedIn, setIsLoggedIn,
    }),
    [isLoggedIn],
  );

  // use grid
  return (
    <div className="App">
      <BrowserRouter>
        <AppContext.Provider value={providerValue}>
          <div className="Nav">
            <img src={`${window.location.origin}/images/logo.png`} alt="logo" className="logo" />
            <div className="nav-buttons">
              <Link to="/inspiration"><div>Inspiration</div></Link>
              <Link to="/browse"><div>Browse</div></Link>
              <Link to="/moodify"><div>Moodify</div></Link>
            </div>
          </div>

          {isLoggedIn
            ? (
              <div className="Sidebar">
                <div className="profile">
                  <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                  <div className="details">
                    <div className="bold big">Loc Pham</div>
                    <div className="supergray">5 followers</div>
                  </div>
                </div>
                <div className="stats">
                  <div className="superbold big">Your Stats</div>
                  <div className="supergray bold">
                    <img src={`${window.location.origin}/images/music.svg`} alt="music-img" />
                    38 Tracks
                  </div>
                  <div className="supergray bold">
                    <img src={`${window.location.origin}/images/star.svg`} alt="star-img" />
                    210 Hours

                  </div>
                  <div className="supergray bold">
                    <img src={`${window.location.origin}/images/person.png`} alt="person-img" />
                    21 Artists

                  </div>
                  <div className="supergray bold">
                    <img src={`${window.location.origin}/images/playlist.svg`} alt="playlist-img" />
                    5 Playlists

                  </div>
                </div>
                <div className="recc-list">
                  <div className="superbold big">You Might Also Like</div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                  <div className="recc">
                    <img src={`${window.location.origin}/images/sample.jpg`} alt="track-img" />
                    <div className="details">
                      <div className="bold">Takeoff</div>
                      <div className="medium supergray bold">DaBaby</div>
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div className="Sidebar extra">
                <Login />
              </div>
            )}

          <Routes>
            {/* eslint-disable-next-line */}
            {isLoggedIn
            // eslint-disable-next-line
            ? <Route path="/" element={(<><TrackDetails /><TrackList /></>)} />
            // eslint-disable-next-line
            : <Route path="/" element={(<BlankPage/>)} />}

            {true
            // eslint-disable-next-line
            ? <Route path="/browse" element={(<><TrackDetails /><TrackList /></>)} /> 
            // eslint-disable-next-line
            : <Route path="/browse" element={(<BlankPage/>)} />}

            {true
            // eslint-disable-next-line
            ? <Route path="/moodify" element={<Moodify />} />
            // eslint-disable-next-line
            : <Route path="/moodify" element={(<BlankPage/>)} />}

            <Route path="/inspiration" element={<Inspiration />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </div>

  );
}

export default App;
