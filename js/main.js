/* Bruce Massingue — portfolio interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Year ---------- */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var toggle = $('#navToggle'), nav = $('#site-nav');
  function closeNav() { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- Scroll spy ---------- */
  var secs = $$('[data-section]');
  var links = $$('.pill-nav a');
  function spy() {
    var line = window.innerHeight * 0.38, cur = '';
    secs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) cur = s.getAttribute('data-section');
    });
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === cur); });
  }

  /* ---------- Hero parallax (watermark drifts slower than the page) ---------- */
  var wm = $('#watermark');
  function parallax() {
    if (reduce || !wm) return;
    var y = window.scrollY;
    if (y < window.innerHeight * 1.2) wm.style.transform = 'translate(-50%, calc(-50% + ' + (y * 0.18).toFixed(1) + 'px))';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { spy(); parallax(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* ---------- Reveal on scroll ---------- */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rev.forEach(function (n) { io.observe(n); });
  } else { rev.forEach(function (n) { n.classList.add('is-in'); }); }

  /* ---------- ID badge flick ---------- */
  var lan = $('#lanyard');
  if (lan) lan.addEventListener('click', function () {
    lan.classList.remove('is-flick'); void lan.offsetWidth; lan.classList.add('is-flick');
  });
  if (lan) lan.addEventListener('animationend', function (e) { if (e.animationName === 'flick') lan.classList.remove('is-flick'); });

  /* ---------- Periodic table of skills ---------- */
  var FAMILIES = [
    { id: 'support',  name: 'Support & hardware', c: '#25284A' },
    { id: 'network',  name: 'Networking',         c: '#444A7A' },
    { id: 'security', name: 'Security',           c: '#15172B' },
    { id: 'cloud',    name: 'Cloud & workspace',  c: '#6B6794' },
    { id: 'training', name: 'Training',           c: '#BDB48F' },
    { id: 'core',     name: 'Core',               c: '#D8D1B2' }
  ];
  var EL = [
    ['Hw', 'Hardware repair',   'support',  'Diagnosing and repairing desktops and laptops down to component level.'],
    ['Pc', 'PC assembly',       'support',  'Building and upgrading systems, and teaching it hands-on to 200+ people at the Hardware Basics Boot Camp.'],
    ['Hd', 'Helpdesk',          'support',  'First and second line support for users, on site and remote.'],
    ['Wn', 'Windows admin',     'support',  'Setup, user accounts, updates and day-to-day maintenance of Windows machines.'],
    ['Sw', 'Software',          'support',  'Installation, upgrades and troubleshooting across common business and productivity tools.'],
    ['Ap', 'CompTIA A+',        'support',  'Hardware and operating system support fundamentals (CompTIA A+ 1000, Part 2).'],
    ['Cc', 'CCNA',              'network',  'Switching, Routing and Wireless Essentials through the Cisco Networking Academy.'],
    ['Ip', 'TCP/IP',            'network',  'Addressing, subnetting and fault-finding on real networks.'],
    ['Rs', 'Routing & switching','network', 'Configuring and troubleshooting the devices that keep a network talking.'],
    ['Wf', 'Wi-Fi design',      'network',  'Wireless site design with Ekahau (ECSE Design certified).'],
    ['Lw', 'LAN / WLAN',        'network',  'Small office wired and wireless setups, from cabling to access points.'],
    ['Co', 'CyberOps',          'security', 'Cisco CyberOps Associate: security monitoring and threat analysis fundamentals.'],
    ['Ft', 'Fortinet',          'security', 'Fortinet Certified Fundamentals in Cybersecurity and the threat landscape.'],
    ['Ce', 'Cyber essentials',  'security', 'Cisco Cybersecurity Essentials: protecting people, devices and data.'],
    ['Ns', 'Network security',  'security', 'Digital network security fundamentals (Alison, 2024).'],
    ['M3', 'Microsoft 365',     'cloud',    'Administration, users and productivity solutions across Microsoft 365.'],
    ['Az', 'Azure',             'cloud',    'Azure monitoring tools (Microsoft, 2026).'],
    ['Gw', 'Google Workspace',  'cloud',    'Admin, email configuration and user management.'],
    ['Dn', 'Domains & email',   'cloud',    'Domain management and custom email setup for organisations.'],
    ['Wb', 'Website support',   'cloud',    'Maintenance and small-business web support through Bear Tech Solutions.'],
    ['Gd', 'Graphic design',    'cloud',    'Marketing collateral and visual assets for corporate and small-business clients.'],
    ['Dl', 'Digital literacy',  'training', 'Programmes for youth and adults, including the 16 Days of Activism rural outreach (600+ youth).'],
    ['Cf', 'Coding',            'training', 'Coding fundamentals taught to beginners from the first line.'],
    ['Rb', 'Robotics',          'training', 'Robotics instruction that lets learners build and program something real.'],
    ['Ie', 'IT Essentials',     'training', 'Facilitating Cisco IT Essentials modules for student cohorts.'],
    ['Cu', 'Curriculum',        'training', 'Planning and delivering ICT curriculum and student workshops.'],
    ['Ai', 'AI-assisted dev',   'training', 'Teaching app development with AI so it supports learners’ thinking rather than replacing it.'],
    ['Dt', 'Design thinking',   'training', 'Start with a real community problem, then prototype a solution.'],
    ['Es', 'Esports ops',       'training', 'Esports Manager: gaming network infrastructure, hardware tuning and tournament operations.'],
    ['Pm', 'Project mgmt',      'core',     'Google Project Management certificates: foundations and project initiation.'],
    ['Fa', 'Facilitation',      'core',     'Cisco Academy instructor and Most Innovative Facilitator of the Year (2025).'],
    ['Fs', 'First aid',         'core',     'CPR, AED and First Aid certified.']
  ];
  var famName = {}; FAMILIES.forEach(function (f) { famName[f.id] = f.name; });
  var grid = $('#ptGrid'), detail = $('#ptDetail'), chips = $('#familyChips');
  var activeFam = null;
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function showDetail(i) {
    var e = EL[i];
    detail.innerHTML =
      '<div class="pt-big" data-fam="' + e[2] + '"><span class="pt-num">' + pad(i + 1) + '</span><strong>' + e[0] + '</strong></div>' +
      '<h3>' + e[1] + '</h3><span class="fam">' + famName[e[2]] + '</span><p>' + e[3] + '</p>' +
      '<p class="pt-hint">Hover any element to see its detail.</p>';
    $$('.pt-tile', grid).forEach(function (t, k) { t.classList.toggle('is-sel', k === i); });
  }
  if (grid) {
    EL.forEach(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pt-tile'; b.setAttribute('data-fam', e[2]);
      b.setAttribute('aria-label', e[1] + ', ' + famName[e[2]]);
      b.innerHTML = '<span class="pt-num">' + pad(i + 1) + '</span><span class="pt-sym">' + e[0] + '</span><span class="pt-name">' + e[1] + '</span>';
      b.addEventListener('mouseenter', function () { showDetail(i); });
      b.addEventListener('focus', function () { showDetail(i); });
      b.addEventListener('click', function () { showDetail(i); });
      grid.appendChild(b);
    });
    FAMILIES.forEach(function (f) {
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'chip'; c.setAttribute('aria-pressed', 'false');
      c.style.setProperty('--c', f.c);
      c.innerHTML = '<i></i>' + f.name;
      c.addEventListener('click', function () {
        activeFam = (activeFam === f.id) ? null : f.id;
        $$('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c && activeFam === f.id)); });
        grid.classList.toggle('has-filter', !!activeFam);
        $$('.pt-tile', grid).forEach(function (t) { t.classList.toggle('is-lit', t.getAttribute('data-fam') === activeFam); });
      });
      chips.appendChild(c);
    });
    showDetail(0);
  }

  /* ---------- Work panels (accordion) ---------- */
  var panels = $$('.panel');
  var wide = window.matchMedia('(min-width: 901px)');
  function openPanel(p) {
    panels.forEach(function (x) { x.classList.toggle('is-open', x === p); });
  }
  panels.forEach(function (p) {
    p.addEventListener('mouseenter', function () { if (wide.matches) openPanel(p); });
    p.addEventListener('focus', function () { openPanel(p); });
    p.addEventListener('click', function (e) { if (!e.target.closest('a')) openPanel(p); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { if (e.target === p) { e.preventDefault(); openPanel(p); } } });
  });

  /* ---------- Certification rows ---------- */
  var certs = $$('.cert');
  certs.forEach(function (c) {
    function on() { certs.forEach(function (x) { x.classList.toggle('is-on', x === c); }); }
    c.addEventListener('mouseenter', on); c.addEventListener('focus', on);
  });

  /* ---------- Gallery filter ---------- */
  var chipsG = $$('.filter-chip'), items = $$('.gallery-item');
  function filterGallery(cat) {
    chipsG.forEach(function (c) {
      var on = c.getAttribute('data-filter') === cat;
      c.classList.toggle('is-active', on); c.setAttribute('aria-selected', String(on));
    });
    items.forEach(function (it) {
      var cats = (it.getAttribute('data-cat') || '').split(/\s+/);
      it.hidden = !(cat === 'all' || cats.indexOf(cat) > -1);
    });
  }
  chipsG.forEach(function (c) { c.addEventListener('click', function () { filterGallery(c.getAttribute('data-filter')); }); });
  $$('[data-jump]').forEach(function (a) {
    a.addEventListener('click', function () { filterGallery(a.getAttribute('data-jump')); });
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#lightbox'), lbImg = $('#lightboxImg'), lbCap = $('#lightboxCaption'), lbClose = $('#lightboxClose');
  var lastFocus = null;
  function openLb(btn) {
    lastFocus = btn;
    lbImg.src = btn.getAttribute('data-full');
    lbImg.alt = $('img', btn).alt;
    lbCap.textContent = btn.getAttribute('data-caption') || '';
    lb.hidden = false; document.body.style.overflow = 'hidden'; lbClose.focus();
  }
  function closeLb() {
    lb.hidden = true; lbImg.src = ''; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('.gallery-btn').forEach(function (b) { b.addEventListener('click', function () { openLb(b); }); });
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
})();
