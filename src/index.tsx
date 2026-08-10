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
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
*{font-family:'Noto Sans KR',sans-serif;box-sizing:border-box;}
:root{--primary:#1e3a5f;--pl:#2d5a9e;--accent:#e63946;--bg:#f0f4f8;--card:#fff;--bdr:#dde3ec;--txt:#1a2332;--sub:#6b7a99;--green:#059669;--orange:#d97706;--red:#dc2626;--sidebar:220px;}
body{background:var(--bg);color:var(--txt);min-height:100vh;display:flex;flex-direction:column;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-thumb{background:#c1ccd9;border-radius:3px;}

/* ── 사이드바 레이아웃 ── */
#app-shell{display:flex;flex:1;min-height:0;}
#sidebar{width:var(--sidebar);min-width:var(--sidebar);background:linear-gradient(180deg,#1a3050 0%,#1e3a5f 60%,#2d5a9e 100%);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;transition:width .25s;}
#sidebar.collapsed{width:56px;min-width:56px;}
#main-area{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
.header{background:linear-gradient(135deg,#1e3a5f 0%,#2d5a9e 100%);}

/* 사이드바 메뉴 */
.sb-logo{padding:18px 16px 12px;border-bottom:1px solid rgba(255,255,255,.1);}
.sb-section{padding:8px 10px 4px;font-size:9.5px;font-weight:700;color:rgba(255,255,255,.35);letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;overflow:hidden;}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,.65);border-radius:8px;margin:2px 8px;transition:all .15s;white-space:nowrap;overflow:hidden;}
.sb-item:hover{background:rgba(255,255,255,.1);color:#fff;}
.sb-item.active{background:rgba(255,255,255,.18);color:#fff;font-weight:600;}
.sb-item .sb-icon{width:20px;text-align:center;flex-shrink:0;font-size:14px;}
.sb-item .sb-label{overflow:hidden;text-overflow:ellipsis;}
.sb-badge{margin-left:auto;background:rgba(255,255,255,.2);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;flex-shrink:0;}
.sb-divider{border-top:1px solid rgba(255,255,255,.08);margin:8px 14px;}

/* 월 셀렉터 (사이드바 하단) */
.month-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;}
.month-tag.has-data{background:rgba(99,206,132,.25);color:#6cdf8a;}
.month-tag.no-data{background:rgba(255,255,255,.08);color:rgba(255,255,255,.4);}
.month-tag.active{background:#2563eb;color:#fff;}

/* 메인 콘텐츠 */
.card{background:var(--card);border-radius:12px;border:1px solid var(--bdr);}
.kpi-card{background:var(--card);border-radius:12px;border:1px solid var(--bdr);transition:transform .2s,box-shadow .2s;cursor:default;}
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.1);}
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
.modal-header{padding:20px 24px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;}
.modal-body{flex:1;overflow-y:auto;padding:24px;}
.modal-footer{padding:16px 24px;border-top:1px solid var(--bdr);display:flex;justify-content:flex-end;gap:8px;}

/* Upload modal */
.upload-modal{width:700px;}
.upload-zone{border:2px dashed #cbd5e1;border-radius:12px;padding:40px;text-align:center;transition:all .2s;cursor:pointer;}
.upload-zone:hover,.upload-zone.dragover{border-color:#2563eb;background:#eff6ff;}

/* Category / Group card */
.cat-card{border:2px solid var(--bdr);border-radius:10px;overflow:hidden;transition:border-color .2s;}
.cat-card.selected{border-color:var(--pl);}
.cat-header{padding:10px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;}
.cat-color-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.product-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:11.5px;font-weight:500;cursor:pointer;margin:3px;transition:all .15s;border:1.5px solid transparent;}
.product-chip.assigned{color:#fff;}
.product-chip.unassigned{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb;}
.product-chip.unassigned:hover{background:#e5e7eb;}
.drag-over{outline:2px dashed var(--pl);outline-offset:2px;}
.color-swatch{width:24px;height:24px;border-radius:6px;cursor:pointer;border:2px solid transparent;transition:border-color .15s;}
.color-swatch.selected{border-color:#374151;}
[data-tip]{position:relative;}
[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);white-space:nowrap;background:#1f2937;color:#fff;font-size:11px;padding:4px 8px;border-radius:5px;pointer-events:none;z-index:100;}

/* 업로드 목록 */
.month-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;border:1px solid var(--bdr);background:#fff;margin-bottom:8px;transition:box-shadow .15s;}
.month-row:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);}
.month-dot{width:10px;height:10px;border-radius:50%;}
</style>
</head>
<body>

<!-- HEADER -->
<header class="header text-white px-5 py-3 flex items-center justify-between shadow-lg flex-shrink-0">
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
    <div class="text-right">
      <p class="text-xs text-blue-200">결산기준일</p>
      <p class="text-sm font-bold" id="hdr-basedate">-</p>
    </div>
  </div>
</header>

<!-- APP SHELL -->
<div id="app-shell">

  <!-- ===== 사이드바 ===== -->
  <aside id="sidebar">
    <!-- 로고 영역 -->
    <div class="sb-logo flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
          <i class="fas fa-landmark text-white text-sm"></i>
        </div>
        <div class="sb-label">
          <p class="text-white text-xs font-bold leading-tight">APL</p>
          <p class="text-blue-300 text-xs leading-tight">대부업 대시보드</p>
        </div>
      </div>
    </div>

    <!-- 분석 현황 월 표시 -->
    <div class="px-4 py-3 border-b border-white border-opacity-10">
      <p class="text-xs text-blue-300 mb-1.5">분석 기준월</p>
      <div id="sb-active-month" class="text-white font-bold text-sm">-</div>
    </div>

    <!-- 메뉴 -->
    <div class="flex-1 py-3">
      <div class="sb-section">분석</div>
      <div class="sb-item active" data-page="overview" onclick="goPage('overview')">
        <i class="sb-icon fas fa-tachometer-alt"></i>
        <span class="sb-label">종합 개요</span>
      </div>
      <div class="sb-item" data-page="balance" onclick="goPage('balance')">
        <i class="sb-icon fas fa-layer-group"></i>
        <span class="sb-label">잔고 구성비</span>
      </div>
      <div class="sb-item" data-page="product" onclick="goPage('product')">
        <i class="sb-icon fas fa-tags"></i>
        <span class="sb-label">상품 분석</span>
      </div>
      <div class="sb-item" data-page="agent" onclick="goPage('agent')">
        <i class="sb-icon fas fa-users"></i>
        <span class="sb-label">에이전트 분석</span>
      </div>
      <div class="sb-item" data-page="overdue" onclick="goPage('overdue')">
        <i class="sb-icon fas fa-exclamation-triangle"></i>
        <span class="sb-label">연체 현황</span>
      </div>
      <div class="sb-item" data-page="trend" onclick="goPage('trend')">
        <i class="sb-icon fas fa-chart-line"></i>
        <span class="sb-label">월별 추이</span>
      </div>

      <div class="sb-divider"></div>
      <div class="sb-section">데이터 관리</div>
      <div class="sb-item" data-page="upload" onclick="goPage('upload')">
        <i class="sb-icon fas fa-upload"></i>
        <span class="sb-label">결산자료 업로드</span>
        <span class="sb-badge" id="sb-month-count">0</span>
      </div>
    </div>

    <!-- 하단: 업로드된 월 빠른 선택 -->
    <div class="px-3 pb-2 border-t border-white border-opacity-10 pt-3">
      <p class="text-xs text-blue-300 mb-2">업로드된 월</p>
      <div id="sb-month-list" class="space-y-1">
        <p class="text-xs text-blue-400 opacity-50">없음</p>
      </div>
    </div>
    <!-- 하단: 시스템 설정 -->
    <div class="px-3 pb-4 border-t border-white border-opacity-10 pt-3">
      <button onclick="openSettings()" class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 transition">
        <i class="fas fa-cog text-blue-300"></i>
        <span>시스템 설정</span>
      </button>
    </div>
  </aside>

  <!-- ===== 메인 영역 ===== -->
  <main id="main-area">
    <div id="main-content" class="flex-1 p-5 overflow-y-auto">
      <div class="flex items-center justify-center h-64 text-gray-400">
        <i class="fas fa-spinner fa-spin mr-2 text-xl"></i>데이터 로딩 중...
      </div>
    </div>
  </main>
</div>

<!-- ====== 결산자료 업로드 모달 ====== -->
<div class="modal-overlay" id="upload-modal">
  <div class="modal upload-modal">
    <div class="modal-header flex items-center justify-between w-full">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
          <i class="fas fa-upload text-blue-600"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-800">결산자료 업로드</h2>
          <p class="text-xs text-gray-500">월별 결산자료(xlsx)를 업로드하여 분석에 활용합니다</p>
        </div>
      </div>
      <button onclick="closeUploadModal()" class="text-gray-400 hover:text-gray-600 ml-4"><i class="fas fa-times text-xl"></i></button>
    </div>
    <div class="modal-body">
      <!-- 월 선택 -->
      <div class="mb-5">
        <label class="block text-sm font-bold text-gray-700 mb-2">기준월 선택 <span class="text-red-500">*</span></label>
        <div class="flex gap-3">
          <select id="upload-year" class="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
          </select>
          <select id="upload-month" class="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
            <option value="01">1월</option><option value="02">2월</option><option value="03">3월</option>
            <option value="04">4월</option><option value="05">5월</option><option value="06" selected>6월</option>
            <option value="07">7월</option><option value="08">8월</option><option value="09">9월</option>
            <option value="10">10월</option><option value="11">11월</option><option value="12">12월</option>
          </select>
          <span class="flex items-center text-sm text-gray-500">기준 결산자료</span>
        </div>
      </div>
      <!-- 파일 드롭존 -->
      <div id="upload-zone" class="upload-zone mb-5"
           ondragover="event.preventDefault();this.classList.add('dragover')"
           ondragleave="this.classList.remove('dragover')"
           ondrop="handleFileDrop(event)"
           onclick="document.getElementById('file-input').click()">
        <i class="fas fa-file-excel text-4xl text-green-400 mb-3"></i>
        <p class="text-gray-600 font-medium">결산자료.xlsx 파일을 드래그하거나 클릭하여 선택</p>
        <p class="text-xs text-gray-400 mt-1">지원 형식: .xlsx, .xls | 컬럼 구조: 고객명~부서 (A~DJ)</p>
        <div id="upload-file-name" class="mt-3 hidden">
          <span class="bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-lg font-medium"></span>
        </div>
      </div>
      <input type="file" id="file-input" accept=".xlsx,.xls" class="hidden" onchange="handleFileSelect(event)"/>
      <!-- 파싱 진행상태 -->
      <div id="parse-progress" class="hidden mb-4">
        <div class="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3">
          <i class="fas fa-spinner fa-spin text-blue-500"></i>
          <div class="flex-1">
            <p class="text-sm font-medium text-blue-700" id="parse-msg">파일 파싱 중...</p>
            <div class="progress-bar mt-1.5"><div class="progress-fill bg-blue-500" id="parse-bar" style="width:0%"></div></div>
          </div>
        </div>
      </div>
      <!-- 파싱 결과 미리보기 -->
      <div id="parse-result" class="hidden">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-check-circle text-green-600"></i>
            <span class="font-bold text-green-800">파싱 완료</span>
          </div>
          <div id="parse-summary" class="text-sm text-green-700 space-y-1"></div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button onclick="closeUploadModal()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">취소</button>
      <button id="save-upload-btn" onclick="saveUploadedData()" disabled class="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">저장 및 적용</button>
    </div>
  </div>
</div>

<!-- ====== 시스템 설정 모달 ====== -->
<div class="modal-overlay" id="settings-modal">
  <div class="modal">
    <div class="modal-header flex items-center justify-between w-full">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#eff6ff">
          <i class="fas fa-cog text-blue-600"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-800">시스템 설정 — 상품 구분 관리</h2>
          <p class="text-xs text-gray-500">상품을 카테고리·그룹으로 묶어 잔고 구성비를 분석합니다</p>
        </div>
      </div>
      <button onclick="closeSettings()" class="text-gray-400 hover:text-gray-600 ml-4"><i class="fas fa-times text-xl"></i></button>
    </div>
    <div class="modal-body" id="settings-body"></div>
    <div class="modal-footer">
      <button onclick="resetCategories()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">초기화</button>
      <button onclick="closeSettings()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">취소</button>
      <button onclick="saveCategories()" class="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">저장 적용</button>
    </div>
  </div>
</div>

<script>
// ==================== 전역 상태 ====================
let LOAN = null;       // 현재 선택된 월 결산 데이터
let TREND = null;      // data.json 월별 추이
let currentPage = 'overview';
let pendingParsed = null;  // 업로드 파싱 대기 데이터

// ── IndexedDB 키: 'apl_months' { yyyymm: { base_date, records, count, uploaded_at } }
const DB_KEY = 'apl_months_v1';

// ==================== 카테고리 / 그룹 설정 ====================
const DEFAULT_CATEGORIES = [
  { id:'c1', name:'담보상품',      color:'#2563eb', order:1, products:['담보론','담보론(지분대출)'] },
  { id:'c2', name:'신용(N계열)',   color:'#059669', order:2, products:['N론','N론(하이브리드)','토마토N론','오투N론','기타N'] },
  { id:'c3', name:'신용(스타/큐브)',color:'#7c3aed', order:3, products:['스타론','스타스위치론','큐브론'] },
  { id:'c4', name:'신용(토마토)',  color:'#d97706', order:4, products:['토마토토탈론','토마토토탈론플러스','토마토론'] },
  { id:'c5', name:'신용(OP/오투)', color:'#0891b2', order:5, products:['OP론','오투론','테일론','프리미엄론'] },
  { id:'c6', name:'기타신용',      color:'#6b7280', order:6, products:['플러스론','T플러스론','토탈론','레이디론','다이렉트론(A)','다이렉트론(W)','전월세론','우량론','프리론','기타','회생'] },
];
const DEFAULT_GROUPS = [
  { id:'g1', name:'담보',       color:'#1e40af', categoryIds:['c1'] },
  { id:'g2', name:'신용',       color:'#065f46', categoryIds:['c2','c3','c4','c5'] },
  { id:'g3', name:'기타/회생',  color:'#374151', categoryIds:['c6'] },
];
let CATEGORIES = [];
let GROUPS = [];
let editCategories = [];
let editGroups = [];
let settingsTab = 'categories';

// ==================== IndexedDB 헬퍼 ====================
function getMonthsDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); } catch(e){ return {}; }
}
function saveMonthsDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}
function getMonthKeys() {
  return Object.keys(getMonthsDB()).sort().reverse(); // 최신순
}

// ==================== 초기화 ====================
async function init() {
  try {
    // 1. 월별 추이(마감자료) 로드
    const trendRes = await fetch('/data.json');
    TREND = await trendRes.json();

    loadCategoriesFromStorage();

    // 2. IndexedDB에 저장된 가장 최신 월 로드 시도
    const months = getMonthKeys();
    if (months.length > 0) {
      await loadMonthData(months[0]);
    } else {
      // fallback: 기존 loan_data.json
      try {
        const r = await fetch('/loan_data.json');
        LOAN = await r.json();
      } catch(e) {}
    }

    if (LOAN) {
      document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + (TREND?.generated_at || '-');
      document.getElementById('hdr-basedate').textContent = LOAN.base_date;
    } else {
      document.getElementById('hdr-date').textContent = '추이: ' + (TREND?.generated_at || '-');
    }

    refreshSidebarMonths();
    renderPage();
  } catch(e) {
    document.getElementById('main-content').innerHTML =
      '<div class="flex items-center justify-center h-64 text-red-500"><i class="fas fa-exclamation-circle mr-2"></i>초기 로드 실패: '+e.message+'</div>';
  }
}

async function loadMonthData(yyyymm) {
  const db = getMonthsDB();
  if (!db[yyyymm]) return false;
  LOAN = db[yyyymm];
  document.getElementById('hdr-basedate').textContent = LOAN.base_date;
  document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + (TREND?.generated_at || '-');
  // 사이드바 활성 월 표시
  document.getElementById('sb-active-month').textContent = yyyymm.slice(0,4)+'년 '+parseInt(yyyymm.slice(4))+'월';
  refreshSidebarMonths(yyyymm);
  return true;
}

function refreshSidebarMonths(activeKey) {
  const months = getMonthKeys();
  const badge = document.getElementById('sb-month-count');
  if (badge) badge.textContent = months.length;

  const list = document.getElementById('sb-month-list');
  if (!list) return;
  if (months.length === 0) {
    list.innerHTML = '<p class="text-xs text-blue-400 opacity-50">없음</p>';
    return;
  }
  list.innerHTML = months.map(m => {
    const y = m.slice(0,4), mo = parseInt(m.slice(4));
    const isActive = m === activeKey;
    return \`<button onclick="selectMonth('\${m}')" class="month-tag \${isActive?'active':'has-data'} w-full text-left">
      <i class="fas fa-circle text-xs"></i> \${y}년 \${mo}월
    </button>\`;
  }).join('');
}

async function selectMonth(yyyymm) {
  await loadMonthData(yyyymm);
  if (currentPage !== 'upload') renderPage();
  else goPage('overview');
}

// ==================== 라우팅 ====================
function goPage(page) {
  currentPage = page;
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const target = document.querySelector(\`[data-page="\${page}"]\`);
  if (target) target.classList.add('active');
  renderPage();
}

function renderPage() {
  const el = document.getElementById('main-content');
  destroyCharts();
  if (!LOAN && currentPage !== 'upload' && currentPage !== 'trend') {
    el.innerHTML = \`<div class="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
      <i class="fas fa-cloud-upload-alt text-5xl text-blue-200"></i>
      <p class="text-lg font-medium text-gray-500">결산자료가 없습니다</p>
      <p class="text-sm">결산자료를 업로드하거나 월별 데이터 관리에서 선택하세요</p>
      <button onclick="goPage('upload')" class="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
        <i class="fas fa-upload mr-2"></i>데이터 업로드
      </button>
    </div>\`;
    return;
  }
  switch(currentPage) {
    case 'overview': renderOverview(el); break;
    case 'balance':  renderBalance(el);  break;
    case 'product':  renderProduct(el);  break;
    case 'agent':    renderAgent(el);    break;
    case 'overdue':  renderOverdue(el);  break;
    case 'trend':    renderTrend(el);    break;
    case 'upload':   renderUploadPage(el); break;
  }
}

// ==================== 유틸 ====================
const charts = {};
function destroyCharts() {
  Object.values(charts).forEach(c => { try{c.destroy()}catch(e){} });
  Object.keys(charts).forEach(k => delete charts[k]);
}
function fmt(n,dec=1){if(!n&&n!==0)return'-';const a=Math.abs(n);if(a>=100000000)return(n/100000000).toFixed(dec)+'억';if(a>=10000)return(n/10000).toFixed(dec)+'만';return n.toFixed(0);}
function fmtAmt(n){if(!n&&n!==0)return'-';return(n/100000000).toFixed(2)+'억';}
function fmtN(n){return n?Math.round(n).toLocaleString():'0';}
function fmtR(n){return n?n.toFixed(2)+'%':'-';}
function fmtRn(n){return n?n.toFixed(1)+'%':'-';}

function loadCategoriesFromStorage() {
  try{
    const s=localStorage.getItem('apl_categories_v2');
    CATEGORIES=s?JSON.parse(s):JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    // order 필드 없는 기존 데이터 마이그레이션
    CATEGORIES.forEach((c,i)=>{ if(c.order==null) c.order=i+1; });
  }catch(e){CATEGORIES=JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));}
  try{const s=localStorage.getItem('apl_groups_v1');GROUPS=s?JSON.parse(s):JSON.parse(JSON.stringify(DEFAULT_GROUPS));}catch(e){GROUPS=JSON.parse(JSON.stringify(DEFAULT_GROUPS));}
}
function saveCatsToStorage(){
  localStorage.setItem('apl_categories_v2',JSON.stringify(CATEGORIES));
  localStorage.setItem('apl_groups_v1',JSON.stringify(GROUPS));
}
function getGroupOfCategory(catId){for(const g of GROUPS)if(g.categoryIds.includes(catId))return g;return{id:'__none__',name:'미배정',color:'#9ca3af'};}
function getCategoryOfProduct(pname){for(const cat of CATEGORIES)if(cat.products.includes(pname))return cat;return{id:'__none__',name:'미분류',color:'#9ca3af'};}

function aggregateByProduct() {
  const map = {};
  for(const r of LOAN.records){
    const p=r.p||'기타';
    if(!map[p])map[p]={count:0,balance:0,rateWSum:0,rateBalSum:0,ltvWSum:0,ltvAppSum:0,overdue0:0,overdue10:0,overdue30:0,overdue60:0,overdue90:0,overdueMore:0,bal0:0,bal10:0,bal30_:0,bal60:0,bal90:0,balMore:0};
    map[p].count++;map[p].balance+=r.b;
    if(r.r>0&&r.b>0){map[p].rateWSum+=r.b*r.r;map[p].rateBalSum+=r.b;}  // 잔액가중합
    // LTV: 담보대출/감정가 가중합 (담보상품만, appraised>0 건만)
    if(r.appraised>0&&r.loanAmt>0){map[p].ltvWSum+=r.loanAmt;map[p].ltvAppSum+=r.appraised;}
    if(r.d===0){map[p].overdue0++;map[p].bal0+=r.b;}
    else if(r.d<=10){map[p].overdue10++;map[p].bal10+=r.b;}
    else if(r.d<=30){map[p].overdue30++;map[p].bal30_+=r.b;}
    else if(r.d<=60){map[p].overdue60++;map[p].bal60+=r.b;}
    else if(r.d<=90){map[p].overdue90++;map[p].bal90+=r.b;}
    else{map[p].overdueMore++;map[p].balMore+=r.b;}
  }
  return map;
}
function aggregateByAgent() {
  const map = {};
  for(const r of LOAN.records){
    const a=r.a||'기타';
    if(!map[a])map[a]={count:0,balance:0,rateWSum:0,rateBalSum:0,overdue30:0,bal30:0};
    map[a].count++;map[a].balance+=r.b;
    if(r.r>0&&r.b>0){map[a].rateWSum+=r.b*r.r;map[a].rateBalSum+=r.b;}  // 잔액가중합
    if(r.d>30){map[a].overdue30++;map[a].bal30+=r.b;}
  }
  return map;
}
function aggregateByCategory() {
  const catMap={};
  const allCats=[...CATEGORIES,{id:'__none__',name:'미분류',color:'#9ca3af',products:[]}];
  for(const cat of allCats)catMap[cat.id]={...cat,count:0,balance:0,rateWSum:0,rateBalSum:0,ltvWSum:0,ltvAppSum:0,overdue0:0,overdueAny:0,bal0:0,balAny:0,bal10Over:0,bal30Over:0,bal90Over:0};
  for(const r of LOAN.records){
    const cat=getCategoryOfProduct(r.p);
    const cm=catMap[cat.id];if(!cm)continue;
    cm.count++;cm.balance+=r.b;
    if(r.r>0&&r.b>0){cm.rateWSum+=r.b*r.r;cm.rateBalSum+=r.b;}  // 잔액가중합
    // LTV: 담보대출/감정가 가중합 (담보상품만)
    if(r.appraised>0&&r.loanAmt>0){cm.ltvWSum+=r.loanAmt;cm.ltvAppSum+=r.appraised;}
    if(r.d===0){cm.overdue0++;cm.bal0+=r.b;}else{cm.overdueAny++;cm.balAny+=r.b;}
    if(r.d>10){cm.bal10Over+=r.b;}
    if(r.d>30){cm.bal30Over+=r.b;}
    if(r.d>90){cm.bal90Over+=r.b;}
  }
  return Object.values(catMap).filter(c=>c.count>0).sort((a,b)=>(a.order??99)-(b.order??99));
}
function aggregateByGroup() {
  const catMap={};
  for(const c of CATEGORIES)catMap[c.id]={...c,count:0,balance:0,rateWSum:0,rateBalSum:0,overdueAny:0,balAny:0};
  catMap['__none__']={id:'__none__',name:'미분류',color:'#9ca3af',count:0,balance:0,rateWSum:0,rateBalSum:0,overdueAny:0,balAny:0};
  for(const r of LOAN.records){
    const cat=getCategoryOfProduct(r.p);const cm=catMap[cat.id]||catMap['__none__'];
    cm.count++;cm.balance+=r.b;
    if(r.r>0&&r.b>0){cm.rateWSum+=r.b*r.r;cm.rateBalSum+=r.b;}  // 잔액가중합
    if(r.d>0){cm.overdueAny++;cm.balAny+=r.b;}
  }
  const grpMap={};
  const allGrps=[...GROUPS,{id:'__none__',name:'미배정',color:'#9ca3af',categoryIds:[]}];
  for(const g of allGrps)grpMap[g.id]={...g,count:0,balance:0,rateWSum:0,rateBalSum:0,overdueAny:0,balAny:0,cats:[]};
  for(const[cid,cv] of Object.entries(catMap)){
    if(cv.count===0)continue;
    const grp=getGroupOfCategory(cid);const gm=grpMap[grp.id];if(!gm)continue;
    gm.count+=cv.count;gm.balance+=cv.balance;gm.rateWSum+=cv.rateWSum;gm.rateBalSum+=cv.rateBalSum;gm.overdueAny+=cv.overdueAny;gm.balAny+=cv.balAny;gm.cats.push(cv);
  }
  return Object.values(grpMap).filter(g=>g.count>0);
}

// ==================== 차트 ====================
function mkPie(id,labels,data,colors){const ctx=document.getElementById(id);if(!ctx)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:2,borderColor:'#fff',hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){const v=ctx.raw;const total=ctx.dataset.data.reduce((a,b)=>a+b,0);return' '+labels[ctx.dataIndex]+': '+fmtAmt(v)+' ('+(v/total*100).toFixed(1)+'%)';}}}}}});}
function mkBar(id,labels,datasets,opts={}){const ctx=document.getElementById(id);if(!ctx)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(ctx,{type:'bar',data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},scales:{x:{ticks:{font:{size:10}}},y:{ticks:{callback:v=>opts.pct?v.toFixed(1)+'%':fmtAmt(v),font:{size:10}}}},...opts.extra}});}
function mkLine(id,labels,datasets,opts={}){const ctx=document.getElementById(id);if(!ctx)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(ctx,{type:'line',data:{labels,datasets:datasets.map(d=>({...d,tension:.35,pointRadius:3,pointHoverRadius:5,borderWidth:2.5}))},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},scales:{y:{ticks:{callback:v=>opts.pct?v.toFixed(1)+'%':fmtAmt(v),font:{size:10}}},...(opts.y1?{y1:{type:'linear',position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>v.toFixed(1)+'%',font:{size:10}}}}:{})}}});}

// ==================== 페이지: 월별 데이터 관리 ====================
function renderUploadPage(el) {
  const db = getMonthsDB();
  const months = getMonthKeys();
  el.innerHTML = \`
<div class="space-y-5">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-bold">결산자료 업로드</h2>
      <p class="text-sm text-gray-500">결산자료(xlsx)를 기준월별로 업로드하고 관리합니다</p>
    </div>
    <button onclick="openUploadModal()" class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
      <i class="fas fa-upload"></i> 새 월 업로드
    </button>
  </div>

  <!-- 안내 카드 -->
  <div class="card p-5 bg-blue-50 border-blue-100">
    <div class="flex items-start gap-3">
      <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
      <div>
        <p class="text-sm font-bold text-blue-800 mb-1">엑셀 파일 구조 안내</p>
        <p class="text-xs text-blue-600">결산자료는 <strong>A열(고객명) ~ DJ열(부서)</strong> 까지 114개 컬럼으로 구성됩니다.</p>
        <p class="text-xs text-blue-600 mt-1">분석에 사용되는 핵심 컬럼: <strong>H열(현재상품) · L열(잔액) · O열(정상이율) · Q열(광고매체) · J열(연체일수) · K열(최초대출액) · CF열(최종감정가) · CG열(소유비율합계) · CH열(지분율대출원금합계)</strong></p>
      </div>
    </div>
  </div>

  <!-- 업로드된 월 목록 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-database mr-2 text-indigo-500"></i>업로드된 월별 데이터 (\${months.length}건)</h3>
    \${months.length === 0
      ? \`<div class="text-center py-12 text-gray-400">
          <i class="fas fa-inbox text-4xl mb-3"></i>
          <p class="text-sm">업로드된 데이터가 없습니다</p>
          <button onclick="openUploadModal()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            첫 번째 결산자료 업로드
          </button>
        </div>\`
      : months.map(m => {
          const d = db[m];
          const y = m.slice(0,4), mo = parseInt(m.slice(4));
          const total = d.records.reduce((s,r)=>s+(r.b||0),0);
          const isActive = LOAN && LOAN.base_date && LOAN.base_date.startsWith(m.slice(0,4)+'-'+m.slice(4));
          return \`<div class="month-row \${isActive?'border-blue-300 bg-blue-50':''}">
            <div class="month-dot \${isActive?'bg-blue-500':'bg-green-400'}"></div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800">\${y}년 \${mo}월</span>
                \${isActive?'<span class="badge badge-blue">현재 선택</span>':''}
              </div>
              <p class="text-xs text-gray-500 mt-0.5">기준일 \${d.base_date} · \${fmtN(d.count)}건 · 잔고 \${fmtAmt(total)} · 업로드 \${d.uploaded_at||'-'}</p>
            </div>
            <button onclick="selectMonthAndAnalyze('\${m}')" class="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              <i class="fas fa-chart-bar mr-1"></i>분석 보기
            </button>
            <button onclick="deleteMonth('\${m}')" class="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
              <i class="fas fa-trash mr-1"></i>삭제
            </button>
          </div>\`;
        }).join('')
    }
  </div>
</div>\`;
}

async function selectMonthAndAnalyze(yyyymm) {
  await loadMonthData(yyyymm);
  goPage('overview');
}

function deleteMonth(yyyymm) {
  if (!confirm(\`\${yyyymm.slice(0,4)}년 \${parseInt(yyyymm.slice(4))}월 데이터를 삭제하시겠습니까?\`)) return;
  const db = getMonthsDB();
  delete db[yyyymm];
  saveMonthsDB(db);
  refreshSidebarMonths();
  renderUploadPage(document.getElementById('main-content'));
}

// ==================== 업로드 모달 ====================
function openUploadModal() {
  // 연도 옵션 생성
  const yearSel = document.getElementById('upload-year');
  const now = new Date();
  yearSel.innerHTML = '';
  for (let y = now.getFullYear(); y >= 2020; y--) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y+'년';
    yearSel.appendChild(opt);
  }
  pendingParsed = null;
  document.getElementById('upload-file-name').classList.add('hidden');
  document.getElementById('parse-progress').classList.add('hidden');
  document.getElementById('parse-result').classList.add('hidden');
  document.getElementById('save-upload-btn').disabled = true;
  document.getElementById('upload-zone').querySelector('p.text-gray-600').textContent = '결산자료.xlsx 파일을 드래그하거나 클릭하여 선택';
  document.getElementById('upload-modal').classList.add('open');
}
function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('open');
}

function handleFileDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) processFile(file);
}
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  if (!file.name.match(/\\.xlsx?$/i)) {
    alert('xlsx 또는 xls 파일만 지원합니다.');
    return;
  }
  // 파일명 표시
  const fnDiv = document.getElementById('upload-file-name');
  fnDiv.querySelector('span').textContent = '📎 ' + file.name;
  fnDiv.classList.remove('hidden');

  document.getElementById('parse-progress').classList.remove('hidden');
  document.getElementById('parse-result').classList.add('hidden');
  document.getElementById('save-upload-btn').disabled = true;

  const setProgress = (pct, msg) => {
    document.getElementById('parse-bar').style.width = pct + '%';
    document.getElementById('parse-msg').textContent = msg;
  };

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      setProgress(30, '엑셀 파싱 중...');
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      setProgress(60, '데이터 변환 중...');

      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (rows.length < 2) throw new Error('데이터가 없습니다');

      const headers = rows[0];
      // 컬럼 인덱스 찾기
      const hIdx = (name) => headers.indexOf(name);
      const colP   = hIdx('현재상품');  // H
      const colB   = hIdx('잔액');      // L
      const colR   = hIdx('정상이율'); // O
      const colA   = hIdx('광고매체'); // Q
      const colD   = hIdx('연체일수'); // J
      const colLtv = hIdx('LTV');       // BH (or 최근LTV)
      const colK   = hIdx('최초대출액');      // K열
      const colCF  = hIdx('최종감정가');      // CF열
      const colCG  = hIdx('소유비율합계');    // CG열
      const colCH  = hIdx('지분율대출원금합계'); // CH열
      const colCt  = hIdx('계약구분'); // 계약구분
      const colRt  = hIdx('상환방식'); // 상환방식
      const colCla = hIdx('담보지역'); // 담보지역
      const colClt = hIdx('담보종류'); // 담보종류
      const colGy  = hIdx('회생여부'); // 회생여부
      const colDate= hIdx('계약일자'); // 계약일자

      if (colP<0||colB<0) throw new Error('현재상품 또는 잔액 컬럼을 찾을 수 없습니다');

      setProgress(80, '레코드 생성 중...');
      const records = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[colB]) continue;
        const b = parseFloat(row[colB]) || 0;
        if (b <= 0) continue;
        const pName = String(row[colP] || '기타').trim();
        // 담보 LTV 관련 필드 (담보론, 담보론(지분대출), 토마토토탈론, 토마토토탈론플러스)
        const isCollateral = (pName === '담보론' || pName === '담보론(지분대출)' || pName === '토마토토탈론' || pName === '토마토토탈론플러스');
        const loanK   = parseFloat(row[colK])  || 0;  // 최초대출액
        const cfVal   = parseFloat(row[colCF]) || 0;  // 최종감정가
        const cgVal   = parseFloat(row[colCG]) || 0;  // 소유비율합계(%)
        const chVal   = parseFloat(row[colCH]) || 0;  // 지분율대출원금합계
        // 담보대출 = 최초대출액 + 지분율대출원금합계
        const loanAmt     = isCollateral ? (loanK + chVal)          : 0;
        // 감정가   = 최종감정가 × 소유비율합계 / 100
        const appraised   = isCollateral ? (cfVal * cgVal / 100)    : 0;
        records.push({
          p:   pName,
          b:   b,
          r:   parseFloat(row[colR])  || 0,
          a:   String(row[colA]  || '기타').trim(),
          d:   parseInt(row[colD])    || 0,
          ltv: parseFloat(row[colLtv])|| 0,
          loanAmt,    // 최초대출액+지분율대출원금합계 (담보상품만, 나머지 0)
          appraised,  // 최종감정가×소유비율합계% (담보상품만, 나머지 0)
          ct:  String(row[colCt] || '').trim(),
          rt:  String(row[colRt] || '').trim(),
          cla: String(row[colCla]|| '').trim(),
          clt: String(row[colClt]|| '').trim(),
          gy:  String(row[colGy] || '').trim(),
        });
      }

      setProgress(95, '요약 정보 생성 중...');
      // 기준월 추출 (선택된 연월)
      const y = document.getElementById('upload-year').value;
      const mo = document.getElementById('upload-month').value;
      const baseDate = y + '-' + mo + '-30';

      pendingParsed = {
        base_date: baseDate,
        records,
        count: records.length,
        uploaded_at: new Date().toLocaleDateString('ko-KR')
      };

      // 결과 요약
      const total = records.reduce((s,r)=>s+r.b,0);
      const prods = [...new Set(records.map(r=>r.p))].length;
      const agents = [...new Set(records.map(r=>r.a))].length;
      const odCnt = records.filter(r=>r.d>30).length;

      setProgress(100, '완료!');
      setTimeout(()=>{
        document.getElementById('parse-progress').classList.add('hidden');
        document.getElementById('parse-result').classList.remove('hidden');
        document.getElementById('parse-summary').innerHTML = \`
          <div class="grid grid-cols-2 gap-2">
            <div>• 총 레코드: <strong>\${fmtN(records.length)}건</strong></div>
            <div>• 총 잔고: <strong>\${fmtAmt(total)}</strong></div>
            <div>• 상품 수: <strong>\${prods}개</strong></div>
            <div>• 에이전트 수: <strong>\${agents}개</strong></div>
            <div>• 30일 초과 연체: <strong>\${fmtN(odCnt)}건 (\${(odCnt/records.length*100).toFixed(1)}%)</strong></div>
            <div>• 기준월: <strong>\${y}년 \${parseInt(mo)}월</strong></div>
          </div>\`;
        document.getElementById('save-upload-btn').disabled = false;
      }, 300);
    } catch(err) {
      document.getElementById('parse-progress').classList.add('hidden');
      alert('파싱 오류: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function saveUploadedData() {
  if (!pendingParsed) return;
  const y = document.getElementById('upload-year').value;
  const mo = document.getElementById('upload-month').value;
  const key = y + mo; // e.g. '202606'

  const db = getMonthsDB();
  db[key] = pendingParsed;
  saveMonthsDB(db);

  LOAN = pendingParsed;
  document.getElementById('hdr-basedate').textContent = LOAN.base_date;
  document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + (TREND?.generated_at||'-');
  document.getElementById('sb-active-month').textContent = y+'년 '+parseInt(mo)+'월';

  refreshSidebarMonths(key);
  closeUploadModal();
  goPage('overview');
}

// ==================== 페이지: 종합 개요 ====================
function renderOverview(el) {
  const total = LOAN.records.reduce((s,r)=>s+r.b,0);
  const totalCnt = LOAN.records.length;
  const overdue30 = LOAN.records.filter(r=>r.d>30);
  const od30Amt = overdue30.reduce((s,r)=>s+r.b,0);
  const od30Rate = od30Amt/total*100;
  const rWSum=LOAN.records.reduce((s,r)=>r.r>0&&r.b>0?s+r.b*r.r:s,0);
  const rBSum=LOAN.records.reduce((s,r)=>r.r>0&&r.b>0?s+r.b:s,0);
  const avgRate = rBSum>0 ? rWSum/rBSum : 0;
  const trendLast = TREND?.total;
  const tBal = trendLast?.balance[trendLast.balance.length-1];
  const tNew = trendLast?.new_loans[trendLast.new_loans.length-1];
  const catData = aggregateByCategory();

  el.innerHTML = \`
<div class="space-y-5">
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
      <p class="text-2xl font-bold" style="color:#059669">\${tNew?fmtAmt(tNew.amount*100000000):'-'}</p>
      <p class="text-xs text-gray-500 mt-1">당월 신규대출 실행</p>
      <p class="text-xs text-gray-400 mt-1">\${tNew?'접수 '+fmtN(tNew.request)+'건 → 승인 '+fmtN(tNew.approve)+'건':'-'}</p>
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fff7ed"><i class="fas fa-percentage" style="color:#d97706"></i></div>
        <span class="badge badge-orange">금리</span>
      </div>
      <p class="text-2xl font-bold" style="color:#d97706">\${avgRate.toFixed(2)}%</p>
      <p class="text-xs text-gray-500 mt-1">평균 정상이율</p>
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fef2f2"><i class="fas fa-exclamation-triangle" style="color:#dc2626"></i></div>
        <span class="badge badge-red">연체</span>
      </div>
      <p class="text-2xl font-bold" style="color:#dc2626">\${od30Rate.toFixed(2)}%</p>
      <p class="text-xs text-gray-500 mt-1">30일 초과 연체율</p>
      <p class="text-xs text-gray-400 mt-1">\${fmtN(overdue30.length)}건 / \${fmtAmt(od30Amt)}</p>
    </div>
  </div>
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
  \${TREND?'\`<div class="card p-5"><h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-chart-area mr-2 text-green-500"></i>월별 추이 (최근 13개월)</h3><div class="chart-wrap-lg"><canvas id="ov-trend"></canvas></div></div>\`':''}
</div>\`;

  setTimeout(()=>{
    mkPie('ov-pie',catData.map(c=>c.name),catData.map(c=>c.balance),catData.map(c=>c.color));
    const pMap=aggregateByProduct();
    const pArr=Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).slice(0,15);
    mkBar('ov-bar',pArr.map(([p])=>p),[{label:'잔고',data:pArr.map(([,v])=>v.balance/100000000),backgroundColor:pArr.map(([p])=>getCategoryOfProduct(p).color+'cc')}],{extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    if(TREND){
      mkLine('ov-trend',TREND.months,[
        {label:'융자잔고(억)',data:TREND.total.balance.map(b=>b.amount),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.08)',fill:true},
        {label:'30일연체율(%)',data:TREND.total.overdue.map(o=>o.rate_30),borderColor:'#dc2626',yAxisID:'y1'}
      ],{y1:true});
    }
  },50);
}

// ==================== 페이지: 잔고 구성비 ====================
function renderBalance(el) {
  const total=LOAN.records.reduce((s,r)=>s+r.b,0);
  const catData=aggregateByCategory();
  const grpData=aggregateByGroup();
  const pMap=aggregateByProduct();
  el.innerHTML=\`
<div class="space-y-5">
  <div class="flex items-center justify-between">
    <div><h2 class="text-lg font-bold">잔고 구성비 분석</h2>
    <p class="text-sm text-gray-500">총 잔고: <strong>\${fmtAmt(total)}</strong> (\${fmtN(LOAN.records.length)}건) | 기준일: \${LOAN.base_date}</p></div>
    <button onclick="openSettings()" class="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100">
      <i class="fas fa-sliders-h"></i>카테고리 설정
    </button>
  </div>
  \${grpData.length>0?\`<div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-layer-group mr-2" style="color:#7c3aed"></i>상위 카테고리(그룹) 구성비</h3>
    <div class="flex rounded-xl overflow-hidden h-8 mb-4">
      \${grpData.map(g=>\`<div class="flex items-center justify-center text-white text-xs font-bold" style="width:\${(g.balance/total*100).toFixed(1)}%;background:\${g.color}" title="\${g.name}: \${fmtAmt(g.balance)}">\${(g.balance/total*100)>=6?g.name:''}</div>\`).join('')}
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      \${grpData.map(g=>{const pct=(g.balance/total*100);const avgR=g.rateBalSum>0?(g.rateWSum/g.rateBalSum).toFixed(2):'-';const odR=g.count>0?((g.overdueAny/g.count)*100).toFixed(1):'0';
      return \`<div class="rounded-xl p-3" style="background:\${g.color}12;border:1.5px solid \${g.color}40">
        <div class="flex items-center gap-1.5 mb-1"><div class="w-2.5 h-2.5 rounded-full" style="background:\${g.color}"></div><span class="text-xs font-bold text-gray-700">\${g.name}</span></div>
        <p class="text-2xl font-black" style="color:\${g.color}">\${pct.toFixed(1)}%</p>
        <p class="text-xs text-gray-500 mt-0.5">\${fmtAmt(g.balance)} / \${fmtN(g.count)}건</p>
        <div class="mt-1 flex gap-3 text-xs text-gray-400"><span>금리 <b class="text-gray-600">\${avgR}%</b></span><span>연체 <b class="\${parseFloat(odR)>=5?'text-red-600':parseFloat(odR)>=3?'text-orange-500':'text-green-600'}">\${odR}%</b></span></div>
        <div class="mt-1.5 flex flex-wrap gap-1">\${g.cats.map(c=>\`<span class="text-xs px-1.5 py-0.5 rounded-full text-white" style="background:\${c.color}cc">\${c.name}</span>\`).join('')}</div>
      </div>\`;}).join('')}
    </div>
  </div>\`:''}
  <div>
    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3"><i class="fas fa-tags mr-1.5"></i>카테고리(하위) 상세</p>
  </div>
  <div class="card overflow-hidden">
    <table class="data-table">
      <thead><tr>
        <th style="width:130px">상품구분</th>
        <th class="text-right">구성비</th>
        <th class="text-right">잔고금액</th>
        <th class="text-right">건수</th>
        <th class="text-right">평균금리</th>
        <th class="text-right">평균LTV</th>
        <th class="text-right">10일초과 연체율</th>
        <th class="text-right">30일초과 연체율</th>
        <th class="text-right">90일초과 연체율</th>
        <th>상품명</th>
      </tr></thead>
      <tbody>\${catData.map(c=>{
        const pct=(c.balance/total*100);
        const avgR=c.rateBalSum>0?(c.rateWSum/c.rateBalSum).toFixed(2):'-';
        const avgLtv=c.ltvAppSum>0?(c.ltvWSum/c.ltvAppSum*100).toFixed(1):'-';
        const od10r=c.balance>0?(c.bal10Over/c.balance*100).toFixed(2):'0.00';
        const od30r=c.balance>0?(c.bal30Over/c.balance*100).toFixed(2):'0.00';
        const od90r=c.balance>0?(c.bal90Over/c.balance*100).toFixed(2):'0.00';
        return \`<tr>
          <td><div class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:\${c.color}"></div><span class="font-bold text-gray-800">\${c.name}</span></div></td>
          <td class="text-right"><span class="font-bold text-base" style="color:\${c.color}">\${pct.toFixed(1)}%</span><div class="progress-bar mt-1" style="height:4px"><div class="progress-fill" style="width:\${Math.min(pct,100)}%;background:\${c.color}"></div></div></td>
          <td class="text-right font-semibold">\${fmtAmt(c.balance)}</td>
          <td class="text-right">\${fmtN(c.count)}건</td>
          <td class="text-right">\${avgR}%</td>
          <td class="text-right">\${avgLtv!=='-'?avgLtv+'%':'-'}</td>
          <td class="text-right \${parseFloat(od10r)>=3?'text-red-600 font-bold':parseFloat(od10r)>=1?'text-orange-500':parseFloat(od10r)>0?'text-yellow-600':''}">\${od10r}%</td>
          <td class="text-right \${parseFloat(od30r)>=3?'text-red-600 font-bold':parseFloat(od30r)>=1?'text-orange-500':parseFloat(od30r)>0?'text-yellow-600':''}">\${od30r}%</td>
          <td class="text-right \${parseFloat(od90r)>=1?'text-red-600 font-bold':parseFloat(od90r)>0?'text-orange-500':''}">\${od90r}%</td>
          <td><div class="flex flex-wrap gap-1">\${c.products.map(p=>\`<span class="text-xs px-2 py-0.5 rounded-full text-white" style="background:\${c.color}cc">\${p}</span>\`).join('')}</div></td>
        </tr>\`;
      }).join('')}
      </tbody>
    </table>
  </div>
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
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2" style="color:#059669"></i>상품별 상세</h3>
      <div class="overflow-auto" style="max-height:380px">
        <table class="data-table"><thead><tr><th>카테고리</th><th>상품명</th><th>건수</th><th>잔고</th><th>구성비</th><th>평균금리</th><th>연체율</th></tr></thead>
        <tbody>\${Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).map(([p,v])=>{
          const cat=getCategoryOfProduct(p);const pct2=(v.balance/total*100).toFixed(1);const avgR2=v.rateBalSum>0?(v.rateWSum/v.rateBalSum).toFixed(2):'-';
          const odR=v.count>0?((v.overdue30+v.overdue60+v.overdue90+v.overdueMore)/v.count*100).toFixed(1):'0';
          return \`<tr><td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td><td class="font-medium">\${p}</td><td>\${fmtN(v.count)}</td><td class="font-semibold">\${fmtAmt(v.balance)}</td>
          <td><div class="flex items-center gap-2"><div class="progress-bar flex-1 w-16"><div class="progress-fill" style="width:\${pct2}%;background:\${cat.color}"></div></div><span>\${pct2}%</span></div></td>
          <td>\${avgR2}%</td><td class="\${parseFloat(odR)>=5?'text-red-600 font-bold':parseFloat(odR)>=3?'text-orange-500':''}">\${odR}%</td></tr>\`;}).join('')}
        </tbody></table>
      </div>
    </div>
  </div>
</div>\`;
  setTimeout(()=>{ mkPie('bal-pie',catData.map(c=>c.name),catData.map(c=>c.balance),catData.map(c=>c.color)); },50);
}

// ==================== 페이지: 상품 분석 ====================
function renderProduct(el) {
  const total=LOAN.records.reduce((s,r)=>s+r.b,0);
  const pMap=aggregateByProduct();
  const pArr=Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance);
  el.innerHTML=\`
<div class="space-y-5">
  <h2 class="text-lg font-bold">상품 분석</h2>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-sort-amount-down mr-2 text-indigo-500"></i>잔고 순위 TOP15</h3>
      <div class="chart-wrap-lg"><canvas id="prod-bar"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-percentage mr-2 text-orange-500"></i>상품별 금리 분포</h3>
      <div class="chart-wrap-lg"><canvas id="prod-rate"></canvas></div>
    </div>
  </div>
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2 text-blue-500"></i>상품별 종합 현황</h3>
    <div class="overflow-auto">
      <table class="data-table"><thead><tr><th>#</th><th>상품명</th><th>카테고리</th><th>건수</th><th>잔고</th><th>구성비</th><th>평균금리</th><th>평균LTV</th><th>10일초과 연체금</th><th>10일초과(%)</th><th>30일초과(%)</th><th>90일초과(%)</th></tr></thead>
      <tbody>\${pArr.map(([p,v],i)=>{
        const cat=getCategoryOfProduct(p);const pct=(v.balance/total*100).toFixed(1);const avgR=v.rateBalSum>0?(v.rateWSum/v.rateBalSum).toFixed(2):'-';
        // 평균LTV: 담보론, 담보론(지분대출), 토마토토탈론, 토마토토탈론플러스만 표시 — Σ담보대출 / Σ감정가 × 100
        const isColPrd=(p==='담보론'||p==='담보론(지분대출)'||p==='토마토토탈론'||p==='토마토토탈론플러스');
        const avgLtv=isColPrd&&v.ltvAppSum>0?(v.ltvWSum/v.ltvAppSum*100).toFixed(1):'-';
        // 10일초과 연체금 (11일 이상 전체 잔액 합계)
        const bal10Over = v.bal30_+v.bal60+v.bal90+v.balMore;
        // 연체율: 각 기준 초과 잔액 / 상품 총잔액 × 100
        const od10r  = v.balance>0?(bal10Over                    /v.balance*100).toFixed(2):'0.00'; // 10일 초과
        const od30r  = v.balance>0?((v.bal60+v.bal90+v.balMore) /v.balance*100).toFixed(2):'0.00'; // 30일 초과
        const od90r  = v.balance>0?(v.balMore                   /v.balance*100).toFixed(2):'0.00'; // 90일 초과
        return \`<tr><td class="text-gray-400">\${i+1}</td><td class="font-medium">\${p}</td><td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
        <td>\${fmtN(v.count)}</td><td class="font-semibold">\${fmtAmt(v.balance)}</td><td>\${pct}%</td><td>\${avgR}%</td><td>\${avgLtv!=='-'?avgLtv+'%':'-'}</td>
        <td class="\${bal10Over>0?'text-orange-500 font-semibold':''}">\${bal10Over>0?fmtAmt(bal10Over):'-'}</td>
        <td class="\${parseFloat(od10r)>=1?'text-orange-500':parseFloat(od10r)>0?'text-yellow-600':''}">\${od10r}%</td>
        <td class="\${parseFloat(od30r)>=1?'text-orange-500 font-bold':parseFloat(od30r)>0?'text-yellow-600':''}">\${od30r}%</td>
        <td class="\${parseFloat(od90r)>=1?'text-red-600 font-bold':parseFloat(od90r)>0?'text-orange-500':''}">\${od90r}%</td></tr>\`;}).join('')}
      </tbody></table>
    </div>
  </div>
</div>\`;
  setTimeout(()=>{
    const top=pArr.slice(0,15);
    mkBar('prod-bar',top.map(([p])=>p),[{label:'잔고',data:top.map(([,v])=>v.balance/100000000),backgroundColor:top.map(([p])=>getCategoryOfProduct(p).color+'cc')}],{extra:{indexAxis:'y',scales:{x:{ticks:{callback:v=>v+'억'}},y:{ticks:{font:{size:10}}}}}});
    mkBar('prod-rate',pArr.map(([p])=>p),[{label:'평균금리(%)',data:pArr.map(([,v])=>v.rateBalSum>0?(v.rateWSum/v.rateBalSum):0),backgroundColor:pArr.map(([p])=>getCategoryOfProduct(p).color+'bb')}],{pct:true,extra:{scales:{y:{ticks:{callback:v=>v+'%'}}}}});
  },50);
}

// ==================== 페이지: 에이전트 분석 ====================
function renderAgent(el) {
  const total=LOAN.records.reduce((s,r)=>s+r.b,0);
  const aMap=aggregateByAgent();
  const aArr=Object.entries(aMap).sort((a,b)=>b[1].balance-a[1].balance);
  el.innerHTML=\`
<div class="space-y-5">
  <h2 class="text-lg font-bold">에이전트(광고매체) 분석</h2>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="card p-5 lg:col-span-2">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-users mr-2 text-blue-500"></i>에이전트별 잔고</h3>
      <div class="chart-wrap-lg"><canvas id="ag-bar"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2 text-green-500"></i>구성비</h3>
      <div style="height:260px"><canvas id="ag-pie"></canvas></div>
    </div>
  </div>
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2 text-indigo-500"></i>에이전트별 상세</h3>
    <div class="overflow-auto">
      <table class="data-table"><thead><tr><th>#</th><th>에이전트</th><th>건수</th><th>잔고</th><th>구성비</th><th>평균금리</th><th>30일연체건수</th><th>30일연체율</th></tr></thead>
      <tbody>\${aArr.map(([a,v],i)=>{
        const pct=(v.balance/total*100).toFixed(1);const avgR=v.rateBalSum>0?(v.rateWSum/v.rateBalSum).toFixed(2):'-';const odR=v.count>0?(v.overdue30/v.count*100).toFixed(1):'0';
        return \`<tr><td class="text-gray-400">\${i+1}</td><td class="font-medium">\${a}</td><td>\${fmtN(v.count)}</td><td class="font-semibold">\${fmtAmt(v.balance)}</td>
        <td><div class="flex items-center gap-2"><div class="progress-bar flex-1 w-16"><div class="progress-fill bg-blue-400" style="width:\${pct}%"></div></div><span>\${pct}%</span></div></td>
        <td>\${avgR}%</td><td class="text-orange-500">\${fmtN(v.overdue30)}</td><td class="\${parseFloat(odR)>=5?'text-red-600 font-bold':parseFloat(odR)>=3?'text-orange-500':''}">\${odR}%</td></tr>\`;}).join('')}
      </tbody></table>
    </div>
  </div>
</div>\`;
  const colors=['#2563eb','#059669','#7c3aed','#d97706','#0891b2','#dc2626','#6366f1','#0d9488','#c026d3','#ea580c','#84cc16','#64748b','#be185d','#92400e','#1d4ed8','#15803d'];
  setTimeout(()=>{
    const top=aArr.slice(0,12);
    mkBar('ag-bar',top.map(([a])=>a),[{label:'잔고',data:top.map(([,v])=>v.balance/100000000),backgroundColor:colors.slice(0,top.length)}],{extra:{indexAxis:'y',scales:{x:{ticks:{callback:v=>v+'억'}},y:{ticks:{font:{size:10}}}}}});
    mkPie('ag-pie',top.map(([a])=>a),top.map(([,v])=>v.balance),colors.slice(0,top.length));
  },50);
}

// ==================== 페이지: 연체 현황 ====================
function renderOverdue(el) {
  const total=LOAN.records.reduce((s,r)=>s+r.b,0);
  const r0=LOAN.records.filter(r=>r.d===0);
  const r10=LOAN.records.filter(r=>r.d>0&&r.d<=10);
  const r30=LOAN.records.filter(r=>r.d>10&&r.d<=30);
  const r60=LOAN.records.filter(r=>r.d>30&&r.d<=60);
  const r90=LOAN.records.filter(r=>r.d>60&&r.d<=90);
  const rMore=LOAN.records.filter(r=>r.d>90);
  const bands=[{label:'정상(0일)',data:r0,color:'#059669'},{label:'1~10일',data:r10,color:'#84cc16'},{label:'11~30일',data:r30,color:'#f97316'},{label:'31~60일',data:r60,color:'#ef4444'},{label:'61~90일',data:r90,color:'#b91c1c'},{label:'90일 초과',data:rMore,color:'#7f1d1d'}];
  const pMap=aggregateByProduct();
  el.innerHTML=\`
<div class="space-y-5">
  <h2 class="text-lg font-bold">연체 현황</h2>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
    \${bands.map(b=>{const amt=b.data.reduce((s,r)=>s+r.b,0);const pct=(b.data.length/LOAN.records.length*100).toFixed(1);
    return\`<div class="kpi-card p-4"><div class="flex items-center gap-2 mb-2"><div class="w-3 h-3 rounded-full" style="background:\${b.color}"></div><span class="text-sm font-bold text-gray-700">\${b.label}</span></div>
    <p class="text-xl font-bold" style="color:\${b.color}">\${fmtN(b.data.length)}건</p>
    <p class="text-xs text-gray-500">\${fmtAmt(amt)} · \${pct}%</p></div>\`;}).join('')}
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5"><h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-bar mr-2 text-red-500"></i>연체 구간별 현황</h3><div class="chart-wrap-lg"><canvas id="od-bar"></canvas></div></div>
    \${TREND?\`<div class="card p-5"><h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-line mr-2 text-orange-500"></i>월별 연체율 추이</h3><div class="chart-wrap-lg"><canvas id="od-trend"></canvas></div></div>\`:''}
  </div>
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2 text-red-500"></i>상품별 연체 현황</h3>
    <div class="overflow-auto">
      <table class="data-table"><thead><tr><th>상품</th><th>전체건수</th><th>연체건수</th><th>연체율</th><th>31~60일</th><th>61~90일</th><th>90일↑</th><th>연체잔고</th></tr></thead>
      <tbody>\${Object.entries(pMap).sort((a,b)=>(b[1].overdue30+b[1].overdue60+b[1].overdue90+b[1].overdueMore)/(b[1].count||1)-(a[1].overdue30+a[1].overdue60+a[1].overdue90+a[1].overdueMore)/(a[1].count||1)).map(([p,v])=>{
        const odCnt=v.overdue30+v.overdue60+v.overdue90+v.overdueMore;const odR=(odCnt/v.count*100).toFixed(1);const odAmt=v.bal30;
        return\`<tr><td class="font-medium">\${p}</td><td>\${fmtN(v.count)}</td><td class="text-orange-500 font-medium">\${fmtN(odCnt)}</td>
        <td class="\${parseFloat(odR)>=10?'text-red-600 font-bold':parseFloat(odR)>=5?'text-orange-500 font-bold':''}">\${odR}%</td>
        <td>\${fmtN(v.overdue60)}</td><td>\${fmtN(v.overdue90)}</td><td class="text-red-600 font-bold">\${fmtN(v.overdueMore)}</td><td>\${fmtAmt(odAmt)}</td></tr>\`;}).join('')}
      </tbody></table>
    </div>
  </div>
</div>\`;
  setTimeout(()=>{
    mkBar('od-bar',bands.map(b=>b.label),[
      {label:'건수',data:bands.map(b=>b.data.length),backgroundColor:bands.map(b=>b.color+'cc'),yAxisID:'y'},
      {label:'잔고(억)',data:bands.map(b=>b.data.reduce((s,r)=>s+r.b,0)/100000000),backgroundColor:bands.map(b=>b.color+'44'),yAxisID:'y1',type:'line',borderColor:bands.map(b=>b.color)}
    ],{extra:{scales:{y:{ticks:{callback:v=>v+'건'}},y1:{type:'linear',position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    if(TREND)mkLine('od-trend',TREND.months,[
      {label:'10일연체율',data:TREND.total.overdue.map(o=>o.rate_10),borderColor:'#f97316',borderDash:[4,2]},
      {label:'30일연체율',data:TREND.total.overdue.map(o=>o.rate_30),borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true}
    ],{pct:true});
  },50);
}

// ==================== 페이지: 월별 추이 ====================
function renderTrend(el) {
  if (!TREND) {
    el.innerHTML='<div class="flex items-center justify-center h-64 text-gray-400">추이 데이터(data.json)가 없습니다</div>';
    return;
  }
  const tData=TREND.total;
  el.innerHTML=\`
<div class="space-y-5">
  <h2 class="text-lg font-bold">월별 추이 (마감자료 기준)</h2>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5"><h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-area mr-2 text-blue-500"></i>융자잔고 / 신규대출</h3><div class="chart-wrap-lg"><canvas id="tr-bal"></canvas></div></div>
    <div class="card p-5"><h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-line mr-2 text-orange-500"></i>연체율 추이</h3><div class="chart-wrap-lg"><canvas id="tr-od"></canvas></div></div>
  </div>
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2 text-green-500"></i>월별 요약</h3>
    <div class="overflow-auto">
      <table class="data-table"><thead><tr><th class="text-left">월</th><th>융자잔고(억)</th><th>신규실행(억)</th><th>상환율(%)</th><th>10일연체율</th><th>30일연체율</th></tr></thead>
      <tbody>\${TREND.months.map((m,i)=>{
        const b=tData.balance[i]?.amount||0;const n=tData.new_loans[i]?.amount||0;const rp=tData.repay[i]?.rate||0;const od10=tData.overdue[i]?.rate_10||0;const od30=tData.overdue[i]?.rate_30||0;
        return\`<tr \${i===TREND.months.length-1?'class="highlight"':''}><td class="font-medium">\${m}</td><td>\${b.toFixed(1)}</td><td>\${n.toFixed(1)}</td><td>\${rp.toFixed(1)}%</td>
        <td class="\${od10>=5?'text-orange-500 font-bold':''}">\${od10.toFixed(2)}%</td><td class="\${od30>=5?'text-red-600 font-bold':''}">\${od30.toFixed(2)}%</td></tr>\`;}).join('')}
      </tbody></table>
    </div>
  </div>
</div>\`;
  setTimeout(()=>{
    mkLine('tr-bal',TREND.months,[
      {label:'융자잔고(억)',data:tData.balance.map(b=>b.amount),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.08)',fill:true},
      {label:'신규대출(억)',data:tData.new_loans.map(n=>n.amount),borderColor:'#059669',borderDash:[5,3]}
    ],{});
    mkLine('tr-od',TREND.months,[
      {label:'10일연체율',data:tData.overdue.map(o=>o.rate_10),borderColor:'#f97316',borderDash:[4,2]},
      {label:'30일연체율',data:tData.overdue.map(o=>o.rate_30),borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true}
    ],{pct:true});
  },50);
}

// ==================== 시스템 설정 모달 ====================
const PALETTE=['#2563eb','#059669','#7c3aed','#d97706','#0891b2','#dc2626','#6366f1','#0d9488','#c026d3','#ea580c','#84cc16','#64748b','#be185d','#92400e','#1d4ed8','#15803d'];
const GRP_PALETTE=['#1e40af','#065f46','#374151','#7e22ce','#92400e','#9f1239','#0369a1','#166534','#1d4ed8','#15803d','#a16207','#334155'];

function openSettings(){
  editCategories=JSON.parse(JSON.stringify(CATEGORIES));
  editGroups=JSON.parse(JSON.stringify(GROUPS));
  settingsTab='categories';
  const ap=LOAN?[...new Set(LOAN.records.map(r=>r.p))].sort():[];
  renderSettingsBody(ap);
  document.getElementById('settings-modal').classList.add('open');
}
function openSettingsOnGroupTab(){
  editCategories=JSON.parse(JSON.stringify(CATEGORIES));
  editGroups=JSON.parse(JSON.stringify(GROUPS));
  settingsTab='groups';
  const ap=LOAN?[...new Set(LOAN.records.map(r=>r.p))].sort():[];
  renderSettingsBody(ap);
  document.getElementById('settings-modal').classList.add('open');
}
function closeSettings(){document.getElementById('settings-modal').classList.remove('open');}
function switchSettingsTab(tab){settingsTab=tab;const ap=LOAN?[...new Set(LOAN.records.map(r=>r.p))].sort():[];renderSettingsBody(ap);}

function renderSettingsBody(allProducts){
  const body=document.getElementById('settings-body');
  const tabHtml=\`<div class="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
    <button onclick="switchSettingsTab('categories')" class="flex-1 py-2 rounded-lg text-sm font-semibold transition \${settingsTab==='categories'?'bg-white text-blue-700 shadow':'text-gray-500 hover:text-gray-700'}"><i class="fas fa-tags mr-1.5"></i>카테고리 (하위)</button>
    <button onclick="switchSettingsTab('groups')" class="flex-1 py-2 rounded-lg text-sm font-semibold transition \${settingsTab==='groups'?'bg-white text-blue-700 shadow':'text-gray-500 hover:text-gray-700'}"><i class="fas fa-layer-group mr-1.5"></i>상위 카테고리 (그룹)</button>
  </div>\`;
  if(settingsTab==='categories'){
    const assigned=new Set(editCategories.flatMap(c=>c.products));
    const unassigned=allProducts.filter(p=>!assigned.has(p));
    // order 기준 정렬 (없으면 인덱스 순)
    const sortedCats=[...editCategories].sort((a,b)=>(a.order??99)-(b.order??99));
    body.innerHTML=tabHtml+\`<div class="space-y-4">
      <div><p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미분류 상품</p>
        <div id="unassigned-pool" class="min-h-12 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-1"
          ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropToUnassigned(event)">
          \${unassigned.length===0?'<span class="text-xs text-gray-400">모든 상품이 카테고리에 배정됨</span>':
            unassigned.map(p=>\`<span class="product-chip unassigned" draggable="true" ondragstart="dragStart(event,'\${p}','__none__')">\${p}</span>\`).join('')}
        </div>
      </div>
      <div class="space-y-3" id="cat-list">\${sortedCats.map((cat,idx)=>renderCatCard(cat,idx,allProducts,sortedCats.length)).join('')}</div>
      <button onclick="addCategory()" class="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition">
        <i class="fas fa-plus mr-2"></i>카테고리 추가
      </button>
    </div>\`;
  } else {
    const assignedCatIds=new Set(editGroups.flatMap(g=>g.categoryIds));
    const unassignedCats=editCategories.filter(c=>!assignedCatIds.has(c.id));
    body.innerHTML=tabHtml+\`<div class="space-y-4">
      <p class="text-xs text-gray-500">카테고리를 드래그하거나 선택하여 상위 그룹에 배정합니다.</p>
      <div><p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미배정 카테고리</p>
        <div id="unassigned-cat-pool" class="min-h-12 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-2"
          ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropCatToUnassigned(event)">
          \${unassignedCats.length===0?'<span class="text-xs text-gray-400">모든 카테고리가 그룹에 배정됨</span>':
            unassignedCats.map(c=>\`<span class="product-chip assigned" style="background:\${c.color};border-color:\${c.color}" draggable="true" ondragstart="dragCatStart(event,'\${c.id}','__none__')">\${c.name}</span>\`).join('')}
        </div>
      </div>
      <div class="space-y-3" id="grp-list">\${editGroups.map((g,idx)=>renderGroupCard(g,idx)).join('')}</div>
      <button onclick="addGroup()" class="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-purple-300 hover:text-purple-500 transition">
        <i class="fas fa-plus mr-2"></i>상위 카테고리(그룹) 추가
      </button>
    </div>\`;
  }
}

function renderCatCard(cat,idx,allProducts,totalCats){
  const ap=allProducts||[];
  const total=totalCats||editCategories.length;
  // 전체 카테고리에서 이미 배정된 상품 집합 (이 카테고리 포함)
  const allAssigned=new Set(editCategories.flatMap(c=>c.products));
  // 드롭다운에 표시할 상품: 아직 어떤 카테고리에도 배정 안 됐거나 이 카테고리 소속인 것
  const available=ap.filter(p=>!allAssigned.has(p)||cat.products.includes(p));
  // 드롭다운은 이 카테고리에 없는 것만 (이미 자신에 있으면 제외)
  const selectable=available.filter(p=>!cat.products.includes(p));
  const curOrder=cat.order??idx+1;
  return \`<div class="cat-card" id="catcard_\${cat.id}">
    <div class="cat-header bg-gray-50" onclick="toggleCatCard('\${cat.id}')">
      <!-- 순서 컨트롤 -->
      <div class="flex items-center gap-1 flex-shrink-0 mr-1" onclick="event.stopPropagation()">
        <div class="flex flex-col gap-0.5">
          <button onclick="moveCatUp('\${cat.id}')" class="w-5 h-4 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition \${idx===0?'opacity-25 pointer-events-none':''}" title="위로">
            <i class="fas fa-caret-up text-xs"></i>
          </button>
          <button onclick="moveCatDown('\${cat.id}')" class="w-5 h-4 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition \${idx===total-1?'opacity-25 pointer-events-none':''}" title="아래로">
            <i class="fas fa-caret-down text-xs"></i>
          </button>
        </div>
        <input type="number" min="1" max="\${total}" value="\${curOrder}"
          class="w-9 h-7 text-center text-xs font-bold border border-gray-200 rounded-lg bg-white text-blue-700 outline-none focus:border-blue-400"
          onclick="event.stopPropagation()"
          onchange="setCatOrder('\${cat.id}', parseInt(this.value))"
          title="표시 순서 입력 (같은 번호면 기존 항목이 뒤로 밀림)"/>
      </div>
      <div class="cat-color-dot" style="background:\${cat.color}" onclick="event.stopPropagation();showColorPicker('\${cat.id}',event)"></div>
      <input type="text" value="\${cat.name}" class="flex-1 bg-transparent font-semibold text-gray-700 outline-none text-sm" onchange="updateCatName('\${cat.id}',this.value)" onclick="event.stopPropagation()"/>
      <span class="text-xs text-gray-400">\${cat.products.length}개 상품</span>
      <button onclick="event.stopPropagation();removeCategory('\${cat.id}')" class="text-gray-300 hover:text-red-400 ml-2"><i class="fas fa-trash text-xs"></i></button>
      <i class="fas fa-chevron-down text-xs text-gray-400 ml-2" id="catarrow_\${cat.id}"></i>
    </div>
    <div id="catbody_\${cat.id}" class="p-3">
      <div class="min-h-10 border border-dashed border-gray-200 rounded-lg p-2 flex flex-wrap gap-1"
           ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropToCategory(event,'\${cat.id}')">
        \${cat.products.length===0?'<span class="text-xs text-gray-400">상품을 드래그하여 배정하세요</span>':
          cat.products.map(p=>\`<span class="product-chip assigned" style="background:\${cat.color};border-color:\${cat.color}" draggable="true" ondragstart="dragStart(event,'\${p}','\${cat.id}')" onclick="removeProductFromCat('\${cat.id}','\${p}')" title="클릭하여 제거">\${p} <i class="fas fa-times text-xs opacity-70"></i></span>\`).join('')}
      </div>
      <div class="mt-2 flex gap-2">
        <select id="addsel_\${cat.id}" class="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none \${selectable.length===0?'opacity-50':''}">
          <option value="">\${selectable.length===0?'배정 가능한 상품 없음':'+ 상품 추가...'}</option>
          \${selectable.map(p=>\`<option value="\${p}">\${p}</option>\`).join('')}
        </select>
        <button onclick="addProductToCatFromSelect('\${cat.id}')" class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40" \${selectable.length===0?'disabled':''}>추가</button>
      </div>
    </div>
  </div>\`;
}

function renderGroupCard(grp,idx){
  const cats=editCategories.filter(c=>grp.categoryIds.includes(c.id));
  return \`<div class="cat-card" id="grpcard_\${grp.id}">
    <div class="cat-header" style="background:\${grp.color}18" onclick="toggleGrpCard('\${grp.id}')">
      <div class="cat-color-dot" style="background:\${grp.color}" onclick="event.stopPropagation();showGroupColorPicker('\${grp.id}',event)"></div>
      <input type="text" value="\${grp.name}" class="flex-1 bg-transparent font-bold text-gray-800 outline-none text-sm" onchange="updateGroupName('\${grp.id}',this.value)" onclick="event.stopPropagation()"/>
      <span class="text-xs px-2 py-0.5 rounded-full text-white font-medium" style="background:\${grp.color}">\${cats.length}개 카테고리</span>
      <button onclick="event.stopPropagation();removeGroup('\${grp.id}')" class="text-gray-300 hover:text-red-400 ml-2"><i class="fas fa-trash text-xs"></i></button>
      <i class="fas fa-chevron-down text-xs text-gray-400 ml-2" id="grparrow_\${grp.id}"></i>
    </div>
    <div id="grpbody_\${grp.id}" class="p-3">
      <div class="min-h-10 border border-dashed border-gray-200 rounded-lg p-2 flex flex-wrap gap-2"
           ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropCatToGroup(event,'\${grp.id}')">
        \${cats.length===0?'<span class="text-xs text-gray-400">카테고리를 드래그하여 배정하세요</span>':
          cats.map(c=>\`<span class="product-chip assigned" style="background:\${c.color};border-color:\${c.color}" draggable="true" ondragstart="dragCatStart(event,'\${c.id}','\${grp.id}')" onclick="removeCatFromGroup('\${grp.id}','\${c.id}')" title="클릭하여 제거">\${c.name} <i class="fas fa-times text-xs opacity-70"></i></span>\`).join('')}
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

function refreshSettingsBody(){const ap=LOAN?[...new Set(LOAN.records.map(r=>r.p))].sort():[];renderSettingsBody(ap);}
function toggleCatCard(id){const b=document.getElementById('catbody_'+id);const a=document.getElementById('catarrow_'+id);if(!b)return;const h=b.style.display==='none';b.style.display=h?'':'none';if(a)a.style.transform=h?'':'rotate(-90deg)';}
function toggleGrpCard(id){const b=document.getElementById('grpbody_'+id);const a=document.getElementById('grparrow_'+id);if(!b)return;const h=b.style.display==='none';b.style.display=h?'':'none';if(a)a.style.transform=h?'':'rotate(-90deg)';}

function showColorPicker(catId,event){
  event.stopPropagation();const ex=document.getElementById('color-popup');if(ex)ex.remove();
  const cat=editCategories.find(c=>c.id===catId);
  const popup=document.createElement('div');popup.id='color-popup';
  popup.style.cssText='position:fixed;z-index:2000;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,.15);';
  popup.style.left=(event.clientX+10)+'px';popup.style.top=(event.clientY+10)+'px';
  popup.innerHTML=\`<p class="text-xs font-bold text-gray-500 mb-2">색상 선택</p><div class="grid grid-cols-4 gap-2">\${PALETTE.map(c=>\`<div class="color-swatch \${cat&&cat.color===c?'selected':''}" style="background:\${c}" onclick="setCatColor('\${catId}','\${c}')"></div>\`).join('')}</div>\`;
  document.body.appendChild(popup);setTimeout(()=>document.addEventListener('click',()=>popup.remove(),{once:true}),50);
}
function showGroupColorPicker(grpId,event){
  event.stopPropagation();const ex=document.getElementById('color-popup');if(ex)ex.remove();
  const grp=editGroups.find(g=>g.id===grpId);
  const popup=document.createElement('div');popup.id='color-popup';
  popup.style.cssText='position:fixed;z-index:2000;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,.15);';
  popup.style.left=(event.clientX+10)+'px';popup.style.top=(event.clientY+10)+'px';
  popup.innerHTML=\`<p class="text-xs font-bold text-gray-500 mb-2">색상 선택</p><div class="grid grid-cols-4 gap-2">\${GRP_PALETTE.map(c=>\`<div class="color-swatch \${grp&&grp.color===c?'selected':''}" style="background:\${c}" onclick="setGroupColor('\${grpId}','\${c}')"></div>\`).join('')}</div>\`;
  document.body.appendChild(popup);setTimeout(()=>document.addEventListener('click',()=>popup.remove(),{once:true}),50);
}
function setCatColor(catId,color){const cat=editCategories.find(c=>c.id===catId);if(cat){cat.color=color;refreshSettingsBody();}}
function setGroupColor(grpId,color){const g=editGroups.find(g=>g.id===grpId);if(g){g.color=color;refreshSettingsBody();}}
function updateCatName(catId,name){const cat=editCategories.find(c=>c.id===catId);if(cat)cat.name=name;}
function updateGroupName(grpId,name){const g=editGroups.find(g=>g.id===grpId);if(g)g.name=name;}
function removeCategory(catId){if(!confirm('삭제 시 해당 상품들이 미분류로 이동합니다.'))return;editCategories=editCategories.filter(c=>c.id!==catId);reindexCatOrders();refreshSettingsBody();}
function removeGroup(grpId){if(!confirm('그룹을 삭제하면 소속 카테고리들이 미배정으로 이동합니다.'))return;editGroups=editGroups.filter(g=>g.id!==grpId);refreshSettingsBody();}
function addCategory(){
  const maxOrder=editCategories.reduce((m,c)=>Math.max(m,c.order??0),0);
  editCategories.push({id:'c'+Date.now(),name:'새 카테고리',color:PALETTE[editCategories.length%PALETTE.length],order:maxOrder+1,products:[]});
  refreshSettingsBody();
}
function addGroup(){editGroups.push({id:'g'+Date.now(),name:'새 그룹',color:GRP_PALETTE[editGroups.length%GRP_PALETTE.length],categoryIds:[]});refreshSettingsBody();}

// ── 순서 재인덱싱: order 값을 1,2,3... 으로 정리
function reindexCatOrders(){
  const sorted=[...editCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  sorted.forEach((c,i)=>{c.order=i+1;});
}

// ── 숫자 입력 시 자동 밀기 로직
function setCatOrder(catId, newOrder){
  const cat=editCategories.find(c=>c.id===catId);
  if(!cat) return;
  const total=editCategories.length;
  newOrder=Math.max(1,Math.min(newOrder,total)); // 범위 클램프
  const oldOrder=cat.order??1;
  if(newOrder===oldOrder){refreshSettingsBody();return;}
  // 이동 방향에 따라 사이에 있는 항목들 shift
  editCategories.forEach(c=>{
    if(c.id===catId) return;
    const o=c.order??1;
    if(newOrder<oldOrder){
      // 위로 이동: newOrder ~ oldOrder-1 범위 항목들 +1
      if(o>=newOrder && o<oldOrder) c.order=o+1;
    } else {
      // 아래로 이동: oldOrder+1 ~ newOrder 범위 항목들 -1
      if(o>oldOrder && o<=newOrder) c.order=o-1;
    }
  });
  cat.order=newOrder;
  refreshSettingsBody();
}

// ── 위/아래 버튼 이동
function moveCatUp(catId){
  const sorted=[...editCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  const idx=sorted.findIndex(c=>c.id===catId);
  if(idx<=0) return;
  const cur=sorted[idx], prev=sorted[idx-1];
  const tmp=cur.order; cur.order=prev.order; prev.order=tmp;
  refreshSettingsBody();
}
function moveCatDown(catId){
  const sorted=[...editCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  const idx=sorted.findIndex(c=>c.id===catId);
  if(idx<0||idx>=sorted.length-1) return;
  const cur=sorted[idx], next=sorted[idx+1];
  const tmp=cur.order; cur.order=next.order; next.order=tmp;
  refreshSettingsBody();
}
function addProductToCatFromSelect(catId){const sel=document.getElementById('addsel_'+catId);if(!sel||!sel.value)return;const prod=sel.value;editCategories.forEach(c=>{c.products=c.products.filter(p=>p!==prod);});const cat=editCategories.find(c=>c.id===catId);if(cat&&!cat.products.includes(prod))cat.products.push(prod);refreshSettingsBody();}
function addCatToGroupFromSelect(grpId){const sel=document.getElementById('grpaddsel_'+grpId);if(!sel||!sel.value)return;const catId=sel.value;editGroups.forEach(g=>{g.categoryIds=g.categoryIds.filter(id=>id!==catId);});const g=editGroups.find(g=>g.id===grpId);if(g&&!g.categoryIds.includes(catId))g.categoryIds.push(catId);refreshSettingsBody();}
function removeProductFromCat(catId,prod){const cat=editCategories.find(c=>c.id===catId);if(cat){cat.products=cat.products.filter(p=>p!==prod);refreshSettingsBody();}}
function removeCatFromGroup(grpId,catId){const g=editGroups.find(g=>g.id===grpId);if(g){g.categoryIds=g.categoryIds.filter(id=>id!==catId);refreshSettingsBody();}}

let dragData=null;
function dragStart(event,product,fromCatId){dragData={product,fromCatId};event.dataTransfer.effectAllowed='move';}
function dropToCategory(event,toCatId){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragData)return;const{product,fromCatId}=dragData;
  // 기존 모든 카테고리에서 해당 상품 제거 (중복 방지)
  editCategories.forEach(c=>{c.products=c.products.filter(p=>p!==product);});
  // 목적 카테고리에만 추가
  const t=editCategories.find(c=>c.id===toCatId);if(t)t.products.push(product);dragData=null;refreshSettingsBody();}
function dropToUnassigned(event){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragData)return;const{product,fromCatId}=dragData;if(fromCatId!=='__none__'){const f=editCategories.find(c=>c.id===fromCatId);if(f)f.products=f.products.filter(p=>p!==product);}dragData=null;refreshSettingsBody();}

let dragCatData=null;
function dragCatStart(event,catId,fromGrpId){dragCatData={catId,fromGrpId};event.dataTransfer.effectAllowed='move';}
function dropCatToGroup(event,toGrpId){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragCatData)return;const{catId,fromGrpId}=dragCatData;if(fromGrpId!=='__none__'){const f=editGroups.find(g=>g.id===fromGrpId);if(f)f.categoryIds=f.categoryIds.filter(id=>id!==catId);}const t=editGroups.find(g=>g.id===toGrpId);if(t&&!t.categoryIds.includes(catId))t.categoryIds.push(catId);dragCatData=null;refreshSettingsBody();}
function dropCatToUnassigned(event){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragCatData)return;const{catId,fromGrpId}=dragCatData;if(fromGrpId!=='__none__'){const f=editGroups.find(g=>g.id===fromGrpId);if(f)f.categoryIds=f.categoryIds.filter(id=>id!==catId);}dragCatData=null;refreshSettingsBody();}

function saveCategories(){
  // 저장 전 order 재정리 (1,2,3... 연속으로)
  reindexCatOrders();
  CATEGORIES=JSON.parse(JSON.stringify(editCategories));
  GROUPS=JSON.parse(JSON.stringify(editGroups));
  saveCatsToStorage();closeSettings();renderPage();
}
function resetCategories(){if(!confirm('카테고리 및 그룹을 기본값으로 초기화하시겠습니까?'))return;editCategories=JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));editGroups=JSON.parse(JSON.stringify(DEFAULT_GROUPS));refreshSettingsBody();}

// ==================== 시작 ====================
init();
</script>
</body>
</html>`)
})

export default app
