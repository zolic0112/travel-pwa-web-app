/* The trip itself lives in trip.js. Everything below renders whatever it
   finds there and holds no date, flight number, name or price of its own. */
const trip = window.TRIP;
const meta = trip.meta;
const tripDates = trip.days.map(d => d.date);
const tripDateLabels = trip.days.map(d => d.label);
const TZ = meta.timeZone;

/* Milestones are derived from the events that carry them, so one can never
   name a row that has moved or gone — the failure that left the 10/13
   check-in deadline counting down to nothing. */
const milestones = trip.days.flatMap((d, day) => d.events
  .filter(e => e.milestone)
  .map(e => ({
    ...e.milestone, day, ref: e.time,
    title: e.milestone.title || e.title,
    kind: e.milestone.kind || e.type
  })))
  .sort((a, b) => new Date(a.at) - new Date(b.at));

/* every stored key is namespaced by the trip, so a second trip on the same
   origin starts with its own ticks, plans and theme rather than inheriting */
const ns = k => `${meta.id}.${k}`;

/* '+08:00' reads as 'UTC+8' — the countdown is stated in the trip's own zone,
   which is not the reader's once the trip is somewhere else */
const tzLabel = 'UTC' + meta.tz.replace(/:00$/, '').replace(/^([+-])0/, '$1');


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
  plus:P("<path d='M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z'/>"),
  share:P("<path d='M214.64,82.34l-56-56A8,8,0,0,0,144,32V64.65C88.42,68.53,48,111.62,48,168a8,8,0,0,0,14.63,4.46c13.1-19.65,35.21-32,58.53-34.94A88.24,88.24,0,0,1,144,136v32a8,8,0,0,0,13.66,5.66l56-56A8,8,0,0,0,214.64,82.34ZM160,148.69V128a8,8,0,0,0-8-8c-2,0-4.06,0-6.07.14a114.22,114.22,0,0,0-30.2,5.53,113.28,113.28,0,0,0-50.11,31.63C71,116.35,105.16,80,148,80a8,8,0,0,0,8-8V51.31L196.69,92Z'/>"),
  pencil:P("<path d='M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z'/>"),
  eye:P("<path d='M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z'/>"),
  copy:P("<path d='M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z'/>"),
  check2:P("<path d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'/>")
};
/* the vocabulary of event types is the trip's, not the renderer's */
const typeOf = t => trip.types[t] || {};
const icon = name => ICO[name] || ICO.dot;
const typeIcon = t => icon(typeOf(t).icon);

/* ── helpers ──────────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => n == null ? '—' : meta.currency.prefix + Number(n).toLocaleString(meta.currency.locale,{maximumFractionDigits:0});
const escapeHtml = v => String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));


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
const rowKey=(e,dayIx)=>`${dayIx}|${e.time}|${e.title}`;
/* only a row with a clock on it has a moment to be shown at */
const peekable=(e,dayIx)=>!!windowOf(e,trip.days[dayIx].date);
const briefOf=(e,dayIx)=>!!e.brief||!!getBriefs()[rowKey(e,dayIx)];
const aiDraft=(e,dayIx)=>{const b=getBriefs()[rowKey(e,dayIx)];return !!b&&b.by==='ai';};
function eventRow(e,dayIx){
  const isNext=rowKey(e,dayIx)===nextEventKey;
  const cls=[e.level||'', typeOf(e.type).group==='transport'?'is-transport':typeOf(e.type).group==='stay'?'is-stay':'', isNext?'is-next':''].join(' ').trim();
  return `<article class="tl-row ${cls}">
    <div class="tl-time">${timeCell(e.time)}</div>
    <div class="tl-rail"><span class="tl-node">${typeIcon(e.type)}</span></div>
    <div class="tl-card">
      <div class="card-top"><span class="chip type">${e.type}</span>${isNext?'<span class="next-flag">NEXT</span>':''}<span class="status ${statusClass(e.status)}">${e.status}</span></div>
      <h3>${typeOf(e.type).copy?copyChip(e.title,typeOf(e.type).copy):e.title}</h3>
      ${e.route?routeStrip(e.route):''}
      <div class="meta">${e.meta.map(x=>`<span class="meta-chip">${x}</span>`).join('')}</div>
      <p class="note">${e.note}</p>
      ${aiDraft(e,dayIx)?'<p class="ai-flag">AI 起草，還沒有人檢查</p>':''}
      ${peekable(e,dayIx)?`<div class="row-acts">
        <button class="peek" type="button" data-peek="${escapeHtml(rowKey(e,dayIx))}">
          ${icon('eye')}看跟隊畫面</button>
        <button class="peek" type="button" data-edit="${escapeHtml(rowKey(e,dayIx))}">
          ${icon('pencil')}${briefOf(e,dayIx)?'改跟隊內容':'寫跟隊內容'}</button>
      </div>`:''}
    </div>
  </article>`;
}
function renderTimeline(){
  const idx=selectedDay==='all'?trip.days.map((_,i)=>i):[Number(selectedDay)];
  $('#timeline').innerHTML=idx.map(i=>{
    const d=trip.days[i];
    return `<section class="day-group">
      <div class="day-head"><strong>${d.label}</strong><span class="day-tag">${d.events.length} 項</span></div>
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

/* ── to-dos ───────────────────────────────────────────────
   Two lists, not one flag per item: the trip's own checklist, which
   everyone sees the same, and whatever you add for yourself. Choosing
   where a thing goes beats a share switch on every row. */
const todoKey=ns('todos');
const mineKey=ns('todos.mine.v1');

/* Ticks used to be keyed by position in the array, so inserting or
   reordering one to-do silently moved everybody's ticks onto the wrong
   items. They are keyed by id now; this converts the old shape once. */
function getTodoState(){
  let v=null;
  try{ v=JSON.parse(localStorage.getItem(todoKey)); }catch{}
  if(!v||typeof v!=='object'||Array.isArray(v)) return {};
  const byIndex=Object.keys(v).every(k=>/^\d+$/.test(k));
  if(!byIndex) return v;
  const out={};
  for(const k of Object.keys(v)){
    const t=trip.todos[Number(k)];
    if(t&&v[k]) out[t.id]=true;
  }
  saveTodoState(out);
  return out;
}
function saveTodoState(s){
  try{localStorage.setItem(todoKey,JSON.stringify(s));return true}
  catch{toast('無法儲存勾選狀態');return false}
}

function getMine(){
  try{
    const v=JSON.parse(localStorage.getItem(mineKey));
    if(!Array.isArray(v)) return [];
    return v.filter(x=>x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.title==='string')
      .map(x=>({id:x.id,title:x.title,done:!!x.done}));
  }catch{return []}
}
function saveMine(list){
  try{localStorage.setItem(mineKey,JSON.stringify(list));}
  catch{toast('無法儲存，裝置儲存空間已滿');return false}
  renderTodos();return true;
}

function sharedRow(t,state,isNext){
  return `<label class="todo ${state[t.id]?'done':''} ${isNext?'next-up':''}">
    <input type="checkbox" data-id="${escapeHtml(t.id)}" ${state[t.id]?'checked':''}><span class="check"></span>
    <div class="todo-body">
      <div class="todo-top"><span class="due">${escapeHtml(t.due)}</span><span class="pri-chip ${t.priority==='高'?'high':''}">${escapeHtml(t.priority)}優先</span></div>
      <h3>${escapeHtml(t.title)}</h3>
      <p>${escapeHtml(t.why)}${t.note?` · ${escapeHtml(t.note)}`:''}</p>
    </div></label>`;
}
function mineRow(m){
  return `<div class="todo mine ${m.done?'done':''}">
    <label class="todo-hit">
      <input type="checkbox" data-mine="${escapeHtml(m.id)}" ${m.done?'checked':''}><span class="check"></span>
      <div class="todo-body"><h3>${escapeHtml(m.title)}</h3></div>
    </label>
    <button class="icon-btn del-mine" data-id="${escapeHtml(m.id)}" type="button" aria-label="刪除「${escapeHtml(m.title)}」">×</button>
  </div>`;
}

function renderTodos(){
  const state=getTodoState();
  const next=trip.todos.find(t=>!state[t.id]);
  $('#todoList').innerHTML=trip.todos.map(t=>sharedRow(t,state,t===next)).join('');

  const mine=getMine();
  $('#mineList').innerHTML=mine.map(mineRow).join('');
  $('#mineEmpty').hidden=mine.length>0;
  $('#mineCount').textContent=mine.length?`${mine.filter(m=>m.done).length}/${mine.length}`:'';

  $$('#todoList input').forEach(cb=>cb.addEventListener('change',()=>{
    const s=getTodoState();
    if(cb.checked) s[cb.dataset.id]=true; else delete s[cb.dataset.id];
    saveTodoState(s);renderTodos();
  }));
  $$('#mineList input').forEach(cb=>cb.addEventListener('change',()=>{
    saveMine(getMine().map(m=>m.id===cb.dataset.mine?{...m,done:cb.checked}:m));
  }));
  $$('.del-mine').forEach(b=>b.onclick=()=>{
    const gone=getMine().find(m=>m.id===b.dataset.id);
    if(!gone) return;
    saveMine(getMine().filter(m=>m.id!==gone.id));
    toast('已刪除',{label:'復原',fn(){saveMine([...getMine(),gone]);toast('已復原');}});
  });

  const done=trip.todos.filter(t=>state[t.id]).length, total=trip.todos.length,
        pct=total?Math.round(done/total*100):0;
  $('#sharedCount').textContent=`${done}/${total}`;
  $('#todoProgressText').textContent=`${done} / ${total} 完成`;
  $('#todoPercent').textContent=`${pct}%`;
  const C=2*Math.PI*31, ring=$('#todoRing');
  ring.style.strokeDashoffset=String(C*(1-pct/100));
  ring.style.opacity=pct?'1':'0';
  $('#todoNext').textContent=next?`下一項：${next.due} · ${next.title}`:'全部完成，出發前再複查一次即可';
}

/* Which list you are looking at. The two are never on screen together:
   stacked, the second one is only reachable by scrolling past the first. */
function showTodoPane(name){
  $$('.seg-tab').forEach(b=>{
    const on=b.dataset.pane===name;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',String(on));
    b.tabIndex=on?0:-1;
  });
  $('#paneShared').hidden=name!=='shared';
  $('#paneMine').hidden=name!=='mine';
}

function setupMine(){
  const tabs=$$('.seg-tab');
  tabs.forEach((b,i)=>{
    b.addEventListener('click',()=>showTodoPane(b.dataset.pane));
    b.addEventListener('keydown',e=>{
      const step={ArrowRight:1,ArrowLeft:-1,Home:-i,End:tabs.length-1-i}[e.key];
      if(step===undefined) return;
      e.preventDefault();
      const next=tabs[(i+step+tabs.length)%tabs.length];
      showTodoPane(next.dataset.pane);next.focus();
    });
  });

  const form=$('#mineForm'), input=$('#mineInput');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const title=input.value.trim();
    /* an empty submit used to do nothing at all, which is indistinguishable
       from a broken button; put the cursor where the problem is */
    if(!title){ input.focus(); toast('先輸入一個名稱'); return; }
    if(saveMine([...getMine(),{id:`m${Date.now()}`,title,done:false}])){
      input.value='';toast('已加入');
    }
  });
}

/* ── costs ────────────────────────────────────────────────── */
const catColor = c => trip.categories[c] || 'var(--brand)';
function renderCosts(){
  const total=trip.costs.reduce((s,x)=>s+x.total,0);
  const cats=[...new Set(trip.costs.map(c=>c.cat))].map(cat=>({
    cat, sum:trip.costs.filter(c=>c.cat===cat).reduce((s,x)=>s+x.total,0)
  }));
  $('#costSummary').innerHTML=`
    <div class="cost-box"><span>${meta.party} 人已知固定費用</span><strong>${money(total)}</strong></div>
    <div class="cost-box"><span>平均每人（單純平均）</span><strong>${money(total/meta.party)}</strong></div>`;
  $('#costChart').innerHTML=`
    <div class="cc-bar">${cats.map(c=>`<i style="width:${c.sum/total*100}%;background:${catColor(c.cat)}"></i>`).join('')}</div>
    <div class="cc-legend">${cats.map(c=>`<span class="cc-item"><i class="sw" style="background:${catColor(c.cat)}"></i><span>${c.cat}</span><b>${money(c.sum)}</b><span>${Math.round(c.sum/total*100)}%</span></span>`).join('')}</div>`;
  const max=Math.max(...trip.costs.map(c=>c.total));
  $('#costTable').innerHTML=trip.costs.map(c=>`<tr>
    <td><i class="cat-dot" style="background:${catColor(c.cat)}"></i>${c.name}</td>
    <td><span class="share"><span class="share-track"><i style="width:${c.total/max*100}%;background:${catColor(c.cat)}"></i></span><span class="share-pct">${Math.round(c.total/total*100)}%</span></span></td>
    <td>${money(c.total)}</td><td>${money(c.per)}</td></tr>`).join('');
}

/* ── planner ──────────────────────────────────────────────── */
const planKey=ns('plans.v1');
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
    const gone=getPlans().find(x=>x.id===b.dataset.id);
    if(!gone) return;
    savePlans(getPlans().filter(x=>x.id!==gone.id));
    toast('已刪除行程',{label:'復原',fn(){savePlans([...getPlans(),gone]);toast('已復原');}});
  });
}

/* ── next event & countdown ───────────────────────────────── */
function getAllCountdownEvents(){
  const custom=getPlans().map(p=>({
    at:`${p.date}T${p.time}:00${meta.tz}`,title:p.title,kind:p.type,
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
  return new Intl.DateTimeFormat('zh-TW',{timeZone:TZ,month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso));
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
  renderFollow();
  const fmt=new Intl.DateTimeFormat('zh-TW',{timeZone:TZ,month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  $('#clockText').textContent=`${tzLabel} · ${fmt.format(new Date())}`;
  updateNextEvent();
}

/* ── follower mode ────────────────────────────────────────────
   A smaller product, not the same one with the edit buttons greyed out:
   one order filling the screen, and nothing else to look at. Everything
   it shows comes from an event's `brief`. */
const MODE_KEY=ns('mode');
const LEAD_MIN=45;   /* when a thing stops being "later" and becomes "soon" */

/* Follower mode has to answer "what now" for the whole trip, not only for
   the moments somebody sat down and wrote an order for. An event with a
   clock on it is already an answer; it just has not been phrased as one.
   So an unwritten event is carried as a derived entry — the itinerary row
   itself, shown with less confidence: no steps, no wall, nothing to
   expand, because none of that was ever written. This is also what makes
   a brand-new trip.js work in follower mode on the day it is created. */
const HHMM=/(\d{1,2}):(\d{2})/g;
const DERIVED_MIN=60;   /* how long an event with only a start time is given */
function at(date,hh,mm){ return +new Date(`${date}T${String(hh).padStart(2,'0')}:${mm}:00${meta.tz}`); }
function windowOf(e,date){
  const m=[...String(e.time||'').matchAll(HHMM)];
  if(!m.length) return null;                       /* 全天, 住宿: no clock, no order */
  const from=at(date,m[0][1],m[0][2]);
  let to=m[1]?at(date,m[1][1],m[1][2]):from+DERIVED_MIN*60000;
  if(to<=from) to+=864e5;                          /* 22:05 → 00:30 is the next day */
  return {from,to};
}
function derive(e,date){
  const w=windowOf(e,date);
  if(!w) return null;
  return {
    line:e.title, because:(e.meta&&e.meta.length?e.meta.join('・'):e.note)||'',
    steps:[], need:'', fallback:'',
    window:{from:new Date(w.from).toISOString(),fromLabel:'開始',
            to:new Date(w.to).toISOString(),toLabel:'結束'},
  };
}
/* What a leader writes lives beside trip.js, not in it: the row's times stay
   the itinerary's (moving them here would quietly desync the two), and only
   the words are overridden. Nobody fills this in from blank — the dialog
   opens holding whatever the row already says. */
const briefKey=ns('briefs.v1');
const str=(v,n)=>typeof v==='string'?v.slice(0,n):'';
function getBriefs(){
  let v=null;
  try{ v=JSON.parse(localStorage.getItem(briefKey)||'{}'); }catch{}
  if(!v||typeof v!=='object'||Array.isArray(v)) return {};
  const out={};
  for(const [k,b] of Object.entries(v)){
    if(!b||typeof b!=='object'||Array.isArray(b)) continue;
    out[k]={line:str(b.line,12),because:str(b.because,120),
      need:str(b.need,160),fallback:str(b.fallback,160),
      steps:Array.isArray(b.steps)?b.steps.filter(x=>typeof x==='string'&&x.trim()).slice(0,4).map(x=>str(x,20)):[],
      /* who wrote it: anything a person has touched is not 'ai' */
      by:b.by==='ai'?'ai':'me'};
  }
  return out;
}
function saveBriefs(v){
  try{ localStorage.setItem(briefKey,JSON.stringify(v)); return true; }
  catch{ toast('無法儲存，裝置儲存空間已滿'); return false; }
}
function entries(){
  const mine=getBriefs();
  return trip.days.flatMap((d,day)=>d.events.map(e=>{
    /* A written brief may leave out its window: the event's own time string
       already holds it, and restating it is just a chance for the two to
       disagree. A window is only authored when it carries labels nothing can
       derive — 落地, 起飛, 櫃檯關閉. */
    const auto=derive(e,d.date);
    const base=e.brief
      ? (e.brief.window?e.brief:auto&&{...e.brief,window:auto.window})
      : auto;
    if(!base||!base.window) return null;
    const own=mine[rowKey(e,day)];
    /* an override replaces only the fields it fills; the window is never its
       business, so the two can never drift apart */
    const brief=own?{...base,
      line:own.line||base.line, because:own.because||base.because,
      steps:own.steps.length?own.steps:base.steps,
      need:own.need||base.need, fallback:own.fallback||base.fallback}:base;
    return {e,day,brief,written:!!e.brief||!!own,derived:!e.brief&&!own,
      from:+new Date(brief.window.from),to:+new Date(brief.window.to)};
  }).filter(Boolean)).sort((a,b)=>a.from-b.from);
}
const dayFmt=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'});
const dayOf=t=>dayFmt.format(new Date(t));
function todayISO(){ return dayOf(now()); }

/* Three weeks before departure the screen is quiet, correctly — and a quiet
   screen is indistinguishable from a broken one. ?at=2026-10-08T17:30 moves
   the follower clock so any moment can be looked at before the trip, by
   whoever is checking it as much as by whoever built it. It stays in the URL
   and says so on screen, because a preview that looks like the real thing is
   worse than no preview. */
let previewAt=null;
function readPreview(){
  let v=null;
  try{ v=new URL(location.href).searchParams.get('at'); }catch{}
  if(!v) return;
  const t=Date.parse(/[zZ+]|\d[+-]\d\d:?\d\d$/.test(v)?v:v+meta.tz);
  if(!Number.isNaN(t)) previewAt=t;
}
function now(){ return previewAt??Date.now(); }
/* what the screen should be showing at this moment */
function followState(t=now()){
  const all=entries();
  /* Windows overlap: the HSR leg runs 06:40–11:15 because its wall is the
     check-in desk, but at 08:30 you are on the airport train, which has a
     window of its own. Among the things happening right now, the one that
     started most recently is the one you are actually in — and entries are
     sorted by start, so that is the last of them. */
  const live=all.filter(x=>x.from<=t&&x.to>t)
    .sort((a,b)=>(a.from-b.from)||(b.to-a.to));
  /* and when two start together — the 22:05 train's window opens at landing,
     same as the transfer inside it — the narrower one is the more precise
     answer, so it sorts last */
  const item=live.length?live[live.length-1]:all.find(x=>x.to>t);
  if(!item) return {kind:'done'};
  const today=todayISO();
  /* before the trip, say so with the number of days — not "沒有要趕的事",
     which is what this also says on a free day in the middle of it */
  if(all[0]&&t<all[0].from&&dayOf(all[0].from)!==today) return {kind:'before',item:all[0]};
  if(dayOf(item.from)!==today) return {kind:'free',item};
  if(t<item.from-LEAD_MIN*60000) return {kind:'later',item};
  if(t<item.from) return {kind:'soon',item};
  /* only a written order can claim the tight treatment */
  return {kind:(!item.derived&&item.e.level==='critical')?'tight':'go',item};
}
/* a plain pair, not markup: the screen wants one number and one word */
function span(ms){
  if(ms<=0) return {n:'現在',u:''};
  const min=Math.round(ms/60000), d=Math.floor(min/1440), h=Math.floor((min%1440)/60), m=min%60;
  if(d>0) return {n:String(d),u:'天後'};
  if(h>0) return {n:`${h}:${String(m).padStart(2,'0')}`,u:'小時'};
  return {n:String(m),u:'分鐘'};
}
function clockAt(iso){
  return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false})
    .format(new Date(iso));
}

let followOpen=false;
function setFollowOpen(o){
  followOpen=o;
  $('#flDetail').hidden=!o;
  $('#flMore').setAttribute('aria-expanded',String(o));
  $('#flCard').classList.toggle('open',o);
  $('#flMoreLabel').textContent=o?'收起來':'還要注意什麼';
}

function renderFollow(){
  if(document.documentElement.dataset.mode!=='follow') return;
  const t=now(), st=followState(t), card=$('#flCard');
  $('#flTrip').textContent=meta.title;
  $('#flWhen').textContent=new Intl.DateTimeFormat('zh-TW',
    {timeZone:TZ,month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})
    .format(new Date(t));
  $('#flPreview').hidden=previewAt==null;

  const quiet=st.kind==='done'||st.kind==='free'||st.kind==='before';
  card.classList.toggle('hot',st.kind==='tight');
  card.classList.toggle('calm',quiet);
  ['#flRoute','#flWin','#flSteps','#flMore'].forEach(id=>$(id).hidden=quiet);
  if(quiet) setFollowOpen(false);

  /* today's other stops, so you know where you are in the day */
  const today=todayISO();
  const mine=entries().filter(x=>dayOf(x.from)===today);
  const here=st.item?mine.indexOf(st.item):-1;
  $('#flDots').innerHTML=mine.length>1
    ? mine.map((_,i)=>`<i class="${i<here?'past':i===here?'here':''}"></i>`).join('') : '';

  if(st.kind==='done'){
    $('#flGlyph').innerHTML=icon('check2');
    $('#flKicker').textContent='';
    $('#flLine').textContent='旅程完成';
    $('#flBecause').textContent='所有固定行程都結束了。';
    $('#flGround').textContent='';
    return;
  }
  if(st.kind==='before'){
    const b=st.item.brief, days=Math.ceil((st.item.from-t)/864e5);
    $('#flGlyph').innerHTML=icon('luggage');
    $('#flKicker').textContent='出發前';
    $('#flLine').textContent=`還有 ${days} 天`;
    $('#flBecause').textContent=
      `${dayOf(st.item.from).slice(5).replace('-','/')} ${clockAt(b.window.from)}「${b.line}」開始。到那天為止這裡都會是這樣，行前要準備的東西在完整行程裡。`;
    $('#flGround').textContent='';
    return;
  }
  if(st.kind==='free'){
    const b=st.item.brief;
    $('#flGlyph').innerHTML=icon('sun');
    $('#flKicker').textContent='今天';
    $('#flLine').textContent='沒有要趕的事';
    $('#flBecause').textContent=
      `下一件是 ${dayOf(st.item.from).slice(5).replace('-','/')} ${clockAt(b.window.from)}：${b.line}。在那之前不用開這個。`;
    $('#flGround').textContent='';
    return;
  }

  const {e}=st.item, b=st.item.brief, w=b.window, plain=st.item.derived;
  const from=st.item.from, to=st.item.to, wall=w.wall?+new Date(w.wall):null;
  $('#flGlyph').innerHTML=typeIcon(e.type);
  $('#flKicker').textContent={later:'接下來',soon:'快到了',go:'現在',tight:'這段要抓緊'}[st.kind];
  $('#flLine').textContent=b.line;
  card.classList.toggle('plain',plain);
  $('#flBecause').textContent=b.because;

  /* before it starts, the number is time until it starts; after, time left
     against the wall — which is the deadline, not the departure */
  const target=(st.kind==='later'||st.kind==='soon')?from:(wall||to);
  const s=span(target-t);
  $('#flCd').textContent=s.n;
  $('#flCdu').textContent=(st.kind==='later'||st.kind==='soon')
    ? `${s.u}${s.u?'後':''}${b.line}` : `${s.u?s.u+'，':''}到${w.wallLabel||w.toLabel}`;

  const pct=x=>Math.max(0,Math.min(100,(x-from)/(to-from)*100));
  $('#flFill').style.width=pct(t)+'%';
  $('#flNow').style.left=Math.max(2,pct(t))+'%';
  const hasWall=wall!=null;
  $('#flWall').hidden=!hasWall; $('#flWallTag').hidden=!hasWall;
  if(hasWall){
    $('#flWall').style.left=pct(wall)+'%';
    $('#flWallTag').style.left=pct(wall)+'%';
    $('#flWallTime').textContent=clockAt(w.wall);
    $('#flWallWhat').textContent=w.wallLabel;
  }
  $('#flL1').textContent=clockAt(w.from); $('#flL1t').textContent=w.fromLabel;
  $('#flL2').textContent=clockAt(w.to);   $('#flL2t').textContent=w.toLabel;

  const r=e.route;
  $('#flRoute').hidden=!r;
  if(r){
    $('#flFrom').textContent=r.from; $('#flFromSub').textContent=r.fromSub||'';
    $('#flTo').textContent=r.to;     $('#flToSub').textContent=r.toSub||'';
    $('#flLegIcon').innerHTML=r.kind==='air'?ICO.plane:ICO.train;
  }
  /* nothing was written, so nothing is claimed */
  $('#flSteps').hidden=plain||!b.steps.length;
  $('#flMore').hidden=plain||!(b.need||b.fallback);
  if(plain) setFollowOpen(false);
  $('#flSteps').innerHTML=b.steps
    .map((x,i)=>`${i?'<i>→</i>':''}<b>${escapeHtml(x)}</b>`).join('');
  $('#flSteps2').textContent=b.steps.join(' → ');
  $('#flNeed').textContent=b.need;
  $('#flFallback').textContent=b.fallback;
  $('#flGround').textContent=meta.groundTruth||'實際時間與地點以現場公告為準';
}

function setMode(m){
  if(m!=='follow'&&previewAt!=null){
    previewAt=null;
    try{
      const u=new URL(location.href); u.searchParams.delete('at');
      history.replaceState(null,'',u.pathname+u.search+u.hash);
    }catch{}
  }
  document.documentElement.dataset.mode=m;
  $('#follow').hidden=m!=='follow';
  $('#modeBtn').textContent=m==='follow'?'看完整行程':'跟隊模式';
  try{localStorage.setItem(MODE_KEY,m)}catch{}
  if(m==='follow'){ setFollowOpen(false); renderFollow(); scrollTo(0,0); }
}
/* A link decides the mode. Send ?mode=follow to the group and everyone who
   opens it lands in the follower screen without being told which button to
   press. The parameter is stripped afterwards so that leaving follower mode
   survives a reload — otherwise the URL would drag them back in forever. */
function modeFromURL(){
  let m=null;
  try{ m=new URL(location.href).searchParams.get('mode'); }catch{}
  if(!m && location.hash==='#follow') m='follow';
  if(m!=='follow' && m!=='lead') return null;
  try{
    const u=new URL(location.href);
    u.searchParams.delete('mode');
    if(u.hash==='#follow') u.hash='';
    history.replaceState(null,'',u.pathname+u.search+u.hash);
  }catch{}
  return m;
}
function followLink(){
  const u=new URL(location.href);
  u.search=''; u.hash='';
  u.searchParams.set('mode','follow');
  return u.href;
}
async function shareFollow(){
  const url=followLink();
  const text=`${meta.shortTitle||meta.title}｜接下來要做什麼，這個連結會一直告訴你`;
  if(navigator.share){
    try{ await navigator.share({title:meta.title,text,url}); return; }
    catch(e){ if(e&&e.name==='AbortError') return; }
  }
  try{ await navigator.clipboard.writeText(url); toast('連結已複製，貼到群組就好'); }
  catch{ toast('長按網址列複製本頁網址，末尾加上 ?mode=follow'); }
}

/* "I want to tap a row and see what follower mode says there." A URL
   parameter answered that only for whoever is willing to type one. */
function peek(key){
  const item=entries().find(x=>rowKey(x.e,x.day)===key);
  if(!item) return;
  previewAt=item.from;
  setMode('follow');
}

/* ── AI 起草 ──────────────────────────────────────────────
   Step one of getting content written by something other than a person
   typing it: the app builds the prompt, a human carries it to Claude, and
   the JSON comes back through the same validator the editor uses. No key
   lives in this page, nothing is sent anywhere, and nothing is stored
   until a person has looked at it.

   This is deliberately the cheap version. It answers the question that
   decides whether the expensive version is worth building: is what comes
   back actually good enough to hand somebody in an airport? */

/* Every step is a chip you read at a glance in a row of chips. The longest
   one anybody has hand-written is 9 characters (「A13 → A18」), so the limit
   is 10 — and the prompt, this gate and check-trip.mjs all say 10, because a
   rule the prompt asks for and the code does not enforce is not a rule. */
const STEP_MAX=10;
function briefRules(){
  return [
    /* Every one of these exists because a real draft got it wrong. */
    '一句話（line）不超過 12 個字。這是口令，不是說明。超過 12 字就是失敗。',
    '**一句話要講的是「這一段」本身的動作，不是下一段的。** 例如一段是「入境、領行李、走到車站」，那句話就不能寫成「搭車回家」—— 那是下一段的事，跟隊的人會跳過眼前該做的事。',
    `步驟（steps）最多 4 步，每步最多 ${STEP_MAX} 個字，是動作不是描述。做不到 4 步以內就給比較少步。`,
    '為什麼（because）一到兩句，講這段為什麼重要、什麼會出錯。',
    '**帶什麼（need）預設留空字串。** 只有資料裡明確提到的東西才寫（例如托運重量、特定證件）。不要寫「行李」「手機」「錢包」「充電器」這種每個人本來就會帶的東西 —— 那是雜訊，會讓真正重要的那一項被忽略。',
    '**萬一來不及（fallback）只能從資料裡來，而且要是「沒趕上該怎麼辦」。** 備註裡「不要…只有一個方案」「若…就…」「改搭／改票」這類句子才是它的來源。',
    '**死線不是備案。** 「X 點前要到」是要求，寫進「為什麼」；「沒趕上就搭下一班」才是備案。資料裡沒有備案就留空字串。',
    '**把一句話換句話說，不算 fallback。** 「直接往前走」「盡快前往」這種等於沒寫，寧可留空。',
    '語氣是同行的朋友在提醒，不是軍事命令，也不是客服。不要用「請」「務必」「敬請」。',
    '全部用繁體中文。',
    '**只能用下面提供的資料。** 兩件事都不能編：',
    '　a. 不確定的事實 —— 電話、地址、價格、櫃檯位置、班次號碼，一律留空。',
    '　b. **沒有人下過的動作** —— 不要自己加「全員集合」「拍照留念」「順便逛一下」這類指令。使用者會照著做，而那不是任何人要求他做的事。',
  /* lines starting with a full-width space are continuations of the rule
     above them, so they must not take a number of their own */
  ].reduce((acc,x)=>{
    if(x.startsWith('　')) acc.out.push(x);
    else acc.out.push(`${++acc.n}. ${x}`);
    return acc;
  },{n:0,out:[]}).out.join('\n');
}
function eventForPrompt(x){
  const e=x.e, w=e.brief&&e.brief.window;
  return {
    key:rowKey(e,x.day),
    日期:trip.days[x.day].label, 時間:e.time, 類型:e.type, 標題:e.title,
    ...(e.meta&&e.meta.length?{標記:e.meta}:{}),
    ...(e.note?{備註:e.note}:{}),
    ...(e.route?{路線:`${e.route.from}${e.route.fromSub?`(${e.route.fromSub})`:''} → ${e.route.to}${e.route.toSub?`(${e.route.toSub})`:''}`}:{}),
    ...(e.level==='critical'?{這是關鍵段落:true}:{}),
    ...(w&&w.wall?{硬性死線:`${clockAt(w.wall)} ${w.wallLabel||''}`.trim()}:{}),
  };
}
function draftPrompt(keys){
  const all=entries();
  const want=all.filter(x=>keys.includes(rowKey(x.e,x.day)));
  return `你在幫一個旅行 app 寫「跟隊模式」的內容。

跟隊模式是給團體旅行中**不負責規劃的那些人**看的畫面：一次只顯示一件事，就是「接下來要做什麼」。使用者可能剛下飛機、很累、沒在看行程表。他要的是一個口令加幾個動作，照著做就好。

這趟旅行：${meta.title}　${meta.subtitle||''}

完整行程（給你當上下文，不要為沒被要求的項目產生內容）：
${JSON.stringify(all.map(eventForPrompt),null,1)}

請為下面這 ${want.length} 個項目各寫一份內容：
${want.map(x=>`- ${rowKey(x.e,x.day)}`).join('\n')}

規則：
${briefRules()}

只輸出 JSON，不要有任何其他文字、不要用程式碼區塊。格式是一個物件，key 是上面列出的項目 key，value 長這樣：
{"<key>":{"line":"","because":"","steps":[],"need":"","fallback":""}}`;
}

/* The same gate the editor uses, applied to something a model wrote —
   because a model will go over twelve characters, and the limit is the
   whole reason the screen is readable. */
function checkDraft(k,v){
  const bad=[];
  if(!v||typeof v!=='object'||Array.isArray(v)) return [`${k}：不是一個物件`];
  const line=typeof v.line==='string'?v.line.trim():'';
  if(!line) bad.push(`${k}：沒有一句話`);
  else if([...line].length>12) bad.push(`${k}：一句話 ${[...line].length} 字，超過 12（「${line}」）`);
  const steps=Array.isArray(v.steps)?v.steps.filter(x=>typeof x==='string'&&x.trim()):[];
  if(steps.length>4) bad.push(`${k}：${steps.length} 個步驟，超過 4`);
  for(const st of steps) if([...st.trim()].length>STEP_MAX)
    bad.push(`${k}：步驟「${st.trim()}」${[...st.trim()].length} 字，超過 ${STEP_MAX}`);
  /* A fallback that restates the line is worse than an empty one: it looks
     like a plan while occupying the field somebody reads when things go
     wrong. Seen in a real draft. An outright restatement is refused. */
  const fb=typeof v.fallback==='string'?v.fallback.trim():'';
  if(fb&&line&&(fb===line||fb.includes(line)))
    bad.push(`${k}：「萬一來不及」只是把口令換句話說（「${fb}」），這種寧可留空`);
  return bad;
}
/* A paraphrase is not something code can be sure about, so it is pointed at
   rather than refused — on the samples to hand, a restated fallback overlaps
   the line by 56-63% of its characters while a real one sits at 0-13%. Six
   samples is enough to raise a flag, nowhere near enough to throw work away. */
const ECHO=0.5;
function echoesLine(fb,line){
  const clean=x=>[...x.replace(/[\s，。、！？「」（）()]/g,'')];
  const L=new Set(clean(line)), F=clean(fb);
  if(!F.length||!L.size) return false;
  return F.filter(c=>L.has(c)).length/F.length>=ECHO;
}
function parseDraft(text,keys){
  let raw=text.trim();
  const fence=raw.match(/```(?:json)?\s*([\s\S]*?)```/);   /* it will use a code block anyway */
  if(fence) raw=fence[1].trim();
  let v;
  try{ v=JSON.parse(raw); }
  catch{ return {err:'這段不是有效的 JSON。整段貼上，不要只貼一部分。'}; }
  if(!v||typeof v!=='object'||Array.isArray(v)) return {err:'最外層要是一個物件，key 是項目 key。'};
  const out={}, bad=[], unknown=[], weak=[];
  for(const [k,item] of Object.entries(v)){
    if(!keys.includes(k)){ unknown.push(k); continue; }
    const errs=checkDraft(k,item);
    if(errs.length){ bad.push(...errs); continue; }
    if(item.fallback&&echoesLine(String(item.fallback).trim(),item.line.trim())) weak.push(k);
    out[k]={line:item.line.trim(),
      because:typeof item.because==='string'?item.because.trim():'',
      steps:(Array.isArray(item.steps)?item.steps:[]).filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()),
      need:typeof item.need==='string'?item.need.trim():'',
      fallback:typeof item.fallback==='string'?item.fallback.trim():''};
  }
  return {out,bad,unknown,weak};
}

let draftKeys=[], beforeApply=null;
function undoApply(){
  if(!beforeApply) return;
  if(!saveBriefs(beforeApply)) return;
  beforeApply=null;
  renderTimeline(); renderFollow(); refreshDraftButtons();
  $('#dfUndo').hidden=true;
  $('#dfResult').textContent='已復原，回到套用之前的狀態。';
  toast('已復原');
}
function refreshDraftButtons(){
  const n=Object.values(getBriefs()).filter(v=>v.by==='ai').length;
  $('#dfClearAi').hidden=!n;
  $('#dfClearAi').textContent=`清除 ${n} 筆 AI 起草`;
}
function openDraft(keys){
  draftKeys=keys; beforeApply=null;
  const n=keys.length;
  $('#dfFor').textContent=n===1
    ? entries().filter(x=>rowKey(x.e,x.day)===keys[0]).map(x=>`${trip.days[x.day].label} ${x.e.time}　${x.e.title}`)[0]||''
    : `${n} 個還沒有人寫過內容的項目`;
  $('#dfPaste').value=''; $('#dfResult').hidden=true; $('#dfResult').textContent='';
  $('#dfUndo').hidden=true;
  refreshDraftButtons();
  $('#draftDialog').showModal();
}
function setupDraft(){
  $('#closeDraft').onclick=()=>$('#draftDialog').close();
  $('#dfUndo').onclick=undoApply;
  /* undo only reaches back to this session's apply; this is the way out for
     drafts applied at some point in the past */
  $('#dfClearAi').onclick=()=>{
    const before=getBriefs(), after={};
    for(const [k,v] of Object.entries(before)) if(v.by!=='ai') after[k]=v;
    const n=Object.keys(before).length-Object.keys(after).length;
    if(!saveBriefs(after)) return;
    renderTimeline(); renderFollow(); refreshDraftButtons();
    $('#dfResult').hidden=false;
    $('#dfResult').textContent=`已清除 ${n} 筆沒有人檢查過的 AI 起草，回到行程原本的內容。`;
    toast(`已清除 ${n} 筆`,{label:'復原',fn(){
      if(saveBriefs(before)){renderTimeline();renderFollow();refreshDraftButtons();toast('已復原');}
    }});
  };
  $('#dfCopy').onclick=async()=>{
    const text=draftPrompt(draftKeys);
    try{ await navigator.clipboard.writeText(text); toast('已複製，貼給 Claude'); }
    catch{
      /* clipboard can be refused; the text still has to be reachable */
      $('#dfPaste').value=text; $('#dfPaste').select();
      toast('無法自動複製，已放在下面的欄位，請手動複製');
    }
  };
  $('#dfApply').onclick=()=>{
    const r=parseDraft($('#dfPaste').value,draftKeys);
    const box=$('#dfResult'); box.hidden=false;
    if(r.err){ box.textContent=r.err; return; }
    const got=Object.keys(r.out);
    const notes=[];
    if(r.bad.length) notes.push('沒有套用（不符合規則）：\n'+r.bad.join('\n'));
    if(r.unknown.length) notes.push(`不認得的項目 ${r.unknown.length} 個，已略過。`);
    if(r.weak&&r.weak.length) notes.push(
      `這 ${r.weak.length} 個的「萬一來不及」看起來只是把口令換句話說，已經套用，但那一欄是出事時才會看的，值得先確認：\n`
      +r.weak.join('\n'));
    const missing=draftKeys.filter(k=>!got.includes(k));
    if(missing.length) notes.push(`還有 ${missing.length} 個項目沒有內容。`);
    if(!got.length){ box.textContent=['一個都沒有套用。',...notes].join('\n\n'); return; }
    const snapshot=getBriefs();
    const all=getBriefs();
    for(const k of got) all[k]={...r.out[k],by:'ai'};
    if(!saveBriefs(all)) return;
    beforeApply=snapshot; $('#dfUndo').hidden=false;
    renderTimeline(); renderFollow(); refreshDraftButtons();
    toast(`已套用 ${got.length} 個`,{label:'復原',fn:undoApply});
    box.textContent=[`已套用 ${got.length} 個，全部標記成「AI 起草」。`,
      '這些內容沒有人檢查過。請逐一打開確認，改過之後標記就會消失。',...notes].join('\n\n');
  };
}

let editingKey='';
function openBrief(key){
  const item=entries().find(x=>rowKey(x.e,x.day)===key);
  if(!item) return;
  editingKey=key;
  const own=getBriefs()[key], b=item.brief;
  $('#briefFor').textContent=`${trip.days[item.day].label} ${item.e.time}　${item.e.title}`;
  $('#bfLine').value=own?own.line:(item.derived?'':b.line);
  $('#bfBecause').value=own?own.because:(item.derived?'':b.because);
  $('#bfSteps').value=(own?own.steps:item.derived?[]:b.steps).join('\n');
  $('#bfNeed').value=own?own.need:(item.derived?'':b.need);
  $('#bfFallback').value=own?own.fallback:(item.derived?'':b.fallback);
  $('#bfClear').hidden=!own;
  countLine();
  $('#briefDialog').showModal(); setTimeout(()=>$('#bfLine').focus(),80);
}
function countLine(){ $('#bfCount').textContent=String([...$('#bfLine').value.trim()].length); }
function setupBriefEditor(){
  $('#bfLine').oninput=countLine;
  $('#closeBrief').onclick=$('#cancelBrief').onclick=()=>$('#briefDialog').close();
  $('#bfClear').onclick=()=>{
    const all=getBriefs(), gone=all[editingKey];
    delete all[editingKey];
    if(saveBriefs(all)){
      $('#briefDialog').close(); renderTimeline(); renderFollow();
      toast('已清除，改回行程原本的內容',{label:'復原',fn(){
        const back=getBriefs(); back[editingKey]=gone;
        if(saveBriefs(back)){renderTimeline();renderFollow();toast('已復原');}
      }});
    }
  };
  $('#briefForm').onsubmit=ev=>{
    ev.preventDefault();
    const line=$('#bfLine').value.trim();
    if([...line].length>12){ $('#bfLine').focus(); toast('一句話請控制在 12 個字以內'); return; }
    const steps=$('#bfSteps').value.split('\n').map(x=>x.trim()).filter(Boolean);
    if(steps.length>4){ $('#bfSteps').focus(); toast('步驟最多四步，記不住更多'); return; }
    const longStep=steps.find(x=>[...x].length>STEP_MAX);
    if(longStep){ $('#bfSteps').focus(); toast(`「${longStep}」太長了，每步最多 ${STEP_MAX} 字`); return; }
    const all=getBriefs();
    /* a person has now read every field of this, so it is theirs */
    const next={line,because:$('#bfBecause').value.trim(),steps,
      need:$('#bfNeed').value.trim(),fallback:$('#bfFallback').value.trim(),by:'me'};
    if(!line&&!next.because&&!steps.length&&!next.need&&!next.fallback) delete all[editingKey];
    else all[editingKey]=next;
    if(saveBriefs(all)){
      $('#briefDialog').close(); renderTimeline(); renderFollow(); toast('已儲存');
    }
  };
}
function setupFollow(){
  readPreview();
  $('#timeline').addEventListener('click',ev=>{
    const b=ev.target.closest('[data-peek]');
    if(b){ peek(b.dataset.peek); return; }
    const w=ev.target.closest('[data-edit]');
    if(w) openBrief(w.dataset.edit);
  });
  let saved=null;
  try{saved=localStorage.getItem(MODE_KEY)}catch{}
  setMode(modeFromURL()||(previewAt!=null?'follow':saved==='follow'?'follow':'lead'));
  $('#modeBtn').onclick=()=>setMode(document.documentElement.dataset.mode==='follow'?'lead':'follow');
  $('#shareFollowBtn').onclick=shareFollow;
  $('#flExit').onclick=()=>setMode('lead');
  $('#flMore').onclick=()=>setFollowOpen($('#flDetail').hidden);
  setupBriefEditor();
  setupDraft();
  $('#draftAllBtn').onclick=()=>{
    /* a row still flagged as an unchecked AI draft counts as unwritten —
       otherwise the first apply locks the button and there is no way to
       try a different draft without clearing five rows by hand */
    const mine=getBriefs();
    const todo=entries().filter(x=>{
      const own=mine[rowKey(x.e,x.day)];
      return x.derived||(own&&own.by==='ai');
    }).map(x=>rowKey(x.e,x.day));
    if(!todo.length){ toast('每個項目都有人寫過或檢查過了'); return; }
    openDraft(todo);
  };
  $('#bfDraft').onclick=()=>{ $('#briefDialog').close(); openDraft([editingKey]); };
}

/* ── theme ────────────────────────────────────────────────── */
const THEME_KEY=ns('theme');
/* Two themes, no third "follow the system" state: the system preference only
   picks the starting one, and any tap after that is an explicit choice. */
function readTheme(){
  let v=null;
  try{v=localStorage.getItem(THEME_KEY)}catch{}
  return v==='dark'||v==='light' ? v : (matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
}
function applyTheme(pref){
  document.documentElement.setAttribute('data-theme',pref);
  /* the static media-based metas are only right before a choice exists; once
     the theme is explicit, replace them with one meta matching it */
  $$('meta[name="theme-color"]').forEach(m=>m.remove());
  const tag=document.createElement('meta');
  tag.name='theme-color';
  tag.content=pref==='dark'?'#081A1F':'#DFE8E6';
  document.head.appendChild(tag);
  $$('.theme-opt').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.themeSet===pref)));
}
function setupTheme(){
  applyTheme(readTheme());
  $$('.theme-opt').forEach(b=>b.addEventListener('click',()=>{
    const v=b.dataset.themeSet;
    try{localStorage.setItem(THEME_KEY,v)}catch{}
    applyTheme(v);
  }));
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
/* An optional action turns the toast into the undo that replaces a browser
   confirm(): the destructive thing happens at once and can be taken back,
   instead of a modal carrying the site's domain interrupting every tap. */
function toast(msg,action){
  const el=$('#toast'), btn=$('#toastAction');
  $('#toastText').textContent=msg;
  btn.hidden=!action;
  if(action){ btn.textContent=action.label; btn.onclick=()=>{el.classList.remove('show');action.fn();}; }
  el.classList.toggle('has-action',!!action);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),action?5000:2200);
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
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
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
    if(day) setDay(day);
    /* Scrolling to #itinerary did nothing: the panel starts at the top of the
       page and the card with the button is the first thing in it, so the app
       usually opens already scrolled exactly where the button scrolled to.
       The row the countdown is about is what the user wants to see. */
    requestAnimationFrame(()=>{
      const row=$('.tl-row.is-next')||$('#timeline');
      if(!row) return;
      const top=row.getBoundingClientRect().top+scrollY
        -(($('.topbar')?.offsetHeight||0)+12);
      scrollTo({top:Math.max(0,top),behavior:'smooth'});
    });
  };
}
function setupSources(){
  $('#sourceList').innerHTML=trip.sources.map(s=>`<div class="source"><strong>${s[0]}</strong><small>${s[1]}</small><a href="${s[2]}" target="_blank" rel="noopener">${s[2]}</a></div>`).join('');
  $('#sourceBtn').onclick=()=>$('#sourceDialog').showModal();
  $('#closeSources').onclick=()=>$('#sourceDialog').close();
}
/* Everything the shell says about this particular journey is written here,
   from the data, so index.html stays a layout rather than a copy of the trip. */
function setupChrome(){
  $('#tripTitle').textContent=meta.title;
  $('#timelineNote').textContent=`航班、住宿與關鍵轉乘；倒數以 ${tzLabel} 計算。`;
  $('#tripSubtitle').textContent=meta.subtitle;
  $('#checkedOn').textContent=`資料檢查日：${meta.checkedOn}`;
  $('#alertTitle').textContent=meta.alert.title;
  $('#alertText').textContent=meta.alert.text;
  $('#criticalBanner').setAttribute('aria-label',meta.alert.title);

  /* the overview strip is the air legs themselves, collapsed: A→B→C, no repeats */
  const ports=[];
  for(const d of trip.days) for(const e of d.events){
    if(e.route?.kind!=='air') continue;
    if(ports[ports.length-1]!==e.route.from) ports.push(e.route.from);
    ports.push(e.route.to);
  }
  $('#tripRoute').innerHTML=ports.map(p=>`<span class="num">${escapeHtml(p)}</span>`).join('<i></i>');
  $('#tripRoute').setAttribute('aria-label',`全程航段 ${ports.join(' ')}`);

  $('#planType').innerHTML=Object.keys(trip.types).filter(t=>trip.types[t].plannable)
    .map(t=>`<option>${escapeHtml(t)}</option>`).join('');
}

function setupBanner(){
  const key=ns('bannerHidden');
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
  /* No install button. beforeinstallprompt is Chromium-only — it never fires on
     iOS, where this app is actually used, so the button was either absent or
     present-and-inert depending on the browser. Adding to the home screen is
     the browser's own share-sheet action; the manifest is what makes it work. */
}
$('#resetTodos').addEventListener('click',()=>{
  /* only the trip's own checklist; your own items are yours to delete */
  const before=getTodoState();
  if(!Object.values(before).some(Boolean)){toast('目前沒有勾選項目');return;}
  try{localStorage.removeItem(todoKey)}catch{}
  renderTodos();
  toast('已清除全部勾選',{label:'復原',fn(){
    try{localStorage.setItem(todoKey,JSON.stringify(before))}catch{toast('無法復原，裝置儲存空間已滿');return;}
    renderTodos();toast('已復原');
  }});
});

setupChrome();
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
setupMine();
setupFollow();
setupBanner();
setupPWA();
setupNextJump();
updateClock();
setInterval(updateClock,30000);
