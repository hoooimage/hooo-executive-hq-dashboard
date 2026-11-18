# HOOO AI Executive HQ Dashboard

HOOO 的一人公司作戰儀表板，畫面來源位於 `dist/`。新版以 2026/11–2027/3
準備期為核心，手機開啟後先看到倒數、關鍵數字、本週重點、待決定、近期行程
與五條工作線。待辦可依工作線、狀態與期限篩選；待決定可記錄結果並承接後續待辦；行事曆可切換未來 14 天與月曆，並顯示可工作空檔。數字成效可保留每週基準、查看 IG／Facebook／LINE 趨勢；收支頁另顯示月營收目標、阿默合約剩餘月份與服務線營收分布；文件頁直接讀取 Docs 工作表。

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

舊的主管、共同任務與決策資料仍保留，但不顯示在新版主要導覽中。

網站開啟時與每 5 分鐘會重新同步；dist/data.json 僅作為同步端點暫時失效時
的備援快照。

## CEO 安全寫入

google-apps-script/Code.gs 提供白名單操作：新增待辦、更新待辦狀態、新增／記錄決定、建立後續待辦、新增行程、新增或更新同日期的每週數字，以及原有的收支與類別操作。寫入端點需另外部署為「以存取者身分執行」並要求 Google 登入；程式只允許 `hoooimage@gmail.com` 與 `viannieho@gmail.com`，也不另外建立 Dashboard PIN。

公開網站只顯示營運必要欄位；完整試算表與其他內部資料仍受 Google Drive 權限
限制。
