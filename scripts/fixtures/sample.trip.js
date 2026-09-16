/* A second, unrelated trip. It exists to prove the app carries no knowledge
   of the Malaysia one: the smoke suite serves this in place of trip.js and
   expects the whole shell to come up on it. If a change to app.js only works
   for the real trip, this is what notices. Different country, currency,
   party size, time zone, event vocabulary and length. */
window.TRIP = {
  meta: {
    id: 'sample',
    title: '東京 3天2夜',
    shortTitle: '東京行程',
    subtitle: '2027 · 03/05–03/07 · 2 人',
    description: '東京 3天2夜行程助手',
    party: 2,
    currency: { prefix: '¥', locale: 'ja-JP' },
    tz: '+09:00',
    timeZone: 'Asia/Tokyo',
    checkedOn: '2027/02/01',
    alert: { title: '03/07 提醒', text: '成田快線末班較早，回程請預留 90 分鐘。' }
  },
  types: {
    '航班': { icon: 'plane', group: 'transport' },
    '移動': { icon: 'car', group: 'transport' },
    '住宿': { icon: 'bed', group: 'stay', copy: '住宿名稱' },
    '景點': { plannable: true, icon: 'camera' },
    '餐廳': { plannable: true, icon: 'food' },
    '其他': { plannable: true, icon: 'dot' }
  },
  categories: { '機票': 'var(--brand)', '住宿': 'var(--accent)' },
  days: [
    { date: '2027-03-05', label: '03/05（五）', events: [
      { time: '09:00–13:10', type: '航班', title: '台北 TPE → 東京 NRT', meta: ['托運 23kg'], status: '✓ 已開票',
        note: '第一航廈報到。',
        route: { kind: 'air', no: 'BR198', from: 'TPE', fromSub: 'T2', to: 'NRT', toSub: 'T1', dep: '09:00', arr: '13:10' },
        milestone: { at: '2027-03-05T09:00:00+09:00', detail: 'TPE T2 · 09:00 起飛' } },
      { time: '住宿', type: '住宿', title: 'Shinjuku Granbell Hotel', meta: ['新宿', '2 晚'], status: '✓ 已確認',
        note: '住 03/05、03/06。' }
    ]},
    { date: '2027-03-06', label: '03/06（六）', events: [
      { time: '全天', type: '景點', title: '東京自由活動', meta: ['東京'], status: '✓ 無衝突', note: '沒有固定交通衝突。' }
    ]},
    { date: '2027-03-07', label: '03/07（日）', events: [
      { time: '14:00', type: '移動', title: '新宿 → 成田機場', meta: ['成田快線'], status: '⚠ 勿排太緊',
        level: 'caution', note: '車程約 90 分鐘。',
        milestone: { at: '2027-03-07T14:00:00+09:00', title: '最晚離開新宿', detail: '目標 16:00 到 NRT', hint: '末班較早' } },
      { time: '18:20–21:30', type: '航班', title: '東京 NRT → 台北 TPE', meta: ['托運 23kg'], status: '✓ 已開票',
        note: '17:20 前完成報到。',
        route: { kind: 'air', no: 'BR197', from: 'NRT', fromSub: 'T1', to: 'TPE', toSub: 'T2', dep: '18:20', arr: '21:30' },
        milestone: { at: '2027-03-07T18:20:00+09:00', detail: 'NRT T1 · 18:20 起飛' } }
    ]}
  ],
  todos: [
    { id: 's1', due: '出發前7天', title: '確認兩段航班時間', why: '班表仍可能調整', priority: '高', note: 'BR198 / BR197' },
    { id: 's2', due: '出發前2天', title: '線上報到', why: '減少機場排隊', priority: '中', note: '' }
  ],
  costs: [
    { name: 'BR198＋BR197 來回', cat: '機票', total: 34000, per: 17000 },
    { name: 'Shinjuku Granbell｜1間×2晚', cat: '住宿', total: 18000, per: 9000 }
  ],
  sources: [
    ['EVA Air 官方', '台北東京線班表', 'https://www.evaair.com/'],
    ['JR East 官方', '成田特快時刻', 'https://www.jreast.co.jp/']
  ]
};
