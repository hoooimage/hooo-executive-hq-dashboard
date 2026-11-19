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
  tasksNew: { range: "'Tasks'!A4:K1000", columns: [0,1,2,3,4,5,6,7,8,9,10] },
  decisionsNew: { range: "'Decisions'!A4:I1000", columns: [0,1,2,3,4,5,6,7,8] },
  events: { range: "'Events'!A4:G1000", columns: [0,1,2,3,4,5,6] },
  metrics: { range: "'Metrics'!A4:J1000", columns: [0,1,2,3,4,5,6,7,8,9] },
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
  const p = (e && e.parameter) || {};
  const callback = String(p.callback || '');
  if (String(p.scope || '') === 'coach') {
    try {
      const email = String(Session.getActiveUser().getEmail() || '').toLowerCase();
      if (WRITE_ACCOUNTS.indexOf(email) < 0) throw new Error('這個 Google 帳號沒有陪跑紀錄讀取權限');
      return jsonOutput_(buildCoachPayload_(email), callback);
    } catch (error) {
      return jsonOutput_({ ok: false, message: error.message || '私人資料讀取失敗' }, callback);
    }
  }
  return jsonOutput_(buildPayload_(), callback);
}

function buildCoachPayload_(email) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ranges = {
    coachLogs: { sheet: 'CoachLogs', columns: 22 },
    coachTools: { sheet: 'CoachTools', columns: 14 }
  };
  const sheets = {};
  Object.keys(ranges).forEach(function(key) {
    const config = ranges[key], sheet = spreadsheet.getSheetByName(config.sheet);
    if (!sheet) throw new Error('缺少 ' + config.sheet + ' 工作表');
    const lastRow = Math.max(sheet.getLastRow(), 4);
    const values = trimRows_(sheet.getRange(4, 1, lastRow - 3, config.columns).getDisplayValues());
    sheets[key] = { range: "'" + config.sheet + "'!A4:" + columnLetter_(config.columns) + lastRow, values: values };
  });
  return { ok: true, generatedAt: new Date().toISOString(), account: email, sheets: sheets };
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
      status: p.status, next: p.next, source: p.source, importance: p.importance
    });
    return { ok: true, message: id + ' 已新增到待辦' };
  }
  if (p.action === 'taskEdit') {
    const sheet = spreadsheet.getSheetByName('Tasks');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 5);
    const title = String(p.title || '').trim(), workstreamId = String(p.workstreamId || '').trim();
    const status = validTaskStatus_(p.status), importance = validImportance_(p.importance);
    if (!title || !workstreamId) throw new Error('請填寫待辦與工作線');
    sheet.getRange(row, 2, 1, 7).setValues([[
      title, workstreamId, String(p.owner || '圈圈'), cleanDate_(p.due), status,
      String(p.next || ''), String(p.source || '')
    ]]);
    sheet.getRange(row, 10).setValue(status === '完成' ? Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd') : '');
    sheet.getRange(row, 11).setValue(importance);
    return { ok: true, message: String(p.id || '') + ' 已更新' };
  }
  if (p.action === 'taskNewStatus') {
    const status = validTaskStatus_(p.status);
    const sheet = spreadsheet.getSheetByName('Tasks');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 5);
    sheet.getRange(row, 6).setValue(status);
    sheet.getRange(row, 10).setValue(status === '完成' ? Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd') : '');
    return { ok: true, message: String(p.id || '') + ' 狀態已更新' };
  }
  if (p.action === 'taskPriority') {
    const importance = validImportance_(p.importance);
    const sheet = spreadsheet.getSheetByName('Tasks');
    const row = findIdRow_(sheet, String(p.id || ''), 1, 5);
    sheet.getRange(row, 11).setValue(importance);
    return { ok: true, message: String(p.id || '') + ' 重要程度已更新' };
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
      followupId = appendNewTask_(spreadsheet, { title: p.followupTitle || ('承接決定：' + String(p.title || '')), workstreamId: p.followupWorkstream, owner: '圈圈', due: p.followupDue, status: '未開始', next: '', source: String(p.id || ''), importance: '一般' });
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
  if (p.action === 'metricNew') {
    const date = cleanDate_(p.date);
    if (!date) throw new Error('請填寫數字紀錄日期');
    const sheet = spreadsheet.getSheetByName('Metrics');
    const lastRow = sheet.getLastRow();
    let row = 0;
    if (lastRow >= 5) {
      const dates = sheet.getRange(5, 1, lastRow - 4, 1).getDisplayValues();
      const index = dates.findIndex(item => String(item[0] || '').trim() === date);
      if (index >= 0) row = index + 5;
    }
    const updating = row > 0;
    if (!row) row = Math.max(lastRow + 1, 5);
    sheet.getRange(row, 1, 1, 10).setValues([[
      date, finiteNumber_(p.ig), finiteNumber_(p.fb), finiteNumber_(p.line),
      finiteNumber_(p.registrations), finiteNumber_(p.testimonials), finiteNumber_(p.posts),
      finiteNumber_(p.videos), String(p.note || ''), finiteNumber_(p.threads)
    ]]);
    return { ok: true, message: date + (updating ? ' 的每週數字已更新' : ' 的每週數字已新增') };
  }
  if (p.action === 'socialSync') {
    const result = syncSocialMetrics();
    return { ok: true, message: result.message };
  }
  if (p.action === 'coachSave') {
    const id = saveCoachLog_(spreadsheet, p);
    return { ok: true, message: id + ' 陪跑紀錄已儲存' };
  }
  if (p.action === 'coachDelete') {
    const id = String(p.id || '').trim(), logSheet = spreadsheet.getSheetByName('CoachLogs'), toolSheet = spreadsheet.getSheetByName('CoachTools');
    const row = findIdRow_(logSheet, id, 1, 5);
    logSheet.getRange(row, 22).setValue('已刪除');
    logSheet.getRange(row, 19).setValue(nowText_());
    if (toolSheet.getLastRow() >= 5) {
      const rows = toolSheet.getRange(5, 2, toolSheet.getLastRow() - 4, 13).getDisplayValues();
      rows.forEach(function(item, index) { if (String(item[0]).trim() === id) toolSheet.getRange(index + 5, 14).setValue('已刪除'); });
    }
    return { ok: true, message: id + ' 已移出總覽，原始資料仍保留' };
  }
  if (p.action === 'coachStar') {
    const sheet = spreadsheet.getSheetByName('CoachTools'), id = String(p.id || '').trim(), row = findIdRow_(sheet, id, 1, 5), value = String(p.starred || '否') === '是' ? '是' : '否';
    sheet.getRange(row, 10).setValue(value);sheet.getRange(row, 12).setValue(nowText_());
    return { ok: true, message: value === '是' ? '已收進教材' : '已取消教材標記' };
  }
  if (p.action === 'coachImport') {
    const records = safeJson_(p.recordsJson, []);
    if (!Array.isArray(records) || !records.length) throw new Error('沒有可匯入的紀錄');
    if (records.length > 100) throw new Error('單次最多匯入 100 筆');
    const ids = records.map(function(record) { return saveCoachLog_(spreadsheet, record); });
    return { ok: true, message: '已匯入 ' + ids.length + ' 筆陪跑紀錄' };
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

function saveCoachLog_(spreadsheet, data) {
  const logSheet = spreadsheet.getSheetByName('CoachLogs'), toolSheet = spreadsheet.getSheetByName('CoachTools');
  if (!logSheet || !toolSheet) throw new Error('陪跑紀錄工作表尚未建立');
  const email = String(Session.getActiveUser().getEmail() || '').toLowerCase();
  const date = cleanDate_(data.date || data['陪跑日期']), unit = String(data.unit || data['單位'] || '').trim(), period = String(data.period || data['時段'] || '全天').trim(), topic = String(data.topic || data['本次主題'] || '').trim();
  const steps = listParam_(data.stepsJson || data.steps || data['五步驟標籤']), topics = listParam_(data.topicsJson || data.topics || data['主題標籤']);
  if (!date || !unit || !topic || !steps.length) throw new Error('請填寫日期、單位、本次主題與五步驟標籤');
  if (['全天','上午','下午'].indexOf(period) < 0) throw new Error('不允許的陪跑時段');
  const allowedSteps = ['被看見','被理解','被照顧','被交付','願意留下'];
  if (steps.some(function(step) { return allowedSteps.indexOf(step) < 0; })) throw new Error('五步驟標籤不正確');
  let id = String(data.id || '').trim(), row = 0, created = nowText_();
  if (id) {
    row = findIdRow_(logSheet, id, 1, 5);
    created = String(logSheet.getRange(row, 18).getDisplayValue() || created);
  } else {
    row = Math.max(logSheet.getLastRow() + 1, 5);
    id = nextId_(logSheet, 'CL-', 1, 5);
  }
  const today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
  const backfill = Math.floor((new Date(today + 'T00:00:00') - new Date(date + 'T00:00:00')) / 86400000) > 3 ? '是' : '否';
  const values = [[
    id, String(data.client || data['客戶'] || '阿默蛋糕'), date, unit, period,
    String(data.participants || data['參與人員'] || ''), topic, steps.join('｜'), topics.join('｜'),
    String(data.observation || data['現場觀察'] || ''), String(data.reason || data['背後原因'] || ''),
    String(data.method || data['我用的方法'] || ''), String(data.reaction || data['員工反應'] || ''),
    String(data.caseText || data['案例'] || ''), String(data.quote || data['金句'] || ''),
    String(data.memory || data['本次精選記憶點'] || ''), String(data.followup || data['下次追蹤'] || ''),
    created, nowText_(), backfill, email, '啟用'
  ]];
  logSheet.getRange(row, 1, 1, 22).setValues(values);
  rebuildCoachMaterials_(toolSheet, id, values[0], toolsParam_(data.toolsJson || data.tools));
  return id;
}

function rebuildCoachMaterials_(sheet, logId, log, tools) {
  const starMap = {}, lastRow = sheet.getLastRow();
  let nextNumber = 1;
  if (lastRow >= 5) {
    const rows = sheet.getRange(5, 1, lastRow - 4, 14).getDisplayValues();
    rows.forEach(function(row, index) {
      nextNumber = Math.max(nextNumber, (Number(String(row[0] || '').replace(/\D/g, '')) || 0) + 1);
      if (String(row[1]).trim() !== logId || String(row[13]).trim() === '已刪除') return;
      starMap[[row[5],row[6],row[7],row[8]].join('|')] = row[9] === '是' ? '是' : '否';
      sheet.getRange(index + 5, 14).setValue('已刪除');
    });
  }
  const client=log[1],date=log[2],unit=log[3],topic=log[6],steps=listParam_(log[7]),observation=log[9],reason=log[10],method=log[11],reaction=log[12],caseText=log[13],quote=log[14],memory=log[15],created=nowText_(),email=log[20];
  const rows=[];
  function add(step,type,name,content){content=String(content||'').trim();if(!content)return;const signature=[step,type,name,content].join('|'),materialId='CM-'+Utilities.formatString('%04d',nextNumber++);rows.push([materialId,logId,client,date,unit,step,type,name,content,starMap[signature]||'否',created,created,email,'啟用']);}
  steps.forEach(function(step){
    add(step,'常見問題',topic,[observation&&('現場觀察：'+observation),reason&&('背後原因：'+reason)].filter(Boolean).join('\n'));
    tools.forEach(function(tool){add(step,'工具',String(tool.name||'').trim()||'未命名工具',String(tool.steps||'').trim());});
    add(step,'案例',topic,[caseText&&('案例：'+caseText),memory&&('精選記憶點：'+memory)].filter(Boolean).join('\n'));
    add(step,'金句',topic,quote);
    add(step,'有效方法',topic,[method&&('方法：'+method),reaction&&('員工反應：'+reaction)].filter(Boolean).join('\n'));
  });
  if (rows.length) sheet.getRange(Math.max(sheet.getLastRow() + 1, 5), 1, rows.length, 14).setValues(rows);
}

function listParam_(value) {
  if (Array.isArray(value)) return value.map(String).map(function(item){return item.trim();}).filter(Boolean);
  const parsed = safeJson_(value, null);
  if (Array.isArray(parsed)) return parsed.map(String).map(function(item){return item.trim();}).filter(Boolean);
  return String(value || '').split(/[｜|、,]/).map(function(item){return item.trim();}).filter(Boolean);
}

function toolsParam_(value) {
  if (Array.isArray(value)) return value;
  const parsed = safeJson_(value, []);
  return Array.isArray(parsed) ? parsed : [];
}

function safeJson_(value, fallback) { try { return typeof value === 'string' ? JSON.parse(value) : value; } catch (error) { return fallback; } }
function nowText_() { return Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss'); }
function columnLetter_(number) { let value = '', current = number; while (current > 0) { current -= 1; value = String.fromCharCode(65 + current % 26) + value; current = Math.floor(current / 26); } return value; }

function appendNewTask_(spreadsheet, data) {
  const title = String(data.title || '').trim(), workstreamId = String(data.workstreamId || '').trim(), status = validTaskStatus_(data.status), importance = validImportance_(data.importance);
  if (!title || !workstreamId) throw new Error('請填寫待辦與工作線');
  const sheet = spreadsheet.getSheetByName('Tasks'), row = Math.max(sheet.getLastRow() + 1, 5), id = nextId_(sheet, 'T-', 1, 5), today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
  sheet.getRange(row, 1, 1, 11).setValues([[id, title, workstreamId, String(data.owner || '圈圈'), cleanDate_(data.due), status, String(data.next || ''), String(data.source || ''), today, status === '完成' ? today : '', importance]]);
  return id;
}

function validTaskStatus_(value) {
  const status = String(value || '未開始');
  if (['未開始', '進行中', '等待中', '完成'].indexOf(status) < 0) throw new Error('不允許的待辦狀態');
  return status;
}

function validImportance_(value) {
  const importance = String(value || '一般');
  if (['重要且緊急', '重要不緊急', '緊急不重要', '一般'].indexOf(importance) < 0) throw new Error('不允許的重要程度');
  return importance;
}

// 公開頁面的最佳努力同步；失敗時絕不覆寫已有數字。
function syncSocialMetrics() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const settings = settingsMap_(spreadsheet);
  const sheet = spreadsheet.getSheetByName('Metrics');
  const previous = latestMetricValues_(sheet);
  const sources = [
    { key: 'ig', label: 'IG', url: settings.Instagram網址 || 'https://www.instagram.com/hooo.image/', pattern: 'instagram' },
    { key: 'fb', label: 'FB', url: settings.Facebook網址 || 'https://www.facebook.com/hooo.image/', pattern: 'meta' },
    { key: 'threads', label: 'Threads', url: settings.Threads網址 || 'https://www.threads.com/@hooo.image?hl=zh-tw', pattern: 'meta' }
  ];
  const values = { ig: previous.ig, fb: previous.fb, threads: previous.threads };
  const messages = [];
  sources.forEach(source => {
    try {
      const response = UrlFetchApp.fetch(source.url, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131 Safari/537.36',
          'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8'
        }
      });
      if (response.getResponseCode() < 200 || response.getResponseCode() >= 400) throw new Error('HTTP ' + response.getResponseCode());
      const count = socialCountFromHtml_(response.getContentText(), source.pattern);
      if (!(count > 0)) throw new Error('找不到粉絲數');
      values[source.key] = count;
      messages.push(source.label + ' ' + count.toLocaleString('en-US'));
    } catch (error) {
      messages.push(source.label + ' 保留 ' + Number(values[source.key] || 0).toLocaleString('en-US'));
    }
  });
  const today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
  upsertSocialMetrics_(sheet, today, values, previous);
  const timestamp = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss');
  setSetting_(spreadsheet, '社群同步狀態', messages.join('｜'));
  setSetting_(spreadsheet, '社群最後同步', timestamp);
  return { ok: true, message: '社群數字已同步：' + messages.join('｜'), values: values, syncedAt: timestamp };
}

function installSocialSyncTrigger() {
  ScriptApp.getProjectTriggers().filter(trigger => trigger.getHandlerFunction() === 'syncSocialMetrics').forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('syncSocialMetrics').timeBased().atHour(8).everyDays(1).inTimezone('Asia/Taipei').create();
  return '已建立每日早上 8 點社群數字同步';
}

function socialCountFromHtml_(html, kind) {
  const text = decodeHtml_(String(html || ''));
  let match;
  if (kind === 'instagram') {
    match = text.match(/"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)/i) || text.match(/([\d,.]+\s*[KMB萬]?)\s+Followers/i);
  } else {
    match = text.match(/([\d,.]+\s*[KMB萬]?)\s*位粉絲/i) || text.match(/([\d,.]+\s*[KMB萬]?)\s+followers/i);
  }
  return match ? parseSocialNumber_(match[1]) : 0;
}

function decodeHtml_(text) {
  return text.replace(/&quot;|&#34;/g, '"').replace(/&amp;|&#38;/g, '&').replace(/&#x([0-9a-f]+);/gi, function(_, hex) { return String.fromCharCode(parseInt(hex, 16)); }).replace(/&#(\d+);/g, function(_, dec) { return String.fromCharCode(Number(dec)); });
}

function parseSocialNumber_(value) {
  const text = String(value || '').replace(/,/g, '').trim().toUpperCase();
  const number = parseFloat(text);
  if (!isFinite(number)) return 0;
  if (text.endsWith('萬')) return Math.round(number * 10000);
  if (text.endsWith('K')) return Math.round(number * 1000);
  if (text.endsWith('M')) return Math.round(number * 1000000);
  if (text.endsWith('B')) return Math.round(number * 1000000000);
  return Math.round(number);
}

function latestMetricValues_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 5) return { ig: 0, fb: 0, line: 0, registrations: 0, testimonials: 0, posts: 0, videos: 0, note: '', threads: 0 };
  const row = sheet.getRange(lastRow, 1, 1, 10).getValues()[0];
  return { ig: Number(row[1]) || 0, fb: Number(row[2]) || 0, line: Number(row[3]) || 0, registrations: Number(row[4]) || 0, testimonials: Number(row[5]) || 0, posts: Number(row[6]) || 0, videos: Number(row[7]) || 0, note: String(row[8] || ''), threads: Number(row[9]) || 0 };
}

function upsertSocialMetrics_(sheet, date, values, previous) {
  const lastRow = sheet.getLastRow();
  let row = 0;
  if (lastRow >= 5) {
    const dates = sheet.getRange(5, 1, lastRow - 4, 1).getDisplayValues();
    const index = dates.findIndex(item => String(item[0] || '').trim() === date);
    if (index >= 0) row = index + 5;
  }
  if (row) {
    sheet.getRange(row, 2).setValue(values.ig);
    sheet.getRange(row, 3).setValue(values.fb);
    sheet.getRange(row, 10).setValue(values.threads);
    return;
  }
  row = Math.max(lastRow + 1, 5);
  sheet.getRange(row, 1, 1, 10).setValues([[date, values.ig, values.fb, previous.line, previous.registrations, previous.testimonials, previous.posts, previous.videos, '社群公開頁面自動同步', values.threads]]);
}

function settingsMap_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Settings'), lastRow = sheet.getLastRow();
  const values = lastRow >= 5 ? sheet.getRange(5, 1, lastRow - 4, 2).getDisplayValues() : [];
  return Object.fromEntries(values.filter(row => row[0]).map(row => [String(row[0]).trim(), String(row[1] || '').trim()]));
}

function setSetting_(spreadsheet, key, value) {
  const sheet = spreadsheet.getSheetByName('Settings'), lastRow = sheet.getLastRow();
  const values = lastRow >= 5 ? sheet.getRange(5, 1, lastRow - 4, 1).getDisplayValues() : [];
  const index = values.findIndex(row => String(row[0] || '').trim() === key);
  const row = index >= 0 ? index + 5 : Math.max(lastRow + 1, 5);
  sheet.getRange(row, 1, 1, 2).setValues([[key, value]]);
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
