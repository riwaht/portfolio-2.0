import React from 'react';

// Free-roam lighting. The whole house is visible at once now (no room-by-room
// walkthrough), so this lights every quadrant brightly instead of one room.
// three r164 uses physically-correct lights, hence the high point-light values.
function Lighting() {
    return (
        <>
            <ambientLight intensity={0.8} />
            <hemisphereLight args={[0xffffff, 0x444466, 1.0]} />

            {/* General sun-like fill */}
            <directionalLight intensity={1.4} position={[40, 70, 40]} castShadow />

            {/* One bright bulb above each room quadrant */}
            <pointLight intensity={1600} position={[25, 28, 25]} castShadow />
            <pointLight intensity={1600} position={[-25, 28, 25]} />
            <pointLight intensity={1600} position={[-22, 32, -22]} />
            <pointLight intensity={1600} position={[25, 28, -25]} />
        </>
    );
}

export default Lighting;
