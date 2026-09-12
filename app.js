const trip = {
  days: [
    {date:'10/08（四）', events:[
      {time:'06:40',type:'高鐵',title:'左營 → 桃園（經台中）',meta:['手寫規劃班次','桃園 08:18 抵達','大件行李'],status:'⚠ 待最終確認',level:'caution',note:'手寫：06:40 → 07:40 → 08:18；10/8 車票已進入可預訂區間。',
        route:{kind:'rail',no:'高鐵 南下',from:'左營',fromSub:'高鐵',to:'桃園',toSub:'高鐵',dep:'06:40',arr:'08:18'}},
      {time:'08:18–約08:50',type:'轉乘',title:'高鐵桃園站 → A18 → A13 第二航廈',meta:['桃園機捷','至少抓 30 分'],status:'✓ 可行',note:'A18 步行約 5–10 分；不要把 08:26 當唯一方案，08:32 或後續班次較穩。底線：09:15 前要進入 T2 報到區。'},
      {time:'11:15–16:10',type:'航班',title:'台北 TPE → 吉隆坡 KUL',meta:['托運 23kg','手提 7kg'],status:'✓ 可行',note:'建議 08:45–09:00 到報到區；東南亞線櫃檯約起飛前 2.5 小時開、1 小時前關。',
        route:{kind:'air',no:'JX725',from:'TPE',fromSub:'T2',to:'KUL',toSub:'T1',dep:'11:15',arr:'16:10'}},
      {time:'16:10–約19:00',type:'抵達',title:'KUL 入境、領行李 → Hotel Royal Signature',meta:['KUL T1','抓 1.5–2.5 小時'],status:'✓ 合理',note:'晚間交通視入境排隊與市區路況調整。'},
      {time:'住宿',type:'住宿',title:'Hotel Royal Signature',meta:['吉隆坡','2 晚','2間雙床＋1間大床'],status:'✓ 已確認',note:'住 10/8、10/9；10/10 中午 12:00 前退房。'}
    ]},
    {date:'10/09（五）', events:[{time:'全天',type:'自由行',title:'吉隆坡自由活動',meta:['吉隆坡'],status:'✓ 無衝突',note:'目前沒有固定交通衝突，可加入景點、餐廳與市區交通。'}]},
    {date:'10/10（六）', events:[
      {time:'12:00',type:'退房',title:'Hotel Royal Signature 退房／寄放行李',meta:['吉隆坡'],status:'✓ 可行',note:'晚班機 18:25，退房後有充足空檔。'},
      {time:'建議14:30前',type:'移動',title:'吉隆坡市區 → KUL Terminal 1',meta:['目標 15:30–16:00 抵達'],status:'✓ 建議',note:'不要拖到最後 1.5 小時才離開市區。'},
      {time:'18:25–20:15',type:'航班',title:'吉隆坡 KUL → 古晉 KCH',meta:['托運 20kg','手提 7kg'],status:'✓ 可行',note:'17:25 前完成報到；登機門約起飛前 30 分關閉。',
        route:{kind:'air',no:'MH2528',from:'KUL',fromSub:'T1',to:'KCH',toSub:'T1',dep:'18:25',arr:'20:15'}},
      {time:'約20:15–21:15',type:'抵達',title:'KCH 領行李 → Hilton Kuching',meta:['古晉','抓約 1 小時'],status:'✓ 合理',note:'抵達後直接前往飯店。'},
      {time:'住宿',type:'住宿',title:'Hilton Kuching',meta:['古晉','3 晚','2間雙床＋1間大床'],status:'✓ 已確認',note:'住 10/10、10/11、10/12；10/13 早上已離店，雖訂房可至中午退房。'}
    ]},
    {date:'10/11（日）', events:[{time:'全天',type:'自由行',title:'古晉自由活動',meta:['古晉'],status:'✓ 無衝突',note:'可加入景點、餐廳與 Grab 動線。'}]},
    {date:'10/12（一）', events:[{time:'全天',type:'自由行',title:'古晉自由活動',meta:['古晉'],status:'✓ 無衝突',note:'晚上務必全員秤托運行李，控制在 20kg 內。'}]},
    {date:'10/13（二）', events:[
      {time:'07:15–07:30',type:'移動',title:'Hilton Kuching → KCH',meta:['目標 07:45–08:00 抵達'],status:'✓ 建議',note:'09:55 班機；不要被飯店 12:00 退房時間誤導。'},
      {time:'09:55–11:45',type:'航班',title:'古晉 KCH → 吉隆坡 KUL',meta:['托運 20kg','手提 7kg'],status:'✓ 可行',note:'最晚 08:55 完成報到。',
        route:{kind:'air',no:'MH2543',from:'KCH',fromSub:'T1',to:'KUL',toSub:'T1',dep:'09:55',arr:'11:45'}},
      {time:'11:45–14:30',type:'關鍵轉機',title:'領 MH 行李 → 長榮重新報到／托運',meta:['KUL T1','分開機票','安全窗約 2小時45分'],status:'⚠ 14:30 前必須完成',level:'critical',note:'分開機票不保證直掛，當作「領行李＋重新報到」。BR228 櫃檯約 12:30 開、14:30 關；落地後不吃飯、不購物。若 MH 延誤 ≥90 分鐘，立刻聯絡 EVA／出票平台改票。'},
      {time:'15:30–20:25',type:'航班',title:'吉隆坡 KUL → 台北 TPE',meta:['托運 23kg','手提 7kg','受前段影響'],status:'✓ 受前段影響',level:'caution',note:'14:30 前完成報到；分開機票通常不受後段航司保障。',
        route:{kind:'air',no:'BR228',from:'KUL',fromSub:'T1',to:'TPE',toSub:'T2',dep:'15:30',arr:'20:25'}},
      {time:'20:25–約21:40+',type:'入境轉乘',title:'TPE T2 入境／領行李 → A13 → A18',meta:['至少抓 75 分鐘'],status:'⚠ 勿排太緊',level:'caution',note:'還要計入滑行、下機、入境、等行李、步行與候車。'},
      {time:'22:05 之後',type:'高鐵',title:'桃園 → 左營（經台中）',meta:['尚未訂位','以正式班表為準'],status:'⚠ 待訂位',level:'caution',note:'20:25 落地，入境、領行李到 A18 至少抓 75 分鐘，所以 22:05 之前的班次都不要考慮。抵達 A18 後依實際時間選班次最安全。'}
    ]}
  ],
  todos:[
    {due:'現在',title:'預訂／確認 10/8 左營→桃園高鐵',why:'10/8 已進入一般訂位區間',priority:'高',note:'優先選能在 08:18 或更早抵達桃園的班次'},
    {due:'2026/09/15',title:'查 10/13 桃園→左營正式高鐵班表並訂位',why:'回程需用正式班表確認',priority:'高',note:'22:05 之前的班次都不要考慮，優先保留更晚的備案'},
    {due:'出發前7天',title:'再次確認四段航班時間與航廈',why:'班表與航廈仍可能調整',priority:'高',note:'JX725 / MH2528 / MH2543 / BR228'},
    {due:'出發前3天',title:'確認 MH 是否能協助直掛至 TPE',why:'分開票不保證直掛',priority:'高',note:'即使可直掛，也不要把它當成保證'},
    {due:'出發前2天',title:'完成可用的線上報到／確認座位',why:'減少機場排隊時間',priority:'中',note:'依各航空開放時間'},
    {due:'10/10早上',title:'確認吉隆坡→KUL交通與即時路況',why:'市區塞車有變數',priority:'中',note:'目標 15:30–16:00 到 T1'},
    {due:'10/12晚上',title:'全員托運行李秤重 ≤20kg',why:'MH 是整趟最低托運額度',priority:'高',note:'超重先重分配或加購'},
    {due:'10/13早上',title:'07:15–07:30 離開 Hilton Kuching',why:'確保 09:55 班機有足夠緩衝',priority:'高',note:''},
    {due:'10/13 KUL落地後',title:'直接領行李 → EVA 報到，不逛街不吃正餐',why:'BR228 14:30 關櫃',priority:'高',note:'若 MH 延誤 ≥90 分鐘，立刻聯絡 EVA／出票平台'}
  ],
  costs:[
    {name:'JX725 台北→吉隆坡',cat:'機票',total:47750,per:9550},
    {name:'MH2528＋MH2543 馬航來回',cat:'機票',total:20586,per:4117.2},
    {name:'BR228 吉隆坡→台北',cat:'機票',total:36465,per:7293},
    {name:'Hotel Royal Signature｜雙床2間×2晚',cat:'住宿',total:10480,per:null},
    {name:'Hotel Royal Signature｜大床1間×2晚',cat:'住宿',total:4990,per:null},
    {name:'Hilton Kuching｜雙床2間×3晚',cat:'住宿',total:24302,per:null},
    {name:'Hilton Kuching｜大床1間×3晚',cat:'住宿',total:11464,per:null}
  ],
  sources:[
    ['STARLUX 官方','JX725 桃園 T2；東南亞線報到時間','https://www.starlux-airlines.com/zh-TW/check-in-fly/travel-information/airport-and-transportation/taiwan/taoyuan-international-airport-t2'],
    ['桃園機捷官方','A18 / A13 時刻與轉乘','https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/timetable-A18'],
    ['桃園機捷官方','A13 時刻與末班資訊','https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/timetable-A13'],
    ['Malaysia Airlines 官方','報到櫃檯與登機門截止時間','https://www.malaysiaairlines.com/tw/zh_tw/travel-info/check-in.html'],
    ['EVA Air 官方','KUL BR228 航廈與報到截止','https://www.evaair.com/zh-tw/fly-prepare/at-the-airport/worldwide-airports/?countryCode=KUL'],
    ['EVA Air 官方','分開機票／托運行李規則','https://www.evaair.com/en-tw/fly-prepare/baggage/free-baggage/checked-baggage/'],
    ['台灣高鐵官方','一般對號座訂位規則','https://www.thsrc.com.tw/ArticleContent/d4b49835-e43b-4be8-bc4d-0a1fe74143ff']
  ]
};

/* ── icons ────────────────────────────────────────────────── */
/* Phosphor Icons 2.1.1 (MIT) — official paths, not hand-drawn.
   Every icon sits beside visible text, so all are decorative. */
const P = d => `<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">${d}</svg>`;
const ICO = {
  plane:P("<path d='M185.33,114.21l29.14-27.42.17-.17a32,32,0,0,0-45.26-45.26c0,.06-.11.11-.17.17L141.79,70.67l-83-30.2a8,8,0,0,0-8.39,1.86l-24,24a8,8,0,0,0,1.22,12.31l63.89,42.59L76.69,136H56a8,8,0,0,0-5.65,2.34l-24,24A8,8,0,0,0,29,175.42l36.82,14.73,14.7,36.75.06.16a8,8,0,0,0,13.18,2.47l23.87-23.88A8,8,0,0,0,120,200V179.31l14.76-14.76,42.59,63.89a8,8,0,0,0,12.31,1.22l24-24a8,8,0,0,0,1.86-8.39Zm-.07,97.23-42.59-63.88A8,8,0,0,0,136.8,144c-.27,0-.53,0-.79,0a8,8,0,0,0-5.66,2.35l-24,24A8,8,0,0,0,104,176v20.69L90.93,209.76,79.43,181A8,8,0,0,0,75,176.57l-28.74-11.5L59.32,152H80a8,8,0,0,0,5.66-2.34l24-24a8,8,0,0,0-1.22-12.32L44.56,70.74l13.5-13.49,83.22,30.26a8,8,0,0,0,8.56-2L180.78,52.6A16,16,0,0,1,203.4,75.23l-32.87,30.93a8,8,0,0,0-2,8.56l30.26,83.22Z'/>"),
  train:P("<path d='M184,24H72A32,32,0,0,0,40,56V184a32,32,0,0,0,32,32h8L65.6,235.2a8,8,0,1,0,12.8,9.6L100,216h56l21.6,28.8a8,8,0,1,0,12.8-9.6L176,216h8a32,32,0,0,0,32-32V56A32,32,0,0,0,184,24ZM72,40H184a16,16,0,0,1,16,16v64H56V56A16,16,0,0,1,72,40ZM184,200H72a16,16,0,0,1-16-16V136H200v48A16,16,0,0,1,184,200ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm88,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z'/>"),
  transfer:P("<path d='M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z'/>"),
  car:P("<path d='M240,112H211.31L168,68.69A15.86,15.86,0,0,0,156.69,64H44.28A16,16,0,0,0,31,71.12L1.34,115.56A8.07,8.07,0,0,0,0,120v48a16,16,0,0,0,16,16H33a32,32,0,0,0,62,0h66a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V128A16,16,0,0,0,240,112ZM44.28,80H156.69l32,32H23ZM64,192a16,16,0,1,1,16-16A16,16,0,0,1,64,192Zm128,0a16,16,0,1,1,16-16A16,16,0,0,1,192,192Zm48-24H223a32,32,0,0,0-62,0H95a32,32,0,0,0-62,0H16V128H240Z'/>"),
  pin:P("<path d='M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z'/>"),
  bed:P("<path d='M216,72H32V48a8,8,0,0,0-16,0V208a8,8,0,0,0,16,0V176H240v32a8,8,0,0,0,16,0V112A40,40,0,0,0,216,72ZM32,88h72v72H32Zm88,72V88h96a24,24,0,0,1,24,24v48Z'/>"),
  luggage:P("<path d='M104,88v96a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm24-8a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,128,80Zm32,0a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,160,80Zm48-16V208a16,16,0,0,1-16,16H176v16a8,8,0,0,1-16,0V224H96v16a8,8,0,0,1-16,0V224H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H88V24A24,24,0,0,1,112,0h32a24,24,0,0,1,24,24V48h24A16,16,0,0,1,208,64ZM104,48h48V24a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8Zm88,160V64H64V208H192Z'/>"),
  sun:P("<path d='M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z'/>"),
  alert:P("<path d='M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z'/>"),
  clock:P("<path d='M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z'/>"),
  passport:P("<path d='M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z'/>"),
  camera:P("<path d='M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z'/>"),
  food:P("<path d='M72,88V40a8,8,0,0,1,16,0V88a8,8,0,0,1-16,0ZM216,40V224a8,8,0,0,1-16,0V176H152a8,8,0,0,1-8-8,268.75,268.75,0,0,1,7.22-56.88c9.78-40.49,28.32-67.63,53.63-78.47A8,8,0,0,1,216,40ZM200,53.9c-32.17,24.57-38.47,84.42-39.7,106.1H200ZM119.89,38.69a8,8,0,1,0-15.78,2.63L112,88.63a32,32,0,0,1-64,0l7.88-47.31a8,8,0,1,0-15.78-2.63l-8,48A8.17,8.17,0,0,0,32,88a48.07,48.07,0,0,0,40,47.32V224a8,8,0,0,0,16,0V135.32A48.07,48.07,0,0,0,128,88a8.17,8.17,0,0,0-.11-1.31Z'/>"),
  users:P("<path d='M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z'/>"),
  bag:P("<path d='M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V72H40V56Zm0,144H40V88H216V200Zm-40-88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z'/>"),
  dot:P("<path d='M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z'/>"),
  wallet:P("<path d='M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z'/>"),
  route:P("<path d='M200,168a32.06,32.06,0,0,0-31,24H72a32,32,0,0,1,0-64h96a40,40,0,0,0,0-80H72a8,8,0,0,0,0,16h96a24,24,0,0,1,0,48H72a48,48,0,0,0,0,96h97a32,32,0,1,0,31-40Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,200,216Z'/>"),
  shield:P("<path d='M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z'/>"),
  check:P("<path d='M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z'/>"),
  sun:P("<path d='M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z'/>"),
  moon:P("<path d='M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z'/>"),
  system:P("<path d='M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24h72v16H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V200h72a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40ZM48,56H208a8,8,0,0,1,8,8v80H40V64A8,8,0,0,1,48,56ZM208,184H48a8,8,0,0,1-8-8V160H216v16A8,8,0,0,1,208,184Z'/>"),
  plus:P("<path d='M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z'/>"),
  copy:P("<path d='M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z'/>"),
  check2:P("<path d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'/>")
};
const TYPE_ICON={'高鐵':'train','轉乘':'transfer','航班':'plane','抵達':'pin','住宿':'bed','自由行':'sun','退房':'luggage','移動':'car','關鍵轉機':'alert','入境轉乘':'passport','景點':'camera','餐廳':'food','交通':'car','集合':'users','購物':'bag','其他':'dot','關鍵截止':'clock'};
const TRANSPORT=new Set(['高鐵','轉乘','航班','移動','入境轉乘','關鍵轉機','交通']);
const STAY=new Set(['住宿','退房','抵達']);
const icon = name => ICO[name] || ICO.dot;
const typeIcon = t => icon(TYPE_ICON[t]);

/* ── helpers ──────────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => n == null ? '—' : `NT$${Number(n).toLocaleString('zh-TW',{maximumFractionDigits:0})}`;
const escapeHtml = v => String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const tripDates=['2026-10-08','2026-10-09','2026-10-10','2026-10-11','2026-10-12','2026-10-13'];
const tripDateLabels=['10/08（四）','10/09（五）','10/10（六）','10/11（日）','10/12（一）','10/13（二）'];

const milestones=[
  {at:'2026-10-08T06:40:00+08:00',ref:'06:40',title:'左營出發 → 桃園',kind:'高鐵',detail:'預定 08:18 抵達桃園高鐵站',day:0},
  {at:'2026-10-08T11:15:00+08:00',ref:'11:15–16:10',title:'JX725 台北 → 吉隆坡',kind:'航班',detail:'TPE T2 · 11:15 起飛',day:0},
  {at:'2026-10-10T14:30:00+08:00',ref:'建議14:30前',title:'最晚離開吉隆坡市區往 KUL',kind:'移動',detail:'目標 15:30–16:00 到 T1',day:2},
  {at:'2026-10-10T18:25:00+08:00',ref:'18:25–20:15',title:'MH2528 吉隆坡 → 古晉',kind:'航班',detail:'KUL T1 · 18:25 起飛',day:2},
  {at:'2026-10-13T07:15:00+08:00',ref:'07:15–07:30',title:'Hilton Kuching 出發 → KCH',kind:'移動',detail:'建議 07:15–07:30 離開',day:5},
  {at:'2026-10-13T09:55:00+08:00',ref:'09:55–11:45',title:'MH2543 古晉 → 吉隆坡',kind:'航班',detail:'KCH · 09:55 起飛',day:5},
  {at:'2026-10-13T14:30:00+08:00',ref:'11:45–14:30',title:'BR228 報到截止',kind:'關鍵截止',detail:'KUL T1 · 務必在此之前完成重新報到',day:5,hint:'全程最關鍵的時間點'},
  {at:'2026-10-13T15:30:00+08:00',ref:'15:30–20:25',title:'BR228 吉隆坡 → 台北',kind:'航班',detail:'KUL T1 · 15:30 起飛',day:5},
  {at:'2026-10-13T22:05:00+08:00',ref:'22:05 之後',title:'桃園 → 左營高鐵候選',kind:'高鐵',detail:'暫定；以正式班表及實際入境時間決定',day:5,hint:'依實際入境時間再決定班次'}
];

/* both day strips are the same question, so they share one answer */
let selectedDay='all';

/* ── day strip ────────────────────────────────────────────── */
function dayChips(current, onPick, stripId){
  const plans=getPlans();
  const chips=tripDates.map((iso,i)=>{
    const label=tripDateLabels[i];
    const evs=trip.days[i].events;
    const mine=plans.filter(p=>p.date===iso).length;
    const critical=evs.some(e=>e.level==='critical');
    const dots=evs.slice(0,5).map(e=>`<i class="${e.level==='critical'?'risk':'on'}"></i>`).join('')
      + (mine?'<i class="on"></i>':'');
    const on=String(current)===String(i)?' active':'';
    /* the dots alone would carry meaning by colour only, so spell it out for assistive tech */
    const desc=`${label}，${evs.length} 項固定行程${mine?`，${mine} 項自訂行程`:''}${critical?'，含關鍵事件':''}`;
    return `<button class="day-chip${on}" data-pick="${i}" aria-pressed="${!!on}" aria-label="${desc}">
      <span class="dc-date" aria-hidden="true">${label.slice(0,5)}</span>
      <span class="dc-dow" aria-hidden="true">${label.slice(6,7)}</span>
      <span class="dc-dot" aria-hidden="true">${dots}</span></button>`;
  }).join('');
  const allOn=current==='all'?' active':'';
  $(stripId).innerHTML=`<button class="day-chip all${allOn}" data-pick="all" aria-pressed="${current==='all'}">全部日期</button>${chips}`;
  $$(`${stripId} .day-chip`).forEach(b=>b.onclick=()=>onPick(b.dataset.pick));
}

/* ── timeline ─────────────────────────────────────────────── */
function statusClass(s){return s.startsWith('✓')?'ok':s.startsWith('✕')?'bad':'warn';}
function toMin(t){const [h,m]=t.split(':').map(Number);return h*60+m;}
function duration(dep,arr){let d=toMin(arr)-toMin(dep);if(d<0)d+=1440;return `${Math.floor(d/60)}h ${String(d%60).padStart(2,'0')}m`;}
function routeStrip(r){
  return `<div class="route">
    <div class="port"><strong>${r.from}</strong><span>${r.fromSub||''}</span><b>${r.dep}</b></div>
    <div class="leg">
      ${r.kind==='air'?copyChip(r.no,'班號'):`<span class="leg-no">${r.no}</span>`}
      <span class="leg-line"><i></i>${r.kind==='air'?ICO.plane:ICO.train}<i></i></span>
      <span class="leg-dur">${duration(r.dep,r.arr)}</span>
    </div>
    <div class="port end"><strong>${r.to}</strong><span>${r.toSub||''}</span><b>${r.arr}</b></div>
  </div>`;
}
function timeCell(t){
  const parts=t.split('–');
  if(parts.length===2 && /^\d/.test(parts[0])) return `<span class="t-main">${parts[0]}</span><span class="t-sub">${parts[1]}</span>`;
  if(/^\d{2}:\d{2}$/.test(t)) return `<span class="t-main">${t}</span>`;
  return `<span class="t-word">${t}</span>`;
}
let nextEventKey='';
function eventRow(e,dayIx){
  const isNext=`${dayIx}|${e.time}|${e.title}`===nextEventKey;
  const cls=[e.level||'', TRANSPORT.has(e.type)?'is-transport':STAY.has(e.type)?'is-stay':'', isNext?'is-next':''].join(' ').trim();
  return `<article class="tl-row ${cls}">
    <div class="tl-time">${timeCell(e.time)}</div>
    <div class="tl-rail"><span class="tl-node">${typeIcon(e.type)}</span></div>
    <div class="tl-card">
      <div class="card-top"><span class="chip type">${e.type}</span>${isNext?'<span class="next-flag">NEXT</span>':''}<span class="status ${statusClass(e.status)}">${e.status}</span></div>
      <h3>${e.type==='住宿'?copyChip(e.title,'住宿名稱'):e.title}</h3>
      ${e.route?routeStrip(e.route):''}
      <div class="meta">${e.meta.map(x=>`<span class="meta-chip">${x}</span>`).join('')}</div>
      <p class="note">${e.note}</p>
    </div>
  </article>`;
}
function renderTimeline(){
  const idx=selectedDay==='all'?trip.days.map((_,i)=>i):[Number(selectedDay)];
  $('#timeline').innerHTML=idx.map(i=>{
    const d=trip.days[i];
    return `<section class="day-group">
      <div class="day-head"><strong>${d.date}</strong><span class="day-tag">${d.events.length} 項</span></div>
      ${d.events.map(ev=>eventRow(ev,i)).join('')}
    </section>`;
  }).join('');
}
function setDay(v){
  selectedDay=v;
  dayChips(selectedDay,setDay,'#dayStrip');
  dayChips(selectedDay,setDay,'#planDayStrip');
  renderTimeline();renderPlans();
}

/* ── todos ────────────────────────────────────────────────── */
const todoKey='myTrip2026.todos';
function getTodoState(){
  try{
    const v=JSON.parse(localStorage.getItem(todoKey));
    return v&&typeof v==='object'&&!Array.isArray(v)?v:{};
  }catch{return {}}
}
function renderTodos(){
  const state=getTodoState();
  const nextIx=trip.todos.findIndex((_,i)=>!state[i]);
  $('#todoList').innerHTML=trip.todos.map((t,i)=>`<label class="todo ${state[i]?'done':''} ${i===nextIx?'next-up':''}">
    <input type="checkbox" data-i="${i}" ${state[i]?'checked':''}><span class="check"></span>
    <div class="todo-body">
      <div class="todo-top"><span class="due">${t.due}</span><span class="pri-chip ${t.priority==='高'?'high':''}">${t.priority}優先</span></div>
      <h3>${t.title}</h3>
      <p>${t.why}${t.note?` · ${t.note}`:''}</p>
    </div></label>`).join('');
  $$('#todoList input').forEach(cb=>cb.addEventListener('change',()=>{
    const s=getTodoState();s[cb.dataset.i]=cb.checked;
    try{localStorage.setItem(todoKey,JSON.stringify(s));}catch{toast('無法儲存勾選狀態');}
    renderTodos();
  }));
  const done=trip.todos.filter((_,i)=>state[i]).length, total=trip.todos.length, pct=Math.round(done/total*100);
  $('#todoProgressText').textContent=`${done} / ${total} 完成`;
  $('#todoPercent').textContent=`${pct}%`;
  const C=2*Math.PI*31, ring=$('#todoRing');
  ring.style.strokeDashoffset=String(C*(1-pct/100));
  ring.style.opacity=pct?'1':'0';
  const next=trip.todos.find((_,i)=>!state[i]);
  $('#todoNext').textContent=next?`下一項：${next.due} · ${next.title}`:'全部完成，出發前再複查一次即可';
}

/* ── costs ────────────────────────────────────────────────── */
const CAT_COLOR={'機票':'var(--brand)','住宿':'var(--accent)'};
function renderCosts(){
  const total=trip.costs.reduce((s,x)=>s+x.total,0);
  const cats=[...new Set(trip.costs.map(c=>c.cat))].map(cat=>({
    cat, sum:trip.costs.filter(c=>c.cat===cat).reduce((s,x)=>s+x.total,0)
  }));
  $('#costSummary').innerHTML=`
    <div class="cost-box"><span>5 人已知固定費用</span><strong>${money(total)}</strong></div>
    <div class="cost-box"><span>平均每人（單純平均）</span><strong>${money(total/5)}</strong></div>`;
  $('#costChart').innerHTML=`
    <div class="cc-bar">${cats.map(c=>`<i style="width:${c.sum/total*100}%;background:${CAT_COLOR[c.cat]}"></i>`).join('')}</div>
    <div class="cc-legend">${cats.map(c=>`<span class="cc-item"><i class="sw" style="background:${CAT_COLOR[c.cat]}"></i><span>${c.cat}</span><b>${money(c.sum)}</b><span>${Math.round(c.sum/total*100)}%</span></span>`).join('')}</div>`;
  const max=Math.max(...trip.costs.map(c=>c.total));
  $('#costTable').innerHTML=trip.costs.map(c=>`<tr>
    <td><i class="cat-dot" style="background:${CAT_COLOR[c.cat]}"></i>${c.name}</td>
    <td><span class="share"><span class="share-track"><i style="width:${c.total/max*100}%;background:${CAT_COLOR[c.cat]}"></i></span><span class="share-pct">${Math.round(c.total/total*100)}%</span></span></td>
    <td>${money(c.total)}</td><td>${money(c.per)}</td></tr>`).join('');
}

/* ── planner ──────────────────────────────────────────────── */
const planKey='myTrip2026.plans.v1';
function getPlans(){
  try{
    const v=JSON.parse(localStorage.getItem(planKey));
    if(!Array.isArray(v)) return [];
    const str=(o,k)=>typeof o[k]==='string';
    return v.filter(x=>x&&typeof x==='object'&&str(x,'id')&&str(x,'date')&&str(x,'time')&&str(x,'title'))
      .filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&/^\d{2}:\d{2}$/.test(x.time));
  }catch{return []}
}
function savePlans(plans){
  try{localStorage.setItem(planKey,JSON.stringify(plans));}
  catch{toast('無法儲存，裝置儲存空間已滿');return;}
  renderPlans();dayChips(selectedDay,setDay,'#dayStrip');dayChips(selectedDay,setDay,'#planDayStrip');updateNextEvent();}

function setupPlanner(){
  $('#planDate').innerHTML=tripDates.map((d,i)=>`<option value="${d}">${tripDateLabels[i]}</option>`).join('');
  dayChips(selectedDay,setDay,'#planDayStrip');
  $('#addPlanBtn').addEventListener('click',()=>openPlanDialog());
  $('#closePlan').onclick=$('#cancelPlan').onclick=()=>$('#planDialog').close();
  $('#planForm').addEventListener('submit',e=>{
    e.preventDefault();
    const plans=getPlans();
    const id=$('#planForm').dataset.editId || `${Date.now()}`;
    const item={id,date:$('#planDate').value,time:$('#planTime').value,title:$('#planTitle').value.trim(),type:$('#planType').value,duration:$('#planDuration').value.trim(),note:$('#planNote').value.trim()};
    const ix=plans.findIndex(x=>x.id===id); if(ix>=0) plans[ix]=item; else plans.push(item);
    savePlans(plans); $('#planDialog').close(); toast(ix>=0?'已更新行程':'已加入行程');
  });
  renderPlans();
}
function openPlanDialog(item=null){
  $('#planDialogTitle').textContent=item?'編輯行程':'新增行程';
  $('#planForm').dataset.editId=item?.id||'';
  $('#planDate').value=item?.date || (selectedDay!=='all'?tripDates[Number(selectedDay)]:tripDates[0]);
  $('#planTime').value=item?.time||'12:00';
  $('#planTitle').value=item?.title||'';
  $('#planType').value=item?.type||'景點';
  $('#planDuration').value=item?.duration||'';
  $('#planNote').value=item?.note||'';
  $('#planDialog').showModal(); setTimeout(()=>$('#planTitle').focus(),80);
}
function renderPlans(){
  const iso=selectedDay==='all'?null:tripDates[Number(selectedDay)];
  const plans=getPlans().filter(x=>!iso||x.date===iso).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $('#planEmpty').hidden=plans.length>0;
  $('#planList').innerHTML=plans.map(p=>`<article class="plan-card">
    <div class="plan-time"><b>${escapeHtml(p.time)}</b><small>${escapeHtml(p.date.slice(5).replace('-','/'))}</small></div>
    <span class="plan-ico">${typeIcon(p.type)}</span>
    <div class="plan-body">
      <h3>${escapeHtml(p.title)}</h3>
      ${p.note?`<p>${escapeHtml(p.note)}</p>`:''}
      <div class="plan-badges"><span class="badge">${escapeHtml(p.type)}</span>${p.duration?`<span class="badge">${escapeHtml(p.duration)}</span>`:''}</div>
    </div>
    <div class="plan-acts">
      <button class="icon-btn" type="button" data-copy="${escapeHtml(p.note?`${p.title} ${p.note}`:p.title)}" aria-label="複製這筆行程的文字">${ICO.copy}</button>
      <button class="icon-btn edit-plan" data-id="${p.id}" aria-label="編輯">✎</button>
      <button class="icon-btn delete-plan" data-id="${p.id}" aria-label="刪除">×</button>
    </div></article>`).join('');
  $$('.edit-plan').forEach(b=>b.onclick=()=>openPlanDialog(getPlans().find(x=>x.id===b.dataset.id)));
  $$('.delete-plan').forEach(b=>b.onclick=()=>{
    if(confirm('刪除這筆自訂行程？')){savePlans(getPlans().filter(x=>x.id!==b.dataset.id));toast('已刪除');}
  });
}

/* ── next event & countdown ───────────────────────────────── */
function getAllCountdownEvents(){
  const custom=getPlans().map(p=>({
    at:`${p.date}T${p.time}:00+08:00`,title:p.title,kind:p.type,
    detail:`${tripDateLabels[tripDates.indexOf(p.date)]}${p.duration?` · ${p.duration}`:''}`,
    day:tripDates.indexOf(p.date),custom:true
  }));
  return [...milestones,...custom].sort((a,b)=>new Date(a.at)-new Date(b.at));
}
function formatCountdown(ms){
  if(ms<=0) return '<span class="cd-n">進行中</span>';
  const min=Math.floor(ms/60000), d=Math.floor(min/1440), h=Math.floor((min%1440)/60), m=min%60;
  if(d>0) return `<span class="cd-n">${d}</span><span class="cd-u">天</span><span class="cd-n">${h}</span><span class="cd-u">時</span>`;
  if(h>0) return `<span class="cd-n">${h}</span><span class="cd-u">時</span><span class="cd-n">${m}</span><span class="cd-u">分</span>`;
  return `<span class="cd-n">${m}</span><span class="cd-u">分</span>`;
}
function countdownText(ms){
  if(ms<=0) return '進行中';
  const min=Math.floor(ms/60000), d=Math.floor(min/1440), h=Math.floor((min%1440)/60), m=min%60;
  if(d>0) return `還有 ${d} 天 ${h} 小時`;
  if(h>0) return `還有 ${h} 小時 ${m} 分`;
  return `還有 ${m} 分鐘`;
}
function stamp(iso){
  return new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso));
}
function updateNextEvent(){
  const now=Date.now();
  const all=getAllCountdownEvents();
  const i=all.findIndex(e=>new Date(e.at).getTime()>=now-30*60*1000);
  if(i<0){
    $('#nextTitle').textContent='旅程已完成';
    $('#nextMeta').textContent='所有固定倒數事件都已結束';
    $('#nextCountdown').innerHTML='<span class="cd-n">完成</span>';
    $('#nextAt').textContent='';$('#nextHint').textContent='';
    $('#nowBar').style.transform='scaleX(1)';
    $('#nextIcon').innerHTML=ICO.check;
    return;
  }
  const next=all[i], t=new Date(next.at).getTime();
  $('#nextTitle').textContent=next.title;
  $('#nextMeta').textContent=`${next.kind} · ${next.detail}`;
  $('#nextCountdown').innerHTML=formatCountdown(t-now);
  $('#nextAt').textContent=stamp(next.at);
  $('#nextHint').textContent=next.hint||'';
  $('#nextIcon').innerHTML=typeIcon(next.kind);
  $('#jumpNextBtn').dataset.day=String(next.day);
  /* milestones name their row outright; guessing from titles left the
     10/10 departure and the 10/13 check-in deadline pointing at nothing */
  const match=next.ref&&trip.days[next.day]?.events.find(e=>e.time===next.ref);
  const key=match?`${next.day}|${match.time}|${match.title}`:'';
  if(key!==nextEventKey){nextEventKey=key;renderTimeline();}
  const prev=i>0?new Date(all[i-1].at).getTime():t-24*3600*1000;
  const pct=Math.min(100,Math.max(0,(now-prev)/(t-prev)*100));
  $('#nowBar').style.transform=`scaleX(${pct/100})`;
  announceNext(next,t-now);
}
/* one atomic contextual status, announced only when the next event itself changes —
   a live region ticking every 30s would just talk over the user */
let announcedAt='';
function announceNext(next,ms){
  if(announcedAt===next.at) return;
  announcedAt=next.at;
  $('#nextStatus').textContent=`下一個行程：${next.title}，${stamp(next.at)}，${countdownText(ms)}`;
}
function updateClock(){
  const fmt=new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  $('#clockText').textContent=`UTC+8 · ${fmt.format(new Date())}`;
  updateNextEvent();
}

/* ── theme ────────────────────────────────────────────────── */
const THEME_KEY='myTrip2026.theme';
function readTheme(){try{return localStorage.getItem(THEME_KEY)||'system'}catch{return 'system'}}
function resolvedDark(pref){
  return pref==='dark' || (pref==='system' && matchMedia('(prefers-color-scheme:dark)').matches);
}
function applyTheme(pref){
  const root=document.documentElement;
  if(pref==='system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme',pref);
  /* the static media-based metas are right only in system mode; once the user
     has chosen, replace them with a single meta matching the resolved theme */
  $$('meta[name="theme-color"]').forEach(m=>m.remove());
  const meta=document.createElement('meta');
  meta.name='theme-color';
  meta.content=resolvedDark(pref)?'#051318':'#DFE8E6';
  document.head.appendChild(meta);
  $$('.theme-opt').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.themeSet===pref)));
}
function setupTheme(){
  applyTheme(readTheme());
  $$('.theme-opt').forEach(b=>{
    b.addEventListener('click',()=>{
      const v=b.dataset.themeSet;
      try{localStorage.setItem(THEME_KEY,v)}catch{}
      applyTheme(v);
    });
  });
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{
    if(readTheme()==='system') applyTheme('system');
  });
}

/* ── copy ─────────────────────────────────────────────────── */
function copyChip(text,label){
  return `<button type="button" class="copy-chip" data-copy="${escapeHtml(text)}" `
    + `aria-label="複製${label}：${escapeHtml(text)}">${escapeHtml(text)}${ICO.copy}</button>`;
}
async function copyText(el){
  const text=el.dataset.copy;
  try{
    if(navigator.clipboard&&isSecureContext) await navigator.clipboard.writeText(text);
    else{
      const ta=document.createElement('textarea');
      ta.value=text;ta.setAttribute('readonly','');
      ta.style.cssText='position:fixed;top:0;opacity:0';
      document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    }
    el.classList.add('copied');
    setTimeout(()=>el.classList.remove('copied'),1100);
    navigator.vibrate?.(8);
    /* a pill toast is one line; echoing a long address wraps it into a block */
    toast(`已複製 ${text.length>16?text.slice(0,16)+'…':text}`);
  }catch{ toast('複製失敗，請手動記下'); }
}
addEventListener('click',e=>{
  const el=e.target.closest('[data-copy]');
  if(el){e.preventDefault();copyText(el);}
});

/* ── app chrome ───────────────────────────────────────────── */
function setupHeaderCollapse(){
  const bar=$('.topbar');
  let last=0,ticking=false;
  addEventListener('scroll',()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{
      const y=Math.max(0,scrollY);
      /* hide on the way down, bring it straight back on any upward move */
      if(y>96&&y>last+4) bar.classList.add('hidden');
      else if(y<last-4||y<=96) bar.classList.remove('hidden');
      last=y;ticking=false;
    });
  },{passive:true});
}

let toastTimer;
function toast(msg){
  const el=$('#toast');
  el.textContent=msg;el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
}

/* Swiping between tabs is an addition, never the only way: the tab bar and
   arrow keys still do everything this does. */
function setupSwipe(){
  const main=$('#main');
  let x0=null,y0=null,lock=false;
  main.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){x0=null;return;}
    const t=e.touches[0];
    /* do not fight a horizontally scrollable strip or table under the finger,
       and leave the screen edges to the system back/forward gestures */
    lock=!!e.target.closest('.day-strip,.table-wrap,dialog')
      || t.clientX<24 || t.clientX>innerWidth-24;
    x0=t.clientX;y0=t.clientY;
  },{passive:true});
  main.addEventListener('touchend',e=>{
    if(x0===null||lock) return;
    const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;
    x0=null;
    if(Math.abs(dx)<64||Math.abs(dy)>44) return;
    const i=VIEW_ORDER.indexOf($('.view.active').id);
    const next=i+(dx<0?1:-1);
    if(next<0||next>=VIEW_ORDER.length) return;
    showView(VIEW_ORDER[next]);
  },{passive:true});
}

/* Opening on 10/08 is useless once the trip starts. Land on today when the
   trip is running, otherwise on the day the next event belongs to. */
function openingDay(){
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const ix=tripDates.indexOf(today);
  if(ix>=0) return String(ix);
  const next=getAllCountdownEvents().find(e=>new Date(e.at).getTime()>=Date.now());
  return next&&next.day>=0?String(next.day):'all';
}

/* ── chrome ───────────────────────────────────────────────── */
const VIEW_ORDER=['itinerary','planner','todos','costs'];
const scrollMemory={};
function showView(name,focusTab){
  const current=$('.view.active')?.id;
  if(current) scrollMemory[current]=scrollY;
  const from=VIEW_ORDER.indexOf(current), to=VIEW_ORDER.indexOf(name);
  if(from>=0&&to>=0&&from!==to) document.documentElement.style.setProperty('--view-dir',(to>from?14:-14)+'px');
  $('#addPlanFab').classList.toggle('show',name==='planner');
  $$('.tab').forEach(x=>{
    const on=x.dataset.view===name;
    x.classList.toggle('active',on);
    x.setAttribute('aria-selected',String(on));
    x.tabIndex=on?0:-1;
    if(on&&focusTab) x.focus();
  });
  $$('.view').forEach(x=>x.classList.toggle('active',x.id===name));
  /* the alert is about one moment on 10/13; it does not belong over the costs table */
  $('#criticalBanner').classList.toggle('off-view',name!=='itinerary');
  requestAnimationFrame(()=>scrollTo({top:scrollMemory[name]||0,behavior:'instant'}));
}
function setupTabs(){
  const tabs=$$('.tab');
  tabs.forEach((b,i)=>{
    b.querySelector('.tab-ico').innerHTML=icon(b.dataset.icon);
    b.addEventListener('click',()=>showView(b.dataset.view));
    b.addEventListener('keydown',e=>{
      const step={ArrowRight:1,ArrowLeft:-1,Home:-i,End:tabs.length-1-i}[e.key];
      if(step===undefined) return;
      e.preventDefault();
      showView(tabs[(i+step+tabs.length)%tabs.length].dataset.view,true);
    });
  });
  $$('[data-icon]:not(.tab)').forEach(el=>{if(!el.querySelector('svg')) el.innerHTML=icon(el.dataset.icon);});
}
function setupNextJump(){
  $('#jumpNextBtn').onclick=()=>{
    showView('itinerary');
    const day=$('#jumpNextBtn').dataset.day;
    if(day!==undefined) setDay(day);
    $('#itinerary').scrollIntoView({behavior:'smooth',block:'start'});
  };
}
function setupSources(){
  $('#sourceList').innerHTML=trip.sources.map(s=>`<div class="source"><strong>${s[0]}</strong><small>${s[1]}</small><a href="${s[2]}" target="_blank" rel="noopener">${s[2]}</a></div>`).join('');
  $('#sourceBtn').onclick=()=>$('#sourceDialog').showModal();
  $('#closeSources').onclick=()=>$('#sourceDialog').close();
}
function setupBanner(){
  const key='myTrip2026.bannerHidden';
  if(sessionStorage.getItem(key)) $('#criticalBanner').hidden=true;
  $('#dismissBanner').onclick=()=>{$('#criticalBanner').hidden=true;try{sessionStorage.setItem(key,'1')}catch{}};
}
function setupPWA(){
  if('serviceWorker' in navigator){
    /* A new worker claiming this page means its assets are stale. Reload once so
       the update lands without the user having to know to hard-refresh. Skipped
       on first install, where claiming is expected and nothing is stale. */
    const hadController=!!navigator.serviceWorker.controller;
    let reloaded=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(!hadController||reloaded) return;
      reloaded=true;location.reload();
    });
    navigator.serviceWorker.register('./sw.js');
  }
  let promptEvent=null; const btn=$('#installBtn');
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;btn.hidden=false;});
  btn.addEventListener('click',async()=>{if(!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;btn.hidden=true;});
  window.addEventListener('appinstalled',()=>btn.hidden=true);
}
$('#resetTodos').addEventListener('click',()=>{if(confirm('要清除所有待辦勾選狀態嗎？')){localStorage.removeItem(todoKey);renderTodos();}});

setupTheme();
setupTabs();
setupHeaderCollapse();
setupSwipe();
$('#addPlanFab').onclick=()=>openPlanDialog();
selectedDay=openingDay();
dayChips(selectedDay,setDay,'#dayStrip');
renderTimeline();
renderTodos();
renderCosts();
setupPlanner();
setupSources();
setupBanner();
setupPWA();
setupNextJump();
updateClock();
setInterval(updateClock,30000);
