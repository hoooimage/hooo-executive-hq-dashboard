(function(){
  const STEPS=['被看見','被理解','被照顧','被交付','願意留下'];
  const DEFAULT_TOPICS=['接待','需求探詢','商品介紹','結帳與交付','客訴','儀態形象','主管帶教'];
  const DEFAULT_UNITS=['門市','工廠','總部','教育訓練'];
  const DRAFT_KEY='hooo-coach-draft-v1',UNITS_KEY='hooo-coach-units-v1',TOPICS_KEY='hooo-coach-topics-v1';
  const coach={loaded:false,loading:false,logs:[],materials:[],tab:'write',libraryStep:STEPS[0],pendingWrite:false,importRows:[]};
  const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
  const clean=value=>String(value??'').trim();
  const split=value=>clean(value).split(/[｜|、,]/).map(clean).filter(Boolean);
  const unique=values=>[...new Set(values.filter(Boolean))];
  const localToday=()=>new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Taipei'});
  const monthKey=value=>clean(value).slice(0,7);
  const html=value=>typeof esc==='function'?esc(value):clean(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function objects(values){if(!values?.length)return[];const [heads,...rows]=values;return rows.filter(row=>row.some(cell=>clean(cell))).map(row=>Object.fromEntries(heads.map((head,index)=>[clean(head),row[index]??''])));}
  function loadList(key,defaults){try{return unique([...defaults,...JSON.parse(localStorage.getItem(key)||'[]')]);}catch{return [...defaults];}}
  function saveList(key,values){try{localStorage.setItem(key,JSON.stringify(unique(values)));}catch{}}

  function authState(mode,message){const root=$('#coach-auth');if(!root)return;root.className=`coach-auth ${mode==='ready'?'is-ready':mode==='error'?'is-error':''}`;if(mode==='loading'){root.innerHTML=`<strong>${html(message||'正在讀取私人紀錄…')}</strong><span>會使用目前登入的 Google 帳號驗證。</span>`;return;}root.innerHTML=mode==='ready'?`<strong>私人紀錄已連線</strong><span>${html(message||'只有授權帳號能讀寫')}</span>`:`<div><strong>${html(message||'需要 Google 帳號授權')}</strong><span>請使用 hoooimage@gmail.com 或 viannieho@gmail.com。</span></div><a href="${html(WRITE_ENDPOINT)}?scope=coach" target="_blank" rel="noopener">開啟授權頁 ↗</a>`;}
  function loadPrivate(){
    if(coach.loading||!WRITE_ENDPOINT)return;coach.loading=true;authState('loading','正在讀取私人紀錄…');
    const previous=$('#hooo-coach-private-loader');previous?.remove();
    const script=document.createElement('script');script.id='hooo-coach-private-loader';script.src=`${WRITE_ENDPOINT}?scope=coach&callback=HOOOCoach.receive&t=${Date.now()}`;script.onerror=()=>{coach.loading=false;authState('error','尚未完成登入授權，或目前帳號無權限');};document.head.append(script);
    setTimeout(()=>{if(coach.loading){coach.loading=false;authState('error','私人資料讀取逾時，請先開啟授權頁');}},12000);
  }
  function receive(payload){
    coach.loading=false;
    if(!payload?.ok){authState('error',payload?.message||'目前帳號無法讀取陪跑紀錄');return;}
    coach.logs=objects(payload.sheets?.coachLogs?.values||[]).filter(item=>item['狀態']!=='已刪除');
    coach.materials=objects(payload.sheets?.coachTools?.values||[]).filter(item=>item['狀態']!=='已刪除');
    coach.loaded=true;authState('ready',`已同步 ${coach.logs.length} 筆紀錄`);populateSelectors();renderAll();
  }

  function renderChecks(){
    const topics=loadList(TOPICS_KEY,DEFAULT_TOPICS);
    $('#coach-step-checks').innerHTML=STEPS.map(item=>`<label><input type="checkbox" name="steps" value="${html(item)}"><span>${html(item)}</span></label>`).join('');
    $('#coach-topic-checks').innerHTML=topics.map(item=>`<label><input type="checkbox" name="topics" value="${html(item)}"><span>${html(item)}</span></label>`).join('');
  }
  function populateUnits(selected=''){
    const fromLogs=coach.logs.map(item=>item['單位']);const units=loadList(UNITS_KEY,DEFAULT_UNITS.concat(fromLogs));
    $('#coach-unit').innerHTML='<option value="">請選擇</option>'+units.map(item=>`<option ${item===selected?'selected':''}>${html(item)}</option>`).join('');
  }
  function populateSelectors(){
    const months=unique(coach.logs.map(item=>monthKey(item['陪跑日期']))).sort().reverse();if(!months.includes(monthKey(localToday())))months.unshift(monthKey(localToday()));
    const monthOptions='<option value="">全部月份</option>'+months.map(item=>`<option>${html(item)}</option>`).join('');
    $('#coach-filter-month').innerHTML=monthOptions;$('#coach-report-month').innerHTML=months.map(item=>`<option>${html(item)}</option>`).join('');
    const units=unique(coach.logs.map(item=>item['單位'])).sort();$('#coach-filter-unit').innerHTML='<option value="">全部單位</option>'+units.map(item=>`<option>${html(item)}</option>`).join('');
    $('#coach-filter-step').innerHTML='<option value="">全部步驟</option>'+STEPS.map(item=>`<option>${html(item)}</option>`).join('');
    populateUnits($('#coach-unit')?.value||'');renderLibrarySteps();
  }
  function renderStats(){
    const thisMonth=monthKey(localToday()),sessions=new Set(coach.logs.filter(item=>monthKey(item['陪跑日期'])===thisMonth).map(item=>`${item['陪跑日期']}|${item['單位']}`));
    const tools=coach.materials.filter(item=>item['素材類型']==='工具').length,cases=coach.materials.filter(item=>item['素材類型']==='案例').length;
    $('#coach-stats').innerHTML=`<article><strong>${sessions.size}</strong><span>本月陪跑</span></article><article><strong>${tools}</strong><span>累計工具</span></article><article><strong>${cases}</strong><span>累計案例</span></article>`;
  }
  function renderAll(){renderStats();renderOverview();renderLibrary();renderReport();updateLastFollowup();}

  function addToolRow(tool={}){const row=document.createElement('div');row.className='coach-tool-row';row.innerHTML=`<input class="coach-tool-name" placeholder="工具名稱，例如：三句接待話" value="${html(tool.name||'')}"><textarea class="coach-tool-steps" rows="2" placeholder="步驟 1、2、3">${html(tool.steps||'')}</textarea><button type="button" aria-label="移除工具">×</button>`;row.querySelector('button').addEventListener('click',()=>{row.remove();saveDraft();});row.addEventListener('input',saveDraft);$('#coach-tool-rows').append(row);}
  function selected(name){return $$(`#coach-form input[name="${name}"]:checked`).map(item=>item.value);}
  function toolsFromForm(){return $$('.coach-tool-row').map(row=>({name:clean(row.querySelector('.coach-tool-name').value),steps:clean(row.querySelector('.coach-tool-steps').value)})).filter(item=>item.name||item.steps);}
  function draftObject(){const form=$('#coach-form'),data=Object.fromEntries(new FormData(form).entries());data.steps=selected('steps');data.topics=selected('topics');data.tools=toolsFromForm();return data;}
  function saveDraft(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(draftObject()));$('#coach-draft-status').textContent=`草稿已暫存 ${new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}`;}catch{}}
  function clearDraft(){try{localStorage.removeItem(DRAFT_KEY);}catch{}$('#coach-draft-status').textContent='草稿會自動儲存';}
  function setChecks(name,values){const set=new Set(values||[]);$$(`#coach-form input[name="${name}"]`).forEach(input=>input.checked=set.has(input.value));}
  function fillForm(data={},restore=false){
    const form=$('#coach-form');form.reset();renderChecks();populateUnits(data.unit||data['單位']||'');
    form.elements.id.value=data.id||'';form.elements.client.value=data.client||data['客戶']||'阿默蛋糕';form.elements.date.value=data.date||data['陪跑日期']||localToday();form.elements.unit.value=data.unit||data['單位']||'';form.elements.period.value=data.period||data['時段']||'全天';form.elements.participants.value=data.participants||data['參與人員']||'';form.elements.topic.value=data.topic||data['本次主題']||'';
    form.elements.observation.value=data.observation||data['現場觀察']||'';form.elements.reason.value=data.reason||data['背後原因']||'';form.elements.method.value=data.method||data['我用的方法']||'';form.elements.reaction.value=data.reaction||data['員工反應']||'';form.elements.caseText.value=data.caseText||data['案例']||'';form.elements.quote.value=data.quote||data['金句']||'';form.elements.memory.value=data.memory||data['本次精選記憶點']||'';form.elements.followup.value=data.followup||data['下次追蹤']||'';
    setChecks('steps',Array.isArray(data.steps)?data.steps:split(data['五步驟標籤']));setChecks('topics',Array.isArray(data.topics)?data.topics:split(data['主題標籤']));
    $('#coach-tool-rows').innerHTML='';const logId=data.id||data['id'];const tools=data.tools||(logId?uniqueToolsForLog(logId):[]);(tools.length?tools:[{}]).forEach(addToolRow);
    $('#coach-form-title').textContent=logId?'編輯陪跑紀錄':'記錄本次陪跑';$('#coach-save').textContent=logId?'儲存修改':'儲存陪跑紀錄';if(!restore)window.scrollTo({top:0,behavior:'smooth'});updateLastFollowup();
  }
  function restoreDraft(){try{const raw=localStorage.getItem(DRAFT_KEY);if(raw){fillForm(JSON.parse(raw),true);$('#coach-draft-status').textContent='已還原上次未完成草稿';return true;}}catch{}return false;}
  function startNew(){open();setTab('write');fillForm({},true);restoreDraft();}
  function uniqueToolsForLog(logId){const seen=new Set();return coach.materials.filter(item=>item['紀錄 id']===logId&&item['素材類型']==='工具').filter(item=>{const key=`${item['素材名稱']}|${item['素材內容']}`;if(seen.has(key))return false;seen.add(key);return true;}).map(item=>({name:item['素材名稱'],steps:item['素材內容']}));}
  function updateLastFollowup(){
    const unit=$('#coach-unit')?.value,currentId=$('#coach-form')?.elements.id.value,box=$('#coach-last-followup');if(!unit||!box){if(box)box.hidden=true;return;}
    const previous=coach.logs.filter(item=>item['單位']===unit&&item.id!==currentId&&clean(item['下次追蹤'])).sort((a,b)=>clean(b['陪跑日期']).localeCompare(clean(a['陪跑日期'])))[0];
    box.hidden=!previous;if(previous)box.innerHTML=`<strong>上次追蹤｜${html(previous['陪跑日期'])}・${html(unit)}</strong><p>${html(previous['下次追蹤'])}</p>`;
  }

  function submitLog(event){
    event.preventDefault();const form=event.currentTarget,steps=selected('steps');if(!steps.length){showToast('請至少選一個五步驟標籤',false);return;}
    const params=Object.fromEntries(new FormData(form).entries());params.action='coachSave';params.stepsJson=JSON.stringify(steps);params.topicsJson=JSON.stringify(selected('topics'));params.toolsJson=JSON.stringify(toolsFromForm());
    if(!params.id){const duplicate=coach.logs.find(item=>item['陪跑日期']===params.date&&item['單位']===params.unit);if(duplicate&&confirm('這天這個單位已有紀錄。按「確定」編輯原本紀錄；按「取消」仍新增一筆。'))params.id=duplicate.id;}
    if(postForm(params)){coach.pendingWrite=true;clearDraft();showToast('正在安全儲存陪跑紀錄…');}
  }

  function recordMatches(item){const month=$('#coach-filter-month').value,unit=$('#coach-filter-unit').value,step=$('#coach-filter-step').value,backfill=$('#coach-filter-backfill').value,q=clean($('#coach-filter-search').value).toLowerCase();if(month&&monthKey(item['陪跑日期'])!==month)return false;if(unit&&item['單位']!==unit)return false;if(step&&!split(item['五步驟標籤']).includes(step))return false;if(backfill&&item['是否補登']!==backfill)return false;if(q&&!Object.values(item).join(' ').toLowerCase().includes(q))return false;return true;}
  function recordCard(item){const mats=coach.materials.filter(material=>material['紀錄 id']===item.id),types=new Set(mats.map(x=>x['素材類型']));const content=[['現場觀察',item['現場觀察']],['背後原因',item['背後原因']],['我用的方法',item['我用的方法']],['員工反應',item['員工反應']],['案例',item['案例']],['金句',item['金句']],['精選記憶點',item['本次精選記憶點']],['下次追蹤',item['下次追蹤']]].filter(row=>clean(row[1]));return `<article class="coach-record" id="coach-record-${html(item.id)}"><header><div><time>${html(item['陪跑日期'])}・${html(item['單位'])}・${html(item['時段'])}</time><h3>${html(item['本次主題'])}</h3></div><div class="coach-record-flags">${item['是否補登']==='是'?'<span>補登</span>':''}${types.has('工具')?'<span>工具</span>':''}${types.has('案例')?'<span>案例</span>':''}${types.has('金句')?'<span>金句</span>':''}</div></header><div class="coach-record-tags">${split(item['五步驟標籤']).map(x=>`<span>${html(x)}</span>`).join('')}${split(item['主題標籤']).map(x=>`<span>${html(x)}</span>`).join('')}</div><details><summary>查看完整紀錄</summary><div class="coach-record-body">${content.map(([key,value])=>`<article><b>${key}</b><p>${html(value)}</p></article>`).join('')||'<p>本筆只有基本資料。</p>'}</div></details><div class="coach-record-actions"><button class="coach-secondary" type="button" data-coach-edit="${html(item.id)}">編輯</button><button class="coach-danger" type="button" data-coach-delete="${html(item.id)}">移除紀錄</button></div></article>`;}
  function renderOverview(){if(!coach.loaded){$('#coach-record-list').innerHTML='<div class="coach-empty">完成 Google 帳號授權後，這裡才會顯示私人紀錄。</div>';return;}const rows=coach.logs.filter(recordMatches).sort((a,b)=>`${b['陪跑日期']}|${b['單位']}`.localeCompare(`${a['陪跑日期']}|${a['單位']}`));if(!rows.length){$('#coach-record-list').innerHTML='<div class="coach-empty">目前沒有符合條件的紀錄。</div>';return;}const byDate=rows.reduce((groups,item)=>{(groups[item['陪跑日期']]??=[]).push(item);return groups;},{});$('#coach-record-list').innerHTML=Object.entries(byDate).map(([date,items])=>`<section class="coach-day-group"><h3>${html(date)}</h3><div>${items.map(recordCard).join('')}</div></section>`).join('');}

  function renderLibrarySteps(){$('#coach-library-steps').innerHTML=STEPS.map(step=>`<button class="${step===coach.libraryStep?'active':''}" type="button" data-library-step="${html(step)}">${html(step)}</button>`).join('');}
  function renderLibrary(){renderLibrarySteps();if(!coach.loaded){$('#coach-library').innerHTML='<div class="coach-empty">授權後才會載入教材素材。</div>';return;}const starOnly=$('#coach-star-only').checked,types=['常見問題','工具','案例','金句','有效方法'];const rows=coach.materials.filter(item=>split(item['五步驟標籤']).includes(coach.libraryStep)&&(!starOnly||item['收進教材']==='是'));$('#coach-library').innerHTML=types.map(type=>{const items=rows.filter(item=>item['素材類型']===type);return `<section class="coach-material-section"><h3>${type}</h3>${items.length?items.map(item=>`<article class="coach-material"><div><strong>${html(item['素材名稱']||type)}</strong><p>${html(item['素材內容'])}</p><small>${html(item['陪跑日期'])}・${html(item['單位'])}｜<button class="coach-link" type="button" data-coach-record="${html(item['紀錄 id'])}">原始紀錄</button></small></div><button class="coach-star ${item['收進教材']==='是'?'on':''}" type="button" data-coach-star="${html(item.id)}" data-starred="${item['收進教材']==='是'?'yes':'no'}" aria-label="收進教材">★</button></article>`).join(''):'<p class="coach-empty">尚未累積這類素材。</p>'}</section>`;}).join('');}

  function reportMarkdown(month){const logs=coach.logs.filter(item=>monthKey(item['陪跑日期'])===month).sort((a,b)=>`${a['陪跑日期']}|${a['單位']}`.localeCompare(`${b['陪跑日期']}|${b['單位']}`)),sessions=new Set(logs.map(item=>`${item['陪跑日期']}|${item['單位']}`)),units={};logs.forEach(item=>units[item['單位']]=(units[item['單位']]||new Set()).add(`${item['陪跑日期']}|${item['單位']}`));const lines=[`# ${month} 阿默顧問陪跑月報`,'',`本月陪跑：${sessions.size} 次`,`日期：${unique(logs.map(item=>item['陪跑日期'])).join('、')||'無'}`,'', '## 各單位陪跑次數',...Object.entries(units).map(([unit,set])=>`- ${unit}：${set.size} 次`)];STEPS.forEach(step=>{lines.push('',`## ${step}`);['常見問題','工具','案例','金句'].forEach(type=>{const items=coach.materials.filter(item=>monthKey(item['陪跑日期'])===month&&split(item['五步驟標籤']).includes(step)&&item['素材類型']===type);lines.push('',`### ${type}`,...(items.length?items.map(item=>`- ${item['素材名稱']?item['素材名稱']+'：':''}${item['素材內容']}`):['- 尚無']));});});const followups=logs.filter(item=>clean(item['下次追蹤']));lines.push('','## 未完成的下次追蹤',...(followups.length?followups.map(item=>`- ${item['陪跑日期']}｜${item['單位']}：${item['下次追蹤']}`):['- 無']));return lines.join('\n');}
  function renderReport(){const month=$('#coach-report-month').value||monthKey(localToday());if($('#coach-report-month').value!==month&&[...$('#coach-report-month').options].some(o=>o.value===month))$('#coach-report-month').value=month;$('#coach-report-text').value=coach.loaded?reportMarkdown(month):'完成 Google 帳號授權後，這裡會產生月報。';}

  function setTab(tab){coach.tab=tab;$$('[data-coach-tab]').forEach(button=>button.classList.toggle('active',button.dataset.coachTab===tab));$$('[data-coach-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.coachPanel===tab));if(tab==='overview')renderOverview();if(tab==='library')renderLibrary();if(tab==='report')renderReport();}
  function editRecord(id){const item=coach.logs.find(row=>row.id===id);if(!item)return;setTab('write');fillForm(item);clearDraft();}
  function deleteRecord(id){if(!confirm('要把這筆紀錄移出總覽嗎？資料會保留在試算表，不會永久刪除。'))return;if(postForm({action:'coachDelete',id})){coach.pendingWrite=true;showToast('正在移除紀錄…');}}
  function starMaterial(id,starred){if(postForm({action:'coachStar',id,starred:starred?'否':'是'})){coach.pendingWrite=true;showToast(starred?'已取消收進教材':'已標記收進教材');}}
  function jumpRecord(id){setTab('overview');setTimeout(()=>{$(`#coach-record-${CSS.escape(id)}`)?.scrollIntoView({behavior:'smooth',block:'start'});$(`#coach-record-${CSS.escape(id)} details`)?.setAttribute('open','');},50);}

  function csvEscape(value){const text=clean(value);return /[",\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
  const CSV_HEADERS=['客戶','陪跑日期','單位','時段','參與人員','本次主題','五步驟標籤','主題標籤','現場觀察','背後原因','我用的方法','員工反應','可複製工具','案例','金句','本次精選記憶點','下次追蹤'];
  function download(name,text,type='text/csv;charset=utf-8'){const blob=new Blob(['\ufeff'+text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function exportAll(){const rows=coach.logs.sort((a,b)=>clean(a['陪跑日期']).localeCompare(clean(b['陪跑日期']))).map(item=>[item['客戶'],item['陪跑日期'],item['單位'],item['時段'],item['參與人員'],item['本次主題'],item['五步驟標籤'],item['主題標籤'],item['現場觀察'],item['背後原因'],item['我用的方法'],item['員工反應'],uniqueToolsForLog(item.id).map(tool=>`${tool.name}：${tool.steps}`).join('｜'),item['案例'],item['金句'],item['本次精選記憶點'],item['下次追蹤']]);download(`陪跑紀錄-${localToday()}.csv`,[CSV_HEADERS,...rows].map(row=>row.map(csvEscape).join(',')).join('\n'));}
  function parseCSV(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const char=text[i],next=text[i+1];if(char==='"'&&quoted&&next==='"'){cell+='"';i++;}else if(char==='"'){quoted=!quoted;}else if(char===','&&!quoted){row.push(cell);cell='';}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i++;row.push(cell);if(row.some(v=>clean(v)))rows.push(row);row=[];cell='';}else cell+=char;}row.push(cell);if(row.some(v=>clean(v)))rows.push(row);return rows;}
  function previewImport(){const rows=parseCSV($('#coach-csv-text').value);if(rows.length<2){showToast('請貼上含標題列與資料的 CSV',false);return;}const headers=rows[0].map(clean);coach.importRows=rows.slice(1).map(row=>Object.fromEntries(headers.map((head,index)=>[head,clean(row[index])])));$('#coach-import-preview').innerHTML=`<table><thead><tr><th>日期</th><th>單位</th><th>主題</th><th>五步驟</th></tr></thead><tbody>${coach.importRows.map(item=>`<tr><td>${html(item['陪跑日期']||item['日期'])}</td><td>${html(item['單位'])}</td><td>${html(item['本次主題'])}</td><td>${html(item['五步驟標籤'])}</td></tr>`).join('')}</tbody></table>`;$('#coach-confirm-import').disabled=!coach.importRows.length;}
  function importRecords(event){event.preventDefault();if(!coach.importRows.length)return;const records=coach.importRows.map(item=>({client:item['客戶']||'阿默蛋糕',date:item['陪跑日期']||item['日期'],unit:item['單位'],period:item['時段']||'全天',participants:item['參與人員']||'',topic:item['本次主題'],steps:split(item['五步驟標籤']),topics:split(item['主題標籤']),observation:item['現場觀察']||'',reason:item['背後原因']||'',method:item['我用的方法']||'',reaction:item['員工反應']||'',tools:clean(item['可複製工具']).split('｜').filter(Boolean).map(text=>{const [name,...parts]=text.split('：');return{name:clean(name),steps:clean(parts.join('：'))};}),caseText:item['案例']||'',quote:item['金句']||'',memory:item['本次精選記憶點']||'',followup:item['下次追蹤']||''}));if(postForm({action:'coachImport',recordsJson:JSON.stringify(records)})){coach.pendingWrite=true;$('#coach-import-dialog').close();showToast(`正在匯入 ${records.length} 筆紀錄…`);}}

  function init(){
    renderChecks();populateUnits();fillForm({},true);restoreDraft();populateSelectors();renderAll();
    $('#coach-form').addEventListener('input',saveDraft);$('#coach-form').addEventListener('change',event=>{saveDraft();if(event.target.name==='unit')updateLastFollowup();});$('#coach-form').addEventListener('submit',submitLog);
    $('#coach-add-tool').addEventListener('click',()=>addToolRow());$('#coach-clear-draft').addEventListener('click',()=>{clearDraft();fillForm({},true);});
    $('#coach-add-unit').addEventListener('click',()=>{const value=clean(prompt('新增單位名稱'));if(!value)return;const values=loadList(UNITS_KEY,DEFAULT_UNITS);values.push(value);saveList(UNITS_KEY,values);populateUnits(value);saveDraft();updateLastFollowup();});
    $('#coach-add-topic').addEventListener('click',()=>{const value=clean(prompt('新增主題標籤'));if(!value)return;const current=selected('topics'),values=loadList(TOPICS_KEY,DEFAULT_TOPICS);values.push(value);saveList(TOPICS_KEY,values);renderChecks();setChecks('topics',[...current,value]);saveDraft();});
    ['coach-filter-month','coach-filter-unit','coach-filter-step','coach-filter-backfill'].forEach(id=>$(`#${id}`).addEventListener('change',renderOverview));$('#coach-filter-search').addEventListener('input',renderOverview);$('#coach-star-only').addEventListener('change',renderLibrary);$('#coach-report-month').addEventListener('change',renderReport);
    $('#coach-copy-report').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#coach-report-text').value);showToast('月報已複製');}catch{showToast('無法使用剪貼簿，請手動選取文字',false);}});$('#coach-export-report').addEventListener('click',()=>download(`陪跑月報-${$('#coach-report-month').value}.md`,$('#coach-report-text').value,'text/markdown;charset=utf-8'));
    $('#coach-export-all').addEventListener('click',exportAll);$('#coach-template-download').addEventListener('click',()=>download('陪跑紀錄匯入範本.csv',CSV_HEADERS.join(',')));
    $('#coach-import-open').addEventListener('click',()=>{$('#coach-import-form').reset();coach.importRows=[];$('#coach-import-preview').innerHTML='';$('#coach-confirm-import').disabled=true;$('#coach-import-dialog').showModal();});$('#coach-preview-import').addEventListener('click',previewImport);$('#coach-import-form').addEventListener('submit',importRecords);$('#coach-csv-file').addEventListener('change',event=>{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{$('#coach-csv-text').value=reader.result;previewImport();};reader.readAsText(file);});
    document.addEventListener('click',event=>{const tab=event.target.closest('[data-coach-tab]');if(tab)setTab(tab.dataset.coachTab);const step=event.target.closest('[data-library-step]');if(step){coach.libraryStep=step.dataset.libraryStep;renderLibrary();}const edit=event.target.closest('[data-coach-edit]');if(edit)editRecord(edit.dataset.coachEdit);const del=event.target.closest('[data-coach-delete]');if(del)deleteRecord(del.dataset.coachDelete);const star=event.target.closest('[data-coach-star]');if(star)starMaterial(star.dataset.coachStar,star.dataset.starred==='yes');const record=event.target.closest('[data-coach-record]');if(record)jumpRecord(record.dataset.coachRecord);const nav=event.target.closest('[data-view="coach"]');if(nav)open();});
    window.addEventListener('message',event=>{if(event.data?.source!=='hooo-hq'||!coach.pendingWrite)return;coach.pendingWrite=false;if(event.data.payload?.ok){setTimeout(loadPrivate,1000);}});
  }
  function open(){if(!coach.loaded)loadPrivate();}
  window.HOOOCoach={receive,open,startNew};
  document.addEventListener('DOMContentLoaded',init);
})();
