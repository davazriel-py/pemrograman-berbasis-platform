// Animasi & perintilan tambahan (tidak mengubah logika utama di app.js)
(() => {
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nama tamu dari URL: .../undangan-pernikahan/?to=Budi
  const to = new URLSearchParams(location.search).get('to');
  if (to) { $('#guestName').textContent = to.slice(0, 60); $('#guestBlock').classList.remove('d-none'); }

  // progress bar scroll + tombol kembali ke atas
  const bar = $('#progress'), top = $('#toTop');
  addEventListener('scroll', () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight || 1;
    bar.style.width = (h.scrollTop / max) * 100 + '%'; top.classList.toggle('show', h.scrollTop > 500);
  }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // ticker teks berjalan
  const unit = 'SAVE THE DATE ✦ WITH LOVE ✦ THE WEDDING ✦ '.repeat(6);
  document.querySelectorAll('.ticker-in').forEach((t) => { t.innerHTML = `<span>${unit}</span><span>${unit}</span>`; });

  // confetti saat undangan dibuka
  function confetti() {
    if (reduce) return;
    const box = $('#confetti'), cols = ['#D65A38', '#E3B34B', '#234E52', '#F3E7D3'];
    for (let i = 0; i < 46; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % 4];
      p.style.setProperty('--d', 2.4 + Math.random() * 2 + 's'); p.style.setProperty('--x', Math.random() * 160 - 80 + 'px');
      p.style.animationDelay = Math.random() * 0.6 + 's'; box.append(p);
    }
    setTimeout(() => box.replaceChildren(), 5200);
  }
  $('#openBtn').addEventListener('click', confetti);

  // angka countdown "pop" saat berubah
  const cd = $('#countdown'); let prev = [];
  new MutationObserver(() => {
    const bs = [...cd.querySelectorAll('b')];
    bs.forEach((b, i) => { if (prev[i] !== undefined && prev[i] !== b.textContent) b.classList.add('pop'); });
    prev = bs.map((b) => b.textContent);
  }).observe(cd, { childList: true });

  // simpan ke kalender (.ics)
  const ics = $('#icsBtn');
  if (!WEDDING.dateISO) { ics.disabled = true; ics.title = 'Tanggal belum dikonfigurasi'; }
  else ics.addEventListener('click', () => {
    const f = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const s = new Date(WEDDING.dateISO), e = new Date(+s + 4 * 36e5), ev = WEDDING.events[0];
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Undangan//ID', 'BEGIN:VEVENT', `UID:${Date.now()}@undangan`,
      `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`,
      `SUMMARY:Pernikahan ${WEDDING.groom.nick} & ${WEDDING.bride.nick}`,
      'LOCATION:' + `${ev.venue}, ${ev.address}, ${ev.city}`.replace(/,/g, '\\,'), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = 'undangan-pernikahan.ics'; a.click();
  });

  // bagikan via WhatsApp
  $('#shareBtn').href = 'https://wa.me/?text=' + encodeURIComponent(
    `Kami mengundang Anda ke pernikahan ${WEDDING.groom.nick} & ${WEDDING.bride.nick}. Buka undangan: ${location.href.split('?')[0]}`);
})();
