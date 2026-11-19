const now = new Date();
const state = { data:null, goals:[], brandFoundation:[], operatingMap:[], inbox:[], daily:[], tasks:[], progress:[], decisions:[], meetings:[], services:[], income:[], expenses:[], costCategories:[], strategies:[], funnels:[], settings:[], workstreams:[], tasksNew:[], decisionsNew:[], events:[], metrics:[], docs:[], syncing:false, project:'', serviceCategory:'', funnelService:'SVC-004', goalLevel:'2026建置目標', workGoal:'', workCategory:'', taskWorkstream:'', taskStatus:'', taskPriority:'', taskDeadline:'all', calendarMode:'list', calendarMonth:new Date(now.getFullYear(),now.getMonth(),1), financeMode:'month', financeYear:now.getFullYear(), financeMonth:now.getMonth()+1 };
const LIVE_ENDPOINT = String(window.HOOO_DATA_ENDPOINT || '').trim();
const WRITE_ENDPOINT = String(window.HOOO_WRITE_ENDPOINT || '').trim();

const seed = {
  goals: [
    ['目標ID','期間','公司目標','衡量方式','目前進度','狀態','主責','檢視日','備註'],
    ['G-001','未來90天','完成公勝保經免費示範，並驗證首家付費講座','免費場完成；至少1家以500元／人、約20人付費成交','商業模型已確認，待課程內容與場次落地','進行中','Alex / Sophie / Daniel','2027-02-15','第一優先'],
    ['G-002','未來6個月','完成3家付費企業／團隊講座合作','3家付費合作；每場目標約20人、營收約10,000元','0／3家','進行中','Alex / Sophie','2027-05-17',''],
    ['G-003','持續營運','所有正式討論都有決策、任務與進度承接','正式項目100%有ID、負責人、期限與最新進度','HQ已啟用；新版Dashboard重整中','進行中','Daniel','2026-11-27','']
  ],
  daily: [
    ['日期','主管','角色','今日最重要事項','目前進展','需要CEO確認','主管建議','狀態','相關任務ID'],
    ['2026-11-17','Alex','CSO','把CEO想法整理為2027量化成果與2026建置順序','已確認2027每月營收20萬、每月4位形象顧問客戶、大型企業合作與季度輕量企業案','北極星仍需再討論，不先把營收或粉絲直接當北極星','2026先把能賣、能交付、能追蹤的系統建好；2027再追穩定成長','進行中','T-002,T-023,T-024,T-029'],
    ['2026-11-17','Sophie','CGO','把2027粉絲與客戶目標拆成可追蹤的成長路徑','IG與Facebook各2,000的年度目標已確認；下一步盤點目前基準與內容節奏','需要目前IG、Facebook粉絲數、過去發文頻率與可持續產能','粉絲要與詢問、名單及付費轉換一起追，避免只累積表面數字','進行中','T-003,T-021,T-023'],
    ['2026-11-17','Daniel','COO','啟動AMO陪跑內容模組化的製作與驗收排程','已找到現有AMO資料並拆成主專案、六個子任務及年底里程碑','需要確認AMO案例對外匿名與授權方式','先用現有資料完成第一版，再透過試教修訂，不等待所有內容一次完美','進行中','T-017,T-023,T-025,T-026,T-027,T-028']
  ],
  services: [
    ['服務ID','類別','服務名稱','官網定位／內容','標準價格','計價單位','官網連結','狀態','備註'],
    ['SVC-001','個人形象','個人色彩形象規劃','色彩、身形、風格與情境應用策略','9800','每人／3小時','https://hoooimage.com/','販售中',''],
    ['SVC-002','個人形象','完整形象實戰方案','兩天實體＋90分鐘線上解讀','16800','每人／方案','https://hoooimage.com/','販售中',''],
    ['SVC-003','主題講座','商務形象溝通力 H.O.O.O 工作坊','角色覺察、形象優化、實境操作與成果展現','','依案洽談','https://hoooimage.com/','販售中',''],
    ['SVC-004','主題講座','客戶信任競爭力：業務菁英實戰課','圈圈與 Jeffery 共同授課的2小時團隊講座','500','每人；20人約10,000元','https://hoooimage.com/business-elite-trust','試辦中','公勝首場免費'],
    ['SVC-005','企業顧問','現場觀察與診斷','觀察門市與服務流程，找出關鍵環節','','依案洽談','https://hoooimage.com/','販售中',''],
    ['SVC-006','企業顧問','員工形象與接待訓練','形象、接待、需求探詢與價值說明實作','','依案洽談','https://hoooimage.com/','販售中',''],
    ['SVC-007','企業顧問','主管帶教與陪跑','建立主管帶教與回饋機制','','依案洽談','https://hoooimage.com/','販售中',''],
    ['SVC-008','甜甜圈高球','新手活動體驗','小團體高球體驗與人脈交流','1280','每人／活動','https://hoooimage.com/','販售中',''],
    ['SVC-009','甜甜圈高球','商務高爾夫初階團班','10堂、每堂2小時，4–8人小班','18800','每人／10堂','https://hoooimage.com/','預售中',''],
    ['SVC-010','企業培訓','好圈圈款待力模組課程','把依賴個人熱忱的好服務，變成全門市可學、可做、可帶、可追蹤的款待系統','','2小時體驗／6模組／90天陪跑','','開發中','首版鎖定有實體門市、需要第一線服務一致性的連鎖企業']
  ],
  income: [
    ['收入ID','日期','客戶','專案','服務ID','服務項目','數量','單價','應收金額','已收金額','未收金額','收款方式','發票狀態','收款狀態','負責人','相關任務ID','備註'],
    ['I-001','2026-11-17','公勝保經','業務菁英2小時講座｜免費示範場','SVC-004','客戶信任競爭力：業務菁英實戰課','1','0','0','0','0','—','不開立','免費合作','CEO / Jeffery','T-009,T-014','2小時市場驗證']
  ],
  expenses: [
    ['支出ID','日期','專案','成本屬性','費用類別','支出項目','供應商／收款人','數量','單價','應付金額','已付金額','未付金額','付款方式','憑證狀態','付款狀態','負責人','相關任務ID','備註']
  ],
  costCategories: [
    ['類別ID','成本屬性','費用類別','狀態','備註'],
    ['C-001','固定成本','房租','啟用','每月固定租金'],['C-002','固定成本','網路費','啟用','固定月租或專線'],['C-003','固定成本','電話／通訊基本費','啟用','固定月租'],['C-004','固定成本','軟體／工具訂閱','啟用','固定週期訂閱'],['C-005','固定成本','保險費','啟用','固定保費'],['C-006','固定成本','會計／記帳費','啟用','固定委外費'],['C-007','固定成本','固定薪資','啟用','固定人事成本'],
    ['C-008','變動成本','水費','啟用','依使用量變動'],['C-009','變動成本','電費','啟用','依使用量變動'],['C-010','變動成本','瓦斯費','啟用','依使用量變動'],['C-011','變動成本','講師費','啟用','依場次或專案'],['C-012','變動成本','場地費','啟用','依活動或專案'],['C-013','變動成本','交通費','啟用','依行程'],['C-014','變動成本','行銷費','啟用','依活動'],['C-015','變動成本','廣告費','啟用','依投放'],['C-016','變動成本','設計製作','啟用','依專案'],['C-017','變動成本','印刷製作','啟用','依數量'],['C-018','變動成本','服裝材料','啟用','依採購'],['C-019','變動成本','佣金／分潤','啟用','依營收或合作'],['C-020','變動成本','餐飲費','啟用','依活動或會議'],['C-021','變動成本','運費','啟用','依寄送'],['C-022','變動成本','臨時人力','啟用','依活動或專案'],['C-023','變動成本','教材／物料','啟用','依活動或專案'],['C-024','變動成本','行政雜支','啟用','依實際發生'],['C-025','變動成本','其他','啟用','未分類支出']
  ],
  strategies: [
    ['策略ID','策略層級','策略主題','服務／產品','優先客群','核心價值','商務模式','90天成果','30天小目標','核心指標','優先級','主責','狀態','待CEO確認'],
    ['ST-001','公司級主戰場','以業務菁英2小時講座打開B2B入口','SVC-004','保險通訊處、房仲、金融顧問、高端服務與B2B業務團隊','用形象與溝通提升客戶信任，主辦門檻低且可一次接觸多人','公勝免費案例→每人500元、約20人付費場→半年3家','完成公勝示範並確認首家付費場','確認公勝日期與分工；完成30位主辦人名單、3次洽談、1份報價','免費場1、付費場1、有效主辦人30、洽談3','P0','Alex / Sophie','進行中','課程內容、交通場地、開票與人數規則'],
    ['ST-002','營收延伸','講座後端轉換為個人形象服務','SVC-001 / SVC-002','講座中有個人形象需求的業務與主管','把團隊講座的共鳴轉為個人化診斷與可執行形象方案','講座名單同意分流→個人諮詢→9,800或16,800方案','建立同意機制並完成首批3次個人諮詢','完成興趣勾選、15分鐘諮詢腳本與兩個方案說明','興趣名單率、諮詢預約率、個人服務成交數','P0','Alex / Sophie','草案','課後優惠與聯繫責任'],
    ['ST-003','異業合作','與IMAGESUIT建立西服合作承接','SVC-004＋西服方案','講座中有商務服裝需求者','形象策略與西服實作形成完整商務信任方案','明確同意後轉介；合作方式待定','完成合作規則並驗證1筆有效轉介','確認名單界線、聯繫責任、報價、收款與分潤方式','有效轉介數、到店率、成交數、合作毛利','P0','Alex / CEO / Jeffery','待CEO確認','優惠、轉介或分潤模式'],
    ['ST-004','B2C產品階梯','個人色彩診斷升級完整形象實戰','SVC-001→SVC-002','轉職、升遷或個人品牌客戶','先用明確診斷降低決策門檻，再升級完整實戰','9,800入門診斷→16,800完整方案→轉介紹','建立穩定每月個人服務成交路徑','完成案例素材、諮詢流程與升級說明；取得4次諮詢','有效詢問、諮詢數、SVC-001成交、升級率','P1','Alex / Sophie','草案','每月成交目標與可投入時段'],
    ['ST-005','B2B產品階梯','企業顧問由診斷走向訓練與主管陪跑','SVC-005→SVC-006→SVC-007','門市、專業服務與高接觸企業','先找問題、再訓練、最後用主管機制確保改變持續','現場診斷→員工訓練→月度主管陪跑','完成1家企業診斷或正式提案','建立一頁式企業階梯、10家名單、3次訪談、1份提案','企業名單、訪談、提案、診斷成交、續約率','P1','Alex / Sophie','草案','企業顧問定價與交付邊界'],
    ['ST-006','社群產品階梯','甜甜圈高球由體驗導入初階團班','SVC-008→SVC-009','想學高球與拓展商務人脈的新手','用輕鬆體驗降低入門焦慮，再承接系統課程與社群','1,280體驗→18,800十堂團班→社群活動','完成一場體驗並累積首班4名預售','建立30位名單、12人報名體驗、8人到場、4人預售','名單、報名、到場、團班預售、每位獲客成本','P2','Alex / Sophie','草案','活動日期、教練容量與開班條件'],
    ['ST-007','營運基礎','HQ管理決策、Idealflow管理客戶漏斗','全服務','內部團隊與所有客戶機會','每個策略、名單、任務與收支只有一個正式主檔','HQ追蹤目標任務損益；Idealflow追蹤名單與自動跟進','正式專案100%有任務、進度與收支承接','完成漏斗欄位、資料責任與每週檢視節奏','資料完整率、漏斗更新率、逾期任務、收支完整率','P0','Alex / Sophie / Daniel','進行中','Idealflow帳號與串接權限'],
    ['ST-008','產品化主戰場','把AMO陪跑內容轉成可複製的款待模組課程','SVC-010','有實體門市、需要第一線服務一致性的連鎖企業','把依賴個人熱忱的好服務，變成全門市可學、可做、可帶、可追蹤的款待系統','2小時體驗→6模組正式課→90天陪跑；80%標準核心＋20%企業客製','完成六模組、試教驗證與企業銷售包','定義核心定位、六模組架構、教材與驗收方式','完成模組數、工具數、試教回饋、企業提案數','P0','Alex / Sophie / Daniel','進行中','AMO案例對外匿名與授權方式']
  ],
  funnels: [
    ['漏斗ID','服務ID','類別','服務名稱','主要客群','觸及渠道','名單誘因','有效名單條件','洽談／體驗','成交CTA','後端承接','30天觸及目標','30天有效名單','30天洽談／體驗','30天成交','主責','狀態','備註'],
    ['F-001','SVC-001','個人形象','個人色彩形象規劃','轉職、升遷、個人品牌與專業服務工作者','官網、社群案例、講座名單、舊客轉介紹','專業形象自評表／15分鐘需求釐清','有具體場合、時間與改善需求','20分鐘諮詢','預約並支付9,800元','SVC-002完整形象方案／西服合作','2,000人次','12','4','2','Sophie','草案','先用既有案例驗證'],
    ['F-002','SVC-002','個人形象','完整形象實戰方案','已有明確改造需求、重視內外一致與落地者','SVC-001客戶、深度案例、講座高意願名單','完整形象需求盤點／成果案例','願意投入兩天實體與線上解讀','30分鐘方案說明','預約並支付16,800元','衣櫥／採購陪同、西服合作','1,000人次','8','3','1','Sophie','草案','以SVC-001升級為主'],
    ['F-003','SVC-003','主題講座','商務形象溝通力 H.O.O.O 工作坊','中高階主管、講師、專業人士與企業主辦人','商協會、企業HR、講師社群、合作夥伴轉介','一頁式工作坊介紹／主辦方需求清單','可決定或影響團體活動安排','30分鐘主辦方需求會談','提供客製報價與場次','SVC-001／SVC-002／企業診斷','10個主辦單位','5','3','1份提案','Sophie','草案','價格依案洽談'],
    ['F-004','SVC-004','主題講座','客戶信任競爭力：業務菁英實戰課','保險、房仲、金融顧問、高端服務與B2B業務團隊','主管轉介、既有人脈、主辦方名單、課程頁','公勝案例／2小時團隊合作說明','能安排15至30人並決定活動的主辦人','15至30分鐘需求洽談','公勝免費示範；其後每人500元、20人約10,000元','個人形象服務／IMAGESUIT西服','30位主辦人','10','3','1份報價或付費場','Sophie','進行中','第一優先漏斗'],
    ['F-005','SVC-005','企業顧問','現場觀察與診斷','門市、高接觸服務、專業服務與體驗型企業','企業轉介、講座主辦人、商會、服務案例內容','顧客感受檢核表／30分鐘經營訪談','有服務落差、客訴或轉換問題的決策者','經營訪談＋現場範圍確認','提交診斷範圍、交付與報價','SVC-006員工訓練','10家企業','5','3','1份診斷提案','Sophie','草案','定價待Alex確認'],
    ['F-006','SVC-006','企業顧問','員工形象與接待訓練','需要提升接待、需求探詢與價值說明的企業','SVC-005診斷客戶、企業HR、主管轉介','訓練需求盤點表／課綱樣本','有明確團隊、場次與改善指標','需求會議＋課前訪談','提交訓練方案與報價','SVC-007主管帶教與陪跑','8家企業','4','2','1份訓練提案','Sophie','草案','優先承接診斷客戶'],
    ['F-007','SVC-007','企業顧問','主管帶教與陪跑','已完成訓練但需要持續落地的主管團隊','SVC-006課後回訪、既有企業客戶、主管案例','帶教檢核表／30天改善回顧','主管願意固定回饋並有改善議題','主管訪談與陪跑週期設計','確認月度／季度陪跑方案','續約、擴部門或再次訓練','5家既有客戶','3','2','1份陪跑提案','Sophie','草案','需定義交付頻率'],
    ['F-008','SVC-008','甜甜圈高球','新手活動體驗','想接觸高球、擴展人脈但擔心門檻的新手','社群、朋友轉介、商務社團、既有客戶','新手友善體驗場／裝備與流程說明','可參加指定日期並對後續學習有興趣','活動報名與行前確認','支付1,280元完成報名','SVC-009商務高爾夫初階團班','30位名單','18','12','8人到場','Sophie','草案','活動日期待確認'],
    ['F-009','SVC-009','甜甜圈高球','商務高爾夫初階團班','完成體驗或有明確系統學習需求的新手','SVC-008到場者、社群見證、轉介紹','十堂課程說明／程度與時段調查','可承諾10堂、接受18,800元且時段吻合','15分鐘班別與目標確認','支付訂金或全額完成預售','進階課、球聚與商務社群','20位有效名單','10','8','4人預售','Sophie','草案','預計2027年1月開班']
  ]
};

const operatingMapSeed = [
  ['目標ID','母目標ID','層級','策略主軸','目標／方向','完成定義','核心指標','基準值','目標值','檢視日','主責','進度%','狀態','優先級','待CEO確認','三位主管共識'],
  ['V-001','','願景','公司方向','讓每個人都能被看懂、被理解，從內在建立自信，擁有更好的關係與生活。','品牌核心、使命與主張已確認並一致使用','客戶的理解、自信、溝通與關係改善','已完成第一版','內容、服務與溝通一致','2027-12-31','CEO / Alex / Sophie',100,'已完成','P0','已於2026-11-17確認','作為所有服務、內容與產品判斷基準'],
  ['NS-001','V-001','北極星','公司方向','讓更多完成好圈圈服務的人，真正感受到溝通、關係或生活的正向改變','先定義什麼算是完成服務後的實際改變，再建立可持續追蹤方式','每月完成服務且回饋有實際改變的人數（定義中）','尚未建立','待討論','2026-12-31','CEO / Alex / Sophie',5,'待CEO確認','P0','北極星定義與可追蹤方式','營收、客戶與粉絲是重要經營指標，但不直接等於長期價值'],
  ['Y-001','NS-001','年度目標','營收與商務','2027年建立每月20萬元的穩定服務營收','每月至少4位形象顧問付費客戶；每月維持1家大型企業合作；每季新增1至2件輕量企業案；全年營收至少240萬元','月營收、形象顧問付費客戶、大型企業合作、輕量企業案','AMO每月約12萬元；其他服務待盤點','每月營收20萬元；個人客戶4位／月；大型企業1家／月；輕量企業1至2件／季；全年240萬元','2027-12-31','CEO / Alex / Sophie',5,'進行中','P0','2026-11-17已確認年度方向','AMO於2027年3月到期，第一季需完成續約或找到接替的大型企業客戶'],
  ['Y-002','NS-001','年度目標','品牌與自媒體','2027年底讓IG與Facebook各達2,000位粉絲','持續發布能讓受眾理解好圈圈的方法與案例，並逐步帶來互動、詢問與服務機會','IG粉絲、Facebook粉絲、內容發布、有效互動與詢問','目前粉絲與內容基準待盤點','IG 2,000以上；Facebook 2,000以上','2027-12-31','CEO / Sophie',5,'進行中','P0','2026-11-17已確認粉絲目標；內容節奏仍需拆解','粉絲不是終點，後續要追蹤內容帶來的詢問與付費轉換'],
  ['Y-003','V-001','2026建置目標','品牌與成長','完成自媒體、LINE與Idealflow第一版獲客與追蹤系統','可以持續發文、承接名單、分眾跟進，並看見每個機會的下一步','內容日曆、LINE流程、Idealflow漏斗、名單建檔率','三者尚未完整串接','內容日曆1份；LINE流程1套；Idealflow漏斗1條','2026-12-31','Sophie / Daniel',10,'進行中','P0','需取得LINE與Idealflow權限','2026先建好可用版本，2027再依實際轉換優化'],
  ['Y-004','V-001','2026建置目標','產品與服務','完成可銷售、可交付的服務與課程第一版','主力服務都有對象、價值、內容、交付物與購買方式；AMO陪跑內容完成跨門市可複製模組','服務銷售包、課程模組、講師教材、交付工具','已有AMO案例與六模組雛形','AMO款待6模組＋2小時體驗版＋90天陪跑版＋企業銷售包','2026-12-31','Alex / Sophie / Daniel',15,'進行中','P0','第一版先鎖定有實體門市的連鎖服務企業','核心是把依賴個人熱忱的好服務，變成全門市可學、可做、可帶、可追蹤的款待系統'],
  ['Y-005','V-001','2026建置目標','營運與財務','完成可追蹤的公司營運與財務系統','目標、任務、討論、客戶、專案、收入與支出都能在單一正式資料源找到','任務歸屬率、每週更新率、收支完整率','HQ已建立，仍持續調整使用方式','正式工作100%歸屬；每週更新；月度損益可查看','2026-12-31','Daniel / CEO',40,'進行中','P0','Dashboard依CEO實際使用逐步優化','先讓系統每天可用，再逐步自動化'],
  ['M-001','Y-001','90天目標','營收與商務','完成公勝免費示範並成交首家付費講座','免費場、案例、付費場完成','免費場、付費場、主辦人','商業模式已確認','免費場1；付費場1；主辦人30','2027-02-15','Alex / Sophie',25,'進行中','P0','公勝日期與課程細節','第一主戰場'],
  ['M-002','Y-002','90天目標','品牌與成長','完成自媒體、LINE與Idealflow第一版基礎','內容日曆、LINE標籤與CRM漏斗可用','內容、LINE、CRM建檔','未完整串接','12週內容；LINE分眾；CRM漏斗1條','2027-02-15','Sophie / Daniel',5,'進行中','P0','帳號與權限','三個渠道共用服務、客群與階段定義'],
  ['M-003','Y-005','90天目標','營運與管理','建立CEO一眼看懂且能每天新增事項的作戰系統','目標、任務、討論與收件匣互相連結','歸屬率、更新率、未分類數','舊版難理解','100%有目標、類別、主責、狀態','2027-02-15','Daniel',35,'進行中','P0','CEO最常用3個入口','總覽只回答往哪裡、現在如何、下一步、卡點'],
  ['M-004','Y-004','90天目標','產品與服務','完成三條次要產品漏斗的小規模驗證','個人、企業、高球各有可判斷訊號','諮詢、提案、預售','有草案','個人2成交；企業1提案；高球4預售','2027-02-15','Alex / Sophie',10,'待CEO確認','P1','是否分散主戰場','只做最小驗證'],
  ['S-001','M-001','30天目標','產品與服務','完成2小時講座內容、分工、場地與報價規則','一份可對外標準合作說明','課綱、報價、合作規則','部分確認','銷售包1份','2026-12-17','Alex / CEO / Jeffery',40,'進行中','P0','西服夥伴會議結果','先有能賣的最小版本'],
  ['S-002','M-001','30天目標','業務開發','30位主辦人、3次洽談與1份報價','名單有關係、團隊、優先序與下一步','有效名單、洽談、報價','未完成','30／3／1','2026-12-17','Sophie',10,'進行中','P0','邀約話術','每日少量推進'],
  ['S-003','M-001','30天目標','網站與內容','講座頁改成團隊主辦方成交入口','可索取方案、預約洽談','CTA、表單、預約','偏個人報名','完成CTA與表單','2026-12-17','Sophie / Daniel',20,'進行中','P0','發布文字','只保留一個主行動'],
  ['S-004','M-002','30天目標','品牌與自媒體','建立三個內容支柱與四週日曆','12則可發布內容有導流目的','內容數、導流、互動','尚未建立','12則；3支柱','2026-12-17','Sophie',5,'待處理','P0','CEO語氣與拍攝時段','每則內容服務品牌、名單或成交'],
  ['S-005','M-002','30天目標','Idealflow / CRM','取得權限並建立講座CRM漏斗','30位主辦人可看階段、下一步與負責人','建檔率、跟進率','權限受阻','漏斗1條','2026-12-17','Sophie / Daniel',20,'受阻','P0','Idealflow子帳號／API','先完成欄位與流程'],
  ['S-006','M-003','30天目標','營運與管理','完成公司作戰地圖與每日事項收件匣','CEO可新增、分類、確認與追蹤','未分類數、更新率','舊版難用','新版可用','2026-12-17','Daniel',40,'進行中','P0','新版是否直覺','目標層級為核心'],
  ['S-007','Y-005','30天目標','財務','完成月收入、支出、固定與變動成本結帳','月度、年度、專案損益可看','完整率、結帳日','類別已建','11月完整；12/5結帳','2026-12-05','Daniel / CEO',35,'進行中','P1','歷史從哪月補','先當月可用'],
  ['S-008','M-002','30天目標','LINE經營','建立LINE歡迎、標籤、分眾與三段跟進','新好友能被分類並導向正確服務','新增、標籤率、回覆率、預約','待盤點','流程1套；標籤1份；跟進3則','2026-12-17','Sophie',5,'待處理','P0','LINE權限與好友數','LINE管關係，不重複CRM成交狀態']
];

const settingsSeed = [
  ['key','value'],['倒數目標日','2027-03-01'],['月營收目標','250000'],['目標生效月','2027-03'],['阿默合約結束日','2027-03-31'],['社群同步狀態','尚未執行'],['社群最後同步','']
];
const workstreamsSeed = [
  ['id','名稱','說明','3 月目標','排序'],
  ['W1','課程與交付物','','小團班開班',1],
  ['W2','阿默模組化','','款待教材完成、提案新企業',2],
  ['W3','兩場講座','','業務講座與 KOL 講座都試辦過，定期舉辦',3],
  ['W4','網站與系統','','官網改版、報名頁與 LINE 自動化上線',4],
  ['W5','內容與素材','','穩定發文、累積見證',5]
];
const tasksNewSeed = [
  ['id','待辦','工作線 id','負責人','期限','狀態','下一步','來源文件','建立日','完成日','重要程度'],
  ['T-030','第一次拍攝：官網形象照、現場照、短影音','W5','圈圈','2026-11-23','未開始','','','2026-11-18',''],
  ['T-031','IG、FB 簡介改為「讓每個圈子，都記得你的好」','W5','圈圈','2026-11-30','未開始','','','2026-11-18',''],
  ['T-032','課程頁年資改為「15 年以上」','W4','圈圈','2026-11-30','未開始','','','2026-11-18',''],
  ['T-033','在 iDealFlow 架設講座報名頁','W4','圈圈','2026-12-02','未開始','','','2026-11-18',''],
  ['T-034','設定 LINE 自動訊息','W4','圈圈','2026-12-02','未開始','','','2026-11-18',''],
  ['T-035','向 iDealFlow 確認部落格、SEO、GA4 支援','W4','圈圈','2026-12-02','未開始','','','2026-11-18',''],
  ['T-036','更新「網站建置指令」：KOL 講座線上、新增業務講座','W4','圈圈','2026-12-02','未開始','','','2026-11-18',''],
  ['T-037','更新業務講座提案檔為新版流程','W3','圈圈','2026-12-01','未開始','','','2026-11-18',''],
  ['T-038','製作「下一場重要會面形象行動卡」','W3','圈圈','','未開始','待業務講座日期確定後，於講座前完成','','2026-11-18',''],
  ['T-039','聯繫代表案例客戶，取得見證與授權','W5','圈圈','2026-12-15','未開始','','','2026-11-18',''],
  ['T-040','製作「重要場合形象檢查清單」（LINE 加好友禮）','W5','圈圈','2026-12-16','未開始','','','2026-11-18',''],
  ['T-041','第二次拍攝','W5','圈圈','2026-12-16','未開始','','','2026-11-18',''],
  ['T-042','排程 12/25–1/2 旅行期間貼文','W5','圈圈','2026-12-24','未開始','','','2026-11-18',''],
  ['T-043','每次阿默陪跑後 20 分鐘紀錄','W2','圈圈','','未開始','每次阿默陪跑結束當日預留 20 分鐘完成紀錄','','2026-11-18',''],
  ['T-044','阿默款待教材初稿','W2','圈圈','2027-02-15','未開始','','','2026-11-18',''],
  ['T-045','小團班課程大綱與交付物','W1','圈圈','2027-02-15','未開始','','','2026-11-18','']
];
const decisionsNewSeed = [
  ['id','事項','選項','一起決定的人','決定期限','狀態','最後決定','決定日','後續待辦 id'],
  ['D-015','2027年3月起月營收目標','NT$200,000／NT$250,000','圈圈','2026-11-18','已決定','2027年3月起月營收目標為 NT$250,000','2026-11-18',''],
  ['D-016','業務講座日期','12/7、12/9、12/14、1 月','通訊處主管','2026-11-30','待決定','','',''],
  ['D-017','通訊處團購價','金額與人數門檻','Jeffery','','待決定','','',''],
  ['D-018','KOL 講座日期','1 月中平日晚上、過年後','iDealFlow','2026-12-15','待決定','','',''],
  ['D-019','建站服務收費方式','待提出','圈圈','2027-01-15','待決定','','',''],
  ['D-020','iDealFlow 合作分潤條件','待提出','iDealFlow','2027-01-15','待決定','','',''],
  ['D-021','阿默合約結束後的續約方案','續約、維護方案、結束','阿默蛋糕','2027-01-31','待決定','','','']
];
const eventsSeed = [['id','日期','時段','類型','標題','地點','備註']];
let eventSeedNumber=1;
const addEventSeed=(date,period,type,title,location='',note='')=>eventsSeed.push([`EV-${String(eventSeedNumber++).padStart(3,'0')}`,date,period,type,title,location,note]);
[['2026-11-19','全天'],['2026-11-20','全天'],['2026-11-26','全天'],['2026-11-27','全天'],['2026-12-01','全天'],['2026-12-02','上午'],['2026-12-03','全天'],['2026-12-04','全天'],['2026-12-10','全天'],['2026-12-11','全天'],['2026-12-16','上午'],['2026-12-17','全天'],['2026-12-18','全天'],['2026-12-22','全天'],['2026-12-23','全天']].forEach(([date,period])=>addEventSeed(date,period,'阿默陪跑','阿默陪跑'));
addEventSeed('2026-11-25','下午','高球','初階團班與教練課');addEventSeed('2026-11-29','全天','高球','下場','龍潭');addEventSeed('2026-11-30','下午','高球','甜甜圈新手體驗','','14:00–17:00');addEventSeed('2026-12-08','全天','高球','下場團');addEventSeed('2026-12-13','全天','高球','下場','新竹');
['2026-11-21','2026-11-24','2026-11-28','2026-12-05','2026-12-06','2026-12-12','2026-12-19','2026-12-20','2026-12-21'].forEach(date=>addEventSeed(date,'全天','家庭日','家庭日'));
for(let t=Date.parse('2026-12-25T00:00:00Z');t<=Date.parse('2027-01-02T00:00:00Z');t+=86400000)addEventSeed(new Date(t).toISOString().slice(0,10),'全天','家庭日','泰國家庭旅行','泰國');
addEventSeed('2026-11-22','下午','學習','財商課');addEventSeed('2026-11-22','上午','人脈交流','人脈交流');addEventSeed('2026-11-25','晚上','人脈交流','人脈交流');addEventSeed('2026-12-15','全天','其他工作','Lumina 助教');addEventSeed('2026-11-23','上午','個人事務','銀行開戶');addEventSeed('2026-12-16','晚上','個人事務','弄頭髮');
const metricsSeed = [['日期','IG 粉絲','FB 粉絲','LINE 好友','講座報名','見證數','發文數','短影音數','備註','Threads 粉絲'],['2026-11-18',479,598,127,0,0,'','','2026-11-18 基準值',122]];
const docsSeed = [
  ['名稱','用途','連結','最後更新日'],['品牌定位','品牌故事、核心價值、客群','https://claude.ai/artifact/RZxRkREajmHfTtJ1NL8wKb',''],['網站優化建議','官網診斷與改版方向','https://claude.ai/artifact/9CuBL8TRgtwNfd3E6tF3jR',''],['網站建置指令','給 iDealFlow AI 執行','https://claude.ai/artifact/KLKKxfkWCFomgY95JGAbY7',''],['講座宣傳與內容規劃','貼文主題與短影音腳本','https://claude.ai/artifact/7DE1KuZudbcXkwV3377X7o',''],['準備期計畫','路線圖、兩場講座大綱','https://claude.ai/artifact/BcnhG1xuysy96YiTaxDiCF',''],['儀表板改版說明','本文件','https://claude.ai/artifact/8VE3QjVsp9CMHS1pNeK2zM','2026-11-18']
];

const brandFoundationSeed = [
  ['編號','類型','正式文字','使用方式','狀態','確認日期'],
  ['BF-001','核心觀點','形象，不只是你看起來如何，而是別人如何理解你。','所有服務與內容的共同觀點','已確認','2026-11-17'],
  ['BF-002','願景','讓每個人都能被看懂、被理解，從內在建立自信，擁有更好的關係與生活。','長期想創造的改變','已確認','2026-11-17'],
  ['BF-003','使命','幫助人們理解別人如何看見自己，學會用對方看得懂的方式，呈現真正想表達的樣子，減少誤解、提升溝通，創造更正向的人際互動。','說明好圈圈如何創造改變','已確認','2026-11-17'],
  ['BF-004','品牌主張','看懂自己，也讓別人看懂你。','對外最短版本','已確認','2026-11-17']
];

const inboxSeed = [
  ['事項ID','日期','新增事項','事項類型','工作類別','來源','目標ID','專案／主題','主責','優先級','狀態','期限','下一步','需要決策','已轉任務ID','備註'],
  ['IN-001','2026-11-17','重新定義公司北極星、年度、中期與短期目標','決策需求','策略與商務','CEO對話','M-003','公司作戰系統','Alex / Daniel','P0','待討論','2026-11-18','CEO檢視年度數字與北極星','採客戶成果、營收或混合指標','','本次對話新增'],
  ['IN-002','2026-11-17','建立自媒體完整規劃與進度管理','待辦','品牌自媒體','CEO對話','S-004','自媒體','Sophie','P0','已轉任務','2026-11-24','確認內容支柱、語氣與日曆','CEO可拍攝時間','T-021','納入30天目標'],
  ['IN-003','2026-11-17','把Idealflow、LINE與HQ的角色分清並串成一條漏斗','待討論','Idealflow / CRM','CEO對話','M-002','成長系統','Sophie / Daniel','P0','待討論','2026-11-20','盤點帳號、權限、欄位與資料責任','Idealflow與LINE現況','','避免重複維護'],
  ['IN-004','2026-11-17','建立LINE歡迎、標籤與分眾跟進流程','待辦','LINE經營','CEO對話','S-008','LINE經營','Sophie','P0','已轉任務','2026-11-25','盤點現有帳號與好友狀態','LINE管理權限','T-022','與自媒體導流連動'],
  ['IN-005','2026-11-17','Dashboard總覽要看見公司所有待辦、待討論、進行中與目標計畫','待辦','營運管理','CEO對話','S-006','HQ Dashboard','Daniel','P0','進行中','2026-11-18','重做總覽與目標樹','新版是否直覺','T-017','本次對話新增'],
  ['IN-006','2026-11-17','年底前把AMO陪跑內容變成可套用不同門市與企業的模組課程','待辦','服務產品','CEO對話','Y-004','AMO款待模組化','Alex / Sophie / Daniel','P0','已轉任務','2026-12-31','依六模組完成教材、工具、試教與企業銷售包','AMO案例對外匿名與授權方式','T-023','已拆成T-024至T-029']
];

const taskMetaSeed = {
  'T-001':['M-003','營運管理','里程碑',100],'T-002':['Y-004','策略與商務','專案',80],'T-003':['M-002','品牌自媒體','專案',80],
  'T-004':['S-005','Idealflow / CRM','任務',20],'T-005':['M-003','營運管理','任務',40],'T-006':['S-006','營運管理','例行',20],
  'T-007':['M-003','營運管理','任務',20],'T-008':['M-003','營運管理','例行',20],'T-009':['M-001','業務開發','里程碑',60],
  'T-010':['S-002','業務開發','任務',10],'T-011':['S-002','業務開發','流程',20],'T-012':['S-006','營運管理','例行',60],
  'T-013':['S-003','網站與內容','任務',20],'T-014':['S-001','服務產品','專案',40],'T-015':['M-001','Idealflow / CRM','流程',20],
  'T-016':['M-001','合作夥伴','待討論',50],'T-017':['S-006','營運管理','專案',40],'T-018':['M-004','服務產品','實驗',20],
  'T-019':['M-004','服務產品','實驗',20],'T-020':['M-004','服務產品','實驗',20],'T-021':['S-004','品牌自媒體','專案',5],
  'T-022':['S-008','LINE經營','專案',5],
  'T-023':['Y-004','服務產品','專案',15],'T-024':['Y-004','服務產品','任務',10],'T-025':['Y-004','服務產品','任務',10],
  'T-026':['Y-004','服務產品','任務',5],'T-027':['Y-004','服務產品','任務',5],'T-028':['Y-004','服務產品','里程碑',0],
  'T-029':['Y-004','策略與商務','任務',0]
};

const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const objects = values => {
  if (!values?.length) return [];
  const [headers,...rows] = values;
  return rows.filter(r => r.some(v => String(v ?? '').trim())).map(r => Object.fromEntries(headers.map((h,i) => [h,r[i] ?? ''])));
};
const numeric = value => Number(String(value ?? 0).replace(/[,$NT\s]/g,'')) || 0;
const money = value => new Intl.NumberFormat('zh-TW',{style:'currency',currency:'TWD',maximumFractionDigits:0}).format(numeric(value));
const idNumber = value => Number(String(value).replace(/\D/g,'')) || 0;
const statusClass = value => {
  const s=String(value||'');
  if (s.includes('受阻') || s.includes('需調整')) return 'red';
  if (s.includes('完成') || s.includes('生效') || s.includes('收款')) return 'green';
  if (s.includes('CEO') || s.includes('待') || s.includes('免費')) return 'amber';
  if (s.includes('進行') || s.includes('試辦')) return 'blue';
  return 'neutral';
};
const parseDate = value => {
  const s=String(value||'').trim();
  if (!s) return null;
  let d;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) { const [m,day,y]=s.split('/').map(Number); d=new Date(y,m-1,day); }
  else d=new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};
const dateLabel = value => {
  const d=parseDate(value); return d ? d.toLocaleDateString('zh-TW',{month:'numeric',day:'numeric'}) : (value || '未定');
};
const localIso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const localDay = value => { const d=parseDate(value); return d ? new Date(d.getFullYear(),d.getMonth(),d.getDate()) : null; };
const settingValue = key => state.settings.find(item=>item.key===key)?.value || '';
const taskPriorityOptions = ['重要且緊急','重要不緊急','緊急不重要','一般'];
const taskPriorityRank = value => { const index=taskPriorityOptions.indexOf(value||'一般');return index<0?taskPriorityOptions.length:index; };
const taskPriorityClass = value => `priority-${taskPriorityRank(value)+1}`;

function renderOverview() {
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const target=localDay(settingValue('倒數目標日')||'2027-03-01');
  const days=Math.max(0,Math.ceil((target-today)/86400000));
  document.querySelector('#overview-countdown').innerHTML=`<div><p>PREPARATION PERIOD</p><span>距離 3 月穩定接案</span><h2>還有 <strong>${days}</strong> 天</h2><small>目標日 ${target.toLocaleDateString('zh-TW',{year:'numeric',month:'numeric',day:'numeric'})} · 先把課程、講座、網站與內容準備好</small></div><button class="overview-add" id="overview-add-item" type="button">＋ 新增今日事項</button>`;

  const metricRows=[...state.metrics].sort((a,b)=>(localDay(a['日期'])||0)-(localDay(b['日期'])||0));
  const latest=metricRows.at(-1)||{}, previous=metricRows.at(-2)||{};
  const monthlyIncome=state.income.filter(row=>{const d=localDay(row['日期']);return d&&d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth();}).reduce((sum,row)=>sum+numeric(row['已收金額']),0);
  const cards=[
    ['IG 粉絲','IG 粉絲','人'],['FB 粉絲','FB 粉絲','人'],['Threads 粉絲','Threads 粉絲','人'],['LINE 好友','LINE 好友','人'],['已收集見證','見證數','份'],['講座報名','講座報名','人']
  ].map(([label,key,unit])=>{const value=numeric(latest[key]),prev=previous[key]===''||previous[key]==null?null:numeric(previous[key]);const delta=prev===null?'第一筆基準':`比上週 ${value-prev>=0?'+':''}${value-prev}`;return [label,value.toLocaleString('zh-TW'),unit,delta];});
  cards.push(['本月已收營收',money(monthlyIncome),'','以實收金額計算']);
  document.querySelector('#overview-metrics').innerHTML=cards.map(card=>`<article><span>${esc(card[0])}</span><strong>${esc(card[1])}<small>${esc(card[2])}</small></strong><p>${esc(card[3])}</p></article>`).join('');

  const monday=new Date(today);monday.setDate(today.getDate()-((today.getDay()+6)%7));
  const sunday=new Date(monday);sunday.setDate(monday.getDate()+6);
  const weekly=state.tasksNew.filter(task=>{const due=localDay(task['期限']);return due&&due>=monday&&due<=sunday&&task['狀態']!=='完成';}).sort((a,b)=>taskPriorityRank(a['重要程度'])-taskPriorityRank(b['重要程度'])||localDay(a['期限'])-localDay(b['期限'])).slice(0,5);
  document.querySelector('#overview-weekly').innerHTML=weekly.length?weekly.map(task=>`<article class="overview-task"><span class="overview-status">${esc(task['狀態'])}</span><div><strong>${esc(task['待辦'])}</strong><small><b class="priority-badge ${taskPriorityClass(task['重要程度'])}">${esc(task['重要程度']||'一般')}</b>${esc(task['工作線 id'])} · ${esc(task['負責人'])}</small></div><time>${dateLabel(task['期限'])}</time><button class="icon-edit" type="button" data-edit-task="${esc(task.id)}" aria-label="編輯 ${esc(task['待辦'])}">編輯</button></article>`).join(''):'<div class="overview-empty"><strong>本週沒有到期事項</strong><span>點上方「新增」，設定本週期限後就會出現在這裡。</span></div>';

  const pending=state.decisionsNew.filter(item=>item['狀態']==='待決定').sort((a,b)=>{const ad=localDay(a['決定期限']),bd=localDay(b['決定期限']);return (ad?.getTime()||Infinity)-(bd?.getTime()||Infinity);}).slice(0,3);
  document.querySelector('#overview-decisions').innerHTML=pending.length?pending.map(item=>`<article class="overview-decision"><div><strong>${esc(item['事項'])}</strong><small>${esc(item['選項'])}</small></div><span>${item['決定期限']?dateLabel(item['決定期限']):'待排期限'}</span><p>一起決定：${esc(item['一起決定的人']||'圈圈')}</p></article>`).join(''):'<div class="overview-empty"><strong>目前沒有待決定事項</strong></div>';

  const schedule=Array.from({length:7},(_,index)=>{const date=new Date(today);date.setDate(today.getDate()+index);const key=localIso(date),rows=state.events.filter(event=>event['日期']===key);const vacancy=dayAvailability(date,rows);const availability=vacancy==='全天空檔'?(rows.length?'白天空檔':'可工作'):vacancy;return {date,key,rows,availability};});
  document.querySelector('#overview-schedule').innerHTML=schedule.map(day=>`<article class="schedule-day ${day.availability?'has-availability':''}"><header><span>${day.date.toLocaleDateString('zh-TW',{weekday:'short'})}</span><strong>${day.date.getMonth()+1}/${day.date.getDate()}</strong>${day.availability?`<b>${day.availability}</b>`:''}</header><div>${day.rows.length?day.rows.map(event=>`<p><i class="event-dot event-${esc(event['類型'])}"></i><span>${esc(event['標題'])}</span><small>${esc(event['時段'])}</small></p>`).join(''):'<p class="no-event">尚無行程</p>'}</div></article>`).join('');

  const streams=[...state.workstreams].sort((a,b)=>numeric(a['排序'])-numeric(b['排序']));
  document.querySelector('#overview-workstreams').innerHTML=streams.map(stream=>{const tasks=state.tasksNew.filter(task=>task['工作線 id']===stream.id),done=tasks.filter(task=>task['狀態']==='完成').length,progress=tasks.length?Math.round(done/tasks.length*100):0;return `<button type="button" data-workstream="${esc(stream.id)}"><header><span>${esc(stream.id)}</span><strong>${esc(stream['名稱'])}</strong><b>${progress}%</b></header><p>${esc(stream['3 月目標'])}</p><div><i style="width:${progress}%"></i></div><small>${done}／${tasks.length} 項完成</small></button>`;}).join('');
}

function showView(view) {
  document.querySelectorAll('.nav-item,.mobile-nav-item[data-view]').forEach(el => el.classList.toggle('is-active',el.dataset.view===view));
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('is-visible',el.dataset.viewPanel===view));
  const titles={overview:'總覽',tasks:'待辦',decisions:'待決定',calendar:'行事曆',metrics:'數字成效',finance:'收支',docs:'文件',coach:'陪跑紀錄'};
  document.querySelector('#page-title').textContent=titles[view];
  const more=document.querySelector('#mobile-more-menu');if(more){more.hidden=true;document.querySelector('#mobile-more-toggle')?.setAttribute('aria-expanded','false');}
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderGoals() {
  const north=state.operatingMap.find(g=>g['層級']==='北極星');
  const order=['核心觀點','願景','使命','品牌主張'];
  const foundation=[...state.brandFoundation].sort((a,b)=>order.indexOf(a['類型'])-order.indexOf(b['類型']));
  document.querySelector('#brand-foundation-grid').innerHTML=foundation.map(g=>`<article class="foundation-card foundation-row"><span>${esc(g['類型'])}</span><h3>${esc(g['正式文字'])}</h3><small>${esc(g['使用方式'])}</small></article>`).join('');
  const northPending=north&&north['狀態']==='待CEO確認';
  document.querySelector('#north-star-banner').innerHTML=north?`<div><span>北極星${northPending?' · 討論中':''}</span><small>${northPending?'尚未定案，先以客戶改變為討論方向':'全公司共同追的長期結果'}</small></div><h3>${esc(north['目標／方向'])}</h3><p>${esc(north['核心指標'])}</p>`:'';
  const annual=state.operatingMap.filter(g=>g['層級']==='年度目標');
  document.querySelector('#annual-goal-grid').innerHTML=annual.map((g,i)=>`<article class="annual-goal-card"><header><span>0${i+1}</span><div><small>${esc(g['策略主軸'])}</small><h4>${esc(g['目標／方向'])}</h4></div><b>${numeric(g['進度%'])}%</b></header><p>${esc(g['完成定義'])}</p><div class="goal-progress"><span style="width:${Math.min(100,numeric(g['進度%']))}%"></span></div><footer><span>${esc(g['目標值'])}</span><small>${esc(g['主責'])}</small></footer></article>`).join('');
  const build=state.operatingMap.filter(g=>g['層級']==='2026建置目標');
  document.querySelector('#build-goal-grid').innerHTML=build.map((g,i)=>`<article class="build-goal-card"><header><span>${String(i+1).padStart(2,'0')}</span><div><small>${esc(g['策略主軸'])}</small><h4>${esc(g['目標／方向'])}</h4></div><b>${numeric(g['進度%'])}%</b></header><p>${esc(g['完成定義'])}</p><div class="goal-progress"><span style="width:${Math.min(100,numeric(g['進度%']))}%"></span></div><footer><strong>${esc(g['目標值'])}</strong><small>${esc(g['主責'])}</small></footer></article>`).join('');
  const medium=state.operatingMap.filter(g=>g['層級']==='90天目標');
  document.querySelector('#focus-roadmap').innerHTML=medium.map(g=>{const children=state.operatingMap.filter(c=>c['母目標ID']===g['目標ID']);return `<article class="focus-item"><header><span>${esc(g['目標ID'])}</span><b>${numeric(g['進度%'])}%</b></header><h4>${esc(g['目標／方向'])}</h4><p>${esc(g['目標值'])}</p><div class="mini-goals">${children.map(c=>`<span><i class="${statusClass(c['狀態'])}"></i>${esc(c['目標ID'])} ${esc(c['目標／方向'])}</span>`).join('')}</div></article>`;}).join('');
}

function renderKpis() {
  const pendingDiscussion=state.inbox.filter(x=>x['狀態']==='待討論').length+state.tasks.filter(t=>t['狀態']==='待CEO確認').length;
  const todo=state.tasks.filter(t=>t['狀態']==='待處理').length+state.inbox.filter(x=>['待分類','待處理'].includes(x['狀態'])).length;
  const active=state.tasks.filter(t=>t['狀態']==='進行中').length;
  const blocked=state.tasks.filter(t=>t['狀態']==='受阻').length;
  const pending=state.decisions.filter(d=>d['狀態']==='待CEO確認').length+state.operatingMap.filter(g=>g['狀態']==='待CEO確認').length;
  const values=[['年度目標',state.operatingMap.filter(g=>g['層級']==='年度目標').length,'2027 公司成果'],['待討論',pendingDiscussion,'今天需要說清楚'],['待處理',todo,'已歸類但尚未開始'],['進行中',active,'有人承接'],['受阻',blocked,'需要排除卡點'],['待 CEO 確認',pending,'目標與決策']];
  document.querySelector('#kpi-grid').innerHTML=values.map(x=>`<article class="kpi-card"><p>${x[0]}</p><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join('');
}

function renderInbox() {
  const rows=[...state.inbox].sort((a,b)=>idNumber(b['事項ID'])-idNumber(a['事項ID']));
  document.querySelector('#inbox-list').innerHTML=rows.length?rows.map(x=>`<article class="inbox-item"><div><span class="tag ${statusClass(x['狀態'])}">${esc(x['狀態'])}</span><small>${esc(x['事項ID'])} · ${esc(x['工作類別'])}</small></div><h4>${esc(x['新增事項'])}</h4><p>${esc(x['下一步'])}</p><footer><span>${esc(x['主責'])}</span><b>${esc(x['期限'])}</b></footer></article>`).join(''):'<p class="empty-state">今天還沒有新增事項。</p>';
}

function renderWorkOverview() {
  const categories=[...new Set(state.tasks.map(t=>t['工作類別']).filter(Boolean))];
  document.querySelector('#work-overview').innerHTML=categories.map(cat=>{const rows=state.tasks.filter(t=>t['工作類別']===cat),active=rows.filter(t=>t['狀態']==='進行中').length,blocked=rows.filter(t=>t['狀態']==='受阻').length,pending=rows.filter(t=>['待處理','待CEO確認'].includes(t['狀態'])).length,avg=rows.length?Math.round(rows.reduce((n,t)=>n+numeric(t['完成進度%']),0)/rows.length):0;return `<article class="work-category-card"><header><span>${esc(cat)}</span><b>${rows.length} 項</b></header><div class="work-category-stats"><span><i class="blue"></i>${active} 進行</span><span><i class="amber"></i>${pending} 待處理</span><span><i class="red"></i>${blocked} 受阻</span></div><div class="goal-progress"><span style="width:${avg}%"></span></div><small>平均進度 ${avg}%</small></article>`;}).join('');
}

function populateGoalWorkFilters() {
  const goal=document.querySelector('#goal-filter'),cat=document.querySelector('#category-filter');
  goal.innerHTML='<option value="">所有目標</option>'+state.operatingMap.filter(g=>['2026建置目標','90天目標','30天目標'].includes(g['層級'])).map(g=>`<option value="${esc(g['目標ID'])}">${esc(g['目標ID'])} · ${esc(g['目標／方向'])}</option>`).join('');
  const cats=[...new Set(state.tasks.map(t=>t['工作類別']).filter(Boolean))];cat.innerHTML='<option value="">所有類別</option>'+cats.map(x=>`<option>${esc(x)}</option>`).join('');
}

function renderGoalTree() {
  const levels=['2026建置目標','年度目標','90天目標','30天目標'];
  document.querySelector('#goal-level-tabs').innerHTML=levels.map(x=>`<button class="chip ${state.goalLevel===x?'active':''}" data-goal-level="${x}">${x}</button>`).join('');
  const rows=state.operatingMap.filter(g=>g['層級']===state.goalLevel);
  document.querySelector('#goal-tree').innerHTML=rows.map(g=>{const tasks=state.tasks.filter(t=>t['目標ID']===g['目標ID']);return `<article class="goal-tree-card"><header><div><span>${esc(g['目標ID'])} · ${esc(g['策略主軸'])}</span><h4>${esc(g['目標／方向'])}</h4></div><b>${numeric(g['進度%'])}%</b></header><p>${esc(g['完成定義'])}</p><div class="goal-progress"><span style="width:${Math.min(100,numeric(g['進度%']))}%"></span></div><footer><span>${tasks.length} 個直接任務</span><small>${esc(g['主責'])} · ${esc(g['檢視日'])}</small></footer></article>`;}).join('');
}

function renderWorkBoard() {
  const taskRows=state.tasks.filter(t=>(!state.workGoal||t['目標ID']===state.workGoal)&&(!state.workCategory||t['工作類別']===state.workCategory));
  const columns=[['待討論',t=>t['狀態']==='待CEO確認'||t['工作類型']==='待討論'],['待處理',t=>t['狀態']==='待處理'],['進行中',t=>t['狀態']==='進行中'],['受阻',t=>t['狀態']==='受阻'],['已完成',t=>t['狀態']==='已完成']];
  document.querySelector('#work-board').innerHTML=columns.map(([name,test])=>{const rows=taskRows.filter(test);return `<section class="work-column"><header><span>${name}</span><b>${rows.length}</b></header><div>${rows.map(t=>`<article class="work-card"><div><span>${esc(t['目標ID']||'未歸屬')}</span><small>${esc(t['工作類別'])}</small></div><h4>${esc(t['任務ID'])} · ${esc(t['任務名稱'])}</h4><p>${esc(t['下一步'])}</p><div class="goal-progress"><span style="width:${Math.min(100,numeric(t['完成進度%']))}%"></span></div><footer><span>${esc(t['負責人'])}</span><b>${numeric(t['完成進度%'])}%</b></footer></article>`).join('')||'<p class="column-empty">沒有事項</p>'}</div></section>`;}).join('');
}

function latestDaily() {
  const managers=['Alex','Sophie','Daniel'];
  return managers.map(name => state.daily.filter(x=>x['主管']===name).sort((a,b)=>(parseDate(b['日期'])||0)-(parseDate(a['日期'])||0))[0]).filter(Boolean);
}

function renderDaily() {
  const colors={Alex:'strategy',Sophie:'growth',Daniel:'operations'};
  document.querySelector('#daily-grid').innerHTML=latestDaily().map(item=>`<article class="daily-card ${colors[item['主管']]}"><header><span>${esc(item['角色'])}</span><strong>${esc(item['主管'])}</strong><small>${esc(item['日期'])}</small></header><div><p class="eyebrow">今日最重要</p><h4>${esc(item['今日最重要事項'])}</h4><p>${esc(item['目前進展'])}</p><details><summary>需要 CEO 看什麼？</summary><p><b>待確認：</b>${esc(item['需要CEO確認']||'無')}</p><p><b>主管建議：</b>${esc(item['主管建議'])}</p></details></div></article>`).join('');
}

function queueItems() {
  const decisions=state.decisions.filter(x=>x['狀態']==='待CEO確認').map(x=>({type:'decision',id:x['決策ID'],title:x['決策主題'],context:x['最後決策'],confirm:'已生效',revise:'需調整'}));
  const tasks=state.tasks.filter(x=>x['狀態']==='待CEO確認' || (String(x['依賴／阻礙']).includes('CEO') && !['已完成','取消'].includes(x['狀態']))).map(x=>({type:'task',id:x['任務ID'],title:x['任務名稱'],context:x['依賴／阻礙'],confirm:'進行中',revise:'受阻'}));
  return [...decisions,...tasks].slice(0,8);
}

function actionButtons(item) {
  return `<div class="queue-actions"><button class="small-button approve" data-action-open data-type="${item.type}" data-id="${esc(item.id)}" data-title="${esc(item.title)}" data-context="${esc(item.context)}" data-status="${item.confirm}">確認</button><button class="small-button revise" data-action-open data-type="${item.type}" data-id="${esc(item.id)}" data-title="${esc(item.title)}" data-context="${esc(item.context)}" data-status="${item.revise}">退回調整</button></div>`;
}

function renderQueue() {
  const list=queueItems();
  document.querySelector('#decision-queue').innerHTML=list.length?list.map(x=>`<article class="action-item"><div><span class="id-chip">${esc(x.id)}</span><strong>${esc(x.title)}</strong></div><p>${esc(x.context||'等待CEO判斷')}</p>${actionButtons(x)}</article>`).join(''):'<p class="empty-state">目前沒有等待你確認的事項。</p>';
}

function renderProgress() {
  const rows=[...state.progress].sort((a,b)=>idNumber(b['更新ID'])-idNumber(a['更新ID'])).slice(0,6);
  document.querySelector('#progress-feed').innerHTML=rows.map(x=>`<article class="timeline-item"><strong>${esc(x['更新者'])} · ${esc(x['任務ID']||x['更新ID'])}</strong><p>${esc(x['本次進展'])}</p><small>${esc(x['更新日'])} · ${esc(x['下一步／下次檢查日'])}</small></article>`).join('');
}

function populateTaskFilters() {
  const workstream=document.querySelector('#task-workstream-filter'),status=document.querySelector('#task-status-filter'),priority=document.querySelector('#task-priority-filter');
  workstream.innerHTML='<option value="">全部工作線</option>'+[...state.workstreams].sort((a,b)=>numeric(a['排序'])-numeric(b['排序'])).map(x=>`<option value="${esc(x.id)}">${esc(x.id)} · ${esc(x['名稱'])}</option>`).join('');
  status.innerHTML='<option value="">全部狀態</option>'+['未開始','進行中','等待中','完成'].map(x=>`<option>${x}</option>`).join('');
  priority.innerHTML='<option value="">全部重要程度</option>'+taskPriorityOptions.map(x=>`<option>${x}</option>`).join('');
  workstream.value=state.taskWorkstream;status.value=state.taskStatus;priority.value=state.taskPriority;document.querySelector('#task-deadline-filter').value=state.taskDeadline;
  const workstreamOptions=[...state.workstreams].sort((a,b)=>numeric(a['排序'])-numeric(b['排序'])).map(x=>`<option value="${esc(x.id)}">${esc(x.id)} · ${esc(x['名稱'])}</option>`).join('');
  document.querySelector('#task-form-workstream').innerHTML=workstreamOptions;document.querySelector('#decision-followup-workstream').innerHTML=workstreamOptions;
}

function filteredNewTasks() {
  const today=localDay(new Date()),monday=new Date(today);monday.setDate(today.getDate()-((today.getDay()+6)%7));const sunday=new Date(monday);sunday.setDate(monday.getDate()+6);const monthEnd=new Date(today.getFullYear(),today.getMonth()+1,0);
  return state.tasksNew.filter(task=>{const due=localDay(task['期限']);if(state.taskWorkstream&&task['工作線 id']!==state.taskWorkstream)return false;if(state.taskStatus&&task['狀態']!==state.taskStatus)return false;if(state.taskPriority&&(task['重要程度']||'一般')!==state.taskPriority)return false;if(state.taskDeadline==='week'&&(!due||due<monday||due>sunday))return false;if(state.taskDeadline==='month'&&(!due||due<today||due>monthEnd))return false;if(state.taskDeadline==='overdue'&&(!due||due>=today||task['狀態']==='完成'))return false;return true;}).sort((a,b)=>{const priority=taskPriorityRank(a['重要程度'])-taskPriorityRank(b['重要程度']);if(priority)return priority;const ad=localDay(a['期限']),bd=localDay(b['期限']);return (ad?.getTime()||Infinity)-(bd?.getTime()||Infinity);});
}

function renderTasks(){
  const streams=[...state.workstreams].sort((a,b)=>numeric(a['排序'])-numeric(b['排序']));
  document.querySelector('#task-workstreams').innerHTML=streams.map(stream=>{const rows=state.tasksNew.filter(task=>task['工作線 id']===stream.id),done=rows.filter(task=>task['狀態']==='完成').length,pct=rows.length?Math.round(done/rows.length*100):0;return `<button type="button" data-task-stream="${esc(stream.id)}" class="${state.taskWorkstream===stream.id?'active':''}"><header><span>${esc(stream.id)}</span><strong>${esc(stream['名稱'])}</strong><b>${pct}%</b></header><p>${esc(stream['3 月目標'])}</p><div><i style="width:${pct}%"></i></div><small>${done} / ${rows.length} 項完成</small></button>`;}).join('');
  const rows=filteredNewTasks(),streamMap=Object.fromEntries(state.workstreams.map(s=>[s.id,s['名稱']])),today=localDay(new Date());document.querySelector('#task-count').textContent=`顯示 ${rows.length} 項，共 ${state.tasksNew.length} 項`;
  document.querySelector('#task-list').innerHTML=rows.length?rows.map(task=>{const due=localDay(task['期限']),overdue=due&&due<today&&task['狀態']!=='完成';return `<article class="task-item ${overdue?'is-overdue':''}"><div class="task-item-main"><div class="task-item-meta"><span>${esc(task.id)}</span><b>${esc(task['工作線 id'])} · ${esc(streamMap[task['工作線 id']]||'')}</b><em class="priority-badge ${taskPriorityClass(task['重要程度'])}">${esc(task['重要程度']||'一般')}</em>${overdue?'<em>已過期</em>':''}</div><h4>${esc(task['待辦'])}</h4><p>${esc(task['下一步']||'尚未填寫下一步')}</p>${task['來源文件']?`<a href="${esc(task['來源文件'])}" target="_blank" rel="noopener">來源文件 ↗</a>`:''}</div><div class="task-item-side"><label>狀態<select data-new-task-status="${esc(task.id)}" data-current-status="${esc(task['狀態'])}">${['未開始','進行中','等待中','完成'].map(status=>`<option ${task['狀態']===status?'selected':''}>${status}</option>`).join('')}</select></label><label>重要度<select data-new-task-priority="${esc(task.id)}" data-current-priority="${esc(task['重要程度']||'一般')}">${taskPriorityOptions.map(priority=>`<option ${priority===(task['重要程度']||'一般')?'selected':''}>${priority}</option>`).join('')}</select></label><span>${esc(task['負責人']||'圈圈')}</span><time>${task['期限']?esc(task['期限']):'無固定期限'}</time><button class="small-button" type="button" data-edit-task="${esc(task.id)}">編輯說明</button></div></article>`;}).join(''):'<div class="overview-empty"><strong>沒有符合條件的待辦</strong><span>請調整篩選條件。</span></div>';
}

function sortedMetrics() {
  return [...state.metrics].filter(row=>localDay(row['日期'])).sort((a,b)=>localDay(a['日期'])-localDay(b['日期']));
}

function renderMetrics() {
  const rows=sortedMetrics(),latest=rows.at(-1)||{},previous=rows.at(-2)||{};
  const cards=[['IG 粉絲','IG 粉絲','人'],['FB 粉絲','FB 粉絲','人'],['Threads 粉絲','Threads 粉絲','人'],['LINE 好友','LINE 好友','人'],['講座報名','講座報名','人'],['見證數','見證數','份'],['本週發文','發文數','則'],['本週短影音','短影音數','支']];
  document.querySelector('#metrics-latest').innerHTML=cards.map(([label,key,unit])=>{const value=numeric(latest[key]),hasPrevious=previous[key]!==''&&previous[key]!=null,delta=value-numeric(previous[key]);return `<article><span>${esc(label)}</span><strong>${value.toLocaleString('zh-TW')}<small>${unit}</small></strong><p class="${hasPrevious&&delta<0?'negative':''}">${hasPrevious?`比上週 ${delta>=0?'+':''}${delta}`:'第一筆基準'}</p></article>`;}).join('');
  const syncStatus=settingValue('社群同步狀態')||'尚未執行',syncTime=settingValue('社群最後同步');
  document.querySelector('#social-sync-status').textContent=`${syncStatus}${syncTime?` · ${syncTime}`:''}；失敗時保留上次數字。`;

  if(!rows.length){document.querySelector('#metrics-chart').innerHTML='<div class="overview-empty"><strong>尚未有數字紀錄</strong><span>新增第一筆後就會產生趨勢圖。</span></div>';document.querySelector('#metrics-table').innerHTML='';return;}
  const series=[['IG 粉絲','#bf2f70'],['FB 粉絲','#4f80b2'],['Threads 粉絲','#222222'],['LINE 好友','#36745f']];
  const width=820,height=270,left=50,right=18,top=22,bottom=42,plotW=width-left-right,plotH=height-top-bottom;
  const max=Math.max(1,...rows.flatMap(row=>series.map(([key])=>numeric(row[key]))));
  const x=index=>left+(rows.length===1?plotW/2:index*plotW/(rows.length-1));
  const y=value=>top+plotH-(numeric(value)/max*plotH);
  const grid=Array.from({length:5},(_,index)=>{const value=Math.round(max*(4-index)/4),py=top+plotH*index/4;return `<g><line x1="${left}" y1="${py}" x2="${width-right}" y2="${py}"/><text x="${left-8}" y="${py+3}" text-anchor="end">${value}</text></g>`;}).join('');
  const lines=series.map(([key,color])=>{const points=rows.map((row,index)=>`${x(index)},${y(row[key])}`).join(' ');const dots=rows.map((row,index)=>`<circle cx="${x(index)}" cy="${y(row[key])}" r="3.5"><title>${esc(row['日期'])}｜${esc(key)} ${numeric(row[key])}</title></circle>`).join('');return `<g class="metric-line" style="--line-color:${color}"><polyline points="${points}"/>${dots}</g>`;}).join('');
  const labelStep=Math.max(1,Math.ceil(rows.length/7));
  const labels=rows.map((row,index)=>(index%labelStep===0||index===rows.length-1)?`<text x="${x(index)}" y="${height-14}" text-anchor="middle">${dateLabel(row['日期'])}</text>`:'').join('');
  document.querySelector('#metrics-chart').innerHTML=`<div class="metric-chart-legend">${series.map(([key,color])=>`<span><i style="background:${color}"></i>${key}</span>`).join('')}<b>最新：${esc(latest['日期']||'—')}</b></div><div class="metric-svg-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="IG、Facebook、Threads 與 LINE 好友的每週趨勢"><g class="metric-grid">${grid}</g>${lines}<g class="metric-axis-labels">${labels}</g></svg></div>`;
  document.querySelector('#metrics-table').innerHTML=[...rows].reverse().map(row=>`<tr><td><strong>${esc(row['日期'])}</strong></td><td>${numeric(row['IG 粉絲']).toLocaleString('zh-TW')}</td><td>${numeric(row['FB 粉絲']).toLocaleString('zh-TW')}</td><td>${numeric(row['Threads 粉絲']).toLocaleString('zh-TW')}</td><td>${numeric(row['LINE 好友']).toLocaleString('zh-TW')}</td><td>${numeric(row['講座報名']).toLocaleString('zh-TW')}</td><td>${numeric(row['見證數']).toLocaleString('zh-TW')}</td><td>${numeric(row['發文數']).toLocaleString('zh-TW')}</td><td>${numeric(row['短影音數']).toLocaleString('zh-TW')}</td><td>${esc(row['備註']||'—')}</td></tr>`).join('');
}

function renderDocs() {
  const rows=[...state.docs].sort((a,b)=>(localDay(b['最後更新日'])?.getTime()||0)-(localDay(a['最後更新日'])?.getTime()||0));
  document.querySelector('#docs-grid').innerHTML=rows.length?rows.map((doc,index)=>`<a class="doc-card" href="${esc(doc['連結'])}" target="_blank" rel="noopener"><header><span>${String(index+1).padStart(2,'0')}</span><b>${doc['最後更新日']?`更新 ${esc(doc['最後更新日'])}`:'尚未標註更新日'}</b></header><h3>${esc(doc['名稱'])}</h3><p>${esc(doc['用途'])}</p><footer>開啟文件 <span>↗</span></footer></a>`).join(''):'<div class="overview-empty"><strong>尚未建立文件索引</strong><span>請在 Docs 工作表新增資料。</span></div>';
}

function financeRows(rows) {
  const active=rows.filter(row=>!['取消','作廢'].includes(row['收款狀態']||row['付款狀態']));
  if(state.financeMode==='all') return active;
  return active.filter(row=>{const d=parseDate(row['日期']);if(!d||d.getFullYear()!==Number(state.financeYear))return false;return state.financeMode==='year'||d.getMonth()+1===Number(state.financeMonth);});
}

function renderFinanceControls() {
  const years=[...new Set([...state.income,...state.expenses].map(r=>parseDate(r['日期'])?.getFullYear()).filter(Boolean).concat(now.getFullYear()))].sort((a,b)=>b-a);
  const year=document.querySelector('#finance-year'),month=document.querySelector('#finance-month');
  year.innerHTML=years.map(y=>`<option value="${y}" ${Number(state.financeYear)===y?'selected':''}>${y} 年</option>`).join('');
  month.innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}" ${Number(state.financeMonth)===i+1?'selected':''}>${i+1} 月</option>`).join('');
  document.querySelectorAll('[data-finance-mode]').forEach(b=>b.classList.toggle('active',b.dataset.financeMode===state.financeMode));
  document.querySelector('#finance-month-wrap').hidden=state.financeMode!=='month';
  year.closest('label').hidden=state.financeMode==='all';
  const label=state.financeMode==='all'?'全部期間':state.financeMode==='year'?`${state.financeYear} 年度`:`${state.financeYear} 年 ${state.financeMonth} 月`;
  document.querySelector('#finance-period-label').textContent=`${label}收支`;
}

function financeTotals(income,expenses) {
  const result={revenue:0,received:0,receivable:0,cost:0,fixedCost:0,variableCost:0,paid:0,payable:0};
  income.forEach(r=>{result.revenue+=numeric(r['應收金額']);result.received+=numeric(r['已收金額']);result.receivable+=numeric(r['未收金額']);});
  expenses.forEach(r=>{const cost=numeric(r['應付金額']);result.cost+=cost;r['成本屬性']==='固定成本'?result.fixedCost+=cost:result.variableCost+=cost;result.paid+=numeric(r['已付金額']);result.payable+=numeric(r['未付金額']);});
  return result;
}

function renderFinanceTrend() {
  const year=Number(state.financeYear)||now.getFullYear();
  const months=Array.from({length:12},(_,i)=>({month:i+1,revenue:0,cost:0}));
  state.income.forEach(r=>{const d=parseDate(r['日期']);if(d?.getFullYear()===year)months[d.getMonth()].revenue+=numeric(r['應收金額']);});
  state.expenses.forEach(r=>{const d=parseDate(r['日期']);if(d?.getFullYear()===year)months[d.getMonth()].cost+=numeric(r['應付金額']);});
  const max=Math.max(1,...months.flatMap(x=>[x.revenue,x.cost]));
  const hasData=months.some(x=>x.revenue||x.cost);
  document.querySelector('#finance-trend').innerHTML=`<div class="chart-legend"><span><i class="income-dot"></i>營收</span><span><i class="expense-dot"></i>成本</span><b>${year} 年</b></div><div class="bar-chart">${months.map(x=>`<div class="month-group" title="${x.month} 月｜營收 ${money(x.revenue)}｜成本 ${money(x.cost)}"><div class="bar-pair"><i class="income-bar" style="height:${x.revenue?Math.max(6,x.revenue/max*100):0}%"></i><i class="expense-bar" style="height:${x.cost?Math.max(6,x.cost/max*100):0}%"></i></div><span>${x.month}</span></div>`).join('')}</div>${hasData?'':'<p class="chart-empty">這個年度尚未有付費收支；新增後會自動形成趨勢。</p>'}`;
}

function renderProjectProfit(income,expenses) {
  const projects={};
  income.forEach(r=>{const key=r['專案']||'未分類';projects[key]??={income:0,cost:0};projects[key].income+=numeric(r['應收金額']);});
  expenses.forEach(r=>{const key=r['專案']||'未分類';projects[key]??={income:0,cost:0};projects[key].cost+=numeric(r['應付金額']);});
  const rows=Object.entries(projects).sort((a,b)=>(b[1].income-b[1].cost)-(a[1].income-a[1].cost));
  document.querySelector('#project-profit').innerHTML=rows.length?rows.map(([name,v])=>`<article><div><strong>${esc(name)}</strong><small>營收 ${money(v.income)} · 成本 ${money(v.cost)}</small></div><b class="${v.income-v.cost<0?'negative':''}">${money(v.income-v.cost)}</b></article>`).join(''):'<p class="empty-state">目前期間尚無專案收支。</p>';
}

function renderFinancePlan() {
  const target=numeric(settingValue('月營收目標'))||250000,effective=String(settingValue('目標生效月')||'2027-03');
  const targetDate=state.financeMode==='month'?new Date(Number(state.financeYear),Number(state.financeMonth)-1,1):new Date(now.getFullYear(),now.getMonth(),1);
  const period=`${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}`;
  const received=state.income.filter(row=>{const d=localDay(row['日期']);return d&&d.getFullYear()===targetDate.getFullYear()&&d.getMonth()===targetDate.getMonth();}).reduce((sum,row)=>sum+numeric(row['已收金額']),0);
  const active=period>=effective,pct=target?Math.round(received/target*100):0;
  document.querySelector('#revenue-target-card').innerHTML=`<div><p class="eyebrow">MONTHLY TARGET</p><span>${targetDate.getFullYear()} 年 ${targetDate.getMonth()+1} 月</span></div><div class="target-main"><strong>${active?`${Math.min(pct,999)}%`:'準備期'}</strong><p>${money(received)} <span>／ ${money(target)}</span></p></div><div class="target-progress"><i style="width:${Math.min(100,pct)}%"></i></div><small>${active?`距離目標還有 ${money(Math.max(0,target-received))}`:`目標自 ${effective.replace('-',' 年 ')} 月起生效，目前先完成服務與獲客建置。`}</small>`;

  const end=localDay(settingValue('阿默合約結束日')||'2027-03-31'),today=localDay(new Date());
  const remaining=end&&end>=today?((end.getFullYear()-today.getFullYear())*12+end.getMonth()-today.getMonth()+1):0;
  document.querySelector('#amo-contract-card').innerHTML=`<div><p class="eyebrow">AMO CONTRACT</p><span>大型企業合作收入</span></div><strong>${remaining}<small> 個月</small></strong><h3>阿默合約剩餘月份</h3><p>合約至 ${end?end.toLocaleDateString('zh-TW',{year:'numeric',month:'long',day:'numeric'}):'尚未設定'}</p><small>${remaining?`續約或接替企業案要在到期前完成提案。`:'合約已到期，請更新續約或接替方案。'}</small>`;
}

function serviceLineName(row) {
  const service=state.services.find(item=>item['服務ID']===row['服務ID'])||{},category=String(service['類別']||''),text=`${row['服務項目']||''} ${row['專案']||''}`;
  if(/網站|建站|系統|Idealflow/i.test(text)) return '建站與系統';
  if(category==='個人形象') return '個人形象';
  if(category==='企業顧問') return '企業顧問';
  if(category==='主題講座'||category==='企業培訓') return '講座與內訓';
  if(category==='甜甜圈高球') return '甜甜圈高球';
  return '其他';
}

function renderServiceDistribution(income) {
  const order=['個人形象','企業顧問','講座與內訓','建站與系統','甜甜圈高球','其他'],totals=Object.fromEntries(order.map(name=>[name,0]));
  income.forEach(row=>totals[serviceLineName(row)]+=numeric(row['應收金額']));
  const grand=Object.values(totals).reduce((sum,value)=>sum+value,0);
  document.querySelector('#service-line-distribution').innerHTML=order.map(name=>{const value=totals[name],pct=grand?Math.round(value/grand*100):0;return `<article><header><strong>${name}</strong><span>${money(value)} · ${pct}%</span></header><div><i style="width:${pct}%"></i></div></article>`;}).join('')+(grand?'':'<p class="chart-empty">目前期間尚未有付費營收，新增後會自動分配到服務線。</p>');
}

function renderExpenseCategoryOptions() {
  const type=document.querySelector('#expense-cost-type').value||'變動成本',select=document.querySelector('#expense-category'),current=select.value;
  const rows=state.costCategories.filter(c=>c['成本屬性']===type&&c['狀態']!=='停用');
  select.innerHTML='<option value="">選擇費用類別</option>'+rows.map(c=>`<option value="${esc(c['費用類別'])}" ${current===c['費用類別']?'selected':''}>${esc(c['費用類別'])}</option>`).join('');
}

function renderCostCategories() {
  const types=['固定成本','變動成本'];
  document.querySelector('#cost-category-groups').innerHTML=types.map(type=>{const rows=state.costCategories.filter(c=>c['成本屬性']===type);return `<section class="cost-category-group"><header><div><strong>${type}</strong><small>${type==='固定成本'?'每月或固定週期發生':'隨使用量、場次或專案變動'}</small></div><span>${rows.filter(c=>c['狀態']!=='停用').length} 項啟用</span></header><div>${rows.map(c=>`<article class="cost-category-item ${c['狀態']==='停用'?'is-disabled':''}"><div><b>${esc(c['費用類別'])}</b><small>${esc(c['備註'])}</small></div><button class="small-button" type="button" data-edit-cost-category data-id="${esc(c['類別ID'])}" data-type="${esc(c['成本屬性'])}" data-name="${esc(c['費用類別'])}" data-status="${esc(c['狀態'])}" data-note="${esc(c['備註'])}">編輯</button></article>`).join('')}</div></section>`;}).join('');
  renderExpenseCategoryOptions();
}

function renderRevenue() {
  renderFinanceControls();
  const income=financeRows(state.income),expenses=financeRows(state.expenses),totals=financeTotals(income,expenses);
  renderFinancePlan();
  document.querySelector('#revenue-kpis').innerHTML=[['營收',money(totals.revenue),'應收總額'],['成本',money(totals.cost),`固定 ${money(totals.fixedCost)} · 變動 ${money(totals.variableCost)}`],['損益',money(totals.revenue-totals.cost),'營收－成本'],['現金淨流',money(totals.received-totals.paid),'實收－實付'],['實收',money(totals.received),'已入帳'],['待收',money(totals.receivable),'應收帳款'],['實付',money(totals.paid),'已付款'],['待付',money(totals.payable),'應付帳款']].map((x,i)=>`<article class="kpi-card finance-kpi ${i===2&&totals.revenue-totals.cost<0?'negative':''}"><p>${x[0]}</p><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join('');
  renderFinanceTrend();renderProjectProfit(income,expenses);renderServiceDistribution(income);
  const cats=[...new Set(state.services.map(x=>x['類別']).filter(Boolean))];
  document.querySelector('#service-filters').innerHTML=`<button class="chip ${!state.serviceCategory?'active':''}" data-service-category="">全部服務</button>`+cats.map(x=>`<button class="chip ${state.serviceCategory===x?'active':''}" data-service-category="${esc(x)}">${esc(x)}</button>`).join('');
  const services=state.services.filter(x=>!state.serviceCategory||x['類別']===state.serviceCategory);
  document.querySelector('#service-grid').innerHTML=services.map(s=>`<article class="service-card"><header><span>${esc(s['類別'])}</span><span class="tag ${statusClass(s['狀態'])}">${esc(s['狀態'])}</span></header><h4>${esc(s['服務名稱'])}</h4><p>${esc(s['官網定位／內容'])}</p><footer><strong>${s['標準價格']?money(s['標準價格']):'洽談報價'}</strong><small>${esc(s['計價單位'])}</small></footer></article>`).join('');
  document.querySelector('#income-table').innerHTML=income.map(r=>`<tr><td>${esc(r['日期'])}</td><td><strong>${esc(r['客戶'])}</strong><small>${esc(r['專案'])} · ${esc(r['收入ID'])}</small></td><td>${esc(r['服務項目'])}</td><td>${money(r['應收金額'])}</td><td>${money(r['已收金額'])}</td><td>${money(r['未收金額'])}</td><td>${esc(r['收款方式'])}<small>${esc(r['發票狀態'])}</small></td><td><span class="tag ${statusClass(r['收款狀態'])}">${esc(r['收款狀態'])}</span></td></tr>`).join('');
  document.querySelector('#expense-table').innerHTML=expenses.map(r=>`<tr><td>${esc(r['日期'])}</td><td><strong>${esc(r['專案'])}</strong><small>${esc(r['支出ID'])}</small></td><td><span class="tag ${r['成本屬性']==='固定成本'?'blue':'amber'}">${esc(r['成本屬性']||'未分類')}</span></td><td>${esc(r['費用類別'])}<small>${esc(r['支出項目'])}</small></td><td>${esc(r['供應商／收款人'])}</td><td>${money(r['應付金額'])}</td><td>${money(r['已付金額'])}</td><td>${money(r['未付金額'])}</td><td>${esc(r['付款方式'])}<small>${esc(r['憑證狀態'])}</small></td><td><span class="tag ${statusClass(r['付款狀態'])}">${esc(r['付款狀態'])}</span></td></tr>`).join('');
  document.querySelector('#expense-empty').hidden=expenses.length>0;
  document.querySelector('#income-service').innerHTML='<option value="">選擇服務</option>'+state.services.map(s=>`<option value="${esc(s['服務ID'])}" data-name="${esc(s['服務名稱'])}">${esc(s['服務名稱'])}</option>`).join('');
  renderCostCategories();
}

function renderGovernance() {
  document.querySelector('#decision-list').innerHTML=[...state.decisions].reverse().map(d=>`<article class="decision-item"><header><div><span>${esc(d['決策ID'])}</span><h4>${esc(d['決策主題'])}</h4></div><span class="tag ${statusClass(d['狀態'])}">${esc(d['狀態'])}</span></header><p>${esc(d['最後決策'])}</p><footer><small>承接：${esc(d['承接任務ID']||'尚未指定')}</small>${d['狀態']==='待CEO確認'?actionButtons({type:'decision',id:d['決策ID'],title:d['決策主題'],context:d['最後決策'],confirm:'已生效',revise:'需調整'}):''}</footer></article>`).join('');
  document.querySelector('#meeting-list').innerHTML=[...state.meetings].reverse().map(m=>`<article class="meeting-item"><div class="meeting-date"><strong>${dateLabel(m['日期']).split('/').pop()}</strong><small>${esc(m['日期'])}</small></div><div><div class="card-top"><h4>${esc(m['會議ID'])} · ${esc(m['會議類型'])}</h4><span class="tag ${statusClass(m['狀態'])}">${esc(m['狀態'])}</span></div><p>${esc(m['重點摘要'])}</p><small>決策 ${esc(m['決策ID']||'—')} · 任務 ${esc(m['任務ID']||'—')}</small></div></article>`).join('');
  const projects=[...new Set(state.tasks.map(x=>x['專案／客戶']).filter(Boolean))]; document.querySelector('#history-project').innerHTML='<option value="">所有專案</option>'+projects.map(x=>`<option>${esc(x)}</option>`).join('');
  renderHistory();
}

function renderHistory() {
  const project=document.querySelector('#history-project').value;
  const taskMap=Object.fromEntries(state.tasks.map(t=>[t['任務ID'],t]));
  const rows=[...state.progress].sort((a,b)=>idNumber(b['更新ID'])-idNumber(a['更新ID'])).filter(p=>!project||taskMap[p['任務ID']]?.['專案／客戶']===project);
  document.querySelector('#history-list').innerHTML=rows.map(p=>{const task=taskMap[p['任務ID']]||{};return `<article><div><span>${esc(p['更新ID'])}</span><strong>${esc(task['專案／客戶']||'共同管理')}</strong><small>${esc(p['更新日'])} · ${esc(p['更新者'])}</small></div><div><h4>${esc(p['任務ID'])} · ${esc(task['任務名稱']||'決策／營運更新')}</h4><p>${esc(p['本次進展'])}</p><small>下一步：${esc(p['下一步／下次檢查日'])}</small></div></article>`;}).join('');
}

function renderExecutives() {
  const roles={Alex:['CSO｜策略長','策略、商業模式、優先排序'],Sophie:['CGO｜成長長','開發、漏斗、品牌與轉換'],Daniel:['COO｜營運長','承接、進度、會議與資料治理']};
  document.querySelector('#executive-grid').innerHTML=latestDaily().map(d=>{const tasks=state.tasks.filter(t=>String(t['負責人']).includes(d['主管'])&&!['已完成','取消'].includes(t['狀態']));return `<article class="executive-card"><header><span>${roles[d['主管']][0]}</span><h3>${esc(d['主管'])}</h3><p>${roles[d['主管']][1]}</p></header><div class="executive-body"><span class="tag ${statusClass(d['狀態'])}">${esc(d['日期'])} · ${esc(d['狀態'])}</span><p class="eyebrow">今日最重要</p><h4>${esc(d['今日最重要事項'])}</h4><p>${esc(d['目前進展'])}</p><div class="brief-box"><b>請 CEO 確認</b><p>${esc(d['需要CEO確認']||'無')}</p><b>主管建議</b><p>${esc(d['主管建議'])}</p></div><small>目前承接 ${tasks.length} 項進行中任務 · ${esc(d['相關任務ID'])}</small></div></article>`;}).join('');
  renderStrategyMap();
  renderFunnels();
}

function renderStrategyMap() {
  const order={P0:0,P1:1,P2:2};
  const rows=[...state.strategies].sort((a,b)=>(order[a['優先級']]??9)-(order[b['優先級']]??9));
  document.querySelector('#strategy-grid').innerHTML=rows.length?rows.map(s=>`<article class="strategy-card ${s['優先級']==='P0'?'is-priority':''}"><header><div><span class="strategy-id">${esc(s['策略ID'])}</span><strong>${esc(s['策略層級'])}</strong></div><div><span class="priority-badge">${esc(s['優先級'])}</span><span class="tag ${statusClass(s['狀態'])}">${esc(s['狀態'])}</span></div></header><h4>${esc(s['策略主題'])}</h4><p class="strategy-model">${esc(s['商務模式'])}</p><div class="strategy-goals"><div><span>90 天成果</span><p>${esc(s['90天成果'])}</p></div><div><span>30 天小目標</span><p>${esc(s['30天小目標'])}</p></div></div><footer><span>指標｜${esc(s['核心指標'])}</span><small>主責｜${esc(s['主責'])}</small>${s['待CEO確認']?`<b>CEO 待確認｜${esc(s['待CEO確認'])}</b>`:''}</footer></article>`).join(''):'<p class="empty-state">尚未建立策略地圖。</p>';
}

function renderFunnels() {
  if(!state.funnels.length){document.querySelector('#funnel-tabs').innerHTML='';document.querySelector('#funnel-detail').innerHTML='<p class="empty-state">尚未建立服務漏斗。</p>';return;}
  if(!state.funnels.some(f=>f['服務ID']===state.funnelService)) state.funnelService=state.funnels[0]['服務ID'];
  document.querySelector('#funnel-tabs').innerHTML=state.funnels.map(f=>`<button class="chip ${state.funnelService===f['服務ID']?'active':''}" data-funnel-service="${esc(f['服務ID'])}"><small>${esc(f['服務ID'])}</small>${esc(f['服務名稱'])}</button>`).join('');
  const f=state.funnels.find(x=>x['服務ID']===state.funnelService);
  const stages=[['01','觸及',f['觸及渠道'],f['30天觸及目標']],['02','有效名單',f['有效名單條件'],f['30天有效名單']],['03','洽談／體驗',f['洽談／體驗'],f['30天洽談／體驗']],['04','成交',f['成交CTA'],f['30天成交']],['05','後端承接',f['後端承接'],'承接後轉換']];
  document.querySelector('#funnel-detail').innerHTML=`<header class="funnel-summary"><div><span>${esc(f['漏斗ID'])} · ${esc(f['類別'])}</span><h4>${esc(f['服務名稱'])}</h4><p>${esc(f['主要客群'])}</p></div><div><span class="tag ${statusClass(f['狀態'])}">${esc(f['狀態'])}</span><small>主責｜${esc(f['主責'])}</small></div></header><div class="funnel-flow">${stages.map((s,i)=>`<article><span>${s[0]}</span><h5>${s[1]}</h5><p>${esc(s[2])}</p><strong>${i<4?'30 天｜':''}${esc(s[3])}</strong></article>`).join('')}</div><div class="funnel-notes"><p><b>名單誘因</b>${esc(f['名單誘因'])}</p><p><b>備註</b>${esc(f['備註']||'無')}</p></div>`;
}

const eventTypes=['阿默陪跑','講座','拍攝','高球','家庭日','學習','人脈交流','其他工作','個人事務'];
const eventTypeClass=type=>`event-type-${eventTypes.indexOf(type)+1}`;

function renderDecisionsNew(){
  const pending=state.decisionsNew.filter(item=>item['狀態']==='待決定').sort((a,b)=>(localDay(a['決定期限'])?.getTime()||Infinity)-(localDay(b['決定期限'])?.getTime()||Infinity));
  const decided=state.decisionsNew.filter(item=>item['狀態']==='已決定').sort((a,b)=>(localDay(b['決定日'])?.getTime()||0)-(localDay(a['決定日'])?.getTime()||0));
  document.querySelector('#pending-decision-count').textContent=`${pending.length} 項等待決定`;
  document.querySelector('#pending-decision-list').innerHTML=pending.length?pending.map(item=>`<article class="pending-decision-item"><header><span>${esc(item.id)}</span><time>${item['決定期限']?`期限 ${esc(item['決定期限'])}`:'尚未排期限'}</time></header><h4>${esc(item['事項'])}</h4><div class="decision-options">${String(item['選項']||'待提出').split(/[、,]/).map(option=>`<span>${esc(option.trim())}</span>`).join('')}</div><p>需要 <strong>${esc(item['一起決定的人']||'圈圈')}</strong> 一起決定</p><button class="button primary" type="button" data-record-decision="${esc(item.id)}">記錄決定</button></article>`).join(''):'<div class="overview-empty"><strong>目前沒有待決定事項</strong></div>';
  document.querySelector('#decided-history').innerHTML=decided.length?decided.map(item=>`<article><div><span>${esc(item.id)}</span><time>${esc(item['決定日']||'')}</time></div><div><h4>${esc(item['事項'])}</h4><p>${esc(item['最後決定'])}</p>${item['後續待辦 id']?`<small>後續待辦：${esc(item['後續待辦 id'])}</small>`:''}</div></article>`).join(''):'<p class="empty-state">還沒有已決定紀錄。</p>';
}

function dayAvailability(date,rows){
  const isWeekday=date.getDay()>0&&date.getDay()<6;if(!isWeekday)return '';
  if(rows.some(event=>event['類型']==='家庭日'||event['時段']==='全天'))return '';
  const morning=rows.some(event=>event['時段']==='上午'),afternoon=rows.some(event=>event['時段']==='下午');
  if(!rows.length||rows.every(event=>event['時段']==='晚上'))return '全天空檔';
  if(morning&&!afternoon)return '下午空檔';if(afternoon&&!morning)return '上午空檔';return '';
}

function calendarDayCard(date,compact=false){
  const key=localIso(date),rows=state.events.filter(event=>event['日期']===key),availability=dayAvailability(date,rows);
  return `<article class="calendar-day-card ${availability?'has-vacancy':''} ${compact?'compact':''}"><header><div><span>${date.toLocaleDateString('zh-TW',{weekday:'short'})}</span><strong>${date.getMonth()+1}/${date.getDate()}</strong></div>${availability?`<button type="button" data-fill-vacancy="${key}" data-vacancy="${availability}">${availability} ＋</button>`:''}</header><div class="calendar-events">${rows.length?rows.map(event=>`<div class="calendar-event ${eventTypeClass(event['類型'])}"><span>${esc(event['時段'])}</span><strong>${esc(event['標題'])}</strong><small>${esc(event['地點']||event['類型'])}</small></div>`).join(''):'<p>尚無行程</p>'}</div></article>`;
}

function renderCalendar(){
  document.querySelectorAll('[data-calendar-mode]').forEach(button=>button.classList.toggle('active',button.dataset.calendarMode===state.calendarMode));document.querySelector('#calendar-month-nav').hidden=state.calendarMode!=='month';
  document.querySelector('#calendar-legend').innerHTML=eventTypes.map(type=>`<span class="${eventTypeClass(type)}"><i></i>${type}</span>`).join('');
  const root=document.querySelector('#calendar-content');
  if(state.calendarMode==='list'){const today=localDay(new Date());root.className='calendar-list';root.innerHTML=Array.from({length:14},(_,index)=>{const date=new Date(today);date.setDate(today.getDate()+index);return calendarDayCard(date);}).join('');return;}
  const first=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth(),1),last=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth()+1,0),start=new Date(first);start.setDate(first.getDate()-first.getDay());const end=new Date(last);end.setDate(last.getDate()+(6-last.getDay()));document.querySelector('#calendar-month-label').textContent=first.toLocaleDateString('zh-TW',{year:'numeric',month:'long'});root.className='calendar-month';root.innerHTML='<div class="calendar-weekdays">'+['日','一','二','三','四','五','六'].map(x=>`<span>${x}</span>`).join('')+'</div><div class="calendar-month-grid">'+Array.from({length:Math.round((end-start)/86400000)+1},(_,index)=>{const date=new Date(start);date.setDate(start.getDate()+index);return `<div class="${date.getMonth()===first.getMonth()?'':'outside-month'}">${calendarDayCard(date,true)}</div>`;}).join('')+'</div>';
}

function openTaskDialog(task=null,options={}){const form=document.querySelector('#task-form');form.reset();const editing=Boolean(task);document.querySelector('#task-dialog-title').textContent=editing?'編輯待辦':options.weekly?'新增本週重點':'新增待辦';document.querySelector('#task-submit').textContent=editing?'儲存修改':'儲存待辦';form.elements.action.value=editing?'taskEdit':'taskNew';form.elements.id.value=task?.id||'';form.elements.title.value=task?.['待辦']||'';form.elements.owner.value=task?.['負責人']||'圈圈';form.elements.status.value=task?.['狀態']||'未開始';form.elements.importance.value=task?.['重要程度']||'一般';form.elements.workstreamId.value=task?.['工作線 id']||state.taskWorkstream||state.workstreams[0]?.id||'';form.elements.due.value=task?.['期限']||(options.weekly?localIso(new Date()):'');form.elements.next.value=task?.['下一步']||'';form.elements.source.value=task?.['來源文件']||'';document.querySelector('#task-dialog').showModal();}
function openDecisionDialog(item){const form=document.querySelector('#decision-form');form.reset();const record=Boolean(item);document.querySelector('#decision-dialog-title').textContent=record?'記錄決定':'新增待決定';form.elements.action.value=record?'decisionRecord':'decisionNew';form.elements.id.value=item?.id||'';form.elements.title.value=item?.['事項']||'';form.elements.options.value=item?.['選項']||'';form.elements.people.value=item?.['一起決定的人']||'';form.elements.due.value=item?.['決定期限']||'';form.elements.decisionDate.value=localIso(new Date());form.elements.finalDecision.required=record;document.querySelectorAll('.decision-record-only').forEach(el=>el.hidden=!record);document.querySelectorAll('.followup-fields').forEach(el=>el.hidden=true);document.querySelector('#decision-dialog').showModal();}
function openEventDialog(date='',vacancy=''){const form=document.querySelector('#event-form');form.reset();form.elements.date.value=date||localIso(new Date());form.elements.period.value=vacancy.includes('上午')?'上午':vacancy.includes('下午')?'下午':'全天';form.elements.type.value='其他工作';if(vacancy)form.elements.title.placeholder=`這段${vacancy}要安排什麼？`;document.querySelector('#event-dialog').showModal();}
function openMetricsDialog(){const form=document.querySelector('#metrics-form'),latest=sortedMetrics().at(-1)||{};form.reset();form.elements.date.value=localIso(new Date());form.elements.ig.value=numeric(latest['IG 粉絲']);form.elements.fb.value=numeric(latest['FB 粉絲']);form.elements.threads.value=numeric(latest['Threads 粉絲']);form.elements.line.value=numeric(latest['LINE 好友']);form.elements.registrations.value=numeric(latest['講座報名']);form.elements.testimonials.value=numeric(latest['見證數']);form.elements.posts.value=numeric(latest['發文數']);form.elements.videos.value=numeric(latest['短影音數']);document.querySelector('#metrics-dialog').showModal();}

function submitSimpleForm(event){event.preventDefault();const form=event.currentTarget,params=Object.fromEntries(new FormData(form).entries());if(postForm(params))form.closest('dialog').close();}
function submitDecisionForm(event){event.preventDefault();const form=event.currentTarget,params=Object.fromEntries(new FormData(form).entries());params.createFollowup=form.elements.createFollowup.checked?'yes':'';if(postForm(params))form.closest('dialog').close();}

function openAction(button) {
  const form=document.querySelector('#action-form');
  form.elements.action.value=button.dataset.type;
  form.elements.id.value=button.dataset.id;
  form.elements.status.value=button.dataset.status;
  form.elements.note.value='';
  document.querySelector('#action-title').textContent=`${button.dataset.status==='已生效'||button.dataset.status==='進行中'?'確認':'退回'}｜${button.dataset.id} ${button.dataset.title}`;
  document.querySelector('#action-context').textContent=button.dataset.context;
  document.querySelector('#action-dialog').showModal();
}

function postForm(params) {
  if(!WRITE_ENDPOINT){showToast('寫入功能尚未完成 Google 授權，可先關閉視窗繼續查看',false);return false;}
  const form=document.createElement('form'); form.method='POST'; form.action=WRITE_ENDPOINT; form.target='write-target'; form.hidden=true;
  Object.entries(params).forEach(([k,v])=>{const input=document.createElement('input');input.name=k;input.value=v??'';form.append(input);});
  document.body.append(form); form.submit(); form.remove(); showToast('正在送出到試算表…');return true;
}

function submitAction(event) {
  event.preventDefault(); const fd=new FormData(event.currentTarget);
  postForm(Object.fromEntries(fd.entries())); document.querySelector('#action-dialog').close();
}

function submitIncome(event) {
  event.preventDefault(); const fd=new FormData(event.currentTarget),select=document.querySelector('#income-service'),option=select.options[select.selectedIndex];
  const params=Object.fromEntries(fd.entries());params.action='income';params.service=option?.dataset.name||option?.text||'';
  postForm(params);document.querySelector('#income-dialog').close();
}

function submitExpense(event) {
  event.preventDefault();const params=Object.fromEntries(new FormData(event.currentTarget).entries());params.action='expense';
  postForm(params);document.querySelector('#expense-dialog').close();
}

function openCostCategory(item) {
  const form=document.querySelector('#cost-category-form');form.reset();
  form.elements.id.value=item?.dataset.id||'';form.elements.costType.value=item?.dataset.type||'變動成本';form.elements.name.value=item?.dataset.name||'';form.elements.status.value=item?.dataset.status||'啟用';form.elements.note.value=item?.dataset.note||'';
  document.querySelector('#cost-category-title').textContent=item?'編輯費用類別':'新增費用類別';document.querySelector('#cost-category-dialog').showModal();
}

function submitCostCategory(event) {
  event.preventDefault();const params=Object.fromEntries(new FormData(event.currentTarget).entries());params.action='expenseCategory';
  postForm(params);document.querySelector('#cost-category-dialog').close();
}

function openInbox() {
  const form=document.querySelector('#inbox-form');form.reset();
  const categories=['策略與商務','業務開發','品牌自媒體','LINE經營','Idealflow / CRM','網站與內容','服務產品','財務','營運管理','合作夥伴'];
  document.querySelector('#inbox-category').innerHTML=categories.map(x=>`<option>${x}</option>`).join('');
  document.querySelector('#inbox-goal').innerHTML='<option value="">先收件，尚未歸屬</option>'+state.operatingMap.filter(g=>['2026建置目標','90天目標','30天目標'].includes(g['層級'])).map(g=>`<option value="${esc(g['目標ID'])}">${esc(g['目標ID'])} · ${esc(g['目標／方向'])}</option>`).join('');
  document.querySelector('#inbox-dialog').showModal();
}

function submitInbox(event) {
  event.preventDefault();const params=Object.fromEntries(new FormData(event.currentTarget).entries());params.action='inbox';
  postForm(params);document.querySelector('#inbox-dialog').close();
}

let toastTimer;
function showToast(message,ok=true){const toast=document.querySelector('#toast');toast.textContent=message;toast.className=`toast show ${ok?'ok':'error'}`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3200);}

function setSync(mode,text){const badge=document.querySelector('#sync-badge');badge.className=`sync-state ${mode}`;badge.querySelector('span').textContent=text;}
function loadJsonp(url){return new Promise((resolve,reject)=>{const cb=`__hooo_${Date.now()}_${Math.random().toString(36).slice(2)}`,script=document.createElement('script'),timer=setTimeout(()=>done(new Error('同步逾時')),15000);function done(err,data){clearTimeout(timer);script.remove();delete window[cb];err?reject(err):resolve(data);}window[cb]=data=>done(null,data);script.onerror=()=>done(new Error('無法連線'));script.src=`${url}${url.includes('?')?'&':'?'}callback=${encodeURIComponent(cb)}&t=${Date.now()}`;document.head.append(script);});}
async function loadSnapshot(){const res=await fetch(`./data.json?t=${Date.now()}`,{cache:'no-store'});if(!res.ok)throw new Error('備援資料讀取失敗');return res.json();}

function applyData(data,source){
  if(!data?.sheets?.tasks?.values) throw new Error('資料格式不完整');
  state.data=data; const s=data.sheets;
  state.goals=objects(s.goals?.values||seed.goals); state.brandFoundation=objects(s.brandFoundation?.values||brandFoundationSeed); state.operatingMap=objects(s.operatingMap?.values||operatingMapSeed); state.inbox=objects(s.inbox?.values||inboxSeed); state.daily=objects(s.daily?.values||seed.daily); state.tasks=objects(s.tasks.values);
  state.tasks.forEach(t=>{const m=taskMetaSeed[t['任務ID']];if(m){if(!t['目標ID'])t['目標ID']=m[0];if(!t['工作類別'])t['工作類別']=m[1];if(!t['工作類型'])t['工作類型']=m[2];if(!t['完成進度%'])t['完成進度%']=m[3];}});
  state.progress=objects(s.progress?.values||[]); state.decisions=objects(s.decisions?.values||[]); state.meetings=objects(s.meetings?.values||[]);
  state.services=objects(s.services?.values||seed.services); state.income=objects(s.income?.values||seed.income); state.expenses=objects(s.expenses?.values||seed.expenses); state.costCategories=objects(s.costCategories?.values||seed.costCategories);
  state.strategies=objects(s.strategies?.values||seed.strategies); state.funnels=objects(s.funnels?.values||seed.funnels);
  state.settings=objects(s.settings?.values||settingsSeed); state.workstreams=objects(s.workstreams?.values||workstreamsSeed); state.tasksNew=objects(s.tasksNew?.values||tasksNewSeed); state.decisionsNew=objects(s.decisionsNew?.values||decisionsNewSeed); state.events=objects(s.events?.values||eventsSeed); state.metrics=objects(s.metrics?.values||metricsSeed); state.docs=objects(s.docs?.values||docsSeed);
  document.querySelectorAll('[data-sheet-link]').forEach(a=>a.href=data.sourceUrl||'https://docs.google.com/spreadsheets/d/1omzCYbgnZ7uSJWlIjvbAaVBfv0no-GJzkLeInVKEx_c/edit');
  const stamp=new Date(data.generatedAt||Date.now()).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false});
  document.querySelector('#sync-time').textContent=`${source==='live'?'即時同步':'備援快照'}：${stamp}`; setSync(source==='live'?'live':'fallback',source==='live'?'已連線試算表':'使用備援快照');
  renderOverview();renderGoals();renderKpis();renderInbox();renderWorkOverview();renderDaily();populateTaskFilters();renderTasks();renderDecisionsNew();renderCalendar();renderMetrics();renderRevenue();renderDocs();renderExecutives();
}

async function syncData(){
  if(state.syncing)return;state.syncing=true;document.querySelector('#sync-now').disabled=true;setSync('syncing','同步中');
  try{if(!LIVE_ENDPOINT)throw new Error('未設定即時端點');applyData(await loadJsonp(LIVE_ENDPOINT),'live');}
  catch(error){try{applyData(await loadSnapshot(),'fallback');showToast('即時連線暫時失敗，已顯示備援資料',false);}catch(fallback){setSync('error','資料讀取失敗');showToast('資料讀取失敗',false);}}
  finally{state.syncing=false;document.querySelector('#sync-now').disabled=false;}
}

document.addEventListener('click',event=>{
  const close=event.target.closest('[data-close-dialog]'); if(close){close.closest('dialog')?.close();return;}
  const moreToggle=event.target.closest('#mobile-more-toggle');if(moreToggle){const menu=document.querySelector('#mobile-more-menu'),opening=menu.hidden;menu.hidden=!opening;moreToggle.setAttribute('aria-expanded',String(opening));return;}
  const nav=event.target.closest('[data-view]'); if(nav)showView(nav.dataset.view);
  const jump=event.target.closest('[data-jump]'); if(jump)showView(jump.dataset.jump);
  const overviewAdd=event.target.closest('#overview-add-item');if(overviewAdd)openInbox();
  const weeklyAdd=event.target.closest('#add-weekly-focus');if(weeklyAdd)openTaskDialog(null,{weekly:true});
  const editTask=event.target.closest('[data-edit-task]');if(editTask)openTaskDialog(state.tasksNew.find(task=>task.id===editTask.dataset.editTask)||null);
  const stream=event.target.closest('[data-workstream]');if(stream){state.taskWorkstream=stream.dataset.workstream;populateTaskFilters();renderTasks();showView('tasks');}
  const taskStream=event.target.closest('[data-task-stream]');if(taskStream){state.taskWorkstream=state.taskWorkstream===taskStream.dataset.taskStream?'':taskStream.dataset.taskStream;populateTaskFilters();renderTasks();}
  const cat=event.target.closest('[data-service-category]'); if(cat){state.serviceCategory=cat.dataset.serviceCategory;renderRevenue();}
  const funnel=event.target.closest('[data-funnel-service]'); if(funnel){state.funnelService=funnel.dataset.funnelService;renderFunnels();}
  const level=event.target.closest('[data-goal-level]'); if(level){state.goalLevel=level.dataset.goalLevel;renderGoalTree();}
  const mode=event.target.closest('[data-finance-mode]'); if(mode){state.financeMode=mode.dataset.financeMode;renderRevenue();}
  const editCategory=event.target.closest('[data-edit-cost-category]');if(editCategory)openCostCategory(editCategory);
  const action=event.target.closest('[data-action-open]'); if(action)openAction(action);
  const recordDecision=event.target.closest('[data-record-decision]');if(recordDecision)openDecisionDialog(state.decisionsNew.find(item=>item.id===recordDecision.dataset.recordDecision));
  const vacancy=event.target.closest('[data-fill-vacancy]');if(vacancy)openEventDialog(vacancy.dataset.fillVacancy,vacancy.dataset.vacancy);
  const calendarMode=event.target.closest('[data-calendar-mode]');if(calendarMode){state.calendarMode=calendarMode.dataset.calendarMode;renderCalendar();}
  const calendarShift=event.target.closest('[data-calendar-shift]');if(calendarShift){state.calendarMonth=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth()+Number(calendarShift.dataset.calendarShift),1);renderCalendar();}
  const floating=event.target.closest('#floating-add');if(floating){const menu=document.querySelector('#quick-add-menu');menu.hidden=!menu.hidden;return;}
  const quick=event.target.closest('[data-quick-add]');if(quick){document.querySelector('#quick-add-menu').hidden=true;({task:openTaskDialog,decision:()=>openDecisionDialog(null),event:()=>openEventDialog(),metrics:openMetricsDialog,income:()=>document.querySelector('#add-income').click(),expense:()=>document.querySelector('#add-expense').click(),coach:()=>{showView('coach');window.HOOOCoach?.startNew();}})[quick.dataset.quickAdd]?.();}
});
document.querySelector('#task-workstream-filter').addEventListener('change',event=>{state.taskWorkstream=event.target.value;renderTasks();});
document.querySelector('#task-status-filter').addEventListener('change',event=>{state.taskStatus=event.target.value;renderTasks();});
document.querySelector('#task-priority-filter').addEventListener('change',event=>{state.taskPriority=event.target.value;renderTasks();});
document.querySelector('#task-deadline-filter').addEventListener('change',event=>{state.taskDeadline=event.target.value;renderTasks();});
document.querySelector('#clear-task-filters').addEventListener('click',()=>{state.taskWorkstream='';state.taskStatus='';state.taskPriority='';state.taskDeadline='all';populateTaskFilters();renderTasks();});
document.querySelector('#sync-now').addEventListener('click',syncData);
document.querySelector('#sync-social').addEventListener('click',()=>postForm({action:'socialSync'}));
document.querySelector('#finance-year').addEventListener('change',event=>{state.financeYear=Number(event.target.value);renderRevenue();});
document.querySelector('#finance-month').addEventListener('change',event=>{state.financeMonth=Number(event.target.value);renderRevenue();});
document.querySelector('#add-income').addEventListener('click',()=>{const form=document.querySelector('#income-form');form.reset();form.elements.date.value=new Date().toISOString().slice(0,10);document.querySelector('#income-dialog').showModal();});
document.querySelector('#add-expense').addEventListener('click',()=>{const form=document.querySelector('#expense-form');form.reset();form.elements.date.value=new Date().toISOString().slice(0,10);renderExpenseCategoryOptions();document.querySelector('#expense-dialog').showModal();});
document.querySelector('#add-cost-category').addEventListener('click',()=>openCostCategory(null));
['add-inbox-item','add-inbox-item-small'].forEach(id=>document.querySelector('#'+id).addEventListener('click',openInbox));
document.querySelector('#add-task').addEventListener('click',()=>openTaskDialog());document.querySelector('#add-decision').addEventListener('click',()=>openDecisionDialog(null));document.querySelector('#add-event').addEventListener('click',()=>openEventDialog());
document.querySelector('#add-metrics').addEventListener('click',openMetricsDialog);
document.querySelector('#expense-cost-type').addEventListener('change',renderExpenseCategoryOptions);
document.querySelector('#action-form').addEventListener('submit',submitAction);
document.querySelector('#income-form').addEventListener('submit',submitIncome);
document.querySelector('#expense-form').addEventListener('submit',submitExpense);
document.querySelector('#cost-category-form').addEventListener('submit',submitCostCategory);
document.querySelector('#inbox-form').addEventListener('submit',submitInbox);
document.querySelector('#task-form').addEventListener('submit',submitSimpleForm);document.querySelector('#decision-form').addEventListener('submit',submitDecisionForm);document.querySelector('#event-form').addEventListener('submit',submitSimpleForm);
document.querySelector('#metrics-form').addEventListener('submit',submitSimpleForm);
document.querySelector('#decision-form').elements.createFollowup.addEventListener('change',event=>document.querySelectorAll('.followup-fields').forEach(el=>el.hidden=!event.target.checked));
document.querySelector('#event-type').innerHTML=eventTypes.map(type=>`<option>${type}</option>`).join('');
document.addEventListener('change',event=>{
  const statusSelect=event.target.closest('[data-new-task-status]');
  if(statusSelect){const old=statusSelect.dataset.currentStatus,newStatus=statusSelect.value;if(!WRITE_ENDPOINT){statusSelect.value=old;showToast('網站寫入尚未啟用，請先到 Google Sheet 更新',false);return;}postForm({action:'taskNewStatus',id:statusSelect.dataset.newTaskStatus,status:newStatus});statusSelect.dataset.currentStatus=newStatus;return;}
  const prioritySelect=event.target.closest('[data-new-task-priority]');
  if(prioritySelect){const old=prioritySelect.dataset.currentPriority,importance=prioritySelect.value;if(!WRITE_ENDPOINT){prioritySelect.value=old;showToast('網站寫入尚未啟用，請先到 Google Sheet 更新',false);return;}postForm({action:'taskPriority',id:prioritySelect.dataset.newTaskPriority,importance});prioritySelect.dataset.currentPriority=importance;}
});
function bindAmountCalculator(formId,paidName) {
  const form=document.querySelector(formId),recalculate=()=>{const qty=numeric(form.elements.quantity.value),price=numeric(form.elements.unitPrice.value);if(qty&&price)form.elements.amountDue.value=qty*price;};
  form.elements.quantity.addEventListener('input',recalculate);form.elements.unitPrice.addEventListener('input',recalculate);
  form.elements.amountDue.addEventListener('input',()=>{const due=numeric(form.elements.amountDue.value),paid=numeric(form.elements[paidName].value);if(paid>due)form.elements[paidName].value=due;});
}
bindAmountCalculator('#income-form','amountReceived');bindAmountCalculator('#expense-form','amountPaid');
document.querySelector('#income-service').addEventListener('change',event=>{const service=state.services.find(s=>s['服務ID']===event.target.value),price=numeric(service?.['標準價格']);if(price){const form=document.querySelector('#income-form');form.elements.unitPrice.value=price;form.elements.unitPrice.dispatchEvent(new Event('input'));}});
window.addEventListener('message',event=>{if(event.data?.source!=='hooo-hq')return;const result=event.data.payload;showToast(result.message,result.ok);if(result.ok)setTimeout(syncData,1200);});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));

syncData();
setInterval(syncData,5*60*1000);
