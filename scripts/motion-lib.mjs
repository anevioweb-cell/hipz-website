// Shared motion-measurement helpers (Phase 6 Part C). Records BEHAVIOR only — computed transform /
// opacity / filter / clip of animated elements per animation frame — never code or assets. Element
// labels (short text) are kept only in the raw dumps under docs/shots/motion/ (gitignored); summaries
// label elements by type and size. Used by measure-motion.mjs (reference) and compare-motion.mjs (ours).

// ---------- in-page sampler (serialised into addInitScript) ----------
export function samplerInit() {
  const ids = new WeakMap();
  const meta = [];
  const rows = [];
  const fixed = [];
  let n = 0;
  const last = new Map();
  const t0 = performance.now();
  const labelOf = (e) => {
    const block = e.closest('h1,h2,h3,h4,h5,h6,p,a,button,li,[data-framer-name],[data-mm]') || e;
    return {
      block: block === e ? null : block,
      label:
        (block.getAttribute?.('data-framer-name') ||
          block.getAttribute?.('data-mm') ||
          block.tagName) +
        ':' +
        (block.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48),
    };
  };
  const idOf = (e) => {
    let id = ids.get(e);
    if (id !== undefined) return id;
    id = n++;
    ids.set(e, id);
    const { block, label } = labelOf(e);
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    meta[id] = {
      id,
      tag: e.tagName,
      name: e.getAttribute('data-framer-name') || e.getAttribute('data-mm') || null,
      text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48),
      chars: (e.textContent || '').trim().length,
      display: cs.display,
      label,
      blockId: block ? idOf(block) : null,
      parentOverflow: e.parentElement ? getComputedStyle(e.parentElement).overflow : null,
      origin: cs.transformOrigin,
      w: Math.round(r.width),
      h: Math.round(r.height),
      fontSize: parseFloat(cs.fontSize),
    };
    return id;
  };
  const SEL = '[style*="transform"],[style*="opacity"],[style*="filter"],[style*="clip"]';
  const frame = () => {
    const t = Math.round((performance.now() - t0) * 10) / 10;
    const sy = Math.round(scrollY);
    for (const e of document.querySelectorAll(SEL)) {
      const c = getComputedStyle(e);
      const v = c.transform + '|' + c.opacity + '|' + c.filter + '|' + c.clipPath;
      const id = idOf(e);
      if (last.get(id) === v) continue;
      last.set(id, v);
      const r = e.getBoundingClientRect();
      rows.push([
        id,
        t,
        sy,
        c.transform,
        +c.opacity,
        c.filter,
        c.clipPath,
        Math.round(r.top),
        innerHeight,
      ]);
    }
    for (const f of fixed) {
      const r = f.el.getBoundingClientRect();
      const c = getComputedStyle(f.el);
      const v =
        Math.round(r.top) + '|' + c.transform + '|' + c.opacity + '|' + Math.round(r.height);
      if (v !== f.last) {
        f.last = v;
        f.rows.push([
          t,
          sy,
          Math.round(r.top),
          Math.round(r.height),
          c.transform,
          +c.opacity,
          c.backgroundColor,
        ]);
      }
    }
    requestAnimationFrame(frame);
  };
  window.__mm = {
    t0,
    findFixed() {
      for (const el of document.querySelectorAll('body *')) {
        const p = getComputedStyle(el).position;
        if ((p === 'fixed' || p === 'sticky') && el.getBoundingClientRect().height > 20)
          fixed.push({
            el,
            label: (el.getAttribute('data-framer-name') || el.tagName) + '.' + p,
            rows: [],
            last: '',
          });
      }
    },
    dump() {
      return { meta, rows, fixed: fixed.map((f) => ({ label: f.label, rows: f.rows })) };
    },
  };
  const go = () => requestAnimationFrame(frame);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
}

// ---------- matrix parsing ----------
function decompose(a, b, c, d, e, f) {
  const sx = Math.hypot(a, b);
  const rot = sx ? (Math.atan2(b, a) * 180) / Math.PI : 0;
  const det = a * d - b * c;
  const sy = sx ? det / sx : Math.hypot(c, d);
  const skew = sx ? (Math.atan2(a * c + b * d, det) * 180) / Math.PI : 0;
  return { tx: e, ty: f, sx, sy, rot, skew };
}
export function parseTf(tf) {
  if (!tf || tf === 'none') return { tx: 0, ty: 0, sx: 1, sy: 1, rot: 0, skew: 0 };
  const m = tf.match(/^matrix\(([^)]+)\)/);
  if (m) {
    const [a, b, c, d, e, f] = m[1].split(',').map(Number);
    return decompose(a, b, c, d, e, f);
  }
  const m3 = tf.match(/^matrix3d\(([^)]+)\)/);
  if (!m3) return { tx: 0, ty: 0, sx: 1, sy: 1, rot: 0, skew: 0 };
  const v = m3[1].split(',').map(Number);
  return decompose(v[0], v[1], v[4], v[5], v[12], v[13]);
}
const blurOf = (f) => {
  const m = f && f.match(/blur\(([\d.]+)px\)/);
  return m ? +m[1] : 0;
};

// ---------- spring / tween models ----------
// Normalised step response of a damped spring (mass m, stiffness k, damping c) from 0 to 1, v0 = 0.
export function springCurve(k, c, m = 1, dt = 1 / 240, T = 3) {
  const out = [];
  let x = 0;
  let v = 0;
  for (let t = 0; t <= T; t += dt) {
    out.push([t * 1000, x]);
    const a = (-k * (x - 1) - c * v) / m;
    v += a * dt;
    x += v * dt;
  }
  return out;
}
export function bezier(p1x, p1y, p2x, p2y) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (X(mid) < x) lo = mid;
      else hi = mid;
    }
    return Y((lo + hi) / 2);
  };
}
export const valueAt = (curve, ms) => {
  if (ms <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++)
    if (curve[i][0] >= ms) {
      const [t0, v0] = curve[i - 1];
      const [t1, v1] = curve[i];
      return t1 === t0 ? v1 : v0 + ((v1 - v0) * (ms - t0)) / (t1 - t0);
    }
  return curve.at(-1)[1];
};
// pts: [[ms since start, progress 0..1 (may overshoot)]]
export function fitSpring(pts) {
  let best = null;
  for (let k = 40; k <= 1200; k += k < 200 ? 10 : 25)
    for (let c = 4; c <= 80; c += 1) {
      const curve = springCurve(k, c, 1, 1 / 240, 2.5);
      let err = 0;
      for (const [t, p] of pts) err += (valueAt(curve, t) - p) ** 2;
      err = Math.sqrt(err / pts.length);
      if (!best || err < best.rmse) best = { stiffness: k, damping: c, mass: 1, rmse: err };
    }
  const zeta = best.damping / (2 * Math.sqrt(best.stiffness * best.mass));
  const curve = springCurve(best.stiffness, best.damping);
  const peak = Math.max(...curve.map((x) => x[1]));
  const settle = curve.findLast((x) => Math.abs(x[1] - 1) > 0.005)?.[0] ?? 0;
  return {
    ...best,
    dampingRatio: +zeta.toFixed(3),
    overshoot: +(peak - 1).toFixed(4),
    settleMs: Math.round(settle),
    rmse: +best.rmse.toFixed(4),
  };
}
export const EASES = {
  'ease-out-quint [0.22,1,0.36,1]': [0.22, 1, 0.36, 1],
  'ease-out [0,0,0.58,1]': [0, 0, 0.58, 1],
  'ease [0.25,0.1,0.25,1]': [0.25, 0.1, 0.25, 1],
  'ease-in-out [0.42,0,0.58,1]': [0.42, 0, 0.58, 1],
  'in-out [0.44,0,0.56,1]': [0.44, 0, 0.56, 1],
  'out-expo [0.16,1,0.3,1]': [0.16, 1, 0.3, 1],
  linear: [0, 0, 1, 1],
};
export function fitTween(pts, durationMs) {
  let best = null;
  for (const [name, b] of Object.entries(EASES)) {
    const f = bezier(...b);
    for (let d = Math.max(100, durationMs * 0.6); d <= durationMs * 1.4; d += 10) {
      let err = 0;
      for (const [t, p] of pts) err += (f(Math.min(1, t / d)) - p) ** 2;
      err = Math.sqrt(err / pts.length);
      if (!best || err < best.rmse)
        best = { ease: name, durationMs: Math.round(d), rmse: +err.toFixed(4) };
    }
  }
  return best;
}

// ---------- analysis of one element's series ----------
const props = (r) => {
  const t = parseTf(r[3]);
  return {
    t: r[1],
    sy: r[2],
    tx: t.tx,
    ty: t.ty,
    s: (t.sx + t.sy) / 2,
    rot: t.rot,
    skew: t.skew,
    op: r[4],
    blur: blurOf(r[5]),
    clip: r[6],
    top: r[7],
    vh: r[8],
  };
};
export function seriesOf(dump) {
  const by = new Map();
  for (const r of dump.rows) {
    if (!by.has(r[0])) by.set(r[0], []);
    by.get(r[0]).push(props(r));
  }
  return by;
}
const round = (v) => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v);
const KEYS = ['tx', 'ty', 's', 'rot', 'op', 'blur'];

// The main animation of an element inside [from, to] ms: from its first change to its final state.
// Samples are written only when a value changes, so the row before the first change is the resting
// initial state; the motion starts one frame (≈16.7 ms) before the first changed row.
export function analyse(series, { from = -1, to = Infinity } = {}) {
  const s = series.filter((x) => x.t >= from && x.t <= to);
  if (s.length < 3) return null;
  const first = s[0];
  const fin = s.at(-1);
  const moving = KEYS.filter(
    (k) => Math.abs(first[k] - fin[k]) > (k === 'op' || k === 's' ? 0.01 : 0.5),
  );
  if (!moving.length) return null;
  const main = moving.includes('s')
    ? 's'
    : moving.includes('ty')
      ? 'ty'
      : moving.includes('tx')
        ? 'tx'
        : moving[0];
  const v0 = first[main];
  const v1 = fin[main];
  const thr = Math.abs(v1 - v0) * 0.002;
  // the motion starts after the LAST frame still at the initial value (ignores a one-frame flicker
  // some reference elements show just before they animate)
  const lastAtStart = s.findLastIndex((x, i) => i < s.length - 1 && Math.abs(x[main] - v0) <= thr);
  const firstChange = lastAtStart + 1;
  if (firstChange < 1 || firstChange >= s.length) return null;
  const startRow = s[firstChange];
  const start = startRow.t - 16.7;
  const endRow = s.findLast((x) => Math.abs(x[main] - v1) > Math.abs(v1 - v0) * 0.005) || fin;
  const pts = [
    [0, 0],
    ...s.slice(firstChange).map((x) => [x.t - start, (x[main] - v0) / (v1 - v0)]),
  ];
  const peak = Math.max(...pts.map((p) => p[1]));
  const opDone = s.slice(firstChange).find((x) => Math.abs(x.op - fin.op) < 0.01);
  const duration = endRow.t - start;
  return {
    property: main,
    animated: moving,
    start: Math.round(start),
    durationMs: Math.round(duration),
    initial: Object.fromEntries(KEYS.map((k) => [k, round(first[k])])),
    final: Object.fromEntries(KEYS.map((k) => [k, round(fin[k])])),
    overshoot: +(peak - 1).toFixed(4),
    opacityDoneMs: opDone ? Math.round(opDone.t - start) : null,
    triggerTopVh: startRow.vh ? +(startRow.top / startRow.vh).toFixed(3) : null,
    scrollAtStart: startRow.sy,
    frames: pts.length,
    spring: duration > 30 ? fitSpring(pts) : null,
    tween: duration > 30 ? fitTween(pts, Math.max(duration, 50)) : null,
    curve: pts.map(([t, p]) => [Math.round(t), +p.toFixed(4)]),
  };
}

// unit type of a text piece
export function unitOf(m) {
  if (m.chars === 1 && /inline/.test(m.display)) return 'char';
  if (m.chars > 1 && !/\s/.test(m.text) && /inline/.test(m.display)) return 'word';
  return 'block';
}
export const median = (a) => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

// Neutral element kind for the committed summary (no reference text).
function kindOf(head, block) {
  const b = block || head.m;
  const name = b.name || head.m.name;
  if (b.tag === 'H1') return 'hero headline (h1)';
  if (/^H[23]$/.test(b.tag)) return 'section heading';
  if (/^H[4-6]$/.test(b.tag)) return 'small heading';
  if (b.tag === 'P') return 'paragraph';
  if (b.tag === 'A' || b.tag === 'BUTTON') return 'button/link';
  if (b.tag === 'LI') return 'list item';
  if (name) return `block "${/ can$/.test(name) ? 'Can' : name}"`;
  return `block (${head.m.w}×${head.m.h})`;
}

// Summarise one scenario dump: per animated element, then per text block (stagger, unit, trigger).
export function summarise(dump, { from = -1, to = Infinity, minStart = -1 } = {}) {
  const by = seriesOf(dump);
  const elements = [];
  for (const [id, series] of by) {
    const m = dump.meta[id];
    if (!m || series.length > 900) continue; // continuous marquee / carousel tracks are reported apart
    const a = analyse(series, { from, to });
    if (!a || a.durationMs < 40 || a.start < minStart) continue;
    elements.push({ id, m, unit: unitOf(m), ...a });
  }
  const groups = new Map();
  for (const e of elements) {
    const key = e.unit === 'block' ? `e${e.id}` : `b${e.m.blockId}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  const out = [];
  for (const [, g] of groups) {
    g.sort((a, b) => a.id - b.id);
    const starts = g.map((e) => e.start);
    const diffs = starts.slice(1).map((v, i) => v - starts[i]);
    const head = g[0];
    const earliest = g.reduce((a, e) => (e.start < a.start ? e : a));
    const springs = g.map((e) => e.spring).filter(Boolean);
    const block = head.m.blockId != null ? dump.meta[head.m.blockId] : null;
    out.push({
      kind: kindOf(head, block),
      unit: head.unit,
      units: g.length,
      fontSize: head.m.fontSize,
      size: [head.m.w, head.m.h],
      parentOverflow: head.m.parentOverflow,
      transformOrigin: head.m.origin,
      animated: head.animated,
      initial: head.initial,
      final: head.final,
      firstStartMs: Math.min(...starts),
      staggerMs: diffs.length ? +median(diffs).toFixed(1) : null,
      staggerRange: diffs.length
        ? [Math.round(Math.min(...diffs)), Math.round(Math.max(...diffs))]
        : null,
      unitDurationMs: Math.round(median(g.map((e) => e.durationMs))),
      totalMs: Math.round(Math.max(...g.map((e) => e.start + e.durationMs)) - Math.min(...starts)),
      overshoot: +median(g.map((e) => e.overshoot)).toFixed(4),
      opacityDoneMs: median(g.map((e) => e.opacityDoneMs).filter((x) => x !== null)),
      triggerTopVh: earliest.triggerTopVh,
      scrollAtStart: earliest.scrollAtStart,
      spring: springs.length
        ? {
            stiffness: median(springs.map((x) => x.stiffness)),
            damping: median(springs.map((x) => x.damping)),
            mass: 1,
            dampingRatio: median(springs.map((x) => x.dampingRatio)),
            overshoot: median(springs.map((x) => x.overshoot)),
            settleMs: median(springs.map((x) => x.settleMs)),
            rmse: median(springs.map((x) => x.rmse)),
          }
        : null,
      tween: head.tween,
      curve: head.curve,
      _label: head.m.label, // raw only; stripped before writing the committed summary
    });
  }
  return out.sort((a, b) => a.firstStartMs - b.firstStartMs);
}

// replay rule: after leaving the viewport, does an element reset to its initial state and play again?
export function replayRule(dump, marks) {
  const t = Object.fromEntries(marks);
  const by = seriesOf(dump);
  let total = 0;
  let exits = 0;
  let resets = 0;
  let replays = 0;
  for (const [, s] of by) {
    if (s.length > 900) continue;
    const first = s[0];
    const moved = (x) =>
      Math.abs(x.s - first.s) + Math.abs(x.op - first.op) + Math.abs(x.ty - first.ty) / 100 > 0.02;
    if (!s.some((x) => x.t < t.up && moved(x))) continue;
    total++;
    const during = s.filter((x) => x.t >= t.up && x.t < t.down2);
    if (during.length) exits++;
    if (during.some((x) => !moved(x))) resets++;
    if (s.some((x) => x.t >= t.down2)) replays++;
  }
  return {
    animatedElements: total,
    changedWhileScrollingUp: exits,
    resetToInitial: resets,
    animatedAgainOnSecondPass: replays,
  };
}

export function fixedSummary(dump) {
  return dump.fixed.map((f) => ({
    element: f.label.replace(/:.*/, ''),
    changes: f.rows.length,
    tops: [...new Set(f.rows.map((r) => r[2]))].slice(0, 12),
    transforms: [...new Set(f.rows.map((r) => r[4]))].slice(0, 6),
    opacities: [...new Set(f.rows.map((r) => r[5]))].slice(0, 6),
    backgrounds: [...new Set(f.rows.map((r) => r[6]))].slice(0, 6),
  }));
}

export function marqueeSummary(dump) {
  const by = seriesOf(dump);
  const out = [];
  for (const [id, s] of by) {
    if (s.length < 300) continue;
    const m = dump.meta[id];
    if (Math.abs(s.at(-1).tx - s[0].tx) < 50) continue;
    const v = (a, b) => (b.tx - a.tx) / ((b.t - a.t) / 1000);
    const firstMove = s.findIndex((x, i) => i > 0 && x.tx !== s[0].tx);
    const early =
      firstMove > 0 && s.length > firstMove + 15 ? v(s[firstMove], s[firstMove + 15]) : null;
    const late = v(s[Math.floor(s.length / 2)], s.at(-1));
    out.push({
      element: `${m.tag} (${m.w}×${m.h})`,
      firstMoveMs: firstMove > 0 ? Math.round(s[firstMove].t) : null,
      firstQuarterSecondPxPerS: early && Math.round(early),
      steadyPxPerS: Math.round(late),
    });
  }
  return out.slice(0, 6);
}
