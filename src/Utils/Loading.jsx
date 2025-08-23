import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from './AudioPlayer';  // Import your AudioPlayer component

const Loading = ({ isLoading, isStarted, handleStart }) => {
    const audioRef = useRef(null);  // Declare the ref for audio player

    // Define the stages of the loading process
    const stages = [
        { progress: 0, message: "Hold tight, our virtual carpenters are hammering away at your room!" },
        { progress: 5, message: "Patience, young grasshopper. This room will be worth the wait." },
        { progress: 10, message: "The room is almost ready! In the meantime, can I offer you a virtual cup of tea?" },
        { progress: 15, message: "The room is on its way, but it's taking a detour through the Bermuda Triangle. Don't worry, it'll be here soon!" },
        { progress: 20, message: "Please bear with us while we wrangle the internet gremlins." },
        { progress: 30, message: "Don't worry, our code monkeys are typing as fast as they can." },
        { progress: 40, message: "The good news is, the room is almost ready. The bad news is, we accidentally summoned a virtual dragon, and now we're trying to get it to leave." },
        { progress: 50, message: "Our virtual architects are taking a nap. We'll wake them up soon, promise!" },
        { progress: 60, message: "Our virtual engineers are trying to figure out why the room keeps turning into a virtual cheeseburger. We'll get it sorted out soon." },
        { progress: 70, message: "The virtual elves who are building your room got lost in a virtual forest. They're making their way back, though." },
        { progress: 80, message: "Please hold tight while we perform some virtual magic to get your room ready." },
        { progress: 90, message: "The room is almost ready, but it seems that a virtual alien invasion is causing some interference. We're working on it." },
        { progress: 100, message: "Our virtual team is working hard to make your room look amazing. We're also taking virtual bets on whether you'll love it or love it even more." }
    ];

    /// Define the backstories
    const backstories = [
        "Hi, I'm Riwa Hoteit, a developer passionate about creating interactive worlds and storytelling through code.",
        "Fun fact: I developed 'Nightventures,' a project that uses machine learning to suggest clubs based on your music taste.",
        "While you're waiting, did you know? I built 'Beirut,' a voice-activated assistant tailored for Lebanon, combining tech and cultural relevance.",
        "I'm currently sharpening my gameplay programming skills and exploring ways to enhance immersive experiences.",
        "One of my ambitions? To work on innovative projects at studios like Naughty Dog or Riot Games and leave my mark on the gaming industry.",
        "When I’m not coding, I enjoy creating AR/VR systems, diving into my favorite manga, or exploring cutting-edge gaming technologies."
    ];


    const [message, setMessage] = useState(stages[0].message);
    const [backstory, setBackstory] = useState(backstories[0]);

    useEffect(() => {
        if (!isLoading) return; // Only run if isLoading is true

        const messageInterval = setInterval(() => {
            const randomStage = stages[Math.floor(Math.random() * stages.length)];
            setMessage(randomStage.message);
        }, 8000); // Change the message every 8 seconds

        const backstoryInterval = setInterval(() => {
            const randomBackstory = backstories[Math.floor(Math.random() * backstories.length)];
            setBackstory(randomBackstory);
        }, 8000); // Change the backstory every 8 seconds

        // Cleanup intervals on unmount
        return () => {
            clearInterval(messageInterval);
            clearInterval(backstoryInterval);
        };
    }, [isLoading]);

    const handleStartClick = () => {
        // Check if the audioRef is valid and then play the audio
        if (audioRef.current) {
            audioRef.current.play();  // Play the audio when Start is clicked
        }
        handleStart(); // Call the handleStart function passed down as prop
    };

    return (
        <div className="loading-container">
            <h2>{message}</h2>
            <div className="loader"></div>
            <p className="backstory">{backstory}</p>

            {/* Only show the Start button when loading is done */}
            {!isLoading && !isStarted && (
                <button onClick={handleStartClick} className="loading-start-button">
                    START
                </button>
            )}
        </div>
    );
};

export default Loading;
