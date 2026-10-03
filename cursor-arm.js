(function () {
  const svgNS = "http://www.w3.org/2000/svg";

  let L1, L2;
  let HW1, HW2;
  let baseX, baseY;
  let headerH = 80;
  let shoulderAngle = 200, elbowAngle = 40;
  let shoulderVel = 0, elbowVel = 0;
  const REACH_MARGIN = 18; // enough margin that the elbow keeps a visible, natural bend

  function getHeaderHeight() {
    const header = document.querySelector("header");
    return header ? header.offsetHeight : 80;
  }

  function computeLengths() {
    headerH = getHeaderHeight();
    const diag = Math.hypot(window.innerWidth, window.innerHeight);
    L1 = Math.min(300, Math.max(180, diag * 0.28));
    L2 = Math.min(260, Math.max(150, diag * 0.24));
    HW1 = 12;
    HW2 = 9;
  }

  function setBase() {
    baseX = window.innerWidth / 2;
    baseY = headerH / 2;
  }

  function segmentPath(len, hw) {
    return `M ${hw},${-hw} L ${len - hw},${-hw} A ${hw},${hw} 0 0 1 ${len - hw},${hw} L ${hw},${hw} A ${hw},${hw} 0 0 1 ${hw},${-hw} Z`;
  }

  function buildSVG() {
    const existing = document.getElementById("cursor-arm-wrap");
    if (existing) existing.remove();

    const wrap = document.createElement("div");
    wrap.id = "cursor-arm-wrap";

    const svg = document.createElementNS(svgNS, "svg");
    svg.id = "cursor-arm-svg";
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    svg.innerHTML = `
      <defs>
        <linearGradient id="cursorArmSeg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0A0D11"/>
          <stop offset="10%" stop-color="#2E3844"/>
          <stop offset="28%" stop-color="#4A5A70"/>
          <stop offset="48%" stop-color="#7CA0C4"/>
          <stop offset="52%" stop-color="#7CA0C4"/>
          <stop offset="72%" stop-color="#4A5A70"/>
          <stop offset="90%" stop-color="#2E3844"/>
          <stop offset="100%" stop-color="#0A0D11"/>
        </linearGradient>
        <radialGradient id="cursorJoint" cx="35%" cy="32%" r="72%">
          <stop offset="0%" stop-color="#9BB4D6"/>
          <stop offset="35%" stop-color="#4C5A6E"/>
          <stop offset="70%" stop-color="#242C38"/>
          <stop offset="100%" stop-color="#08090C"/>
        </radialGradient>
        <linearGradient id="cursorClaw" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#5A6C82"/>
          <stop offset="60%" stop-color="#242C38"/>
          <stop offset="100%" stop-color="#08090C"/>
        </linearGradient>
      </defs>

      <rect x="${baseX - 22}" y="2" width="44" height="16" rx="3" fill="#15181D" stroke="#050607" stroke-width="1.5"/>
      <circle cx="${baseX - 13}" cy="10" r="2" fill="#3A4048"/>
      <circle cx="${baseX + 13}" cy="10" r="2" fill="#3A4048"/>
      <rect x="${baseX - 16}" y="14" width="32" height="3" fill="#0A0C0F"/>

      <g id="baseCollar" style="transform-origin:${baseX}px ${baseY}px;">
        <circle cx="${baseX}" cy="${baseY}" r="17" fill="url(#cursorJoint)" stroke="#050607" stroke-width="1.6"/>
        <circle cx="${baseX}" cy="${baseY}" r="17" fill="none" stroke="#58A6FF" stroke-width="1.2" opacity="0.55" stroke-dasharray="2 4"/>
        <circle cx="${baseX}" cy="${baseY}" r="13" fill="none" stroke="#0A0C0F" stroke-width="1" opacity="0.6" stroke-dasharray="1 3"/>
        <rect x="${baseX - 2}" y="${baseY - 17}" width="4" height="7" fill="#58A6FF" opacity="0.85"/>
      </g>
      <circle cx="${baseX}" cy="${baseY}" r="6" fill="#7CC4FF" opacity="0.95"/>

      <g id="upperArmGroup">
        <path d="${segmentPath(L1, HW1)}" fill="url(#cursorArmSeg)" stroke="#050607" stroke-width="1.8"/>
        <path d="M ${HW1},${-HW1+2} L ${L1-HW1},${-HW1+2}" stroke="#8FB4DE" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
        <rect x="${L1*0.25}" y="${-HW1}" width="4" height="${HW1*2}" fill="#050607" opacity="0.6"/>
        <rect x="${L1*0.6}" y="${-HW1}" width="4" height="${HW1*2}" fill="#050607" opacity="0.6"/>
        <rect x="${L1*0.25-6}" y="${-HW1}" width="3" height="${HW1*2}" fill="#E8B84B" opacity="0.55"/>
        <rect x="${L1*0.6-6}" y="${-HW1}" width="3" height="${HW1*2}" fill="#E8B84B" opacity="0.55"/>

        <circle cx="0" cy="0" r="14" fill="url(#cursorJoint)" stroke="#050607" stroke-width="1.6"/>
        <circle cx="0" cy="0" r="14" fill="none" stroke="#58A6FF" stroke-width="1.2" opacity="0.55" stroke-dasharray="2 4"/>
        <circle cx="0" cy="0" r="5" fill="#7CC4FF" opacity="0.9"/>

        <g id="foreArmGroup" transform="translate(${L1},0)">
          <circle cx="0" cy="0" r="11" fill="url(#cursorJoint)" stroke="#050607" stroke-width="1.4"/>
          <circle cx="0" cy="0" r="11" fill="none" stroke="#58A6FF" stroke-width="1.1" opacity="0.55" stroke-dasharray="2 4"/>
          <circle cx="0" cy="0" r="4" fill="#7CC4FF" opacity="0.9"/>

          <path d="${segmentPath(L2, HW2)}" fill="url(#cursorArmSeg)" stroke="#050607" stroke-width="1.5"/>
          <path d="M ${HW2},${-HW2+1.5} L ${L2-HW2},${-HW2+1.5}" stroke="#8FB4DE" stroke-width="0.9" opacity="0.5" stroke-linecap="round"/>
          <rect x="${L2*0.3}" y="${-HW2}" width="3" height="${HW2*2}" fill="#050607" opacity="0.6"/>
          <rect x="${L2*0.3-5}" y="${-HW2}" width="2.5" height="${HW2*2}" fill="#E8B84B" opacity="0.5"/>

          <g id="wristPivot" transform="translate(${L2},0)"></g>
        </g>
      </g>
    `;

    wrap.appendChild(svg);
    document.body.appendChild(wrap);

    const wristPivot = svg.querySelector("#wristPivot");
    wristPivot.innerHTML = `
      <circle cx="0" cy="0" r="9" fill="url(#cursorJoint)" stroke="#050607" stroke-width="1.2"/>
      <circle cx="0" cy="0" r="9" fill="none" stroke="#58A6FF" stroke-width="1" opacity="0.55" stroke-dasharray="2 3"/>
      <circle cx="0" cy="0" r="3.2" fill="#7CC4FF" opacity="0.95"/>
      <g id="clawUpper">
        <path d="M 7,-4 C 16,-9 26,-12 31,-19 C 34,-23 30,-26 27,-23 C 19,-18 12,-11 6,-6 Z"
              fill="url(#cursorClaw)" stroke="#050607" stroke-width="1.2"/>
        <path d="M 9,-6 C 16,-11 22,-14 26,-19" stroke="#8FB4DE" stroke-width="0.8" opacity="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="-21" r="1.6" fill="#7CC4FF" opacity="0.9"/>
      </g>
      <g id="clawLower">
        <path d="M 7,4 C 16,9 26,12 31,19 C 34,23 30,26 27,23 C 19,18 12,11 6,6 Z"
              fill="url(#cursorClaw)" stroke="#050607" stroke-width="1.2"/>
        <path d="M 9,6 C 16,11 22,14 26,19" stroke="#8FB4DE" stroke-width="0.8" opacity="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="21" r="1.6" fill="#7CC4FF" opacity="0.9"/>
      </g>
    `;

    return svg;
  }

  // Standard 2-bone analytic IK. A single fixed elbowSign is used consistently
  // in BOTH the shoulder-offset and elbow-angle terms, which is what keeps the
  // bend direction stable and physically coherent across every target position —
  // mixing signs between the two terms is what caused the "broken" kinks before.
  function solveIK(dx, dy) {
    let d = Math.sqrt(dx * dx + dy * dy);
    const maxReach = L1 + L2 - REACH_MARGIN;
    const minReach = Math.abs(L1 - L2) + 1;
    d = Math.max(minReach, Math.min(maxReach, d));
    const cosElbow = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const elbow = Math.acos(Math.min(1, Math.max(-1, cosElbow)));
    const elbowSign = -1;
    const shoulderOffset = Math.atan2(elbowSign * L2 * Math.sin(elbow), L1 + L2 * Math.cos(elbow));
    const shoulder = Math.atan2(dy, dx) - shoulderOffset;
    return {
      shoulder: shoulder * 180 / Math.PI,
      elbow: elbowSign * elbow * 180 / Math.PI
    };
  }

  let mouseX = null, mouseY = null;
  window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  // only active while the hero is at least partly on screen — once the user
  // scrolls into the actual content, the arm hides instead of dangling down the page
  function checkActive() {
    const hero = document.querySelector(".hero-stage");
    const wrap = document.getElementById("cursor-arm-wrap");
    if (!hero || !wrap) return;
    const rect = hero.getBoundingClientRect();
    wrap.style.opacity = rect.bottom > 40 ? "1" : "0";
  }
  window.addEventListener("scroll", checkActive, { passive: true });

  let idleT = 0;
  let collarT = 0;

  function animate() {
    try {
      let tx, ty;
      if (mouseX === null) {
        // idle sweep: clearly visible motion, kept close to the header instead
        // of drifting down into the page content while no one's moved the mouse
        idleT += 0.022;
        tx = baseX + Math.sin(idleT) * (L1 * 0.55);
        ty = baseY + Math.min(80, headerH * 0.85) + Math.cos(idleT * 0.8) * 26;
      } else {
        tx = mouseX;
        ty = mouseY;
      }

      const dx = tx - baseX;
      const dy = ty - baseY;
      const target = solveIK(dx, dy);

      const stiffness = 0.11;
      const damping = 0.70;

      let diffS = target.shoulder - shoulderAngle;
      diffS = ((diffS + 180) % 360 + 360) % 360 - 180;
      shoulderVel = shoulderVel * damping + diffS * stiffness;
      shoulderAngle += shoulderVel;

      let diffE = target.elbow - elbowAngle;
      elbowVel = elbowVel * damping + diffE * stiffness;
      elbowAngle += elbowVel;

      const upperArmGroup = document.getElementById("upperArmGroup");
      const foreArmGroup = document.getElementById("foreArmGroup");
      const baseCollar = document.getElementById("baseCollar");
      if (upperArmGroup && foreArmGroup) {
        upperArmGroup.setAttribute("transform", `translate(${baseX},${baseY}) rotate(${shoulderAngle})`);
        foreArmGroup.setAttribute("transform", `translate(${L1},0) rotate(${elbowAngle})`);
      }
      if (baseCollar) {
        collarT += 0.01;
        baseCollar.setAttribute("transform", `rotate(${Math.sin(collarT) * 10} ${baseX} ${baseY})`);
      }
    } catch (err) {
      // never let a transient error permanently freeze the arm in place
    }

    requestAnimationFrame(animate);
  }

  function spawnRipple(x, y) {
    const r = document.createElement("div");
    r.className = "click-ripple";
    r.style.left = x + "px";
    r.style.top = y + "px";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 650);
  }

  function pinchClaw() {
    const upper = document.getElementById("clawUpper");
    const lower = document.getElementById("clawLower");
    if (!upper || !lower) return;
    [upper, lower].forEach(el => el.style.transition = "transform 0.14s ease-out");
    upper.style.transform = "rotate(16deg)";
    lower.style.transform = "rotate(-16deg)";
    setTimeout(() => {
      upper.style.transform = "rotate(0deg)";
      lower.style.transform = "rotate(0deg)";
    }, 150);
  }

  window.addEventListener("click", (e) => {
    spawnRipple(e.clientX, e.clientY);
    pinchClaw();
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeLengths();
      setBase();
      buildSVG();
      checkActive();
    }, 200);
  });

  function init() {
    if (window.matchMedia("(max-width: 860px)").matches) return;
    computeLengths();
    setBase();
    buildSVG();
    checkActive();
    requestAnimationFrame(animate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
