# 旅程助手 PWA

一支純靜態、零相依的行程 PWA。目前載的是「馬來西亞 6天5夜」，但**行程資料與程式是分開的**：
換一趟旅行只需要換 `trip.js`，不必動 `app.js`。

## 檔案分工

| 檔案 | 職責 |
|---|---|
| `trip.js` | **這趟旅行**。日期、航班、住宿、待辦、費用、資料來源、事件類型與幣別，全部在這裡。 |
| `app.js` | 渲染與互動。不含任何日期、班號、地名或金額。含帶隊／跟隊兩種模式。 |
| `index.html` | 版面骨架。標題、副標、航段條、提醒、資料檢查日都是空的，開機時由 `trip.js` 填。 |
| `styles.css` | 設計語彙（色票、間距、圓角、層級），以 CSS 自訂屬性為單一來源。 |
| `sw.js` | 離線快取。shell 走 network-first，圖檔走 cache-first。 |
| `manifest.webmanifest` | 安裝資訊。**唯一需要手動跟著改的檔案**（瀏覽器在任何 script 之前就讀它），`check-trip.mjs` 會檢查它和 `trip.js` 是否一致。 |

## 開一趟新旅行

1. 複製 `trip.js`，改 `meta.id`。這個 id 是 localStorage 的命名空間，換了 id 新旅行就有自己的勾選、自訂行程與主題，不會沿用上一趟的。
2. 換掉 `meta`、`days`、`todos`、`costs`、`sources`。`meta.currency`、`meta.party`、`meta.tz` / `meta.timeZone` 都會被畫面沿用，不必另外改程式。
3. 需要倒數的事件，直接在那筆 event 上掛 `milestone`。倒數清單是從事件推導出來的，所以不可能指到一筆已經被改掉或刪掉的列。
4. 要在跟隊模式出現的事件，在那筆 event 上掛 `brief`：`line`（≤12 字的口令）、`because`、`steps`、`need`、`fallback`，以及 `window`（`from` / `to` 必填，`wall` 是真正的死線）。只有帶 `milestone` 的事件才能掛 `brief`。
5. 每則 `todos` 都要有唯一的 `id`。**勾選狀態是存在這個 id 上的**，所以 id 一旦發出去就不要再改；順序可以隨便調、中間可以插件新的，別人的勾選不會跑掉。
6. 同步 `manifest.webmanifest` 的 `name` / `short_name` / `description`。
7. 跑 `node scripts/check-trip.mjs`。

`scripts/fixtures/sample.trip.js` 是一份完全不同的旅行（東京、日圓、2 人、UTC+9），存在的理由是證明 app 沒有偷藏任何一趟旅行的知識；smoke 測試會用它整個跑一次。

## 檢查

```bash
node scripts/check-tokens.mjs        # CSS 自訂屬性、括號、孤兒選擇器
node scripts/check-trip.mjs          # 行程資料（CI 會跑）
node scripts/check-trip.mjs 其他.js   # 檢查任何一份行程檔

# 瀏覽器 smoke（非相依、不進 CI，改完手動跑）
python3 -m http.server 8099 &
npm i -g playwright && npx playwright install chromium   # 首次
node scripts/smoke.mjs
```

前兩支在 CI（`.github/workflows/deploy-pages.yml`）中於部署前執行。

## 部署

純靜態，可直接放 GitHub Pages / Cloudflare Pages / Netlify / Vercel。
不要只雙擊 `index.html` 測 PWA；Service Worker 需要 HTTPS 或 localhost。

## 本機

```bash
python3 -m http.server 8080   # http://localhost:8080
```

## 資料儲存

待辦勾選、「我的」待辦與自訂行程都只存在目前瀏覽器／裝置，沒有後端，也不會多人同步。

共同的東西（固定行程、出發前待辦、費用）放 `trip.js`，跟著部署走，所有人打開都一樣；
個人的東西（勾選進度、我的待辦、自訂行程）留在 localStorage。**用「放哪裡」區分，不是用每項一個開關。**
