import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import JourneyMap from './Journey/JourneyMap';
import JourneyTimeline from './Journey/JourneyTimeline';
import '../styles.css';

function Journey() {
  const [selectedPointId, setSelectedPointId] = useState(null);

  return (
    <div className="page-container">
      <Navbar />
      <div className="journey-container">
        <div className="journey-map-panel">
          <JourneyMap
            selectedPointId={selectedPointId}
            onSelectPoint={setSelectedPointId}
          />
        </div>
        <div className="journey-timeline-panel">
          <JourneyTimeline
            selectedPointId={selectedPointId}
            onSelectPoint={setSelectedPointId}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Journey;
