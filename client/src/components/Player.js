import "../App.css";
import React, { useContext, useEffect, useRef } from "react";
import AppContext from "./AppContext";

function Player() {
  const {
    token, playingTrack, currentPlayerState, isReady, deviceId, player, isPaused, setPlayingTrack, setIsReady, setDeviceId, setPlayer, setIsPaused,
  } = useContext(AppContext);

  const progressBarRef = useRef();

  function skipNext() {
    const currentPosition = currentPlayerState.position + (performance.now() - currentPlayerState.updateTime);
    const nextPosition = currentPosition + 15 * 1000;
    const finalPosition = nextPosition > currentPlayerState.duration ? currentPlayerState.duration : nextPosition;
    player.seek(finalPosition);
  }

  function skipBack() {
    const currentPosition = currentPlayerState.position + (performance.now() - currentPlayerState.updateTime);
    const backPosition = currentPosition - 15 * 1000;
    const finalPosition = backPosition < 0 ? 0 : backPosition;
    player.seek(finalPosition);
  }

  function updateProgressBar() {
    if (currentPlayerState.paused) {
      return currentPlayerState.position ? currentPlayerState.position : 0;
    }
    const position = currentPlayerState.position + (performance.now() - currentPlayerState.updateTime);
    const result = position > currentPlayerState.duration ? currentPlayerState.duration : position;
    progressBarRef.current.style.width = `${(result / currentPlayerState.duration) * 100}%`;
    return null;
  }

  useEffect(() => {
    progressBarRef.current = document.querySelector(".progress-bar");

    const scripts = Array.from(document.getElementsByTagName("script"));
    const SDKloaded = scripts.findIndex((script) => script.src === "https://sdk.scdn.co/spotify-player.js") > -1;
    if (!SDKloaded) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Moodify Web Playback SDK",
        getOAuthToken: (cb) => { cb(token); },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", ((state) => {
        if (!state) {
          return;
        }
        currentPlayerState.paused = state.paused;
        currentPlayerState.position = state.position;
        currentPlayerState.duration = state.duration;
        currentPlayerState.updateTime = performance.now();

        setIsPaused(state.paused);
      }));

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.connect();
    };

    const myInterval = setInterval(updateProgressBar, 1000);

    return () => {
      clearInterval(myInterval);
      progressBarRef.current.width = "0%";
    };
  }, [playingTrack]);

  useEffect(() => {
    if (player && playingTrack && isReady && deviceId) {
      progressBarRef.current.width = "0%";
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [playingTrack.track.uri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json())
        .then((data) => {
          alert("Spotify Error of not finding this track. You need to refresh the app right now and this track cannot be played in the future!");
        });
    }
  }, [playingTrack, deviceId, isReady, player]);

  return (
    <div className="Player">
      <div className="left-player">
        <img src={playingTrack.track.album.images[0].url} alt="track-img" />
        <div>
          <div className="bold">{playingTrack.track.name}</div>
          <div className="supergray medium">{playingTrack.track.artists[0].name}</div>
        </div>
      </div>
      <div className="middle-player">
        <svg style={{ width: "25px", height: "25px" }} viewBox="0 0 24 24" onClick={skipBack}>
          <path fill="#f53c3d" d="M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12" />
        </svg>
        {isPaused ? (
          <svg style={{ width: "35px", height: "35px" }} viewBox="0 0 24 24" onClick={() => { player.togglePlay(); }}>
            <path fill="#f53c3d" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z" />
          </svg>
        ) : (
          <svg style={{ width: "35px", height: "35px" }} viewBox="0 0 24 24" onClick={() => { player.togglePlay(); }}>
            <path fill="#f53c3d" d="M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
          </svg>
        )}
        <svg style={{ width: "25px", height: "25px" }} viewBox="0 0 24 24" onClick={skipNext}>
          <path fill="#f53c3d" d="M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12" />
        </svg>
      </div>
      <div className="right-player" onClick={() => { setPlayingTrack(null); player.pause(); }}>
        <svg style={{ width: "25px", height: "25px" }} viewBox="0 0 24 24">
          <path fill="#f53c3d" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
        </svg>
      </div>
    </div>
  );
}

export default Player;
