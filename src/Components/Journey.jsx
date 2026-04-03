import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import JourneyMap from './Journey/JourneyMap';
import JourneyTimeline from './Journey/JourneyTimeline';
import { journeyPoints } from '../Utils/journeyData';
import '../styles.css';

function Journey() {
  const [activePointId, setActivePointId] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollSpeed = useRef(0);
  const lastScrollTop = useRef(0);
  const entryRefs = useRef({});
  const timelinePanelRef = useRef(null);

  useEffect(() => {
    const panel = timelinePanelRef.current;
    if (!panel) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Track scroll speed
        const delta = Math.abs(panel.scrollTop - lastScrollTop.current);
        lastScrollTop.current = panel.scrollTop;
        scrollSpeed.current = delta;

        const panelRect = panel.getBoundingClientRect();
        const panelCenter = panelRect.top + panelRect.height / 2;

        // Build array of { id, index, center distance }
        const entries = [];
        for (let i = 0; i < journeyPoints.length; i++) {
          const el = entryRefs.current[journeyPoints[i].id];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const elCenter = rect.top + rect.height / 2;
          entries.push({ id: journeyPoints[i].id, index: i, center: elCenter, dist: elCenter - panelCenter });
        }

        if (entries.length === 0) { ticking = false; return; }

        // Find closest entry
        let closest = entries[0];
        for (const e of entries) {
          if (Math.abs(e.dist) < Math.abs(closest.dist)) closest = e;
        }

        // Set active point
        if (Math.abs(closest.dist) < panelRect.height * 0.45) {
          setActivePointId(closest.id);
        } else {
          setActivePointId(null);
        }

        // Calculate continuous progress (0 to 1)
        // Base progress from the closest card's index
        const n = journeyPoints.length;
        // Find which neighbor we're interpolating toward
        const baseProgress = closest.index / (n - 1);

        // Interpolate: if scroll is between two cards, blend
        let neighbor = null;
        if (closest.dist > 0 && closest.index > 0) {
          // Panel center is above the closest card center → blending with previous
          neighbor = entries.find(e => e.index === closest.index - 1);
        } else if (closest.dist < 0 && closest.index < n - 1) {
          // Panel center is below → blending with next
          neighbor = entries.find(e => e.index === closest.index + 1);
        }

        if (neighbor) {
          const totalDist = Math.abs(neighbor.center - closest.center);
          const blend = totalDist > 0 ? Math.abs(closest.dist) / totalDist : 0;
          const neighborProgress = neighbor.index / (n - 1);
          setScrollProgress(baseProgress + (neighborProgress - baseProgress) * blend);
        } else {
          setScrollProgress(baseProgress);
        }

        ticking = false;
      });
    };

    panel.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => panel.removeEventListener('scroll', onScroll);
  }, []);

  const registerRef = useCallback((id, el) => {
    entryRefs.current[id] = el;
  }, []);

  // Forward wheel events from the map panel to the timeline panel
  const mapPanelRef = useRef(null);
  useEffect(() => {
    const mapPanel = mapPanelRef.current;
    if (!mapPanel) return;
    const handler = (e) => {
      e.preventDefault();
      const panel = timelinePanelRef.current;
      if (panel) {
        panel.scrollTop += e.deltaY;
      }
    };
    mapPanel.addEventListener('wheel', handler, { passive: false });
    return () => mapPanel.removeEventListener('wheel', handler);
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="journey-layout">
        <div className="journey-map-panel" ref={mapPanelRef}>
          <JourneyMap activePointId={activePointId} scrollProgress={scrollProgress} scrollSpeedRef={scrollSpeed} />
        </div>
        <div className="journey-timeline-panel" ref={timelinePanelRef}>
          <JourneyTimeline
            activePointId={activePointId}
            registerRef={registerRef}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Journey;
