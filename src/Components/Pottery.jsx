import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageMasthead from './PageMasthead';
import PotteryVessel from './Pottery/PotteryVessel';
import { potteryPieces, getPotteryStats } from '../Utils/potteryData';
import { pad2 } from '../Utils/ui';
import '../styles.css';

// The field-notes hero: the real photo if it's in the repo, otherwise the drawing.
// (So the shelf always shows the illustration; the photo only appears on click.)
function PieceImage({ piece }) {
  const [failed, setFailed] = useState(false);
  if (piece.photo && !failed) {
    return <img src={piece.photo} alt={piece.name} onError={() => setFailed(true)} />;
  }
  return <PotteryVessel art={piece.art} className="pot-vessel pot-vessel-lg" />;
}

/**
 * The /pottery page — a wheel-throwing log. An illustrated "shelf" of every pot,
 * each with a two-word win/oops; tapping a piece opens its full field notes
 * (tried / nice / oops / next). Data lives in Utils/potteryData; the little vessel
 * drawings in Pottery/PotteryVessel. A real photo on a piece shows in place of the
 * drawing in the notes.
 */
function Pottery() {
  const [selected, setSelected] = useState(null);
  const stats = getPotteryStats();

  // Fill shelves top-down, then pad with empty shelves so it reads as a whole
  // shelf unit / wall with room to grow as more pots are made.
  const PER_SHELF = 3;
  const MIN_SHELVES = 2;
  const shelves = [];
  for (let i = 0; i < potteryPieces.length; i += PER_SHELF) {
    shelves.push(potteryPieces.slice(i, i + PER_SHELF));
  }
  while (shelves.length < MIN_SHELVES) shelves.push([]);

  // Esc closes the field notes; lock the background scroll while they're open.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    if (selected) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [selected]);

  return (
    <div className="page-container">
      <Navbar />

      <PageMasthead
        section="KILN SHELF"
        eyebrow="what I've thrown"
        title="Pottery"
        stats={[
          { value: pad2(stats.pieces), label: 'Pieces' },
          { value: pad2(stats.glazes), label: 'Glazes' },
        ]}
        live="Still learning"
      />

      <div className="pot-intro">
        <p>A shelf of the pots I've thrown, with an honest note on what came out nice and what went wrong. Tap a piece for its field notes.</p>
      </div>

      <section className="pot-shelf-wrap" aria-label="Pottery shelf">
        <div className="pot-studio">
          {shelves.map((row, i) => (
            <div className="pot-level" key={i}>
              <div className="pot-level-pots">
                {row.map((p) => (
                  <button
                    key={p.id}
                    className="pot-stand"
                    style={{ '--pot-accent': p.accent }}
                    onClick={() => setSelected(p)}
                    title={`${p.name} · ${p.glaze}`}
                    aria-label={`${p.name}, open field notes`}
                  >
                    <PotteryVessel art={p.art} />
                  </button>
                ))}
              </div>
              <div className="pot-plank" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="pot-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="pot-modal"
            style={{ '--pot-accent': selected.accent }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} field notes`}
          >
            <button className="pot-modal-close" onClick={() => setSelected(null)} aria-label="Close field notes">✕</button>
            <div className="pot-modal-plate">
              <PieceImage piece={selected} />
            </div>
            <div className="pot-modal-body">
              <div className="pot-modal-eyebrow">{selected.form}</div>
              <h2 className="pot-modal-title">{selected.name}</h2>
              <div className="pot-modal-meta">{selected.glaze} · fired {selected.fired}</div>
              <div className="pot-notes">
                <div className="pot-note"><span className="pot-nlab">tried</span><span>{selected.notes.tried}</span></div>
                <div className="pot-note"><span className="pot-nlab pot-nlab-nice">nice</span><span>{selected.notes.nice}</span></div>
                <div className="pot-note"><span className="pot-nlab pot-nlab-oops">oops</span><span>{selected.notes.oops}</span></div>
                <div className="pot-note"><span className="pot-nlab">next</span><span>{selected.notes.next}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Pottery;
