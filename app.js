const trip = {
  days: [
    {date:'10/08（四）', events:[
      {time:'06:40',type:'高鐵',title:'左營 → 桃園（經台中）',meta:['手寫規劃班次','桃園 08:18 抵達','大件行李'],status:'⚠ 待最終確認',level:'caution',note:'手寫：06:40 → 07:40 → 08:18；10/8 車票已進入可預訂區間。',
        route:{kind:'rail',no:'高鐵 南下',from:'左營',fromSub:'高鐵',to:'桃園',toSub:'高鐵',dep:'06:40',arr:'08:18'}},
      {time:'08:18–約08:50',type:'轉乘',title:'高鐵桃園站 → A18 → A13 第二航廈',meta:['桃園機捷','至少抓 30 分'],status:'✓ 可行',note:'A18 步行約 5–10 分；不要把 08:26 當唯一方案，08:32 或後續班次較穩。'},
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
      {time:'11:45–14:30',type:'關鍵轉機',title:'領 MH 行李 → 長榮重新報到／托運',meta:['KUL T1','分開機票','安全窗約 2小時45分'],status:'⚠ 全程最大風險',level:'critical',note:'BR228 櫃檯約 12:30 開、14:30 關。MH 若延誤約 90 分以上，風險明顯升高；落地後不要安排吃飯或購物。'},
      {time:'15:30–20:25',type:'航班',title:'吉隆坡 KUL → 台北 TPE',meta:['托運 23kg','手提 7kg','受前段影響'],status:'✓ 受前段影響',level:'caution',note:'14:30 前完成報到；分開機票通常不受後段航司保障。',
        route:{kind:'air',no:'BR228',from:'KUL',fromSub:'T1',to:'TPE',toSub:'T2',dep:'15:30',arr:'20:25'}},
      {time:'20:25–約21:40+',type:'入境轉乘',title:'TPE T2 入境／領行李 → A13 → A18',meta:['至少抓 75 分鐘'],status:'⚠ 勿排太緊',level:'caution',note:'還要計入滑行、下機、入境、等行李、步行與候車。'},
      {time:'不建議21:43',type:'高鐵',title:'桃園 → 左營（經台中）',meta:['手寫方案 A'],status:'✕ 風險過高',level:'critical',note:'21:43 幾乎沒有容錯，建議直接排除。'},
      {time:'22:05或更晚',type:'高鐵',title:'桃園 → 左營（經台中）',meta:['手寫方案 B','以正式班表為準'],status:'⚠ 待確認',level:'caution',note:'22:05 仍偏緊；更穩妥是保留較晚班次。'}
    ]}
  ],
  risks:[
    {p:'P1',title:'10/13 KUL 分開機票轉機',result:'偏緊但可做',reason:'MH2543 11:45 抵達；BR228 15:30 起飛。分開票不保證直掛，需按領行李再報到規劃。',fix:'當作「領行李＋重新報到」而不是純轉機；MH 落地後不吃飯、不購物。',limit:'14:30 前完成 BR228 報到；若 MH 延誤 ≥90 分，立即啟動改票／聯絡航司方案。'},
    {p:'P1',title:'10/13 桃園高鐵 21:43',result:'不合理',reason:'20:25 才落地 TPE，後面還有滑行、入境、領行李、走到 A13、機捷到 A18。',fix:'直接排除 21:43；優先 22:05 之後，最好保留更晚備案。',limit:'若 21:30 仍未到 A18，改搭後續班次／其他交通。'},
    {p:'P2',title:'10/13 桃園高鐵 22:05',result:'可做但容錯不大',reason:'順利時可能趕上，但航班或入境稍慢就會失守。',fix:'不要把緊繃班次當唯一方案；確認最後南下班次與退改規則。',limit:'抵達 A18 後依實際時間決定班次最安全。'},
    {p:'P2',title:'10/08 高鐵 → 機捷 → JX725',result:'可行',reason:'08:18 到桃園，約 08:50 可進 T2，距 11:15 起飛仍有約 2 小時 25 分。',fix:'不要硬追 08:26 機捷；08:32 或後一班仍有餘裕。',limit:'09:15 前應進入 T2 報到區。'},
    {p:'P2',title:'10/10 吉隆坡市區 → KUL',result:'時間充足',reason:'12:00 退房、18:25 起飛，中間有很長緩衝。',fix:'14:30 前離開市區，目標 15:30–16:00 到 T1。',limit:'17:25 前完成 MH 報到。'},
    {p:'P2',title:'10/13 Hilton → KCH',result:'已補足',reason:'原手寫沒有明確安排飯店到機場的離開時間。',fix:'07:15–07:30 離開飯店，07:45–08:00 到機場。',limit:'08:55 前完成報到。'},
    {p:'P3',title:'高鐵班次正式訂位',result:'去程可訂、回程待確認',reason:'10/13 回程須以正式開放後班表為準。',fix:'先處理 10/8；再確認 10/13 正式班表。',limit:'特殊疏運可能調整，以高鐵公告為準。'},
    {p:'P3',title:'行李額度',result:'可控',reason:'JX / BR 托運 23kg，MH 20kg；MH 是全程瓶頸。',fix:'全程把單人托運控制在 20kg 內，或事先確認加購額度。',limit:'10/12 晚上全員秤重。'},
    {p:'P3',title:'住宿日期',result:'正確',reason:'吉隆坡 2 晚＋古晉 3 晚，共 5 晚。',fix:'保持現有安排。',limit:'與 6天5夜一致。'}
  ],
  todos:[
    {due:'現在',title:'預訂／確認 10/8 左營→桃園高鐵',why:'10/8 已進入一般訂位區間',priority:'高',note:'優先選能在 08:18 或更早抵達桃園的班次'},
    {due:'2026/09/15',title:'查 10/13 桃園→左營正式高鐵班表並訂位',why:'回程需用正式班表確認',priority:'高',note:'排除 21:43；22:05 僅作暫定，優先保留較晚備案'},
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
/* every icon sits beside visible text, so all of them are decorative */
const S = (p,fill) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${fill?'fill="currentColor"':'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"'}>${p}</svg>`;
const ICO = {
  plane:S('<path d="M21 15.5v-1.7l-7.5-4.6V4.4a1.5 1.5 0 0 0-3 0v4.8L3 13.8v1.7l7.5-2.3v4.6l-2 1.4v1.3l3.5-1 3.5 1v-1.3l-2-1.4v-4.6z"/>',1),
  train:S('<rect x="5" y="3" width="14" height="13" rx="3.5"/><path d="M5 9.5h14M9.5 12.8h.01M14.5 12.8h.01M8.5 16 6.5 21M15.5 16l2 5"/>'),
  transfer:S('<path d="M4 8.5h13M14 5.5l3 3-3 3M20 15.5H7M10 12.5l-3 3 3 3"/>'),
  car:S('<path d="M4.5 16.5h15M6.5 16.5V11l1.6-4h7.8l1.6 4v5.5"/><path d="M6.5 11.5h11"/><circle cx="8.5" cy="18.6" r="1.4"/><circle cx="15.5" cy="18.6" r="1.4"/>'),
  pin:S('<path d="M12 21s6.5-5.7 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.3 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.4"/>'),
  bed:S('<path d="M3.2 19.5V6.5M3.2 12.5h11a5 5 0 0 1 5 5v2M3.2 19.5h17.6"/><circle cx="7.6" cy="9.6" r="2"/>'),
  luggage:S('<rect x="6" y="7" width="12" height="13" rx="2.5"/><path d="M9.5 7V4.6h5V7M10 11v5M14 11v5"/>'),
  sun:S('<circle cx="12" cy="12" r="4"/><path d="M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.9 5.9l1.4 1.4M16.7 16.7l1.4 1.4M18.1 5.9l-1.4 1.4M7.3 16.7l-1.4 1.4"/>'),
  alert:S('<path d="M12 4.4 2.9 20.2h18.2z"/><path d="M12 10v4.2M12 17.2h.01"/>'),
  clock:S('<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3 2"/>'),
  passport:S('<rect x="5" y="3" width="14" height="18" rx="2.6"/><circle cx="12" cy="10" r="2.8"/><path d="M9.4 16.2h5.2"/>'),
  camera:S('<path d="M3 8.6h3.6L8.1 6h7.8l1.5 2.6H21v10.6H3z"/><circle cx="12" cy="13.4" r="3.2"/>'),
  food:S('<path d="M7 3v7.4M4.8 3v3.6a2.2 2.2 0 0 0 4.4 0V3M7 10.4V21"/><path d="M17.4 3c1.7 1.9 1.7 6.3 0 8.2V21"/>'),
  users:S('<circle cx="9.2" cy="8" r="3.1"/><path d="M3.6 19.2a5.6 5.6 0 0 1 11.2 0"/><path d="M16.2 5.3a3 3 0 0 1 0 5.4M17.2 14.2a5.6 5.6 0 0 1 3.4 4.9"/>'),
  bag:S('<path d="M5.6 8h12.8l1 12H4.6z"/><path d="M9 8V6.2a3 3 0 0 1 6 0V8"/>'),
  dot:S('<circle cx="12" cy="12" r="3.2"/>'),
  wallet:S('<path d="M3.6 8.4V6.9A2 2 0 0 1 5.6 5h11.2"/><rect x="3.6" y="7.6" width="16.8" height="12" rx="2.6"/><circle cx="16.2" cy="13.6" r="1.3"/>'),
  route:S('<circle cx="6.2" cy="6.2" r="2.4"/><circle cx="17.8" cy="17.8" r="2.4"/><path d="M8.6 6.2h5.6a3.4 3.4 0 0 1 0 6.8h-4.4a3.4 3.4 0 0 0 0 6.8h5.6"/>'),
  shield:S('<path d="M12 3.2 19 6v5.3c0 4.4-3 8-7 9.6-4-1.6-7-5.2-7-9.6V6z"/><path d="M9.4 12.1l2 2 3.4-3.9"/>'),
  check:S('<circle cx="12" cy="12" r="8.4"/><path d="M8.4 12.2l2.4 2.4 4.8-5.2"/>'),
  wrench:S('<path d="M14.8 3.6a4.6 4.6 0 0 0-4 6.9l-7.1 7.1a1.9 1.9 0 0 0 2.7 2.7l7.1-7.1a4.6 4.6 0 0 0 6.9-4l-3 3-2.8-.6-.6-2.8z"/>'),
  flag:S('<path d="M6 21V3.8M6 4.6h11.4l-2.3 3.8 2.3 3.8H6"/>')
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
  {at:'2026-10-08T06:40:00+08:00',title:'左營出發 → 桃園',kind:'高鐵',detail:'預定 08:18 抵達桃園高鐵站',day:0},
  {at:'2026-10-08T11:15:00+08:00',title:'JX725 台北 → 吉隆坡',kind:'航班',detail:'TPE T2 · 11:15 起飛',day:0},
  {at:'2026-10-10T14:30:00+08:00',title:'最晚離開吉隆坡市區往 KUL',kind:'移動',detail:'目標 15:30–16:00 到 T1',day:2},
  {at:'2026-10-10T18:25:00+08:00',title:'MH2528 吉隆坡 → 古晉',kind:'航班',detail:'KUL T1 · 18:25 起飛',day:2},
  {at:'2026-10-13T07:15:00+08:00',title:'Hilton Kuching 出發 → KCH',kind:'移動',detail:'建議 07:15–07:30 離開',day:5},
  {at:'2026-10-13T09:55:00+08:00',title:'MH2543 古晉 → 吉隆坡',kind:'航班',detail:'KCH · 09:55 起飛',day:5},
  {at:'2026-10-13T14:30:00+08:00',title:'BR228 報到截止',kind:'關鍵截止',detail:'KUL T1 · 務必在此之前完成重新報到',day:5,hint:'全程最關鍵的時間點'},
  {at:'2026-10-13T15:30:00+08:00',title:'BR228 吉隆坡 → 台北',kind:'航班',detail:'KUL T1 · 15:30 起飛',day:5},
  {at:'2026-10-13T22:05:00+08:00',title:'桃園 → 左營高鐵候選',kind:'高鐵',detail:'暫定；以正式班表及實際入境時間決定',day:5,hint:'依實際入境時間再決定班次'}
];

let dayFilter='all';
let planFilter='all';

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
      <span class="leg-no">${r.no}</span>
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
function eventRow(e){
  const cls=[e.level||'', TRANSPORT.has(e.type)?'is-transport':STAY.has(e.type)?'is-stay':''].join(' ').trim();
  return `<article class="tl-row ${cls}">
    <div class="tl-time">${timeCell(e.time)}</div>
    <div class="tl-rail"><span class="tl-node">${typeIcon(e.type)}</span></div>
    <div class="tl-card">
      <div class="card-top"><span class="chip type">${e.type}</span><span class="status ${statusClass(e.status)}">${e.status}</span></div>
      <h3>${e.title}</h3>
      ${e.route?routeStrip(e.route):''}
      <div class="meta">${e.meta.map(x=>`<span class="meta-chip">${x}</span>`).join('')}</div>
      <p class="note">${e.note}</p>
    </div>
  </article>`;
}
function renderTimeline(){
  const idx=dayFilter==='all'?trip.days.map((_,i)=>i):[Number(dayFilter)];
  $('#timeline').innerHTML=idx.map(i=>{
    const d=trip.days[i];
    return `<section class="day-group">
      <div class="day-head"><strong>${d.date}</strong><span class="day-tag">${d.events.length} 項</span></div>
      ${d.events.map(eventRow).join('')}
    </section>`;
  }).join('');
}
function setDay(v){dayFilter=v;dayChips(dayFilter,setDay,'#dayStrip');renderTimeline();}

/* ── risks ────────────────────────────────────────────────── */
function renderRisks(){
  $('#riskList').innerHTML=trip.risks.map(r=>`<article class="risk ${r.p.toLowerCase()}">
    <div class="risk-bar"></div>
    <div class="risk-main">
      <div class="risk-top"><span class="pri">${r.p}</span><span class="verdict">${r.result}</span></div>
      <h3>${r.title}</h3>
      <p class="reason">${r.reason}</p>
      <div class="risk-grid">
        <div class="mini"><b>${ICO.wrench}建議改法</b><span>${r.fix}</span></div>
        <div class="mini limit"><b>${ICO.flag}底線 / 觸發條件</b><span>${r.limit}</span></div>
      </div>
    </div>
  </article>`).join('');
}

/* ── todos ────────────────────────────────────────────────── */
const todoKey='myTrip2026.todos';
function getTodoState(){try{return JSON.parse(localStorage.getItem(todoKey))||{}}catch{return {}}}
function renderTodos(){
  const state=getTodoState();
  $('#todoList').innerHTML=trip.todos.map((t,i)=>`<label class="todo ${state[i]?'done':''}">
    <input type="checkbox" data-i="${i}" ${state[i]?'checked':''}><span class="check"></span>
    <div class="todo-body">
      <div class="todo-top"><span class="due">${t.due}</span><span class="pri-chip ${t.priority==='高'?'high':''}">${t.priority}優先</span></div>
      <h3>${t.title}</h3>
      <p>${t.why}${t.note?` · ${t.note}`:''}</p>
    </div></label>`).join('');
  $$('#todoList input').forEach(cb=>cb.addEventListener('change',()=>{
    const s=getTodoState();s[cb.dataset.i]=cb.checked;localStorage.setItem(todoKey,JSON.stringify(s));renderTodos();
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
function getPlans(){try{return JSON.parse(localStorage.getItem(planKey))||[]}catch{return []}}
function savePlans(plans){localStorage.setItem(planKey,JSON.stringify(plans));renderPlans();dayChips(dayFilter,setDay,'#dayStrip');updateNextEvent();}
function setPlanDay(v){planFilter=v;dayChips(planFilter,setPlanDay,'#planDayStrip');renderPlans();}
function setupPlanner(){
  $('#planDate').innerHTML=tripDates.map((d,i)=>`<option value="${d}">${tripDateLabels[i]}</option>`).join('');
  dayChips(planFilter,setPlanDay,'#planDayStrip');
  $('#addPlanBtn').addEventListener('click',()=>openPlanDialog());
  $('#closePlan').onclick=$('#cancelPlan').onclick=()=>$('#planDialog').close();
  $('#planForm').addEventListener('submit',e=>{
    e.preventDefault();
    const plans=getPlans();
    const id=$('#planForm').dataset.editId || `${Date.now()}`;
    const item={id,date:$('#planDate').value,time:$('#planTime').value,title:$('#planTitle').value.trim(),type:$('#planType').value,duration:$('#planDuration').value.trim(),note:$('#planNote').value.trim()};
    const ix=plans.findIndex(x=>x.id===id); if(ix>=0) plans[ix]=item; else plans.push(item);
    savePlans(plans); $('#planDialog').close();
  });
  renderPlans();
}
function openPlanDialog(item=null){
  $('#planDialogTitle').textContent=item?'編輯行程':'新增行程';
  $('#planForm').dataset.editId=item?.id||'';
  $('#planDate').value=item?.date || (planFilter!=='all'?tripDates[Number(planFilter)]:tripDates[0]);
  $('#planTime').value=item?.time||'12:00';
  $('#planTitle').value=item?.title||'';
  $('#planType').value=item?.type||'景點';
  $('#planDuration').value=item?.duration||'';
  $('#planNote').value=item?.note||'';
  $('#planDialog').showModal(); setTimeout(()=>$('#planTitle').focus(),80);
}
function renderPlans(){
  const iso=planFilter==='all'?null:tripDates[Number(planFilter)];
  const plans=getPlans().filter(x=>!iso||x.date===iso).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $('#planEmpty').hidden=plans.length>0;
  $('#planList').innerHTML=plans.map(p=>`<article class="plan-card">
    <div class="plan-time"><b>${p.time}</b><small>${p.date.slice(5).replace('-','/')}</small></div>
    <span class="plan-ico">${typeIcon(p.type)}</span>
    <div class="plan-body">
      <h3>${escapeHtml(p.title)}</h3>
      ${p.note?`<p>${escapeHtml(p.note)}</p>`:''}
      <div class="plan-badges"><span class="badge">${p.type}</span>${p.duration?`<span class="badge">${escapeHtml(p.duration)}</span>`:''}</div>
    </div>
    <div class="plan-acts">
      <button class="icon-btn edit-plan" data-id="${p.id}" aria-label="編輯">✎</button>
      <button class="icon-btn delete-plan" data-id="${p.id}" aria-label="刪除">×</button>
    </div></article>`).join('');
  $$('.edit-plan').forEach(b=>b.onclick=()=>openPlanDialog(getPlans().find(x=>x.id===b.dataset.id)));
  $$('.delete-plan').forEach(b=>b.onclick=()=>{if(confirm('刪除這筆自訂行程？')) savePlans(getPlans().filter(x=>x.id!==b.dataset.id));});
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
    $('#nowBar').style.width='100%';
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
  const prev=i>0?new Date(all[i-1].at).getTime():t-24*3600*1000;
  const pct=Math.min(100,Math.max(0,(now-prev)/(t-prev)*100));
  $('#nowBar').style.width=`${pct}%`;
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

/* ── chrome ───────────────────────────────────────────────── */
function showView(name,focusTab){
  $$('.tab').forEach(x=>{
    const on=x.dataset.view===name;
    x.classList.toggle('active',on);
    x.setAttribute('aria-selected',String(on));
    x.tabIndex=on?0:-1;
    if(on&&focusTab) x.focus();
  });
  $$('.view').forEach(x=>x.classList.toggle('active',x.id===name));
}
function setupTabs(){
  const tabs=$$('.tab');
  tabs.forEach((b,i)=>{
    b.querySelector('.tab-ico').innerHTML=icon(b.dataset.icon);
    b.addEventListener('click',()=>{showView(b.dataset.view);window.scrollTo({top:0,behavior:'smooth'});});
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
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
  let promptEvent=null; const btn=$('#installBtn');
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;btn.hidden=false;});
  btn.addEventListener('click',async()=>{if(!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;btn.hidden=true;});
  window.addEventListener('appinstalled',()=>btn.hidden=true);
}
$('#resetTodos').addEventListener('click',()=>{if(confirm('要清除所有待辦勾選狀態嗎？')){localStorage.removeItem(todoKey);renderTodos();}});

setupTabs();
dayChips(dayFilter,setDay,'#dayStrip');
renderTimeline();
renderRisks();
renderTodos();
renderCosts();
setupPlanner();
setupSources();
setupBanner();
setupPWA();
setupNextJump();
updateClock();
setInterval(updateClock,30000);
