/* قسم الأذكار والقرآن الكريم — يحتاج adhkar-data.js (البيانات) قبله */
(function () {
'use strict';
var D = window.ADHKAR_DATA || { categories: [] };
var COURSES_WITH_SECTION = ['term1', 'final', 'final1'];
var CF = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
var $ = function (s) { return document.querySelector(s); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var COL = {}; (function (m) { Object.keys(m).forEach(function (k) { m[k].split(' ').forEach(function (id) { COL[id] = k; }); }); })({
  '#4f46a5': 'sleep waking night dream witr', '#d98a00': 'morning-evening', '#00897b': 'clothes', '#1e88e5': 'khala wudu',
  '#2e7d32': 'home mosque adhan prayer istikhara', '#8e3a59': 'distress debt hard sin shaytan waswasa unpleasant anger afflicted',
  '#546e7a': 'dead sick condolence', '#d81b60': 'newborn marriage reply sneeze majlis', '#0288d1': 'nature travel',
  '#ef6c00': 'food', '#8d6e00': 'hajj', '#c62828': 'enemy dajjal', '#00796b': 'misc' });
var L = {};
function lib(u) { return L[u] || (L[u] = new Promise(function (ok, no) { var s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = function () { delete L[u]; no(new Error(u)); }; document.head.appendChild(s); })); }

/* ---------- التقدّم اليومي (يُصفَّر كل يوم) ---------- */
var KEY = 'aq_prog_v1', day = function () { return new Date().toISOString().slice(0, 10); };
var P = (function () { try { var p = JSON.parse(localStorage.getItem(KEY)); if (p && p.d === day()) return p; } catch (e) {} return { d: day(), c: {} }; })();
function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
var S = { tab: 'adhkar', cat: null, sec: 0, open: 0, q: '', fs: 1 };
function items(c, si) { return ((c.sections[si] || {}).items || []).filter(function (x) { return x && x.text && String(x.text).trim(); }); }
function rem(c, si, i, it) { var k = c.id + '|' + si + '|' + i; return k in P.c ? P.c[k] : (it.count || 1); }
function secDone(c, si) { var a = items(c, si); return a.length > 0 && a.every(function (it, i) { return rem(c, si, i, it) === 0; }); }
function stats(c) { var r = 0, d = 0; c.sections.forEach(function (s, si) { if (items(c, si).length) { r++; if (secDone(c, si)) d++; } }); return { ready: r, done: d }; }
function cat() { return D.categories.filter(function (c) { return c.id === S.cat; })[0]; }

/* ---------- الاحتفال: Confetti + إيموشنز ---------- */
function emojiBurst() {
  for (var i = 0; i < 26; i++) {
    var e = document.createElement('span'); e.textContent = ['🌙', '⭐', '✨', '🎉'][i % 4];
    e.style.cssText = 'position:fixed;top:-30px;z-index:99999;pointer-events:none;font-size:' + (18 + Math.random() * 18) + 'px;left:' + Math.random() * 100 + 'vw';
    document.body.appendChild(e);
    var a = e.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(' + (innerHeight + 60) + 'px) rotate(360deg)', opacity: .8 }], { duration: 1800 + Math.random() * 1400, easing: 'ease-in' });
    a.onfinish = (function (n) { return function () { n.remove(); }; })(e);
  }
}
function celebrate(big) {
  lib(CF).then(function () {
    var c = window.confetti, o = { zIndex: 99999, disableForReducedMotion: true, origin: { y: .7 }, colors: ['#1b5e20', '#c9a24b', '#ffffff', '#2e7d32', '#f5d98b'] }, sh = [];
    try { sh = ['🌙', '⭐', '✨'].map(function (t) { return c.shapeFromText({ text: t, scalar: 2 }); }); } catch (e) {}
    c(Object.assign({ particleCount: big ? 160 : 80, spread: big ? 100 : 70 }, o));
    if (sh.length) c(Object.assign({}, o, { particleCount: big ? 40 : 18, spread: 80, shapes: sh, scalar: 2, flat: true }));
    if (big) [.2, .8].forEach(function (x, i) { setTimeout(function () { c(Object.assign({}, o, { particleCount: 70, angle: i ? 120 : 60, spread: 60, origin: { x: x, y: .8 } })); }, 300 * (i + 1)); });
  }).catch(emojiBurst);
}
function toast(t) { var el = $('#aq-toast'); if (!el) return; el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 2600); }

/* ---------- الأذكار ---------- */
function drawGrid() {
  var q = S.q.trim(), g = $('#aq-grid'); if (!g) return;
  var list = D.categories.filter(function (c) { return !q || c.title.indexOf(q) > -1 || c.sections.some(function (s) { return (s.title || '').indexOf(q) > -1 || (s.items || []).some(function (it) { return (it.text || '').indexOf(q) > -1; }); }); });
  var idx = 0;
  g.innerHTML = list.length ? list.map(function (c) {
    var st = stats(c), meta = !st.ready ? 'قريباً' : st.done === st.ready ? 'أتممته اليوم ✓' : st.done + ' من ' + st.ready + ' اليوم';
    return '<button style="--n:' + idx++ + ';--c:' + (COL[c.id] || '#2e7d32') + '" class="aq-cat ' + (!st.ready ? 'soon' : st.done === st.ready ? 'ok' : '') + '" data-a="cat" data-id="' + esc(c.id) + '"><span class="ic">' + (c.icon || '📿') + '</span><span><b>' + esc(c.title) + '</b><small>' + meta + '</small></span></button>';
  }).join('') : '<div class="aq-empty">لا توجد نتائج مطابقة.</div>';
}
function viewList() {
  $('#aq-adhkar').innerHTML = '<input class="aq-search" type="search" placeholder="ابحث عن ذكر أو دعاء…" value="' + esc(S.q) + '" aria-label="بحث"><div class="aq-grid" id="aq-grid"></div>';
  drawGrid();
}
function itemHTML(c, si, it, i) {
  var r = rem(c, si, i, it), n = it.count || 1, first = String(it.text).replace(/\s+/g, ' ').slice(0, 60);
  return '<article class="aq-item ' + (r === 0 ? 'done' : '') + '" data-i="' + i + '"><button class="h" data-a="open" data-i="' + i + '"><span class="t">' + esc(it.title || first) + '</span></button>' +
    '<div class="aq-body"><div><div class="aq-in"><p class="aq-text">' + esc(it.text) + '</p>' + (it.source ? '<small class="aq-src">' + esc(it.source) + '</small>' : '') +
    '<button class="aq-ring" data-a="tap" data-i="' + i + '" aria-label="اضغط للعدّ"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="46" style="stroke-dashoffset:' + (289 * (1 - (n - r) / n)).toFixed(1) + '"/></svg><b>' + r + '</b></button></div></div></div></article>';
}
function viewRead() {
  var c = cat(), s = c.sections, a = items(c, S.sec);
  var chips = s.length > 1 ? '<div class="aq-chips">' + s.map(function (x, i) { return '<button data-a="sec" data-i="' + i + '" class="' + (i === S.sec ? 'on ' : '') + (secDone(c, i) ? 'done' : '') + '">' + esc(x.title) + '</button>'; }).join('') + '</div>' : '';
  S.open = Math.max(0, a.findIndex(function (it, i) { return rem(c, S.sec, i, it) > 0; }));
  $('#aq-adhkar').innerHTML = '<div class="aq-bar"><button data-a="back">→ الأقسام</button><h3>' + esc(c.title) + '</h3><button data-a="fs" data-v="-1" aria-label="تصغير الخط">أ-</button><button data-a="fs" data-v="1" aria-label="تكبير الخط">أ+</button><button data-a="reset" title="إعادة العدّ">↺</button></div>' + chips +
    '<div class="aq-prog"><i id="aq-pg"></i></div>' + (a.length ? '<div id="aq-items">' + a.map(function (it, i) { return itemHTML(c, S.sec, it, i); }).join('') + '</div>' : '<div class="aq-empty">🌙 سيتم إضافة هذا القسم قريباً إن شاء الله.</div>');
  $('#aq-adhkar').style.setProperty('--fs', S.fs);
  setOpen(S.open, true); upProg();
}
function setOpen(i, quiet) {
  var els = document.querySelectorAll('#aq-items .aq-item'); if (!els.length) return;
  els.forEach(function (e, k) { e.classList.toggle('open', k === i); });
  S.open = i;
  if (!quiet && els[i]) setTimeout(function () { els[i].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
}
function upProg() {
  var c = cat(), a = items(c, S.sec), tot = 0, done = 0, el = $('#aq-pg'); if (!el) return;
  a.forEach(function (it, i) { var n = it.count || 1; tot += n; done += n - rem(c, S.sec, i, it); });
  el.style.width = (tot ? done / tot * 100 : 0) + '%';
}
function tap(i) {
  var c = cat(), a = items(c, S.sec), it = a[i], k = c.id + '|' + S.sec + '|' + i, r = rem(c, S.sec, i, it);
  if (r <= 0) return;
  r--; P.c[k] = r; save(); try { navigator.vibrate && navigator.vibrate(12); } catch (e) {}
  var el = document.querySelector('#aq-items .aq-item[data-i="' + i + '"]'), n = it.count || 1;
  el.querySelector('.aq-ring b').textContent = r;
  var rg = el.querySelector('.aq-ring'); rg.classList.remove('pulse'); void rg.offsetWidth; rg.classList.add('pulse');
  el.querySelector('.aq-ring circle+circle').style.strokeDashoffset = (289 * (1 - (n - r) / n)).toFixed(1);
  upProg();
  if (r > 0) return;
  el.classList.add('done');
  var nxt = a.findIndex(function (x, j) { return rem(c, S.sec, j, x) > 0; });
  setTimeout(function () {
    if (nxt > -1) { setOpen(nxt); return; }
    el.classList.remove('open');
    var chip = document.querySelectorAll('.aq-chips button')[S.sec]; if (chip) chip.classList.add('done');
    var st = stats(c), all = st.done === st.ready;
    celebrate(all); toast(all ? '🎉 ما شاء الله! أتممت «' + c.title + '» كاملاً' : '✨ أحسنت! أتممت «' + (c.sections[S.sec].title || c.title) + '»');
  }, 380);
}

/* ---------- قارئ المصحف (alquran.cloud — نص عثماني، بدون مفتاح وبدون ملفات) ---------- */
var QURL = 'https://api.alquran.cloud/v1/quran/quran-uthmani';
var QCACHE = 'aq_quran_uthmani_v1', QMARK = 'aq_quran_mark_v1', QSET = 'aq_quran_set_v1';
var Q = { data: null, s: 0, fs: 1, night: false, q: '', p: null };
var AR = '٠١٢٣٤٥٦٧٨٩';
function num(n) { return String(n).replace(/\d/g, function (d) { return AR[d]; }); }
function norm(s) { return String(s || '').replace(/[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); }
function sname(s) { var p = String(s.name).split(' '); return p.length > 1 ? p.slice(1).join(' ') : s.name; }
try { var _qs = JSON.parse(localStorage.getItem(QSET)); if (_qs) { Q.fs = _qs.fs || 1; Q.night = !!_qs.night; } } catch (e) {}
function qSaveSet() { try { localStorage.setItem(QSET, JSON.stringify({ fs: Q.fs, night: Q.night })); } catch (e) {} }
function qMark() { try { return JSON.parse(localStorage.getItem(QMARK)); } catch (e) { return null; } }

/* جلب القرآن كاملاً مرة واحدة ثم حفظه في المتصفح (يعمل بعدها بدون إنترنت) */
function qParse(j) {
  var sr = j && j.data && j.data.surahs;
  if (!sr || sr.length !== 114) throw new Error('bad data');
  return sr.map(function (s) { return { n: s.number, name: s.name, en: s.englishName, t: s.revelationType, a: s.ayahs.map(function (a) { return a.text; }) }; });
}
function qFetch() {
  if (Q.data) return Promise.resolve(Q.data);
  try { var c = JSON.parse(localStorage.getItem(QCACHE)); if (c && c.length === 114 && c[0].a && c[0].a.length) { Q.data = c; return Promise.resolve(c); } } catch (e) {}
  if (Q.p) return Q.p;
  var ctl = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); }, 45000);
  Q.p = fetch(QURL, ctl ? { signal: ctl.signal } : {}).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (j) {
    clearTimeout(tm); Q.data = qParse(j);
    try { localStorage.setItem(QCACHE, JSON.stringify(Q.data)); } catch (e) {}
    return Q.data;
  }).catch(function (e) { clearTimeout(tm); Q.p = null; throw e; });
  return Q.p;
}

function qmsg(h) { $('#aq-qbody').innerHTML = '<div class="aq-qmsg">' + h + '</div>'; }
function viewQuran() {
  $('#aq-quran').innerHTML = '<div id="aq-qbody"></div>';
  $('#aq-quran').style.setProperty('--fs', Q.fs);
  qmsg('جارٍ تحميل المصحف…');
  qFetch().then(function () { if (Q.s) qSurah(Q.s); else qList(); })
    .catch(function () { qmsg('تعذّر تحميل المصحف. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.<br><button data-a="retry">إعادة المحاولة</button>'); });
}

/* قائمة السور */
function qList() {
  Q.s = 0;
  var m = qMark(), ms = m && Q.data[m.s - 1];
  $('#aq-qbody').innerHTML = (ms ? '<button class="aq-resume" data-a="resume">📖 تابع القراءة: ' + esc(sname(ms)) + ' — آية ' + num(m.a) + '</button>' : '') +
    '<input class="aq-search" id="aq-qsearch" type="search" placeholder="ابحث عن سورة بالاسم أو الرقم…" value="' + esc(Q.q) + '" aria-label="بحث عن سورة"><div class="aq-sl" id="aq-sl"></div>';
  qDrawList();
}
function qDrawList() {
  var el = $('#aq-sl'); if (!el) return;
  var q = norm(Q.q.trim().toLowerCase().replace(/[٠-٩]/g, function (d) { return AR.indexOf(d); }));
  var l = Q.data.filter(function (s) { return !q || norm(sname(s)).indexOf(q) > -1 || String(s.n) === q || String(s.en).toLowerCase().indexOf(q) > -1; });
  el.innerHTML = l.length ? l.map(function (s) {
    return '<button class="aq-sur" data-a="qs" data-i="' + s.n + '"><span class="no">' + num(s.n) + '</span><span><b>' + esc(sname(s)) + '</b><small>' + (s.t === 'Meccan' ? 'مكية' : 'مدنية') + ' • ' + num(s.a.length) + ' آية</small></span></button>';
  }).join('') : '<div class="aq-empty">لا توجد سورة مطابقة.</div>';
}

/* عرض سورة */
function qSurah(n, jump) {
  var s = Q.data[n - 1]; if (!s) return; Q.s = n;
  var a = s.a.slice(), hasB = n !== 1 && n !== 9;
  /* الـ API يضع البسملة داخل الآية الأولى لكل سورة (عدا الفاتحة والتوبة) — نفصلها لتُعرض كسطر مستقل */
  if (hasB) { var w = String(a[0]).replace(/^\uFEFF/, '').trim().split(/\s+/); if (w.length > 4 && norm(w[0]) === 'بسم') a[0] = w.slice(4).join(' '); }
  var mk = qMark(), mi = mk && mk.s === n ? mk.a : 0;
  var txt = a.map(function (t, i) { return '<span class="aq-ay' + (mi === i + 1 ? ' mark' : '') + '" data-a="ay" data-i="' + (i + 1) + '">' + esc(t) + ' <span class="aq-no">﴿' + num(i + 1) + '﴾</span></span> '; }).join('');
  $('#aq-qbody').innerHTML =
    '<div class="aq-bar"><button data-a="qback">→ السور</button><h3>' + esc(s.name) + '</h3><button data-a="qfs" data-v="-1" aria-label="تصغير الخط">أ-</button><button data-a="qfs" data-v="1" aria-label="تكبير الخط">أ+</button><button data-a="night" aria-label="الوضع الليلي">🌙</button></div>' +
    '<div class="aq-sh"><b>' + esc(s.name) + '</b><small>' + (s.t === 'Meccan' ? 'مكية' : 'مدنية') + ' • ' + num(s.a.length) + ' آية • رقمها ' + num(n) + '</small></div>' +
    '<div class="aq-read' + (Q.night ? ' night' : '') + '" id="aq-read">' + (hasB ? '<p class="aq-bsm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>' : '') + '<div class="aq-ayat">' + txt + '</div></div>' +
    '<div class="aq-qbar" style="margin-top:12px"><button data-a="qprev"' + (n <= 1 ? ' disabled' : '') + '>→ السورة السابقة</button><button data-a="qnext"' + (n >= 114 ? ' disabled' : '') + '>السورة التالية ←</button></div>';
  var mEl = jump && mi ? $('#aq-read .aq-ay.mark') : null;
  if (mEl) setTimeout(function () { mEl.scrollIntoView({ block: 'center' }); }, 60); else window.scrollTo({ top: 0 });
}

/* ---------- الربط والأحداث ---------- */
function shell() {
  var r = $('#aq-root'); if (!r || r.dataset.ready) return; r.dataset.ready = 1;
  r.innerHTML = '<div class="aq-tabs"><button class="on" data-a="tab" data-v="adhkar">📿 الأذكار</button><button data-a="tab" data-v="quran">📖 المصحف</button></div><div id="aq-adhkar"></div><div id="aq-quran" hidden></div><div class="aq-toast" id="aq-toast"></div>';
  viewList();
  r.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return; var a = b.dataset.a, i = +b.dataset.i;
    if (a === 'tab') {
      S.tab = b.dataset.v;
      document.querySelectorAll('.aq-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
      $('#aq-adhkar').hidden = S.tab !== 'adhkar'; $('#aq-quran').hidden = S.tab !== 'quran';
      if (S.tab === 'quran' && !$('#aq-qbody')) viewQuran();
    }
    else if (a === 'cat') { S.cat = b.dataset.id; S.sec = 0; viewRead(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (a === 'back') { S.cat = null; viewList(); }
    else if (a === 'sec') { S.sec = i; viewRead(); }
    else if (a === 'open') setOpen(i);
    else if (a === 'tap') tap(i);
    else if (a === 'fs') { S.fs = Math.max(.8, Math.min(1.8, S.fs + .15 * b.dataset.v)); $('#aq-adhkar').style.setProperty('--fs', S.fs); }
    else if (a === 'reset') { var c = cat(); Object.keys(P.c).forEach(function (k) { if (k.indexOf(c.id + '|' + S.sec + '|') === 0) delete P.c[k]; }); save(); viewRead(); }
    else if (a === 'qs') qSurah(i);
    else if (a === 'qback') { qList(); window.scrollTo({ top: 0 }); }
    else if (a === 'qprev') qSurah(Q.s - 1); else if (a === 'qnext') qSurah(Q.s + 1);
    else if (a === 'qfs') { Q.fs = Math.max(.8, Math.min(2, Q.fs + .15 * b.dataset.v)); $('#aq-quran').style.setProperty('--fs', Q.fs); qSaveSet(); }
    else if (a === 'night') { Q.night = !Q.night; var rd = $('#aq-read'); if (rd) rd.classList.toggle('night', Q.night); qSaveSet(); }
    else if (a === 'ay') {
      try { localStorage.setItem(QMARK, JSON.stringify({ s: Q.s, a: i })); } catch (e) {}
      document.querySelectorAll('#aq-read .aq-ay.mark').forEach(function (x) { x.classList.remove('mark'); }); b.classList.add('mark');
      toast('تم حفظ موضع القراءة ✓');
    }
    else if (a === 'resume') { var mk = qMark(); if (mk) qSurah(mk.s, true); }
    else if (a === 'retry') viewQuran();
  });
  r.addEventListener('input', function (e) {
    if (e.target.id === 'aq-qsearch') { Q.q = e.target.value; qDrawList(); }
    else if (e.target.classList.contains('aq-search')) { S.q = e.target.value; drawGrid(); }
  });
}

/* تسجيل بطاقة القسم في كل كورس + فتح التبويب */
if (typeof SUBJECT_CARDS !== 'undefined' && !SUBJECT_CARDS.some(function (c) { return c.tab === 'adhkarTab'; })) {
  SUBJECT_CARDS.push({ tab: 'adhkarTab', courses: COURSES_WITH_SECTION, title: 'الأذكار والقرآن الكريم', icon: '📿', short: 'الأذكار والقرآن', subjects: [], adhkar: true, banner: '', grad: 'linear-gradient(135deg,#0d3b12,#c9a24b)', desc: 'أذكار يومية تفاعلية بعدّاد وتحفيز، ومصحف شريف تقلّب صفحاته داخل المنصة.' });
}
var _rsg = window.renderSubjectGrid;
window.renderSubjectGrid = function () {
  _rsg.apply(this, arguments);
  var c = document.querySelector('.subject-card[onclick*="adhkarTab"]');
  if (c) { var m = c.querySelector('.subject-meta'); if (m) m.textContent = 'أذكار • مصحف'; var bar = c.querySelector('.sc-bar'); if (bar) bar.remove(); }
};
var _st = window.switchTab;
window.switchTab = function (id) { var r = _st.apply(this, arguments); if (id === 'adhkarTab') shell(); return r; };
window.AdhkarQuran = { celebrate: celebrate, mount: shell };
})();
