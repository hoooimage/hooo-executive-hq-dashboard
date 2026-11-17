const state = { data: null, tasks: [], decisions: [], meetings: [], progress: [] };

const columnObjects = (values) => {
  if (!values?.length) return [];
  const [headers, ...rows] = values;
  return rows
    .filter(row => row.some(cell => String(cell ?? '').trim()))
    .map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
};

const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const statusClass = status => {
  status = String(status || '');
  return status === '受阻' ? 'red' : status === '已完成' || status === '已生效' ? 'green' : status.includes('CEO') || status === '待舉行' ? 'amber' : status === '進行中' ? 'blue' : 'neutral';
};
const taskIdNum = id => Number(String(id).replace(/\D/g, '')) || 0;

function showView(view) {
  document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('is-active', button.dataset.view === view));
  document.querySelectorAll('.view').forEach(panel => panel.classList.toggle('is-visible', panel.dataset.viewPanel === view));
  const titles = { overview: '今天最重要的事', tasks: '所有工作，一個主檔', revenue: '從講座開始產生生意', governance: '每個決定都有承接', executives: '三位主管，同一個方向' };
  document.querySelector('#page-title').textContent = titles[view];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderKpis() {
  const active = state.tasks.filter(t => !['已完成','取消'].includes(t['狀態']));
  const values = [
    ['進行中的工作', active.length, '未完成任務'],
    ['P0 優先', active.filter(t => t['優先級'] === 'P0').length, '公司級要務'],
    ['待 CEO 確認', state.tasks.filter(t => t['狀態'] === '待CEO確認').length + state.decisions.filter(d => d['狀態'] === '待CEO確認').length, '任務與決策'],
    ['受阻事項', state.tasks.filter(t => t['狀態'] === '受阻').length, '需要解除'],
    ['已生效決策', state.decisions.filter(d => d['狀態'] === '已生效').length, '正式方向']
  ];
  document.querySelector('#kpi-grid').innerHTML = values.map(([label, value, note]) => `<article class="kpi-card"><p>${label}</p><strong>${value}</strong><small>${note}</small></article>`).join('');
}

function renderQueue() {
  const taskQueue = state.tasks.filter(t => t['狀態'] === '待CEO確認').map(t => ({id:t['任務ID'], title:t['任務名稱'], note:t['依賴／阻礙'], status:t['狀態']}));
  const decisionQueue = state.decisions.filter(d => d['狀態'] === '待CEO確認').map(d => ({id:d['決策ID'], title:d['決策主題'], note:d['最後決策'], status:d['狀態']}));
  const queue = [...taskQueue, ...decisionQueue].slice(0, 5);
  document.querySelector('#decision-queue').innerHTML = queue.length ? queue.map(item => `
    <article class="queue-item">
      <span class="id-chip">${esc(item.id)}</span>
      <div><strong>${esc(item.title)}</strong><p>${esc(item.note || '等待 CEO 判斷')}</p></div>
      <span class="tag amber">${esc(item.status)}</span>
    </article>`).join('') : '<p class="muted">目前沒有等待 CEO 確認的事項。</p>';
}

function renderProgress() {
  const latest = [...state.progress].sort((a,b) => taskIdNum(b['更新ID']) - taskIdNum(a['更新ID'])).slice(0, 6);
  document.querySelector('#progress-feed').innerHTML = latest.map(item => `
    <article class="timeline-item">
      <strong>${esc(item['更新者'])} · ${esc(item['任務ID'])}</strong>
      <p>${esc(item['本次進展'])}</p>
      <small>${esc(item['更新日'])} · 下一步：${esc(item['下一步／下次檢查日'])}</small>
    </article>`).join('');
}

function populateFilters() {
  const statuses = [...new Set(state.tasks.map(t => t['狀態']).filter(Boolean))];
  const owners = [...new Set(state.tasks.map(t => t['部門']).filter(Boolean))];
  document.querySelector('#status-filter').insertAdjacentHTML('beforeend', statuses.map(s => `<option>${esc(s)}</option>`).join(''));
  document.querySelector('#owner-filter').insertAdjacentHTML('beforeend', owners.map(s => `<option>${esc(s)}</option>`).join(''));
}

function renderTasks() {
  const query = document.querySelector('#task-search').value.trim().toLowerCase();
  const status = document.querySelector('#status-filter').value;
  const owner = document.querySelector('#owner-filter').value;
  const filtered = state.tasks.filter(task => {
    const haystack = Object.values(task).join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && (!status || task['狀態'] === status) && (!owner || task['部門'] === owner);
  });
  document.querySelector('#task-table').innerHTML = filtered.map(task => `
    <tr>
      <td><small>${esc(task['任務ID'])}</small><strong>${esc(task['任務名稱'])}</strong><small>${esc(task['專案／客戶'])}</small></td>
      <td>${esc(task['負責人'])}<br><small>${esc(task['部門'])}</small></td>
      <td><span class="tag ${task['優先級'] === 'P0' ? 'red' : 'neutral'}">${esc(task['優先級'])}</span></td>
      <td><span class="tag ${statusClass(task['狀態'])}">${esc(task['狀態'])}</span></td>
      <td>${esc(task['期限'])}</td>
      <td>${esc(task['下一步'])}<br><small>${esc(task['依賴／阻礙'])}</small></td>
    </tr>`).join('');
  document.querySelector('#task-empty').hidden = filtered.length > 0;
}

function renderRevenue() {
  const revenueTasks = state.tasks.filter(t => ['T-009','T-010','T-011','T-013','T-014','T-015','T-016'].includes(t['任務ID']));
  document.querySelector('#revenue-tasks').innerHTML = revenueTasks.map(task => `
    <article class="mini-card">
      <div class="card-meta"><span class="tag ${task['優先級'] === 'P0' ? 'red' : 'neutral'}">${esc(task['任務ID'])} · ${esc(task['優先級'])}</span><span class="tag ${statusClass(task['狀態'])}">${esc(task['狀態'])}</span></div>
      <h4>${esc(task['任務名稱'])}</h4>
      <p>${esc(task['下一步'])}</p>
    </article>`).join('');
}

function renderGovernance() {
  document.querySelector('#decision-list').innerHTML = [...state.decisions].reverse().map(item => `
    <article class="decision-item ${item['狀態'] === '待CEO確認' ? 'pending' : ''}">
      <header><h4>${esc(item['決策ID'])} · ${esc(item['決策主題'])}</h4><span class="tag ${statusClass(item['狀態'])}">${esc(item['狀態'])}</span></header>
      <p>${esc(item['最後決策'])}</p>
    </article>`).join('');

  document.querySelector('#meeting-list').innerHTML = state.meetings.map(item => {
    const parts = String(item['日期']).split('/');
    const month = parts[0] || '--'; const day = parts[1] || '--';
    return `<article class="meeting-item">
      <div class="meeting-date"><strong>${esc(day)}</strong><small>${esc(month)} 月</small></div>
      <div><h4>${esc(item['會議ID'])} · ${esc(item['會議類型'])}</h4><p>${esc(item['重點摘要'])}</p><span class="tag ${statusClass(item['狀態'])}">${esc(item['狀態'])}</span></div>
    </article>`;
  }).join('');
}

function renderExecutives() {
  const executives = [
    { name:'Alex', title:'CSO｜策略長', dept:'Alex / CSO', focus:'方向、取捨、產品組合與 30 天營收目標。' },
    { name:'Sophie', title:'CGO｜成長長', dept:'Sophie / CGO', focus:'主辦方名單、邀約、漏斗、品牌與課後分流。' },
    { name:'Daniel', title:'COO｜營運長', dept:'Daniel / COO', focus:'承接、阻礙、會議節奏、資料治理與執行品質。' }
  ];
  document.querySelector('#executive-grid').innerHTML = executives.map(exec => {
    const tasks = state.tasks.filter(t => t['部門'] === exec.dept || String(t['負責人']).includes(exec.name));
    const complete = tasks.filter(t => t['狀態'] === '已完成').length;
    const active = tasks.filter(t => !['已完成','取消'].includes(t['狀態'])).length;
    const percent = tasks.length ? Math.round((complete / tasks.length) * 100) : 0;
    const next = tasks.find(t => t['優先級'] === 'P0' && !['已完成','取消'].includes(t['狀態'])) || tasks[0];
    return `<article class="executive-card">
      <header><span>${esc(exec.title)}</span><h3>${exec.name}</h3><p>${esc(exec.focus)}</p></header>
      <div class="executive-body">
        <p class="eyebrow">CURRENT FOCUS</p>
        <p class="executive-focus">${next ? `<strong>${esc(next['任務ID'])} · ${esc(next['任務名稱'])}</strong><br>${esc(next['下一步'])}` : '目前沒有指派任務'}</p>
        <div class="progress-bar"><span style="width:${percent}%"></span></div>
        <div class="executive-stats"><span>${active} 項進行中</span><span>${complete} 項完成</span></div>
      </div>
    </article>`;
  }).join('');
}

async function init() {
  try {
    const response = await fetch('./data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('資料讀取失敗');
    state.data = await response.json();
    const sheets = state.data.sheets;
    state.tasks = columnObjects(sheets.tasks.values);
    state.progress = columnObjects(sheets.progress.values);
    state.decisions = columnObjects(sheets.decisions.values);
    state.meetings = columnObjects(sheets.meetings.values);
    document.querySelectorAll('[data-sheet-link]').forEach(link => link.href = state.data.sourceUrl);
    const synced = new Date(state.data.generatedAt);
    document.querySelector('#sync-time').textContent = `資料快照：${synced.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false })}`;
    renderKpis(); renderQueue(); renderProgress(); populateFilters(); renderTasks(); renderRevenue(); renderGovernance(); renderExecutives();
  } catch (error) {
    document.querySelector('#main').insertAdjacentHTML('afterbegin', `<div class="panel" role="alert">無法載入資料：${esc(error.message)}</div>`);
  }
}

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => showView(button.dataset.jump)));
['task-search','status-filter','owner-filter'].forEach(id => document.querySelector(`#${id}`).addEventListener('input', renderTasks));
init();
