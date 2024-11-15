import React, { useState, useEffect } from 'react';

const Loading = ({ isLoading, isStarted, handleStart, audioRef }) => {

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

    // Define the backstories
    const backstories = [
        "Hi, I'm Riwa, a game development enthusiast with a passion for creating immersive 3D experiences.",
        "Did you know? I developed a VR hand-tracking system using OpenCV and Unity. It was a fun challenge!",
        "While you're waiting, here's a fun fact: I love combining tech and creativity to build cool interactive worlds.",
        "I'm currently working on mastering game mechanics and gameplay programming.",
        "One of my dreams? Creating unforgettable worlds for players at studios like Epic Games or Riot Games.",
        "When I'm not coding, you might find me diving into the latest video games or exploring new AR/VR tech."
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
        handleStart(); // This triggers the audio play
        audioRef.current.play(); // Play the audio when the start button is clicked
    };

    return (
        <div className="loading-container">
            <h2>{message}</h2>
            <div className="loader"></div>
            <p className="backstory">{backstory}</p>

            {/* Only show the Start button when loading is done */}
            {!isLoading && !isStarted && (
                <button onClick={handleStartClick} style={{
                    position: 'absolute',
                    bottom: '30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '10px 20px',
                    backgroundColor: '#00c49a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    fontFamily: "Satoshi, sans-serif",
                }}>START</button>
            )}
        </div>
    );
};

export default Loading;
