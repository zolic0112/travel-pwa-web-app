# 馬來西亞 6天5夜 PWA

## v2 新增
- 首頁「下一個行程」與自動倒數（UTC+8）
- 固定航班／高鐵／關鍵截止時間倒數
- 每日規劃：可自行加入景點、餐廳、交通、集合、購物等
- 自訂行程可編輯／刪除，資料保存在瀏覽器 localStorage
- 下一個行程會把自訂行程一起納入判斷
- 原有風險檢查、待辦、費用、離線 PWA 保留

## 部署
這是純靜態網站，可直接部署至 GitHub Pages、Cloudflare Pages、Netlify、Vercel 等 HTTPS 主機。
不要只雙擊 index.html 測 PWA；Service Worker 需要 HTTPS 或 localhost。

## 本機測試
在此資料夾執行：

```bash
python3 -m http.server 8080
```

然後開啟 http://localhost:8080

## 資料儲存
待辦與每日自訂行程都只存在目前瀏覽器／裝置，不會多人同步，也沒有後端資料庫。
