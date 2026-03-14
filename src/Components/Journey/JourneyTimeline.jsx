import React from 'react';
import { journeyPoints, getJourneyStats } from '../../Utils/journeyData';

function JourneyTimeline({ activePointId, registerRef }) {
  const getTypeLabel = (type) => {
    switch (type) {
      case 'home': return 'home';
      case 'work': return 'work';
      case 'travel': return 'travel';
      case 'current': return 'now';
      default: return '';
    }
  };

  const activeIdx = journeyPoints.findIndex(p => p.id === activePointId);
  const stats = getJourneyStats();

  return (
    <div className="journey-timeline">
      <div className="journey-scroll-spacer-top" />

      {journeyPoints.map((point, i) => {
        const isActive = activePointId === point.id;
        const isPast = activeIdx >= 0 && i < activeIdx;

        return (
          <div
            key={point.id}
            ref={(el) => registerRef(point.id, el)}
            data-point-id={point.id}
            className={`journey-scroll-entry${isActive ? ' active' : ''}${isPast ? ' past' : ''}`}
          >
            <div className={`journey-scroll-card journey-card-${point.type}`}>
              <div className="journey-card-accent" />
              <div className="journey-card-body">
                <div className="journey-card-header">
                  <span className="journey-card-date">{point.dateRange}</span>
                  <span className="journey-card-type">{getTypeLabel(point.type)}</span>
                </div>
                <h3 className="journey-card-location">{point.city}</h3>
                <span className="journey-card-country">{point.country}</span>
                <p className="journey-card-desc">{point.description}</p>
                {point.professional && (
                  <div className="journey-card-pros">
                    {point.professional.map((pro, j) => (
                      <span key={j} className="journey-card-pro">
                        {pro.role} · {pro.company}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Mini stats */}
      <div className="journey-stats">
        <span className="journey-stat">{stats.cities} cities</span>
        <span className="journey-stat-sep">·</span>
        <span className="journey-stat">{stats.countries} countries</span>
        <span className="journey-stat-sep">·</span>
        <span className="journey-stat">{stats.continents} continents</span>
      </div>

      <div className="journey-scroll-spacer-bottom" />
    </div>
  );
}

export default JourneyTimeline;
