/**
 * Aurora ambient field — Soft Gradients 2.0. Four large, heavily blurred
 * chromatic orbs (crimson / red / coral / a faint gold) that drift slowly
 * behind the page as lighting, not decoration. Strength + colors are theme-driven via CSS tokens;
 * drift is disabled under prefers-reduced-motion (see globals.css).
 *
 * Pure CSS, fixed at z-index -1, pointer-events none — zero JS, zero weight.
 */
export function Ambient() {
  return (
    <div className="aurora" aria-hidden>
      <span className="aurora-orb o1" />
      <span className="aurora-orb o2" />
      <span className="aurora-orb o3" />
      <span className="aurora-orb o4" />
    </div>
  )
}
