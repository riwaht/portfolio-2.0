import React, { useRef, useEffect, useState, useMemo } from 'react';
import { journeyPoints } from '../../Utils/journeyData';

function JourneyMap({ selectedPointId, onSelectPoint }) {
  const svgRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [expandedSub, setExpandedSub] = useState(null);
  const pathRef = useRef(null);

  // Build the travel path as SVG path string
  const travelPathD = useMemo(() => {
    const points = journeyPoints.map(p => ({
      x: p.coordinates.x,
      y: p.coordinates.y
    }));
    if (points.length < 2) return '';

    // Build smooth curved path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      // Use quadratic bezier for smooth curves
      d += ` Q ${prev.x + (curr.x - prev.x) * 0.3} ${prev.y + (curr.y - prev.y) * 0.1}, ${midX} ${midY}`;
      d += ` T ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  // Measure the actual path length for animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [travelPathD]);

  const handlePinClick = (point) => {
    if (point.subLocations) {
      setExpandedSub(expandedSub === point.id ? null : point.id);
    }
    onSelectPoint(point.id);
  };

  const getPinClass = (point) => {
    let cls = 'journey-pin';
    if (point.type === 'current') cls += ' journey-pin-current';
    if (point.type === 'home') cls += ' journey-pin-home';
    if (point.type === 'work') cls += ' journey-pin-work';
    if (point.type === 'travel') cls += ' journey-pin-travel';
    if (selectedPointId === point.id) cls += ' selected';
    return cls;
  };

  return (
    <div className="journey-map">
      <svg
        ref={svgRef}
        viewBox="0 0 100 80"
        xmlns="http://www.w3.org/2000/svg"
        className="journey-svg"
      >
        {/* Simplified world landmasses */}
        <g className="journey-landmasses">
          {/* UK & Ireland */}
          <path d="M45.5,25 L46,24 L47,23.5 L47.5,24.5 L48,25.5 L48.5,27 L48,28.5 L47,29 L46,28.5 L45.5,27 Z" className="country-path" />
          <path d="M44,25 L44.5,24.5 L45,25 L45,26.5 L44.5,27 L44,26 Z" className="country-path" />

          {/* France */}
          <path d="M46,30 L48,29.5 L50,30 L51,31 L51,33 L50,34.5 L48,35 L46.5,34 L45.5,33 L45,31.5 Z" className="country-path" />

          {/* Iberian Peninsula */}
          <path d="M43,33 L46,32 L46.5,34 L46,36 L44.5,37.5 L42,37 L41,35.5 L42,34 Z" className="country-path" />

          {/* Italy */}
          <path d="M50,33 L51.5,33 L52,35 L51.5,37 L50.5,38.5 L50,37 L51,35 L50,33.5 Z" className="country-path" />

          {/* Germany/Benelux */}
          <path d="M48,28 L50,27.5 L52,28 L52.5,30 L51,31 L49,31 L48,30 Z" className="country-path" />

          {/* Scandinavia */}
          <path d="M50,18 L51,17 L52,18 L53,20 L52.5,23 L51.5,25 L50.5,26 L50,25 L49.5,23 L50,20 Z" className="country-path" />
          <path d="M53,19 L55,18 L56,19 L55.5,21 L54,22 L53,21 Z" className="country-path" />

          {/* Poland */}
          <path d="M52,28 L54.5,27.5 L55.5,28.5 L55,30.5 L53,31 L52,30 Z" className="country-path" />

          {/* Czech/Austria/Hungary region */}
          <path d="M51,31 L53,30.5 L55,31 L55,32.5 L53,33.5 L51,33 Z" className="country-path" />

          {/* Balkans/Greece */}
          <path d="M53,33.5 L55,33 L56,34 L56.5,36 L55,38 L53.5,37 L53,35 Z" className="country-path" />

          {/* Turkey */}
          <path d="M56,34 L58,33.5 L61,34 L63,35 L62,36.5 L59,37 L57,36 L56,35 Z" className="country-path" />

          {/* Lebanon/Middle East */}
          <path d="M59,38 L60.5,37.5 L62,38 L62.5,40 L62,42 L61,43 L59.5,43 L58,42 L57.5,40 Z" className="country-path" />
          <path d="M57.5,41 L59,40 L59.5,42 L59,43.5 L57.5,43 Z" className="country-path" />

          {/* North Africa */}
          <path d="M40,38 L45,37 L50,38 L55,39 L57,40 L56,43 L52,44 L46,44 L41,43 L39,41 Z" className="country-path" />

          {/* Russia/Eastern Europe */}
          <path d="M55,24 L60,22 L65,21 L70,22 L75,24 L78,27 L76,30 L70,31 L65,30 L60,29 L57,27 L55.5,25 Z" className="country-path" />

          {/* Central Asia */}
          <path d="M65,30 L70,29 L75,30 L78,32 L76,35 L72,36 L68,35 L65,33 Z" className="country-path" />

          {/* China */}
          <path d="M75,30 L80,29 L84,31 L87,33 L88,36 L86,39 L83,40 L79,39 L76,37 L75,34 Z" className="country-path" />

          {/* Korea */}
          <path d="M86,33 L87,32 L88,33 L88,35 L87,36 L86,35 Z" className="country-path" />

          {/* Japan */}
          <path d="M88,33 L89,32 L90,33 L90.5,35 L90,37 L89,39 L88,40 L87.5,38 L88,36 L88.5,34 Z" className="country-path" />
          <path d="M87,39 L88,38.5 L88.5,40 L88,41 L87,40.5 Z" className="country-path" />

          {/* India */}
          <path d="M68,38 L72,37 L75,39 L76,42 L74,45 L71,46 L68,44 L67,41 Z" className="country-path" />

          {/* Southeast Asia */}
          <path d="M78,42 L82,41 L85,43 L84,46 L81,47 L78,45 Z" className="country-path" />
        </g>

        {/* Animated travel path */}
        {pathLength > 0 && (
          <path
            d={travelPathD}
            className="journey-travel-path"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
            }}
          />
        )}
        {/* Hidden path for measuring */}
        <path
          ref={pathRef}
          d={travelPathD}
          fill="none"
          stroke="none"
        />

        {/* Location pins */}
        {journeyPoints.map((point) => (
          <g key={point.id} onClick={() => handlePinClick(point)} className={getPinClass(point)}>
            {/* Pulse ring for current location */}
            {point.type === 'current' && (
              <circle
                cx={point.coordinates.x}
                cy={point.coordinates.y}
                r="1.2"
                className="journey-pin-pulse"
              />
            )}
            {/* Main pin */}
            <circle
              cx={point.coordinates.x}
              cy={point.coordinates.y}
              r={point.type === 'current' ? 0.8 : 0.6}
              className="journey-pin-dot"
            />
            {/* Label */}
            <text
              x={point.coordinates.x}
              y={point.coordinates.y - 1.5}
              className="journey-pin-label"
              textAnchor="middle"
            >
              {point.location.split(',')[0]}
            </text>

            {/* Sub-locations (Japan) */}
            {point.subLocations && expandedSub === point.id && (
              <g className="journey-sub-locations">
                {point.subLocations.map((sub) => (
                  <g key={sub.name}>
                    <line
                      x1={point.coordinates.x}
                      y1={point.coordinates.y}
                      x2={point.coordinates.x + sub.offset.x}
                      y2={point.coordinates.y + sub.offset.y}
                      className="journey-sub-line"
                    />
                    <circle
                      cx={point.coordinates.x + sub.offset.x}
                      cy={point.coordinates.y + sub.offset.y}
                      r="0.35"
                      className="journey-sub-dot"
                    />
                    <text
                      x={point.coordinates.x + sub.offset.x}
                      y={point.coordinates.y + sub.offset.y - 0.8}
                      className="journey-sub-label"
                      textAnchor="middle"
                    >
                      {sub.name}
                    </text>
                  </g>
                ))}
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default JourneyMap;
