/* Impulso Social: the feed app. No framework and no build step: this file is served as is.
   Data: Supabase (same project and login as the CRM; owner-only RLS). Actions: /api/social/*. */
(function () {
  'use strict'
  var SB = 'https://doropcecjtladkupmqgl.supabase.co'
  var KEY = 'sb_publishable_wmBcQxvb0cCMQYpNo8fi0g_CXE1GOM0'
  var TZ = 'Europe/Madrid'
  var HANDLE = 'impulsomediaes'
  var S = { session: null, posts: [], settings: null, tab: 'feed', keep: {}, seg: 'published', gen: false, slide: {}, expanded: {} }
  var $app = document.getElementById('app'), $sheet = document.getElementById('sheet'), $toast = document.getElementById('toast')

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] }) }
  function fmt(iso, o) { return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: TZ }, o)).format(new Date(iso)) }
  function fmtWhen(iso) { return fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + fmt(iso, { hour: '2-digit', minute: '2-digit', hour12: false }) }
  function dayKey(d) { var p = {}; new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(d)).forEach(function (x) { p[x.type] = x.value }); return p.year + '-' + p.month + '-' + p.day }
  function img(p, n, w) { return '/api/social/img/' + p.id + '/' + n + '.jpg?v=' + Date.parse(p.updated_at) + (w ? '&w=' + w : '') }
  function caption(p) { return (p.caption || '').trim() + (p.hashtags ? '\n\n' + p.hashtags.trim() : '') }
  function byId(id) { for (var i = 0; i < S.posts.length; i++) if (S.posts[i].id === id) return S.posts[i]; return null }
  function put(p) { for (var i = 0; i < S.posts.length; i++) if (S.posts[i].id === p.id) { S.posts[i] = p; return } S.posts.push(p) }
  var toastT
  function toast(msg, bad) { $toast.textContent = msg; $toast.className = 'toast' + (bad ? ' bad' : ''); $toast.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { $toast.hidden = true }, bad ? 6000 : 3200) }
  var ICON = {
    pulse: '<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#d4a853" stroke-width="2"/><path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke="#d4a853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.600-7.5 10.2-7.500 10.2z"/></svg>',
    heartFull: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.600-7.5 10.2-7.500 10.2z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.5a8.4 8.4 0 0 1-12.600 7.300L3.500 20l1.300-4.200A8.400 8.400 0 1 1 20.500 11.500z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10.500 13.500M21 3l-6.500 18-4-7.500L3 9.500 21 3z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.800"/><circle cx="12" cy="12" r="1.800"/><circle cx="19" cy="12" r="1.800"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.500 10.500 12 3.500l8.500 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1v-9.500z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.500" y="5" width="17" height="15.500" rx="2"/><path d="M3.500 10h17M8 3v4M16 3v4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8.500" r="4"/><path d="M4.500 20.500c1-3.500 4-5.500 7.500-5.500s6.500 2 7.500 5.500"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.400 13.500a7.600 7.600 0 0 0 0-3l2-1.500-2-3.500-2.400 1a7.600 7.600 0 0 0-2.600-1.500L14 2.500h-4l-.4 2.500A7.600 7.600 0 0 0 7 6.500l-2.400-1-2 3.500 2 1.500a7.600 7.600 0 0 0 0 3l-2 1.500 2 3.500 2.400-1a7.600 7.600 0 0 0 2.600 1.500l.4 2.500h4l.4-2.500a7.600 7.600 0 0 0 2.600-1.500l2.400 1 2-3.500-2-1.500z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.500-4M4 5v3.500h3.500M4 13a8 8 0 0 0 14.500 4M20 19v-3.500h-3.500"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10.500-10.500a2.800 2.800 0 0 0-4-4L4 16v4z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2.500 4.500 13.500H11l-1 8L18.500 10.500H12l1-8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M4.500 12.500l5 5 10-11"/></svg>'
  }

  // ---------- Supabase (auth + REST) ----------
  function saveSession(s) { S.session = s; try { s ? localStorage.setItem('social-session', JSON.stringify(s)) : localStorage.removeItem('social-session') } catch (e) {} }
  function authCall(grant, body) {
    return fetch(SB + '/auth/v1/token?grant_type=' + grant, { method: 'POST', headers: { apikey: KEY, 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error_description || j.msg || j.message || 'Login failed'); return j }) })
      .then(function (j) { saveSession({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000, email: j.user && j.user.email }); return S.session })
  }
  var refreshing = null
  function token() {
    if (!S.session) return Promise.reject(new Error('no_session'))
    if (S.session.expires_at - Date.now() > 60000) return Promise.resolve(S.session.access_token)
    if (!refreshing) refreshing = authCall('refresh_token', { refresh_token: S.session.refresh_token }).catch(function (e) { saveSession(null); render(); throw e }).finally(function () { refreshing = null })
    return refreshing.then(function (s) { return s.access_token })
  }
  function db(path, opts) {
    opts = opts || {}
    return token().then(function (t) {
      var h = { apikey: KEY, Authorization: 'Bearer ' + t, 'content-type': 'application/json' }
      if (opts.method && opts.method !== 'GET') h.Prefer = 'return=representation'
      return fetch(SB + '/rest/v1/' + path, { method: opts.method || 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.message || 'Database error'); return j }) })
  }
  function api(path, body, raw) {
    return token().then(function (t) {
      return fetch('/api/social/' + path, { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'content-type': 'application/json' }, body: JSON.stringify(body || {}) })
    }).then(function (r) {
      if (raw) { if (!r.ok) throw new Error('Preview failed'); return r.blob() }
      return r.json().catch(function () { return {} }).then(function (j) { if (!r.ok || j.error) throw new Error(j.error || 'Something went wrong (' + r.status + ')'); return j })
    })
  }
  var SET_COLS = 'slots,autopublish,autogenerate,gen_per_run,min_drafts,ig_username,ig_user_id,ig_token_at,ig_checked_at'
  function load() {
    return Promise.all([db('social_posts?select=*&order=created_at.asc'), db('social_settings?select=' + SET_COLS + '&id=eq.1')]).then(function (r) {
      S.posts = r[0]; S.settings = r[1][0] || { slots: {}, autopublish: true, autogenerate: true }
    })
  }

  // ---------- derived ----------
  function drafts() {
    return S.posts.filter(function (p) { return p.status === 'draft' || S.keep[p.id] }).sort(function (a, b) {
      if (a.plan_date && b.plan_date) return a.plan_date < b.plan_date ? -1 : a.plan_date > b.plan_date ? 1 : 0
      if (a.plan_date) return -1; if (b.plan_date) return 1
      return a.created_at < b.created_at ? 1 : -1
    })
  }
  function queue() { return S.posts.filter(function (p) { return p.status === 'approved' || p.status === 'publishing' }).sort(function (a, b) { return (a.scheduled_at || '') < (b.scheduled_at || '') ? -1 : 1 }) }
  function failed() { return S.posts.filter(function (p) { return p.status === 'failed' }) }
  function published() { return S.posts.filter(function (p) { return p.status === 'published' }).sort(function (a, b) { return (a.published_at || '') < (b.published_at || '') ? 1 : -1 }) }
  function rejected() { return S.posts.filter(function (p) { return p.status === 'rejected' }) }
  function connected() { return !!(S.settings && S.settings.ig_user_id) }
  function overdue(p) { return p.status === 'approved' && p.scheduled_at && Date.parse(p.scheduled_at) < Date.now() - 20 * 60000 }

  // ---------- views ----------
  function card(p) {
    var n = (p.slides || []).length, liked = p.status === 'approved' || p.status === 'publishing' || p.status === 'published'
    var cur = S.slide[p.id] || 0
    var imgs = '', dots = ''
    for (var i = 1; i <= n; i++) { imgs += '<img loading="lazy" decoding="async" src="' + img(p, i) + '" alt="' + esc(i === 1 ? p.alt_text || p.title : 'Slide ' + i) + '">'; dots += '<i class="dot' + (i - 1 === cur ? ' on' : '') + '"></i>' }
    var cap = p.caption || '', long = cap.length > 150 && !S.expanded[p.id]
    var strip = ''
    if (p.status === 'approved') strip = '<div class="strip q">' + ICON.clock.replace('<svg', '<svg width="16" height="16"') + '<span>' + (overdue(p) && !connected() ? 'Ready to post · was due ' : 'Queued · ') + esc(fmtWhen(p.scheduled_at)) + '</span><button data-act="unlike" data-id="' + p.id + '">Undo</button></div>'
    else if (p.status === 'publishing') strip = '<div class="strip q"><span>Publishing to Instagram…</span></div>'
    else if (p.status === 'published') strip = '<div class="strip ok"><span>Published ' + esc(fmtWhen(p.published_at)) + '</span>' + (p.ig_permalink ? '<a href="' + esc(p.ig_permalink) + '" target="_blank" rel="noopener" style="margin-left:auto;color:inherit;font-weight:700">Open</a>' : '') + '</div>'
    else if (p.status === 'failed') strip = '<div class="strip bad"><span>' + esc(p.error || 'Publishing failed') + '</span><button data-act="publish" data-id="' + p.id + '">Retry</button></div>'
    else if (p.status === 'rejected') strip = '<div class="strip bad"><span>Discarded</span><button data-act="restore" data-id="' + p.id + '">Restore</button></div>'
    return '<article class="post" data-post="' + p.id + '">' +
      '<div class="post-h"><div class="ava">' + ICON.pulse + '</div><div class="who"><b>' + HANDLE + '</b><small>' + esc(p.title) + '</small></div>' +
      '<button class="icon-btn" data-act="menu" data-id="' + p.id + '" aria-label="More options">' + ICON.dots + '</button></div>' +
      '<div class="media-wrap"><div class="media" data-media="' + p.id + '">' + imgs + '</div>' +
      (n > 1 ? '<button class="nav-arrow l" data-act="prev" data-id="' + p.id + '" aria-label="Previous slide">‹</button><button class="nav-arrow r" data-act="next" data-id="' + p.id + '" aria-label="Next slide">›</button>' : '') + '</div>' +
      '<div class="acts"><div class="acts-row">' +
      '<button class="act' + (liked ? ' liked' : '') + '" data-act="' + (liked ? (p.status === 'approved' ? 'unlike' : 'noop') : 'like') + '" data-id="' + p.id + '" aria-label="' + (liked ? 'Approved' : 'Approve and queue') + '" title="' + (liked ? 'Approved' : 'Like = approve and queue') + '">' + (liked ? ICON.heartFull : ICON.heart) + '</button>' +
      '<button class="act" data-act="edit" data-id="' + p.id + '" aria-label="Edit text" title="Edit text">' + ICON.edit + '</button>' +
      '<button class="act" data-act="share" data-id="' + p.id + '" aria-label="Share or post by hand" title="Share or post by hand">' + ICON.send + '</button>' +
      (n > 1 ? '<div class="dots" data-dots="' + p.id + '">' + dots + '</div>' : '') +
      (p.status === 'draft' ? '<button class="act right" data-act="reject" data-id="' + p.id + '" aria-label="Not this one" title="Not this one">' + ICON.x + '</button>' : '') +
      '</div></div>' + strip +
      '<div class="cap"><b>' + HANDLE + '</b>' + esc(long ? cap.slice(0, 150).replace(/\s+\S*$/, '') + '… ' : cap) + (long ? '<button class="more" data-act="more" data-id="' + p.id + '">more</button>' : (p.hashtags ? '\n<span class="tags">' + esc(p.hashtags) + '</span>' : '')) + '</div>' +
      '<div class="meta">' + (p.pillar ? '<span class="chip">' + esc(p.pillar) + '</span>' : '') + '<span class="chip">' + (p.lang === 'en' ? 'English' : 'Español') + '</span>' +
      (p.plan_date && p.status === 'draft' ? '<span class="chip gold">Plan: ' + esc(fmt(p.plan_date + 'T12:00:00Z', { weekday: 'short', day: 'numeric', month: 'short' })) + '</span>' : '') +
      (p.source === 'ai' ? '<span class="chip">AI idea</span>' : '') + '</div></article>'
  }
  function viewFeed() {
    var d = drafts(), h = ''
    if (!localStorage.getItem('social-hint')) h += '<div class="banner gold"><div><b>How it works.</b> Like a post and it goes into the queue for its day. Tap the bubble to change the text, the arrow to post it by hand, the cross to drop it.</div><button class="x" data-act="hint" aria-label="Close">✕</button></div>'
    if (!connected()) h += '<div class="banner"><div><b>Instagram is not connected yet.</b> Liked posts wait in the queue, and you can post them by hand with the arrow. <button class="link" data-act="settings">Connect</button></div></div>'
    var f = failed()
    if (f.length) h += '<div class="banner"><div><b>' + f.length + ' post' + (f.length > 1 ? 's' : '') + ' failed to publish.</b> <button class="link" data-act="tab" data-tab="queue">See the queue</button></div></div>'
    if (!d.length) h += '<div class="empty"><h3>You are all caught up</h3><p>Every idea has been liked or dropped. Ask for a few more below.</p></div>'
    h += d.map(card).join('')
    h += '<div class="gen"><h3>More ideas</h3><p>Three new posts written for the feed. Add a topic if you have one in mind.</p><input id="topic" placeholder="Topic (optional), e.g. Google reviews for clinics" maxlength="200">' +
      '<button class="btn gold" data-act="generate"' + (S.gen ? ' disabled' : '') + '>' + (S.gen ? '<i class="spin"></i> Writing, about a minute…' : 'Generate 3 ideas') + '</button></div>'
    return h
  }
  function qrow(p) {
    var bad = p.status === 'failed', late = overdue(p)
    return '<div class="qrow"><img loading="lazy" src="' + img(p, 1, 540) + '" alt="" data-act="open" data-id="' + p.id + '"><div class="b">' +
      '<div class="when">' + (p.scheduled_at ? esc(fmtWhen(p.scheduled_at)) : 'No date') + '</div><div class="ttl">' + esc(p.title) + '</div>' +
      '<div class="meta" style="padding:0"><span class="chip">' + (p.slides || []).length + ' slide' + ((p.slides || []).length === 1 ? '' : 's') + '</span><span class="chip">' + (p.lang === 'en' ? 'EN' : 'ES') + '</span>' +
      (p.status === 'publishing' ? '<span class="chip gold">Publishing</span>' : bad ? '<span class="chip red">Failed</span>' : late ? '<span class="chip gold">' + (connected() ? 'Overdue' : 'Ready to post') + '</span>' : '') + '</div>' +
      (bad ? '<div class="e">' + esc(p.error || '') + '</div>' : '') +
      '<div class="row-btns">' +
      (connected() ? '<button class="btn sm gold" data-act="publish" data-id="' + p.id + '">' + (bad ? 'Retry' : 'Publish now') + '</button>' : '<button class="btn sm gold" data-act="share" data-id="' + p.id + '">Post by hand</button>') +
      '<button class="btn sm" data-act="time" data-id="' + p.id + '">Change time</button>' +
      (!connected() ? '<button class="btn sm" data-act="done" data-id="' + p.id + '">Mark as posted</button>' : '') +
      '<button class="btn sm ghost" data-act="unlike" data-id="' + p.id + '">Remove</button></div></div></div>'
  }
  function viewQueue() {
    var q = queue(), f = failed(), h = ''
    if (f.length) h += '<div class="section-h"><h2>Needs a look</h2></div>' + f.map(qrow).join('')
    h += '<div class="section-h"><h2>Queue</h2><span class="mono">' + q.length + ' scheduled</span></div>'
    if (!q.length) h += '<div class="empty"><h3>Nothing queued</h3><p>Like posts in the feed and they will line up here, one per posting day.</p><p style="margin-top:16px"><button class="btn gold" data-act="tab" data-tab="feed">Open the feed</button></p></div>'
    h += q.map(qrow).join('')
    if (q.length && !connected()) h += '<div class="banner" style="margin-bottom:14px"><div>Connect Instagram and these publish on their own at the time shown. <button class="link" data-act="settings">Connect</button></div></div>'
    return h
  }
  function viewPlan() {
    var today = dayKey(new Date()), now = new Date()
    var t = new Date(Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10)))
    var start = new Date(t); start.setUTCDate(t.getUTCDate() - ((t.getUTCDay() || 7) - 1))
    var end = new Date(t); end.setUTCDate(t.getUTCDate() + 30)
    var map = {}
    S.posts.forEach(function (p) {
      var k = null, c = null
      if (p.status === 'published' && p.published_at) { k = dayKey(p.published_at); c = 'pub' }
      else if ((p.status === 'approved' || p.status === 'publishing') && p.scheduled_at) { k = dayKey(p.scheduled_at); c = 'sch' }
      else if (p.status === 'failed' && p.scheduled_at) { k = dayKey(p.scheduled_at); c = 'fail' }
      else if (p.status === 'draft' && p.plan_date) { k = p.plan_date; c = 'sug' }
      if (!k) return
      var rank = { pub: 4, sch: 3, fail: 2, sug: 1 }
      if (!map[k] || rank[c] > rank[map[k].c]) map[k] = { c: c, p: p, n: (map[k] ? map[k].n : 0) + 1 }; else map[k].n++
    })
    var STI = { sch: ICON.clock, pub: ICON.check, sug: ICON.heart, fail: ICON.x }, STN = { sch: 'Queued', pub: 'Published', sug: 'Planned, not liked yet', fail: 'Failed' }
    var cells = '', inWin = { sch: 0, sug: 0, pub: 0 }
    ;['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(function (d) { cells += '<div class="dow mono">' + d + '</div>' })
    var weeks = Math.ceil(((end - start) / 864e5 + 1) / 7)
    for (var i = 0; i < weeks * 7; i++) {
      var d = new Date(start); d.setUTCDate(start.getUTCDate() + i)
      var k = d.toISOString().slice(0, 10), m = map[k], cls = 'cell'
      if (k < today) cls += ' past'; if (k === today) cls += ' today'; if (d > end) cls += ' out'
      if (m) { cls += ' ' + m.c; if (k >= today && d <= end && inWin[m.c] != null) inWin[m.c]++ }
      cells += '<button class="' + cls + '" data-act="day" data-day="' + k + '"' + (m ? '' : ' disabled') + ' aria-label="' + esc(fmt(k + 'T12:00:00Z', { weekday: 'long', day: 'numeric', month: 'long' })) + '"><span class="n">' + d.getUTCDate() + '</span>' + (m ? '<img loading="lazy" src="' + img(m.p, 1, 540) + '" alt=""><i class="st" title="' + STN[m.c] + '">' + STI[m.c] + '</i>' : '') + '</button>'
    }
    var pill = {}, total = 0
    S.posts.forEach(function (p) { if (p.status === 'rejected') return; var x = p.pillar || 'other'; pill[x] = (pill[x] || 0) + 1; total++ })
    var mix = Object.keys(pill).sort(function (a, b) { return pill[b] - pill[a] }).map(function (x) { return '<div class="bar"><span>' + esc(x) + '</span><span class="track"><i style="width:' + Math.round(pill[x] / total * 100) + '%"></i></span><span>' + pill[x] + '</span></div>' }).join('')
    return '<div class="section-h"><h2>Next 30 days</h2><span class="mono">' + esc(fmt(now, { month: 'short', year: 'numeric' })) + '</span></div>' +
      '<div class="stats"><div class="stat sch"><b>' + inWin.sch + '</b><span><i class="st">' + ICON.clock + '</i>queued</span></div><div class="stat sug"><b>' + inWin.sug + '</b><span><i class="st">' + ICON.heart + '</i>waiting for a like</span></div><div class="stat pub"><b>' + published().length + '</b><span><i class="st">' + ICON.check + '</i>published</span></div></div>' +
      '<div class="cal">' + cells + '</div>' +
      '<div class="legend"><span class="sch"><i class="st">' + ICON.clock + '</i>Queued</span><span class="pub"><i class="st">' + ICON.check + '</i>Published</span><span class="sug"><i class="st">' + ICON.heart + '</i>Planned, not liked yet</span></div>' +
      '<div class="section-h"><h2>Content mix</h2></div><div class="mix">' + mix + '</div>'
  }
  function viewProfile() {
    var pub = published(), q = queue(), list = S.seg === 'published' ? pub : S.seg === 'queue' ? q : rejected()
    return '<div class="prof"><div class="ava">' + ICON.pulse + '</div><div class="nums"><div><b>' + pub.length + '</b><span>published</span></div><div><b>' + q.length + '</b><span>queued</span></div><div><b>' + drafts().length + '</b><span>ideas</span></div></div></div>' +
      '<div class="bio"><b>Impulso Media</b>' + (connected() ? 'Connected to @' + esc(S.settings.ig_username || HANDLE) : 'Instagram not connected') + '</div>' +
      '<div class="seg"><button data-act="seg" data-seg="published" class="' + (S.seg === 'published' ? 'on' : '') + '">Published</button><button data-act="seg" data-seg="queue" class="' + (S.seg === 'queue' ? 'on' : '') + '">Queued</button><button data-act="seg" data-seg="rejected" class="' + (S.seg === 'rejected' ? 'on' : '') + '">Discarded</button></div>' +
      (list.length ? '<div class="grid">' + list.map(function (p) { return '<button data-act="open" data-id="' + p.id + '" aria-label="' + esc(p.title) + '"><img loading="lazy" src="' + img(p, 1, 540) + '" alt=""></button>' }).join('') + '</div>'
        : '<div class="empty"><h3>' + (S.seg === 'published' ? 'Nothing published from here yet' : S.seg === 'queue' ? 'Nothing queued' : 'Nothing discarded') + '</h3><p>' + (S.seg === 'published' ? 'Posts appear here once they go out to Instagram.' : '') + '</p></div>')
  }
  function render() {
    if (!S.session) return renderLogin()
    var q = queue().length, f = failed().length, d = drafts().filter(function (p) { return p.status === 'draft' }).length
    var body = S.tab === 'feed' ? viewFeed() : S.tab === 'queue' ? viewQueue() : S.tab === 'plan' ? viewPlan() : viewProfile()
    var tab = function (id, icon, label, badge, red) { return '<button class="tab' + (S.tab === id ? ' on' : '') + '" data-act="tab" data-tab="' + id + '">' + icon + '<span>' + label + '</span>' + (badge ? '<i class="badge' + (red ? ' red' : '') + '">' + badge + '</i>' : '') + '</button>' }
    $app.innerHTML = '<div class="shell"><header class="top"><div class="brand">' + ICON.pulse + '<span>IMPULSO <em>SOCIAL</em></span></div><div class="r">' +
      '<button class="icon-btn" data-act="reload" aria-label="Refresh">' + ICON.refresh + '</button><button class="icon-btn" data-act="settings" aria-label="Settings">' + ICON.gear + '</button></div></header>' +
      '<main id="view">' + body + '</main></div>' +
      '<nav class="tabs"><div class="in"><div class="brand rail-brand">' + ICON.pulse + '<span>IMPULSO <em>SOCIAL</em></span></div>' + tab('feed', ICON.home, 'For you', d) + tab('queue', ICON.clock, 'Queue', f || q, !!f) + tab('plan', ICON.cal, 'Plan') + tab('profile', ICON.user, 'Posted') + '</div></nav>'
  }
  function renderLogin(err) {
    $app.innerHTML = '<div class="login"><form id="login"><div class="mark" style="width:48px;height:48px">' + ICON.pulse + '</div><h1>Impulso Social</h1><p>Sign in with your CRM login.</p>' +
      '<div class="field"><label for="em">Email</label><input id="em" type="email" autocomplete="username" required></div>' +
      '<div class="field"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password" required></div>' +
      '<div class="err" role="alert">' + esc(err || '') + '</div><button class="btn gold block" type="submit">Sign in</button></form></div>'
  }

  // ---------- sheets ----------
  function sheet(html) { $sheet.innerHTML = '<div class="panel" role="dialog" aria-modal="true"><div class="grab"></div>' + html + '</div>'; $sheet.hidden = false }
  function closeSheet() { $sheet.hidden = true; $sheet.innerHTML = ''; ED = null }
  function menuSheet(p) {
    var b = function (act, icon, label, cls) { return '<button class="' + (cls || '') + '" data-act="' + act + '" data-id="' + p.id + '">' + icon + label + '</button>' }
    sheet('<div class="menu">' + b('edit', ICON.pen, 'Edit text and look') + (p.status !== 'published' ? b('time', ICON.clock, p.status === 'approved' ? 'Change time' : 'Pick a date and time') : '') +
      (p.status !== 'published' && connected() ? b('publish', ICON.bolt, 'Publish to Instagram now') : '') + b('share', ICON.send, 'Share or download images') +
      (p.status !== 'published' && !connected() ? b('done', ICON.check, 'Mark as posted') : '') +
      (p.status === 'draft' || p.status === 'approved' ? b('reject', ICON.x, 'Not this one', 'red') : '') + '</div>')
  }
  function timeSheet(p) {
    var base = p.scheduled_at ? new Date(p.scheduled_at) : new Date(Date.now() + 864e5)
    var local = new Date(base.getTime() - base.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    sheet('<h2>When should it go out?</h2><div class="body"><p>' + esc(p.title) + '</p><div class="field"><label for="when">Date and time (your local time)</label><input id="when" type="datetime-local" value="' + local + '"></div>' +
      '<button class="btn gold block" data-act="time-save" data-id="' + p.id + '">Save</button></div>')
  }
  function shareSheet(p) {
    var n = (p.slides || []).length, links = ''
    for (var i = 1; i <= n; i++) links += '<a href="' + img(p, i) + '" download="impulso-' + p.id.slice(0, 6) + '-' + i + '.jpg" target="_blank" rel="noopener"><img loading="lazy" src="' + img(p, i, 540) + '" alt="Slide ' + i + '"></a>'
    sheet('<h2>Post it by hand</h2><div class="body"><p>The caption is copied to your clipboard. Save the images below (tap each one), then paste the caption in Instagram.</p>' +
      '<div class="dl">' + links + '</div><div class="row-btns"><button class="btn" data-act="copy" data-id="' + p.id + '">Copy caption again</button>' +
      (p.status !== 'published' ? '<button class="btn gold" data-act="done" data-id="' + p.id + '">Mark as posted</button>' : '') + '</div></div>')
  }
  function openSheet(p) { sheet('<div style="margin-top:-4px">' + card(p) + '</div>') }
  function daySheet(k) {
    var list = S.posts.filter(function (p) {
      if (p.status === 'rejected') return false
      if (p.status === 'published') return p.published_at && dayKey(p.published_at) === k
      if (p.scheduled_at && p.status !== 'draft') return dayKey(p.scheduled_at) === k
      return p.plan_date === k
    })
    sheet('<h2>' + esc(fmt(k + 'T12:00:00Z', { weekday: 'long', day: 'numeric', month: 'long' })) + '</h2>' + list.map(card).join(''))
  }
  var DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  function settingsSheet() {
    var s = S.settings || {}, slots = s.slots || {}, days = ''
    for (var i = 1; i <= 7; i++) { var on = !!slots[i]; days += '<div class="d' + (on ? '' : ' off') + '"><button class="toggle' + (on ? ' on' : '') + '" data-act="slot-toggle" data-d="' + i + '" role="switch" aria-checked="' + on + '" aria-label="' + DOW[i - 1] + '"></button><b>' + DOW[i - 1] + '</b><input type="time" data-slot="' + i + '" value="' + esc(slots[i] || '12:30') + '"' + (on ? '' : ' disabled') + ' aria-label="' + DOW[i - 1] + ' time"></div>' }
    var ig = connected()
      ? '<p><b style="color:var(--green)">Connected</b> to @' + esc(s.ig_username || '') + '. Liked posts publish on their own at their time.' + (s.ig_token_at ? ' Token renewed ' + esc(fmt(s.ig_token_at, { day: 'numeric', month: 'short' })) + ' (it renews itself).' : '') + '</p><div class="row-btns"><button class="btn sm" data-act="ig-check">Test connection</button><button class="btn sm red" data-act="ig-disconnect">Disconnect</button></div>'
      : '<p>One-off step. Until then you can post by hand with the arrow button.</p><ol class="steps">' +
        '<li>Open the Meta app <b>Impulso Social</b> at developers.facebook.com.</li>' +
        '<li>Go to <b>Use cases</b>, <b>Customize</b>, <b>API setup with Unified login</b>.</li>' +
        '<li>In step 2, press <b>Generate token</b> next to <b>@' + HANDLE + '</b> and allow access.</li>' +
        '<li>Copy the token and paste it here.</li></ol>' +
        '<div class="field"><label for="igtok">Instagram access token</label><textarea id="igtok" rows="3" style="min-height:80px" placeholder="Paste the token here" autocomplete="off" spellcheck="false"></textarea></div><button class="btn gold block" data-act="ig-connect">Connect Instagram</button>'
    var sw = function (key, title, sub) { return '<div class="sw"><div><b>' + title + '</b><span>' + sub + '</span></div><button class="toggle' + (s[key] ? ' on' : '') + '" data-act="set-toggle" data-key="' + key + '" role="switch" aria-checked="' + !!s[key] + '" aria-label="' + title + '"></button></div>' }
    sheet('<h2>Settings</h2><div class="body"><div class="lbl">Instagram</div>' + ig + '<hr><div class="lbl">Posting days (Madrid time)</div><div class="days">' + days + '</div><button class="btn sm" data-act="slots-save">Save posting days</button><hr>' +
      sw('autopublish', 'Publish liked posts automatically', 'Off: liked posts stay in the queue until you press Publish.') +
      sw('autogenerate', 'New ideas every morning', 'Adds up to ' + (s.gen_per_run || 3) + ' ideas a day while the feed has fewer than ' + (s.min_drafts || 8) + '.') +
      '<hr><div class="row-btns"><span style="color:var(--mute);font-size:13px;align-self:center;margin-right:auto">' + esc((S.session && S.session.email) || '') + '</span><button class="btn sm" data-act="logout">Sign out</button></div></div>')
  }

  // ---------- editor ----------
  var ED = null, prevT = null, prevUrl = null
  var HL = 'Headline (put *asterisks* around words to highlight them)'
  var FIELDS = { cover: [['eyebrow', 'Small label', 40], ['h', HL, 110], ['sub', 'Line under the headline', 140]], poster: [['eyebrow', 'Small label', 40], ['h', HL, 110], ['sub', 'Line under the headline', 140]], photo: [['eyebrow', 'Small label', 40], ['h', HL, 110], ['sub', 'Line under the headline', 140]], versus: [['la', 'Top label', 40], ['ha', 'Top headline', 70], ['ba', 'Top text', 130], ['lb', 'Bottom label', 40], ['hb', 'Bottom headline', 70], ['bb', 'Bottom text', 130]], point: [['n', 'Number', 3], ['h', 'Headline', 100], ['b', 'Text', 200]], text: [['eyebrow', 'Small label', 40], ['h', 'Headline', 110], ['b', 'Text', 240]], list: [['eyebrow', 'Small label', 40], ['h', 'Headline', 70], ['items', 'List (one per line, up to 6)', 500]], stat: [['eyebrow', 'Small label', 40], ['big', 'Big figure', 10], ['h', 'Headline', 90], ['b', 'Text', 200]], cta: [['h', 'Headline', 80], ['sub', 'Line under the headline', 140], ['url', 'Link shown on the button', 44]] }
  function editorSheet(p) {
    ED = { id: p.id, theme: p.theme, lang: p.lang, slides: JSON.parse(JSON.stringify(p.slides || [])), caption: p.caption || '', hashtags: p.hashtags || '', i: S.slide[p.id] || 0, src: img(p, (S.slide[p.id] || 0) + 1, 540) }
    drawEditor()
  }
  function drawEditor() {
    var s = ED.slides[ED.i] || {}, pills = '', fields = ''
    ED.slides.forEach(function (_, i) { pills += '<button class="pill' + (i === ED.i ? ' on' : '') + '" data-act="ed-slide" data-i="' + i + '">' + (i + 1) + '</button>' })
    ;(FIELDS[s.k] || []).forEach(function (f) {
      var v = f[0] === 'items' ? (s.items || []).join('\n') : (s[f[0]] || '')
      fields += '<div class="field"><label for="f-' + f[0] + '">' + f[1] + '</label>' + (f[0] === 'b' || f[0] === 'items' || f[0] === 'sub' ? '<textarea id="f-' + f[0] + '" data-f="' + f[0] + '" maxlength="' + f[2] + '" style="min-height:' + (f[0] === 'items' ? 130 : 76) + 'px">' + esc(v) + '</textarea>' : '<input id="f-' + f[0] + '" data-f="' + f[0] + '" maxlength="' + f[2] + '" value="' + esc(v) + '">') + '</div>'
    })
    var sw = function (t, c) { return '<button class="swatch' + (ED.theme === t ? ' on' : '') + '" data-act="ed-theme" data-t="' + t + '" style="background:' + c + '" aria-label="' + t + ' theme"></button>' }
    sheet('<h2>Edit post</h2><div class="body"><div class="ed-prev"><img id="ed-img" src="' + ED.src + '" alt="Preview"><div class="side"><div class="lbl">Slide</div><div class="pills">' + pills + '</div><div class="lbl">Look</div><div class="sw3">' + sw('dark', '#111418') + sw('light', '#f6f4ef') + sw('gold', '#c9a04a') + '</div>' +
      (ED.slides.length > 1 ? '<button class="btn sm red" data-act="ed-del">Delete this slide</button>' : '') + '</div></div>' + fields +
      '<hr><div class="field"><label for="ed-cap">Caption</label><textarea id="ed-cap" maxlength="1800" style="min-height:170px">' + esc(ED.caption) + '</textarea><div class="hint" id="ed-count">' + ED.caption.length + ' / 1800</div></div>' +
      '<div class="field"><label for="ed-tags">Hashtags (up to 5)</label><input id="ed-tags" value="' + esc(ED.hashtags) + '" maxlength="200"></div>' +
      '<div class="row-btns"><button class="btn gold" data-act="ed-save" style="flex:1">Save</button><button class="btn" data-act="close">Cancel</button></div></div>')
  }
  function edRead() {
    if (!ED) return
    var s = ED.slides[ED.i]; if (!s) return
    $sheet.querySelectorAll('[data-f]').forEach(function (el) { var f = el.getAttribute('data-f'); if (f === 'items') s.items = el.value.split('\n').map(function (x) { return x.trim() }).filter(Boolean).slice(0, 6); else s[f] = el.value })
    var c = document.getElementById('ed-cap'), t = document.getElementById('ed-tags')
    if (c) ED.caption = c.value; if (t) ED.hashtags = t.value
  }
  function edPreview() {
    clearTimeout(prevT)
    prevT = setTimeout(function () {
      if (!ED) return
      api('preview', { slides: ED.slides, theme: ED.theme, lang: ED.lang, index: ED.i }, true).then(function (blob) {
        if (!ED) return
        if (prevUrl) URL.revokeObjectURL(prevUrl)
        prevUrl = URL.createObjectURL(blob); ED.src = prevUrl
        var el = document.getElementById('ed-img'); if (el) el.src = prevUrl
      }).catch(function () {})
    }, 450)
  }

  // ---------- actions ----------
  function act(action, id, extra) {
    return api('act', Object.assign({ action: action, id: id }, extra || {})).then(function (r) { if (r.post) put(r.post); return r })
  }
  function burst(id) {
    var w = document.querySelector('[data-post="' + id + '"] .media-wrap'); if (!w) return
    var b = document.createElement('div'); b.className = 'burst'; b.innerHTML = ICON.heartFull; w.appendChild(b); setTimeout(function () { b.remove() }, 850)
  }
  function like(id) {
    var p = byId(id); if (!p || p.status !== 'draft') return
    burst(id); S.keep[id] = true
    var btn = document.querySelector('[data-post="' + id + '"] .act'); if (btn) { btn.classList.add('liked'); btn.innerHTML = ICON.heartFull }
    act('like', id).then(function (r) { toast('Queued for ' + fmtWhen(r.post.scheduled_at)); rerender() }).catch(function (e) { delete S.keep[id]; toast(e.message, true); rerender() })
  }
  function rerender() { var y = window.scrollY; var sheetOpen = !$sheet.hidden; render(); window.scrollTo(0, y); if (sheetOpen && ED) return }
  function copyCaption(p) { var t = caption(p); if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(function () {}); return Promise.resolve() }
  function share(p) {
    copyCaption(p)
    var n = (p.slides || []).length
    if (!navigator.canShare) return shareSheet(p)
    toast('Getting the images ready…')
    var jobs = []
    for (var i = 1; i <= n; i++) (function (i) { jobs.push(fetch(img(p, i)).then(function (r) { return r.blob() }).then(function (b) { return new File([b], 'impulso-' + i + '.jpg', { type: 'image/jpeg' }) })) })(i)
    Promise.all(jobs).then(function (files) {
      if (!navigator.canShare({ files: files })) return shareSheet(p)
      return navigator.share({ files: files }).then(function () { toast('Caption copied. Paste it in Instagram.') }).catch(function (e) { if (e && e.name !== 'AbortError') shareSheet(p) })
    }).catch(function () { shareSheet(p) })
  }

  document.addEventListener('click', function (ev) {
    if (ev.target === $sheet) return closeSheet()
    var el = ev.target.closest('[data-act]'); if (!el) return
    var a = el.getAttribute('data-act'), id = el.getAttribute('data-id'), p = id ? byId(id) : null
    if (a === 'tab') { S.tab = el.getAttribute('data-tab'); S.keep = {}; closeSheet(); render(); window.scrollTo(0, 0) }
    else if (a === 'seg') { S.seg = el.getAttribute('data-seg'); rerender() }
    else if (a === 'hint') { try { localStorage.setItem('social-hint', '1') } catch (e) {} rerender() }
    else if (a === 'reload') { load().then(function () { S.keep = {}; render(); toast('Up to date') }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'like') like(id)
    else if (a === 'unlike') { act('unlike', id).then(function () { delete S.keep[id]; S.keep[id] = S.tab === 'feed'; closeSheet(); rerender(); toast('Back in the feed') }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'reject') { act('reject', id).then(function () { delete S.keep[id]; closeSheet(); rerender(); toast('Dropped. You can restore it under Posted, Discarded.') }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'restore') { act('restore', id).then(function () { closeSheet(); rerender(); toast('Back in the feed') }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'more') { S.expanded[id] = true; var c = el.closest('.cap'); if (c && p) c.innerHTML = '<b>' + HANDLE + '</b>' + esc(p.caption || '') + (p.hashtags ? '\n<span class="tags">' + esc(p.hashtags) + '</span>' : '') }
    else if (a === 'menu' && p) menuSheet(p)
    else if (a === 'open' && p) openSheet(p)
    else if (a === 'day') daySheet(el.getAttribute('data-day'))
    else if (a === 'edit' && p) editorSheet(p)
    else if (a === 'share' && p) { closeSheet(); share(p) }
    else if (a === 'copy' && p) { copyCaption(p).then(function () { toast('Caption copied') }) }
    else if (a === 'time' && p) timeSheet(p)
    else if (a === 'time-save') { var v = document.getElementById('when').value; if (!v) return; act('reschedule', id, { when: new Date(v).toISOString() }).then(function (r) { closeSheet(); rerender(); toast('Set for ' + fmtWhen(r.post.scheduled_at)) }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'done') { if (!confirm('Mark this post as already published on Instagram?')) return; act('mark_published', id).then(function () { closeSheet(); rerender(); toast('Marked as posted') }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'publish' && p) {
      if (!connected()) { toast('Connect Instagram first (Settings).', true); return }
      if (!confirm('Publish "' + p.title + '" to Instagram right now?')) return
      closeSheet(); toast('Publishing, this takes up to a minute…')
      p.status = 'publishing'; rerender()
      api('act', { action: 'publish_now', id: id }).then(function () { return load() }).then(function () { rerender(); toast('Published on Instagram') }).catch(function (e) { load().then(rerender); toast(e.message, true) })
    }
    else if (a === 'prev' || a === 'next') { var m = document.querySelector('[data-media="' + id + '"]'); if (m) m.scrollBy({ left: (a === 'next' ? 1 : -1) * m.clientWidth, behavior: 'smooth' }) }
    else if (a === 'generate') {
      var topic = (document.getElementById('topic') || {}).value || ''
      S.gen = true; rerender()
      api('generate', { n: 3, topic: topic }).then(function () { return load() }).then(function () { S.gen = false; rerender(); toast('3 new ideas at the end of the feed') }).catch(function (e) { S.gen = false; rerender(); toast(e.message, true) })
    }
    else if (a === 'settings') settingsSheet()
    else if (a === 'close') closeSheet()
    else if (a === 'logout') { saveSession(null); closeSheet(); render() }
    else if (a === 'slot-toggle') { var row = el.closest('.d'), on = !el.classList.contains('on'); el.classList.toggle('on', on); el.setAttribute('aria-checked', on); row.classList.toggle('off', !on); row.querySelector('input').disabled = !on }
    else if (a === 'slots-save') {
      var slots = {}; $sheet.querySelectorAll('[data-slot]').forEach(function (i) { if (!i.disabled && i.value) slots[i.getAttribute('data-slot')] = i.value })
      if (!Object.keys(slots).length) { toast('Keep at least one posting day.', true); return }
      db('social_settings?id=eq.1', { method: 'PATCH', body: { slots: slots } }).then(function () { S.settings.slots = slots; toast('Posting days saved. Posts already queued keep their time.') }).catch(function (e) { toast(e.message, true) })
    }
    else if (a === 'set-toggle') { var key = el.getAttribute('data-key'), val = !S.settings[key], body = {}; body[key] = val; db('social_settings?id=eq.1', { method: 'PATCH', body: body }).then(function () { S.settings[key] = val; settingsSheet() }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'ig-connect') { var tk = (document.getElementById('igtok').value || '').trim(); el.disabled = true; api('ig', { action: 'connect', token: tk }).then(function (r) { return load().then(function () { settingsSheet(); render(); toast('Connected to @' + r.username) }) }).catch(function (e) { el.disabled = false; toast(e.message, true) }) }
    else if (a === 'ig-check') { api('ig', { action: 'check' }).then(function (r) { toast(r.connected ? 'Working. Connected to @' + r.username : (r.error || 'Not connected'), !r.connected) }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'ig-disconnect') { if (!confirm('Disconnect Instagram? Queued posts will wait until you connect again.')) return; api('ig', { action: 'disconnect' }).then(function () { return load() }).then(function () { settingsSheet(); render() }).catch(function (e) { toast(e.message, true) }) }
    else if (a === 'ed-slide') { edRead(); ED.i = +el.getAttribute('data-i'); drawEditor(); edPreview() }
    else if (a === 'ed-theme') { edRead(); ED.theme = el.getAttribute('data-t'); drawEditor(); edPreview() }
    else if (a === 'ed-del') { if (!confirm('Delete this slide?')) return; edRead(); ED.slides.splice(ED.i, 1); ED.i = Math.max(0, ED.i - 1); drawEditor(); edPreview() }
    else if (a === 'ed-save') {
      edRead()
      var tags = (ED.hashtags.match(/#[^\s#]+/g) || []).slice(0, 5).join(' ')
      var pid = ED.id
      db('social_posts?id=eq.' + pid, { method: 'PATCH', body: { slides: ED.slides, theme: ED.theme, caption: ED.caption.trim(), hashtags: tags, format: ED.slides.length > 1 ? 'carousel' : 'image' } })
        .then(function (r) { if (r[0]) put(r[0]); closeSheet(); rerender(); toast('Saved') }).catch(function (e) { toast(e.message, true) })
    }
  })
  document.addEventListener('input', function (ev) {
    if (!ED) return
    if (ev.target.id === 'ed-cap') { var c = document.getElementById('ed-count'); if (c) c.textContent = ev.target.value.length + ' / 1800'; return }
    if (ev.target.hasAttribute && ev.target.hasAttribute('data-f')) { edRead(); edPreview() }
  })
  document.addEventListener('submit', function (ev) {
    if (ev.target.id !== 'login') return
    ev.preventDefault()
    var b = ev.target.querySelector('button'); b.disabled = true
    authCall('password', { email: document.getElementById('em').value.trim(), password: document.getElementById('pw').value })
      .then(load).then(render).catch(function (e) { saveSession(null); renderLogin(e.message === 'no_session' ? '' : (e.message || 'Could not sign in')) })
  })
  // Carousel position (dots and counter) + double tap to like, as on Instagram.
  document.addEventListener('scroll', function (ev) {
    var m = ev.target; if (!m.getAttribute || !m.getAttribute('data-media')) return
    var id = m.getAttribute('data-media'), i = Math.round(m.scrollLeft / Math.max(1, m.clientWidth))
    if (S.slide[id] === i) return
    S.slide[id] = i
    var root = m.closest('.post'); if (!root) return
    root.querySelectorAll('.dot').forEach(function (d, k) { d.classList.toggle('on', k === i) })
    var c = root.querySelector('.count'); if (c) c.textContent = (i + 1) + '/' + m.children.length
  }, true)
  var lastTap = { id: null, t: 0 }
  document.addEventListener('click', function (ev) {
    var m = ev.target.closest('[data-media]'); if (!m) return
    var id = m.getAttribute('data-media'), now = Date.now()
    if (lastTap.id === id && now - lastTap.t < 320) { lastTap.t = 0; like(id) } else lastTap = { id: id, t: now }
  })
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$sheet.hidden) closeSheet() })

  // ---------- boot ----------
  try { S.session = JSON.parse(localStorage.getItem('social-session') || 'null') } catch (e) {}
  if (!S.session) render()
  else load().then(render).catch(function () { saveSession(null); render() })
})()
