import Clock from './Journey/Clock';
import { pad2 } from '../Utils/ui';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * A theme-aware terminal masthead shared by the non-journey pages: a mono system
 * line (RIWA HOTEIT · SECTION + live clock/date), an eyebrow, a Fraunces display
 * title with an accent dot, and a stats strip with an optional live "now" pip.
 * Mirrors the journey TerminalHeader's language using GLOBAL tokens so it follows
 * both substrates. Deliberately omits the airport-only ticker / split-flap, which
 * stay unique to /journey.
 *
 * @param {string} section  right-hand system id, e.g. "WORKLOG" (rendered upper)
 * @param {string} [eyebrow] small mono kicker above the title
 * @param {string} [title]   Fraunces display word (a trailing "." dot is added)
 * @param {Array<{value?:string,label:string}>} [stats]  stat cells
 * @param {string} [live]    optional live-pip label, e.g. "Now at Mistral"
 * @param {boolean} [compact] slim variant — system line only (no title/stats)
 */
function PageMasthead({ section, eyebrow, title, stats = [], live, compact = false }) {
  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]} ${pad2(now.getDate())} ${MONS[now.getMonth()]}`;

  return (
    <header className={`pm${compact ? ' pm-compact' : ''}`}>
      <div className="pm-id">
        <span className="pm-code">RIWA HOTEIT <span className="pm-sys">· {section}</span></span>
        <span className="pm-now">
          <Clock seconds className="pm-clock" />
          <span className="pm-date">{dateStr}</span>
        </span>
      </div>

      {!compact && (
        <>
          {eyebrow && <div className="pm-eyebrow">{eyebrow}</div>}
          {title && <h1 className="pm-h1">{title}<span className="pm-dot">.</span></h1>}
          {(stats.length > 0 || live) && (
            <div className="pm-stats">
              {stats.map((s, i) => (
                <span key={s.label}>
                  {s.value && <b>{s.value}</b>} {s.label}
                  {i < stats.length - 1 && <span className="pm-sep" aria-hidden="true" />}
                </span>
              ))}
              {live && (
                <span className="pm-live-wrap"><span className="pm-live" aria-hidden="true" /> {live}</span>
              )}
            </div>
          )}
        </>
      )}
    </header>
  );
}

export default PageMasthead;
