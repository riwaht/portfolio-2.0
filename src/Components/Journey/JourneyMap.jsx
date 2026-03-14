import { useRef, useEffect, useState, useMemo } from 'react';
import { journeyPoints, getSeasonalHue } from '../../Utils/journeyData';
import {
  generateDotPaths,
  VIEWBOX_W, VIEWBOX_H
} from '../../Utils/worldDotMap';

const ZOOM_W = VIEWBOX_W * 0.75;
const ZOOM_H = VIEWBOX_H * 0.75;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// TODO: Fix coordinates for all points

function JourneyMap({ activePointId, scrollProgress = 0, scrollSpeedRef }) {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [pointLengths, setPointLengths] = useState([]);

  const dotPaths = useMemo(() => generateDotPaths(), []);
  const activeIdx = journeyPoints.findIndex(p => p.id === activePointId);
  const pointCoords = useMemo(() => journeyPoints.map(p => p.coordinates), []);

  const activeCoords = activeIdx >= 0 ? pointCoords[activeIdx] : null;
  const seasonalHue = activeIdx >= 0 ? getSeasonalHue(journeyPoints[activeIdx].month) : null;

  // Travel path connects all points in chronological order
  const travelPathD = useMemo(() => {
    if (pointCoords.length < 2) return '';
    let d = `M ${pointCoords[0].x} ${pointCoords[0].y}`;
    for (let i = 1; i < pointCoords.length; i++) {
      const prev = pointCoords[i - 1];
      const curr = pointCoords[i];
      const dx = curr.x - prev.x;
      const cx = prev.x + dx * 0.5;
      const cy = prev.y - Math.abs(dx) * 0.12;
      d += ` Q ${cx} ${cy}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [pointCoords]);

  // Measure path lengths
  useEffect(() => {
    const svg = svgRef.current;
    const mainPath = pathRef.current;
    if (!svg || !mainPath) return;

    const total = mainPath.getTotalLength();
    setPathLength(total);

    const lengths = [0];
    for (let i = 1; i < pointCoords.length; i++) {
      const prev = pointCoords[i - 1];
      const curr = pointCoords[i];
      const dx = curr.x - prev.x;
      const cx = prev.x + dx * 0.5;
      const cy = prev.y - Math.abs(dx) * 0.12;
      const segPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      segPath.setAttribute('d', `M ${prev.x} ${prev.y} Q ${cx} ${cy}, ${curr.x} ${curr.y}`);
      svg.appendChild(segPath);
      const segLen = segPath.getTotalLength();
      svg.removeChild(segPath);
      lengths.push(lengths[i - 1] + segLen);
    }
    setPointLengths(lengths);
  }, [travelPathD, pointCoords]);

  // Path reveal offset — direct mapping from scroll progress
  const pathOffset = useMemo(() => {
    if (pathLength === 0 || pointLengths.length === 0) return pathLength;
    const n = pointLengths.length;
    const floatIdx = scrollProgress * (n - 1);
    const lo = Math.floor(floatIdx);
    const hi = Math.min(lo + 1, n - 1);
    const t = floatIdx - lo;
    const revealedLength = pointLengths[lo] + (pointLengths[hi] - pointLengths[lo]) * t;
    return pathLength - revealedLength;
  }, [scrollProgress, pathLength, pointLengths]);

  // Smooth-damped viewBox
  // Start centered on Beirut (first point)
  const firstCoord = pointCoords[0] || { x: VIEWBOX_W / 2, y: VIEWBOX_H / 2 };
  const initX = Math.max(0, Math.min(firstCoord.x - ZOOM_W / 2, VIEWBOX_W - ZOOM_W));
  const initY = Math.max(0, Math.min(firstCoord.y - ZOOM_H / 2, VIEWBOX_H - ZOOM_H));
  const targetVB = useRef({ x: initX, y: initY });
  const currentVB = useRef({ x: initX, y: initY });
  const animRef = useRef(null);
  const [viewBox, setViewBox] = useState(`${initX} ${initY} ${ZOOM_W} ${ZOOM_H}`);

  useEffect(() => {
    if (pointCoords.length === 0) return;
    const n = pointCoords.length;
    const floatIdx = scrollProgress * (n - 1);
    const lo = Math.floor(floatIdx);
    const hi = Math.min(lo + 1, n - 1);
    const t = floatIdx - lo;
    const cx = lerp(pointCoords[lo].x, pointCoords[hi].x, t);
    const cy = lerp(pointCoords[lo].y, pointCoords[hi].y, t);
    let vx = cx - ZOOM_W / 2;
    let vy = cy - ZOOM_H / 2;
    vx = Math.max(0, Math.min(vx, VIEWBOX_W - ZOOM_W));
    vy = Math.max(0, Math.min(vy, VIEWBOX_H - ZOOM_H));
    targetVB.current = { x: vx, y: vy };
  }, [scrollProgress, pointCoords]);

  useEffect(() => {
    const MIN_DAMPING = 0.03;
    const MAX_DAMPING = 0.18;
    const SPEED_THRESHOLD = 80;
    const tick = () => {
      const cur = currentVB.current;
      const tgt = targetVB.current;
      const speed = scrollSpeedRef ? scrollSpeedRef.current : 0;
      const speedFactor = Math.min(speed / SPEED_THRESHOLD, 1);
      const damping = MIN_DAMPING + (MAX_DAMPING - MIN_DAMPING) * speedFactor;
      cur.x += (tgt.x - cur.x) * damping;
      cur.y += (tgt.y - cur.y) * damping;
      setViewBox(`${cur.x} ${cur.y} ${ZOOM_W} ${ZOOM_H}`);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [scrollSpeedRef]);

  return (
    <div
      className="journey-map"
      style={seasonalHue !== null ? { '--season-hue': seasonalHue } : undefined}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="journey-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="pinGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
          <filter id="pathGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dot matrix landmasses — two paths instead of 5000 circles */}
        <path d={dotPaths.normalPath} className="journey-land-dot" />
        <path d={dotPaths.visitedPath} className="journey-land-dot visited" />

        {/* Travel path — glow */}
        {pathLength > 0 && (
          <path
            d={travelPathD}
            className="journey-travel-path-glow"
            filter="url(#pathGlow)"
            style={{ strokeDasharray: pathLength, strokeDashoffset: pathOffset }}
          />
        )}

        {/* Travel path — crisp */}
        {pathLength > 0 && (
          <path
            d={travelPathD}
            className="journey-travel-path"
            style={{ strokeDasharray: pathLength, strokeDashoffset: pathOffset }}
          />
        )}

        <path ref={pathRef} d={travelPathD} fill="none" stroke="none" />

        {/* Single active pin — the path is the history, this dot is the present */}
        {activeCoords && (
          <g className={`journey-pin journey-pin-${journeyPoints[activeIdx].type}`} key={activePointId}>
            {/* Ripple burst */}
            <circle cx={activeCoords.x} cy={activeCoords.y} r="0.4" className="journey-ripple journey-ripple-1" />
            <circle cx={activeCoords.x} cy={activeCoords.y} r="0.4" className="journey-ripple journey-ripple-2" />

            {/* Glow halo */}
            <circle cx={activeCoords.x} cy={activeCoords.y} r="1.2" filter="url(#pinGlow)" className="journey-pin-halo" />

            {/* Current-location pulse */}
            {journeyPoints[activeIdx].type === 'current' && (
              <circle cx={activeCoords.x} cy={activeCoords.y} r="0.7" className="journey-pin-pulse" />
            )}

            {/* Pin dot */}
            <circle cx={activeCoords.x} cy={activeCoords.y} r="0.5" className="journey-pin-dot journey-pin-state-active" />

            {/* Label */}
            <text
              x={activeCoords.x} y={activeCoords.y - 1.3}
              className="journey-pin-label active-label"
              textAnchor="middle"
            >
              {journeyPoints[activeIdx].city || journeyPoints[activeIdx].country}
            </text>
          </g>
        )}
      </svg>

      <div className="journey-map-vignette" />
    </div>
  );
}

export default JourneyMap;
