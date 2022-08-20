import "./App.css";
import React, { useEffect, useState, useMemo } from "react";
import {
  Link, BrowserRouter, Routes, Route,
} from "react-router-dom";
import * as faceapi from "face-api.js";
import Inspiration from "./components/Tabs/Inspiration";
import Login from "./components/Login";
import AppContext from "./components/AppContext";
import Moodify from "./components/Tabs/Moodify";
import TrackDetails from "./components/Tabs/TrackDetails";
import TrackList from "./components/Tabs/TrackList";
import BlankPage from "./components/Utils/BlankPage";
import Player from "./components/Player";
import WaitingPage from "./components/Utils/WaitingPage";

const SERVER_URL = "https://adp11-moodify.herokuapp.com";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [trackList, setTrackList] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [topTracksList, setTopTracksList] = useState([]);
  const [allAudioFeatures, setAllAudioFeatures] = useState([]);
  const [didInitialFetch, setDidInitialFetch] = useState(false);

  // player states
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayerState, setCurrentPlayerState] = useState({});
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const providerValue = useMemo(
    () => ({
      isLoggedIn, trackList, currentTrack, playingTrack, token, isReady, deviceId, player, isPaused, currentPlayerState, modelsLoaded, allAudioFeatures, setIsLoggedIn, setTrackList, setPlayingTrack, setCurrentTrack, setIsReady, setDeviceId, setPlayer, setIsPaused, setCurrentPlayerState,
    }),
    [isLoggedIn, trackList, currentTrack, playingTrack, token, isReady, deviceId, player, isPaused, currentPlayerState, modelsLoaded, allAudioFeatures],
  );

  function shuffleAndGet100RandomIds(tempTrackList) {
    const list = tempTrackList.map((track) => track.track.id);
    return list.sort(() => 0.5 - Math.random()).slice(0, 100).join(",");
  }

  useEffect(() => {
    function loadModels() {
      const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => {
        setModelsLoaded(true);
      });
    }

    async function getToken() {
      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };
      const response = await fetch(`${SERVER_URL}/auth/token`, options);
      const data = await response.json();
      if (response.ok) {
        setToken(data.accessToken);
      } else { // no token in cookie
        setDidInitialFetch(true);
        setIsLoggedIn(false);
      }
    }

    loadModels();
    getToken();
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    function cleanTrackList(list) {
      const newList = list.reduce((total, item) => total.concat(item.items), []).sort(() => 0.5 - Math.random()); // shuffle
      const filteredList = newList.filter((value, index, self) => index === self.findIndex((t) => (
        t.track.id === value.track.id
      ))); // remove potential duplicates across playlists
      return filteredList;
    }

    async function fetchAllAudioFeatures(commaSeparatedStringIds) {
      const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${commaSeparatedStringIds}`, options);
      const data = await response.json();
      if (response.ok) {
        setAllAudioFeatures(data.audio_features);
      }
    }

    function fetchAllTracks(playlistsHrefs) {
      Promise
        .all(playlistsHrefs.map((playlistHref) => fetch(playlistHref, options)))
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((results) => {
          const tempTrackList = cleanTrackList(results);
          const stats = {
            artists: tempTrackList.reduce((total, item) => total + item.track.artists.length, 0),
            hours: (tempTrackList.reduce((total, item) => total + item.track.duration_ms, 0) / 1000 / 3600).toFixed(2),
            playlists: (results.length > 0) ? (results.length - 1) : 0,
            tracks: tempTrackList.length,
          };

          setTrackList(tempTrackList);
          setUserStats(stats);
          setCurrentTrack(tempTrackList[0]);
          fetchAllAudioFeatures(shuffleAndGet100RandomIds(tempTrackList));
          setDidInitialFetch(true);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          // alert(err);
        });
    }

    if (token) {
      const parallelURLs = ["https://api.spotify.com/v1/me", "https://api.spotify.com/v1/me/playlists", "https://api.spotify.com/v1/me/top/tracks?limit=15"];

      Promise
        .all(parallelURLs.map((URL) => fetch(URL, options)))
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then(async (results) => {
          if (results[0].error) { // expired token
            setDidInitialFetch(true);
            setIsLoggedIn(false);
          } else {
            const playlistsHrefs = results[1].items.map((playlist) => playlist.tracks.href);
            setProfile(results[0]);
            setTopTracksList(results[2].items);
            if (playlistsHrefs.length > 0) {
              fetchAllTracks(playlistsHrefs);
            }
          }
        })
        .catch((err) => {
          // alert(err);
        });
    }
  }, [token]);

  useEffect(() => () => {
    if (player) {
      player.disconnect();
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContext.Provider value={providerValue}>
        {didInitialFetch ? (
          <div className="App">
            <div className="Nav">
              <Link to="/browse"><img src={`${window.location.origin}/images/logo.png`} alt="logo" className="logo" /></Link>
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
                    <img src={profile && profile.images[0].url} alt="track-img" />
                    <div className="details">
                      <div className="bold big">{profile && profile.display_name}</div>
                      <div className="supergray">
                        {profile && `${profile.followers.total} followers`}
                      </div>
                    </div>
                    <svg style={{ width: "30px", height: "30px", marginLeft: "auto" }} viewBox="0 0 24 24" onClick={() => { setIsLoggedIn(false); player.pause(); setPlayingTrack(null); }} className="logout">
                      <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                    </svg>
                  </div>
                  <div className="stats">
                    <div className="superbold big">Your Stats</div>
                    <div className="supergray bold">
                      <img src={`${window.location.origin}/images/music.svg`} alt="music-img" />
                      {`${userStats.tracks} Tracks`}
                    </div>
                    <div className="supergray bold">
                      <img src={`${window.location.origin}/images/star.svg`} alt="star-img" />
                      {`${userStats.hours} Hours`}
                    </div>
                    <div className="supergray bold">
                      <img src={`${window.location.origin}/images/person.png`} alt="person-img" />
                      {`${userStats.artists} Artists`}
                    </div>
                    <div className="supergray bold">
                      <img src={`${window.location.origin}/images/playlist.svg`} alt="playlist-img" />
                      {`${userStats.playlists} Playlists`}
                    </div>
                  </div>
                  <div className="recc-list">
                    <div className="superbold big">Your Top 15 Tracks</div>
                    {topTracksList.map((track) => (
                      <div className="recc" key={track.uri}>
                        <img src={track.album.images[0].url} alt="track-img" />
                        <div className="details">
                          <div className="bold">{track.name}</div>
                          <div className="medium supergray bold">{track.artists[0].name}</div>
                        </div>
                      </div>
                    ))}
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

              {isLoggedIn
              // eslint-disable-next-line
            ? <Route path="/browse" element={(<><TrackDetails /><TrackList /></>)} /> 
              // eslint-disable-next-line
            : <Route path="/browse" element={(<BlankPage/>)} />}

              {isLoggedIn
              // eslint-disable-next-line
            ? <Route path="/moodify" element={<Moodify />} />
              // eslint-disable-next-line
            : <Route path="/moodify" element={(<BlankPage/>)} />}

              <Route path="/inspiration" element={<Inspiration />} />
            </Routes>

            {playingTrack && (
            <div className="progress-bar-container">
              <span className="progress-bar" />
            </div>
            )}
            {playingTrack && (<Player />)}
          </div>
        ) : (
          <WaitingPage />
        )}

      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
