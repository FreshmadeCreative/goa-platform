// ── Navigation ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  if (screen) screen.classList.add('active');
  const navMap = {
    contacts: 0, prospects: 1, bookings: 2, renewals: 3,
    dashboard: 4, reports: 5, ai: 6,
    availability: 7, proposal: 8, approvals: 9,
    brand: 10
  };
  const navItems = document.querySelectorAll('.nav-item');
  if (navMap[id] !== undefined && navItems[navMap[id]]) {
    navItems[navMap[id]].classList.add('active');
  }
  if (id === 'dashboard') setTimeout(initDashCharts, 60);
  if (id === 'reports') setTimeout(initReportCharts, 60);
}

function setTab(el) {
  el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function toggleDetail(id) {
  const row = document.getElementById(id);
  if (!row) return;
  row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}

// ── Auth ──
function doLogin() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  if (!email || !pass) { alert('Please enter your email and password.'); return; }
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('app-page').classList.add('active');
  document.body.classList.remove('page-login');
  document.body.style.overflow = 'hidden';
  setTimeout(initDashCharts, 100);
}

function doLogout() {
  document.getElementById('app-page').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
  document.body.style.overflow = '';
}

// Allow Enter key on login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-page').classList.contains('active')) {
    doLogin();
  }
});

// ── Charts ──
let revChartInst = null;
let formatChartInst = null;

function initDashCharts() {
  const revCanvas = document.getElementById('rev-chart');
  if (!revCanvas) return;
  if (revChartInst) { revChartInst.destroy(); revChartInst = null; }

  const isDark = false;
  revChartInst = new Chart(revCanvas, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [198, 241, 187, 220, 195, 210],
          backgroundColor: '#C8102E',
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Target',
          data: [220, 220, 220, 220, 220, 220],
          backgroundColor: '#e5e7eb',
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => '$' + ctx.parsed.y + 'k'
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 10 }, color: '#9ca3af' } },
        y: { grid: { color: '#f3f4f6' }, ticks: { font: { family: 'Poppins', size: 10 }, color: '#9ca3af', callback: v => '$' + v + 'k' }, border: { display: false } }
      }
    }
  });
}

function initReportCharts() {
  const fCanvas = document.getElementById('format-chart');
  if (!fCanvas) return;
  if (formatChartInst) { formatChartInst.destroy(); formatChartInst = null; }

  formatChartInst = new Chart(fCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Iconic', 'Digital', 'Static'],
      datasets: [{
        data: [510, 420, 310],
        backgroundColor: ['#111827', '#C8102E', '#9ca3af'],
        borderWidth: 0,
        hoverOffset: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ctx.label + ': $' + ctx.parsed + 'k'
          }
        }
      }
    }
  });
}

// ── Load Chart.js then init ──
(function loadChartJs() {
  if (window.Chart) return;
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
  s.onload = () => {};
  document.head.appendChild(s);
})();
