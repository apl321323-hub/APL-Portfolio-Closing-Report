import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/data.json', serveStatic({ root: './' }))
app.use('/loan_data.json', serveStatic({ root: './' }))

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>APL 마감 보고 대시보드</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
*{font-family:'Noto Sans KR',sans-serif;box-sizing:border-box;}
:root{--primary:#1e3a5f;--pl:#2d5a9e;--accent:#e63946;--bg:#f0f4f8;--card:#fff;--bdr:#dde3ec;--txt:#1a2332;--sub:#6b7a99;--green:#059669;--orange:#d97706;--red:#dc2626;}
body{background:var(--bg);color:var(--txt);min-height:100vh;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-thumb{background:#c1ccd9;border-radius:3px;}
.header{background:linear-gradient(135deg,#1e3a5f 0%,#2d5a9e 100%);}
.card{background:var(--card);border-radius:12px;border:1px solid var(--bdr);}
.kpi-card{background:var(--card);border-radius:12px;border:1px solid var(--bdr);transition:transform .2s,box-shadow .2s;cursor:default;}
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.1);}
.nav-item{padding:10px 14px;cursor:pointer;font-size:13px;font-weight:500;border-bottom:2px solid transparent;color:var(--sub);transition:all .15s;white-space:nowrap;}
.nav-item.active{color:var(--pl);border-bottom-color:var(--pl);}
.nav-item:hover:not(.active){color:var(--txt);}
.tab-btn{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:#f5f7fb;color:var(--sub);transition:all .15s;white-space:nowrap;}
.tab-btn.active{background:var(--primary);color:#fff;border-color:var(--primary);}
.data-table{width:100%;border-collapse:collapse;font-size:12.5px;}
.data-table th{background:#f8fafd;color:var(--sub);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:9px 12px;text-align:right;border-bottom:2px solid var(--bdr);position:sticky;top:0;z-index:1;}
.data-table th:first-child,.data-table th:nth-child(2){text-align:left;}
.data-table td{padding:8px 12px;border-bottom:1px solid #f0f4f8;text-align:right;}
.data-table td:first-child,.data-table td:nth-child(2){text-align:left;}
.data-table tr:hover td{background:#f8fafd;}
.data-table tr.highlight td{background:#eff6ff;font-weight:600;}
.badge{display:inline-block;padding:1px 7px;border-radius:100px;font-size:10.5px;font-weight:600;}
.badge-red{background:#fee2e2;color:#dc2626;}
.badge-green{background:#dcfce7;color:#16a34a;}
.badge-blue{background:#dbeafe;color:#2563eb;}
.badge-gray{background:#f3f4f6;color:#6b7280;}
.badge-orange{background:#ffedd5;color:#c2410c;}
.badge-purple{background:#ede9fe;color:#7c3aed;}
.chart-wrap{position:relative;height:220px;}
.chart-wrap-lg{position:relative;height:280px;}
.progress-bar{height:8px;border-radius:4px;background:#e5e7eb;overflow:hidden;}
.progress-fill{height:100%;border-radius:4px;transition:width .6s ease;}
/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:none;align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:#fff;border-radius:16px;width:900px;max-width:95vw;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,.2);}
.modal-header{padding:20px 24px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:between;}
.modal-body{flex:1;overflow-y:auto;padding:24px;}
.modal-footer{padding:16px 24px;border-top:1px solid var(--bdr);display:flex;justify-content:flex-end;gap:8px;}
/* Category card in modal */
.cat-card{border:2px solid var(--bdr);border-radius:10px;overflow:hidden;transition:border-color .2s;}
.cat-card.selected{border-color:var(--pl);}
.cat-header{padding:10px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;}
.cat-color-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.product-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:11.5px;font-weight:500;cursor:pointer;margin:3px;transition:all .15s;border:1.5px solid transparent;}
.product-chip.assigned{color:#fff;}
.product-chip.unassigned{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb;}
.product-chip.unassigned:hover{background:#e5e7eb;}
/* Drag */
.drag-over{outline:2px dashed var(--pl);outline-offset:2px;}
/* Color picker */
.color-swatch{width:24px;height:24px;border-radius:6px;cursor:pointer;border:2px solid transparent;transition:border-color .15s;}
.color-swatch.selected{border-color:#374151;}
/* Tooltip */
[data-tip]{position:relative;}
[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);white-space:nowrap;background:#1f2937;color:#fff;font-size:11px;padding:4px 8px;border-radius:5px;pointer-events:none;z-index:100;}
</style>
</head>
<body>
<!-- HEADER -->
<header class="header text-white px-5 py-3 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-3">
    <div class="w-9 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
      <i class="fas fa-chart-line text-lg"></i>
    </div>
    <div>
      <h1 class="text-lg font-bold tracking-tight">APL 마감 보고 대시보드</h1>
      <p class="text-xs text-blue-200" id="hdr-date">데이터 로딩 중...</p>
    </div>
  </div>
  <div class="flex items-center gap-3">
    <button onclick="openSettings()" class="flex items-center gap-2 bg-white bg-opacity-15 hover:bg-opacity-25 transition px-3 py-1.5 rounded-lg text-sm font-medium">
      <i class="fas fa-cog"></i> 시스템 설정
    </button>
    <div class="text-right">
      <p class="text-xs text-blue-200">결산기준일</p>
      <p class="text-sm font-bold" id="hdr-basedate">-</p>
    </div>
  </div>
</header>

<!-- NAV -->
<nav class="bg-white border-b border-gray-100 px-5 flex items-center gap-1 overflow-x-auto" style="scrollbar-width:none;">
  <button class="nav-item active" data-page="overview" onclick="goPage('overview')"><i class="fas fa-tachometer-alt mr-1.5"></i>종합 개요</button>
  <button class="nav-item" data-page="balance" onclick="goPage('balance')"><i class="fas fa-layer-group mr-1.5"></i>잔고 구성비</button>
  <button class="nav-item" data-page="product" onclick="goPage('product')"><i class="fas fa-tags mr-1.5"></i>상품 분석</button>
  <button class="nav-item" data-page="agent" onclick="goPage('agent')"><i class="fas fa-users mr-1.5"></i>에이전트 분석</button>
  <button class="nav-item" data-page="overdue" onclick="goPage('overdue')"><i class="fas fa-exclamation-triangle mr-1.5"></i>연체 현황</button>
  <button class="nav-item" data-page="trend" onclick="goPage('trend')"><i class="fas fa-chart-line mr-1.5"></i>월별 추이</button>
</nav>

<!-- MAIN -->
<div id="main-content" class="p-5">
  <div class="flex items-center justify-center h-64 text-gray-400">
    <i class="fas fa-spinner fa-spin mr-2 text-xl"></i>데이터 로딩 중...
  </div>
</div>

<!-- ====== 설정 모달 ====== -->
<div class="modal-overlay" id="settings-modal">
  <div class="modal">
    <div class="modal-header flex items-center justify-between w-full">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#eff6ff">
          <i class="fas fa-cog text-blue-600"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-800">시스템 설정 — 상품 구분 관리</h2>
          <p class="text-xs text-gray-500">상품을 카테고리로 묶어 잔고 구성비를 분석합니다</p>
        </div>
      </div>
      <button onclick="closeSettings()" class="text-gray-400 hover:text-gray-600 ml-4"><i class="fas fa-times text-xl"></i></button>
    </div>
    <div class="modal-body" id="settings-body">
      <!-- 동적 생성 -->
    </div>
    <div class="modal-footer">
      <button onclick="resetCategories()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">초기화</button>
      <button onclick="closeSettings()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">취소</button>
      <button onclick="saveCategories()" class="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">저장 적용</button>
    </div>
  </div>
</div>

<script>
// ==================== 상태 ====================
let LOAN = null;   // loan_data.json
let TREND = null;  // data.json (월별)
let currentPage = 'overview';

// 카테고리 설정 (localStorage 저장)
const DEFAULT_CATEGORIES = [
  { id:'c1', name:'담보상품', color:'#2563eb', products:['담보론','담보론(지분대출)'] },
  { id:'c2', name:'신용(N계열)', color:'#059669', products:['N론','N론(하이브리드)','토마토N론','오투N론','기타N'] },
  { id:'c3', name:'신용(스타/큐브)', color:'#7c3aed', products:['스타론','스타스위치론','큐브론'] },
  { id:'c4', name:'신용(토마토)', color:'#d97706', products:['토마토토탈론','토마토토탈론플러스','토마토론'] },
  { id:'c5', name:'신용(OP/오투)', color:'#0891b2', products:['OP론','오투론','테일론','프리미엄론'] },
  { id:'c6', name:'기타신용', color:'#6b7280', products:['플러스론','T플러스론','토탈론','레이디론','다이렉트론(A)','다이렉트론(W)','전월세론','우량론','프리론','기타','회생'] },
];

// 상위 카테고리(그룹) 설정 — 카테고리를 묶는 한 단계 위 계층
const DEFAULT_GROUPS = [
  { id:'g1', name:'담보', color:'#1e40af', categoryIds:['c1'] },
  { id:'g2', name:'신용', color:'#065f46', categoryIds:['c2','c3','c4','c5'] },
  { id:'g3', name:'기타/회생', color:'#374151', categoryIds:['c6'] },
];

let CATEGORIES = [];
let GROUPS = [];        // 상위 카테고리(그룹)
let editCategories = []; // 모달 편집용
let editGroups = [];     // 모달 그룹 편집용

// ==================== 로드 ====================
async function init() {
  try {
    const [loanRes, trendRes] = await Promise.all([
      fetch('/loan_data.json'),
      fetch('/data.json')
    ]);
    LOAN = await loanRes.json();
    TREND = await trendRes.json();
    
    document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + TREND.generated_at;
    document.getElementById('hdr-basedate').textContent = LOAN.base_date;
    
    loadCategoriesFromStorage();
    renderPage();
  } catch(e) {
    document.getElementById('main-content').innerHTML = 
      '<div class="flex items-center justify-center h-64 text-red-500"><i class="fas fa-exclamation-circle mr-2"></i>데이터 로드 실패: '+e.message+'</div>';
  }
}

function loadCategoriesFromStorage() {
  try {
    const saved = localStorage.getItem('apl_categories_v2');
    if (saved) {
      CATEGORIES = JSON.parse(saved);
    } else {
      CATEGORIES = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    }
  } catch(e) {
    CATEGORIES = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  }
  try {
    const savedG = localStorage.getItem('apl_groups_v1');
    if (savedG) {
      GROUPS = JSON.parse(savedG);
    } else {
      GROUPS = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
    }
  } catch(e) {
    GROUPS = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
  }
}

function saveCatsToStorage() {
  localStorage.setItem('apl_categories_v2', JSON.stringify(CATEGORIES));
  localStorage.setItem('apl_groups_v1', JSON.stringify(GROUPS));
}

// 카테고리 ID → 상위 그룹 반환
function getGroupOfCategory(catId) {
  for (const g of GROUPS) {
    if (g.categoryIds.includes(catId)) return g;
  }
  return { id:'__none__', name:'미배정', color:'#9ca3af' };
}

// 그룹별 집계
function aggregateByGroup() {
  const catMap = {}; // catId → 집계
  for (const c of CATEGORIES) {
    catMap[c.id] = { ...c, count:0, balance:0, rateSum:0, rateCount:0, ltvSum:0, ltvCount:0, overdueAny:0, balAny:0 };
  }
  catMap['__none__'] = { id:'__none__', name:'미분류', color:'#9ca3af', count:0, balance:0, rateSum:0, rateCount:0, ltvSum:0, ltvCount:0, overdueAny:0, balAny:0 };
  for (const r of LOAN.records) {
    const cat = getCategoryOfProduct(r.p);
    const cm = catMap[cat.id] || catMap['__none__'];
    cm.count++; cm.balance += r.b;
    if(r.r>0){cm.rateSum+=r.r;cm.rateCount++;}
    if(r.ltv>0){cm.ltvSum+=r.ltv;cm.ltvCount++;}
    if(r.d>0){cm.overdueAny++;cm.balAny+=r.b;}
  }
  // 그룹별 합산
  const grpMap = {};
  const allGrps = [...GROUPS, { id:'__none__', name:'미배정', color:'#9ca3af', categoryIds:[] }];
  for (const g of allGrps) {
    grpMap[g.id] = { ...g, count:0, balance:0, rateSum:0, rateCount:0, overdueAny:0, balAny:0, cats:[] };
  }
  for (const [cid, cv] of Object.entries(catMap)) {
    if (cv.count === 0) continue;
    const grp = getGroupOfCategory(cid);
    const gm = grpMap[grp.id];
    if (!gm) continue;
    gm.count    += cv.count;
    gm.balance  += cv.balance;
    gm.rateSum  += cv.rateSum;
    gm.rateCount+= cv.rateCount;
    gm.overdueAny += cv.overdueAny;
    gm.balAny   += cv.balAny;
    gm.cats.push(cv);
  }
  return Object.values(grpMap).filter(g => g.count > 0);
}

// ==================== 라우팅 ====================
function goPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector('[data-page="'+page+'"]').classList.add('active');
  renderPage();
}

function renderPage() {
  const el = document.getElementById('main-content');
  destroyCharts();
  switch(currentPage) {
    case 'overview': renderOverview(el); break;
    case 'balance':  renderBalance(el); break;
    case 'product':  renderProduct(el); break;
    case 'agent':    renderAgent(el); break;
    case 'overdue':  renderOverdue(el); break;
    case 'trend':    renderTrend(el); break;
  }
}

// ==================== 유틸 ====================
const charts = {};
function destroyCharts() {
  Object.values(charts).forEach(c => { try{c.destroy()}catch(e){} });
  Object.keys(charts).forEach(k => delete charts[k]);
}

function fmt(n, dec=1) {
  if(!n&&n!==0) return '-';
  const abs = Math.abs(n);
  if(abs>=100000000) return (n/100000000).toFixed(dec)+'억';
  if(abs>=10000) return (n/10000).toFixed(dec)+'만';
  return n.toFixed(0);
}
function fmtAmt(n) { // 원화 단위: 항상 억원
  if(!n&&n!==0) return '-';
  return (n/100000000).toFixed(2)+'억';
}
function fmtManw(n) { return n ? (n/10000).toFixed(0)+'만' : '-'; }
function fmtN(n) { return n ? Math.round(n).toLocaleString() : '0'; }
function fmtR(n) { return n ? n.toFixed(2)+'%' : '-'; }
function fmtRn(n) { return n ? n.toFixed(1)+'%' : '-'; }

function getCategoryOfProduct(pname) {
  for (const cat of CATEGORIES) {
    if (cat.products.includes(pname)) return cat;
  }
  return { id:'__none__', name:'미분류', color:'#9ca3af' };
}

// LOAN 데이터 집계
function aggregateByProduct() {
  const map = {};
  for (const r of LOAN.records) {
    const p = r.p || '기타';
    if (!map[p]) map[p] = { count:0, balance:0, rateSum:0, rateCount:0, ltvSum:0, ltvCount:0,
      overdue0:0, overdue10:0, overdue30:0, overdue60:0, overdue90:0, overdueMore:0,
      bal0:0, bal10:0, bal30:0, bal60:0, bal90:0, balMore:0 };
    const m = map[p];
    m.count++;
    m.balance += r.b;
    if (r.r > 0) { m.rateSum += r.r; m.rateCount++; }
    if (r.ltv > 0) { m.ltvSum += r.ltv; m.ltvCount++; }
    const d = r.d;
    if (d===0)      { m.overdue0++; m.bal0 += r.b; }
    else if (d<=10) { m.overdue10++; m.bal10 += r.b; }
    else if (d<=30) { m.overdue30++; m.bal30 += r.b; }
    else if (d<=60) { m.overdue60++; m.bal60 += r.b; }
    else if (d<=90) { m.overdue90++; m.bal90 += r.b; }
    else            { m.overdueMore++; m.balMore += r.b; }
  }
  return map;
}

function aggregateByAgent() {
  const map = {};
  for (const r of LOAN.records) {
    const a = r.a || '기타';
    if (!map[a]) map[a] = { count:0, balance:0, rateSum:0, rateCount:0, ltvSum:0, ltvCount:0,
      overdue0:0, overdue30:0, bal0:0, bal30:0 };
    const m = map[a];
    m.count++;
    m.balance += r.b;
    if (r.r > 0) { m.rateSum += r.r; m.rateCount++; }
    if (r.ltv > 0) { m.ltvSum += r.ltv; m.ltvCount++; }
    if (r.d === 0) { m.overdue0++; m.bal0 += r.b; }
    if (r.d > 30) { m.overdue30++; m.bal30 += r.b; }
  }
  return map;
}

function aggregateByCategory() {
  const catMap = {};
  const allCats = [...CATEGORIES, { id:'__none__', name:'미분류', color:'#9ca3af', products:[] }];
  for (const cat of allCats) {
    catMap[cat.id] = { ...cat, count:0, balance:0, rateSum:0, rateCount:0, ltvSum:0, ltvCount:0,
      overdue0:0, overdueAny:0, bal0:0, balAny:0 };
  }
  
  for (const r of LOAN.records) {
    const cat = getCategoryOfProduct(r.p);
    const cm = catMap[cat.id];
    if (!cm) continue;
    cm.count++;
    cm.balance += r.b;
    if (r.r > 0) { cm.rateSum += r.r; cm.rateCount++; }
    if (r.ltv > 0) { cm.ltvSum += r.ltv; cm.ltvCount++; }
    if (r.d === 0) { cm.overdue0++; cm.bal0 += r.b; }
    else { cm.overdueAny++; cm.balAny += r.b; }
  }
  return Object.values(catMap).filter(c => c.count > 0);
}

// ==================== 차트 생성 ====================
function mkPie(id, labels, data, colors) {
  const ctx = document.getElementById(id); if(!ctx) return;
  if(charts[id]) charts[id].destroy();
  charts[id] = new Chart(ctx, {
    type:'doughnut',
    data:{labels, datasets:[{data, backgroundColor:colors, borderWidth:2, borderColor:'#fff', hoverOffset:6}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'62%',
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){
        const v = ctx.raw; const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
        return ' '+labels[ctx.dataIndex]+': '+fmtAmt(v)+' ('+((v/total)*100).toFixed(1)+'%)';
      }}}}}
  });
}

function mkBar(id, labels, datasets, opts={}) {
  const ctx = document.getElementById(id); if(!ctx) return;
  if(charts[id]) charts[id].destroy();
  charts[id] = new Chart(ctx, {
    type:'bar',
    data:{labels, datasets},
    options:{responsive:true,maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},
      scales:{x:{ticks:{font:{size:10}}}, y:{ticks:{callback: v=>opts.pct?v.toFixed(1)+'%':fmtAmt(v), font:{size:10}}}},
      ...opts.extra}
  });
}

function mkLine(id, labels, datasets, opts={}) {
  const ctx = document.getElementById(id); if(!ctx) return;
  if(charts[id]) charts[id].destroy();
  charts[id] = new Chart(ctx, {
    type:'line',
    data:{labels, datasets:datasets.map(d=>({...d,tension:.35,pointRadius:3,pointHoverRadius:5,borderWidth:2.5}))},
    options:{responsive:true,maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},
      scales:{
        y:{ticks:{callback: v=>opts.pct?v.toFixed(1)+'%':fmtAmt(v), font:{size:10}}},
        ...(opts.y1 ? {y1:{type:'linear',position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>v.toFixed(1)+'%', font:{size:10}}}} : {})
      }}
  });
}

// ==================== 페이지: 종합 개요 ====================
function renderOverview(el) {
  const total = LOAN.records.reduce((s,r)=>s+r.b,0);
  const totalCnt = LOAN.records.length;
  const overdue30 = LOAN.records.filter(r=>r.d>30);
  const od30Amt = overdue30.reduce((s,r)=>s+r.b,0);
  const od30Rate = od30Amt/total*100;
  const od10 = LOAN.records.filter(r=>r.d>10);
  const od10Amt = od10.reduce((s,r)=>s+r.b,0);
  const od10Rate = od10Amt/total*100;
  const avgRate = LOAN.records.reduce((s,r)=>s+(r.r||0),0)/LOAN.records.filter(r=>r.r>0).length;
  
  // 신규대출 당월 (trend)
  const trendLast = TREND.total;
  const tBal = trendLast.balance[trendLast.balance.length-1];
  const tPrev = trendLast.balance[trendLast.balance.length-2];
  const tNew = trendLast.new_loans[trendLast.new_loans.length-1];
  
  const catData = aggregateByCategory();
  
  el.innerHTML = \`
<div class="space-y-5">
  <!-- KPI Row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#eff6ff"><i class="fas fa-piggy-bank" style="color:#2563eb"></i></div>
        <span class="badge badge-blue">당월</span>
      </div>
      <p class="text-2xl font-bold" style="color:#1e3a5f">\${(total/100000000).toFixed(1)}억</p>
      <p class="text-xs text-gray-500 mt-1">총 융자잔고</p>
      <p class="text-xs text-gray-400 mt-1">\${fmtN(totalCnt)}건</p>
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#f0fdf4"><i class="fas fa-file-invoice-dollar" style="color:#059669"></i></div>
        <span class="badge badge-green">신규</span>
      </div>
      <p class="text-2xl font-bold" style="color:#059669">\${fmtAmt(tNew.amount*100000000)}</p>
      <p class="text-xs text-gray-500 mt-1">당월 신규대출 실행</p>
      <p class="text-xs text-gray-400 mt-1">접수 \${fmtN(tNew.request)}건 → 승인 \${fmtN(tNew.approve)}건</p>
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fef2f2"><i class="fas fa-exclamation-triangle" style="color:#dc2626"></i></div>
        <span class="badge \${od30Rate>=5?'badge-red':od30Rate>=3?'badge-orange':'badge-green'}">\${od30Rate.toFixed(2)}%</span>
      </div>
      <p class="text-2xl font-bold \${od30Rate>=5?'text-red-600':od30Rate>=3?'text-orange-500':'text-green-600'}">\${fmtAmt(od30Amt)}</p>
      <p class="text-xs text-gray-500 mt-1">30일+ 연체 잔고</p>
      <p class="text-xs text-gray-400 mt-1">10일+ \${fmtR(od10Rate)} | \${fmtN(overdue30.length)}건</p>
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fff7ed"><i class="fas fa-percent" style="color:#d97706"></i></div>
        <span class="badge badge-orange">금리</span>
      </div>
      <p class="text-2xl font-bold" style="color:#d97706">\${avgRate.toFixed(2)}%</p>
      <p class="text-xs text-gray-500 mt-1">평균 정상이율</p>
      <p class="text-xs text-gray-400 mt-1">LTV: \${(LOAN.records.filter(r=>r.ltv>0).reduce((s,r)=>s+r.ltv,0)/LOAN.records.filter(r=>r.ltv>0).length).toFixed(1)}%</p>
    </div>
  </div>

  <!-- 카테고리 잔고 구성 + 상품별 현황 -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-700"><i class="fas fa-chart-pie mr-2 text-blue-500"></i>카테고리별 잔고</h3>
        <button onclick="openSettingsOnGroupTab()" class="text-xs text-purple-600 hover:underline"><i class="fas fa-layer-group mr-1"></i>그룹설정</button>
      </div>
      <div class="chart-wrap mb-3"><canvas id="ov-pie"></canvas></div>
      <div class="space-y-1.5 mt-2">
        \${catData.map(c=>\`<div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:\${c.color}"></div>
          <span class="text-xs flex-1 truncate">\${c.name}</span>
          <span class="text-xs font-bold">\${(c.balance/total*100).toFixed(1)}%</span>
          <span class="text-xs text-gray-400">\${fmtAmt(c.balance)}</span>
        </div>\`).join('')}
      </div>
    </div>
    
    <div class="card p-5 lg:col-span-2">
      <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-bars mr-2 text-indigo-500"></i>상품별 잔고 현황</h3>
      <div class="chart-wrap-lg"><canvas id="ov-bar"></canvas></div>
    </div>
  </div>
  
  <!-- 월별 추이 요약 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-chart-area mr-2 text-green-500"></i>월별 추이 (최근 13개월)</h3>
    <div class="chart-wrap-lg"><canvas id="ov-trend"></canvas></div>
  </div>
</div>\`;

  // 차트 그리기
  setTimeout(() => {
    mkPie('ov-pie', catData.map(c=>c.name), catData.map(c=>c.balance), catData.map(c=>c.color));
    
    // 상품별 바
    const pMap = aggregateByProduct();
    const pArr = Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).slice(0,15);
    const catColors = pArr.map(([p])=>getCategoryOfProduct(p).color);
    mkBar('ov-bar', pArr.map(([p])=>p), [
      {label:'잔고',data:pArr.map(([,v])=>v.balance/100000000),backgroundColor:catColors.map(c=>c+'cc')}
    ], {extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    
    // 추이
    const months = TREND.months;
    mkLine('ov-trend', months, [
      {label:'융자잔고(억)',data:TREND.total.balance.map(b=>b.amount),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.08)',fill:true},
      {label:'30일연체율(%)',data:TREND.total.overdue.map(o=>o.rate_30),borderColor:'#dc2626',yAxisID:'y1'}
    ], {y1:true});
  }, 50);
}

// ==================== 페이지: 잔고 구성비 ====================
function renderBalance(el) {
  const total = LOAN.records.reduce((s,r)=>s+r.b,0);
  const catData = aggregateByCategory();
  const grpData = aggregateByGroup();
  const pMap = aggregateByProduct();
  
  el.innerHTML = \`
<div class="space-y-5">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-bold">잔고 구성비 분석</h2>
      <p class="text-sm text-gray-500">총 잔고: <strong>\${fmtAmt(total)}</strong> (\${fmtN(LOAN.records.length)}건) | 기준일: \${LOAN.base_date}</p>
    </div>
    <button onclick="openSettings()" class="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100">
      <i class="fas fa-sliders-h"></i>카테고리 설정
    </button>
  </div>

  <!-- 상위 그룹 요약 바 -->
  \${grpData.length > 0 ? \`<div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-layer-group mr-2" style="color:#7c3aed"></i>상위 카테고리(그룹) 구성비</h3>
    <div class="flex rounded-xl overflow-hidden h-8 mb-4">
      \${grpData.map(g=>\`<div class="flex items-center justify-center text-white text-xs font-bold transition-all"
          style="width:\${(g.balance/total*100).toFixed(1)}%;background:\${g.color};min-width:\${g.balance/total>0.04?'0':'0'}"
          title="\${g.name}: \${fmtAmt(g.balance)} (\${(g.balance/total*100).toFixed(1)}%)">\${(g.balance/total*100)>=6?g.name:''}</div>\`).join('')}
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-\${Math.min(grpData.length,6)} gap-3">
      \${grpData.map(g=>{
        const pct=(g.balance/total*100);
        const avgR=g.rateCount>0?(g.rateSum/g.rateCount).toFixed(2):'-';
        const odR=g.count>0?((g.overdueAny/g.count)*100).toFixed(1):'0';
        return \`<div class="rounded-xl p-3 text-center" style="background:\${g.color}12;border:1.5px solid \${g.color}40">
          <div class="flex items-center justify-center gap-1.5 mb-1">
            <div class="w-2.5 h-2.5 rounded-full" style="background:\${g.color}"></div>
            <span class="text-xs font-bold text-gray-700">\${g.name}</span>
          </div>
          <p class="text-2xl font-black" style="color:\${g.color}">\${pct.toFixed(1)}%</p>
          <p class="text-xs text-gray-500 mt-0.5">\${fmtAmt(g.balance)} / \${fmtN(g.count)}건</p>
          <div class="mt-1.5 flex justify-center gap-3 text-xs text-gray-400">
            <span>금리 <b class="text-gray-600">\${avgR}%</b></span>
            <span>연체 <b class="\${parseFloat(odR)>=5?'text-red-600':parseFloat(odR)>=3?'text-orange-500':'text-green-600'}">\${odR}%</b></span>
          </div>
          <div class="mt-2 flex flex-wrap justify-center gap-1">
            \${g.cats.map(c=>\`<span class="text-xs px-1.5 py-0.5 rounded-full text-white" style="background:\${c.color}cc" title="\${c.name}: \${fmtAmt(c.balance)}">\${c.name}</span>\`).join('')}
          </div>
        </div>\`;
      }).join('')}
    </div>
  </div>\` : ''}

  <!-- 카테고리별 상세 카드 -->
  <div>
    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3"><i class="fas fa-tags mr-1.5"></i>카테고리(하위) 상세</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    \${catData.map(c => {
      const pct = (c.balance/total*100);
      const avgR = c.rateCount > 0 ? (c.rateSum/c.rateCount).toFixed(2) : '-';
      const avgLtv = c.ltvCount > 0 ? (c.ltvSum/c.ltvCount).toFixed(1) : '-';
      const odRate = c.count > 0 ? ((c.overdueAny/c.count)*100).toFixed(1) : '0';
      return \`<div class="card p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-sm" style="background:\${c.color}"></div>
            <span class="font-bold text-gray-800">\${c.name}</span>
          </div>
          <span class="text-2xl font-bold" style="color:\${c.color}">\${pct.toFixed(1)}%</span>
        </div>
        <div class="progress-bar mb-3">
          <div class="progress-fill" style="width:\${Math.min(pct,100)}%;background:\${c.color}"></div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
          <div class="bg-gray-50 rounded-lg p-2"><p class="text-gray-400">잔고금액</p><p class="font-bold text-sm">\${fmtAmt(c.balance)}</p></div>
          <div class="bg-gray-50 rounded-lg p-2"><p class="text-gray-400">건수</p><p class="font-bold text-sm">\${fmtN(c.count)}건</p></div>
          <div class="bg-gray-50 rounded-lg p-2"><p class="text-gray-400">평균금리</p><p class="font-bold text-sm">\${avgR}%</p></div>
          <div class="bg-gray-50 rounded-lg p-2"><p class="text-gray-400">연체율</p><p class="font-bold text-sm \${parseFloat(odRate)>=5?'text-red-600':parseFloat(odRate)>=3?'text-orange-500':'text-green-600'}">\${odRate}%</p></div>
          \${c.ltvCount > 0 ? \`<div class="bg-gray-50 rounded-lg p-2"><p class="text-gray-400">평균LTV</p><p class="font-bold text-sm">\${avgLtv}%</p></div>\` : ''}
        </div>
        <div class="flex flex-wrap gap-1">
          \${c.products.map(p=>\`<span class="text-xs px-2 py-0.5 rounded-full text-white" style="background:\${c.color}cc">\${p}</span>\`).join('')}
        </div>
      </div>\`;
    }).join('')}
  </div>

  <!-- 파이 + 테이블 -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
    <div class="card p-5 lg:col-span-2">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2" style="color:#2563eb"></i>카테고리 구성비</h3>
      <div style="height:260px"><canvas id="bal-pie"></canvas></div>
      <div class="mt-3 space-y-1.5">
        \${catData.map(c=>\`<div class="flex items-center gap-2 text-xs">
          <div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:\${c.color}"></div>
          <span class="flex-1">\${c.name}</span>
          <span class="font-bold">\${(c.balance/total*100).toFixed(1)}%</span>
          <span class="text-gray-400">\${fmtAmt(c.balance)}</span>
        </div>\`).join('')}
      </div>
    </div>
    <div class="card p-5 lg:col-span-3">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2" style="color:#059669"></i>상품별 상세 (카테고리 포함)</h3>
      <div class="overflow-auto" style="max-height:380px">
        <table class="data-table">
          <thead><tr>
            <th>카테고리</th><th>상품명</th><th>건수</th><th>잔고</th><th>구성비</th><th>평균금리</th><th>연체율</th>
          </tr></thead>
          <tbody>
            \${Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).map(([p,v])=>{
              const cat = getCategoryOfProduct(p);
              const pct2 = (v.balance/total*100).toFixed(1);
              const avgR2 = v.rateCount>0?(v.rateSum/v.rateCount).toFixed(2):'-';
              const odR = v.count>0?((v.overdue30+v.overdue60+v.overdue90+v.overdueMore)/v.count*100).toFixed(1):'0';
              return \`<tr>
                <td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
                <td class="font-medium">\${p}</td>
                <td>\${fmtN(v.count)}</td>
                <td class="font-semibold">\${fmtAmt(v.balance)}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="progress-bar flex-1 w-16"><div class="progress-fill" style="width:\${pct2}%;background:\${cat.color}"></div></div>
                    <span>\${pct2}%</span>
                  </div>
                </td>
                <td>\${avgR2}%</td>
                <td class="\${parseFloat(odR)>=5?'text-red-600 font-bold':parseFloat(odR)>=3?'text-orange-500':''}">\${odR}%</td>
              </tr>\`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>\`;

  setTimeout(()=>{
    mkPie('bal-pie', catData.map(c=>c.name), catData.map(c=>c.balance), catData.map(c=>c.color));
  },50);
}

// ==================== 페이지: 상품 분석 ====================
function renderProduct(el) {
  const pMap = aggregateByProduct();
  const total = LOAN.records.reduce((s,r)=>s+r.b,0);
  const pArr = Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance);
  
  el.innerHTML = \`
<div class="space-y-5">
  <div>
    <h2 class="text-lg font-bold">상품별 분석</h2>
    <p class="text-sm text-gray-500">상품별 잔고, 금리, 연체 현황 | 기준일: \${LOAN.base_date}</p>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-sort-amount-down mr-2 text-indigo-500"></i>상품별 잔고 순위</h3>
      <div class="chart-wrap-lg"><canvas id="prod-bar"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-scatter mr-2 text-orange-500"></i>상품별 금리 분포</h3>
      <div class="chart-wrap-lg"><canvas id="prod-rate"></canvas></div>
    </div>
  </div>
  
  <div class="card overflow-hidden">
    <div class="p-4 border-b border-gray-100"><span class="text-sm font-bold">상품별 종합 지표</span></div>
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead><tr>
          <th>카테고리</th><th>상품명</th><th>건수</th><th>잔고금액</th><th>구성비</th>
          <th>평균금리</th><th>평균LTV</th>
          <th>정상건수</th><th>10일연체</th><th>30일연체</th><th>60일+연체</th>
        </tr></thead>
        <tbody>
          \${pArr.map(([p,v])=>{
            const cat = getCategoryOfProduct(p);
            const pct = (v.balance/total*100).toFixed(1);
            const avgR = v.rateCount>0?(v.rateSum/v.rateCount).toFixed(2):'-';
            const avgLtv = v.ltvCount>0?(v.ltvSum/v.ltvCount).toFixed(1):'-';
            const od60p = v.overdue60+v.overdue90+v.overdueMore;
            return \`<tr>
              <td><span class="text-xs px-2 py-0.5 rounded-full font-medium" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
              <td class="font-medium">\${p}</td>
              <td>\${fmtN(v.count)}</td>
              <td class="font-semibold">\${fmtAmt(v.balance)}</td>
              <td>\${pct}%</td>
              <td>\${avgR}%</td>
              <td>\${avgLtv !== '-' ? avgLtv+'%' : '-'}</td>
              <td class="text-green-600">\${fmtN(v.overdue0)}</td>
              <td class="text-yellow-600">\${fmtN(v.overdue10)}</td>
              <td class="text-orange-500">\${fmtN(v.overdue30)}</td>
              <td class="text-red-600 font-semibold">\${fmtN(od60p)}</td>
            </tr>\`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>\`;

  setTimeout(()=>{
    const top15 = pArr.slice(0,15);
    mkBar('prod-bar', top15.map(([p])=>p),
      [{label:'잔고(억)',data:top15.map(([,v])=>v.balance/100000000),
        backgroundColor:top15.map(([p])=>getCategoryOfProduct(p).color+'cc')}],
      {extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    
    mkBar('prod-rate', top15.map(([p])=>p),
      [{label:'평균금리(%)',data:top15.map(([,v])=>v.rateCount>0?v.rateSum/v.rateCount:0),
        backgroundColor:'rgba(217,119,6,.7)'}],
      {pct:true,extra:{scales:{y:{ticks:{callback:v=>v.toFixed(1)+'%'}}}}});
  },50);
}

// ==================== 페이지: 에이전트 분석 ====================
function renderAgent(el) {
  const aMap = aggregateByAgent();
  const total = LOAN.records.reduce((s,r)=>s+r.b,0);
  const aArr = Object.entries(aMap).sort((a,b)=>b[1].balance-a[1].balance);
  
  // 에이전트별 상품 분포
  const agProdMap = {};
  for (const r of LOAN.records) {
    const a = r.a || '기타';
    const p = r.p || '기타';
    if (!agProdMap[a]) agProdMap[a] = {};
    if (!agProdMap[a][p]) agProdMap[a][p] = {count:0,balance:0};
    agProdMap[a][p].count++;
    agProdMap[a][p].balance += r.b;
  }
  
  el.innerHTML = \`
<div class="space-y-5">
  <div>
    <h2 class="text-lg font-bold">에이전트(광고매체)별 분석</h2>
    <p class="text-sm text-gray-500">에이전트별 잔고, 금리, 연체 현황 | 기준일: \${LOAN.base_date}</p>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-sort-amount-down mr-2 text-blue-500"></i>에이전트별 잔고 순위</h3>
      <div class="chart-wrap-lg"><canvas id="ag-bar"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2 text-purple-500"></i>에이전트별 구성비</h3>
      <div style="height:220px"><canvas id="ag-pie"></canvas></div>
    </div>
  </div>
  
  <div class="card overflow-hidden">
    <div class="p-4 border-b border-gray-100 flex items-center gap-2">
      <span class="text-sm font-bold">에이전트별 종합 지표</span>
      <span class="text-xs text-gray-400">행 클릭 시 상품 분포 확인</span>
    </div>
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead><tr>
          <th>에이전트</th><th>건수</th><th>잔고금액</th><th>구성비</th>
          <th>평균금리</th><th>30일+연체율</th><th>주요 상품</th>
        </tr></thead>
        <tbody>
          \${aArr.map(([a,v],i)=>{
            const pct = (v.balance/total*100).toFixed(1);
            const avgR = v.rateCount>0?(v.rateSum/v.rateCount).toFixed(2):'-';
            const odR = v.count>0?(v.overdue30/v.count*100).toFixed(1):'0';
            const prods = agProdMap[a] ? Object.entries(agProdMap[a]).sort((x,y)=>y[1].balance-x[1].balance).slice(0,3) : [];
            return \`<tr class="cursor-pointer" onclick="toggleAgentRow('\${a.replace(/[^a-z0-9]/gi,'_')}')">
              <td class="font-medium">
                <i class="fas fa-chevron-right text-xs text-gray-300 mr-2 transition-transform" id="ic_\${a.replace(/[^a-z0-9]/gi,'_')}"></i>
                \${a}
              </td>
              <td>\${fmtN(v.count)}</td>
              <td class="font-semibold">\${fmtAmt(v.balance)}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="progress-bar w-16"><div class="progress-fill" style="width:\${Math.min(parseFloat(pct),100)}%;background:#2563eb"></div></div>
                  <span>\${pct}%</span>
                </div>
              </td>
              <td>\${avgR}%</td>
              <td class="\${parseFloat(odR)>=5?'text-red-600 font-bold':parseFloat(odR)>=3?'text-orange-500':''}">\${odR}%</td>
              <td>\${prods.map(([p])=>\`<span class="badge badge-gray">\${p}</span>\`).join(' ')}</td>
            </tr>
            <tr id="agdet_\${a.replace(/[^a-z0-9]/gi,'_')}" style="display:none">
              <td colspan="7" class="p-0">
                <div class="bg-blue-50 p-4">
                  <p class="text-xs font-bold text-gray-600 mb-2">\${a} — 상품별 분포</p>
                  <table class="data-table" style="font-size:12px;background:transparent">
                    <thead><tr><th>상품</th><th>건수</th><th>잔고</th><th>비중</th></tr></thead>
                    <tbody>\${Object.entries(agProdMap[a]||{}).sort((x,y)=>y[1].balance-x[1].balance).map(([p,pv])=>{
                      const cat=getCategoryOfProduct(p);
                      return \`<tr><td><span class="text-xs px-2 py-0.5 rounded-full" style="background:\${cat.color}22;color:\${cat.color}">\${p}</span></td>
                        <td>\${fmtN(pv.count)}</td><td>\${fmtAmt(pv.balance)}</td>
                        <td>\${(pv.balance/v.balance*100).toFixed(1)}%</td></tr>\`;
                    }).join('')}</tbody>
                  </table>
                </div>
              </td>
            </tr>\`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>\`;

  setTimeout(()=>{
    const top12 = aArr.slice(0,12);
    const agColors = ['#2563eb','#059669','#7c3aed','#d97706','#0891b2','#dc2626',
                      '#6366f1','#0d9488','#c026d3','#ea580c','#84cc16','#64748b'];
    mkBar('ag-bar', top12.map(([a])=>a),
      [{label:'잔고(억)',data:top12.map(([,v])=>v.balance/100000000),
        backgroundColor:top12.map((_,i)=>agColors[i%agColors.length]+'cc')}],
      {extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    
    mkPie('ag-pie', top12.map(([a])=>a), top12.map(([,v])=>v.balance), top12.map((_,i)=>agColors[i%agColors.length]));
  },50);
}

function toggleAgentRow(id) {
  const det = document.getElementById('agdet_'+id);
  const ic = document.getElementById('ic_'+id);
  if(!det) return;
  if(det.style.display==='none') {
    det.style.display='';
    if(ic) ic.style.transform='rotate(90deg)';
  } else {
    det.style.display='none';
    if(ic) ic.style.transform='';
  }
}

// ==================== 페이지: 연체 현황 ====================
function renderOverdue(el) {
  const total = LOAN.records.reduce((s,r)=>s+r.b,0);
  const pMap = aggregateByProduct();
  
  // 연체 구간별 집계
  const bkts = [
    {label:'정상(0일)',key:'0',getV:r=>r.d===0,color:'#059669'},
    {label:'1~10일',key:'10',getV:r=>r.d>0&&r.d<=10,color:'#eab308'},
    {label:'11~30일',key:'30',getV:r=>r.d>10&&r.d<=30,color:'#f97316'},
    {label:'31~60일',key:'60',getV:r=>r.d>30&&r.d<=60,color:'#ef4444'},
    {label:'61~90일',key:'90',getV:r=>r.d>60&&r.d<=90,color:'#dc2626'},
    {label:'91일+',key:'90+',getV:r=>r.d>90,color:'#991b1b'},
  ];
  const bktData = bkts.map(bk=>{
    const recs = LOAN.records.filter(bk.getV);
    return {...bk,count:recs.length,balance:recs.reduce((s,r)=>s+r.b,0)};
  });
  
  const od10Rate = (LOAN.records.filter(r=>r.d>10).reduce((s,r)=>s+r.b,0)/total*100).toFixed(2);
  const od30Rate = (LOAN.records.filter(r=>r.d>30).reduce((s,r)=>s+r.b,0)/total*100).toFixed(2);
  
  el.innerHTML = \`
<div class="space-y-5">
  <div>
    <h2 class="text-lg font-bold">연체 현황 분석</h2>
    <p class="text-sm text-gray-500">기준일: \${LOAN.base_date} | 10일연체율: \${od10Rate}% | 30일연체율: \${od30Rate}%</p>
  </div>
  
  <!-- 연체 구간 카드 -->
  <div class="grid grid-cols-3 lg:grid-cols-6 gap-3">
    \${bktData.map(bk=>\`<div class="card p-4">
      <div class="w-8 h-8 rounded-lg mb-2 flex items-center justify-center" style="background:\${bk.color}22">
        <i class="fas fa-circle text-xs" style="color:\${bk.color}"></i>
      </div>
      <p class="text-xs text-gray-500">\${bk.label}</p>
      <p class="text-xl font-bold" style="color:\${bk.color}">\${fmtN(bk.count)}<span class="text-xs font-normal">건</span></p>
      <p class="text-xs text-gray-500 mt-1">\${fmtAmt(bk.balance)}</p>
      <p class="text-xs font-semibold mt-1" style="color:\${bk.color}">\${(bk.balance/total*100).toFixed(1)}%</p>
    </div>\`).join('')}
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-bar mr-2 text-red-500"></i>연체 구간별 잔고</h3>
      <div class="chart-wrap"><canvas id="od-bkt"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-line mr-2 text-orange-500"></i>월별 연체율 추이</h3>
      <div class="chart-wrap"><canvas id="od-trend"></canvas></div>
    </div>
  </div>
  
  <!-- 상품별 연체 -->
  <div class="card overflow-hidden">
    <div class="p-4 border-b border-gray-100"><span class="text-sm font-bold">상품별 연체 현황</span></div>
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead><tr>
          <th>상품명</th><th>전체건수</th><th>정상</th><th>1~10일</th><th>11~30일</th><th>31~60일</th><th>61일+</th><th>30일연체율</th>
        </tr></thead>
        <tbody>
          \${Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).map(([p,v])=>{
            const cat = getCategoryOfProduct(p);
            const od30p = v.overdue30+v.overdue60+v.overdue90+v.overdueMore;
            const odR = v.count>0?(od30p/v.count*100).toFixed(1):'0';
            return \`<tr>
              <td><span class="text-xs px-2 py-0.5 rounded-full font-medium" style="background:\${cat.color}22;color:\${cat.color}">\${p}</span></td>
              <td>\${fmtN(v.count)}</td>
              <td class="text-green-600">\${fmtN(v.overdue0)}</td>
              <td class="text-yellow-600">\${fmtN(v.overdue10)}</td>
              <td class="text-orange-500">\${fmtN(v.overdue30)}</td>
              <td class="text-red-500">\${fmtN(v.overdue60)}</td>
              <td class="text-red-700 font-semibold">\${fmtN(v.overdue90+v.overdueMore)}</td>
              <td class="\${parseFloat(odR)>=5?'text-red-600 font-bold':parseFloat(odR)>=3?'text-orange-500':''}">\${odR}%</td>
            </tr>\`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>\`;

  setTimeout(()=>{
    mkBar('od-bkt', bktData.map(b=>b.label),
      [{label:'잔고(억)',data:bktData.map(b=>b.balance/100000000),
        backgroundColor:bktData.map(b=>b.color+'cc')}],
      {extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    
    mkLine('od-trend', TREND.months, [
      {label:'10일 연체율',data:TREND.total.overdue.map(o=>o.rate_10),borderColor:'#f97316',borderDash:[4,2]},
      {label:'30일 연체율',data:TREND.total.overdue.map(o=>o.rate_30),borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true}
    ], {pct:true});
  },50);
}

// ==================== 페이지: 월별 추이 ====================
function renderTrend(el) {
  const tData = TREND.total;
  const months = TREND.months;
  
  el.innerHTML = \`
<div class="space-y-5">
  <div>
    <h2 class="text-lg font-bold">월별 추이 분석</h2>
    <p class="text-sm text-gray-500">기간: \${months[0]} ~ \${months[months.length-1]} (13개월)</p>
  </div>
  
  <!-- 월별 KPI 테이블 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-chart-area mr-2 text-blue-500"></i>융자잔고 + 신규대출 추이</h3>
    <div class="chart-wrap-lg"><canvas id="tr-main"></canvas></div>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-undo mr-2 text-orange-500"></i>상환율 추이</h3>
      <div class="chart-wrap"><canvas id="tr-repay"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-exclamation-circle mr-2 text-red-500"></i>연체율 추이</h3>
      <div class="chart-wrap"><canvas id="tr-overdue"></canvas></div>
    </div>
  </div>
  
  <div class="card overflow-hidden">
    <div class="p-4 border-b border-gray-100"><span class="text-sm font-bold">월별 주요 지표 요약</span></div>
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead><tr>
          <th>월</th><th>융자잔고</th><th>건수</th><th>평균금리</th>
          <th>신규실행</th><th>승인율</th><th>상환율</th><th>30일연체율</th>
        </tr></thead>
        <tbody>
          \${months.map((m,i)=>{
            const b = tData.balance[i];
            const n = tData.new_loans[i];
            const rp = tData.repay[i];
            const od = tData.overdue[i];
            const isCur = i===months.length-1;
            return \`<tr class="\${isCur?'highlight':''}">
              <td>\${m}\${isCur?' <span class="badge badge-blue">당월</span>':''}</td>
              <td class="font-semibold">\${b.amount.toFixed(0)}억</td>
              <td>\${fmtN(b.count)}</td>
              <td>\${b.rate.toFixed(2)}%</td>
              <td>\${n.amount.toFixed(0)}억</td>
              <td>\${n.approve_rate.toFixed(1)}%</td>
              <td class="\${rp.rate>=7?'text-red-500':rp.rate>=5?'text-orange-500':''}">\${rp.rate.toFixed(2)}%</td>
              <td class="\${od.rate_30>=5?'text-red-600 font-bold':od.rate_30>=3?'text-orange-500':'text-green-600'}">\${od.rate_30.toFixed(2)}%</td>
            </tr>\`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>\`;

  setTimeout(()=>{
    mkLine('tr-main', months, [
      {label:'융자잔고(억)',data:tData.balance.map(b=>b.amount),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.08)',fill:true,yAxisID:'y'},
      {label:'신규실행(억)',data:tData.new_loans.map(n=>n.amount),borderColor:'#059669',yAxisID:'y1',borderDash:[4,2]}
    ],{y1:true});
    
    mkLine('tr-repay', months, [
      {label:'상환율',data:tData.repay.map(r=>r.rate),borderColor:'#d97706',backgroundColor:'rgba(217,119,6,.08)',fill:true}
    ],{pct:true});
    
    mkLine('tr-overdue', months, [
      {label:'10일연체율',data:tData.overdue.map(o=>o.rate_10),borderColor:'#f97316',borderDash:[4,2]},
      {label:'30일연체율',data:tData.overdue.map(o=>o.rate_30),borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true}
    ],{pct:true});
  },50);
}

// ==================== 설정 모달 ====================
const PALETTE = ['#2563eb','#059669','#7c3aed','#d97706','#0891b2','#dc2626',
                 '#6366f1','#0d9488','#c026d3','#ea580c','#84cc16','#64748b',
                 '#be185d','#92400e','#1d4ed8','#15803d'];
const GRP_PALETTE = ['#1e40af','#065f46','#374151','#7e22ce','#92400e','#9f1239',
                     '#0369a1','#166534','#1d4ed8','#15803d','#a16207','#334155'];

// 설정 탭 상태
let settingsTab = 'categories'; // 'categories' | 'groups'

function openSettings() {
  editCategories = JSON.parse(JSON.stringify(CATEGORIES));
  editGroups = JSON.parse(JSON.stringify(GROUPS));
  settingsTab = 'categories';
  const allProducts = [...new Set(LOAN.records.map(r=>r.p))].sort();
  renderSettingsBody(allProducts);
  document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
}

function openSettingsOnGroupTab() {
  editCategories = JSON.parse(JSON.stringify(CATEGORIES));
  editGroups = JSON.parse(JSON.stringify(GROUPS));
  settingsTab = 'groups';
  const allProducts = [...new Set(LOAN.records.map(r=>r.p))].sort();
  renderSettingsBody(allProducts);
  document.getElementById('settings-modal').classList.add('open');
}

function switchSettingsTab(tab) {
  settingsTab = tab;
  const ap = [...new Set(LOAN.records.map(r=>r.p))].sort();
  renderSettingsBody(ap);
}

function renderSettingsBody(allProducts) {
  const body = document.getElementById('settings-body');

  // 탭 헤더
  const tabHtml = \`
  <div class="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
    <button onclick="switchSettingsTab('categories')" class="flex-1 py-2 rounded-lg text-sm font-semibold transition \${settingsTab==='categories'?'bg-white text-blue-700 shadow':'text-gray-500 hover:text-gray-700'}">
      <i class="fas fa-tags mr-1.5"></i>카테고리 (하위)
    </button>
    <button onclick="switchSettingsTab('groups')" class="flex-1 py-2 rounded-lg text-sm font-semibold transition \${settingsTab==='groups'?'bg-white text-blue-700 shadow':'text-gray-500 hover:text-gray-700'}">
      <i class="fas fa-layer-group mr-1.5"></i>상위 카테고리 (그룹)
    </button>
  </div>\`;

  if (settingsTab === 'categories') {
    const assignedProducts = new Set(editCategories.flatMap(c=>c.products));
    const unassigned = allProducts.filter(p=>!assignedProducts.has(p));
    body.innerHTML = tabHtml + \`
<div class="space-y-4">
  <div>
    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미분류 상품 (드래그 또는 클릭으로 카테고리에 배정)</p>
    <div id="unassigned-pool" class="min-h-12 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-1"
         ondragover="event.preventDefault();this.classList.add('drag-over')"
         ondragleave="this.classList.remove('drag-over')"
         ondrop="dropToUnassigned(event)">
      \${unassigned.length===0 ? '<span class="text-xs text-gray-400">모든 상품이 카테고리에 배정됨</span>' :
        unassigned.map(p=>\`<span class="product-chip unassigned" draggable="true"
          ondragstart="dragStart(event,'\${p}','__none__')"
          onclick="showProductMenu('\${p}','__none__',event)">\${p}</span>\`).join('')}
    </div>
  </div>
  <div class="space-y-3" id="cat-list">
    \${editCategories.map((cat,idx)=>renderCatCard(cat,idx,allProducts)).join('')}
  </div>
  <button onclick="addCategory()" class="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition">
    <i class="fas fa-plus mr-2"></i>카테고리 추가
  </button>
</div>\`;
  } else {
    // ── 상위 카테고리(그룹) 탭 ──
    const assignedCatIds = new Set(editGroups.flatMap(g=>g.categoryIds));
    const unassignedCats = editCategories.filter(c=>!assignedCatIds.has(c.id));
    body.innerHTML = tabHtml + \`
<div class="space-y-4">
  <p class="text-xs text-gray-500">카테고리(하위)들을 드래그하거나 선택하여 상위 카테고리(그룹)에 배정합니다.</p>
  <!-- 미배정 카테고리 풀 -->
  <div>
    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미배정 카테고리</p>
    <div id="unassigned-cat-pool" class="min-h-12 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-2"
         ondragover="event.preventDefault();this.classList.add('drag-over')"
         ondragleave="this.classList.remove('drag-over')"
         ondrop="dropCatToUnassigned(event)">
      \${unassignedCats.length===0
        ? '<span class="text-xs text-gray-400">모든 카테고리가 그룹에 배정됨</span>'
        : unassignedCats.map(c=>\`<span class="product-chip assigned" style="background:\${c.color};border-color:\${c.color}" draggable="true"
            ondragstart="dragCatStart(event,'\${c.id}','__none__')">
            \${c.name}
          </span>\`).join('')}
    </div>
  </div>
  <!-- 그룹 목록 -->
  <div class="space-y-3" id="grp-list">
    \${editGroups.map((g,idx)=>renderGroupCard(g,idx)).join('')}
  </div>
  <button onclick="addGroup()" class="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-purple-300 hover:text-purple-500 transition">
    <i class="fas fa-plus mr-2"></i>상위 카테고리(그룹) 추가
  </button>
</div>\`;
  }
}

// ── 그룹 카드 렌더링 ──
function renderGroupCard(grp, idx) {
  const cats = editCategories.filter(c=>grp.categoryIds.includes(c.id));
  return \`<div class="cat-card" id="grpcard_\${grp.id}">
    <div class="cat-header" style="background:\${grp.color}18" onclick="toggleGrpCard('\${grp.id}')">
      <div class="cat-color-dot" style="background:\${grp.color}" onclick="event.stopPropagation();showGroupColorPicker('\${grp.id}',event)"></div>
      <input type="text" value="\${grp.name}" class="flex-1 bg-transparent font-bold text-gray-800 outline-none text-sm"
        onchange="updateGroupName('\${grp.id}',this.value)" onclick="event.stopPropagation()" />
      <span class="text-xs px-2 py-0.5 rounded-full text-white font-medium" style="background:\${grp.color}">\${cats.length}개 카테고리</span>
      <button onclick="event.stopPropagation();removeGroup('\${grp.id}')" class="text-gray-300 hover:text-red-400 ml-2"><i class="fas fa-trash text-xs"></i></button>
      <i class="fas fa-chevron-down text-xs text-gray-400 ml-2 transition-transform" id="grparrow_\${grp.id}"></i>
    </div>
    <div id="grpbody_\${grp.id}" class="p-3">
      <div class="min-h-10 border border-dashed border-gray-200 rounded-lg p-2 flex flex-wrap gap-2"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="dropCatToGroup(event,'\${grp.id}')">
        \${cats.length===0
          ? '<span class="text-xs text-gray-400">카테고리를 드래그하여 배정하세요</span>'
          : cats.map(c=>\`<span class="product-chip assigned" style="background:\${c.color};border-color:\${c.color}" draggable="true"
              ondragstart="dragCatStart(event,'\${c.id}','\${grp.id}')"
              onclick="removeCatFromGroup('\${grp.id}','\${c.id}')" title="클릭하여 제거">
              \${c.name} <i class="fas fa-times text-xs opacity-70"></i>
            </span>\`).join('')}
      </div>
      <div class="mt-2 flex gap-2">
        <select id="grpaddsel_\${grp.id}" class="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
          <option value="">+ 카테고리 추가...</option>
          \${editCategories.filter(c=>!grp.categoryIds.includes(c.id)).map(c=>\`<option value="\${c.id}">\${c.name}</option>\`).join('')}
        </select>
        <button onclick="addCatToGroupFromSelect('\${grp.id}')" class="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">추가</button>
      </div>
    </div>
  </div>\`;
}

function toggleGrpCard(id) {
  const body = document.getElementById('grpbody_'+id);
  const arrow = document.getElementById('grparrow_'+id);
  if(!body) return;
  const hidden = body.style.display==='none';
  body.style.display = hidden?'':'none';
  if(arrow) arrow.style.transform = hidden?'':'rotate(-90deg)';
}

function showGroupColorPicker(grpId, event) {
  event.stopPropagation();
  const existing = document.getElementById('color-popup');
  if(existing) existing.remove();
  const grp = editGroups.find(g=>g.id===grpId);
  const popup = document.createElement('div');
  popup.id = 'color-popup';
  popup.style.cssText = 'position:fixed;z-index:2000;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,.15);';
  popup.style.left = (event.clientX+10)+'px';
  popup.style.top  = (event.clientY+10)+'px';
  popup.innerHTML = \`<p class="text-xs font-bold text-gray-500 mb-2">색상 선택</p>
    <div class="grid grid-cols-4 gap-2">\${GRP_PALETTE.map(c=>\`
      <div class="color-swatch \${grp&&grp.color===c?'selected':''}" style="background:\${c}" onclick="setGroupColor('\${grpId}','\${c}')"></div>
    \`).join('')}</div>\`;
  document.body.appendChild(popup);
  setTimeout(()=>document.addEventListener('click',()=>popup.remove(),{once:true}),50);
}

function setGroupColor(grpId, color) {
  const g = editGroups.find(g=>g.id===grpId);
  if(g){g.color=color; refreshSettingsBody();}
}

function updateGroupName(grpId, name) {
  const g = editGroups.find(g=>g.id===grpId);
  if(g) g.name = name;
}

function removeGroup(grpId) {
  if(!confirm('그룹을 삭제하면 소속 카테고리들이 미배정으로 이동합니다.')) return;
  editGroups = editGroups.filter(g=>g.id!==grpId);
  refreshSettingsBody();
}

function addGroup() {
  const newGrp = { id:'g'+Date.now(), name:'새 그룹', color:GRP_PALETTE[editGroups.length%GRP_PALETTE.length], categoryIds:[] };
  editGroups.push(newGrp);
  refreshSettingsBody();
}

function addCatToGroupFromSelect(grpId) {
  const sel = document.getElementById('grpaddsel_'+grpId);
  if(!sel||!sel.value) return;
  const catId = sel.value;
  editGroups.forEach(g=>{ g.categoryIds = g.categoryIds.filter(id=>id!==catId); });
  const g = editGroups.find(g=>g.id===grpId);
  if(g && !g.categoryIds.includes(catId)) g.categoryIds.push(catId);
  refreshSettingsBody();
}

function removeCatFromGroup(grpId, catId) {
  const g = editGroups.find(g=>g.id===grpId);
  if(g){ g.categoryIds = g.categoryIds.filter(id=>id!==catId); refreshSettingsBody(); }
}

// 드래그 — 카테고리 단위
let dragCatData = null;
function dragCatStart(event, catId, fromGrpId) {
  dragCatData = { catId, fromGrpId };
  event.dataTransfer.effectAllowed = 'move';
}

function dropCatToGroup(event, toGrpId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if(!dragCatData) return;
  const {catId, fromGrpId} = dragCatData;
  if(fromGrpId !== '__none__') {
    const from = editGroups.find(g=>g.id===fromGrpId);
    if(from) from.categoryIds = from.categoryIds.filter(id=>id!==catId);
  }
  const to = editGroups.find(g=>g.id===toGrpId);
  if(to && !to.categoryIds.includes(catId)) to.categoryIds.push(catId);
  dragCatData = null;
  refreshSettingsBody();
}

function dropCatToUnassigned(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if(!dragCatData) return;
  const {catId, fromGrpId} = dragCatData;
  if(fromGrpId !== '__none__') {
    const from = editGroups.find(g=>g.id===fromGrpId);
    if(from) from.categoryIds = from.categoryIds.filter(id=>id!==catId);
  }
  dragCatData = null;
  refreshSettingsBody();
}

function renderCatCard(cat, idx, allProducts) {
  const ap = allProducts || [...new Set(LOAN.records.map(r=>r.p))].sort();
  return \`<div class="cat-card" id="catcard_\${cat.id}">
    <div class="cat-header bg-gray-50" onclick="toggleCatCard('\${cat.id}')">
      <div class="cat-color-dot" style="background:\${cat.color}" onclick="event.stopPropagation();showColorPicker('\${cat.id}',event)"></div>
      <input type="text" value="\${cat.name}" class="flex-1 bg-transparent font-semibold text-gray-700 outline-none text-sm"
        onchange="updateCatName('\${cat.id}',this.value)" onclick="event.stopPropagation()" />
      <span class="text-xs text-gray-400">\${cat.products.length}개 상품</span>
      <button onclick="event.stopPropagation();removeCategory('\${cat.id}')" class="text-gray-300 hover:text-red-400 ml-2"><i class="fas fa-trash text-xs"></i></button>
      <i class="fas fa-chevron-down text-xs text-gray-400 ml-2 transition-transform" id="catarrow_\${cat.id}"></i>
    </div>
    <div id="catbody_\${cat.id}" class="p-3">
      <div class="min-h-10 border border-dashed border-gray-200 rounded-lg p-2 flex flex-wrap gap-1"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="dropToCategory(event,'\${cat.id}')">
        \${cat.products.length===0 ? '<span class="text-xs text-gray-400">상품을 드래그하여 배정하세요</span>' :
          cat.products.map(p=>\`<span class="product-chip assigned" style="background:\${cat.color};border-color:\${cat.color}" draggable="true"
            ondragstart="dragStart(event,'\${p}','\${cat.id}')"
            onclick="removeProductFromCat('\${cat.id}','\${p}')" 
            title="클릭하여 제거">
            \${p} <i class="fas fa-times text-xs opacity-70"></i></span>\`).join('')}
      </div>
      <!-- 상품 추가 셀렉트 -->
      <div class="mt-2 flex gap-2">
        <select id="addsel_\${cat.id}" class="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
          <option value="">+ 상품 추가...</option>
          \${ap.filter(p=>!cat.products.includes(p)).map(p=>\`<option value="\${p}">\${p}</option>\`).join('')}
        </select>
        <button onclick="addProductToCatFromSelect('\${cat.id}')" class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">추가</button>
      </div>
    </div>
  </div>\`;
}

function refreshSettingsBody() {
  const ap = [...new Set(LOAN.records.map(r=>r.p))].sort();
  renderSettingsBody(ap);
}

function toggleCatCard(id) {
  const body = document.getElementById('catbody_'+id);
  const arrow = document.getElementById('catarrow_'+id);
  if(!body) return;
  const hidden = body.style.display==='none';
  body.style.display = hidden?'':'none';
  if(arrow) arrow.style.transform = hidden?'':'rotate(-90deg)';
}

function showColorPicker(catId, event) {
  event.stopPropagation();
  // 간단한 팝업 컬러피커
  const existing = document.getElementById('color-popup');
  if(existing) existing.remove();
  
  const cat = editCategories.find(c=>c.id===catId);
  const popup = document.createElement('div');
  popup.id = 'color-popup';
  popup.style.cssText = 'position:fixed;z-index:2000;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,.15);';
  popup.style.left = (event.clientX+10)+'px';
  popup.style.top = (event.clientY+10)+'px';
  popup.innerHTML = \`<p class="text-xs font-bold text-gray-500 mb-2">색상 선택</p>
    <div class="grid grid-cols-4 gap-2">\${PALETTE.map(c=>\`
      <div class="color-swatch \${cat&&cat.color===c?'selected':''}" style="background:\${c}" onclick="setCatColor('\${catId}','\${c}')"></div>
    \`).join('')}</div>\`;
  document.body.appendChild(popup);
  setTimeout(()=>document.addEventListener('click', ()=>popup.remove(), {once:true}), 50);
}

function setCatColor(catId, color) {
  const cat = editCategories.find(c=>c.id===catId);
  if(cat) { cat.color=color; refreshSettingsBody(); }
}

function updateCatName(catId, name) {
  const cat = editCategories.find(c=>c.id===catId);
  if(cat) cat.name = name;
}

function removeCategory(catId) {
  if(!confirm('카테고리를 삭제하면 해당 상품들이 미분류로 이동합니다.')) return;
  editCategories = editCategories.filter(c=>c.id!==catId);
  refreshSettingsBody();
}

function addCategory() {
  const newCat = { id:'c'+Date.now(), name:'새 카테고리', color:PALETTE[editCategories.length%PALETTE.length], products:[] };
  editCategories.push(newCat);
  refreshSettingsBody();
}

function addProductToCatFromSelect(catId) {
  const sel = document.getElementById('addsel_'+catId);
  if(!sel || !sel.value) return;
  const prod = sel.value;
  // 다른 카테고리에서 제거
  editCategories.forEach(c=>{ c.products = c.products.filter(p=>p!==prod); });
  const cat = editCategories.find(c=>c.id===catId);
  if(cat && !cat.products.includes(prod)) cat.products.push(prod);
  refreshSettingsBody();
}

function removeProductFromCat(catId, prod) {
  const cat = editCategories.find(c=>c.id===catId);
  if(cat) { cat.products = cat.products.filter(p=>p!==prod); refreshSettingsBody(); }
}

// 드래그 앤 드롭
let dragData = null;
function dragStart(event, product, fromCatId) {
  dragData = { product, fromCatId };
  event.dataTransfer.effectAllowed = 'move';
}

function dropToCategory(event, toCatId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if(!dragData) return;
  const {product, fromCatId} = dragData;
  if(fromCatId !== '__none__') {
    const fromCat = editCategories.find(c=>c.id===fromCatId);
    if(fromCat) fromCat.products = fromCat.products.filter(p=>p!==product);
  }
  const toCat = editCategories.find(c=>c.id===toCatId);
  if(toCat && !toCat.products.includes(product)) toCat.products.push(product);
  dragData = null;
  refreshSettingsBody();
}

function dropToUnassigned(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if(!dragData) return;
  const {product, fromCatId} = dragData;
  if(fromCatId !== '__none__') {
    const fromCat = editCategories.find(c=>c.id===fromCatId);
    if(fromCat) fromCat.products = fromCat.products.filter(p=>p!==product);
  }
  dragData = null;
  refreshSettingsBody();
}

function saveCategories() {
  CATEGORIES = JSON.parse(JSON.stringify(editCategories));
  GROUPS = JSON.parse(JSON.stringify(editGroups));
  saveCatsToStorage();
  closeSettings();
  renderPage();
}

function resetCategories() {
  if(!confirm('카테고리 및 그룹을 기본값으로 초기화하시겠습니까?')) return;
  editCategories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  editGroups = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
  refreshSettingsBody();
}

// ==================== 시작 ====================
init();
</script>
</body>
</html>`)
})

export default app
