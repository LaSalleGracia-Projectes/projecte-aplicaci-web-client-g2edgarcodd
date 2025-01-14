import React, { useState } from 'react';

function VideoPlayer({ videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  return (
    <div className="video-player-container">
      {!isPlaying ? (
        <div className="video-placeholder" onClick={handlePlay}>
          <div className="video-overlay">
            <button className="play-button-large">
              <i className="fas fa-play"></i>
            </button>
          </div>
          <img 
            src="https://wallpapercave.com/wp/wp7314310.jpg" 
            alt="Video thumbnail" 
            className="video-thumbnail" 
          />
        </div>
      ) : (
        <iframe
          src={videoUrl}
          title="Video Player"
          className="video-frame"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
      
      <div className="video-controls">
        <div className="control-buttons">
          <button className="control-button">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="control-button main-control">
            <i className="fas fa-play"></i>
          </button>
          <button className="control-button">
            <i className="fas fa-step-forward"></i>
          </button>
        </div>
        <div className="volume-control">
          <i className="fas fa-volume-up"></i>
          <div className="volume-slider">
            <div className="volume-progress"></div>
          </div>
        </div>
        <div className="video-progress">
          <div className="progress-time">00:00</div>
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>
          <div className="progress-duration">02:35:15</div>
        </div>
        <div className="video-settings">
          <button className="control-button">
            <i className="fas fa-closed-captioning"></i>
          </button>
          <button className="control-button">
            <i className="fas fa-cog"></i>
          </button>
          <button className="control-button">
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;