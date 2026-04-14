// ─── Utilities ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function doLogin() {
  $('login-page').classList.remove('active');
  $('app-page').classList.add('active');
  renderAll();
  setTimeout(initCharts,200);
}
function doLogout() {
  $('app-page').classList.remove('active');
  $('login-page').classList.add('active');
}
document.addEventListener('keydown', e => {
  if(e.key==='Enter' && $('login-page').classList.contains('active')) doLogin();
});
function nav(el,id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const s=$('screen-'+id);
  if(s){s.classList.add('active');if(!s.dataset.rendered)renderScreen(id);}
  if(el)el.classList.add('active');
  closeActionMenus();
  if(id==='dashboard')setTimeout(initCharts,100);
  if(id==='reports')setTimeout(initReportCharts,100);
}
function setTab(el){
  el.closest('.tabs').querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}
function showModal(id){
  $('modal-overlay').classList.add('active');
  document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'));
  const m=$(id); if(m)m.classList.add('active');
}
function closeModal(){
  $('modal-overlay').classList.remove('active');
  document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'));
}
function toggleActionMenu(id){
  closeActionMenus();
  const m=$(id); if(m){m.classList.toggle('open');event.stopPropagation();}
}
function closeActionMenus(){
  document.querySelectorAll('.action-menu').forEach(m=>m.classList.remove('open'));
}
document.addEventListener('click',closeActionMenus);

// ─── Render dispatcher ────────────────────────────────────────────────────────
function renderAll(){
  renderContacts(); renderProspects(); renderBookings(); renderRenewals();
  renderDashboard(); renderReports(); renderAI(); renderAvailability();
  renderProposal(); renderApprovals(); renderBrand(); renderModals();
}
function renderScreen(id){
  ({contacts:renderContacts,prospects:renderProspects,bookings:renderBookings,
    renewals:renderRenewals,dashboard:renderDashboard,reports:renderReports,
    ai:renderAI,availability:renderAvailability,proposal:renderProposal,
    approvals:renderApprovals,brand:renderBrand})[id]?.();
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
const CONTACTS=[
  {id:'suncorp',av:'SC',cls:'av-blue',name:'Suncorp',sub:'Emma Walsh · Marketing Lead · emma@suncorp.com.au',status:'active',camp:'LP8 2026',ltv:'$248k',renew:'28 days',renewCls:'pill-amber',note:'LP10 renewal — digital only, $45k confirmed',notes:[{d:'10 Apr 2026',t:"Called Emma re: LP10 renewal. Digital-only for H2. $45k confirmed."},{d:'12 Mar 2026',t:"Sent LP9 post-campaign report. 2.1M impressions. Very happy."}]},
  {id:'alliance',av:'AM',cls:'av-red',name:'Alliance Media',sub:'Tom Reid · Director · tom@alliancemedia.com.au',status:'active',camp:'LP9 2026',ltv:'$91k',renew:'62 days',renewCls:'pill-green',note:'LP9 confirmed — 3 North Corridor sites, artwork due 28 Jan',notes:[{d:'15 Jan 2026',t:"Tom confirmed LP9. Contract signed. Artwork due 28 Jan."}]},
  {id:'qlrail',av:'QL',cls:'av-green',name:'Queensland Rail',sub:'Sarah Kim · Comms Manager · s.kim@queenslandrail.com.au',status:'active',camp:'LP9 2026',ltv:'$184k',renew:'7 days',renewCls:'pill-red',note:'Renewal due — proposal sent, awaiting sign-off',notes:[{d:'8 Apr 2026',t:"Sent LP10 renewal proposal. Sarah presenting to GM this week."}]},
  {id:'ozwine',av:'OW',cls:'av-purple',name:'OzWine Group',sub:'Ben Caruso · Brand Manager',status:'inactive',camp:'Q3 2025',ltv:'$62k',renew:'—',renewCls:'pill-gray',note:'No contact since campaign end. Re-engage Q2.',notes:[]},
  {id:'brisquad',av:'BQ',cls:'av-blue',name:'BrisQuad FC',sub:'Jade Osei · Marketing',status:'active',camp:'LP9 2026',ltv:'$33k',renew:'45 days',renewCls:'pill-green',note:'LP10 match-day sites near Suncorp Stadium',notes:[{d:'1 Apr 2026',t:"Jade confirmed interest in LP10 match-day sites."}]},
];
function renderContacts(){
  const el=$('screen-contacts');
  el.innerHTML=`<div class="screen-header"><div><h1>Contacts</h1><p class="screen-sub">28 clients · 19 active</p></div><div class="header-actions"><input type="text" class="search-input" placeholder="Search clients…" oninput="filterContacts(this.value)" id="contact-search"><button class="btn-primary sm" onclick="showModal('modal-new-contact')">+ New contact</button></div></div>
  <div class="tabs"><button class="tab active" onclick="filterContactStatus('all',this)">All (28)</button><button class="tab" onclick="filterContactStatus('active',this)">Active (19)</button><button class="tab" onclick="filterContactStatus('inactive',this)">Inactive (9)</button></div>
  <div class="table-card"><table class="data-table"><thead><tr><th>Client</th><th>Status</th><th>Last campaign</th><th>LTV</th><th>Renewal</th><th>Last note</th><th></th></tr></thead><tbody id="contacts-tbody">${contactRows()}</tbody></table></div>`;
  el.dataset.rendered='1';
}
function contactRows(filter='all',search=''){
  return CONTACTS.filter(c=>{
    if(filter!=='all'&&c.status!==filter)return false;
    if(search&&!c.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }).map(c=>`<tr class="contact-row" onclick="toggleContact('detail-${c.id}',this)">
    <td><div class="client-cell"><div class="avatar ${c.cls}">${c.av}</div><div><div class="client-name">${c.name}</div><div class="client-sub">${c.sub}</div></div></div></td>
    <td><span class="pill ${c.status==='active'?'pill-green':'pill-gray'}">${c.status==='active'?'Active':'Inactive'}</span></td>
    <td class="text-muted">${c.camp}</td><td class="fw5">${c.ltv}</td>
    <td>${c.renew==='—'?'<span class="text-muted">—</span>':`<span class="pill ${c.renewCls}">${c.renew}</span>`}</td>
    <td class="text-muted note-preview">${c.note}</td>
    <td><button class="btn-ghost sm" onclick="event.stopPropagation();showModal('modal-new-contact')">Edit</button></td>
  </tr>
  <tr id="detail-${c.id}" class="detail-row" style="display:none"><td colspan="7"><div class="detail-panel">
    <div class="detail-stats"><div class="dstat"><div class="dstat-val">${c.ltv}</div><div class="dstat-label">Total spend</div></div><div class="dstat"><div class="dstat-val">2021</div><div class="dstat-label">Client since</div></div><div class="dstat"><div class="dstat-val">$41k</div><div class="dstat-label">Avg campaign</div></div></div>
    <div class="detail-notes-area"><div class="note-label">Contact notes</div>${c.notes.map(n=>`<div class="note-item"><span class="note-date">${n.d}</span><span class="note-text">${n.t}</span></div>`).join('')}${!c.notes.length?'<div class="text-muted" style="font-size:12px">No notes yet.</div>':''}
    <textarea class="note-input" placeholder="Add a note…"></textarea><button class="btn-ghost sm" style="margin-top:6px">Save note</button></div>
  </div></td></tr>`).join('');
}
function toggleContact(id,row){
  const d=$(id); if(!d)return;
  const open=d.style.display!=='none';
  document.querySelectorAll('.detail-row').forEach(r=>r.style.display='none');
  document.querySelectorAll('.contact-row').forEach(r=>r.classList.remove('row-expanded'));
  if(!open){d.style.display='table-row';row.classList.add('row-expanded');}
}
function filterContacts(val){
  const active=document.querySelector('#screen-contacts .tab.active')?.textContent||'';
  const status=active.includes('Active')?'active':active.includes('Inactive')?'inactive':'all';
  const tbody=$('contacts-tbody'); if(tbody)tbody.innerHTML=contactRows(status,val);
}
function filterContactStatus(status,el){
  setTab(el); const search=$('contact-search')?.value||'';
  const tbody=$('contacts-tbody'); if(tbody)tbody.innerHTML=contactRows(status,search);
}

// ─── PROSPECTS ────────────────────────────────────────────────────────────────
function renderProspects(){
  const el=$('screen-prospects');
  el.innerHTML=`<div class="screen-header"><div><h1>Prospects</h1><p class="screen-sub">5 in pipeline · $340k potential</p></div><button class="btn-primary sm" onclick="showModal('modal-add-prospect')">+ Add prospect</button></div>
  <div class="metric-grid four"><div class="metric-card"><div class="metric-label">Pipeline value</div><div class="metric-val">$340k</div></div><div class="metric-card"><div class="metric-label">Avg deal size</div><div class="metric-val">$68k</div></div><div class="metric-card"><div class="metric-label">Win rate (90d)</div><div class="metric-val">38%</div></div><div class="metric-card"><div class="metric-label">Avg days to close</div><div class="metric-val">24</div></div></div>
  <div class="table-card"><table class="data-table"><thead><tr><th>Prospect</th><th>Stage</th><th>Value</th><th>Last touch</th><th>AI insight</th><th>Action</th></tr></thead><tbody>
  ${[{av:'HV',cls:'av-red',name:'Harvey Norman',sub:'Mark D.',stage:'Proposal sent',sc:'pill-amber',val:'$120k',touch:'2 days ago',insight:'Opened 3×',ic:'',id:'hv'},
     {av:'WW',cls:'av-green',name:'Woolworths QLD',sub:'Amy C.',stage:'Meeting booked',sc:'pill-blue',val:'$85k',touch:'Today',insight:'Meeting in 2 days',ic:'blue',id:'ww'},
     {av:'MR',cls:'av-purple',name:'Myer Retail',sub:'Chris T.',stage:'Outreach',sc:'pill-gray',val:'$60k',touch:'5 days ago',insight:'No reply',ic:'amber',id:'mr'},
     {av:'TL',cls:'av-blue',name:'Telstra Local',sub:'Nina P.',stage:'Avails sent',sc:'pill-amber',val:'$45k',touch:'Yesterday',insight:'Budget confirmed',ic:'blue',id:'tl'}
  ].map(p=>`<tr><td><div class="client-cell"><div class="avatar ${p.cls}">${p.av}</div><div><div class="client-name">${p.name}</div><div class="client-sub">${p.sub}</div></div></div></td>
    <td><span class="pill ${p.sc}">${p.stage}</span></td><td class="fw5">${p.val}</td><td class="text-muted">${p.touch}</td>
    <td><span class="insight-tag ${p.ic}">${p.insight}</span></td>
    <td><div class="action-menu-wrap"><button class="btn-primary sm" onclick="event.stopPropagation();toggleActionMenu('am-${p.id}')">Action ▾</button>
    <div class="action-menu" id="am-${p.id}"><div class="am-item" onclick="closeActionMenus()">📞 Log call</div><div class="am-item" onclick="closeActionMenus()">📧 Send email</div><div class="am-item" onclick="closeActionMenus()">📄 Build proposal</div><div class="am-item" onclick="closeActionMenus()">📅 Book meeting</div><div class="am-item red" onclick="closeActionMenus()">✕ Mark lost</div></div></div></td>
  </tr>`).join('')}
  </tbody></table></div>
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
    <div class="warn-card" onclick="showModal('modal-warn-artwork')"><div class="warn-icon-wrap">⚠</div><div class="warn-body"><div class="warn-title">Suncorp · Static Run — Artwork missing</div><div class="warn-sub">Site 23286 · 148 Brunswick St · Static 6×3m not received · Due in 2 days</div></div><div class="warn-actions"><button class="btn-primary sm" onclick="event.stopPropagation()">Send artwork link</button><button class="btn-ghost sm" onclick="event.stopPropagation()">View campaign</button></div></div>
    <div class="warn-card" onclick="showModal('modal-warn-po')"><div class="warn-icon-wrap po">$</div><div class="warn-body"><div class="warn-title">QLD Rail · Digital — PO outstanding</div><div class="warn-sub">PO #QR-2026-047 not received · Invoice due 28 Feb · Campaign live</div></div><div class="warn-actions"><button class="btn-primary sm" onclick="event.stopPropagation()">Chase PO</button><button class="btn-ghost sm" onclick="event.stopPropagation()">View campaign</button></div></div>
  </div>`;
  el.dataset.rendered='1';
}
function setBookingTab(el,id){setTab(el);['all','live','warn'].forEach(v=>{const d=$('bv-'+v);if(d)d.style.display=v===id?'block':'none';});}

// ─── RENEWALS ─────────────────────────────────────────────────────────────────
function renderRenewals(){
  const el=$('screen-renewals');
  el.innerHTML=`<div class="screen-header"><div><h1>Renewals</h1><p class="screen-sub">$342k at stake this quarter</p></div></div>
  <div class="metric-grid four"><div class="metric-card"><div class="metric-label">Due &lt;7 days</div><div class="metric-val red">1</div></div><div class="metric-card"><div class="metric-label">Due &lt;30 days</div><div class="metric-val amber">2</div></div><div class="metric-card"><div class="metric-label">Due &lt;60 days</div><div class="metric-val">4</div></div><div class="metric-card"><div class="metric-label">At stake</div><div class="metric-val">$342k</div></div></div>
  <div class="renewal-framework"><div class="rf-title">Renewal framework</div><div class="rf-steps"><div class="rf-step"><div class="rf-step-label">60 days out</div><div class="rf-step-body">Send post-campaign report. Open conversation.</div></div><div class="rf-arrow">→</div><div class="rf-step"><div class="rf-step-label">30 days out</div><div class="rf-step-body">Present new avails. Confirm budget. Send proposal.</div></div><div class="rf-arrow">→</div><div class="rf-step"><div class="rf-step-label">7 days out</div><div class="rf-step-body">Follow up. Generate final report. Push to close.</div></div></div></div>
  <div class="table-card"><table class="data-table"><thead><tr><th>Client</th><th>Due</th><th>Est. value</th><th>Stage</th><th>Actions</th></tr></thead><tbody>
    <tr><td><div class="client-cell"><div class="avatar av-green">QL</div><div><div class="client-name">Queensland Rail</div><div class="client-sub">Sarah Kim</div></div></div></td><td><span class="pill pill-red">7 days</span></td><td class="fw5">$52k</td><td><span class="pill pill-amber">Proposal out</span></td><td><div style="display:flex;gap:6px"><button class="btn-primary sm" onclick="showModal('modal-report')">Generate report</button><button class="btn-ghost sm" onclick="generateReport('postcampaign','Queensland Rail','LP9 2026 · 2 Feb – 1 Mar')">↓ PPTX</button></div></td></tr>
    <tr><td><div class="client-cell"><div class="avatar av-blue">SC</div><div><div class="client-name">Suncorp</div><div class="client-sub">Emma Walsh</div></div></div></td><td><span class="pill pill-amber">28 days</span></td><td class="fw5">$45k</td><td><span class="pill pill-blue">Avails sent</span></td><td><button class="btn-ghost sm">Build proposal</button></td></tr>
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

// ─── AI ───────────────────────────────────────────────────────────────────────
function renderAI(){
  const el=$('screen-ai');
  el.innerHTML=`<div class="screen-header"><div><h1>AI buddy</h1><p class="screen-sub">Week of 14 Apr 2026</p></div></div>
  <div class="ai-week-brief"><div class="aib-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Your week at a glance</div><div class="aib-items"><div class="aib-item red"><div class="aib-dot"></div>QLD Rail renewal expires in 7 days. $184k LTV — prioritise above new business this week.</div><div class="aib-item amber"><div class="aib-dot"></div>Harvey Norman viewed your proposal 3×. Best call window: Tue–Wed 10–11am.</div><div class="aib-item green"><div class="aib-dot"></div>Woolworths meeting Wednesday — they tend to buy corridor packages. Prepare North + Inner West.</div></div></div>
  <div class="dash-grid" style="margin-top:16px"><div class="dash-card"><div class="dash-card-title">Digital fill rate up</div><div style="font-size:13px;color:var(--text-secondary);line-height:1.6">Digital inventory 91% sold for LP10. Push early commitments — use scarcity narrative.</div></div><div class="dash-card"><div class="dash-card-title">Retail category heating</div><div style="font-size:13px;color:var(--text-secondary);line-height:1.6">3 retail brands in pipeline. Category conflict rules apply — check Adman before confirming Harvey Norman.</div></div></div>
  <div class="ai-ask"><div class="ai-ask-label">Ask me anything</div><div class="ai-ask-row"><input type="text" class="ai-input" placeholder="e.g. which clients haven't been contacted in 30 days?"><button class="btn-primary sm">Ask</button></div><div class="ai-chips"><button class="chip">Weekly to-do</button><button class="chip">Pipeline risks</button><button class="chip">Draft renewal email</button><button class="chip">Best sites for retail brief</button></div></div>`;
  el.dataset.rendered='1';
}

// ─── AVAILABILITY — GANTT ─────────────────────────────────────────────────────
let availSelSites=new Set();
let availViewMode='lp'; // 'weekly' or 'lp'
let availFrom='', availTo='';

function renderAvailability(){
  const el=$('screen-availability');
  const lpOptions=LP_DATA.map((lp,i)=>`<option value="${lp.start}">LP${i+1} · ${fmtDate(lp.start)} – ${fmtDate(lp.end)}</option>`).join('');
  el.innerHTML=`
  <div class="screen-header"><div><h1>Availability</h1><p class="screen-sub" id="avail-sub">Select a date range to begin</p></div><div class="header-actions" id="avail-hdr"></div></div>
  <div class="avail-top-bar">
    <div class="avail-range-group">
      <label class="avail-label">Campaign period</label>
      <div class="avail-date-row">
        <input type="date" id="avail-from" class="avail-date-input" onchange="onAvailDateChange()" value="2026-05-04">
        <span class="avail-date-sep">→</span>
        <input type="date" id="avail-to" class="avail-date-input" onchange="onAvailDateChange()" value="2026-06-28">
        <div class="view-toggle" id="view-toggle">
          <button class="vtbtn active" id="vt-lp" onclick="setViewMode('lp',this)">By LP</button>
          <button class="vtbtn" id="vt-week" onclick="setViewMode('weekly',this)">By week</button>
        </div>
      </div>
    </div>
    <div class="avail-filters-row">
      <input type="text" class="search-input" placeholder="Search name, suburb…" oninput="renderGantt()" id="avail-search">
      <select class="select-sm" id="avail-format" onchange="onFormatChange()"><option value="">All formats</option><option>Digital</option><option>Static</option></select>
      <select class="select-sm" id="avail-size" onchange="renderGantt()"><option value="">All sizes</option><option>Iconic</option><option>6x3m</option><option>Large format</option><option>8x3m</option><option>Portrait</option></select>
      <select class="select-sm" id="avail-loc" onchange="renderGantt()"><option value="">All locations</option><option>City</option><option>North</option><option>South</option><option>East</option><option>West</option></select>
      <select class="select-sm" id="avail-status" onchange="renderGantt()"><option value="">All status</option><option value="available">Available in range</option><option value="booked">Fully booked</option></select>
      <select class="select-sm" id="avail-rate" onchange="renderGantt()"><option value="">Any rate</option><option value="low">Under $50k</option><option value="mid">$50k–$150k</option><option value="high">Over $150k</option></select>
    </div>
  </div>
  <div class="avail-legend"><span class="al-item"><span class="al-dot green"></span>Available</span><span class="al-item"><span class="al-dot red"></span>Booked</span><span class="al-count" id="avail-count-lbl"></span></div>
  <div class="gantt-wrap" id="gantt-wrap"></div>
  <div id="avail-sel-bar" class="selected-bar" style="display:none"><span id="avail-sel-cnt">0 sites selected</span><button class="btn-primary sm" onclick="addToProposal()">Add to proposal →</button><button class="btn-ghost sm" onclick="clearAvailSel()">Clear</button></div>`;
  el.dataset.rendered='1';
  onAvailDateChange();
}

function onFormatChange(){
  const fmt=($('avail-format')?.value||'').toLowerCase();
  const vt=$('view-toggle');
  if(fmt==='digital'){ setViewMode('weekly',null); if(vt){vt.querySelector('#vt-week').classList.add('active');vt.querySelector('#vt-lp').classList.remove('active');} }
  else if(fmt==='static'){ setViewMode('lp',null); if(vt){vt.querySelector('#vt-lp').classList.add('active');vt.querySelector('#vt-week').classList.remove('active');} }
  renderGantt();
}
function setViewMode(mode,btn){
  availViewMode=mode;
  if(btn){ btn.closest('.view-toggle').querySelectorAll('.vtbtn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
  renderGantt();
}
function onAvailDateChange(){
  availFrom=$('avail-from')?.value||''; availTo=$('avail-to')?.value||'';
  renderGantt();
}

function getActiveLPs(){
  if(!availFrom||!availTo) return LP_DATA;
  return LP_DATA.filter(lp=> lp.start<=availTo && lp.end>=availFrom);
}

function renderGantt(){
  const wrap=$('gantt-wrap'); if(!wrap) return;
  const search=($('avail-search')?.value||'').toLowerCase();
  const fmt=$('avail-format')?.value||'';
  const size=$('avail-size')?.value||'';
  const loc=$('avail-loc')?.value||'';
  const statusF=$('avail-status')?.value||'';
  const rate=$('avail-rate')?.value||'';
  const activeLPs=getActiveLPs();

  let sites=SITES_DATA.filter(s=>{
    if(search&&!s.name.toLowerCase().includes(search)&&!s.suburb.toLowerCase().includes(search)) return false;
    if(fmt&&s.format!==fmt) return false;
    if(size&&s.size_cat!==size) return false;
    if(loc&&s.location!==loc) return false;
    if(rate){const r=s.lunar_rate||0;if(rate==='low'&&r>=50000)return false;if(rate==='mid'&&(r<50000||r>150000))return false;if(rate==='high'&&r<=150000)return false;}
    // status filter
    if(statusF){
      const lpVals=activeLPs.map(lp=>s.lp_avail[lp.start]||'');
      if(statusF==='available'&&!lpVals.includes('available'))return false;
      if(statusF==='booked'&&lpVals.includes('available'))return false;
    }
    return true;
  });

  const sub=$('avail-sub'); if(sub) sub.textContent=`${sites.length} sites · ${!availFrom?'Select date range':'Showing '+fmtDate(availFrom)+' – '+fmtDate(availTo)}`;
  const cl=$('avail-count-lbl'); if(cl) cl.textContent=`Showing ${Math.min(sites.length,150)} of ${SITES_DATA.length}`;

  if(!activeLPs.length){wrap.innerHTML='<div class="gantt-empty">No LPs found in selected date range.</div>';return;}
  if(!sites.length){wrap.innerHTML='<div class="gantt-empty">No sites match the current filters.</div>';return;}

  // Build column headers
  const colW=Math.max(52, Math.floor(600/activeLPs.length));
  const hdrs=activeLPs.map((lp,i)=>{
    const lpNum=LP_DATA.indexOf(lp)+1;
    return `<div class="gantt-col-hdr" style="min-width:${colW}px"><div class="gantt-lp-num">LP${lpNum}</div><div class="gantt-lp-date">${fmtDateShort(lp.start)}</div></div>`;
  }).join('');

  const rows=sites.slice(0,150).map(s=>{
    const sel=availSelSites.has(s.ims);
    const rate=s.lunar_rate?'$'+Number(s.lunar_rate).toLocaleString():'—';
    const nextAvail=Object.entries(s.lp_avail).find(([d,v])=>v==='available'&&d>=availFrom);
    const blocks=activeLPs.map(lp=>{
      const v=s.lp_avail[lp.start];
      const cls=v==='available'?'gb-avail':v==='booked'?'gb-booked':'gb-nd';
      const label=v==='available'?'Free':v==='booked'?'Booked':'—';
      return `<div class="gantt-block ${cls}" style="min-width:${colW}px" title="${label}">${label}</div>`;
    }).join('');
    return `<div class="gantt-row ${sel?'gantt-sel':''}" data-ims="${s.ims}">
      <div class="gantt-site-info">
        <input type="checkbox" class="avail-cb" ${sel?'checked':''} onchange="toggleGanttSite('${s.ims}',this)" onclick="event.stopPropagation()">
        <div class="gantt-site-name">${s.name}</div>
        <div class="gantt-meta"><span class="pill ${s.format==='Digital'?'pill-blue':'pill-gray'} xs">${s.size_cat||s.format}</span><span class="gantt-loc">${s.location}</span><span class="gantt-dir">${s.direction}</span></div>
        <div class="gantt-rate">${rate}<span class="gantt-next">${nextAvail?'Next: '+fmtDateShort(nextAvail[0]):'Fully booked'}</span></div>
      </div>
      <div class="gantt-blocks">${blocks}</div>
    </div>`;
  }).join('');

  wrap.innerHTML=`<div class="gantt-table">
    <div class="gantt-header"><div class="gantt-site-col-hdr">Site <span class="text-muted" style="font-weight:400;font-size:10px">/ Format / Rate</span></div><div class="gantt-cols-hdr">${hdrs}</div></div>
    <div class="gantt-body">${rows}</div>
  </div>`;
}

function toggleGanttSite(ims,cb){
  if(cb.checked)availSelSites.add(ims); else availSelSites.delete(ims);
  const row=cb.closest('.gantt-row'); if(row)row.classList.toggle('gantt-sel',cb.checked);
  updateSelBar();
}
function updateSelBar(){
  const b=$('avail-sel-bar'),c=$('avail-sel-cnt');
  if(b)b.style.display=availSelSites.size>0?'flex':'none';
  if(c)c.textContent=`${availSelSites.size} site${availSelSites.size!==1?'s':''} selected`;
}
function clearAvailSel(){availSelSites.clear();document.querySelectorAll('.avail-cb').forEach(c=>c.checked=false);document.querySelectorAll('.gantt-row').forEach(r=>r.classList.remove('gantt-sel'));updateSelBar();}
function addToProposal(){nav(document.querySelectorAll('.nav-item')[8],'proposal');}

// ─── PROPOSAL BUILDER ─────────────────────────────────────────────────────────
function renderProposal(){
  const el=$('screen-proposal');
  el.innerHTML=`<div class="screen-header"><div><h1>Proposals</h1><p class="screen-sub">3 proposals · 1 draft · 1 in approval · 1 sent</p></div><div class="header-actions"><button class="btn-ghost sm" onclick="generateReport('proposal','Alliance Media','LP9 2026')">↓ Export PPTX</button><button class="btn-primary sm" onclick="showModal('modal-new-proposal')">+ New proposal</button></div></div>
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
function propRow(id,av,cls,name,camp,sub,pc,status,open){
  return `<div class="prop-row ${open?'open':''}" onclick="toggleProp('${id}',this)"><div class="prop-row-left"><div class="avatar ${cls}">${av}</div><div><div class="prop-row-title">${name} — ${camp}</div><div class="prop-row-sub">${sub}</div></div></div><div class="prop-row-right"><span class="pill ${pc}">${status}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="prop-chev ${open?'open':''}"><polyline points="6 9 12 15 18 9"/></svg></div></div>`;
}
function propDetail(){
  return `<div id="pd-1" class="prop-detail open"><div class="pd-grid">
    <div class="pd-col"><div class="pd-section-title">Client &amp; objectives</div><div class="pd-field"><span class="pd-label">Client</span><span>Alliance Media</span></div><div class="pd-field"><span class="pd-label">Contact</span><span>Tom Reid · Director</span></div><div class="pd-field"><span class="pd-label">Objective</span><span>Brand awareness · North Brisbane corridor</span></div><div class="pd-field"><span class="pd-label">Audience</span><span>P25–54 Brisbane Metro</span></div><div class="pd-field"><span class="pd-label">Period</span><span>LP9 · 2 Feb – 1 Mar 2026</span></div><div class="pd-field"><span class="pd-label">Budget</span><span class="fw5">$48,300</span></div>
    <div class="pd-section-title" style="margin-top:14px">Artwork specs</div>
    <div class="pd-aw"><div class="pd-aw-site">201 Leichhardt St</div><div class="pd-aw-spec">6.4×7.6m · JPG/PDF · 300dpi · Due 26 Jan</div></div>
    <div class="pd-aw"><div class="pd-aw-site">764 Sandgate Rd</div><div class="pd-aw-spec">1920×640px · MP4/JPG · 15s · Due 26 Jan</div></div>
    <div class="pd-aw"><div class="pd-aw-site">656 South Pine Rd</div><div class="pd-aw-spec">1920×640px · MP4/JPG · 15s · Due 26 Jan</div></div></div>
    <div class="pd-col"><div class="pd-section-title">Site selections</div>
    <div class="pd-site"><div class="pd-thumb"></div><div><div class="pd-site-name">201 Leichhardt St, Spring Hill</div><div class="pd-site-sub">23276 · ICONIC · 8 secs</div><div class="pd-site-rate">$41,650/LP · 2 Feb – 1 Mar</div></div></div>
    <div class="pd-site"><div class="pd-thumb"></div><div><div class="pd-site-name">764 Sandgate Rd, Clayfield</div><div class="pd-site-sub">23288 · DIGITAL · 15 secs</div><div class="pd-site-rate">$18,200/LP · 2 Feb – 1 Mar</div></div></div>
    <div class="pd-site"><div class="pd-thumb"></div><div><div class="pd-site-name">656 South Pine Rd, Eatons Hill</div><div class="pd-site-sub">23292 · DIGITAL · 15 secs</div><div class="pd-site-rate">$14,800/LP · 2 Feb – 1 Mar</div></div></div>
    <div class="pd-section-title" style="margin-top:14px">Notes</div><textarea class="proposal-notes">North corridor run. Tom confirmed no competitor conflict. No bonus applicable per contract.</textarea></div>
    <div class="pd-col pd-summary-col"><div class="pd-section-title">Summary</div><div class="pd-total-block"><div class="pd-total-label">Total investment</div><div class="pd-total-val">$48,300</div></div>
    <div class="pd-sum-rows"><div class="pd-sum-row"><span>Sites</span><span>3</span></div><div class="pd-sum-row"><span>Format</span><span>Iconic + Digital</span></div><div class="pd-sum-row"><span>Weeks</span><span>4</span></div><div class="pd-sum-row"><span>CPM est.</span><span>$22.60</span></div><div class="pd-sum-row"><span>Approval</span><span>3-step</span></div></div>
    <button class="btn-primary sm" style="width:100%;margin-top:14px">Submit for approval</button>
    <button class="btn-ghost sm" style="width:100%;margin-top:6px" onclick="generateReport('proposal','Alliance Media','LP9 2026')">↓ Export as PPTX</button>
    <button class="btn-ghost sm" style="width:100%;margin-top:6px">+ Add sites</button></div>
  </div></div>`;
}
function toggleProp(id,row){
  const d=$(id);if(!d)return;
  const open=d.classList.contains('open');
  if(open){d.classList.remove('open');d.style.display='none';row.classList.remove('open');row.querySelector('.prop-chev')?.classList.remove('open');}
  else{d.classList.add('open');d.style.display='block';row.classList.add('open');row.querySelector('.prop-chev')?.classList.add('open');}
}

// ─── APPROVALS ────────────────────────────────────────────────────────────────
function renderApprovals(){
  const el=$('screen-approvals');
  el.innerHTML=`<div class="screen-header"><div><h1>Approvals</h1><p class="screen-sub">3 pending · 1 approved this week</p></div></div>
  <div class="tabs"><button class="tab active" onclick="setTab(this)">Pending (3)</button><button class="tab" onclick="setTab(this)">Approved</button><button class="tab" onclick="setTab(this)">History</button></div>
  <div class="approval-card"><div class="approval-card-header"><div><div class="approval-name">Alliance Media · LP9 2026</div><div class="approval-sub">3 sites · $48,300 · Submitted 10 min ago</div></div><span class="pill pill-amber">Awaiting GM</span></div>
  <div class="approval-steps"><div class="apstep done"><div class="apstep-dot">✓</div><div><div class="apstep-label">Sales lead</div><div class="apstep-sub">Approved · 10 min ago</div></div></div><div class="apstep-line"></div><div class="apstep active"><div class="apstep-dot">2</div><div><div class="apstep-label">State GM</div><div class="apstep-sub">Pending · 2–4 hrs</div></div></div><div class="apstep-line"></div><div class="apstep"><div class="apstep-dot">3</div><div><div class="apstep-label">Finance</div><div class="apstep-sub">Unlocks after GM</div></div></div></div>
  <div class="approval-card-footer"><button class="btn-ghost sm">View proposal</button><button class="btn-ghost sm">Nudge approver</button><button class="btn-danger sm">Withdraw</button></div></div>
  <div class="approval-card"><div class="approval-card-header"><div><div class="approval-name">Suncorp · Q1 static run</div><div class="approval-sub">6 sites · $91,500 · Approved · Artwork pending</div></div><span class="pill pill-amber">Artwork due</span></div>
  <div class="artwork-tracker"><div class="at-label">Artwork status</div><div class="at-row"><span class="at-dot green"></span><span class="at-name">Suncorp_BNE_Digital_1920x640.jpg</span><span class="at-status">Received</span></div><div class="at-row"><span class="at-dot amber"></span><span class="at-name">Static 6×3m print-ready</span><span class="at-status amber">Due in 2 days</span></div></div>
  <div class="approval-card-footer"><button class="btn-ghost sm">Send artwork link</button><button class="btn-primary sm">Upload artwork</button></div></div>`;
  el.dataset.rendered='1';
}

// ─── BRAND ────────────────────────────────────────────────────────────────────
function renderBrand(){
  const el=$('screen-brand');
  el.innerHTML=`<div class="screen-header"><div><h1>Brand hub</h1><p class="screen-sub">goa knowledge base</p></div></div>
  <div class="brand-grid">
    <div class="brand-card"><div class="brand-card-icon red"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div><div class="brand-card-title">Brand guidelines</div><div class="brand-card-body">Logo, colour, typography, tone of voice.</div><div class="brand-card-meta">Updated Mar 2026 →</div></div>
    <div class="brand-card"><div class="brand-card-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div class="brand-card-title">Creative specs</div><div class="brand-card-body">Formats, sizes, resolution for all products.</div><div class="brand-card-meta">Digital + Static + Iconic →</div></div>
    <div class="brand-card"><div class="brand-card-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="brand-card-title">Product catalogue</div><div class="brand-card-body">Iconic, Digital, Static, Stream, Civic — 532 QLD sites.</div><div class="brand-card-meta">Full site list →</div></div>
    <div class="brand-card"><div class="brand-card-icon amber"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="brand-card-title">Policies &amp; processes</div><div class="brand-card-body">Discounts, approvals, conflicts, artwork deadlines.</div><div class="brand-card-meta">Sales handbook →</div></div>
  </div>
  <div class="policy-list">
    <div class="policy-item"><div class="policy-title">Discount approval thresholds</div><div class="policy-body">0–10%: Sales lead. 11–20%: State GM. 21%+: GM + Finance. No exceptions.</div></div>
    <div class="policy-item"><div class="policy-title">Category conflict rules</div><div class="policy-body">Competing brands may not run same panel in same LP. Check Adman before confirming.</div></div>
    <div class="policy-item"><div class="policy-title">Artwork deadlines</div><div class="policy-body">Digital: 5 business days before go-live. Static: 10 business days. Late artwork at client cost.</div></div>
    <div class="policy-item"><div class="policy-title">Hold policy</div><div class="policy-body">Sites held max 5 business days. Hold expires unless contract signed.</div></div>
  </div>`;
  el.dataset.rendered='1';
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function renderModals(){
  const ov=$('modal-overlay');
  ov.innerHTML=`
  <div id="modal-new-contact" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>New contact</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>Company name</label><input type="text" placeholder="e.g. Suncorp"></div><div class="form-group"><label>Contact name</label><input type="text" placeholder="e.g. Emma Walsh"></div><div class="form-group"><label>Email</label><input type="email" placeholder="emma@suncorp.com.au"></div><div class="form-group"><label>Phone</label><input type="tel" placeholder="0400 000 000"></div><div class="form-group"><label>Role / title</label><input type="text" placeholder="Marketing Lead"></div><div class="form-group"><label>Status</label><select><option>Active</option><option>Inactive</option><option>Prospect</option></select></div></div><div class="form-group"><label>Notes</label><textarea class="proposal-notes" placeholder="Initial contact notes…"></textarea></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Create contact</button></div></div>
  <div id="modal-add-prospect" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Add prospect</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>Company name</label><input type="text" placeholder="e.g. Harvey Norman"></div><div class="form-group"><label>Contact name</label><input type="text" placeholder="e.g. Mark Davidson"></div><div class="form-group"><label>Email</label><input type="email"></div><div class="form-group"><label>Phone</label><input type="tel"></div><div class="form-group"><label>Est. deal value</label><input type="text" placeholder="$80,000"></div><div class="form-group"><label>Stage</label><select><option>Outreach</option><option>Meeting booked</option><option>Avails sent</option><option>Proposal sent</option></select></div><div class="form-group"><label>Expected close</label><input type="date"></div><div class="form-group"><label>Assigned to</label><select><option>Hannah F.</option><option>James B.</option></select></div></div><div class="form-group"><label>Brief / notes</label><textarea class="proposal-notes" placeholder="Budget, timing, competition intel…"></textarea></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Add prospect</button></div></div>
  <div id="modal-warn-artwork" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Warning · Suncorp Static Run</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="warn-detail-block"><div class="wdb-row"><span class="wdb-label">Issue</span><span class="warn-tag">Artwork missing</span></div><div class="wdb-row"><span class="wdb-label">Site</span><span>148 Brunswick St, Fortitude Valley (23286)</span></div><div class="wdb-row"><span class="wdb-label">Spec required</span><span>Static 6×3m · Print-ready PDF/JPG · 300dpi</span></div><div class="wdb-row"><span class="wdb-label">Deadline</span><span style="color:#A32D2D;font-weight:600">2 days (16 Apr 2026)</span></div><div class="wdb-row"><span class="wdb-label">Contact</span><span>Emma Walsh · emma.walsh@suncorp.com.au</span></div></div><div class="form-group" style="margin-top:14px"><label>Message to client</label><textarea class="proposal-notes" style="height:80px">Hi Emma, just a reminder we still need the 6×3m static artwork for 148 Brunswick St. Deadline is 16 April. Please send to artwork@goa.com.au. Thanks!</textarea></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Send to Emma Walsh</button></div></div>
  <div id="modal-warn-po" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Warning · QLD Rail PO</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="warn-detail-block"><div class="wdb-row"><span class="wdb-label">Issue</span><span class="warn-tag">PO outstanding</span></div><div class="wdb-row"><span class="wdb-label">PO reference</span><span>QR-2026-047</span></div><div class="wdb-row"><span class="wdb-label">Amount</span><span class="fw5">$48,200</span></div><div class="wdb-row"><span class="wdb-label">Due</span><span style="color:#A32D2D;font-weight:600">28 Feb 2026 (overdue)</span></div><div class="wdb-row"><span class="wdb-label">Contact</span><span>Sarah Kim · s.kim@queenslandrail.com.au</span></div></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm">Chase PO · Email Sarah</button></div></div>
  <div id="modal-report" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Generate post-campaign report</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-group"><label>Client</label><input type="text" id="rpt-client" value="Queensland Rail"></div><div class="form-grid-2"><div class="form-group"><label>Campaign period</label><input type="text" id="rpt-period" value="LP9 2026 · 2 Feb – 1 Mar 2026"></div><div class="form-group"><label>Prepared by</label><input type="text" id="rpt-by" value="Hannah F. · Senior Sales QLD"></div></div><div class="form-group"><label>Include sections</label><div class="checkbox-group"><label class="checkbox-label"><input type="checkbox" checked> Campaign overview</label><label class="checkbox-label"><input type="checkbox" checked> Performance results</label><label class="checkbox-label"><input type="checkbox" checked> Delivery summary</label><label class="checkbox-label"><input type="checkbox" checked> Investment summary</label><label class="checkbox-label"><input type="checkbox" checked> Renewal recommendation</label></div></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm" onclick="generateReport('postcampaign',$('rpt-client')?.value,$('rpt-period')?.value,$('rpt-by')?.value);closeModal()">↓ Generate PPTX</button></div></div>
  <div id="modal-bonus-report" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>Generate bonus report</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>From</label><input type="date" id="bonus-from" value="2026-01-01"></div><div class="form-group"><label>To</label><input type="date" id="bonus-to" value="2026-03-31"></div></div><div class="form-group"><label>Clients</label><select><option>All clients</option><option>Active only</option></select></div><div class="bonus-preview-table"><div class="bpt-title">Preview — LP9 2026</div><table class="data-table"><thead><tr><th>Client</th><th>Paid</th><th>Bonus</th><th>Bonus %</th></tr></thead><tbody><tr><td>Suncorp</td><td class="fw5">$248k</td><td>$31k</td><td><span class="pill pill-green">12.5%</span></td></tr><tr><td>QLD Rail</td><td class="fw5">$184k</td><td>$28k</td><td><span class="pill pill-amber">15.2%</span></td></tr><tr><td>Alliance Media</td><td class="fw5">$91k</td><td>$12k</td><td><span class="pill pill-green">13.2%</span></td></tr></tbody></table></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm" onclick="generateExcel();closeModal()">↓ Export XLSX</button></div></div>
  <div id="modal-new-proposal" class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3>New proposal</h3><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="form-grid-2"><div class="form-group"><label>Client</label><select><option>Select client…</option><option>Suncorp</option><option>Alliance Media</option><option>QLD Rail</option><option>Harvey Norman</option></select></div><div class="form-group"><label>Campaign period</label><select><option>LP9 2026</option><option>LP10 2026</option><option>LP11 2026</option></select></div><div class="form-group"><label>Objective</label><input type="text" placeholder="Brand awareness · North corridor"></div><div class="form-group"><label>Budget</label><input type="text" placeholder="$50,000"></div></div></div><div class="modal-footer"><button class="btn-ghost sm" onclick="closeModal()">Cancel</button><button class="btn-primary sm" onclick="closeModal();nav(document.querySelectorAll('.nav-item')[7],'availability')">Browse availability →</button></div></div>`;
}

// ─── EXPORT FUNCTIONS ─────────────────────────────────────────────────────────
async function generateReport(type, client, period, preparedBy){
  const btn=event?.target;
  if(btn){btn.textContent='Generating…';btn.disabled=true;}
  try {
    const selectedSites=SITES_DATA.filter(s=>availSelSites.has(s.ims)).slice(0,12);
    const resp=await fetch('/.netlify/functions/generate-report',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({type:type||'postcampaign',client:client||'Client',period:period||'',preparedBy:preparedBy||'Hannah F. · Senior Sales QLD',sites:selectedSites,totalValue:'$48,300',objective:'Brand awareness and reach across key Brisbane corridors.',audience:'P25–54 Brisbane Metro'})
    });
    if(!resp.ok)throw new Error('Server error '+resp.status);
    const blob=await resp.blob();
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`${(client||'Report').replace(/\s+/g,'-')}_${type}.pptx`; a.click();
    URL.revokeObjectURL(url);
  } catch(e){
    alert('Export failed: '+e.message+'\n\nNote: PPTX export requires the Netlify Functions to be deployed. Download the zip and push to GitHub to enable this.');
  } finally {
    if(btn){btn.textContent=btn.textContent.includes('Generating')?(type==='proposal'?'↓ Export as PPTX':'↓ Generate PPTX'):btn.textContent;btn.disabled=false;}
  }
}
async function generateExcel(){
  try {
    const resp=await fetch('/.netlify/functions/generate-excel',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({dateFrom:$('bonus-from')?.value||'2026-01-01',dateTo:$('bonus-to')?.value||'2026-03-31'})
    });
    if(!resp.ok)throw new Error('Server error '+resp.status);
    const blob=await resp.blob();
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='goa_bonus_report.xlsx'; a.click();
    URL.revokeObjectURL(url);
  } catch(e){
    alert('Export failed: '+e.message+'\n\nNote: Excel export requires Netlify Functions to be deployed.');
  }
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
let revChart=null,fmtChart=null;
function initCharts(){
  const c=$('rev-chart'); if(!c||!window.Chart){setTimeout(initCharts,200);return;}
  if(revChart){revChart.destroy();revChart=null;}
  revChart=new Chart(c,{type:'bar',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Revenue',data:[198,241,187,220,195,210],backgroundColor:'#C8102E',borderRadius:3},{label:'Target',data:[220,220,220,220,220,220],backgroundColor:'#E5E7EB',borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{family:'Poppins',size:10},color:'#9ca3af'}},y:{grid:{color:'#f3f4f6'},ticks:{font:{family:'Poppins',size:10},color:'#9ca3af',callback:v=>'$'+v+'k'},border:{display:false}}}}});
}
function initReportCharts(){
  const c=$('format-chart'); if(!c||!window.Chart){setTimeout(initReportCharts,200);return;}
  if(fmtChart){fmtChart.destroy();fmtChart=null;}
  fmtChart=new Chart(c,{type:'doughnut',data:{labels:['Iconic','Digital','Static'],datasets:[{data:[510,420,310],backgroundColor:['#111827','#C8102E','#9CA3AF'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}});
}
(function(){const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';document.head.appendChild(s);})();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(s){if(!s)return'';const d=new Date(s);return d.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'2-digit'});}
function fmtDateShort(s){if(!s)return'';const d=new Date(s);return d.toLocaleDateString('en-AU',{day:'numeric',month:'short'});}
