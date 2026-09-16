/* ── the trip ──────────────────────────────────────────────
   This file is the only place that knows about a particular
   journey. app.js renders whatever it finds here and holds no
   dates, flight numbers, names or prices of its own.

   To run another trip: copy this file, change meta.id (it
   namespaces localStorage, so a new id starts with a clean
   set of ticks and custom plans), and replace the content.
   `node scripts/check-trip.mjs` validates the result.

   An event carrying `milestone` is what the countdown counts
   down to. Milestones live on the event rather than in a list
   of their own, so one can never point at a row that moved.
   ──────────────────────────────────────────────────────────*/
window.TRIP = {
  "meta": {
    "id": "my2026",
    "title": "馬來西亞 6天5夜",
    "shortTitle": "馬來西亞行程",
    "subtitle": "2026 · 10/08–10/13 · 5 人",
    "description": "2026 馬來西亞 6天5夜旅程助手：下一個行程、倒數、每日行程與出發前待辦",
    "party": 5,
    "currency": {
      "prefix": "NT$",
      "locale": "zh-TW"
    },
    "tz": "+08:00",
    "timeZone": "Asia/Taipei",
    "checkedOn": "2026/09/11",
    "alert": {
      "title": "10/13 關鍵提醒",
      "text": "MH2543 抵達 KUL 後，直接領行李 → 長榮重新報到。14:30 前完成。"
    }
  },
  "types": {
    "高鐵": {
      "icon": "train",
      "group": "transport"
    },
    "轉乘": {
      "icon": "transfer",
      "group": "transport"
    },
    "航班": {
      "icon": "plane",
      "group": "transport"
    },
    "移動": {
      "icon": "car",
      "group": "transport"
    },
    "入境轉乘": {
      "icon": "passport",
      "group": "transport"
    },
    "關鍵轉機": {
      "icon": "alert",
      "group": "transport"
    },
    "關鍵截止": {
      "icon": "clock",
      "group": "transport"
    },
    "抵達": {
      "icon": "pin",
      "group": "stay"
    },
    "住宿": {
      "icon": "bed",
      "group": "stay",
      "copy": "住宿名稱"
    },
    "退房": {
      "icon": "luggage",
      "group": "stay"
    },
    "自由行": {
      "icon": "sun"
    },
    "景點": {
      "plannable": true,
      "icon": "camera"
    },
    "餐廳": {
      "plannable": true,
      "icon": "food"
    },
    "交通": {
      "plannable": true,
      "icon": "car",
      "group": "transport"
    },
    "集合": {
      "plannable": true,
      "icon": "users"
    },
    "購物": {
      "plannable": true,
      "icon": "bag"
    },
    "其他": {
      "plannable": true,
      "icon": "dot"
    }
  },
  "categories": {
    "機票": "var(--brand)",
    "住宿": "var(--accent)"
  },
  "days": [
    {
      "date": "2026-10-08",
      "label": "10/08（四）",
      "events": [
        {
          "time": "06:40",
          "type": "高鐵",
          "title": "左營 → 桃園（經台中）",
          "meta": [
            "手寫規劃班次",
            "桃園 08:18 抵達",
            "大件行李"
          ],
          "status": "⚠ 待最終確認",
          "level": "caution",
          "note": "手寫：06:40 → 07:40 → 08:18；10/8 車票已進入可預訂區間。",
          "route": {
            "kind": "rail",
            "no": "高鐵 南下",
            "from": "左營",
            "fromSub": "高鐵",
            "to": "桃園",
            "toSub": "高鐵",
            "dep": "06:40",
            "arr": "08:18"
          },
          "milestone": {
            "at": "2026-10-08T06:40:00+08:00",
            "title": "左營出發 → 桃園",
            "kind": "高鐵",
            "detail": "預定 08:18 抵達桃園高鐵站"
          }
        },
        {
          "time": "08:18–約08:50",
          "type": "轉乘",
          "title": "高鐵桃園站 → A18 → A13 第二航廈",
          "meta": [
            "桃園機捷",
            "至少抓 30 分"
          ],
          "status": "✓ 可行",
          "note": "A18 步行約 5–10 分；不要把 08:26 當唯一方案，08:32 或後續班次較穩。底線：09:15 前要進入 T2 報到區。"
        },
        {
          "time": "11:15–16:10",
          "type": "航班",
          "title": "台北 TPE → 吉隆坡 KUL",
          "meta": [
            "托運 23kg",
            "手提 7kg"
          ],
          "status": "✓ 可行",
          "note": "建議 08:45–09:00 到報到區；東南亞線櫃檯約起飛前 2.5 小時開、1 小時前關。",
          "route": {
            "kind": "air",
            "no": "JX725",
            "from": "TPE",
            "fromSub": "T2",
            "to": "KUL",
            "toSub": "T1",
            "dep": "11:15",
            "arr": "16:10"
          },
          "milestone": {
            "at": "2026-10-08T11:15:00+08:00",
            "title": "JX725 台北 → 吉隆坡",
            "kind": "航班",
            "detail": "TPE T2 · 11:15 起飛"
          }
        },
        {
          "time": "16:10–約19:00",
          "type": "抵達",
          "title": "KUL 入境、領行李 → Hotel Royal Signature",
          "meta": [
            "KUL T1",
            "抓 1.5–2.5 小時"
          ],
          "status": "✓ 合理",
          "note": "晚間交通視入境排隊與市區路況調整。"
        },
        {
          "time": "住宿",
          "type": "住宿",
          "title": "Hotel Royal Signature",
          "meta": [
            "吉隆坡",
            "2 晚",
            "2間雙床＋1間大床"
          ],
          "status": "✓ 已確認",
          "note": "住 10/8、10/9；10/10 中午 12:00 前退房。"
        }
      ]
    },
    {
      "date": "2026-10-09",
      "label": "10/09（五）",
      "events": [
        {
          "time": "全天",
          "type": "自由行",
          "title": "吉隆坡自由活動",
          "meta": [
            "吉隆坡"
          ],
          "status": "✓ 無衝突",
          "note": "目前沒有固定交通衝突，可加入景點、餐廳與市區交通。"
        }
      ]
    },
    {
      "date": "2026-10-10",
      "label": "10/10（六）",
      "events": [
        {
          "time": "12:00",
          "type": "退房",
          "title": "Hotel Royal Signature 退房／寄放行李",
          "meta": [
            "吉隆坡"
          ],
          "status": "✓ 可行",
          "note": "晚班機 18:25，退房後有充足空檔。"
        },
        {
          "time": "建議14:30前",
          "type": "移動",
          "title": "吉隆坡市區 → KUL Terminal 1",
          "meta": [
            "目標 15:30–16:00 抵達"
          ],
          "status": "✓ 建議",
          "note": "不要拖到最後 1.5 小時才離開市區。",
          "milestone": {
            "at": "2026-10-10T14:30:00+08:00",
            "title": "最晚離開吉隆坡市區往 KUL",
            "kind": "移動",
            "detail": "目標 15:30–16:00 到 T1"
          }
        },
        {
          "time": "18:25–20:15",
          "type": "航班",
          "title": "吉隆坡 KUL → 古晉 KCH",
          "meta": [
            "托運 20kg",
            "手提 7kg"
          ],
          "status": "✓ 可行",
          "note": "17:25 前完成報到；登機門約起飛前 30 分關閉。",
          "route": {
            "kind": "air",
            "no": "MH2528",
            "from": "KUL",
            "fromSub": "T1",
            "to": "KCH",
            "toSub": "T1",
            "dep": "18:25",
            "arr": "20:15"
          },
          "milestone": {
            "at": "2026-10-10T18:25:00+08:00",
            "title": "MH2528 吉隆坡 → 古晉",
            "kind": "航班",
            "detail": "KUL T1 · 18:25 起飛"
          }
        },
        {
          "time": "約20:15–21:15",
          "type": "抵達",
          "title": "KCH 領行李 → Hilton Kuching",
          "meta": [
            "古晉",
            "抓約 1 小時"
          ],
          "status": "✓ 合理",
          "note": "抵達後直接前往飯店。"
        },
        {
          "time": "住宿",
          "type": "住宿",
          "title": "Hilton Kuching",
          "meta": [
            "古晉",
            "3 晚",
            "2間雙床＋1間大床"
          ],
          "status": "✓ 已確認",
          "note": "住 10/10、10/11、10/12；10/13 早上已離店，雖訂房可至中午退房。"
        }
      ]
    },
    {
      "date": "2026-10-11",
      "label": "10/11（日）",
      "events": [
        {
          "time": "全天",
          "type": "自由行",
          "title": "古晉自由活動",
          "meta": [
            "古晉"
          ],
          "status": "✓ 無衝突",
          "note": "可加入景點、餐廳與 Grab 動線。"
        }
      ]
    },
    {
      "date": "2026-10-12",
      "label": "10/12（一）",
      "events": [
        {
          "time": "全天",
          "type": "自由行",
          "title": "古晉自由活動",
          "meta": [
            "古晉"
          ],
          "status": "✓ 無衝突",
          "note": "晚上務必全員秤托運行李，控制在 20kg 內。"
        }
      ]
    },
    {
      "date": "2026-10-13",
      "label": "10/13（二）",
      "events": [
        {
          "time": "07:15–07:30",
          "type": "移動",
          "title": "Hilton Kuching → KCH",
          "meta": [
            "目標 07:45–08:00 抵達"
          ],
          "status": "✓ 建議",
          "note": "09:55 班機；不要被飯店 12:00 退房時間誤導。",
          "milestone": {
            "at": "2026-10-13T07:15:00+08:00",
            "title": "Hilton Kuching 出發 → KCH",
            "kind": "移動",
            "detail": "建議 07:15–07:30 離開"
          }
        },
        {
          "time": "09:55–11:45",
          "type": "航班",
          "title": "古晉 KCH → 吉隆坡 KUL",
          "meta": [
            "托運 20kg",
            "手提 7kg"
          ],
          "status": "✓ 可行",
          "note": "最晚 08:55 完成報到。",
          "route": {
            "kind": "air",
            "no": "MH2543",
            "from": "KCH",
            "fromSub": "T1",
            "to": "KUL",
            "toSub": "T1",
            "dep": "09:55",
            "arr": "11:45"
          },
          "milestone": {
            "at": "2026-10-13T09:55:00+08:00",
            "title": "MH2543 古晉 → 吉隆坡",
            "kind": "航班",
            "detail": "KCH · 09:55 起飛"
          }
        },
        {
          "time": "11:45–14:30",
          "type": "關鍵轉機",
          "title": "領 MH 行李 → 長榮重新報到／托運",
          "meta": [
            "KUL T1",
            "分開機票",
            "安全窗約 2小時45分"
          ],
          "status": "⚠ 14:30 前必須完成",
          "level": "critical",
          "note": "分開機票不保證直掛，當作「領行李＋重新報到」。BR228 櫃檯約 12:30 開、14:30 關；落地後不吃飯、不購物。若 MH 延誤 ≥90 分鐘，立刻聯絡 EVA／出票平台改票。",
          "milestone": {
            "at": "2026-10-13T14:30:00+08:00",
            "title": "BR228 報到截止",
            "kind": "關鍵截止",
            "detail": "KUL T1 · 務必在此之前完成重新報到",
            "hint": "全程最關鍵的時間點"
          }
        },
        {
          "time": "15:30–20:25",
          "type": "航班",
          "title": "吉隆坡 KUL → 台北 TPE",
          "meta": [
            "托運 23kg",
            "手提 7kg",
            "受前段影響"
          ],
          "status": "✓ 受前段影響",
          "level": "caution",
          "note": "14:30 前完成報到；分開機票通常不受後段航司保障。",
          "route": {
            "kind": "air",
            "no": "BR228",
            "from": "KUL",
            "fromSub": "T1",
            "to": "TPE",
            "toSub": "T2",
            "dep": "15:30",
            "arr": "20:25"
          },
          "milestone": {
            "at": "2026-10-13T15:30:00+08:00",
            "title": "BR228 吉隆坡 → 台北",
            "kind": "航班",
            "detail": "KUL T1 · 15:30 起飛"
          }
        },
        {
          "time": "20:25–約21:40+",
          "type": "入境轉乘",
          "title": "TPE T2 入境／領行李 → A13 → A18",
          "meta": [
            "至少抓 75 分鐘"
          ],
          "status": "⚠ 勿排太緊",
          "level": "caution",
          "note": "還要計入滑行、下機、入境、等行李、步行與候車。"
        },
        {
          "time": "22:05 之後",
          "type": "高鐵",
          "title": "桃園 → 左營（經台中）",
          "meta": [
            "尚未訂位",
            "以正式班表為準"
          ],
          "status": "⚠ 待訂位",
          "level": "caution",
          "note": "20:25 落地，入境、領行李到 A18 至少抓 75 分鐘，所以 22:05 之前的班次都不要考慮。抵達 A18 後依實際時間選班次最安全。",
          "milestone": {
            "at": "2026-10-13T22:05:00+08:00",
            "title": "桃園 → 左營高鐵候選",
            "kind": "高鐵",
            "detail": "暫定；以正式班表及實際入境時間決定",
            "hint": "依實際入境時間再決定班次"
          }
        }
      ]
    }
  ],
  "todos": [
    {
      "id": "t1",
      "due": "現在",
      "title": "預訂／確認 10/8 左營→桃園高鐵",
      "why": "10/8 已進入一般訂位區間",
      "priority": "高",
      "note": "優先選能在 08:18 或更早抵達桃園的班次"
    },
    {
      "id": "t2",
      "due": "2026/09/15",
      "title": "查 10/13 桃園→左營正式高鐵班表並訂位",
      "why": "回程需用正式班表確認",
      "priority": "高",
      "note": "22:05 之前的班次都不要考慮，優先保留更晚的備案"
    },
    {
      "id": "t3",
      "due": "出發前7天",
      "title": "再次確認四段航班時間與航廈",
      "why": "班表與航廈仍可能調整",
      "priority": "高",
      "note": "JX725 / MH2528 / MH2543 / BR228"
    },
    {
      "id": "t4",
      "due": "出發前3天",
      "title": "確認 MH 是否能協助直掛至 TPE",
      "why": "分開票不保證直掛",
      "priority": "高",
      "note": "即使可直掛，也不要把它當成保證"
    },
    {
      "id": "t5",
      "due": "出發前2天",
      "title": "完成可用的線上報到／確認座位",
      "why": "減少機場排隊時間",
      "priority": "中",
      "note": "依各航空開放時間"
    },
    {
      "id": "t6",
      "due": "10/10早上",
      "title": "確認吉隆坡→KUL交通與即時路況",
      "why": "市區塞車有變數",
      "priority": "中",
      "note": "目標 15:30–16:00 到 T1"
    },
    {
      "id": "t7",
      "due": "10/12晚上",
      "title": "全員托運行李秤重 ≤20kg",
      "why": "MH 是整趟最低托運額度",
      "priority": "高",
      "note": "超重先重分配或加購"
    },
    {
      "id": "t8",
      "due": "10/13早上",
      "title": "07:15–07:30 離開 Hilton Kuching",
      "why": "確保 09:55 班機有足夠緩衝",
      "priority": "高",
      "note": ""
    },
    {
      "id": "t9",
      "due": "10/13 KUL落地後",
      "title": "直接領行李 → EVA 報到，不逛街不吃正餐",
      "why": "BR228 14:30 關櫃",
      "priority": "高",
      "note": "若 MH 延誤 ≥90 分鐘，立刻聯絡 EVA／出票平台"
    }
  ],
  "costs": [
    {
      "name": "JX725 台北→吉隆坡",
      "cat": "機票",
      "total": 47750,
      "per": 9550
    },
    {
      "name": "MH2528＋MH2543 馬航來回",
      "cat": "機票",
      "total": 20586,
      "per": 4117.2
    },
    {
      "name": "BR228 吉隆坡→台北",
      "cat": "機票",
      "total": 36465,
      "per": 7293
    },
    {
      "name": "Hotel Royal Signature｜雙床2間×2晚",
      "cat": "住宿",
      "total": 10480,
      "per": null
    },
    {
      "name": "Hotel Royal Signature｜大床1間×2晚",
      "cat": "住宿",
      "total": 4990,
      "per": null
    },
    {
      "name": "Hilton Kuching｜雙床2間×3晚",
      "cat": "住宿",
      "total": 24302,
      "per": null
    },
    {
      "name": "Hilton Kuching｜大床1間×3晚",
      "cat": "住宿",
      "total": 11464,
      "per": null
    }
  ],
  "sources": [
    [
      "STARLUX 官方",
      "JX725 桃園 T2；東南亞線報到時間",
      "https://www.starlux-airlines.com/zh-TW/check-in-fly/travel-information/airport-and-transportation/taiwan/taoyuan-international-airport-t2"
    ],
    [
      "桃園機捷官方",
      "A18 / A13 時刻與轉乘",
      "https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/timetable-A18"
    ],
    [
      "桃園機捷官方",
      "A13 時刻與末班資訊",
      "https://www.tymetro.com.tw/tymetro-new/en/_pages/travel-guide/timetable-A13"
    ],
    [
      "Malaysia Airlines 官方",
      "報到櫃檯與登機門截止時間",
      "https://www.malaysiaairlines.com/tw/zh_tw/travel-info/check-in.html"
    ],
    [
      "EVA Air 官方",
      "KUL BR228 航廈與報到截止",
      "https://www.evaair.com/zh-tw/fly-prepare/at-the-airport/worldwide-airports/?countryCode=KUL"
    ],
    [
      "EVA Air 官方",
      "分開機票／托運行李規則",
      "https://www.evaair.com/en-tw/fly-prepare/baggage/free-baggage/checked-baggage/"
    ],
    [
      "台灣高鐵官方",
      "一般對號座訂位規則",
      "https://www.thsrc.com.tw/ArticleContent/d4b49835-e43b-4be8-bc4d-0a1fe74143ff"
    ]
  ]
};
