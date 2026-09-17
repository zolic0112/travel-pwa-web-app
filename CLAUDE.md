# 給接手的人（包含未來的 Claude）

**動任何東西之前先讀 `docs/`。** 這個專案的設計理由不在程式碼裡，也不在對話紀錄裡 —— 對話會被壓縮、會消失，檔案不會。

| 讀什麼 | 什麼時候 |
|---|---|
| `docs/product.md` | **每次開始工作前。** 這是什麼產品、給誰、不做什麼 |
| `docs/architecture.md` | 要改結構、接 AI、考慮後端之前 |
| `docs/decisions.md` | **覺得某個設計很怪、想「順手改掉」之前** |
| `docs/roadmap.md` | 問「接下來做什麼」的時候 |
| `README.md` | 怎麼跑、怎麼開新行程 |

## 三件最容易犯的錯

1. **把馬來西亞行程當成產品。** 它是 use case #1。每個功能都要問：換一趟旅行還會動嗎？
2. **改了 `app.js` 或 `styles.css` 沒跑 smoke。** CI 不會跑它（見 D10），只有人會跑。
3. **看到不合常規的設計就改掉。** `decisions.md` 裡每一條都寫了推翻條件，先看那一欄。

## 每次改完要做的事

```bash
node scripts/check-tokens.mjs                      # CSS 自訂屬性
node scripts/check-trip.mjs                        # 行程資料
node scripts/check-trip.mjs scripts/fixtures/sample.trip.js

python3 -m http.server 8099 &                      # smoke 需要一個 server
node scripts/smoke.mjs                             # 改 app.js / styles.css 一定要跑
```

改了 `app.js`、`styles.css`、`index.html` 任何一個，**`sw.js` 的 `VERSION` 要 +1**，不然使用者手機上拿到的是舊快取。

## 決策要寫下來

在這個專案做了一個**未來的人會想問「為什麼要這樣」**的決定時，往 `docs/decisions.md` 加一條，格式照既有的：決定什麼、為什麼、**什麼時候應該推翻它**。

最後一項最重要。沒有推翻條件的決策會變成沒有人敢動的教條。
