const SPREADSHEET_ID = '1omzCYbgnZ7uSJWlIjvbAaVBfv0no-GJzkLeInVKEx_c';
const WRITE_ACCOUNTS = ['hoooimage@gmail.com', 'viannieho@gmail.com'];

// 公開讀取僅輸出 Dashboard 必要欄位；原始試算表仍維持限制存取。
const PUBLIC_RANGES = {
  goals: { range: "'公司目標'!A4:I1000", columns: [0,1,2,3,4,5,6,7,8] },
  daily: { range: "'每日主管重點'!A4:I1000", columns: [0,1,2,3,4,5,6,7,8] },
  tasks: { range: "'共同任務'!A5:V1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21] },
  progress: { range: "'進度更新'!A5:H1000", columns: [0,1,2,3,4,5,6,7] },
  decisions: { range: "'決策紀錄'!A5:M1000", columns: [0,1,2,3,4,5,7,8,9,10,11,12] },
  meetings: { range: "'會議紀錄'!A5:J1000", columns: [0,1,2,3,4,5,6,7,8,9] },
  services: { range: "'服務項目'!A4:I1000", columns: [0,1,2,3,4,5,6,7,8] },
  income: { range: "'收入明細'!A4:Q1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] },
  expenses: { range: "'支出明細'!A4:R1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] },
  costCategories: { range: "'費用類別'!A4:E1000", columns: [0,1,2,3,4] },
  strategies: { range: "'策略商務地圖'!A4:N1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13] },
  funnels: { range: "'服務漏斗'!A4:R1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] },
  operatingMap: { range: "'公司作戰地圖'!A4:P1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  inbox: { range: "'每日新增事項'!A4:P1000", columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  brandFoundation: { range: "'品牌基礎'!A4:F1000", columns: [0,1,2,3,4,5] },
  settings: { range: "'Settings'!A4:B1000", columns: [0,1] },
  workstreams: { range: "'Workstreams'!A4:E1000", columns: [0,1,2,3,4] },
  tasksNew: { range: "'Tasks'!A4:J1000", columns: [0,1,2,3,4,5,6,7,8,9] },
  decisionsNew: { range: "'Decisions'!A4:I1000", columns: [0,1,2,3,4,5,6,7,8] },
  events: { range: "'Events'!A4:G1000", columns: [0,1,2,3,4,5,6] },
  metrics: { range: "'Metrics'!A4:I1000", columns: [0,1,2,3,4,5,6,7,8] },
  docs: { range: "'Docs'!A4:D1000", columns: [0,1,2,3] }
};

function trimRows_(values) {
  let last = values.length;
  while (last > 0 && values[last - 1].every(cell => String(cell).trim() === '')) last -= 1;
  return values.slice(0, last);
}

function buildPayload_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = {};
  Object.keys(PUBLIC_RANGES).forEach(key => {
    const config = PUBLIC_RANGES[key];
    const rawValues = trimRows_(spreadsheet.getRange(config.range).getDisplayValues());
    sheets[key] = { range: config.range, values: rawValues.map(row => config.columns.map(index => row[index] || '')) };
  });
  return { generatedAt: new Date().toISOString(), sourceUrl: spreadsheet.getUrl(), sheets };
}

function jsonOutput_(payload, callback) {
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(payload) + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return jsonOutput_(buildPayload_(), String((e && e.parameter && e.parameter.callback) || ''));
}

// 寫入端點必須另行部署為「以存取者身分執行」，並要求 Google 登入。
// 實際寫入仍受試算表本身的編輯權限控制，不另設 Dashboard PIN。
function doPost(e) {
  const p = (e && e.parameter) || {};
  let result;
  try {
    const email = String(Session.getActiveUser().getEmail() || '').toLowerCase();
    if (WRITE_ACCOUNTS.indexOf(email) < 0) throw new Error('這個 Google 帳號沒有寫入權限');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      result = applyAction_(p);
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    result = { ok: false, message: error.message || '寫入失敗' };
  }
  const safe = JSON.stringify(result).replace(/</g, '\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>parent.postMessage({source:"hooo-hq",payload:' + safe + '},"*");<\/script>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function applyAction_(p) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (p.action === 'taskNew') {
    const id = appendNewTask_(spreadsheet, {
      title: p.title, workstreamId: p.workstreamId, owner: p.owner, due: p.due,
      status: p.status, next: p.next, source: p.source
    });
    return { ok: true, message: id + ' 已新增到待辦' };
  }
  if (p.action === 'taskNewStatus') {
    const status = String(p.status || '');
    if (['未開始', '進行中', '等待中', '完成'].indexOf(status) < 0) throw new Error('不允許的待辦狀態');
    const sheet = spreadsheet.getSheetByName('Tasks');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 5);
    sheet.getRange(row, 6).setValue(status);
    sheet.getRange(row, 10).setValue(status === '完成' ? Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd') : '');
    return { ok: true, message: String(p.id || '') + ' 狀態已更新' };
  }
  if (p.action === 'decisionNew') {
    const title = String(p.title || '').trim();
    if (!title) throw new Error('請輸入待決定事項');
    const sheet = spreadsheet.getSheetByName('Decisions');
    const row = Math.max(sheet.getLastRow() + 1, 5);
    const id = nextId_(sheet, 'D-', 1, 5);
    sheet.getRange(row, 1, 1, 9).setValues([[id, title, String(p.options || ''), String(p.people || ''), cleanDate_(p.due), '待決定', '', '', '']]);
    return { ok: true, message: id + ' 已新增到待決定' };
  }
  if (p.action === 'decisionRecord') {
    const finalDecision = String(p.finalDecision || '').trim();
    if (!finalDecision) throw new Error('請填寫最後決定');
    const sheet = spreadsheet.getSheetByName('Decisions');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 5);
    let followupId = '';
    if (String(p.createFollowup || '') === 'yes') {
      followupId = appendNewTask_(spreadsheet, { title: p.followupTitle || ('承接決定：' + String(p.title || '')), workstreamId: p.followupWorkstream, owner: '圈圈', due: p.followupDue, status: '未開始', next: '', source: String(p.id || '') });
    }
    sheet.getRange(row, 6, 1, 4).setValues([['已決定', finalDecision, cleanDate_(p.decisionDate) || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd'), followupId]]);
    return { ok: true, message: String(p.id || '') + ' 已記錄決定' + (followupId ? '，並建立 ' + followupId : '') };
  }
  if (p.action === 'eventNew') {
    const date = cleanDate_(p.date), title = String(p.title || '').trim(), period = String(p.period || '全天'), type = String(p.type || '其他工作');
    if (!date || !title) throw new Error('請填寫行程日期與標題');
    if (['全天', '上午', '下午', '晚上'].indexOf(period) < 0) throw new Error('不允許的行程時段');
    const types = ['阿默陪跑','講座','拍攝','高球','家庭日','學習','人脈交流','其他工作','個人事務'];
    if (types.indexOf(type) < 0) throw new Error('不允許的行程類型');
    const sheet = spreadsheet.getSheetByName('Events'), row = Math.max(sheet.getLastRow() + 1, 5), id = nextId_(sheet, 'EV-', 1, 5);
    sheet.getRange(row, 1, 1, 7).setValues([[id, date, period, type, title, String(p.location || ''), String(p.note || '')]]);
    return { ok: true, message: id + ' 已新增到行事曆' };
  }
  if (p.action === 'decision') {
    const status = String(p.status || '');
    if (!['已生效', '需調整', '待CEO確認'].includes(status)) throw new Error('不允許的決策狀態');
    const sheet = spreadsheet.getSheetByName('決策紀錄');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 6);
    sheet.getRange(row, 8).setValue(status);
    sheet.getRange(row, 13).setValue(String(p.note || ''));
    appendProgress_(spreadsheet, String(p.id || ''), 'CEO', 'CEO回覆：' + status + (p.note ? '｜' + p.note : ''), status);
    return { ok: true, message: '決策已更新到試算表' };
  }
  if (p.action === 'task') {
    const status = String(p.status || '');
    if (!['進行中', '已完成', '受阻', '待處理'].includes(status)) throw new Error('不允許的任務狀態');
    const sheet = spreadsheet.getSheetByName('共同任務');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 6);
    sheet.getRange(row, 7).setValue(status);
    sheet.getRange(row, 17).setValue(String(p.note || ''));
    appendProgress_(spreadsheet, String(p.id || ''), 'CEO', 'CEO回覆：' + status + (p.note ? '｜' + p.note : ''), status);
    return { ok: true, message: '任務已更新到試算表' };
  }
  if (p.action === 'income') {
    const sheet = spreadsheet.getSheetByName('收入明細');
    const amountDue = finiteNumber_(p.amountDue);
    const amountReceived = finiteNumber_(p.amountReceived);
    const nextRow = Math.max(sheet.getLastRow() + 1, 5);
    const id = 'I-' + Utilities.formatString('%03d', nextRow - 4);
    const date = String(p.date || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd'));
    sheet.getRange(nextRow, 1, 1, 17).setValues([[
      id, date, String(p.customer || ''), String(p.project || ''), String(p.serviceId || ''), String(p.service || ''),
      finiteNumber_(p.quantity || 1), finiteNumber_(p.unitPrice || amountDue), amountDue, amountReceived, '',
      String(p.paymentMethod || '轉帳'), String(p.invoiceStatus || '待開立'), String(p.paymentStatus || '待收款'),
      String(p.owner || 'CEO'), String(p.taskId || ''), String(p.note || '')
    ]]);
    sheet.getRange(nextRow, 11).setFormula('=MAX(I' + nextRow + '-J' + nextRow + ',0)');
    return { ok: true, message: id + ' 已新增到收入明細' };
  }
  if (p.action === 'expense') {
    const sheet = spreadsheet.getSheetByName('支出明細');
    const amountDue = finiteNumber_(p.amountDue);
    const amountPaid = finiteNumber_(p.amountPaid);
    const nextRow = Math.max(sheet.getLastRow() + 1, 5);
    const id = 'E-' + Utilities.formatString('%03d', nextRow - 4);
    const date = String(p.date || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd'));
    sheet.getRange(nextRow, 1, 1, 18).setValues([[
      id, date, String(p.project || ''), String(p.costType || '變動成本'), String(p.category || ''), String(p.item || ''), String(p.payee || ''),
      finiteNumber_(p.quantity || 1), finiteNumber_(p.unitPrice || amountDue), amountDue, amountPaid, '',
      String(p.paymentMethod || '轉帳'), String(p.receiptStatus || '待補'), String(p.paymentStatus || '待付款'),
      String(p.owner || 'CEO'), String(p.taskId || ''), String(p.note || '')
    ]]);
    sheet.getRange(nextRow, 12).setFormula('=MAX(J' + nextRow + '-K' + nextRow + ',0)');
    return { ok: true, message: id + ' 已新增到支出明細' };
  }
  if (p.action === 'inbox') {
    const sheet = spreadsheet.getSheetByName('每日新增事項');
    const content = String(p.content || '').trim();
    if (!content) throw new Error('請輸入事項內容');
    const nextRow = Math.max(sheet.getLastRow() + 1, 5);
    const id = 'IN-' + Utilities.formatString('%03d', nextRow - 4);
    const date = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
    sheet.getRange(nextRow, 1, 1, 16).setValues([[
      id, date, content, String(p.itemType || '待辦'), String(p.category || '營運管理'), 'Dashboard',
      String(p.goalId || ''), String(p.project || ''), String(p.owner || 'CEO'), String(p.priority || 'P1'), '待分類',
      String(p.due || ''), String(p.next || ''), String(p.decision || ''), '', String(p.note || '')
    ]]);
    return { ok: true, message: id + ' 已收進今日事項' };
  }
  if (p.action === 'expenseCategory') {
    const sheet = spreadsheet.getSheetByName('費用類別');
    const costType = String(p.costType || '變動成本');
    const name = String(p.name || '').trim();
    const status = String(p.status || '啟用');
    if (!['固定成本', '變動成本'].includes(costType)) throw new Error('不允許的成本屬性');
    if (!['啟用', '停用'].includes(status)) throw new Error('不允許的類別狀態');
    if (!name) throw new Error('請輸入費用類別名稱');
    let row, id = String(p.id || '').trim();
    if (id) {
      row = findIdRow_(sheet, id, 1, 5);
    } else {
      row = Math.max(sheet.getLastRow() + 1, 5);
      id = 'C-' + Utilities.formatString('%03d', row - 4);
    }
    sheet.getRange(row, 1, 1, 5).setValues([[id, costType, name, status, String(p.note || '')]]);
    return { ok: true, message: id + ' 費用類別已儲存' };
  }
  throw new Error('未知的操作');
}

function appendNewTask_(spreadsheet, data) {
  const title = String(data.title || '').trim(), workstreamId = String(data.workstreamId || '').trim(), status = String(data.status || '未開始');
  if (!title || !workstreamId) throw new Error('請填寫待辦與工作線');
  if (['未開始', '進行中', '等待中', '完成'].indexOf(status) < 0) throw new Error('不允許的待辦狀態');
  const sheet = spreadsheet.getSheetByName('Tasks'), row = Math.max(sheet.getLastRow() + 1, 5), id = nextId_(sheet, 'T-', 1, 5), today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
  sheet.getRange(row, 1, 1, 10).setValues([[id, title, workstreamId, String(data.owner || '圈圈'), cleanDate_(data.due), status, String(data.next || ''), String(data.source || ''), today, status === '完成' ? today : '']]);
  return id;
}

function nextId_(sheet, prefix, column, startRow) {
  const lastRow = sheet.getLastRow();
  if (lastRow < startRow) return prefix + '001';
  const values = sheet.getRange(startRow, column, lastRow - startRow + 1, 1).getDisplayValues();
  const max = values.reduce((current, row) => Math.max(current, Number(String(row[0] || '').replace(/\D/g, '')) || 0), 0);
  return prefix + Utilities.formatString('%03d', max + 1);
}

function cleanDate_(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('日期必須是 YYYY-MM-DD');
  return text;
}

function findIdRow_(sheet, id, column, startRow) {
  if (!id) throw new Error('缺少項目ID');
  const lastRow = sheet.getLastRow();
  const values = sheet.getRange(startRow, column, Math.max(lastRow - startRow + 1, 1), 1).getDisplayValues();
  const index = values.findIndex(row => String(row[0]).trim() === id);
  if (index < 0) throw new Error('找不到 ' + id);
  return startRow + index;
}

function finiteNumber_(value) {
  const number = Number(String(value || 0).replace(/,/g, ''));
  if (!isFinite(number) || number < 0) throw new Error('金額或數量格式不正確');
  return number;
}

function appendProgress_(spreadsheet, itemId, updater, text, status) {
  const sheet = spreadsheet.getSheetByName('進度更新');
  const row = Math.max(sheet.getLastRow() + 1, 6);
  const id = 'U-' + Utilities.formatString('%03d', row - 5);
  const taskId = /^T-/.test(itemId) ? itemId : '';
  sheet.getRange(row, 1, 1, 8).setValues([[id, taskId, new Date(), updater, text, status, '', '依CEO回覆承接']]);
}
