import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import JourneyMap from './Journey/JourneyMap';
import JourneyTimeline from './Journey/JourneyTimeline';
import { journeyPoints } from '../Utils/journeyData';
import '../styles.css';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

function Journey() {
  const [activePointId, setActivePointId] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollSpeed = useRef(0);
  const lastScrollTop = useRef(0);
  const entryRefs = useRef({});
  const timelinePanelRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const panel = timelinePanelRef.current;
    if (!panel) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const delta = Math.abs(panel.scrollTop - lastScrollTop.current);
        lastScrollTop.current = panel.scrollTop;
        scrollSpeed.current = delta;

        const panelRect = panel.getBoundingClientRect();
        const panelCenter = panelRect.top + panelRect.height / 2;

        const entries = [];
        for (let i = 0; i < journeyPoints.length; i++) {
          const el = entryRefs.current[journeyPoints[i].id];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const elCenter = rect.top + rect.height / 2;
          entries.push({ id: journeyPoints[i].id, index: i, center: elCenter, dist: elCenter - panelCenter });
        }

        if (entries.length === 0) { ticking = false; return; }

        let closest = entries[0];
        for (const e of entries) {
          if (Math.abs(e.dist) < Math.abs(closest.dist)) closest = e;
        }

        if (Math.abs(closest.dist) < panelRect.height * 0.45) {
          setActivePointId(closest.id);
        } else {
          setActivePointId(null);
        }

        const n = journeyPoints.length;
        const baseProgress = closest.index / (n - 1);

        let neighbor = null;
        if (closest.dist > 0 && closest.index > 0) {
          neighbor = entries.find(e => e.index === closest.index - 1);
        } else if (closest.dist < 0 && closest.index < n - 1) {
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
  }, [isMobile]);

  const registerRef = useCallback((id, el) => {
    entryRefs.current[id] = el;
  }, []);

  const mapPanelRef = useRef(null);
  useEffect(() => {
    if (isMobile) return;
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
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="journey-mobile-fallback">
          <p className="journey-mobile-text">
            better to see it on your laptop for now
          </p>
        </div>
        <Footer />
      </div>
    );
  }

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
