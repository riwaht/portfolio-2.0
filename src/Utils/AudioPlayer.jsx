import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faPlay, faPause, faForward, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../AudioPlayer.css";

// Forward the ref to the component
const AudioPlayer = React.forwardRef((props, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [minimized, setMinimized] = useState(false);

    // Using the forwarded ref instead of the local useRef
    const audioRef = ref || useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
        }
    }, [audioRef]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const updateTime = () => {
        const { currentTime, duration } = audioRef.current;
        setCurrentTime(currentTime);
        setDuration(duration);
    };

    const handleProgressBarClick = (e) => {
        const progressBar = e.target;
        const { offsetWidth } = progressBar;
        const clickedPosition = e.nativeEvent.offsetX;
        const newTime = (clickedPosition / offsetWidth) * duration;
        audioRef.current.currentTime = newTime;
    };

    const handleRewindButton = () => {
        audioRef.current.currentTime -= 5;
    };

    const handleForwardButton = () => {
        audioRef.current.currentTime += 5;
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    return (
        <div className={`media-controls${minimized ? ' media-controls-minimized' : ''}`}>
            <button className="media-minimize-btn" onClick={() => setMinimized(!minimized)} aria-label={minimized ? 'Expand player' : 'Minimize player'}>
                <FontAwesomeIcon icon={minimized ? faPlus : faMinus} />
            </button>

            <div className="media-transport">
                <button className="rewind-button media-button media-collapsible" onClick={handleRewindButton} aria-label="Rewind 5 seconds">
                    <FontAwesomeIcon icon={faBackward} className="button-icons" />
                </button>
                <button className="play-button media-button" onClick={togglePlayPause}>
                    <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className={`button-icons ${isPlaying ? "delta" : ""}`}
                    />
                </button>
                <button className="fast-forward-button media-button media-collapsible" onClick={handleForwardButton} aria-label="Forward 5 seconds">
                    <FontAwesomeIcon icon={faForward} className="button-icons" />
                </button>
            </div>

            <div className="media-expandable">
                <div className="media-progress">
                    <div className="progress-time-current">{formatTime(currentTime)}</div>
                    <div className="progress-bar-wrapper" onClick={handleProgressBarClick}>
                        <div
                            className="progress-bar"
                            style={{
                                width: `${(currentTime / duration) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <div className="progress-time-total">{formatTime(duration)}</div>
                </div>
            </div>

            <audio
                ref={audioRef}
                onTimeUpdate={updateTime}
                onLoadedMetadata={updateTime}
                onPlay={handlePlay}
                onPause={handlePause}
                src="/Sounds/Married Life.mp3"
                autoPlay
            />
        </div>
    );
});

// Helper function to format the time (e.g., 02:30)
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default AudioPlayer;
