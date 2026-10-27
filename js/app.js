(() => {
  const W = WEDDING, $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isPh = (s) => !s || /^\[.*\]/.test(String(s).trim());

  const photo = (src, alt, ratio, cls = '', idx = '') =>
    `<figure class="photo ${cls}" style="aspect-ratio:${ratio}" ${idx !== '' ? `data-i="${idx}" tabindex="0" role="button"` : ''}>` +
    (src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : '<div class="ph"><span>FOTO</span></div>') + '</figure>';

  // ---------- peta ----------
  function mapLinks(e) {
    const hasCoord = typeof e.lat === 'number' && typeof e.lng === 'number';
    if (!hasCoord && isPh(e.address) && !e.mapsUrl) return null; // jangan buat lokasi palsu
    const q = encodeURIComponent(hasCoord ? `${e.lat},${e.lng}` : `${e.venue} ${e.address} ${e.city}`);
    return { key: q, embed: `https://www.google.com/maps?q=${q}&output=embed`,
      open: e.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${q}`,
      dir: `https://www.google.com/maps/dir/?api=1&destination=${q}` };
  }

  // ---------- render ----------
  const set = (id, v) => { $(id).textContent = v; };
  set('#gNick', W.groom.nick); set('#bNick', W.bride.nick); set('#fG', W.groom.nick); set('#fB', W.bride.nick);
  set('#heroDate', W.dateLabel); set('#footDate', W.dateLabel);
  $('#coverPhoto').innerHTML = photo(W.coverPhoto, 'Foto pasangan', '4 / 5', 'tilt') + '<span class="tape"></span>';

  $('#storyList').innerHTML = W.story.map((s) => `<li class="rv"><div class="row g-3 align-items-center film">
    <div class="col-sm-5">${photo(s.photo, s.title, '4 / 3')}</div>
    <div class="col-sm-7"><span class="chip">${esc(s.date)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div></li>`).join('');

  const person = (p, role, cls) => `<div class="col-md-5 rv couple ${cls}">${photo(p.photo, p.full, '3 / 4')}
    <p class="kicker mt-3">${role}</p><h3>${esc(p.full)}</h3><p class="nick">“${esc(p.nick)}”</p>
    <p class="small">Putra/Putri dari<br>${esc(p.parents)}</p></div>`;
  $('#coupleRow').innerHTML = person(W.groom, 'MEMPELAI PRIA', 'a') + '<div class="col-md-1 d-flex justify-content-center"><span class="geo"></span></div>' + person(W.bride, 'MEMPELAI WANITA', 'b');

  $('#eventRow').innerHTML = W.events.map((e) => `<div class="col-md-6 rv"><div class="card-retro ev h-100">
    <span class="ev-ic" aria-hidden="true">${e.icon}</span><h3>${esc(e.type)}</h3>
    <p class="ev-d">${esc(e.date)}</p><p class="ev-t">${esc(e.time)}</p>
    <p><b>${esc(e.venue)}</b><br>${esc(e.address)}</p><a class="btn btn-retro sm" href="#lokasi">LIHAT LOKASI</a></div></div>`).join('');

  // gabungkan acara di lokasi yang sama => satu peta
  const groups = [];
  W.events.forEach((e) => { const l = mapLinks(e), key = l ? l.key : 'ph-' + e.id, g = groups.find((x) => x.key === key); g ? g.ev.push(e) : groups.push({ key, l, ev: [e] }); });
  $('#locRow').innerHTML = groups.map((g) => { const e = g.ev[0], l = g.l;
    return `<div class="col-lg-${groups.length > 1 ? 6 : 8} ${groups.length === 1 ? 'mx-auto' : ''} rv"><div class="card-retro loc h-100">
    <p class="kicker"><span class="pin"></span>${g.ev.map((x) => esc(x.type)).join(' &amp; ')}</p>
    <div class="map">${l ? `<iframe title="Peta ${esc(e.venue)}" src="${l.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
      : '<div class="ph"><span>PETA BELUM TERSEDIA<br>Isi alamat atau koordinat di js/data.js</span></div>'}</div>
    <h3>${esc(e.venue)}</h3><p>${esc(e.address)}<br>${esc(e.city)}</p>${e.note ? `<p class="small">${esc(e.note)}</p>` : ''}
    <div class="d-flex flex-wrap gap-2 mt-3">${l
      ? `<a class="btn btn-retro sm" target="_blank" rel="noopener noreferrer" href="${l.open}">BUKA GOOGLE MAPS</a><a class="btn btn-retro sm ghost" target="_blank" rel="noopener noreferrer" href="${l.dir}">PETUNJUK ARAH</a>`
      : '<span class="btn btn-retro sm off" aria-disabled="true">BUKA GOOGLE MAPS</span><span class="btn btn-retro sm off" aria-disabled="true">PETUNJUK ARAH</span>'}</div></div></div>`; }).join('');

  $('#collage').innerHTML = W.gallery.map((g, i) => `<div class="rv">${photo(g.src, 'Foto ' + (i + 1), g.ratio, 'hov', i)}</div>`).join('');
  const lb = new bootstrap.Modal('#lb');
  const openLb = (e) => { const f = e.target.closest('.photo[data-i]'); if (!f) return; const g = W.gallery[f.dataset.i];
    $('#lbBody').innerHTML = photo(g.src, 'Foto', g.ratio); lb.show(); };
  $('#collage').addEventListener('click', openLb);
  $('#collage').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(e); } });

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0.12 });
  const observe = () => document.querySelectorAll('.rv:not(.on)').forEach((e) => io.observe(e));

  // ---------- countdown ----------
  const target = W.dateISO ? new Date(W.dateISO).getTime() : NaN;
  function tick() {
    const box = $('#countdown');
    if (Number.isNaN(target)) { box.innerHTML = '<p class="msg">Tanggal pernikahan belum dikonfigurasi.</p>'; return; }
    const d = target - Date.now();
    if (d <= 0) { box.innerHTML = '<p class="msg">Hari pernikahan telah berlangsung. Terima kasih atas doa dan kehadiran Anda.</p>'; return; }
    const v = [[Math.floor(d / 864e5), 'Hari'], [Math.floor(d / 36e5) % 24, 'Jam'], [Math.floor(d / 6e4) % 60, 'Menit'], [Math.floor(d / 1e3) % 60, 'Detik']];
    box.innerHTML = '<div class="cd">' + v.map(([n, l]) => `<div><b>${String(n).padStart(2, '0')}</b><span>${l}</span></div>`).join('') + '</div>';
  }

  // ---------- musik (hanya setelah interaksi) ----------
  const music = W.musicSrc ? Object.assign(new Audio(W.musicSrc), { loop: true }) : null;
  const mb = $('#musicBtn');
  if (!music) { mb.disabled = true; mb.title = 'Musik belum dikonfigurasi'; }
  const toggleMusic = () => { if (!music) return;
    if (music.paused) music.play().then(() => { mb.textContent = 'II'; }).catch(() => {}); else { music.pause(); mb.textContent = '▶'; } };
  mb.addEventListener('click', toggleMusic);

  // ---------- buka undangan ----------
  $('#openBtn').addEventListener('click', () => {
    document.body.classList.remove('locked');
    $('#content').classList.remove('d-none'); $('#nav').classList.remove('d-none');
    $('#openBtn').classList.add('d-none'); $('#scrollBtn').classList.remove('d-none');
    observe(); tick(); setInterval(tick, 1000); toggleMusic();
    setTimeout(() => $('#story').scrollIntoView({ behavior: 'smooth' }), 150);
  });
  document.querySelectorAll('#menu .nav-link').forEach((a) => a.addEventListener('click', () => bootstrap.Collapse.getOrCreateInstance('#menu', { toggle: false }).hide()));

  // ---------- RSVP ----------
  const st = $('#fStatus'), alertBox = $('#rsvpAlert');
  st.addEventListener('change', () => $('#guestWrap').classList.toggle('d-none', st.value !== 'Hadir'));
  const show = (ok, t) => { alertBox.className = `alert mt-3 mb-0 ${ok ? 'alert-success' : 'alert-danger'}`; alertBox.textContent = t; };
  $('#rsvpForm').addEventListener('submit', async (ev) => {
    ev.preventDefault(); alertBox.classList.add('d-none');
    const name = $('#fName'), g = $('#fGuests'), n = Number(g.value), hadir = st.value === 'Hadir';
    const nameBad = name.value.trim().length < 2, gBad = hadir && (!Number.isInteger(n) || n < 1 || n > W.maxGuests);
    name.classList.toggle('is-invalid', nameBad); g.classList.toggle('is-invalid', gBad);
    $('#guestErr').textContent = `Jumlah tamu harus bilangan bulat 1 sampai ${W.maxGuests}.`;
    if (nameBad || gBad) return;
    if (!W.rsvpEndpoint) return show(false, 'Formulir belum terhubung ke penyimpanan data, sehingga konfirmasi Anda belum tersimpan.');
    const btn = $('#sendBtn'); btn.disabled = true; btn.textContent = 'MENGIRIM...';
    try {
      const r = await fetch(W.rsvpEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value.trim(), status: st.value, guests: hadir ? n : 0, message: $('#fMsg').value.trim(), sentAt: new Date().toISOString() }) });
      if (!r.ok) throw new Error();
      show(true, 'Terima kasih, konfirmasi Anda telah terkirim.'); $('#rsvpForm').reset();
    } catch { show(false, 'Konfirmasi gagal terkirim. Periksa koneksi Anda lalu coba lagi.'); }
    btn.disabled = false; btn.textContent = 'KIRIM KONFIRMASI';
  });
})();
