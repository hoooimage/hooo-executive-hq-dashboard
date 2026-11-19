# HOOO AI Executive HQ Dashboard

HOOO 的一人公司作戰儀表板，畫面來源位於 `dist/`。新版以 2026/11–2027/3
準備期為核心，手機開啟後先看到倒數、關鍵數字、本週重點、待決定、近期行程
與五條工作線。待辦可依工作線、狀態、重要程度與期限篩選；總覽的本週重點可直接新增與編輯。待決定可記錄結果並承接後續待辦；行事曆可切換未來 14 天與月曆，並顯示可工作空檔。數字成效可保留每週基準、查看 IG／Facebook／Threads／LINE 趨勢；收支頁另顯示月營收目標、阿默合約剩餘月份與服務線營收分布；文件頁直接讀取 Docs 工作表。

第 8 個分頁「陪跑紀錄」是款待服務顧問的私人工作區，包含手機填寫、自動草稿、紀錄總覽、五步驟教材素材庫、月報、CSV 補登與備份。視覺沿用阿默門市記憶點工具的奶油、酒紅與焦糖色系；資料仍存在同一份 HOOO 試算表，但不進入公開資料端點或備援快照。

## GitHub Pages

專案已準備手動發布流程：在 GitHub 的 **Actions** 頁面執行
`Deploy HOOO Dashboard to GitHub Pages`。

> Dashboard 內含公司任務、決策與進度。啟用 GitHub Pages 前，請先確認
> 網址的公開範圍符合公司的資料權限規則。

## 資料與操作

Google Sheet 是唯一正式資料主檔。Dashboard 目前讀取：

- Settings、Workstreams、Tasks、Decisions、Events、Metrics、Docs
- 公司目標、三位主管每日重點
- 共同任務、進度、決策與會議
- 服務項目、營收與成本明細

私人登入端點另外讀寫：

- CoachLogs：每次陪跑的完整顧問紀錄
- CoachTools：依五步驟拆出的常見問題、工具、案例、金句與有效方法

舊的主管、共同任務與決策資料仍保留，但不顯示在新版主要導覽中。

網站開啟時與每 5 分鐘會重新同步；dist/data.json 僅作為同步端點暫時失效時
的備援快照。

## CEO 安全寫入

google-apps-script/Code.gs 提供白名單操作：新增／編輯待辦、更新狀態與重要程度、新增／記錄決定、建立後續待辦、新增行程、新增或更新同日期的每週數字、陪跑紀錄與教材標記，以及原有的收支與類別操作。寫入端點需另外部署為「以存取者身分執行」並要求 Google 登入；程式只允許 `hoooimage@gmail.com` 與 `viannieho@gmail.com`，也不另外建立 Dashboard PIN。

IG、Facebook 與 Threads 的粉絲數每天早上 8 點從公開頁面的描述資訊進行最佳努力同步，也可在數字成效頁手動更新。若平台改版或擋住存取，程式會保留上一筆數字、並在 Settings 記錄同步狀態，不會用 0 覆寫。

公開網站只顯示營運必要欄位；完整試算表與其他內部資料仍受 Google Drive 權限
限制。

陪跑紀錄的 JSONP 讀取只存在於登入端點，並再次檢查目前 Google 帳號。公開讀取端點即使收到 `scope=coach`，未通過白名單也不會回傳任何 CoachLogs／CoachTools 內容。
