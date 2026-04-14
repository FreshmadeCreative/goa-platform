// ─── Core ─────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function doLogin(){$('login-page').classList.remove('active');$('app-page').classList.add('active');renderAll();setTimeout(initCharts,300);}
function doLogout(){$('app-page').classList.remove('active');$('login-page').classList.add('active');}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&$('login-page').classList.contains('active'))doLogin();});
function nav(el,id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const s=$('screen-'+id);if(s){s.classList.add('active');if(!s.dataset.rendered)renderScreen(id);}
  if(el)el.classList.add('active');
  closeActionMenus();
  if(id==='dashboard')setTimeout(initCharts,100);
  if(id==='reports')setTimeout(initReportCharts,100);
}
function setTab(el){el.closest('.tabs').querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
function showModal(id){$('modal-overlay').classList.add('active');document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'));const m=$(id);if(m)m.classList.add('active');}
function closeModal(){$('modal-overlay').classList.remove('active');document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'));}
function toggleActionMenu(id){closeActionMenus();const m=$(id);if(m){m.classList.toggle('open');event.stopPropagation();}}
function closeActionMenus(){document.querySelectorAll('.action-menu').forEach(m=>m.classList.remove('open'));}
document.addEventListener('click',closeActionMenus);

function renderAll(){
  renderContacts();renderProspects();renderBookings();renderRenewals();
  renderDashboard();renderReports();renderInsights();renderAI();
  renderAvailability();renderProposal();renderApprovals();renderBrand();renderModals();
}
function renderScreen(id){
  ({contacts:renderContacts,prospects:renderProspects,bookings:renderBookings,renewals:renderRenewals,
    dashboard:renderDashboard,reports:renderReports,insights:renderInsights,ai:renderAI,
    availability:renderAvailability,proposal:renderProposal,approvals:renderApprovals,brand:renderBrand})[id]?.();
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
const CONTACTS=[
  {id:'suncorp',av:'SC',cls:'av-blue',name:'Suncorp',sub:'Emma Walsh · Marketing Lead · emma@suncorp.com.au',status:'active',camp:'LP8 2026',ltv:'$248k',renew:'28 days',renewCls:'pill-amber',note:'LP10 renewal — digital only, $45k confirmed',notes:[{d:'10 Apr 2026',t:"Called Emma re LP10. Digital-only H2. $45k confirmed. Follow up 14 Apr."},{d:'12 Mar 2026',t:"Sent LP9 post-campaign report. 2.1M impressions. Very happy."}]},
  {id:'alliance',av:'AM',cls:'av-red',name:'Alliance Media',sub:'Tom Reid · Director · tom@alliancemedia.com.au',status:'active',camp:'LP9 2026',ltv:'$91k',renew:'62 days',renewCls:'pill-green',note:'LP9 confirmed — 3 North Corridor sites, artwork due 28 Jan',notes:[{d:'15 Jan 2026',t:"Tom confirmed LP9. Contract signed. Artwork due 28 Jan."}]},
  {id:'qlrail',av:'QL',cls:'av-green',name:'Queensland Rail',sub:'Sarah Kim · Comms Manager · s.kim@queenslandrail.com.au',status:'active',camp:'LP9 2026',ltv:'$184k',renew:'7 days',renewCls:'pill-red',note:'Renewal due — proposal sent, awaiting sign-off',notes:[{d:'8 Apr 2026',t:"Sent LP10 renewal proposal. Sarah presenting to GM this week."}]},
  {id:'ozwine',av:'OW',cls:'av-purple',name:'OzWine Group',sub:'Ben Caruso · Brand Manager',status:'inactive',camp:'Q3 2025',ltv:'$62k',renew:'—',renewCls:'pill-gray',note:'No contact since campaign end. Re-engage Q2.',notes:[]},
  {id:'brisquad',av:'BQ',cls:'av-blue',name:'BrisQuad FC',sub:'Jade Osei · Marketing',status:'active',camp:'LP9 2026',ltv:'$33k',renew:'45 days',renewCls:'pill-green',note:'LP10 match-day sites near Suncorp Stadium',notes:[{d:'1 Apr 2026',t:"Confirmed interest in LP10 match-day sites."}]},
];
function renderContacts(){
  const el=$('screen-contacts');
  el.innerHTML=`<div class="screen-header"><div><h1>Contacts</h1><p class="screen-sub">28 clients · 19 active</p></div><div class="header-actions"><input type="text" class="search-input" placeholder="Search clients…" oninput="filterContacts(this.value)" id="contact-search"><button class="btn-primary sm" onclick="showModal('modal-new-contact')">+ New contact</button></div></div>
  <div class="tabs"><button class="tab active" onclick="filterContactStatus('all',this)">All (28)</button><button class="tab" onclick="filterContactStatus('active',this)">Active (19)</button><button class="tab" onclick="filterContactStatus('inactive',this)">Inactive (9)</button></div>
  <div class="table-card"><table class="data-table"><thead><tr><th>Client</th><th>Status</th><th>Last campaign</th><th>LTV</th><th>Renewal</th><th>Last note</th><th></th></tr></thead><tbody id="contacts-tbody">${contactRows()}</tbody></table></div>`;
  el.dataset.rendered='1';
}
function contactRows(filter='all',search=''){
  return CONTACTS.filter(c=>{if(filter!=='all'&&c.status!==filter)return false;if(search&&!c.name.toLowerCase().includes(search.toLowerCase()))return false;return true;}).map(c=>`
  <tr class="contact-row" onclick="toggleContact('detail-${c.id}',this)">
    <td><div class="client-cell"><div class="avatar ${c.cls}">${c.av}</div><div><div class="client-name">${c.name}</div><div class="client-sub">${c.sub}</div></div></div></td>
    <td><span class="pill ${c.status==='active'?'pill-green':'pill-gray'}">${c.status==='active'?'Active':'Inactive'}</span></td>
    <td class="text-muted">${c.camp}</td><td class="fw5">${c.ltv}</td>
    <td>${c.renew==='—'?'<span class="text-muted">—</span>':`<span class="pill ${c.renewCls}">${c.renew}</span>`}</td>
    <td class="text-muted note-preview">${c.note}</td>
    <td><button class="btn-ghost sm" onclick="event.stopPropagation();showModal('modal-new-contact')">Edit</button></td>
  </tr>
  <tr id="detail-${c.id}" class="detail-row" style="display:none"><td colspan="7"><div class="detail-panel">
    <div class="detail-stats"><div class="dstat"><div class="dstat-val">${c.ltv}</div><div class="dstat-label">Total spend</div></div><div class="dstat"><div class="dstat-val">2021</div><div class="dstat-label">Client since</div></div><div class="dstat"><div class="dstat-val">$41k</div><div class="dstat-label">Avg campaign</div></div></div>
    <div class="detail-notes-area"><div class="note-label">Contact notes</div>${c.notes.map(n=>`<div class="note-item"><span class="note-date">${n.d}</span><span class="note-text">${n.t}</span></div>`).join('')}${!c.notes.length?'<div class="text-muted" style="font-size:12px;padding:4px 0">No notes yet.</div>':''}
    <textarea class="note-input" placeholder="Add a note…"></textarea><button class="btn-ghost sm" style="margin-top:6px">Save note</button></div>
  </div></td></tr>`).join('');
}
function toggleContact(id,row){const d=$(id);if(!d)return;const open=d.style.display!=='none';document.querySelectorAll('.detail-row').forEach(r=>r.style.display='none');document.querySelectorAll('.contact-row').forEach(r=>r.classList.remove('row-expanded'));if(!open){d.style.display='table-row';row.classList.add('row-expanded');}}
function filterContacts(val){const active=document.querySelector('#screen-contacts .tab.active')?.textContent||'';const status=active.includes('Active')?'active':active.includes('Inactive')?'inactive':'all';const tbody=$('contacts-tbody');if(tbody)tbody.innerHTML=contactRows(status,val);}
function filterContactStatus(status,el){setTab(el);const search=$('contact-search')?.value||'';const tbody=$('contacts-tbody');if(tbody)tbody.innerHTML=contactRows(status,search);}

// ─── PROSPECTS ────────────────────────────────────────────────────────────────
function renderProspects(){
  const el=$('screen-prospects');
  el.innerHTML=`<div class="screen-header"><div><h1>Prospects</h1><p class="screen-sub">5 in pipeline · $340k potential</p></div><button class="btn-primary sm" onclick="showModal('modal-add-prospect')">+ Add prospect</button></div>
  <div class="metric-grid four"><div class="metric-card"><div class="metric-label">Pipeline value</div><div class="metric-val">$340k</div></div><div class="metric-card"><div class="metric-label">Avg deal size</div><div class="metric-val">$68k</div></div><div class="metric-card"><div class="metric-label">Win rate (90d)</div><div class="metric-val">38%</div></div><div class="metric-card"><div class="metric-label">Avg days to close</div><div class="metric-val">24</div></div></div>
  <div class="table-card"><table class="data-table"><thead><tr><th>Prospect</th><th>Stage</th><th>Value</th><th>Last touch</th><th>AI insight</th><th>Action</th></tr></thead><tbody>
  ${[{av:'HV',cls:'av-red',name:'Harvey Norman',sub:'Mark D. · Retail Mktg',stage:'Proposal sent',sc:'pill-amber',val:'$120k',touch:'2 days ago',insight:'Opened 3×',ic:'',id:'hv'},
     {av:'WW',cls:'av-green',name:'Woolworths QLD',sub:'Amy C. · Shopper Mktg',stage:'Meeting booked',sc:'pill-blue',val:'$85k',touch:'Today',insight:'Meeting in 2 days',ic:'blue',id:'ww'},
     {av:'MR',cls:'av-purple',name:'Myer Retail',sub:'Chris T. · Brand Mgr',stage:'Outreach',sc:'pill-gray',val:'$60k',touch:'5 days ago',insight:'No reply',ic:'amber',id:'mr'},
     {av:'TL',cls:'av-blue',name:'Telstra Local',sub:'Nina P. · Media Buyer',stage:'Avails sent',sc:'pill-amber',val:'$45k',touch:'Yesterday',insight:'Budget confirmed',ic:'blue',id:'tl'}
  ].map(p=>`<tr><td><div class="client-cell"><div class="avatar ${p.cls}">${p.av}</div><div><div class="client-name">${p.name}</div><div class="client-sub">${p.sub}</div></div></div></td>
    <td><span class="pill ${p.sc}">${p.stage}</span></td><td class="fw5">${p.val}</td><td class="text-muted">${p.touch}</td>
    <td><span class="insight-tag ${p.ic}">${p.insight}</span></td>
    <td><div class="action-menu-wrap"><button class="btn-primary sm" onclick="event.stopPropagation();toggleActionMenu('am-${p.id}')">Action ▾</button>
    <div class="action-menu" id="am-${p.id}"><div class="am-item" onclick="closeActionMenus()">📞 Log call</div><div class="am-item" onclick="closeActionMenus()">📧 Send email</div><div class="am-item" onclick="closeActionMenus()">📄 Build proposal</div><div class="am-item" onclick="closeActionMenus()">📅 Book meeting</div><div class="am-item red" onclick="closeActionMenus()">✕ Mark lost</div></div></div></td>
  </tr>`).join('')}</tbody></table></div>
  <div class="ai-insight-box"><div class="ai-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><div>Harvey Norman viewed your proposal 3× — call today. Woolworths meeting Wednesday — prepare North Corridor options. Myer at 5 days no reply — try a new contact.</div></div>`;
  el.dataset.rendered='1';
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
function renderBookings(){
  const el=$('screen-bookings');
  el.innerHTML=`<div class="screen-header"><div><h1>Active bookings</h1><p class="screen-sub">12 live · 2 warnings</p></div></div>
  <div class="tabs"><button class="tab active" onclick="setBookingTab(this,'all')">All (12)</button><button class="tab" onclick="setBookingTab(this,'live')">Live now (8)</button><button class="tab tab-warn" onclick="setBookingTab(this,'warn')">⚠ Warnings (2)</button></div>
  <div id="bv-all"><div class="table-card"><table class="data-table"><thead><tr><th>Campaign</th><th>Period</th><th>Sites</th><th>Value</th><th>Status</th><th>Warning</th></tr></thead><tbody>
    <tr><td><div class="client-cell"><div class="avatar av-blue">SC</div><div><div class="client-name">Suncorp · Static Run</div><div class="client-sub">LP9–10 2026</div></div></div></td><td class="text-muted">2 Feb – 1 Apr</td><td>6</td><td class="fw5">$91,500</td><td><span class="pill pill-green">Live</span></td><td><span class="warn-tag" onclick="showModal('modal-warn-artwork')">Artwork missing</span></td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-green">QL</div><div><div class="client-name">QLD Rail · Digital</div><div class="client-sub">LP9 2026</div></div></div></td><td class="text-muted">2 Feb – 1 Mar</td><td>4</td><td class="fw5">$48,200</td><td><span class="pill pill-green">Live</span></td><td><span class="warn-tag" onclick="showModal('modal-warn-po')">PO outstanding</span></td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-red">AM</div><div><div class="client-name">Alliance Media</div></div></div></td><td class="text-muted">2 Feb – 1 Mar</td><td>3</td><td class="fw5">$48,300</td><td><span class="pill pill-green">Live</span></td><td class="text-muted">—</td></tr>
  </tbody></table></div></div>
  <div id="bv-live" style="display:none"><div class="table-card"><table class="data-table"><thead><tr><th>Campaign</th><th>Period</th><th>Sites</th><th>Value</th></tr></thead><tbody>
    <tr><td><div class="client-cell"><div class="avatar av-blue">SC</div><div><div class="client-name">Suncorp · Static Run</div></div></div></td><td class="text-muted">2 Feb – 1 Apr</td><td>6</td><td class="fw5">$91,500</td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-green">QL</div><div><div class="client-name">QLD Rail · Digital</div></div></div></td><td class="text-muted">2 Feb – 1 Mar</td><td>4</td><td class="fw5">$48,200</td></tr>
  </tbody></table></div></div>
  <div id="bv-warn" style="display:none">
    <div class="warn-card" onclick="showModal('modal-warn-artwork')"><div class="warn-icon-wrap">⚠</div><div class="warn-body"><div class="warn-title">Suncorp · Static Run — Artwork missing</div><div class="warn-sub">Site 23286 · 148 Brunswick St · Static 6×3m not received · Due in 2 days</div></div><div class="warn-actions"><button class="btn-primary sm" onclick="event.stopPropagation()">Send artwork link</button></div></div>
    <div class="warn-card" onclick="showModal('modal-warn-po')"><div class="warn-icon-wrap po">$</div><div class="warn-body"><div class="warn-title">QLD Rail · Digital — PO outstanding</div><div class="warn-sub">PO #QR-2026-047 · Invoice due 28 Feb · Campaign live</div></div><div class="warn-actions"><button class="btn-primary sm" onclick="event.stopPropagation()">Chase PO</button></div></div>
  </div>`;
  el.dataset.rendered='1';
}
function setBookingTab(el,id){setTab(el);['all','live','warn'].forEach(v=>{const d=$('bv-'+v);if(d)d.style.display=v===id?'block':'none';});}

// ─── RENEWALS ─────────────────────────────────────────────────────────────────
function renderRenewals(){
  const el=$('screen-renewals');
  el.innerHTML=`<div class="screen-header"><div><h1>Renewals</h1><p class="screen-sub">$342k at stake this quarter</p></div></div>
  <div class="metric-grid four"><div class="metric-card"><div class="metric-label">Due &lt;7 days</div><div class="metric-val red">1</div></div><div class="metric-card"><div class="metric-label">Due &lt;30 days</div><div class="metric-val amber">2</div></div><div class="metric-card"><div class="metric-label">Due &lt;60 days</div><div class="metric-val">4</div></div><div class="metric-card"><div class="metric-label">At stake</div><div class="metric-val">$342k</div></div></div>
  <div class="renewal-framework"><div class="rf-title">Renewal framework</div><div class="rf-steps"><div class="rf-step"><div class="rf-step-label">60 days out</div><div class="rf-step-body">Send post-campaign report. Open conversation.</div></div><div class="rf-arrow">→</div><div class="rf-step"><div class="rf-step-label">30 days out</div><div class="rf-step-body">Present new avails. Confirm budget. Send proposal.</div></div><div class="rf-arrow">→</div><div class="rf-step"><div class="rf-step-label">7 days out</div><div class="rf-step-body">Follow up. Generate report. Push to close.</div></div></div></div>
  <div class="table-card"><table class="data-table"><thead><tr><th>Client</th><th>Due</th><th>Est. value</th><th>Stage</th><th>Actions</th></tr></thead><tbody>
    <tr><td><div class="client-cell"><div class="avatar av-green">QL</div><div><div class="client-name">Queensland Rail</div><div class="client-sub">Sarah Kim</div></div></div></td><td><span class="pill pill-red">7 days</span></td><td class="fw5">$52k</td><td><span class="pill pill-amber">Proposal out</span></td>
    <td><div style="display:flex;gap:6px"><button class="btn-primary sm" onclick="generatePPTX('postcampaign','Queensland Rail','LP9 2026 · 2 Feb – 1 Mar 2026')">↓ Post-campaign PPTX</button></div></td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-blue">SC</div><div><div class="client-name">Suncorp</div><div class="client-sub">Emma Walsh</div></div></div></td><td><span class="pill pill-amber">28 days</span></td><td class="fw5">$45k</td><td><span class="pill pill-blue">Avails sent</span></td>
    <td><button class="btn-ghost sm">Build proposal</button></td></tr>
  </tbody></table></div>`;
  el.dataset.rendered='1';
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function renderDashboard(){
  const el=$('screen-dashboard');
  el.innerHTML=`<div class="screen-header"><div><h1>Dashboard</h1><p class="screen-sub">YTD 2026 · QLD portfolio</p></div><select class="select-sm"><option>YTD 2026</option><option>Q1 2026</option></select></div>
  <div class="metric-grid four"><div class="metric-card"><div class="metric-label">Active clients</div><div class="metric-val">19</div><div class="metric-delta up">+3 vs last year</div></div><div class="metric-card"><div class="metric-label">Revenue YTD</div><div class="metric-val">$1.2M</div><div class="metric-delta">82% of target</div></div><div class="metric-card"><div class="metric-label">Renewals at risk</div><div class="metric-val red">$342k</div><div class="metric-delta">4 clients</div></div><div class="metric-card"><div class="metric-label">Avg client LTV</div><div class="metric-val">$128k</div><div class="metric-delta">3.2yr avg</div></div></div>
  <div class="dash-grid"><div class="dash-card"><div class="dash-card-title">Revenue vs target</div><div class="chart-wrap" style="height:180px"><canvas id="rev-chart"></canvas></div></div><div class="dash-card"><div class="dash-card-title">Pipeline forecast</div><div class="pipeline-total">$480k <span>weighted · 60 days</span></div><div class="pipeline-bars"><div class="pb-row"><span>Harvey Norman</span><div class="pb-track"><div class="pb-fill" style="width:100%"></div></div><span>$120k</span></div><div class="pb-row"><span>Woolworths</span><div class="pb-track"><div class="pb-fill" style="width:71%"></div></div><span>$85k</span></div><div class="pb-row"><span>Myer</span><div class="pb-track"><div class="pb-fill" style="width:50%"></div></div><span>$60k</span></div></div></div></div>
  <div class="action-items-card"><div class="aic-title">Action items</div><div class="action-item urgent"><div class="ai-dot red"></div><div class="ai-body">QLD Rail renewal due in 7 days — close or lose $52k</div><button class="btn-ghost sm">Action</button></div><div class="action-item"><div class="ai-dot amber"></div><div class="ai-body">Suncorp artwork missing for LP9 — chase today</div><button class="btn-ghost sm">Action</button></div><div class="action-item"><div class="ai-dot amber"></div><div class="ai-body">Harvey Norman viewed proposal 3× — call today</div><button class="btn-ghost sm">Action</button></div></div>`;
  el.dataset.rendered='1';
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function renderReports(){
  const el=$('screen-reports');
  el.innerHTML=`<div class="screen-header"><div><h1>Reports</h1><p class="screen-sub">Revenue · Pipeline · Bonus</p></div><button class="btn-primary sm" onclick="showModal('modal-bonus-report')">Generate bonus report</button></div>
  <div class="metric-grid three"><div class="metric-card"><div class="metric-label">Billed YTD</div><div class="metric-val">$1.24M</div><div class="metric-delta up">+4% vs target</div></div><div class="metric-card"><div class="metric-label">Pipeline (60d)</div><div class="metric-val">$480k</div><div class="metric-delta">5 prospects</div></div><div class="metric-card"><div class="metric-label">Full year forecast</div><div class="metric-val">$2.8M</div><div class="metric-delta">94% of target</div></div></div>
  <div class="reports-grid">
    <div class="dash-card"><div class="dash-card-title">Revenue by format — LP9 2026</div><div class="chart-wrap" style="height:200px"><canvas id="format-chart"></canvas></div><div class="chart-legend"><span><i style="background:#111827"></i>Iconic $510k</span><span><i style="background:#C8102E"></i>Digital $420k</span><span><i style="background:#9CA3AF"></i>Static $310k</span></div></div>
    <div class="dash-card bonus-widget"><div class="dash-card-title">Bonus tracker · LP9</div>
      <div class="bonus-ring-wrap"><svg viewBox="0 0 100 100" width="110" height="110"><circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" stroke-width="12"/><circle cx="50" cy="50" r="38" fill="none" stroke="#C8102E" stroke-width="12" stroke-dasharray="155 84" stroke-linecap="round" transform="rotate(-90 50 50)"/></svg><div class="bonus-ring-label"><div class="bonus-pct">65%</div><div class="bonus-pct-sub">paid</div></div></div>
      <div class="bonus-stats"><div class="bonus-stat"><div class="bonus-stat-val">$287k</div><div class="bonus-stat-label">Paid media</div></div><div class="bonus-stat"><div class="bonus-stat-val red">$154k</div><div class="bonus-stat-label">Bonus given</div></div></div>
      <button class="btn-ghost sm" style="width:100%;margin-top:12px" onclick="showModal('modal-bonus-report')">Generate bonus report ↓ XLSX</button>
    </div>
  </div>
  <div class="table-card" style="margin-top:16px"><div style="padding:12px 16px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border)">Top clients — YTD</div>
  <table class="data-table"><thead><tr><th>Client</th><th>Paid</th><th>Bonus</th><th>Bonus %</th><th>Campaigns</th><th>Trend</th></tr></thead><tbody>
    <tr><td><div class="client-cell"><div class="avatar av-blue">SC</div><div class="client-name">Suncorp</div></div></td><td class="fw5">$248k</td><td>$31k</td><td><span class="pill pill-green">12.5%</span></td><td>6</td><td><span class="trend-up">↑ +18%</span></td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-green">QL</div><div class="client-name">QLD Rail</div></div></td><td class="fw5">$184k</td><td>$28k</td><td><span class="pill pill-amber">15.2%</span></td><td>4</td><td><span class="trend-up">↑ +6%</span></td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-red">AM</div><div class="client-name">Alliance Media</div></div></td><td class="fw5">$91k</td><td>$12k</td><td><span class="pill pill-green">13.2%</span></td><td>3</td><td><span class="trend-dn">↓ -4%</span></td></tr>
  </tbody></table></div>`;
  el.dataset.rendered='1';
}

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────
function renderInsights(){
  const el=$('screen-insights');
  el.innerHTML=`<div class="screen-header"><div><h1>Insights</h1><p class="screen-sub">AI-aggregated · Updated LP9 2026</p></div>
    <div class="header-actions"><select class="select-sm"><option>LP9 2026</option><option>LP8 2026</option><option>Last 6 LPs</option></select></div>
  </div>

  <div class="insights-alert"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    <strong>3 high-priority insights this LP</strong> — 2 sites at rate increase threshold, 1 category conflict risk, $48k in packagable inventory.
  </div>

  <div class="insights-grid">
    <div class="insight-card hot">
      <div class="ic-header"><div class="ic-badge hot">🔥 Hot inventory</div><div class="ic-age">LP9 data</div></div>
      <div class="ic-title">Abbotsford Road, Bowen Hills</div>
      <div class="ic-sub">ICONIC · North Inbound · $260k/LP</div>
      <div class="ic-stats"><div class="ic-stat"><div class="ic-stat-val">94%</div><div class="ic-stat-lbl">Booked rate</div></div><div class="ic-stat"><div class="ic-stat-val">8</div><div class="ic-stat-lbl">Consecutive LPs sold</div></div><div class="ic-stat"><div class="ic-stat-val">LP5</div><div class="ic-stat-lbl">Next available</div></div></div>
      <div class="ic-insight">This site has sold every LP for 8 consecutive periods. Demand exceeds supply — recommend <strong>+12% rate increase</strong> for LP11 renewal conversations.</div>
      <div class="ic-actions"><button class="btn-primary sm">Flag for rate review</button><button class="btn-ghost sm">View site</button></div>
    </div>
    <div class="insight-card vacancy">
      <div class="ic-header"><div class="ic-badge vacancy">📍 Vacancy risk</div><div class="ic-age">LP9 data</div></div>
      <div class="ic-title">Sandgate Road corridor — 4 sites</div>
      <div class="ic-sub">North · Mixed format · $18k–$42k/LP</div>
      <div class="ic-stats"><div class="ic-stat"><div class="ic-stat-val">38%</div><div class="ic-stat-lbl">Vacancy rate</div></div><div class="ic-stat"><div class="ic-stat-val">3</div><div class="ic-stat-lbl">LPs unsold</div></div><div class="ic-stat"><div class="ic-stat-val red">$126k</div><div class="ic-stat-lbl">Revenue at risk</div></div></div>
      <div class="ic-insight">Sandgate Rd underperforming vs network avg (22% vacancy). Retail category historically strong here — <strong>Woolworths or Myer</strong> would be a strategic fit. Bundle pricing could convert.</div>
      <div class="ic-actions"><button class="btn-primary sm" onclick="showModal('modal-package-builder')">Build package</button><button class="btn-ghost sm">View sites</button></div>
    </div>
    <div class="insight-card category">
      <div class="ic-header"><div class="ic-badge category">📊 Category trend</div><div class="ic-age">YTD 2026</div></div>
      <div class="ic-title">Retail category spending up 34% YOY</div>
      <div class="ic-sub">Harvey Norman · Woolworths · Myer in pipeline</div>
      <div class="ic-stats"><div class="ic-stat"><div class="ic-stat-val">+34%</div><div class="ic-stat-lbl">YOY spend</div></div><div class="ic-stat"><div class="ic-stat-val">$265k</div><div class="ic-stat-lbl">Avg deal size</div></div><div class="ic-stat"><div class="ic-stat-val amber">3</div><div class="ic-stat-lbl">Conflict risk</div></div></div>
      <div class="ic-insight">3 retail brands simultaneously in pipeline creates category conflict risk. Harvey Norman and Woolworths cannot share the same panel same LP. <strong>Prioritise Harvey Norman</strong> — higher deal value and further along.</div>
      <div class="ic-actions"><button class="btn-ghost sm">View conflict map</button></div>
    </div>
    <div class="insight-card package">
      <div class="ic-header"><div class="ic-badge package">💡 Package opportunity</div><div class="ic-age">AI generated</div></div>
      <div class="ic-title">City Loop commuter package — $48k</div>
      <div class="ic-sub">6 sites · Spring Hill + Milton + Toowong</div>
      <div class="ic-stats"><div class="ic-stat"><div class="ic-stat-val">2.1M</div><div class="ic-stat-lbl">Est. weekly reach</div></div><div class="ic-stat"><div class="ic-stat-val">$22.80</div><div class="ic-stat-lbl">Est. CPM</div></div><div class="ic-stat"><div class="ic-stat-val green">All free</div><div class="ic-stat-lbl">LP10 availability</div></div></div>
      <div class="ic-insight">6 City Loop sites available LP10 targeting AM/PM commuter peaks. Ideal for financial services or FMCG. Bundled at $48k this represents <strong>8% below rack rate</strong> — strong conversion offer for Harvey Norman or Woolworths.</div>
      <div class="ic-actions"><button class="btn-primary sm" onclick="generatePPTX('proposal','City Loop Package','LP10 2026')">↓ Build proposal</button><button class="btn-ghost sm">View sites</button></div>
    </div>
    <div class="insight-card rate">
      <div class="ic-header"><div class="ic-badge rate">💰 Rate intelligence</div><div class="ic-age">Network data</div></div>
      <div class="ic-title">Iconic network — rate increase opportunity</div>
      <div class="ic-sub">5 sites · 90%+ occupancy 3+ consecutive LPs</div>
      <div class="ic-stats"><div class="ic-stat"><div class="ic-stat-val">91%</div><div class="ic-stat-lbl">Avg occupancy</div></div><div class="ic-stat"><div class="ic-stat-val">+$127k</div><div class="ic-stat-lbl">Revenue uplift at +8%</div></div><div class="ic-stat"><div class="ic-stat-val">LP11</div><div class="ic-stat-lbl">Recommended timing</div></div></div>
      <div class="ic-insight">5 Iconic sites running at 91%+ occupancy for 3+ LPs — well above the 75% threshold for rate review. Recommend 8–12% increase at LP11 renewals. Frame as demand-driven, not arbitrary.</div>
      <div class="ic-actions"><button class="btn-ghost sm">Export rate review report</button></div>
    </div>
    <div class="insight-card client">
      <div class="ic-header"><div class="ic-badge client">👤 Client intelligence</div><div class="ic-age">LTV analysis</div></div>
      <div class="ic-title">Suncorp — highest growth potential</div>
      <div class="ic-sub">6 campaigns · $248k LTV · Growing YOY</div>
      <div class="ic-stats"><div class="ic-stat"><div class="ic-stat-val">+18%</div><div class="ic-stat-lbl">YOY spend growth</div></div><div class="ic-stat"><div class="ic-stat-val">$41k</div><div class="ic-stat-lbl">Avg campaign size</div></div><div class="ic-stat"><div class="ic-stat-val green">Low</div><div class="ic-stat-lbl">Churn risk</div></div></div>
      <div class="ic-insight">Suncorp is growing spend 18% YOY with no churn signals. Emma has flagged interest in Iconic for Q3. LP10 renewal conversation is the right moment to upsell — <strong>target $55k+ with Iconic add-on</strong>.</div>
      <div class="ic-actions"><button class="btn-primary sm" onclick="generatePPTX('proposal','Suncorp LP10','LP10 2026')">↓ Build upsell proposal</button></div>
    </div>
  </div>

  <div class="package-builder-card">
    <div class="pb-card-header"><div><div class="pb-card-title">Package builder</div><div class="pb-card-sub">Enter a client brief — get strategic site recommendations at 3 price points</div></div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
    <div class="pb-form">
      <div class="form-grid-3">
        <div class="form-group"><label>Client / category</label><input type="text" id="pb-client" placeholder="e.g. Retail · Fashion" value="Harvey Norman — Electronics retail"></div>
        <div class="form-group"><label>Objective</label><input type="text" id="pb-obj" placeholder="e.g. Brand awareness" value="Drive foot traffic to Brisbane stores"></div>
        <div class="form-group"><label>Target audience</label><input type="text" id="pb-aud" placeholder="e.g. P25–54" value="Homeowners · P35–60 · HHI $80k+"></div>
      </div>
      <div class="form-grid-3">
        <div class="form-group"><label>Location preference</label><select id="pb-loc"><option value="">Any</option><option>City</option><option>North</option><option>South</option><option>East</option><option>West</option></select></div>
        <div class="form-group"><label>Campaign period</label><select id="pb-lp"><option>LP10 2026</option><option>LP11 2026</option><option>LP12 2026</option></select></div>
        <div class="form-group" style="display:flex;align-items:flex-end"><button class="btn-primary sm" style="width:100%" onclick="runPackageBuilder()">Generate packages →</button></div>
      </div>
    </div>
    <div id="pb-results" class="pb-results"></div>
  </div>`;
  el.dataset.rendered='1';
}

function runPackageBuilder(){
  const client=$('pb-client')?.value||'Client';
  const obj=$('pb-obj')?.value||'Brand awareness';
  const loc=$('pb-loc')?.value||'';
  const lp=$('pb-lp')?.value||'LP10 2026';
  const res=$('pb-results'); if(!res)return;

  // Filter available sites in selected LP
  const lpEntry=LP_DATA.find((_,i)=>('LP'+(i+1)+' 2026')===lp)||LP_DATA[3];
  const available=SITES_DATA.filter(s=>{
    if(loc&&s.location!==loc)return false;
    return s.lp_avail[lpEntry?.start]==='available';
  });

  const iconics=available.filter(s=>s.size_cat==='Iconic').slice(0,6);
  const digitals=available.filter(s=>s.format==='Digital').slice(0,8);
  const statics=available.filter(s=>s.format==='Static'&&s.size_cat==='6x3m').slice(0,6);

  const pkg1sites=iconics.slice(0,2); const pkg1val=pkg1sites.reduce((s,x)=>s+(x.lunar_rate||0),0);
  const pkg2sites=[...iconics.slice(0,2),...digitals.slice(0,2)]; const pkg2val=pkg2sites.reduce((s,x)=>s+(x.lunar_rate||0),0);
  const pkg3sites=[...iconics.slice(0,3),...digitals.slice(0,3),...statics.slice(0,2)]; const pkg3val=pkg3sites.reduce((s,x)=>s+(x.lunar_rate||0),0);

  res.innerHTML=`<div class="pb-results-title">Packages for ${client} · ${lp}</div>
  <div class="pb-packages">
    ${pbPackage('Essential','$'+Math.round(pkg1val/1000)+'k',pkg1sites,'Targeted reach — 2 premium Iconic sites in highest-traffic positions. Ideal for brand presence with focused budget.',pkg1sites.length+' sites · Iconic only · Est. reach 800k/wk')}
    ${pbPackage('Core','$'+Math.round(pkg2val/1000)+'k',pkg2sites,'Balanced coverage — mix of Iconic presence and digital flexibility. Recommended for brand + tactical messaging split.','recommended',pkg2sites.length+' sites · Iconic + Digital · Est. reach 1.4M/wk')}
    ${pbPackage('Full corridor','$'+Math.round(pkg3val/1000)+'k',pkg3sites,'Maximum network dominance — comprehensive coverage across Iconic, Digital and Static formats. Category ownership.',pkg3sites.length+' sites · All formats · Est. reach 2.2M/wk')}
  </div>`;
}

function pbPackage(name,val,sites,desc,tag,meta){
  const isRec=tag==='recommended';
  const sitesTag=isRec?meta:tag; const metaStr=isRec?undefined:undefined;
  return `<div class="pb-pkg ${isRec?'pb-pkg-rec':''}">
    ${isRec?'<div class="pb-rec-badge">Recommended</div>':''}
    <div class="pb-pkg-name">${name}</div>
    <div class="pb-pkg-val">${val}</div>
    <div class="pb-pkg-meta">${isRec?meta:tag}</div>
    <div class="pb-pkg-desc">${desc}</div>
    <div class="pb-pkg-sites">${sites.slice(0,3).map(s=>`<div class="pb-site-row"><span class="pb-site-name">${s.name}</span><span class="text-muted" style="font-size:10px">${s.location}</span></div>`).join('')}${sites.length>3?`<div style="font-size:10px;color:var(--muted)">+${sites.length-3} more sites</div>`:''}</div>
    <button class="btn-primary sm" style="width:100%;margin-top:10px" onclick="generatePPTX('proposal','${name} Package','${$('pb-lp')?.value||'LP10 2026'}')">↓ Generate proposal</button>
  </div>`;
}

// ─── AI BUDDY ─────────────────────────────────────────────────────────────────
const AI_RESPONSES={
  'clients not contacted':`<div class="ai-response"><div class="ai-r-title">Clients not contacted in 30+ days</div><div class="ai-r-body"><div class="air-item"><span class="av-sm av-purple">OW</span><div><div class="air-name">OzWine Group</div><div class="air-sub">Last contact: 82 days ago · $62k LTV · Status: Inactive</div></div></div><div class="air-item"><span class="av-sm av-blue">BQ</span><div><div class="air-name">BrisQuad FC</div><div class="air-sub">Last contact: 31 days ago · Renewal in 45 days · Recommended: call this week</div></div></div></div><div class="ai-r-cta">Suggest: schedule re-engagement call with OzWine this week. Q2 retail is picking up — good timing.</div></div>`,
  'pipeline risks':`<div class="ai-response"><div class="ai-r-title">Pipeline risks — next 30 days</div><div class="ai-r-body"><div class="risk-row red"><div class="risk-dot"></div><div><strong>QLD Rail</strong> — renewal expires in 7 days. $184k LTV client. If lost, Q2 revenue target is at risk. Prioritise this week.</div></div><div class="risk-row amber"><div class="risk-dot"></div><div><strong>Myer Retail</strong> — no reply in 5 days. Cold outreach failing. Try lateral — find their media agency contact on LinkedIn.</div></div><div class="risk-row amber"><div class="risk-dot"></div><div><strong>Harvey Norman</strong> — proposal sitting open. 3 views = intent. Don't let it go cold. Call by Wednesday.</div></div></div></div>`,
  'renewal email':`<div class="ai-response"><div class="ai-r-title">Draft renewal email — Queensland Rail</div><div class="ai-r-body ai-r-email"><div style="font-size:12px;line-height:1.8;color:var(--dark)">Hi Sarah,<br><br>Wanted to reach out ahead of your LP9 campaign wrapping up — the results were genuinely strong. 2.14M impressions, 99.8% uptime, and we actually over-delivered by $2,720 in bonus inventory.<br><br>I'd love to lock in LP10 for you before the sites get committed. Given your corridor focus, I'd recommend holding the same 4 sites — they're all available from 9 March.<br><br>Happy to jump on a quick call this week to run through options.<br><br>Hannah</div></div><div class="ai-r-cta">Tone: warm, data-led, low pressure. Copy and personalise before sending.</div></div>`,
  'retail sites':`<div class="ai-response"><div class="ai-r-title">Best sites for retail brief — LP10</div><div class="ai-r-body"><div class="air-item"><span class="site-dot green"></span><div><div class="air-name">Sandgate Rd, Clayfield</div><div class="air-sub">DIGITAL · North · $42k/LP · High foot traffic corridor · Available LP10</div></div></div><div class="air-item"><span class="site-dot green"></span><div><div class="air-name">Milton Road (Inbound)</div><div class="air-sub">ICONIC · West · $166k/LP · Commuter AM peak · Available LP10</div></div></div><div class="air-item"><span class="site-dot green"></span><div><div class="air-name">Coronation Drive, Toowong</div><div class="air-sub">ICONIC · West · $260k/LP · Premium retail precinct · Available LP10</div></div></div></div><div class="ai-r-cta">These 3 sites reach ~1.2M weekly. Bundle at $468k or split into 2-site options at ~$200k.</div></div>`,
  'weekly todo':`<div class="ai-response"><div class="ai-r-title">Your week — 14 Apr 2026</div><div class="ai-r-body"><div class="todo-item urgent"><div class="todo-day">Today</div><div>Call Sarah Kim (QLD Rail) — renewal expires in 7 days. Confirm LP10 sites.</div></div><div class="todo-item"><div class="todo-day">Tue</div><div>Call Harvey Norman (Mark D.) — proposal viewed 3×, best call window 10–11am.</div></div><div class="todo-item"><div class="todo-day">Wed</div><div>Woolworths meeting — prepare North Corridor + Inner West options. Check category conflict re Harvey Norman.</div></div><div class="todo-item"><div class="todo-day">Thu</div><div>Chase Suncorp artwork — 148 Brunswick St static due Friday.</div></div><div class="todo-item"><div class="todo-day">Fri</div><div>Follow up Myer — try new contact. Re-engage OzWine Group via email.</div></div></div></div>`,
};

let aiHistory=[];
function renderAI(){
  const el=$('screen-ai');
  el.innerHTML=`<div class="screen-header"><div><h1>AI buddy</h1><p class="screen-sub">Week of 14 Apr 2026</p></div></div>
  <div class="ai-week-brief"><div class="aib-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Your week at a glance</div>
  <div class="aib-items"><div class="aib-item red"><div class="aib-dot"></div>QLD Rail renewal expires in 7 days. $184k LTV — prioritise above new business.</div><div class="aib-item amber"><div class="aib-dot"></div>Harvey Norman viewed your proposal 3×. Best call window: Tue–Wed 10–11am.</div><div class="aib-item green"><div class="aib-dot"></div>Woolworths meeting Wednesday — prepare North Corridor + Inner West options.</div></div></div>
  <div class="ai-chat-area" id="ai-chat"></div>
  <div class="ai-ask"><div class="ai-ask-label">Ask me anything about your portfolio</div>
    <div class="ai-ask-row"><input type="text" class="ai-input" id="ai-input" placeholder="e.g. which clients haven't been contacted in 30 days?" onkeydown="if(event.key==='Enter')askAI()"><button class="btn-primary sm" onclick="askAI()">Ask</button></div>
    <div class="ai-chips">
      <button class="chip" onclick="chipAsk('clients not contacted','Which clients haven\\'t been contacted in 30 days?')">📋 Clients not contacted</button>
      <button class="chip" onclick="chipAsk('pipeline risks','What are my pipeline risks this month?')">⚠ Pipeline risks</button>
      <button class="chip" onclick="chipAsk('renewal email','Draft a renewal email for Queensland Rail')">✉ Draft renewal email</button>
      <button class="chip" onclick="chipAsk('retail sites','Best sites for a retail brief in LP10?')">📍 Best retail sites</button>
      <button class="chip" onclick="chipAsk('weekly todo','Give me my weekly to-do list')">✅ Weekly to-do</button>
    </div>
  </div>`;
  el.dataset.rendered='1';
}
function chipAsk(key,label){const inp=$('ai-input');if(inp)inp.value=label;askAI(key);}
function askAI(key){
  const inp=$('ai-input'); const q=inp?.value||''; if(!q.trim()&&!key)return;
  const chat=$('ai-chat'); if(!chat)return;
  const qDisplay=q||'...';
  chat.innerHTML+=`<div class="ai-msg user">${qDisplay}</div>`;
  if(inp)inp.value='';
  // Find matching response
  const lq=(q||key||'').toLowerCase();
  let resp=null;
  if(lq.includes('contact')||lq.includes('30 day'))resp=AI_RESPONSES['clients not contacted'];
  else if(lq.includes('pipeline')||lq.includes('risk'))resp=AI_RESPONSES['pipeline risks'];
  else if(lq.includes('email')||lq.includes('renewal email'))resp=AI_RESPONSES['renewal email'];
  else if(lq.includes('retail')||lq.includes('site'))resp=AI_RESPONSES['retail sites'];
  else if(lq.includes('todo')||lq.includes('week')||lq.includes('to-do'))resp=AI_RESPONSES['weekly todo'];
  else if(key)resp=AI_RESPONSES[key];
  if(!resp)resp=`<div class="ai-response"><div class="ai-r-body">I don't have specific data on that yet — try one of the quick chips below for supported queries, or this feature will connect to live Adman data in the next release.</div></div>`;
  chat.innerHTML+=`<div class="ai-msg assistant">${resp}</div>`;
  chat.scrollTop=chat.scrollHeight;
}

// ─── AVAILABILITY — GANTT ─────────────────────────────────────────────────────
let availSelSites=new Set();
function renderAvailability(){
  const el=$('screen-availability');
  const lpOptions=LP_DATA.map((lp,i)=>`<option value="${lp.start}">LP${i+1} · ${fmtDate(lp.start)} – ${fmtDate(lp.end)}</option>`).join('');
  el.innerHTML=`<div class="screen-header"><div><h1>Availability</h1><p class="screen-sub" id="avail-sub">Select a date range to begin</p></div>
    <div class="header-actions"><button class="btn-ghost sm" onclick="exportMOVECSV()">↓ MOVE CSV</button></div>
  </div>
  <div class="avail-top-bar">
    <div class="avail-range-group">
      <label class="avail-label">Campaign period</label>
      <div class="avail-date-row">
        <input type="date" id="avail-from" class="avail-date-input" value="2026-05-04">
        <span class="avail-date-sep">→</span>
        <input type="date" id="avail-to" class="avail-date-input" value="2026-06-28">
        <div class="view-toggle"><button class="vtbtn active" id="vt-lp" onclick="setViewMode('lp',this)">By LP</button><button class="vtbtn" id="vt-week" onclick="setViewMode('weekly',this)">By week</button></div>
      </div>
    </div>
    <div class="avail-filter-bar">
      <div class="avail-filters-row">
        <input type="text" class="search-input" placeholder="Search name, suburb…" id="avail-search">
        <select class="select-sm" id="avail-format" onchange="onFormatChange()"><option value="">All formats</option><option>Digital</option><option>Static</option></select>
        <select class="select-sm" id="avail-size"><option value="">All sizes</option><option>Iconic</option><option>6x3m</option><option>Large format</option><option>8x3m</option><option>Portrait</option></select>
        <select class="select-sm" id="avail-loc"><option value="">All locations</option><option>City</option><option>North</option><option>South</option><option>East</option><option>West</option></select>
        <select class="select-sm" id="avail-status"><option value="">All status</option><option value="available">Available in range</option><option value="booked">Fully booked</option></select>
        <select class="select-sm" id="avail-rate"><option value="">Any rate</option><option value="low">Under $50k</option><option value="mid">$50k–$150k</option><option value="high">Over $150k</option></select>
        <button class="btn-primary sm" onclick="applyAvailFilters()">Apply filters</button>
        <button class="btn-ghost sm" onclick="resetAvailFilters()">Reset</button>
      </div>
    </div>
  </div>
  <div class="avail-legend"><span class="al-item"><span class="al-dot green"></span>Available</span><span class="al-item"><span class="al-dot red"></span>Booked</span><span class="al-count" id="avail-count-lbl"></span></div>
  <div class="gantt-wrap" id="gantt-wrap"><div class="gantt-empty">Set a date range above and click Apply filters</div></div>
  <div id="avail-sel-bar" class="selected-bar" style="display:none"><span id="avail-sel-cnt">0 sites selected</span><button class="btn-primary sm" onclick="addToProposal()">Add to proposal →</button><button class="btn-ghost sm" onclick="clearAvailSel()">Clear</button></div>`;
  el.dataset.rendered='1';
}

let availViewMode='lp';
function onFormatChange(){
  const fmt=($('avail-format')?.value||'').toLowerCase();
  if(fmt==='digital'){availViewMode='weekly';updateViewToggle('vt-week');}
  else if(fmt==='static'){availViewMode='lp';updateViewToggle('vt-lp');}
}
function setViewMode(mode,btn){availViewMode=mode;if(btn){btn.closest('.view-toggle').querySelectorAll('.vtbtn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}}
function updateViewToggle(activeId){document.querySelectorAll('.vtbtn').forEach(b=>{b.classList.toggle('active',b.id===activeId);});}
function applyAvailFilters(){renderGantt();}
function resetAvailFilters(){['avail-search','avail-format','avail-size','avail-loc','avail-status','avail-rate'].forEach(id=>{const el=$(id);if(el){el.tagName==='INPUT'?el.value='':el.selectedIndex=0;}});renderGantt();}

function getActiveLPs(){
  const from=$('avail-from')?.value||''; const to=$('avail-to')?.value||'';
  if(!from||!to) return LP_DATA.slice(0,8);
  return LP_DATA.filter(lp=>lp.start<=to&&lp.end>=from);
}

function renderGantt(){
  const wrap=$('gantt-wrap');if(!wrap)return;
  const search=($('avail-search')?.value||'').toLowerCase();
  const fmt=$('avail-format')?.value||'';
  const size=$('avail-size')?.value||'';
  const loc=$('avail-loc')?.value||'';
  const statusF=$('avail-status')?.value||'';
  const rate=$('avail-rate')?.value||'';
  const activeLPs=getActiveLPs();
  const from=$('avail-from')?.value||''; const to=$('avail-to')?.value||'';

  let sites=SITES_DATA.filter(s=>{
    if(search&&!s.name.toLowerCase().includes(search)&&!(s.suburb||'').toLowerCase().includes(search))return false;
    if(fmt&&s.format!==fmt)return false;
    if(size&&s.size_cat!==size)return false;
    if(loc&&s.location!==loc)return false;
    if(rate){const r=s.lunar_rate||0;if(rate==='low'&&r>=50000)return false;if(rate==='mid'&&(r<50000||r>150000))return false;if(rate==='high'&&r<=150000)return false;}
    if(statusF){const vals=activeLPs.map(lp=>s.lp_avail[lp.start]||'');if(statusF==='available'&&!vals.includes('available'))return false;if(statusF==='booked'&&vals.includes('available'))return false;}
    return true;
  });

  const sub=$('avail-sub');if(sub)sub.textContent=`${sites.length} sites · ${from?fmtDate(from)+' – '+fmtDate(to):'all periods'}`;
  const cl=$('avail-count-lbl');if(cl)cl.textContent=`Showing ${Math.min(sites.length,150)} of ${SITES_DATA.length} sites`;

  if(!sites.length){wrap.innerHTML='<div class="gantt-empty">No sites match the current filters.</div>';return;}

  const hdrs=activeLPs.map((lp,i)=>{const lpNum=LP_DATA.indexOf(lp)+1;return`<div class="gantt-col-hdr"><div class="gantt-lp-num">LP${lpNum}</div><div class="gantt-lp-date">${fmtDateShort(lp.start)}</div></div>`;}).join('');

  const rows=sites.slice(0,150).map(s=>{
    const sel=availSelSites.has(s.ims);
    const rateStr=s.lunar_rate?'$'+Number(s.lunar_rate).toLocaleString():'—';
    const nextAvail=Object.entries(s.lp_avail||{}).find(([d,v])=>v==='available'&&(!from||d>=from));
    const blocks=activeLPs.map(lp=>{
      const v=s.lp_avail?.[lp.start];
      const cls=v==='available'?'gb-avail':v==='booked'?'gb-booked':'gb-nd';
      const label=v==='available'?'Free':v==='booked'?'Booked':'—';
      return`<div class="gantt-block ${cls}" title="${label}">${label}</div>`;
    }).join('');
    return`<div class="gantt-row ${sel?'gantt-sel':''}" data-ims="${s.ims}">
      <div class="gantt-site-info">
        <input type="checkbox" class="avail-cb" ${sel?'checked':''} onchange="toggleGanttSite('${s.ims}',this)" onclick="event.stopPropagation()">
        <div><div class="gantt-site-name">${s.name}</div>
        <div class="gantt-meta"><span class="pill ${s.format==='Digital'?'pill-blue':'pill-gray'} xs">${s.size_cat||s.format}</span><span class="gantt-loc">${s.location}</span><span class="gantt-dir">${s.direction}</span></div>
        <div class="gantt-rate">${rateStr}<span class="gantt-next">${nextAvail?'Next: '+fmtDateShort(nextAvail[0]):'Fully booked'}</span></div></div>
      </div>
      <div class="gantt-blocks">${blocks}</div>
    </div>`;
  }).join('');

  wrap.innerHTML=`<div class="gantt-table"><div class="gantt-header"><div class="gantt-site-col-hdr">Site <span style="font-weight:400;font-size:10px;color:var(--muted)">/ Format / Rate</span></div><div class="gantt-cols-hdr">${hdrs}</div></div><div class="gantt-body">${rows}</div></div>`;
}

function toggleGanttSite(ims,cb){if(cb.checked)availSelSites.add(ims);else availSelSites.delete(ims);cb.closest('.gantt-row')?.classList.toggle('gantt-sel',cb.checked);updateSelBar();}
function updateSelBar(){const b=$('avail-sel-bar'),c=$('avail-sel-cnt');if(b)b.style.display=availSelSites.size>0?'flex':'none';if(c)c.textContent=`${availSelSites.size} site${availSelSites.size!==1?'s':''} selected`;}
function clearAvailSel(){availSelSites.clear();document.querySelectorAll('.avail-cb').forEach(c=>c.checked=false);document.querySelectorAll('.gantt-row').forEach(r=>r.classList.remove('gantt-sel'));updateSelBar();}
function addToProposal(){nav(document.querySelectorAll('.nav-item')[9],'proposal');}

// ─── MOVE CSV EXPORT ──────────────────────────────────────────────────────────
function exportMOVECSV(){
  const from=$('avail-from')?.value||''; const to=$('avail-to')?.value||'';
  const activeLPs=getActiveLPs();
  const search=($('avail-search')?.value||'').toLowerCase();
  const fmt=$('avail-format')?.value||'';
  const size=$('avail-size')?.value||'';
  const loc=$('avail-loc')?.value||'';
  let sites=SITES_DATA.filter(s=>{
    if(search&&!s.name.toLowerCase().includes(search)&&!(s.suburb||'').toLowerCase().includes(search))return false;
    if(fmt&&s.format!==fmt)return false;if(size&&s.size_cat!==size)return false;if(loc&&s.location!==loc)return false;
    return true;
  });

  // Build MOVE upload format rows
  const rows=[['IMS_FaceID','Start_Date','End_Date','Share_of_time','Display_Length']];
  sites.slice(0,150).forEach(s=>{
    activeLPs.forEach(lp=>{
      if(s.lp_avail?.[lp.start]==='booked'){
        rows.push([s.ims,lp.start,lp.end,'0.1',s.spot||'8']);
      }
    });
  });

  if(!window.XLSX){alert('XLSX library not loaded yet — try again in a moment.');return;}
  const wb=XLSX.utils.book_new();
  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:14},{wch:12},{wch:12},{wch:14},{wch:14}];
  XLSX.utils.book_append_sheet(wb,ws,'MOVE Upload');
  XLSX.writeFile(wb,`goa_MOVE_upload_${from||'export'}.csv`);
}

// ─── PROPOSAL ─────────────────────────────────────────────────────────────────
function renderProposal(){
  const el=$('screen-proposal');
  el.innerHTML=`<div class="screen-header"><div><h1>Proposals</h1><p class="screen-sub">3 proposals · 1 draft · 1 in approval · 1 sent</p></div>
    <div class="header-actions"><button class="btn-primary sm" onclick="showModal('modal-new-proposal')">+ New proposal</button></div>
  </div>
  <div class="metric-grid four"><div class="metric-card"><div class="metric-label">Total proposals</div><div class="metric-val">3</div></div><div class="metric-card"><div class="metric-label">Draft</div><div class="metric-val">$48k</div></div><div class="metric-card"><div class="metric-label">In approval</div><div class="metric-val amber">$91k</div></div><div class="metric-card"><div class="metric-label">Sent</div><div class="metric-val">$120k</div></div></div>
  <div class="proposals-list">
    ${propRow('pd-1','AM','av-red','Alliance Media','LP9 2026','3 sites · $48,300 · Created 10 Apr','pill-gray','Draft',true)}
    ${propDetail()}
    ${propRow('pd-2','SC','av-blue','Suncorp','Q1 Static','6 sites · $91,500 · Created 5 Mar','pill-amber','In approval',false)}
    <div id="pd-2" class="prop-detail"></div>
    ${propRow('pd-3','HV','av-red','Harvey Norman','LP10 2026','4 sites · $120,000 · Sent 12 Apr','pill-blue','Sent',false)}
    <div id="pd-3" class="prop-detail"></div>
  </div>`;
  el.dataset.rendered='1';
}
function propRow(id,av,cls,name,camp,sub,pc,status,open){return`<div class="prop-row ${open?'open':''}" onclick="toggleProp('${id}',this)"><div class="prop-row-left"><div class="avatar ${cls}">${av}</div><div><div class="prop-row-title">${name} — ${camp}</div><div class="prop-row-sub">${sub}</div></div></div><div class="prop-row-right"><span class="pill ${pc}">${status}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="prop-chev ${open?'open':''}"><polyline points="6 9 12 15 18 9"/></svg></div></div>`;}
function propDetail(){return`<div id="pd-1" class="prop-detail open"><div class="pd-grid">
  <div class="pd-col"><div class="pd-section-title">Client &amp; objectives</div><div class="pd-field"><span class="pd-label">Client</span><span>Alliance Media</span></div><div class="pd-field"><span class="pd-label">Contact</span><span>Tom Reid · Director</span></div><div class="pd-field"><span class="pd-label">Objective</span><span>Brand awareness · North Brisbane corridor</span></div><div class="pd-field"><span class="pd-label">Audience</span><span>P25–54 Brisbane Metro</span></div><div class="pd-field"><span class="pd-label">Period</span><span>LP9 · 2 Feb – 1 Mar 2026</span></div><div class="pd-field"><span class="pd-label">Budget</span><span class="fw5">$48,300</span></div>
  <div class="pd-section-title" style="margin-top:14px">Artwork specs</div>
  <div class="pd-aw"><div class="pd-aw-site">201 Leichhardt St</div><div class="pd-aw-spec">6.4×7.6m · JPG/PDF · 300dpi · Due 26 Jan</div></div>
  <div class="pd-aw"><div class="pd-aw-site">764 Sandgate Rd</div><div class="pd-aw-spec">1920×640px · MP4/JPG · 15s · Due 26 Jan</div></div></div>
  <div class="pd-col"><div class="pd-section-title">Site selections</div>
  <div class="pd-site"><div class="pd-thumb"></div><div><div class="pd-site-name">201 Leichhardt St, Spring Hill</div><div class="pd-site-sub">23276 · ICONIC · 8 secs</div><div class="pd-site-rate">$41,650/LP · 2 Feb – 1 Mar</div></div></div>
  <div class="pd-site"><div class="pd-thumb"></div><div><div class="pd-site-name">764 Sandgate Rd, Clayfield</div><div class="pd-site-sub">23288 · DIGITAL · 15 secs</div><div class="pd-site-rate">$18,200/LP · 2 Feb – 1 Mar</div></div></div>
  <div class="pd-section-title" style="margin-top:14px">Notes</div><textarea class="proposal-notes">North corridor run. Tom confirmed no competitor conflict.</textarea></div>
  <div class="pd-col pd-summary-col"><div class="pd-section-title">Summary</div><div class="pd-total-block"><div class="pd-total-label">Total investment</div><div class="pd-total-val">$48,300</div></div>
  <div class="pd-sum-rows"><div class="pd-sum-row"><span>Sites</span><span>3</span></div><div class="pd-sum-row"><span>Format</span><span>Iconic + Digital</span></div><div class="pd-sum-row"><span>Weeks</span><span>4</span></div><div class="pd-sum-row"><span>CPM est.</span><span>$22.60</span></div></div>
  <button class="btn-primary sm" style="width:100%;margin-top:14px">Submit for approval</button>
  <button class="btn-ghost sm" style="width:100%;margin-top:6px" onclick="generatePPTX('proposal','Alliance Media','LP9 2026')">↓ Export as PPTX</button></div>
</div></div>`;}
function toggleProp(id,row){const d=$(id);if(!d)return;const open=d.classList.contains('open');if(open){d.classList.remove('open');d.style.display='none';row.classList.remove('open');row.querySelector('.prop-chev')?.classList.remove('open');}else{d.classList.add('open');d.style.display='block';row.classList.add('open');row.querySelector('.prop-chev')?.classList.add('open');}}

// ─── APPROVALS ────────────────────────────────────────────────────────────────
function renderApprovals(){
  const el=$('screen-approvals');
  el.innerHTML=`<div class="screen-header"><div><h1>Approvals</h1><p class="screen-sub">3 pending · 1 approved this week</p></div></div>
  <div class="tabs"><button class="tab active" onclick="setTab(this)">Pending (3)</button><button class="tab" onclick="setTab(this)">Approved</button><button class="tab" onclick="setTab(this)">History</button></div>
  <div class="approval-card"><div class="approval-card-header"><div><div class="approval-name">Alliance Media · LP9 2026</div><div class="approval-sub">3 sites · $48,300 · Submitted 10 min ago</div></div><span class="pill pill-amber">Awaiting GM</span></div>
  <div class="approval-steps"><div class="apstep done"><div class="apstep-dot">✓</div><div><div class="apstep-label">Sales lead</div><div class="apstep-sub">Approved · 10 min ago</div></div></div><div class="apstep-line"></div><div class="apstep active"><div class="apstep-dot">2</div><div><div class="apstep-label">State GM</div><div class="apstep-sub">Pending · 2–4 hrs</div></div></div><div class="apstep-line"></div><div class="apstep"><div class="apstep-dot">3</div><div><div class="apstep-label">Finance</div><div class="apstep-sub">Unlocks after GM</div></div></div></div>
  <div class="approval-card-footer"><button class="btn-ghost sm">View proposal</button><button class="btn-ghost sm">Nudge approver</button><button class="btn-danger sm">Withdraw</button></div></div>`;
  el.dataset.rendered='1';
}

// ─── BRAND ────────────────────────────────────────────────────────────────────
function renderBrand(){
  const el=$('screen-brand');
  el.innerHTML=`<div class="screen-header"><div><h1>Brand hub</h1><p class="screen-sub">goa knowledge base</p></div></div>
  <div class="brand-grid"><div class="brand-card"><div class="brand-card-icon red"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div><div class="brand-card-title">Brand guidelines</div><div class="brand-card-body">Logo, colour, typography, tone of voice.</div><div class="brand-card-meta">Updated Mar 2026 →</div></div><div class="brand-card"><div class="brand-card-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div class="brand-card-title">Creative specs</div><div class="brand-card-body">All format specs, sizes, resolution.</div><div class="brand-card-meta">Digital + Static + Iconic →</div></div><div class="brand-card"><div class="brand-card-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="brand-card-title">Product catalogue</div><div class="brand-card-body">532 QLD sites — Iconic, Digital, Static.</div><div class="brand-card-meta">Full site list →</div></div><div class="brand-card"><div class="brand-card-icon amber"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="brand-card-title">Policies &amp; processes</div><div class="brand-card-body">Discounts, approvals, conflicts, deadlines.</div><div class="brand-card-meta">Sales handbook →</div></div></div>
  <div class="policy-list"><div class="policy-item"><div class="policy-title">Discount approval thresholds</div><div class="policy-body">0–10%: Sales lead. 11–20%: State GM. 21%+: GM + Finance. No exceptions.</div></div><div class="policy-item"><div class="policy-title">Category conflict rules</div><div class="policy-body">Competing brands may not run same panel in same LP. Check Adman before confirming.</div></div><div class="policy-item"><div class="policy-title">Artwork deadlines</div><div class="policy-body">Digital: 5 business days. Static: 10 business days. Late artwork at client cost.</div></div></div>`;
  el.dataset.rendered='1';
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function renderModals(){
  const ov=$('modal-overlay');
  ov.innerHTML=`
  <div id="modal-new-contact" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>New contact</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>Company name</label><input type="text" placeholder="e.g. Suncorp"></div><div class="form-group"><label>Contact name</label><input type="text" placeholder="e.g. Emma Walsh"></div><div class="form-group"><label>Email</label><input type="email"></div><div class="form-group"><label>Phone</label><input type="tel"></div><div class="form-group"><label>Role</label><input type="text" placeholder="Marketing Lead"></div><div class="form-group"><label>Status</label><select><option>Active</option><option>Inactive</option></select></div></div><div class="form-group"><label>Notes</label><textarea class="proposal-notes" placeholder="Initial contact notes…"></textarea></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Create contact</button></div></div>
  <div id="modal-add-prospect" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Add prospect</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>Company</label><input type="text"></div><div class="form-group"><label>Contact name</label><input type="text"></div><div class="form-group"><label>Email</label><input type="email"></div><div class="form-group"><label>Est. value</label><input type="text" placeholder="$80,000"></div><div class="form-group"><label>Stage</label><select><option>Outreach</option><option>Meeting booked</option><option>Avails sent</option><option>Proposal sent</option></select></div><div class="form-group"><label>Expected close</label><input type="date"></div></div><div class="form-group"><label>Brief / notes</label><textarea class="proposal-notes" placeholder="Budget, timing, competition intel…"></textarea></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Add prospect</button></div></div>
  <div id="modal-warn-artwork" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Warning · Suncorp · Artwork missing</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="warn-detail-block"><div class="wdb-row"><span class="wdb-label">Site</span><span>148 Brunswick St (23286)</span></div><div class="wdb-row"><span class="wdb-label">Spec</span><span>Static 6×3m · Print-ready PDF/JPG · 300dpi</span></div><div class="wdb-row"><span class="wdb-label">Deadline</span><span style="color:#A32D2D;font-weight:600">16 Apr 2026 (2 days)</span></div><div class="wdb-row"><span class="wdb-label">Contact</span><span>Emma Walsh · emma.walsh@suncorp.com.au</span></div></div><div class="form-group" style="margin-top:14px"><label>Message to client</label><textarea class="proposal-notes" style="height:80px">Hi Emma, just a reminder we still need the 6×3m static artwork for 148 Brunswick St. Deadline is 16 April. Please send to artwork@goa.com.au. Thanks!</textarea></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Send to Emma Walsh</button></div></div>
  <div id="modal-warn-po" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Warning · QLD Rail · PO outstanding</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="warn-detail-block"><div class="wdb-row"><span class="wdb-label">PO ref</span><span>QR-2026-047</span></div><div class="wdb-row"><span class="wdb-label">Amount</span><span class="fw5">$48,200</span></div><div class="wdb-row"><span class="wdb-label">Due</span><span style="color:#A32D2D;font-weight:600">28 Feb 2026 (overdue)</span></div><div class="wdb-row"><span class="wdb-label">Contact</span><span>Sarah Kim · s.kim@queenslandrail.com.au</span></div></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Chase PO · Email Sarah</button></div></div>
  <div id="modal-bonus-report" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Generate bonus report</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>From</label><input type="date" id="bonus-from" value="2026-01-01"></div><div class="form-group"><label>To</label><input type="date" id="bonus-to" value="2026-03-31"></div></div><div class="bonus-preview-table"><div class="bpt-title">Preview — LP9 2026</div><table class="data-table"><thead><tr><th>Client</th><th>Paid</th><th>Bonus</th><th>%</th></tr></thead><tbody><tr><td>Suncorp</td><td class="fw5">$248k</td><td>$31k</td><td><span class="pill pill-green">12.5%</span></td></tr><tr><td>QLD Rail</td><td class="fw5">$184k</td><td>$28k</td><td><span class="pill pill-amber">15.2%</span></td></tr><tr><td>Alliance</td><td class="fw5">$91k</td><td>$12k</td><td><span class="pill pill-green">13.2%</span></td></tr></tbody></table></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm" onclick="generateBonusXLSX();closeModal()">↓ Export XLSX</button></div></div>
  <div id="modal-new-proposal" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>New proposal</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>Client</label><select><option>Select…</option><option>Suncorp</option><option>Alliance Media</option><option>QLD Rail</option><option>Harvey Norman</option></select></div><div class="form-group"><label>Period</label><select><option>LP9 2026</option><option>LP10 2026</option><option>LP11 2026</option></select></div><div class="form-group"><label>Objective</label><input type="text" placeholder="Brand awareness…"></div><div class="form-group"><label>Budget</label><input type="text" placeholder="$50,000"></div></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm" onclick="closeModal();nav(document.querySelectorAll('.nav-item')[9],'availability')">Browse availability →</button></div></div>
  <div id="modal-package-builder" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Package builder</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><p style="font-size:13px;color:var(--muted)">Use the full Package builder in the Insights tab to generate AI-recommended site packages at 3 price points.</p></div><div class="modal-footer"><button class="btn-primary sm" onclick="closeModal();nav(document.querySelectorAll('.nav-item')[6],'insights')">Go to Insights →</button></div></div>`;
}

// ─── CLIENT-SIDE PPTX EXPORT ──────────────────────────────────────────────────
function generatePPTX(type,client,period){
  if(!window.PptxGenJS){setTimeout(()=>generatePPTX(type,client,period),500);return;}
  const pptx=new PptxGenJS();
  pptx.layout='LAYOUT_WIDE';
  const RED='C8102E',DARK='111827',WHITE='FFFFFF',GRAY='6B7280',LT='F9FAFB';

  if(type==='postcampaign'){
    // Slide 1 — Cover
    let s=pptx.addSlide();s.background={color:DARK};
    s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:'28%',h:'100%',fill:{color:RED}});
    s.addText('goa',{x:0.3,y:0.4,w:2,h:0.6,fontSize:28,bold:true,color:WHITE,fontFace:'Arial'});
    s.addText(client||'Campaign Report',{x:3.2,y:1.5,w:6.5,h:0.9,fontSize:30,bold:true,color:WHITE,fontFace:'Arial'});
    s.addText(period||'',{x:3.2,y:2.5,w:6.5,h:0.5,fontSize:15,color:'CCCCCC',fontFace:'Arial'});
    s.addText('Post-Campaign Report',{x:3.2,y:3.1,w:6.5,h:0.4,fontSize:13,color:RED,bold:true,fontFace:'Arial'});
    s.addText('Hannah F. · Senior Sales QLD',{x:3.2,y:6.0,w:6.5,h:0.4,fontSize:11,color:'888888',fontFace:'Arial'});

    // Slide 2 — Performance
    s=pptx.addSlide();s.background={color:WHITE};
    s.addText('Performance Results',{x:0.4,y:0.3,w:12,h:0.5,fontSize:20,bold:true,color:DARK,fontFace:'Arial'});
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:0.85,w:1.5,h:0.04,fill:{color:RED}});
    [{label:'Total impressions',val:'2,143,800',sub:'vs 1.9M estimated'},{label:'Campaign uptime',val:'99.8%',sub:'Industry avg 98.2%'},{label:'Bonus delivery',val:'+$2,720',sub:'Over-delivered'},{label:'MOVE LTS reach',val:'1.24M',sub:'P18+ · 7-day'}].forEach((m,i)=>{
      const x=0.4+(i%2)*6.3,y=1.1+Math.floor(i/2)*1.8;
      s.addShape(pptx.ShapeType.rect,{x,y,w:5.8,h:1.5,fill:{color:LT},line:{color:'E5E7EB',width:1}});
      s.addText(m.val,{x:x+0.2,y:y+0.15,w:5.4,h:0.8,fontSize:32,bold:true,color:RED,fontFace:'Arial'});
      s.addText(m.label,{x:x+0.2,y:y+0.9,w:5.4,h:0.3,fontSize:11,bold:true,color:DARK,fontFace:'Arial'});
      s.addText(m.sub,{x:x+0.2,y:y+1.2,w:5.4,h:0.25,fontSize:9,color:GRAY,fontFace:'Arial'});
    });

    // Slide 3 — Delivery summary
    s=pptx.addSlide();s.background={color:WHITE};
    s.addText('Delivery Summary',{x:0.4,y:0.3,w:12,h:0.5,fontSize:20,bold:true,color:DARK,fontFace:'Arial'});
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:0.85,w:1.5,h:0.04,fill:{color:RED}});
    const dRows=[[{text:'Week',options:{bold:true,fill:DARK,color:WHITE}},{text:'Impressions',options:{bold:true,fill:DARK,color:WHITE}},{text:'Uptime',options:{bold:true,fill:DARK,color:WHITE}},{text:'Notes',options:{bold:true,fill:DARK,color:WHITE}}],['Week 1','498,200','100%','On schedule'],['Week 2','541,400','99.6%','Minor outage Thu'],['Week 3','562,100','100%','Peak performance'],['Week 4','542,100','100%','Campaign completed']];
    s.addTable(dRows,{x:0.4,y:1.1,w:12.2,fontSize:11,fontFace:'Arial',colW:[2,3,2,5.2],border:{color:'E5E7EB'}});
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:4.5,w:12.2,h:1.5,fill:{color:DARK}});
    s.addText('99.8% uptime · +$2,720 bonus delivery',{x:0.7,y:5.0,w:8,h:0.5,fontSize:18,bold:true,color:WHITE,fontFace:'Arial'});

    // Slide 4 — Renewal recommendation
    s=pptx.addSlide();s.background={color:DARK};
    s.addText('Renewal Recommendation',{x:0.5,y:0.4,w:12,h:0.5,fontSize:20,bold:true,color:WHITE,fontFace:'Arial'});
    s.addShape(pptx.ShapeType.rect,{x:0.5,y:0.95,w:1.2,h:0.04,fill:{color:RED}});
    [{t:'Retain core site selections — all performing above benchmark'},{t:'Add Iconic for Q3 — available LP11, strong demand signal'},{t:'Extend to LP11 — lock in current rates before LP10 review'}].forEach((item,i)=>{
      s.addShape(pptx.ShapeType.rect,{x:0.5,y:1.3+i*1.5,w:12,h:1.2,fill:{color:'1F2937'},line:{color:'374151',width:1}});
      s.addText(item.t,{x:0.9,y:1.6+i*1.5,w:11,h:0.5,fontSize:14,color:WHITE,fontFace:'Arial'});
    });
    s.addText('Ready to lock in LP10? →',{x:0.5,y:5.8,w:8,h:0.5,fontSize:14,bold:true,color:RED,fontFace:'Arial'});

  } else if(type==='proposal'){
    // Slide 1 — Cover
    let s=pptx.addSlide();s.background={color:DARK};
    s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:'100%',h:'32%',fill:{color:RED}});
    s.addText('goa',{x:0.5,y:0.3,w:3,h:0.6,fontSize:24,bold:true,color:WHITE,fontFace:'Arial'});
    s.addText('Media Proposal',{x:0.5,y:0.95,w:8,h:0.7,fontSize:28,bold:true,color:WHITE,fontFace:'Arial'});
    s.addText('Prepared for: '+(client||'Client'),{x:0.5,y:2.7,w:8,h:0.5,fontSize:16,color:WHITE,fontFace:'Arial'});
    s.addText(period||'',{x:0.5,y:3.3,w:8,h:0.4,fontSize:13,color:'CCCCCC',fontFace:'Arial'});
    s.addText('Hannah F. · Senior Sales QLD · goa',{x:0.5,y:6.0,w:8,h:0.4,fontSize:11,color:'888888',fontFace:'Arial'});

    // Slide 2 — Site selections
    s=pptx.addSlide();s.background={color:WHITE};
    s.addText('Site Selections',{x:0.4,y:0.3,w:12,h:0.5,fontSize:20,bold:true,color:DARK,fontFace:'Arial'});
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:0.85,w:1.5,h:0.04,fill:{color:RED}});
    const selectedSites=SITES_DATA.filter(s2=>availSelSites.has(s2.ims)).slice(0,10);
    const fallbackSites=SITES_DATA.slice(0,3);
    const sitesToShow=selectedSites.length>0?selectedSites:fallbackSites;
    const sRows=[[{text:'Site',options:{bold:true,fill:DARK,color:WHITE}},{text:'Format',options:{bold:true,fill:DARK,color:WHITE}},{text:'Location',options:{bold:true,fill:DARK,color:WHITE}},{text:'Rate (LP)',options:{bold:true,fill:DARK,color:WHITE}}],...sitesToShow.map(site=>[site.name||'',site.format||'',site.location||'',site.lunar_rate?'$'+Number(site.lunar_rate).toLocaleString():'—'])];
    s.addTable(sRows,{x:0.4,y:1.1,w:12.2,fontSize:11,fontFace:'Arial',colW:[5.5,2,2.5,2.2],border:{color:'E5E7EB'}});

    // Slide 3 — Why goa + next steps
    s=pptx.addSlide();s.background={color:DARK};
    s.addText('Why goa',{x:0.5,y:0.4,w:5.5,h:0.5,fontSize:20,bold:true,color:WHITE,fontFace:'Arial'});
    ['Queensland\'s #1 independent OOH network','532 premium Brisbane metro sites','MOVE-verified audience measurement','Dedicated QLD sales + production support'].forEach((t,i)=>{s.addShape(pptx.ShapeType.rect,{x:0.5,y:1.2+i*1.2,w:5.5,h:1.0,fill:{color:'1F2937'}});s.addText(t,{x:0.8,y:1.4+i*1.2,w:5,h:0.5,fontSize:12,color:WHITE,fontFace:'Arial'});});
    s.addShape(pptx.ShapeType.rect,{x:7,y:0.5,w:6,h:6.5,fill:{color:RED}});
    s.addText('Next steps',{x:7.3,y:0.8,w:5.4,h:0.5,fontSize:18,bold:true,color:WHITE,fontFace:'Arial'});
    ['1. Review sites & confirm selection','2. Return signed contract','3. Submit artwork by deadline','4. Campaign goes live!'].forEach((t,i)=>{s.addText(t,{x:7.3,y:1.5+i*1.0,w:5.4,h:0.6,fontSize:13,color:WHITE,fontFace:'Arial'});});
    s.addText('Let\'s lock it in →',{x:7.3,y:6.0,w:5.4,h:0.5,fontSize:14,bold:true,color:'FFCCCC',fontFace:'Arial'});
  }

  pptx.writeFile({fileName:`${(client||'goa').replace(/\s+/g,'-')}_${type}.pptx`});
}

// ─── BONUS XLSX EXPORT ────────────────────────────────────────────────────────
function generateBonusXLSX(){
  if(!window.XLSX){alert('XLSX library not loaded yet.');return;}
  const wb=XLSX.utils.book_new();
  const data=[
    ['goa · Bonus Report','','','','',''],
    [`Period: ${$('bonus-from')?.value||'2026-01-01'} – ${$('bonus-to')?.value||'2026-03-31'}`,'','','','',''],
    [''],
    ['Client','Campaigns','Paid media ($)','Bonus given ($)','Bonus %','Sites'],
    ['Suncorp',6,248000,31000,'12.5%',6],
    ['QLD Rail',4,184000,28000,'15.2%',4],
    ['Alliance Media',3,91000,12000,'13.2%',3],
    ['BrisQuad FC',2,33000,4200,'12.7%',2],
    ['OzWine Group',2,62000,9300,'15.0%',3],
    [''],
    ['TOTAL',17,618000,84500,'13.7%',18],
  ];
  const ws=XLSX.utils.aoa_to_sheet(data);
  ws['!cols']=[{wch:20},{wch:12},{wch:16},{wch:16},{wch:10},{wch:8}];
  XLSX.utils.book_append_sheet(wb,ws,'Bonus Summary');

  // Sheet 2 — by LP
  const data2=[
    ['LP Period','Dates','Total paid ($)','Total bonus ($)','Bonus %','Clients'],
    ['LP8 2026','12 Jan – 8 Feb 2026',210000,28000,'13.3%',4],
    ['LP9 2026','9 Feb – 8 Mar 2026',287000,43000,'15.0%',5],
    ['LP10 2026','9 Mar – 5 Apr 2026',195000,24000,'12.3%',4],
  ];
  const ws2=XLSX.utils.aoa_to_sheet(data2);
  ws2['!cols']=[{wch:12},{wch:22},{wch:16},{wch:16},{wch:10},{wch:10}];
  XLSX.utils.book_append_sheet(wb,ws2,'By LP Period');
  XLSX.writeFile(wb,`goa_bonus_report_${$('bonus-from')?.value||'export'}.xlsx`);
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
let revChart=null,fmtChart=null;
function initCharts(){const c=$('rev-chart');if(!c||!window.Chart){setTimeout(initCharts,200);return;}if(revChart){revChart.destroy();revChart=null;}revChart=new Chart(c,{type:'bar',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Revenue',data:[198,241,187,220,195,210],backgroundColor:'#C8102E',borderRadius:3},{label:'Target',data:[220,220,220,220,220,220],backgroundColor:'#E5E7EB',borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{family:'Poppins',size:10},color:'#9ca3af'}},y:{grid:{color:'#f3f4f6'},ticks:{font:{family:'Poppins',size:10},color:'#9ca3af',callback:v=>'$'+v+'k'},border:{display:false}}}}});}
function initReportCharts(){const c=$('format-chart');if(!c||!window.Chart){setTimeout(initReportCharts,200);return;}if(fmtChart){fmtChart.destroy();fmtChart=null;}fmtChart=new Chart(c,{type:'doughnut',data:{labels:['Iconic','Digital','Static'],datasets:[{data:[510,420,310],backgroundColor:['#111827','#C8102E','#9CA3AF'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}});}
(function(){const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';document.head.appendChild(s);})();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(s){if(!s)return'';return new Date(s).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'2-digit'});}
function fmtDateShort(s){if(!s)return'';return new Date(s).toLocaleDateString('en-AU',{day:'numeric',month:'short'});}
