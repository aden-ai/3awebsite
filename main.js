// ============ THEME ============
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('3a-theme');
  const preferred = saved || 'dark';
  root.setAttribute('data-theme', preferred);
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  const toggleMobile = document.getElementById('themeToggleMobile');
  function flip(){
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('3a-theme', next);
  }
  if(toggle) toggle.addEventListener('click', flip);
  if(toggleMobile) toggleMobile.addEventListener('click', flip);

  // ============ MOBILE NAV ============
  const navToggle = document.getElementById('navToggle');
  const mobilePanel = document.getElementById('mobilePanel');
  const scrim = document.getElementById('scrim');
  function closeMenu(){
    navToggle.classList.remove('open');
    mobilePanel.classList.remove('open');
    scrim.classList.remove('open');
    document.body.style.overflow = '';
  }
  function openMenu(){
    navToggle.classList.add('open');
    mobilePanel.classList.add('open');
    scrim.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  if(navToggle){
    navToggle.addEventListener('click', () => {
      navToggle.classList.contains('open') ? closeMenu() : openMenu();
    });
    scrim.addEventListener('click', closeMenu);
    mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ============ NAV SCROLL SHADOW ============
  const header = document.querySelector('header');
  if(header){
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 8px 30px -20px rgba(0,0,0,0.4)' : 'none';
    });
  }

  // ============ CURSOR-FOLLOW GRID GLOW ============
  const gridField = document.getElementById('gridField');
  if(gridField){
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gridField.style.setProperty('--mx', x + '%');
      gridField.style.setProperty('--my', y + '%');
    });
  }

  // ============ CARD SPOTLIGHT ============
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--px', (e.clientX - r.left) + 'px');
      card.style.setProperty('--py', (e.clientY - r.top) + 'px');
    });
  });

  // ============ SCROLL REVEAL ============
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealEls.forEach(el => io.observe(el));

  document.querySelectorAll('.services-grid, .values-grid').forEach(grid => {
    [...grid.children].forEach((child, i) => { child.style.transitionDelay = (i * 80) + 'ms'; });
  });

  // ============ COUNT-UP STATS ============
  const counters = document.querySelectorAll('.stat .num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const span = el.querySelector('span');
        const duration = 1400;
        const startTime = performance.now();
        function tick(now){
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          span.textContent = Math.round(eased * target);
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countIO.observe(el));

  // ============ SECURITY TERMINAL TYPING ============
  const termBody = document.getElementById('termBody');
  if(termBody){
    const logLines = [
      { p: '$', t: 'connect --client-environment' },
      { p: '›', t: 'Verifying NDA on file ...', ok: 'OK' },
      { p: '›', t: 'Checking role-based access scope ...', ok: 'OK' },
      { p: '›', t: 'USB storage: disabled', ok: 'OK' },
      { p: '›', t: 'C:/ D:/ drive access: blocked', ok: 'OK' },
      { p: '›', t: 'Password policy: complex, enforced', ok: 'OK' },
      { p: '›', t: 'Hosting environment: AWS', ok: 'OK' },
      { p: '›', t: 'IDS / IPS: monitoring', ok: 'ACTIVE' },
      { p: '›', t: 'Gateway firewall: enabled', ok: 'ACTIVE' },
      { p: '›', t: 'Last VAPT scan: this year', ok: 'PASS' },
      { p: '$', t: 'status: secure', final: true },
    ];
    const termIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          runTerminal();
          termIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    termIO.observe(document.getElementById('terminalPanel'));

    function runTerminal(){
      let i = 0;
      function addLine(){
        if(i >= logLines.length){
          const cur = document.createElement('div');
          cur.innerHTML = '<span class="term-cursor"></span>';
          cur.style.marginTop = '4px';
          termBody.appendChild(cur);
          return;
        }
        const line = logLines[i];
        const row = document.createElement('div');
        row.className = 'ln';
        let html = '<span class="prompt">' + line.p + '</span><span class="txt">' + line.t;
        if(line.ok){ html += '  <span class="ok">[' + line.ok + ']</span>'; }
        html += '</span>';
        row.innerHTML = html;
        termBody.appendChild(row);
        i++;
        setTimeout(addLine, line.final ? 420 : 250);
      }
      addLine();
    }
  }
});