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
          },
          "brief": {
            "line": "搭高鐵去桃園",
            "because": "06:40 的車，08:18 到桃園。",
            "steps": [
              "取票",
              "上車",
              "桃園站轉機捷"
            ],
            "need": "大件行李記得放行李區。",
            "fallback": "沒趕上就改搭下一班，但 09:15 前一定要進 T2 報到區。",
            "window": {
              "from": "2026-10-08T06:40:00+08:00",
              "fromLabel": "出發",
              "wall": "2026-10-08T09:15:00+08:00",
              "wallLabel": "要進報到區",
              "to": "2026-10-08T11:15:00+08:00",
              "toLabel": "起飛"
            }
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
          "note": "A18 步行約 5–10 分；不要把 08:26 當唯一方案，08:32 或後續班次較穩。底線：09:15 前要進入 T2 報到區。",
          "brief": {
            "line": "轉機捷到第二航廈",
            "because": "從 A18 走過去要 5–10 分。底線是 09:15 前要進 T2 報到區。",
            "steps": [
              "走到 A18",
              "搭機捷",
              "A13 下車"
            ],
            "need": "",
            "fallback": "08:26 沒搭到就等 08:32，後面班次也來得及。"
          }
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
          },
          "brief": {
            "line": "登機飛吉隆坡",
            "because": "JX725 11:15 起飛，桃園第二航廈。",
            "steps": [
              "報到託運",
              "出境",
              "登機門"
            ],
            "need": "託運 23kg、手提 7kg。",
            "fallback": "櫃檯約起飛前 1 小時關，來不及就直接找星宇櫃檯。",
            "window": {
              "from": "2026-10-08T08:45:00+08:00",
              "fromLabel": "到報到區",
              "wall": "2026-10-08T10:15:00+08:00",
              "wallLabel": "櫃檯關閉",
              "to": "2026-10-08T11:15:00+08:00",
              "toLabel": "起飛"
            }
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
          "note": "晚間交通視入境排隊與市區路況調整。",
          "brief": {
            "line": "先入境再去飯店",
            "because": "入境排隊加領行李要抓 1.5–2.5 小時，晚間市區路況還會再拖。比預期久是正常的。",
            "steps": [
              "入境",
              "領行李",
              "去飯店"
            ],
            "need": "",
            "fallback": ""
          }
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
          "time": "11:00–11:25",
          "type": "交通",
          "title": "飯店 → 茨廠街（Grab）",
          "meta": [
            "短程約 RM 6–12",
            "台灣門號可註冊"
          ],
          "status": "✓ 可行",
          "note": "茨廠街是徒步區，車子開不進去，上下車點設在蘇丹街或 Jalan Tun H S Lee 這種大路比較好等。",
          "brief": {
            "line": "叫 Grab 去蘇丹街",
            "because": "茨廠街是徒步區，車進不去，要在蘇丹街或 Jalan Tun H S Lee 上下車。",
            "steps": [
              "開 Grab",
              "設蘇丹街",
              "上車"
            ],
            "need": "",
            "fallback": ""
          }
        },
        {
          "time": "11:30–12:45",
          "type": "餐廳",
          "title": "麗豐啦啦米（蘇丹街）",
          "meta": [
            "米其林必比登",
            "Jalan Sultan 99",
            "約 10:00 開門"
          ],
          "status": "✓ 可行",
          "note": "招牌是啦啦米粉湯（啦啦＝蛤蜊），湯底薑、辣椒、蒜爆香加米酒，先甜後辣；另有青口粉絲煲。湯底偏燥熱，可配涼茶。刻意排 11:30 進場，12:00–13:30 是尖峰。別走錯：老店「麗豐茶室」在 138, Jalan Tun H S Lee，蘇丹街這間是 2022 年開的獨立餐廳，比較大也好找。",
          "brief": {
            "line": "吃麗豐啦啦米",
            "because": "米其林必比登。11:30 進場是為了避開 12:00–13:30 的尖峰。",
            "steps": [
              "找蘇丹街 99 號",
              "點啦啦米粉湯"
            ],
            "need": "",
            "fallback": "排太久就先去茨廠街逛，晚一點再回來。"
          }
        },
        {
          "time": "12:45–13:45",
          "type": "景點",
          "title": "茨廠街",
          "meta": [
            "步行 3 分・240m",
            "可以殺價"
          ],
          "status": "✓ 可行",
          "note": "吉隆坡的唐人街，1850 年代客家與廣東礦工在此落腳。2003 年加蓋綠色頂棚，當地人叫它「青龍」。貓眼水（龍眼冰）、義欽豆腐花（1940 年代老字號，攤位在 Jalan Hang Lekir 路口，一碗不到 RM 3）、肉乾、炒栗子。攤販小物可以談價，先問價再比價。",
          "brief": {
            "line": "逛茨廠街",
            "because": "就在麗豐隔壁街，240 公尺。頂棚下不怕曬，邊走邊吃。",
            "steps": [
              "走過去",
              "吃貓眼水",
              "逛攤子"
            ],
            "need": "現金小鈔，攤子多半不收卡。",
            "fallback": "下雨就待在頂棚下，那整條街都有蓋。"
          }
        },
        {
          "time": "13:45–14:15",
          "type": "景點",
          "title": "鬼仔巷",
          "meta": [
            "步行 7 分・490m",
            "拍照景點"
          ],
          "status": "✓ 可行",
          "note": "戰前老店屋之間的窄巷，2019 年整修後請本地畫家畫了 1960 年代生活場景：窗邊梳頭的女人、玩彈珠的小孩、教書法的老師。每幅壁畫旁有 QR code 可看故事。巷裡有一支百年老路燈，據說是吉隆坡第一批電燈唯一留下的。入口小拱橋和紅燈籠最好拍。每日 09:00–00:00。",
          "brief": {
            "line": "去鬼仔巷拍照",
            "because": "壁畫巷，15–20 分鐘就夠。入口的小橋和燈籠最好拍。",
            "steps": [
              "走 490 公尺",
              "入口拍照",
              "看壁畫"
            ],
            "need": "",
            "fallback": ""
          }
        },
        {
          "time": "14:15–15:00",
          "type": "景點",
          "title": "馬里安曼興都廟＋關帝廟",
          "meta": [
            "步行 6 分・400m",
            "需脫鞋、遮肩膝"
          ],
          "status": "⚠ 有服儀規定",
          "note": "吉隆坡最古老的印度廟，1873 年創立，現廟為 1968 年重建。入口五層塔門約 23 公尺，上面雕了 228 尊神像，由南印度泰米爾納德邦工匠手工完成。廟內收著一台 350 公斤純銀戰車，大寶森節會遊行到黑風洞。斜對面是 1887 年廣肇會館建的關帝廟，裡面的關公大刀據說摸了帶來好運。約 06:00–21:00。",
          "brief": {
            "line": "進興都廟要脫鞋",
            "because": "肩膀膝蓋要遮住，進門前脫鞋寄放。斜對面還有一間關帝廟。",
            "steps": [
              "脫鞋寄放",
              "進廟",
              "看對面關帝廟"
            ],
            "need": "遮肩膝的衣服或薄圍巾；寄鞋要銅板。",
            "fallback": "穿短褲無袖可以在門口借紗籠。"
          }
        },
        {
          "time": "15:00–16:00",
          "type": "購物",
          "title": "中央市場（Pasar Seni）",
          "meta": [
            "步行 7 分・470m",
            "有冷氣"
          ],
          "status": "✓ 可行",
          "note": "1888 年開張時是濕貨市場，現在的粉藍色裝飾藝術建築落成於 1937 年，1986 年改成手工藝中心。蠟染布、宋谷錦、錫器、木雕、白咖啡一站買齊；館內分馬來巷、峇峇娘惹區、印度巷。2025 年初一樓新開 Pasar Besar，三百多個「馬來西亞製造」攤位。旁邊 Kasturi Walk 頂著巨大風箏造型頂棚。約 10:00–22:00，部分店家 20:00 關。多數店家可刷卡。",
          "brief": {
            "line": "中央市場買伴手禮",
            "because": "有冷氣，下午雷陣雨躲這裡剛好。蠟染布、錫器、白咖啡一站買齊。",
            "steps": [
              "走 470 公尺",
              "逛一樓新館",
              "結帳"
            ],
            "need": "",
            "fallback": "走不動就從這裡直接叫 Grab 回飯店。"
          }
        },
        {
          "time": "16:00 之後",
          "type": "交通",
          "title": "中央市場 → 飯店（Grab）",
          "meta": [
            "自由調整"
          ],
          "status": "✓ 建議",
          "note": "沒有硬性時間，體力和天氣決定。想多逛就多逛，默迪卡118 在這一帶抬頭就看得到，不用特地走過去。",
          "brief": {
            "line": "叫 Grab 回飯店",
            "because": "今天沒有硬性時間，想多逛就多逛。",
            "steps": [
              "開 Grab",
              "回飯店"
            ],
            "need": "",
            "fallback": ""
          }
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
          "note": "行李寄飯店，附近吃個午餐，14:30 前要回來拿行李。",
          "brief": {
            "line": "退房後寄放行李",
            "because": "行李先寄飯店。午餐在附近解決，14:30 前要回來拿行李。",
            "steps": [
              "退房",
              "寄放行李"
            ],
            "need": "",
            "fallback": ""
          }
        },
        {
          "time": "12:20–13:40",
          "type": "餐廳",
          "title": "飯店附近午餐",
          "meta": [
            "不要跑遠"
          ],
          "status": "✓ 可行",
          "note": "茨廠街那一帶 10/09 已經去過了，今天不要再跑市區，14:30 前要回飯店拿行李。",
          "brief": {
            "line": "附近吃午餐就好",
            "because": "14:30 要回飯店拿行李出發去機場，今天不要跑遠。",
            "steps": [
              "飯店附近吃",
              "回飯店"
            ],
            "need": "",
            "fallback": ""
          }
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
          },
          "brief": {
            "line": "出發去機場",
            "because": "18:25 的班機，市區到 KUL 要抓一小時以上。",
            "steps": [
              "取寄放行李",
              "叫車",
              "KUL T1"
            ],
            "need": "目標 15:30–16:00 到 T1。",
            "fallback": "塞車就改搭機場快線，不要硬等車。",
            "window": {
              "from": "2026-10-10T14:30:00+08:00",
              "fromLabel": "該出發",
              "wall": "2026-10-10T17:25:00+08:00",
              "wallLabel": "報到截止",
              "to": "2026-10-10T18:25:00+08:00",
              "toLabel": "起飛"
            }
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
          },
          "brief": {
            "line": "登機飛古晉",
            "because": "MH2528 18:25 起飛，KUL 第一航廈。",
            "steps": [
              "報到託運",
              "安檢",
              "登機門"
            ],
            "need": "託運 20kg、手提 7kg。",
            "fallback": "登機門約起飛前 30 分關，來不及先打給馬航。",
            "window": {
              "from": "2026-10-10T16:00:00+08:00",
              "fromLabel": "到機場",
              "wall": "2026-10-10T17:25:00+08:00",
              "wallLabel": "報到截止",
              "to": "2026-10-10T18:25:00+08:00",
              "toLabel": "起飛"
            }
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
          "note": "抵達後直接前往飯店。",
          "brief": {
            "line": "領完行李去飯店",
            "because": "20:15 落地古晉，領完行李直接去 Hilton Kuching，整段抓約 1 小時。",
            "steps": [
              "領行李",
              "去飯店",
              "入住"
            ],
            "need": "",
            "fallback": ""
          }
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
          "time": "09:30–11:30",
          "type": "景點",
          "title": "古晉老城區散步",
          "meta": [
            "飯店步行 6 分",
            "Waterfront 0.6km"
          ],
          "status": "✓ 免費",
          "note": "Hilton 就在砂拉越河邊，走路約 6 分鐘（0.6 公里）到 Kuching Waterfront。沿岸有貓雕像、壁畫、Square Tower、Tua Pek Kong 老廟，再往內走就是古晉的華人老街。全程免費，熱了隨時回飯店。",
          "brief": {
            "line": "沿河走走老城區",
            "because": "飯店走過去 6 分鐘就到河濱。貓雕像、老廟、壁畫都在這一帶。",
            "steps": [
              "走去河濱",
              "沿岸逛",
              "看老廟"
            ],
            "need": "",
            "fallback": "太熱就回飯店，下午還有行程。"
          }
        },
        {
          "time": "11:30–13:30",
          "type": "餐廳",
          "title": "老城區午餐",
          "meta": [
            "自選"
          ],
          "status": "✓ 自由",
          "note": "河濱和華人老街一帶餐廳很多，沒有指定。吃飽一點，下午去實蒙莪來回要三小時。",
          "brief": {
            "line": "老城區吃午餐",
            "because": "下午去實蒙莪來回三小時，先吃飽。",
            "steps": [
              "老街找店",
              "吃飽"
            ],
            "need": "",
            "fallback": ""
          }
        },
        {
          "time": "14:00–14:45",
          "type": "交通",
          "title": "市區 → 實蒙莪野生動物中心（Grab）",
          "meta": [
            "車程約 30–40 分",
            "提早出發"
          ],
          "status": "⚠ 回程要先約",
          "note": "中心在市區南方約 20 公里。餵食時間一到就開始，遲到就看不到，抓寬一點。回程在郊區不一定馬上叫得到車，上車時就跟司機約好回程，或請他等。",
          "brief": {
            "line": "提早出發去實蒙莪",
            "because": "車程 30–40 分，15:00 餵食一到就開始，遲到看不到。",
            "steps": [
              "叫 Grab",
              "約好回程"
            ],
            "need": "",
            "fallback": "叫不到車就請飯店櫃檯幫忙安排。"
          }
        },
        {
          "time": "15:00–16:00",
          "type": "景點",
          "title": "實蒙莪猩猩餵食時間",
          "meta": [
            "RM 10 / 兒童 RM 5",
            "每日 09:00 與 15:00"
          ],
          "status": "⚠ 野生，不保證出現",
          "note": "砂拉越最大的紅毛猩猩復育中心，1975 年成立。餵食時間 09:00–10:00 與 15:00–16:00，中心開放 08:00–12:30、14:00–16:00。牠們是半野放的，森林裡果子多的時候就不一定會回來吃，看不看得到要碰運氣。票價以現場公告為準。",
          "brief": {
            "line": "看紅毛猩猩餵食",
            "because": "15:00–16:00 餵食。半野放的，森林果子多時不一定會出現。",
            "steps": [
              "買票",
              "跟著步道走",
              "安靜等"
            ],
            "need": "現金買票，RM 10 左右。",
            "fallback": "沒出現就逛步道，不要餵食也不要靠近。"
          }
        },
        {
          "time": "16:00–17:00",
          "type": "交通",
          "title": "實蒙莪 → 飯店（Grab）",
          "meta": [
            "先約好的車"
          ],
          "status": "✓ 建議",
          "note": "回到市區大約傍晚，想的話可以再去河濱看夕陽，走路就到。",
          "brief": {
            "line": "搭車回飯店",
            "because": "回到市區大概傍晚。想看夕陽的話河濱走路就到。",
            "steps": [
              "搭回程車",
              "回飯店"
            ],
            "need": "",
            "fallback": ""
          }
        }
      ]
    },
    {
      "date": "2026-10-12",
      "label": "10/12（一）",
      "events": [
        {
          "time": "10:00–13:00",
          "type": "景點",
          "title": "婆羅洲文化博物館",
          "meta": [
            "外國人成人 RM 50",
            "週一 09:00–16:45"
          ],
          "status": "⚠ 票價較高",
          "note": "東南亞規模數一數二的博物館，五層樓。週一到週五 09:00–16:45，週六日與假日 09:30–16:30，最後入場 16:00。外國人票價：成人（18–60）RM 50、13–17 歲學生 RM 25、12 歲以下 RM 20。有冷氣，下雨或太熱的時候最適合。",
          "brief": {
            "line": "去婆羅洲文化博物館",
            "because": "五層樓，有冷氣。最後入場 16:00，不要太晚到。",
            "steps": [
              "買票",
              "從頂樓往下逛"
            ],
            "need": "外國人成人 RM 50，可刷卡。",
            "fallback": "不想花這個錢就改逛河濱和老街，都免費。"
          }
        },
        {
          "time": "13:00–14:30",
          "type": "餐廳",
          "title": "午餐",
          "meta": [
            "自選"
          ],
          "status": "✓ 自由",
          "note": "博物館附近或回老街都可以。",
          "brief": {
            "line": "吃午餐",
            "because": "博物館附近或回老街都行。",
            "steps": [
              "找店",
              "吃飯"
            ],
            "need": "",
            "fallback": ""
          }
        },
        {
          "time": "14:30–17:30",
          "type": "購物",
          "title": "老街買伴手禮",
          "meta": [
            "自由調整"
          ],
          "status": "✓ 自由",
          "note": "最後一個完整的白天，要買的東西今天買完。明天 07:15 就要出發去機場，沒有時間再補。",
          "brief": {
            "line": "伴手禮今天買完",
            "because": "明天 07:15 就出發去機場，沒有時間再補。",
            "steps": [
              "列要買的",
              "老街買齊"
            ],
            "need": "現金和卡都帶著。",
            "fallback": "買不到就機場再看，但選擇少很多。"
          }
        },
        {
          "time": "18:00 之後",
          "type": "其他",
          "title": "晚餐後早點收行李",
          "meta": [
            "明早 07:15 出發"
          ],
          "status": "⚠ 明早很早",
          "note": "10/13 早上 07:15 從飯店出發，09:55 的班機最晚 08:55 完成報到。今晚先把行李收好，托運和手提分清楚。",
          "brief": {
            "line": "今晚先收好行李",
            "because": "明早 07:15 就要出發，09:55 的班機 08:55 截止報到。",
            "steps": [
              "收行李",
              "分托運手提",
              "早點睡"
            ],
            "need": "",
            "fallback": ""
          }
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
          },
          "brief": {
            "line": "出發去機場",
            "because": "MH2543 09:55 起飛，車程大約 30 分鐘。",
            "steps": [
              "退房",
              "上車",
              "KCH 出境大廳"
            ],
            "need": "託運 20kg、手提 7kg。",
            "fallback": "這班一定要上，晚了會擠掉吉隆坡轉機的時間。",
            "window": {
              "from": "2026-10-13T07:15:00+08:00",
              "fromLabel": "出發",
              "wall": "2026-10-13T08:55:00+08:00",
              "wallLabel": "報到截止",
              "to": "2026-10-13T09:55:00+08:00",
              "toLabel": "起飛"
            }
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
          },
          "brief": {
            "line": "登機飛吉隆坡",
            "because": "MH2543 09:55 起飛，11:45 落地 KUL。",
            "steps": [
              "安檢",
              "登機門"
            ],
            "need": "下一段是分開的票，行李不一定直掛。",
            "fallback": "延誤 90 分鐘以上，立刻聯絡長榮或出票平台。",
            "window": {
              "from": "2026-10-13T08:55:00+08:00",
              "fromLabel": "完成報到",
              "wall": "2026-10-13T09:25:00+08:00",
              "wallLabel": "登機門關",
              "to": "2026-10-13T09:55:00+08:00",
              "toLabel": "起飛"
            }
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
          },
          "brief": {
            "line": "直接去長榮報到",
            "because": "剛落地吉隆坡。長榮櫃檯 14:30 就關了。",
            "steps": [
              "領行李",
              "轉機櫃檯",
              "報到託運"
            ],
            "need": "託運 23kg、手提 7kg。這是分開的兩張票，行李不一定直掛。",
            "fallback": "先打電話給長榮改票，不要離開機場。",
            "window": {
              "from": "2026-10-13T11:45:00+08:00",
              "fromLabel": "落地",
              "wall": "2026-10-13T14:30:00+08:00",
              "wallLabel": "櫃檯關閉",
              "to": "2026-10-13T15:30:00+08:00",
              "toLabel": "起飛"
            }
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
          },
          "brief": {
            "line": "登機飛台北",
            "because": "BR228 15:30 起飛，20:25 落地桃園。",
            "steps": [
              "出境",
              "登機門"
            ],
            "need": "託運 23kg、手提 7kg。",
            "fallback": "登機門關了就找地勤，不要離開管制區。",
            "window": {
              "from": "2026-10-13T14:30:00+08:00",
              "fromLabel": "完成報到",
              "wall": "2026-10-13T15:00:00+08:00",
              "wallLabel": "登機門關",
              "to": "2026-10-13T15:30:00+08:00",
              "toLabel": "起飛"
            }
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
          "note": "還要計入滑行、下機、入境、等行李、步行與候車。",
          "brief": {
            "line": "入境後走到 A18",
            "because": "滑行、下機、入境、等行李、走路加候車，至少抓 75 分鐘。22:05 之前的高鐵班次都不要考慮。",
            "steps": [
              "入境",
              "領行李",
              "A13 搭機捷",
              "A18 轉高鐵"
            ],
            "need": "",
            "fallback": "到 A18 再依實際時間挑班次。"
          }
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
          },
          "brief": {
            "line": "搭高鐵回左營",
            "because": "入境、領行李走到 A18，至少抓 75 分鐘。",
            "steps": [
              "入境",
              "領行李",
              "A13 → A18"
            ],
            "need": "22:05 之前的班次都不要考慮。",
            "fallback": "末班過了就在桃園過夜，不要硬搭客運。",
            "window": {
              "from": "2026-10-13T20:25:00+08:00",
              "fromLabel": "落地",
              "to": "2026-10-13T23:00:00+08:00",
              "toLabel": "末班附近"
            }
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
      "茨廠街半日遊整理",
      "麗豐啦啦米、茨廠街、鬼仔巷、興都廟、中央市場；步行距離與開放時間查於 2026/10",
      "https://claude.ai/artifact/KRJhNxJLmgWhvdVPcPne1f"
    ],
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
    ],
    [
      "砂拉越林業局／Sarawak Forestry",
      "實蒙莪餵食時間 09:00–10:00、15:00–16:00；門票 RM 10 / 兒童 RM 5",
      "https://forestry.sarawak.gov.my/web/subpage/webpage_view/1024"
    ],
    [
      "砂拉越博物館局",
      "婆羅洲文化博物館開放時間與外國人票價",
      "https://museum.sarawak.gov.my/web/subpage/webpage_view/169"
    ]
  ]
};
