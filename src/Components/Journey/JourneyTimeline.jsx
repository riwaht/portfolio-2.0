import React, { useRef, useEffect } from 'react';
import { journeyPoints } from '../../Utils/journeyData';

function JourneyTimeline({ selectedPointId, onSelectPoint }) {
  const entryRefs = useRef({});

  // Scroll to selected entry when map pin is clicked
  useEffect(() => {
    if (selectedPointId && entryRefs.current[selectedPointId]) {
      entryRefs.current[selectedPointId].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedPointId]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'home': return '\u2302';
      case 'work': return '\u2692';
      case 'travel': return '\u2708';
      case 'current': return '\u2726';
      default: return '\u25CF';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'home': return 'home';
      case 'work': return 'work';
      case 'travel': return 'travel';
      case 'current': return 'now';
      default: return '';
    }
  };

  return (
    <div className="journey-timeline">
      <div className="journey-timeline-header">
        <h2>the journey so far</h2>
      </div>
      <div className="journey-timeline-list">
        {journeyPoints.map((point) => (
          <div
            key={point.id}
            ref={(el) => (entryRefs.current[point.id] = el)}
            className={`journey-timeline-entry ${selectedPointId === point.id ? 'selected' : ''} journey-type-${point.type}`}
            onClick={() => onSelectPoint(point.id)}
          >
            <div className="journey-timeline-dot">
              <span className="journey-dot-icon">{getTypeIcon(point.type)}</span>
            </div>
            <div className="journey-timeline-content">
              <div className="journey-timeline-meta">
                <span className="journey-date">{point.dateRange}</span>
                <span className="journey-type-tag">{getTypeLabel(point.type)}</span>
              </div>
              <h3 className="journey-timeline-location">{point.location}</h3>
              <p className="journey-timeline-description">{point.description}</p>
              {point.subLocations && (
                <div className="journey-sub-tags">
                  {point.subLocations.map((sub) => (
                    <span key={sub.name} className="journey-sub-tag">{sub.name}</span>
                  ))}
                </div>
              )}
              {point.professional && (
                <div className="journey-pro-badges">
                  {point.professional.map((pro, i) => (
                    <span key={i} className="journey-pro-badge">
                      {pro.role} @ {pro.company}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JourneyTimeline;
