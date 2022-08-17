import "../../App.css";
import React, {
  useEffect, useState, useRef, useContext,
} from "react";
import * as faceapi from "face-api.js";
import AppContext from "../AppContext";

const LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

function Moodify() {
  const {
    modelsLoaded, allAudioFeatures, setPlayingTrack, trackList,
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [emotionResult, setEmotionResult] = useState(null);

  const cameraStarted = useRef(false);
  const cameraButtonRef = useRef();
  const videoButtonRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const photoRef = useRef();
  const context = useRef();

  function getBestTracks(expressions) {
    let firstResults;
    let secondResults;
    if (expressions.sad > 0.4 || expressions.angry > 0.4 || expressions.fearful > 0.4) {
      const emotion = expressions.sad > 0.5 ? "SAD" : expressions.angry > 0.5 ? "ANGRY" : "FEARFUL";
      setEmotionResult(emotion);
      firstResults = allAudioFeatures.filter((track) => track.acousticness > 0.7 && track.valence <= 0.3);
      if (firstResults.length > 1) {
        return firstResults;
      }
      return null;
    } if (expressions.happy > 0.5) {
      setEmotionResult("HAPPY");
      firstResults = allAudioFeatures.filter((track) => track.acousticness <= 0.3 && track.valence > 0.7);
      if (firstResults.length > 1) {
        secondResults = firstResults.filter((track) => track.energy > 0.7 && track.loudness > -7);

        if (secondResults.length === 0) {
          return firstResults;
        }
        return secondResults;
      } if (firstResults.length === 1) {
        return firstResults;
      }
    } if (expressions.neutral > 0.5 || expressions.disgusted > 0.5 || expressions.surprised > 0.5) {
      const emotion = expressions.neutral > 0.5 ? "NEUTRAL" : expressions.disgusted > 0.5 ? "DISGUSTED" : "SURPRISED";
      setEmotionResult(emotion);
      firstResults = allAudioFeatures.filter((track) => track.acousticness <= 0.35 && track.valence > 0.65);
      if (firstResults.length > 1) {
        secondResults = firstResults.filter((track) => track.energy > 0.35 && track.energy <= 0.65);

        if (secondResults.length === 0) {
          return firstResults;
        }
        return secondResults;
      } if (firstResults.length === 1) {
        return firstResults;
      }
    }
    return null;
  }

  async function getExpressions() {
    if (photoRef.current.src && modelsLoaded) {
      const detections = await faceapi.detectSingleFace(photoRef.current).withFaceLandmarks().withFaceExpressions();
      return detections.expressions;
    }
    return null;
  }

  async function handleImageProcessing() {
    setIsLoading(true);
    const expressions = await getExpressions();
    if (expressions === null) {
      alert("Error! It could be because models have not been loaded yet and/or there are no snaps found.");
      setIsLoading(false);
    } else {
      const bestTracks = getBestTracks(expressions);
      if (Array.isArray(bestTracks)) {
        const bestTrack = bestTracks[Math.floor(Math.random() * bestTracks.length)]; // pick a random track ID
        const trackToPlay = trackList.filter((track) => track.track.id === bestTrack.id); // get it from trackList
        setIsLoading(false);
        setPlayingTrack(trackToPlay[0]);
      } else {
        alert("Sorry! We can't select any best track that matches your mood most, given the number of tracks in your playlists. We suggest adding more tracks to your Spotify!");
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    videoButtonRef.current.addEventListener("click", async () => {
      if (!cameraStarted.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        window.localStream = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        cameraStarted.current = true;
      }
    });

    cameraButtonRef.current.addEventListener("click", () => {
      context.current = canvasRef.current.getContext("2d");
      context.current.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const data = canvasRef.current.toDataURL("image/jpg");
      photoRef.current.src = data;
    });

    return () => {
      if (window.localStream) {
        window.localStream.getVideoTracks()[0].stop();
      }
    };
  }, []);

  return (
    <div className="Moodify">
      <div className="container">
        <div className="media">
          <video ref={videoRef} id="video" />
          <svg ref={videoButtonRef} style={{ width: "30px", height: "30px" }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
          </svg>
        </div>
        <div className="media">
          <canvas ref={canvasRef} />
          <img ref={photoRef} id="photo" alt="The screen capture will appear in this box." />
          <svg ref={cameraButtonRef} style={{ width: "30px", height: "30px" }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
          </svg>
        </div>
      </div>
      {isLoading ? <img src={LOADING_IMAGE_URL} alt="loading" style={{ display: "block" }} /> : <div />}
      {emotionResult && <div className="bold">{`I THINK YOU LOOK ${emotionResult}.`}</div>}
      <button type="button" className="moodify" onClick={handleImageProcessing}>Moodify</button>

    </div>
  );
}

export default Moodify;
