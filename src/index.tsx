import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ==================== Supabase 설정 ====================
const SUPA_URL = 'https://kgowfgddyaubsuhdgrny.supabase.co'
const SUPA_KEY = 'sb_publishable_ijWcNHDuoVpsemWN7lZ-0g_Ht8bwh-s'
const SUPA_HEADERS = {
  'apikey': SUPA_KEY,
  'Authorization': 'Bearer ' + SUPA_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
}

const app = new Hono()

// CORS 설정
app.use('/api/*', cors())

// ==================== Supabase 프록시 API ====================
// GET /api/db/months  → Supabase months 테이블 전체 조회
app.get('/api/db/months', async (c) => {
  try {
    const res = await fetch(SUPA_URL + '/rest/v1/months?select=key,data&order=key.asc', {
      headers: SUPA_HEADERS
    })
    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: err }, 500)
    }
    const rows = await res.json() as { key: string; data: unknown }[]
    // { key: data, key2: data2, ... } 형태로 변환
    const result: Record<string, unknown> = {}
    for (const row of rows) result[row.key] = row.data
    return c.json(result)
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})

// POST /api/db/months  → 전체 months 딕셔너리 upsert (저장)
app.post('/api/db/months', async (c) => {
  try {
    const body = await c.req.json() as Record<string, unknown>
    // 각 키를 개별 upsert (Supabase bulk upsert)
    const rows = Object.entries(body).map(([key, data]) => ({ key, data }))
    if (rows.length === 0) return c.json({ ok: true })
    const res = await fetch(SUPA_URL + '/rest/v1/months', {
      method: 'POST',
      headers: { ...SUPA_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows)
    })
    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: err }, 500)
    }
    return c.json({ ok: true, count: rows.length })
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})

// DELETE /api/db/months/:key  → 특정 월 삭제
app.delete('/api/db/months/:key', async (c) => {
  try {
    const key = c.req.param('key')
    const res = await fetch(SUPA_URL + '/rest/v1/months?key=eq.' + key, {
      method: 'DELETE',
      headers: SUPA_HEADERS
    })
    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: err }, 500)
    }
    return c.json({ ok: true })
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})
app.get('/contract_202607.json', (c) => { return c.body("{\"base_date\":\"2026-07-31\",\"records\":[{\"p\":\"\ub808\uc774\ub514\ub860\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":48750000.0,\"appraised\":343100000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":119269000.0,\"appraised\":245000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":86160000.0,\"appraised\":140000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":130074000.0,\"appraised\":437500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":12000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":165180000.0,\"appraised\":440000000.0},{\"p\":\"OP\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":285430000.0,\"appraised\":472500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":23000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":125451438.0,\"appraised\":310000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":344069000.0,\"appraised\":595000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":79580000.0,\"appraised\":200500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":9000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-31\",\"loanAmt\":244970000.0,\"appraised\":378000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":129777000.0,\"appraised\":185000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":145667000.0,\"appraised\":480500000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":4000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":30000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":339470000.0,\"appraised\":530000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":100000000.0,\"r\":17.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":207278000.0,\"appraised\":335000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":630854000.0,\"appraised\":1112000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":247921000.0,\"appraised\":360000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":45887000.0,\"appraised\":182000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":193146000.0,\"appraised\":310000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":25000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":98980000.0,\"appraised\":155000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":389577000.0,\"appraised\":710000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":6500000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":64078000.0,\"appraised\":110000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":486232000.0,\"appraised\":820000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":25000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":180750000.0,\"appraised\":370000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":322910000.0,\"appraised\":505000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":79730000.0,\"appraised\":147500000.0},{\"p\":\"\ub808\uc774\ub514\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":247517000.0,\"appraised\":355000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":84839000.0,\"appraised\":213800000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":12000000.0,\"r\":18.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":81433006.0,\"appraised\":120000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-30\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":1000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":378670000.0,\"appraised\":535000000.0},{\"p\":\"OP\ub860\",\"amt\":12000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":12000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":89837000.0,\"appraised\":160000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":192170000.0,\"appraised\":535000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":250812000.0,\"appraised\":420000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":7000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":104300000.0,\"appraised\":222000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":11000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":134930832.0,\"appraised\":277900000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":105800000.0,\"appraised\":187300000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":15.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":184577000.0,\"appraised\":467000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":19963000.0,\"appraised\":60000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":355005000.0,\"appraised\":740000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":49810000.0,\"appraised\":101000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":195070000.0,\"appraised\":325000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":9902261.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":239057000.0,\"appraised\":360900000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":6000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":26600000.0,\"appraised\":54000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":27000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-29\",\"loanAmt\":65880000.0,\"appraised\":144100000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":12000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":78710000.0,\"appraised\":122500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":82900000.0,\"appraised\":137500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":1153430000.0,\"appraised\":1720000000.0},{\"p\":\"OP\ub860\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":356224000.0,\"appraised\":575000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":487410000.0,\"appraised\":785000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":90021000.0,\"appraised\":165000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":160000000.0,\"appraised\":320000000.0},{\"p\":\"OP\ub860\",\"amt\":4000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":91909000.0,\"appraised\":140000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":110166000.0,\"appraised\":270000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":283750000.0,\"appraised\":410000000.0},{\"p\":\"OP\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":108687000.0,\"appraised\":280500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":290390000.0,\"appraised\":415000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":54751000.0,\"appraised\":85000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-28\",\"loanAmt\":110893000.0,\"appraised\":205000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\ub77c\uc774\ud504\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":136007000.0,\"appraised\":386200000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":343880000.0,\"appraised\":535000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\ub77c\uc774\ud504\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":116007000.0,\"appraised\":386200000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":144680000.0,\"appraised\":245000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":222031000.0,\"appraised\":415000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":92540000.0,\"appraised\":139700000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":196530000.0,\"appraised\":260000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":139280000.0,\"appraised\":882000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":50000000.0,\"r\":15.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":97000000.0,\"appraised\":155000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":12908000.0,\"appraised\":102000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":91636000.0,\"appraised\":150000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":8176662.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":65920259.0,\"appraised\":95000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":9462740.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-27\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":11.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":325930000.0,\"appraised\":750000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":194167000.0,\"appraised\":320000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":145760000.0,\"appraised\":238400000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":107760000.0,\"appraised\":195000000.0},{\"p\":\"OP\ub860\",\"amt\":10000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":24000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":121720000.0,\"appraised\":175000000.0},{\"p\":\"\ud50c\ub7ec\uc2a4\ub860\",\"amt\":30000000.0,\"r\":18.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":304602000.0,\"appraised\":500000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":121380000.0,\"appraised\":194400000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":25000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":100395000.0,\"appraised\":192500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":88231000.0,\"appraised\":188000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":18240000.0,\"appraised\":53000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":344331000.0,\"appraised\":432500000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":116787000.0,\"appraised\":382500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":158562000.0,\"appraised\":292500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":264831000.0,\"appraised\":425000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":170000000.0,\"appraised\":489324750.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-24\",\"loanAmt\":198500000.0,\"appraised\":267500000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":140698000.0,\"appraised\":187500000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":174506000.0,\"appraised\":240000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":236231000.0,\"appraised\":320000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":222317000.0,\"appraised\":320000000.0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":62656700.0,\"appraised\":100000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":210720000.0,\"appraised\":336000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":8000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":143630000.0,\"appraised\":230000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":511645764.0,\"appraised\":1260000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":25000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":204581000.0,\"appraised\":322500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":89600000.0,\"appraised\":138000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":206269594.0,\"appraised\":512500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-23\",\"loanAmt\":107100000.0,\"appraised\":172500000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":18000000.0,\"r\":19.9,\"a\":\"\uc5d0\uc2a4\uc5e0\uc528\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud050\ube0c\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":25000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":167037000.0,\"appraised\":311400000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":120950000.0,\"appraised\":225000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":7000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":207037000.0,\"appraised\":415000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":182821000.0,\"appraised\":247500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":125160000.0,\"appraised\":199000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":201601000.0,\"appraised\":300000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":130035000.0,\"appraised\":380000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":121153000.0,\"appraised\":192700000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":200291000.0,\"appraised\":488000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":279243000.0,\"appraised\":452500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":184567000.0,\"appraised\":349000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":112679000.0,\"appraised\":202500000.0},{\"p\":\"OP\ub860\",\"amt\":1500000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":27500000.0,\"appraised\":174000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":82723000.0,\"appraised\":153900000.0},{\"p\":\"OP\ub860\",\"amt\":1500000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":209666000.0,\"appraised\":403200000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-22\",\"loanAmt\":116501000.0,\"appraised\":179000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":101800000.0,\"appraised\":167000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc5d0\uc2a4\uc5e0\uc528\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":22000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":247938556.0,\"appraised\":400000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":11000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":108190000.0,\"appraised\":317500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":8000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":72870918.0,\"appraised\":110000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":101170000.0,\"appraised\":167500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":205090000.0,\"appraised\":287500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":103120000.0,\"appraised\":162500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":171403000.0,\"appraised\":290000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":40000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":267216000.0,\"appraised\":450000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":8000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":12000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":138866000.0,\"appraised\":207500000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":12000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":6000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":265028000.0,\"appraised\":372500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":207860000.0,\"appraised\":335000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":90000000.0,\"r\":12.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":119870000.0,\"appraised\":230000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":305878000.0,\"appraised\":395000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":614602000.0,\"appraised\":1000000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":136702000.0,\"appraised\":255000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":4000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-21\",\"loanAmt\":78720000.0,\"appraised\":152000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":222222000.0,\"appraised\":677500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":8000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":57620000.0,\"appraised\":265000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":14000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud14c\uc77c\ub860\",\"amt\":7500000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":13000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":558359000.0,\"appraised\":850000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":75000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":140264000.0,\"appraised\":227500000.0},{\"p\":\"N\ub860\",\"amt\":16000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":284015000.0,\"appraised\":495000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":93761000.0,\"appraised\":177500000.0},{\"p\":\"\ub2e4\uc774\ub809\ud2b8\ub860(W)\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":13000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":87320000.0,\"appraised\":212200000.0},{\"p\":\"OP\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":48690000.0,\"appraised\":115000000.0},{\"p\":\"\ub2e4\uc774\ub809\ud2b8\ub860(W)\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":78812000.0,\"appraised\":207800000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":147860000.0,\"appraised\":216000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":120553000.0,\"appraised\":215000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-20\",\"loanAmt\":443996000.0,\"appraised\":680000000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud050\ube0c\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":449130000.0,\"appraised\":685000000.0},{\"p\":\"OP\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"N\ub860\",\"amt\":25000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":20000000.0,\"appraised\":50000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":30000000.0,\"r\":11.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":288110000.0,\"appraised\":892500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":133470000.0,\"appraised\":179000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":219766000.0,\"appraised\":330000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":25000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":385852000.0,\"appraised\":650000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":170000000.0,\"r\":12.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":170000000.0,\"appraised\":368330000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":19.0,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":180845940.0,\"appraised\":260000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":25833000.0,\"appraised\":55000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":57236176.0,\"r\":19.9,\"a\":\"\ub77c\uc774\ud504\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":143817176.0,\"appraised\":195000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":148764000.0,\"appraised\":326770000.0},{\"p\":\"\ud14c\uc77c\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":15.0,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":350662671.0,\"appraised\":540000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-16\",\"loanAmt\":109720000.0,\"appraised\":162500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":80000000.0,\"r\":9.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":282096000.0,\"appraised\":485000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":193040000.0,\"appraised\":300000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":19000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud14c\uc77c\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":300000000.0,\"r\":12.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":582443578.0,\"appraised\":940000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":432937000.0,\"appraised\":675000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":17.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub808\uc774\ub514\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":116950000.0,\"appraised\":207500000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":6000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":335300000.0,\"appraised\":485000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":52213000.0,\"appraised\":82500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":102335000.0,\"appraised\":160000000.0},{\"p\":\"\ub2e4\uc774\ub809\ud2b8\ub860(W)\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":81390000.0,\"appraised\":136000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-15\",\"loanAmt\":33220628.0,\"appraised\":99000000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":16000000.0,\"r\":17.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":8000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":183146000.0,\"appraised\":310000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":85530000.0,\"appraised\":130000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":12000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":289470000.0,\"appraised\":408000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":189132000.0,\"appraised\":297000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"N\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":316530000.0,\"appraised\":430000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":107900000.0,\"appraised\":287500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":221000000.0,\"appraised\":307500000.0},{\"p\":\"\ud050\ube0c\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":204015230.0,\"appraised\":555000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":175992000.0,\"appraised\":265000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":52710000.0,\"appraised\":92500000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":357000000.0,\"appraised\":490000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":20000000.0,\"appraised\":69000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":51869000.0,\"appraised\":126100000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":185360000.0,\"appraised\":290000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":265883699.0,\"appraised\":425000000.0},{\"p\":\"OP\ub860\",\"amt\":11000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":15000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-14\",\"loanAmt\":44850436.0,\"appraised\":103500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":9.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":420790000.0,\"appraised\":1175000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":337190000.0,\"appraised\":620000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":18000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":369574000.0,\"appraised\":560000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":10000000.0,\"appraised\":37000000.0},{\"p\":\"\ub2e4\uc774\ub809\ud2b8\ub860(W)\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":184894956.0,\"appraised\":443000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":88288500.0,\"appraised\":465000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":62703000.0,\"appraised\":115000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":198450000.0,\"appraised\":335000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":30000000.0,\"appraised\":95000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":177530000.0,\"appraised\":270000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":119458451.0,\"appraised\":180000000.0},{\"p\":\"OP\ub860\",\"amt\":22000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":25000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":37000000.0,\"r\":17.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":109930000.0,\"appraised\":245000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-13\",\"loanAmt\":30000000.0,\"appraised\":58000000.0},{\"p\":\"\ub808\uc774\ub514\ub860\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":239508000.0,\"appraised\":457000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":7000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"N\ub860(\ud558\uc774\ube0c\ub9ac\ub4dc)\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":9000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":59103356.0,\"appraised\":151000000.0},{\"p\":\"\ud14c\uc77c\ub860\",\"amt\":16000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":67000000.0,\"appraised\":119000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":247994000.0,\"appraised\":370000000.0},{\"p\":\"OP\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":254000000.0,\"appraised\":390000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":23000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":48770000.0,\"appraised\":70000000.0},{\"p\":\"\ud050\ube0c\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":165027000.0,\"appraised\":245000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":70000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":362812000.0,\"appraised\":855000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":10000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":40714121.0,\"appraised\":142500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":253236000.0,\"appraised\":480000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":18943330.0,\"r\":17.9,\"a\":\"\ub77c\uc774\ud504\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":208724835.0,\"appraised\":337000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":14221505.0,\"r\":17.9,\"a\":\"\ub77c\uc774\ud504\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":208724835.0,\"appraised\":337000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":11000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":4000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":146701000.0,\"appraised\":312300000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":12000000.0,\"r\":16.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-10\",\"loanAmt\":87066000.0,\"appraised\":140000000.0},{\"p\":\"OP\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":40000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":69760000.0,\"appraised\":155000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":77984000.0,\"appraised\":152500000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":119070000.0,\"appraised\":170000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":90387000.0,\"appraised\":130000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":2000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":266764000.0,\"appraised\":360000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":51770000.0,\"appraised\":100000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":141440000.0,\"appraised\":225000000.0},{\"p\":\"N\ub860\",\"amt\":23000000.0,\"r\":18.9,\"a\":\"\uc5d0\uc2a4\uc5e0\uc528\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":264740000.0,\"appraised\":482000000.0},{\"p\":\"N\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":84380000.0,\"appraised\":181900000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":40200000.0,\"appraised\":75000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":4000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-09\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":7000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":19.5,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":114740000.0,\"appraised\":167500000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":30000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":100590000.0,\"appraised\":235000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":15000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":240425000.0,\"appraised\":365000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":12000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":232502725.0,\"appraised\":595800000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":6000000.0,\"r\":19.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":36000000.0,\"appraised\":56000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":160000000.0,\"appraised\":392500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":412730000.0,\"appraised\":605000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":47997000.0,\"appraised\":112000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":55000000.0,\"r\":12.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":152516000.0,\"appraised\":260000000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":11.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":364660000.0,\"appraised\":750000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":12000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":109180000.0,\"appraised\":188000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":187850000.0,\"appraised\":330000000.0},{\"p\":\"OP\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":19.0,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":104449209.0,\"appraised\":167500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uace0\uac1d\ucd94\ucc9c\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":381896000.0,\"appraised\":555000000.0},{\"p\":\"N\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":20000000.0,\"appraised\":47800000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":7000000.0,\"r\":16.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":140208000.0,\"appraised\":200000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"CALL\uc778\uc785\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":388390000.0,\"appraised\":495000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":285650000.0,\"appraised\":375000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":255800000.0,\"appraised\":420000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":27000000.0,\"r\":16.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-08\",\"loanAmt\":170580000.0,\"appraised\":489194850.0},{\"p\":\"N\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":4000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":133514000.0,\"appraised\":252500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":25000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":55186000.0,\"appraised\":105000000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":149000000.0,\"appraised\":334900000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":15000000.0,\"r\":19.5,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":353980000.0,\"appraised\":500000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":18000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":321000000.0,\"appraised\":770000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":8000000.0,\"r\":19.5,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":56910000.0,\"appraised\":114600000.0},{\"p\":\"\ud14c\uc77c\ub860\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":181178000.0,\"appraised\":277500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":13.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":403783000.0,\"appraised\":675000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":18000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":14000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":133523000.0,\"appraised\":257400000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":237922753.0,\"appraised\":595000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":8000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":29030000.0,\"appraised\":82250000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":12000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":40000000.0,\"r\":14.9,\"a\":\"\uace0\uac1d\ucd94\ucc9c\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":111067000.0,\"appraised\":212500000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-07\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":153990000.0,\"appraised\":365000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":14000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":13000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":15.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":149190000.0,\"appraised\":355000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":103190000.0,\"appraised\":202000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":173830000.0,\"appraised\":255000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":2000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":6000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":22050000.0,\"appraised\":38000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":204697000.0,\"appraised\":565000000.0},{\"p\":\"OP\ub860\",\"amt\":5000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":15.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":150724000.0,\"appraised\":271000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":18000000.0,\"r\":19.9,\"a\":\"\uc5d0\uc2a4\uc5e0\uc528\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":109120000.0,\"appraised\":165000000.0},{\"p\":\"N\ub860\",\"amt\":30000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":1000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":475899000.0,\"appraised\":690000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":85204000.0,\"appraised\":142500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\ud50c\ub7ec\uc2a4\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":316842000.0,\"appraised\":400000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":262142000.0,\"appraised\":447500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":194460000.0,\"appraised\":305000000.0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":10.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":329774085.0,\"appraised\":535000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-06\",\"loanAmt\":321590000.0,\"appraised\":550000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":76970000.0,\"appraised\":117000000.0},{\"p\":\"OP\ub860\",\"amt\":2000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2e4\uc774\ub809\ud2b8\ub860(W)\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":13000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":11000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":153337000.0,\"appraised\":371500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":108770000.0,\"appraised\":160000000.0},{\"p\":\"\ub2e4\uc774\ub809\ud2b8\ub860(W)\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":30000000.0,\"r\":12.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":166140500.0,\"appraised\":290000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":54407000.0,\"appraised\":85000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":363407685.0,\"appraised\":570000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":30000000.0,\"appraised\":100000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":11.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":354660000.0,\"appraised\":750000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":89926000.0,\"appraised\":1282050000.0},{\"p\":\"N\ub860(\ud558\uc774\ube0c\ub9ac\ub4dc)\",\"amt\":5000000.0,\"r\":19.9,\"a\":\"\uc0c1\uc0c1\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":5000000.0,\"r\":18.9,\"a\":\"\uc5d0\uc2a4\uc5e0\uc528\ub300\ubd80\uc911\uac1c\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":438181000.0,\"appraised\":735000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":57570000.0,\"appraised\":100000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":61210000.0,\"appraised\":155700000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":24000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":102800000.0,\"appraised\":172500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":20000000.0,\"r\":16.9,\"a\":\"\ud540\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-03\",\"loanAmt\":362192000.0,\"appraised\":542500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":73800000.0,\"appraised\":173000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":7000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":172850000.0,\"appraised\":344000000.0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":263790000.0,\"appraised\":420000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":285830000.0,\"appraised\":450000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":107340000.0,\"appraised\":167500000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":7000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":64860000.0,\"appraised\":100000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":40000000.0,\"r\":14.9,\"a\":\"\uc54c\ub2e4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":139610000.0,\"appraised\":345000000.0},{\"p\":\"\ub2f4\ubcf4\ub860(\uc9c0\ubd84\ub300\ucd9c)\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":190803520.68,\"appraised\":516669250.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":150280000.0,\"appraised\":215000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":30000000.0,\"appraised\":146500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":20000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":970000000.0,\"appraised\":1675000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":30000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":243917000.0,\"appraised\":495000000.0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":109660000.0,\"appraised\":170000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":100000000.0,\"r\":10.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":100000000.0,\"appraised\":222500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":41171089.0,\"r\":17.5,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":151167089.0,\"appraised\":222500000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":30000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":95160000.0,\"appraised\":290000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":14.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":131500000.0,\"appraised\":240000000.0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":10000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":257300000.0,\"appraised\":526400000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":15.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-02\",\"loanAmt\":346630000.0,\"appraised\":570000000.0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":4000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":277090000.0,\"appraised\":370000000.0},{\"p\":\"OP\ub860\",\"amt\":7000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":20000000.0,\"r\":19.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc2a4\ud0c0\ub860\",\"amt\":12000000.0,\"r\":19.9,\"a\":\"\uc624\ucf00\uc774\ub2e4\uc774\ub809\ud2b8\ub300\ubd80\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":5441020.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":8000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":5059989.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":10000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":14.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":105500092.0,\"appraised\":254000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":25000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":101431000.0,\"appraised\":173000000.0},{\"p\":\"OP\ub860\",\"amt\":3000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":20000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":129503907.0,\"appraised\":244000000.0},{\"p\":\"\ub2f4\ubcf4\ub860\",\"amt\":10000000.0,\"r\":16.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":378805000.0,\"appraised\":590000000.0},{\"p\":\"OP\ub860\",\"amt\":1000000.0,\"r\":19.5,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":15000000.0,\"r\":19.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22c\ub860\",\"amt\":11000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":1000000.0,\"r\":17.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"OP\ub860\",\"amt\":11000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\uc624\ud22cN\ub860\",\"amt\":1000000.0,\"r\":18.9,\"a\":\"\uc6f0\ucef4\ud50c\ub7ab\ud3fc\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":0,\"appraised\":0},{\"p\":\"\ud1a0\ub9c8\ud1a0\ud1a0\ud0c8\ub860\",\"amt\":15000000.0,\"r\":16.9,\"a\":\"\ubcf8\uc0ac\uc601\uc5c5\",\"d\":0,\"dt\":\"2026-07-01\",\"loanAmt\":224674486.0,\"appraised\":340000000.0}],\"count\":493,\"uploaded_at\":\"2026. 08. 10.\"}", 200, {'Content-Type': 'application/json; charset=utf-8'}); })

app.get('/', (c) => {
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  c.header('Pragma', 'no-cache');
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>APL 마감 보고 대시보드</title>
<script src="/static/vendor/tailwind.min.js"></script>
<script src="/static/vendor/chart.min.js"></script>
<script src="/static/vendor/xlsx.full.min.js"></script>
<link rel="stylesheet" href="/static/vendor/fa.min.css"/>
<style>

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
.sb-wip{margin-left:auto;background:#f59e0b;color:#1a1a1a;font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;flex-shrink:0;letter-spacing:.3px;}
.sb-updating{margin-left:auto;background:#3b82f6;color:#fff;font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;flex-shrink:0;letter-spacing:.3px;}
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
.chart-wrap-xl{position:relative;height:380px;}
.chart-wrap-sm{position:relative;height:200px;}
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

<!-- ===== 로그인 오버레이 ===== -->
<div id="login-overlay" style="display:flex;position:fixed;inset:0;z-index:9999;background:linear-gradient(135deg,#1a3050 0%,#1e3a5f 60%,#2d5a9e 100%);align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:20px;box-shadow:0 25px 60px rgba(0,0,0,.35);width:100%;max-width:400px;padding:40px 36px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;background:linear-gradient(135deg,#1e3a5f,#2d5a9e);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
        <i class="fas fa-landmark" style="color:#fff;font-size:22px;"></i>
      </div>
      <h2 style="font-size:20px;font-weight:800;color:#1e3a5f;margin-bottom:4px;">APL 마감 보고 대시보드</h2>
      <p style="font-size:13px;color:#6b7a99;">계속하려면 로그인하세요</p>
    </div>

    <div id="login-error" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:10px 14px;margin-bottom:16px;color:#dc2626;font-size:13px;text-align:center;">
      <i class="fas fa-exclamation-circle" style="margin-right:6px;"></i><span id="login-error-msg">아이디 또는 비밀번호가 올바르지 않습니다.</span>
    </div>

    <form onsubmit="doLogin();return false;" autocomplete="on">
    <div style="margin-bottom:14px;">
      <label style="display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;">아이디</label>
      <input id="login-id" type="text" name="username" placeholder="아이디 입력" autocomplete="username"
        style="width:100%;border:1.5px solid #d1d5db;border-radius:10px;padding:11px 14px;font-size:14px;outline:none;transition:border .2s;"
        onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#d1d5db'">
    </div>
    <div style="margin-bottom:22px;">
      <label style="display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;">비밀번호</label>
      <div style="position:relative;">
        <input id="login-pw" type="password" name="password" placeholder="비밀번호 입력" autocomplete="current-password"
          style="width:100%;border:1.5px solid #d1d5db;border-radius:10px;padding:11px 42px 11px 14px;font-size:14px;outline:none;transition:border .2s;"
          onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#d1d5db'">
        <button type="button" onclick="togglePwVisible()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;" tabindex="-1">
          <i id="pw-eye-icon" class="fas fa-eye"></i>
        </button>
      </div>
    </div>
    <button type="submit" id="login-btn"
      style="width:100%;padding:13px;background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s;"
      onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">
      로그인
    </button>
    </form>
  </div>
</div>

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
    <div class="flex items-center gap-2 pl-3 border-l border-white border-opacity-20">
      <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
        <i class="fas fa-user text-sm"></i>
      </div>
      <div class="text-right">
        <p class="text-xs text-blue-200">로그인</p>
        <p class="text-sm font-bold" id="hdr-username">-</p>
      </div>
      <button onclick="doLogout()" class="ml-1 px-2.5 py-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-xs text-blue-100 transition-all" title="로그아웃">
        <i class="fas fa-sign-out-alt"></i>
      </button>
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

    <!-- 분석 기준월 셀렉터 -->
    <div class="px-3 py-2.5 border-b border-white border-opacity-10">
      <p class="text-xs text-blue-300 mb-1.5">분석 기준월</p>
      <div id="sb-month-selector" onclick="toggleMonthDropdown()" class="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all">
        <span id="sb-active-month" class="text-white font-bold text-sm">-</span>
        <i id="sb-month-chevron" class="fas fa-chevron-down text-blue-300 text-xs transition-transform duration-200"></i>
      </div>
      <!-- 드롭다운 월 목록 -->
      <div id="sb-month-dropdown" class="hidden mt-1.5 rounded-lg overflow-hidden border border-white border-opacity-10">
        <div id="sb-month-list" class="max-h-48 overflow-y-auto"></div>
      </div>
    </div>

    <!-- 관리팀 필터 -->
    <div class="px-3 py-2.5 border-b border-white border-opacity-10">
      <p class="text-xs text-blue-300 mb-1.5">관리팀 필터</p>
      <select id="sb-mgmt-select" onchange="onMgmtTeamFilter(this.value)"
        class="w-full rounded-lg px-2 py-1.5 text-sm bg-white bg-opacity-10 text-white border border-white border-opacity-20 cursor-pointer hover:bg-opacity-20 transition-all"
        style="appearance:none;-webkit-appearance:none;">
        <option value="" style="background:#1e3a5f;color:#fff;">전체 관리팀</option>
      </select>
    </div>

    <!-- 메뉴 -->
    <div class="flex-1 py-3">
      <div class="sb-section">분석</div>
      <div class="sb-item active" data-page="overview" onclick="goPage('overview')">
        <i class="sb-icon fas fa-tachometer-alt"></i>
        <span class="sb-label">종합 개요</span>
        <span class="sb-wip">준비중</span>
      </div>
      <div class="sb-item" data-page="balance" onclick="goPage('balance')">
        <i class="sb-icon fas fa-layer-group"></i>
        <span class="sb-label">잔고 구성비</span>
      </div>
      <div class="sb-item" data-page="product" onclick="goPage('product')">
        <i class="sb-icon fas fa-tags"></i>
        <span class="sb-label">상품 분석</span>
        <span class="sb-wip">준비중</span>
      </div>
      <div class="sb-item" data-page="agent" onclick="goPage('agent')">
        <i class="sb-icon fas fa-users"></i>
        <span class="sb-label">에이전트 분석</span>
      </div>
      <div class="sb-item" data-page="newloan" onclick="goPage('newloan')">
        <i class="sb-icon fas fa-file-signature"></i>
        <span class="sb-label">신규대출 현황</span>
        <span class="sb-badge" id="sb-newloan-badge">-</span>
      </div>
      <div class="sb-item" data-page="overdue" onclick="goPage('overdue')">
        <i class="sb-icon fas fa-exclamation-triangle"></i>
        <span class="sb-label">연체 현황</span>
        <span class="sb-updating">업데이트 중</span>
      </div>
      <div class="sb-item" data-page="overdue-change" onclick="goPage('overdue-change')">
        <i class="sb-icon fas fa-exchange-alt"></i>
        <span class="sb-label">연체 변동 분석</span>
      </div>
      <div class="sb-item" data-page="vintage" onclick="goPage('vintage')">
        <i class="sb-icon fas fa-chart-bar"></i>
        <span class="sb-label">연체 빈티지</span>
      </div>
      <div class="sb-item" data-page="realestate" onclick="goPage('realestate')">
        <i class="sb-icon fas fa-building"></i>
        <span class="sb-label">부동산 현황</span>
      </div>
      <div class="sb-item" data-page="trend" onclick="goPage('trend')">
        <i class="sb-icon fas fa-chart-line"></i>
        <span class="sb-label">월별 추이</span>
        <span class="sb-wip">준비중</span>
      </div>

      <div class="sb-divider"></div>
      <div class="sb-section">데이터 관리</div>
      <div class="sb-item" data-page="upload" onclick="goPage('upload')">
        <i class="sb-icon fas fa-upload"></i>
        <span class="sb-label">결산자료 업로드</span>
        <span class="sb-badge" id="sb-month-count">0</span>
      </div>
      <div class="sb-item" data-page="contract" onclick="goPage('contract')">
        <i class="sb-icon fas fa-file-contract"></i>
        <span class="sb-label">계약리스트 업로드</span>
        <span class="sb-badge" id="sb-contract-count">0</span>
      </div>

      <div class="sb-divider"></div>
      <div class="sb-section">시스템</div>
      <div class="sb-item" data-page="settings" onclick="goPage('settings')">
        <i class="sb-icon fas fa-cog"></i>
        <span class="sb-label">시스템 설정</span>
      </div>
      <div class="sb-item" data-page="auth" onclick="goPage('auth')">
        <i class="sb-icon fas fa-user-shield"></i>
        <span class="sb-label">권한 설정</span>
      </div>
      <div class="sb-item" data-page="ipallow" onclick="goPage('ipallow')">
        <i class="sb-icon fas fa-shield-alt"></i>
        <span class="sb-label">허용 IP 등록</span>
      </div>
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

<!-- ====== 계약리스트 업로드 모달 ====== -->
<div class="modal-overlay" id="contract-modal">
  <div class="modal upload-modal">
    <div class="modal-header flex items-center justify-between w-full">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50">
          <i class="fas fa-file-contract text-green-600"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-800">계약리스트 업로드</h2>
          <p class="text-xs text-gray-500">당월 신규 계약리스트(xlsx)를 업로드합니다</p>
        </div>
      </div>
      <button onclick="closeContractModal()" class="text-gray-400 hover:text-gray-600 ml-4"><i class="fas fa-times text-xl"></i></button>
    </div>
    <div class="modal-body">
      <div class="mb-5">
        <label class="block text-sm font-bold text-gray-700 mb-2">기준월 선택 <span class="text-red-500">*</span></label>
        <div class="flex gap-3">
          <select id="contract-year" class="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"></select>
          <select id="contract-month" class="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
            <option value="01">1월</option><option value="02">2월</option><option value="03">3월</option>
            <option value="04">4월</option><option value="05">5월</option><option value="06">6월</option>
            <option value="07" selected>7월</option><option value="08">8월</option><option value="09">9월</option>
            <option value="10">10월</option><option value="11">11월</option><option value="12">12월</option>
          </select>
          <span class="flex items-center text-sm text-gray-500">기준 계약리스트</span>
        </div>
      </div>
      <div id="contract-upload-zone" class="upload-zone mb-5"
        ondragover="event.preventDefault();this.classList.add('dragover')"
        ondragleave="this.classList.remove('dragover')"
        ondrop="handleContractDrop(event)"
        onclick="document.getElementById('contract-file-input').click()">
        <input type="file" id="contract-file-input" accept=".xlsx,.xls" class="hidden" onchange="handleContractSelect(event)">
        <i class="fas fa-file-excel text-3xl text-green-400 mb-3"></i>
        <p class="text-gray-600 font-medium">계약리스트.xlsx 파일을 드래그하거나 클릭하여 선택</p>
        <p class="text-xs text-gray-400 mt-1">A~FO열 (171컬럼) 형식</p>
      </div>
      <div id="contract-file-name" class="hidden mb-3 px-3 py-2 bg-green-50 rounded-lg text-sm text-green-700 font-medium"><span></span></div>
      <div id="contract-parse-progress" class="hidden mb-4">
        <div class="flex items-center justify-between mb-1">
          <span id="contract-parse-msg" class="text-xs text-gray-500">처리 중...</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div id="contract-parse-bar" class="bg-green-500 h-2 rounded-full transition-all" style="width:0%"></div>
        </div>
      </div>
      <div id="contract-parse-result" class="hidden mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
        <p class="text-xs font-bold text-green-700 mb-2"><i class="fas fa-check-circle mr-1"></i>파싱 완료</p>
        <div id="contract-parse-summary" class="text-xs text-green-800 space-y-1"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button onclick="closeContractModal()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">취소</button>
      <button id="save-contract-btn" onclick="saveContractData()" disabled class="px-5 py-2 text-sm bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed">저장 및 적용</button>
    </div>
  </div>
</div>

<script>
// ==================== 전역 상태 ====================
let LOAN = null;       // 현재 선택된 월 결산 데이터
let TREND = null;      // data.json 월별 추이
let currentPage = 'overview';
let pendingParsed = null;       // 결산자료 파싱 대기
let pendingContract = null;     // 계약리스트 파싱 대기
// ── 빈티지 필터 상태
let vintageFilterType = 'all';
let vintageFilterId   = '';
let vintageFilterProd = '';
// ── 관리팀 필터 상태
let selectedMgmtTeam = '';
// ── 로그인 세션 (sessionStorage — 탭 닫으면 자동 만료)
const SESSION_KEY = 'apl_session_v1';
let currentUser = null;  // { id, name, role, allowedPages }

// ── 결산자료 스토리지
const DB_KEY = 'apl_months_v1';
// ── 계약리스트 스토리지
const CONTRACT_DB_KEY = 'apl_contracts_v1';

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

// ==================== 에이전트 카테고리 설정 ====================
const DEFAULT_AGENT_CATEGORIES = [
  { id:'ac1', name:'본사영업',    color:'#2563eb', order:1, agents:['본사영업','CALL인입','홈페이지','홈페이지-자체','고객추천'] },
  { id:'ac2', name:'온라인플랫폼',color:'#059669', order:2, agents:['알다플랫폼','핀다플랫폼','웰컴플랫폼','웰컴배너','오케이다이렉트대부','오케이다이렉트2','오케이엔캐시'] },
  { id:'ac3', name:'오프라인제휴',color:'#7c3aed', order:3, agents:['라이프대부중개','상상대부중개','에스엠씨대부중개','경인센터대부중개(주)','대관사대부중개','토마토자산관리대부','한상대부중개','한국모기지','온누리','엠에스캐피탈','핀밸런스'] },
  { id:'ac4', name:'구오케이',    color:'#d97706', order:4, agents:['오케이(현)','오케이(상)','오케이(공)'] },
  { id:'ac5', name:'기타',        color:'#6b7280', order:5, agents:['기타'] },
];
const DEFAULT_AGENT_GROUPS = [
  { id:'ag1', name:'직접채널',   color:'#1e40af', categoryIds:['ac1'] },
  { id:'ag2', name:'온라인채널', color:'#065f46', categoryIds:['ac2'] },
  { id:'ag3', name:'오프라인채널', color:'#5b21b6', categoryIds:['ac3'] },
  { id:'ag4', name:'구오케이',   color:'#92400e', categoryIds:['ac4'] },
  { id:'ag5', name:'기타',       color:'#374151', categoryIds:['ac5'] },
];
let AGENT_CATEGORIES = [];
let AGENT_GROUPS = [];
let editAgentCategories = [];
let editAgentGroups = [];
let settingsAgentTab = 'categories';

// ==================== 권한설정 / 허용 IP 전역 상태 ====================
const AUTH_USERS_KEY  = 'apl_auth_users_v1';
const AUTH_IP_KEY     = 'apl_auth_ip_v1';

// 메뉴 목록 (page 키 = data-page 값과 동일)
const MENU_LIST = [
  { page:'overview',       label:'종합 개요' },
  { page:'balance',        label:'잔고 현황' },
  { page:'product',        label:'상품별 현황' },
  { page:'agent',          label:'모집인별 현황' },
  { page:'newloan',        label:'신규대출 현황' },
  { page:'overdue',        label:'연체 현황' },
  { page:'overdue-change', label:'연체율 변동' },
  { page:'vintage',        label:'빈티지 분석' },
  { page:'realestate',     label:'부동산 현황' },
  { page:'trend',          label:'월별 추이' },
  { page:'upload',         label:'결산자료 업로드' },
  { page:'contract',       label:'계약리스트' },
  { page:'settings',       label:'시스템 설정' },
  { page:'auth',           label:'권한 설정' },
  { page:'ipallow',        label:'허용 IP 등록' },
];

// 기본 계정 구조
function defaultAuthUsers() {
  return [
    {
      id: 'admin',
      password: 'admin1234',
      name: '관리자',
      role: 'admin',
      allowedPages: MENU_LIST.map(m => m.page), // 전체 허용
      createdAt: new Date().toISOString()
    }
  ];
}
function defaultAuthIP() {
  return { enabled: false, list: [] };
}

function loadAuthUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || defaultAuthUsers(); }
  catch(_) { return defaultAuthUsers(); }
}
function saveAuthUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}
function loadAuthIP() {
  try { return JSON.parse(localStorage.getItem(AUTH_IP_KEY)) || defaultAuthIP(); }
  catch(_) { return defaultAuthIP(); }
}
function saveAuthIP(ipData) {
  localStorage.setItem(AUTH_IP_KEY, JSON.stringify(ipData));
}

// ==================== Supabase DB 헬퍼 (IndexedDB 대체) ====================
// IDB는 오프라인 캐시로만 유지, 실제 저장/로드는 Supabase(/api/db/months)
const IDB_NAME    = 'apl-db';
const IDB_STORE   = 'months';
const IDB_VERSION = 1;
let _idbPromise = null;

/** IndexedDB 연결 (오프라인 캐시용) */
function openIDB() {
  if (_idbPromise) return _idbPromise;
  _idbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
  return _idbPromise;
}

/** IDB 캐시 읽기 */
async function _idbGet() {
  try {
    const idb = await openIDB();
    return await new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const result = {};
      const req = store.openCursor();
      req.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) { result[cursor.key] = cursor.value; cursor.continue(); }
        else resolve(result);
      };
      req.onerror = e => reject(e.target.error);
    });
  } catch(e) { return {}; }
}

/** IDB 캐시 쓰기 */
async function _idbSet(db) {
  try {
    const idb = await openIDB();
    await new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.clear();
      for (const [k, v] of Object.entries(db)) store.put(v, k);
      tx.oncomplete = () => resolve();
      tx.onerror    = e => reject(e.target.error);
    });
  } catch(e) { console.warn('[IDB캐시] 쓰기 실패(무시):', e); }
}

/**
 * Supabase에서 전체 months 딕셔너리 반환
 * 실패 시 IDB 캐시 폴백
 */
async function getMonthsDB() {
  try {
    const res = await fetch('/api/db/months');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data && typeof data === 'object' && !data.error) {
      await _idbSet(data); // 캐시 갱신
      return data;
    }
    throw new Error(data.error || '응답 오류');
  } catch(e) {
    console.warn('[getMonthsDB] Supabase 실패, IDB 캐시 폴백:', e);
    const cached = await _idbGet();
    if (Object.keys(cached).length > 0) return cached;
    // localStorage 최후 폴백
    try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); } catch(_){ return {}; }
  }
}

/**
 * Supabase에 전체 months 딕셔너리 저장
 * slim화(빈 문자열·null 제거) 포함
 */
async function saveMonthsDB(db) {
  // slim화: 빈 문자열·null 필드 제거
  const slim = {};
  for (const [k, v] of Object.entries(db)) {
    slim[k] = {
      ...v,
      records: (v.records || []).map(r => {
        const o = {};
        for (const [fk, fv] of Object.entries(r)) {
          if (fv !== '' && fv !== null) o[fk] = fv;
        }
        return o;
      })
    };
  }
  // IDB 캐시 즉시 갱신 (오프라인/빠른 응답용)
  await _idbSet(slim);
  // Supabase 저장 (백그라운드 - 실패해도 캐시는 유지)
  try {
    const res = await fetch('/api/db/months', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slim)
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[saveMonthsDB] Supabase 저장 실패:', err);
    } else {
      console.log('[saveMonthsDB] Supabase 저장 완료 (' + Object.keys(slim).length + '개월)');
    }
  } catch(e) {
    console.error('[saveMonthsDB] Supabase 네트워크 오류:', e);
  }
}

/**
 * localStorage(구버전) → Supabase 1회 마이그레이션
 */
async function migrateLocalStorageToIDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return;
    const old = JSON.parse(raw);
    if (!old || Object.keys(old).length === 0) return;
    // Supabase에 이미 데이터 있으면 스킵
    const existing = await getMonthsDB();
    if (Object.keys(existing).length > 0) {
      localStorage.removeItem(DB_KEY);
      return;
    }
    await saveMonthsDB(old);
    localStorage.removeItem(DB_KEY);
    console.log('[마이그레이션] localStorage → Supabase 완료 (' + Object.keys(old).length + '개월)');
  } catch(e) {
    console.warn('[마이그레이션] 실패 (무시):', e);
  }
}

// base_date 말일 자동 보정
async function migrateBaseDates() {
  try {
    const db = await getMonthsDB();
    let changed = false;
    for (const [yyyymm, v] of Object.entries(db)) {
      if (!v.base_date) continue;
      const yr = parseInt(yyyymm.slice(0,4));
      const mo = parseInt(yyyymm.slice(4));
      const correctLastDay = new Date(yr, mo, 0).getDate();
      const correctDate = yr + '-' + String(mo).padStart(2,'0') + '-' + String(correctLastDay).padStart(2,'0');
      if (v.base_date !== correctDate) { v.base_date = correctDate; changed = true; }
    }
    if (changed) await saveMonthsDB(db);
  } catch(e) {}
}
async function getMonthKeys() {
  return Object.keys(await getMonthsDB()).sort().reverse(); // 최신순
}

// ==================== 초기화 ====================
// 사전 로드할 계약리스트 파일 목록 (파일명 → 기준키 yyyymm)
const PRESET_CONTRACTS = [
  { file: '/contract_202607.json', key: '202607' },
];

async function preloadContractFiles() {
  const db = getContractDB();
  let changed = false;
  for (const item of PRESET_CONTRACTS) {
    if (db[item.key]) continue; // 이미 저장된 경우 스킵
    try {
      const res = await fetch(item.file);
      if (!res.ok) continue;
      const data = await res.json();
      db[item.key] = data;
      changed = true;
      console.log('[계약리스트] ' + item.key + ' 자동 로드 완료 (' + data.count + '건)');
    } catch(e) {
      console.warn('[계약리스트] ' + item.key + ' 로드 실패:', e);
    }
  }
  if (changed) saveContractDB(db);
}

async function init() {
  try {
    // 0. localStorage → IndexedDB 1회 마이그레이션
    await migrateLocalStorageToIDB();

    // 1. 월별 추이(마감자료) 로드
    const trendRes = await fetch('/data.json');
    TREND = await trendRes.json();

    loadCategoriesFromStorage();
    await migrateBaseDates(); // base_date 말일 자동 보정

    // 2. IndexedDB에 저장된 가장 최신 월 로드
    const months = await getMonthKeys();
    if (months.length > 0) {
      await loadMonthData(months[0]);
    } else {
      // IDB 비어있으면 /loan_data.json 자동 로드 (fallback)
      try {
        const loanRes = await fetch('/loan_data.json');
        if (loanRes.ok) {
          const loanData = await loanRes.json();
          if (loanData && loanData.base_date) {
            const key = loanData.base_date.replace(/-/g,'').slice(0,6);
            const db = await getMonthsDB();
            db[key] = loanData;
            await saveMonthsDB(db);
            await loadMonthData(key);
            console.log('[결산자료] loan_data.json 자동 로드 완료 (' + key + ', ' + (loanData.records?.length||0) + '건)');
          }
        }
      } catch(e2) { /* fallback 실패 시 무시 */ }
    }

    if (LOAN) {
      document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + (TREND?.generated_at || '-');
      document.getElementById('hdr-basedate').textContent = LOAN.base_date;
    } else {
      document.getElementById('hdr-date').textContent = '추이: ' + (TREND?.generated_at || '-');
    }

    await refreshSidebarMonths();
    await augmentTrendFromStorage(); // IDB 결산자료로 TREND 누락 월 보완
    await refreshMgmtTeamSelect();   // 관리팀 셀렉트 옵션 초기화
    await renderPage();

    // 3. 계약리스트 사전 로드 (백그라운드)
    preloadContractFiles().then(() => {
      const badge = document.getElementById('sb-contract-count');
      if (badge) badge.textContent = Object.keys(getContractDB()).length;
    });
  } catch(e) {
    console.error('[init] 초기화 실패:', e);
    const mc = document.getElementById('main-content');
    if (mc) mc.innerHTML = '<div class="flex flex-col items-center justify-center h-64 gap-2 text-red-500"><i class="fas fa-exclamation-circle text-3xl"></i><p class="font-bold">초기 로드 실패</p><p class="text-sm text-gray-500">' + (e.message||String(e)) + '</p></div>';
  }
}

// ==================== TREND 동적 보완 ====================
// IDB 결산자료에서 TREND에 없는 월을 계산해서 추가
async function augmentTrendFromStorage() {
  if (!TREND) return;
  const db = await getMonthsDB();
  const keys = Object.keys(db).sort(); // 오름차순

  if (keys.length === 0) return;

  // ── 담보/신용 상품 목록 (CATEGORIES + GROUPS 기준 — 잔고구성비와 동일) ──
  const catsNow = (CATEGORIES && CATEGORIES.length > 0) ? CATEGORIES : DEFAULT_CATEGORIES;
  const grpsNow = (GROUPS && GROUPS.length > 0) ? GROUPS : DEFAULT_GROUPS;

  // g1(담보) 그룹의 카테고리 IDs → 상품 목록 확정
  const g1 = grpsNow.find(g=>g.id==='g1') || {categoryIds:['c1']};
  const g2 = grpsNow.find(g=>g.id==='g2') || {categoryIds:['c2','c3','c4','c5']};

  const collProductNames   = catsNow.filter(c=>g1.categoryIds.includes(c.id)).flatMap(c=>c.products||[]);
  const creditProductNames = catsNow.filter(c=>g2.categoryIds.includes(c.id)).flatMap(c=>c.products||[]);

  // fallback (CATEGORIES 미로드 시)
  const collProds   = collProductNames.length   ? collProductNames   : ['담보론','담보론(지분대출)'];
  const creditProds = creditProductNames.length  ? creditProductNames
    : ['N론','N론(하이브리드)','토마토N론','오투N론','기타N',
       '스타론','스타스위치론','큐브론',
       '토마토토탈론','토마토토탈론플러스','토마토론',
       'OP론','오투론','테일론','프리미엄론'];

  // ── data.json에 없는 외부 분류명 → 0 처리 ─────────────────
  const ZERO_NAMES = new Set(['첨담보','차량','신용(기타)']);

  for (const yyyymm of keys) {
    // yyyymm → "26.7월" 형식
    const yr  = parseInt(yyyymm.slice(0,4)) - 2000; // 2026 → 26
    const mo  = parseInt(yyyymm.slice(4));           // 07 → 7
    const label = yr + '.' + mo + '월';              // "26.7월"

    const loanData = db[yyyymm];
    if (!loanData || !loanData.records) continue;
    const recs = loanData.records;

    // ── contract 데이터 판별: r.b(잔고) 합계가 0이면 신규계약 파일 → 잔고 집계 불가 ──
    const totalBalCheck = recs.reduce((s,r)=>s+(r.b||0),0);
    const isContractData = (totalBalCheck === 0);

    // ── loan_data(잔고 데이터)가 있으면 CATEGORIES/GROUPS 기준으로 집계 → 월별 맵 갱신 ──
    // (data.json에 이미 있는 월이라도 덮어씀. contract 데이터는 잔고 없으므로 스킵)
    const _creditBal = 0, _collBal = 0;
    // 그룹 잔고 집계 (신용/담보 분리 차트용)
    let _gCreditBal = 0, _gCollBal = 0;
    // 카테고리별 잔고·신규 집계 (신규대출 차트용)
    const _catBal = {}, _catNew = {};
    for (const cat of catsNow) {
      _catBal[cat.id] = 0;
      _catNew[cat.id] = 0;
    }
    for (const r of recs) {
      if (creditProds.includes(r.p)) _gCreditBal += r.b||0;
      if (collProds.includes(r.p))   _gCollBal   += r.b||0;
      // 카테고리별 집계
      for (const cat of catsNow) {
        if ((cat.products||[]).includes(r.p)) {
          _catBal[cat.id] += r.b||0;
          if (r.ct==='신규') _catNew[cat.id] += r.b||0;
        }
      }
    }
    if (!TREND.__creditByMonth)     TREND.__creditByMonth     = {};
    if (!TREND.__collateralByMonth) TREND.__collateralByMonth = {};
    if (!TREND.__newByCatMonth)     TREND.__newByCatMonth     = {};
    TREND.__creditByMonth[label]     = parseFloat((_gCreditBal/100000000).toFixed(2));
    TREND.__collateralByMonth[label] = parseFloat((_gCollBal/100000000).toFixed(2));
    // 카테고리별 신규대출 저장: { '26.4월': { c1: 5.56, c2: 2.04, ... } }
    const _catNewEntry = {};
    for (const cat of catsNow) _catNewEntry[cat.id] = parseFloat((_catNew[cat.id]/100000000).toFixed(2));
    TREND.__newByCatMonth[label] = _catNewEntry;

    // 이미 TREND에 있는 월은 total/products append 불필요 → 스킵
    if (TREND.months.includes(label)) continue;

    // ── 전체 집계 ──────────────────────────────────────
    const totalBal  = recs.reduce((s,r)=>s+(r.b||0),0);
    const totalCnt  = recs.length;
    const od10amt   = recs.filter(r=>r.d>10).reduce((s,r)=>s+(r.b||0),0);
    const od30amt   = recs.filter(r=>r.d>30).reduce((s,r)=>s+(r.b||0),0);
    const od10rate  = totalBal>0 ? parseFloat((od10amt/totalBal*100).toFixed(2)) : 0;
    const od30rate  = totalBal>0 ? parseFloat((od30amt/totalBal*100).toFixed(2)) : 0;
    const rw = recs.reduce((s,r)=>r.r>0&&r.b>0?s+r.b*r.r:s,0);
    const rb = recs.reduce((s,r)=>r.r>0&&r.b>0?s+r.b:s,0);
    const avgRate   = rb>0 ? parseFloat((rw/rb).toFixed(2)) : 0;
    const newRecs   = recs.filter(r=>r.ct==='신규');
    const newBal    = newRecs.reduce((s,r)=>s+(r.b||0),0);
    const newCnt    = newRecs.length;

    // ── total append ────────────────────────────────
    TREND.total.balance.push({ month:label, count:totalCnt, amount:parseFloat((totalBal/100000000).toFixed(2)), rate:avgRate });
    TREND.total.new_loans.push({ month:label, request:0, approve:newCnt, approve_rate:0, amount:parseFloat((newBal/100000000).toFixed(2)) });
    TREND.total.repay.push({ month:label, amount:0, rate:0 });
    TREND.total.overdue.push({ month:label, amount_10:parseFloat((od10amt/100000000).toFixed(2)), rate_10:od10rate,
                                            amount_30:parseFloat((od30amt/100000000).toFixed(2)), rate_30:od30rate });
    TREND.months.push(label);

    // ── 상품별 집계 (loan_data 상품명 기준) ─────────────
    const byProd = {};
    for (const r of recs) {
      if (!byProd[r.p]) byProd[r.p] = {bal:0,cnt:0,newBal:0,newCnt:0,od10:0,od30:0};
      byProd[r.p].bal += r.b||0;
      byProd[r.p].cnt++;
      if (r.ct==='신규') { byProd[r.p].newBal+=r.b||0; byProd[r.p].newCnt++; }
      if (r.d>10) byProd[r.p].od10+=r.b||0;
      if (r.d>30) byProd[r.p].od30+=r.b||0;
    }

    // ── '신용' 합산 집계 (GROUPS g2 기준 — 잔고구성비와 동일) ────────
    // g2(신용) categoryIds에 속하는 상품들만 합산 (c6 기타/회생 제외)
    const creditAgg = {bal:0,cnt:0,newBal:0,newCnt:0,od10:0,od30:0};
    for (const r of recs) {
      if (!creditProds.includes(r.p)) continue; // g2 신용 상품만
      creditAgg.bal  += r.b||0;
      creditAgg.cnt++;
      if (r.ct==='신규') { creditAgg.newBal+=r.b||0; creditAgg.newCnt++; }
      if (r.d>10) creditAgg.od10+=r.b||0;
      if (r.d>30) creditAgg.od30+=r.b||0;
    }

    // ── '담보' 합산 집계 (GROUPS g1 기준 — 잔고구성비와 동일) ────────
    // g1(담보) categoryIds에 속하는 상품들만 합산
    const collAgg = {bal:0,cnt:0,newBal:0,newCnt:0,od10:0,od30:0};
    for (const r of recs) {
      if (!collProds.includes(r.p)) continue; // g1 담보 상품만
      collAgg.bal  += r.b||0;
      collAgg.cnt++;
      if (r.ct==='신규') { collAgg.newBal+=r.b||0; collAgg.newCnt++; }
      if (r.d>10) collAgg.od10+=r.b||0;
      if (r.d>30) collAgg.od30+=r.b||0;
    }

    // ── TREND.products append ────────────────────────
    if (!TREND.products) TREND.products = [];
    for (const tp of TREND.products) {
      let v;
      if (tp.name === '신용') {
        // g2(신용) 상품만 합산 — 잔고구성비와 동일 기준
        v = creditAgg;
      } else if (ZERO_NAMES.has(tp.name)) {
        // 외부 시스템 전용 분류 → loan_data로 집계 불가, 0 처리
        v = {bal:0,cnt:0,newBal:0,newCnt:0,od10:0,od30:0};
      } else {
        // loan_data 상품명과 직접 1:1 매핑 (없으면 0)
        v = byProd[tp.name] || {bal:0,cnt:0,newBal:0,newCnt:0,od10:0,od30:0};
      }
      tp.balance.push({
        month:label, count:v.cnt,
        amount:parseFloat((v.bal/100000000).toFixed(2)), rate:avgRate
      });
      tp.new_loans.push({
        month:label, request:0, approve:v.newCnt, approve_rate:0,
        amount:parseFloat((v.newBal/100000000).toFixed(2))
      });
      tp.repay.push({month:label, amount:0, rate:0});
      tp.overdue.push({
        month:label,
        amount_10:parseFloat((v.od10/100000000).toFixed(2)),
        rate_10: totalBal>0 ? parseFloat((v.od10/totalBal*100).toFixed(2)) : 0,
        amount_30:parseFloat((v.od30/100000000).toFixed(2)),
        rate_30: totalBal>0 ? parseFloat((v.od30/totalBal*100).toFixed(2)) : 0,
      });
    }

    // ── __collateralByMonth / __creditByMonth 는 루프 상단에서 이미 저장됨 ──

    console.log('[TREND 보완] ' + label + ' 추가 완료 (잔고 ' + (totalBal/100000000).toFixed(0) + '억, 담보 ' + (collAgg.bal/100000000).toFixed(0) + '억, 신용 ' + (creditAgg.bal/100000000).toFixed(0) + '억, ' + totalCnt + '건)');
  }

  // ── 보완 후 TREND 재정렬 ──────────────────────────────────────────────────
  function monthLabelToNum(m) {
    const p = String(m).split('.');
    if (p.length < 2) return 0;
    return parseInt(p[0]) * 100 + parseInt(p[1]);
  }
  const order = TREND.months
    .map((m, i) => ({ m, i }))
    .sort((a, b) => monthLabelToNum(a.m) - monthLabelToNum(b.m));
  const idx = order.map(o => o.i);

  TREND.months = idx.map(i => TREND.months[i]);
  TREND.total.balance   = idx.map(i => TREND.total.balance[i]);
  TREND.total.new_loans = idx.map(i => TREND.total.new_loans[i]);
  TREND.total.repay     = idx.map(i => TREND.total.repay[i]);
  TREND.total.overdue   = idx.map(i => TREND.total.overdue[i]);

  if (TREND.products) {
    for (const tp of TREND.products) {
      if (tp.balance)   tp.balance   = idx.map(i => tp.balance[i]);
      if (tp.new_loans) tp.new_loans = idx.map(i => tp.new_loans[i]);
      if (tp.repay)     tp.repay     = idx.map(i => tp.repay[i]);
      if (tp.overdue)   tp.overdue   = idx.map(i => tp.overdue[i]);
    }
  }

}

async function loadMonthData(yyyymm) {
  const db = await getMonthsDB();
  if (!db[yyyymm]) return false;
  LOAN = db[yyyymm];
  document.getElementById('hdr-basedate').textContent = LOAN.base_date;
  document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + (TREND?.generated_at || '-');
  // 사이드바 활성 월 표시
  document.getElementById('sb-active-month').textContent = yyyymm.slice(0,4)+'년 '+parseInt(yyyymm.slice(4))+'월';
  await refreshSidebarMonths(yyyymm);
  await refreshMgmtTeamSelect();  // 관리팀 옵션 갱신
  return true;
}

async function refreshSidebarMonths(activeKey) {
  const months = await getMonthKeys();
  const badge = document.getElementById('sb-month-count');
  if (badge) badge.textContent = months.length;

  const list = document.getElementById('sb-month-list');
  if (!list) return;

  if (months.length === 0) {
    list.innerHTML = '<div class="px-3 py-2 text-xs text-blue-400 opacity-50">업로드된 데이터 없음</div>';
    return;
  }

  // activeKey가 없으면 현재 LOAN의 base_date로 추정
  const curKey = activeKey || (LOAN ? (LOAN.base_date||'').replace(/-/g,'').slice(0,6) : null);

  list.innerHTML = months.map(m => {
    const y = m.slice(0,4), mo = parseInt(m.slice(4));
    const isActive = m === curKey;
    return \`<button onclick="selectMonth('\${m}');closeMonthDropdown();"
      class="w-full text-left flex items-center gap-2 px-3 py-2 text-sm transition-all \${isActive
        ? 'bg-blue-600 text-white font-bold'
        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'}">
      <i class="fas fa-\${isActive?'check-circle':'circle'} text-xs flex-shrink-0 opacity-60"></i>
      <span>\${y}년 \${mo}월</span>
      \${isActive ? '<span class="ml-auto text-xs opacity-70">현재</span>' : ''}
    </button>\`;
  }).join('');
}

function toggleMonthDropdown() {
  const dd = document.getElementById('sb-month-dropdown');
  const chevron = document.getElementById('sb-month-chevron');
  if (!dd) return;
  const isOpen = !dd.classList.contains('hidden');
  if (isOpen) {
    dd.classList.add('hidden');
    if (chevron) chevron.style.transform = '';
  } else {
    dd.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

function closeMonthDropdown() {
  const dd = document.getElementById('sb-month-dropdown');
  const chevron = document.getElementById('sb-month-chevron');
  if (dd) dd.classList.add('hidden');
  if (chevron) chevron.style.transform = '';
}

async function selectMonth(yyyymm) {
  await loadMonthData(yyyymm);
  if (currentPage !== 'upload') await renderPage();
  else await goPage('overview');
}

// ==================== 라우팅 ====================
async function goPage(page) {
  currentPage = page;
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const target = document.querySelector('[data-page="' + page + '"]');
  if (target) target.classList.add('active');
  await renderPage();
}

// ==================== 관리팀 필터 ====================
function onMgmtTeamFilter(value) {
  selectedMgmtTeam = value;
  renderPage();
}
window.onMgmtTeamFilter = onMgmtTeamFilter;

// 사이드바 관리팀 셀렉트 옵션 갱신
async function refreshMgmtTeamSelect() {
  const sel = document.getElementById('sb-mgmt-select');
  if (!sel) return;
  const teams = await getUniqueMgmtTeams();
  const cur = selectedMgmtTeam;
  let html = '<option value="" style="background:#1e3a5f;color:#fff;">전체 관리팀</option>';
  teams.forEach(t => {
    html += '<option value="' + t + '" style="background:#1e3a5f;color:#fff;"'
          + (t === cur ? ' selected' : '') + '>' + t + '</option>';
  });
  sel.innerHTML = html;
  sel.value = cur;
}

async function renderPage() {
  const el = document.getElementById('main-content');
  destroyCharts();
  if (!LOAN && currentPage !== 'upload' && currentPage !== 'trend' && currentPage !== 'contract' && currentPage !== 'settings' && currentPage !== 'newloan' && currentPage !== 'overdue-change' && currentPage !== 'realestate' && currentPage !== 'vintage' && currentPage !== 'auth' && currentPage !== 'ipallow') {
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
  // ── 관리팀 필터: LOAN.records를 임시 교체 (집계 함수들이 LOAN.records를 직접 참조하므로)
  let _origRecords = null;
  if (LOAN && selectedMgmtTeam) {
    _origRecords = LOAN.records;
    LOAN.records = filterByMgmtTeam(_origRecords);
  }
  try {
    switch(currentPage) {
      case 'overview': renderOverview(el); break;
      case 'balance':  renderBalance(el);  break;
      case 'product':  renderProduct(el);  break;
      case 'agent':    renderAgent(el);    break;
      case 'overdue':        await renderOverdue(el);        break;
      case 'overdue-change': await renderOverdueChange(el);  break;
      case 'vintage':        await renderVintage(el);         break;
      case 'realestate': await renderRealestate(el); break;
      case 'trend':    renderTrend(el);    break;
      case 'upload':    await renderUploadPage(el);    break;
      case 'contract':  renderContractPage(el);  break;
      case 'newloan':   renderNewLoan(el);        break;
      case 'settings':  renderSettingsPage(el);  break;
      case 'auth':      renderAuthPage(el);      break;
      case 'ipallow':   renderIPAllowPage(el);   break;
    }
  } finally {
    // ── 원본 records 복원 (필터링 영구 적용 방지)
    if (_origRecords !== null) LOAN.records = _origRecords;
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
  // 에이전트 카테고리
  try{
    const s=localStorage.getItem('apl_agent_cats_v2');
    AGENT_CATEGORIES=s?JSON.parse(s):JSON.parse(JSON.stringify(DEFAULT_AGENT_CATEGORIES));
    AGENT_CATEGORIES.forEach((c,i)=>{ if(c.order==null) c.order=i+1; });
  }catch(e){AGENT_CATEGORIES=JSON.parse(JSON.stringify(DEFAULT_AGENT_CATEGORIES));}
  try{const s=localStorage.getItem('apl_agent_groups_v2');AGENT_GROUPS=s?JSON.parse(s):JSON.parse(JSON.stringify(DEFAULT_AGENT_GROUPS));}catch(e){AGENT_GROUPS=JSON.parse(JSON.stringify(DEFAULT_AGENT_GROUPS));}
}
function saveCatsToStorage(){
  localStorage.setItem('apl_categories_v2',JSON.stringify(CATEGORIES));
  localStorage.setItem('apl_groups_v1',JSON.stringify(GROUPS));
}
function saveAgentCatsToStorage(){
  localStorage.setItem('apl_agent_cats_v2',JSON.stringify(AGENT_CATEGORIES));
  localStorage.setItem('apl_agent_groups_v2',JSON.stringify(AGENT_GROUPS));
}
function getGroupOfCategory(catId){for(const g of GROUPS)if(g.categoryIds.includes(catId))return g;return{id:'__none__',name:'미배정',color:'#9ca3af'};}
function getCategoryOfProduct(pname){for(const cat of CATEGORIES)if(cat.products.includes(pname))return cat;return{id:'__none__',name:'미분류',color:'#9ca3af'};}
function getAgentGroupOfCategory(catId){for(const g of AGENT_GROUPS)if(g.categoryIds.includes(catId))return g;return{id:'__none__',name:'미배정',color:'#9ca3af'};}
function getCategoryOfAgent(aname){for(const cat of AGENT_CATEGORIES)if(cat.agents.includes(aname))return cat;return{id:'__none__',name:'미분류',color:'#9ca3af'};}

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
    if(!map[a])map[a]={count:0,balance:0,rateWSum:0,rateBalSum:0,overdue30:0,bal30:0,bal10_:0,bal30_:0,bal60:0,bal90:0,balMore:0,grpBal:{}};
    map[a].count++;map[a].balance+=r.b;
    if(r.r>0&&r.b>0){map[a].rateWSum+=r.b*r.r;map[a].rateBalSum+=r.b;}
    // 상품그룹별 잔고 누적
    const _cat=getCategoryOfProduct(r.p);
    const _grp=getGroupOfCategory(_cat.id);
    if(!map[a].grpBal[_grp.id])map[a].grpBal[_grp.id]={name:_grp.name,color:_grp.color,balance:0};
    map[a].grpBal[_grp.id].balance+=r.b;
    if(r.d===0){/* 정상 */}
    else if(r.d<=10){map[a].bal10_+=r.b;}
    else if(r.d<=30){map[a].bal30_+=r.b;}
    else if(r.d<=60){map[a].bal60+=r.b;}
    else if(r.d<=90){map[a].bal90+=r.b;}
    else{map[a].balMore+=r.b;}
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

// ==================== 에이전트 그룹 집계 ====================
function aggregateByAgentGroup() {
  // 에이전트 카테고리별 집계 (카드 단위) — 시스템설정 order 기준 정렬
  const sortedAgentCats = [...AGENT_CATEGORIES].sort((a,b)=>(a.order||99)-(b.order||99));
  const catMap={};
  for(const c of sortedAgentCats){
    catMap[c.id]={...c,count:0,balance:0,rateWSum:0,rateBalSum:0,bal10Over:0,agents:{},grpBal:{}};
  }
  catMap['__none__']={id:'__none__',name:'미분류',color:'#9ca3af',order:999,count:0,balance:0,rateWSum:0,rateBalSum:0,bal10Over:0,agents:{},grpBal:{}};
  for(const r of LOAN.records){
    const aname=r.a||'기타';
    const cat=getCategoryOfAgent(aname);
    const cm=catMap[cat.id]||catMap['__none__'];
    cm.count++;cm.balance+=r.b;
    if(r.r>0&&r.b>0){cm.rateWSum+=r.b*r.r;cm.rateBalSum+=r.b;}
    if(r.d>10){cm.bal10Over+=r.b;}
    // 상품 그룹(담보/신용) 집계
    const _pcat=getCategoryOfProduct(r.p);
    const _pgrp=getGroupOfCategory(_pcat.id);
    if(!cm.grpBal[_pgrp.id])cm.grpBal[_pgrp.id]={
      id:_pgrp.id,name:_pgrp.name,color:_pgrp.color,
      count:0,balance:0,rateWSum:0,rateBalSum:0,bal10Over:0,
      ltvWSum:0,ltvAppSum:0,
      cats:{}
    };
    const gm=cm.grpBal[_pgrp.id];
    gm.count++;gm.balance+=r.b;
    if(r.r>0&&r.b>0){gm.rateWSum+=r.b*r.r;gm.rateBalSum+=r.b;}
    if(r.d>10){gm.bal10Over+=r.b;}
    if(r.appraised>0&&r.loanAmt>0){gm.ltvWSum+=r.loanAmt;gm.ltvAppSum+=r.appraised;}
    // 상품 카테고리별 집계 (그룹 내)
    if(!gm.cats[_pcat.id])gm.cats[_pcat.id]={
      id:_pcat.id,name:_pcat.name,color:_pcat.color,
      count:0,balance:0,rateWSum:0,rateBalSum:0,bal10Over:0,
      ltvWSum:0,ltvAppSum:0
    };
    const cm2=gm.cats[_pcat.id];
    cm2.count++;cm2.balance+=r.b;
    if(r.r>0&&r.b>0){cm2.rateWSum+=r.b*r.r;cm2.rateBalSum+=r.b;}
    if(r.d>10){cm2.bal10Over+=r.b;}
    if(r.appraised>0&&r.loanAmt>0){cm2.ltvWSum+=r.loanAmt;cm2.ltvAppSum+=r.appraised;}
    // 카테고리 내 에이전트별 집계
    if(!cm.agents[aname])cm.agents[aname]={name:aname,count:0,balance:0,rateWSum:0,rateBalSum:0,bal10Over:0};
    const am=cm.agents[aname];
    am.count++;am.balance+=r.b;
    if(r.r>0&&r.b>0){am.rateWSum+=r.b*r.r;am.rateBalSum+=r.b;}
    if(r.d>10){am.bal10Over+=r.b;}
  }
  // order 기준 정렬 (설정 순서 반영)
  return Object.values(catMap)
    .filter(c=>c.count>0)
    .sort((a,b)=>(a.order||99)-(b.order||99));
}

/**
 * 상품 카테고리(담보/신용 등)별 에이전트 집계
 * 반환: [ { id, name, color, order, totalBalance, totalCount, agents: [{name, balance, count, rate, od10r}] } ]
 * agents는 잔고 내림차순 정렬
 */
function aggregateByProductCatForAgent() {
  // 상품 카테고리 목록 (order 정렬)
  const sortedCats = [...CATEGORIES].sort((a,b)=>(a.order||99)-(b.order||99));
  const catMap = {};
  for(const c of sortedCats){
    catMap[c.id] = {
      id: c.id, name: c.name, color: c.color, order: c.order||99,
      totalBalance: 0, totalCount: 0,
      rateWSum: 0, rateBalSum: 0, bal10Over: 0,
      agents: {}  // aname -> {name,balance,count,rateWSum,rateBalSum,bal10Over}
    };
  }
  // 미분류
  catMap['__none__'] = {
    id:'__none__', name:'미분류', color:'#9ca3af', order:9999,
    totalBalance: 0, totalCount: 0,
    rateWSum: 0, rateBalSum: 0, bal10Over: 0, agents: {}
  };

  for(const r of LOAN.records){
    const aname = r.a || '기타';
    const pcat  = getCategoryOfProduct(r.p);
    const cm    = catMap[pcat.id] || catMap['__none__'];
    cm.totalBalance += r.b;
    cm.totalCount++;
    if(r.r>0&&r.b>0){ cm.rateWSum+=r.b*r.r; cm.rateBalSum+=r.b; }
    if(r.d>10) cm.bal10Over+=r.b;
    if(!cm.agents[aname]) cm.agents[aname] = {name:aname,balance:0,count:0,rateWSum:0,rateBalSum:0,bal10Over:0};
    const am = cm.agents[aname];
    am.balance += r.b;
    am.count++;
    if(r.r>0&&r.b>0){ am.rateWSum+=r.b*r.r; am.rateBalSum+=r.b; }
    if(r.d>10) am.bal10Over+=r.b;
  }

  // agents 객체 → 잔고 내림차순 배열로 변환
  const result = [];
  for(const [,cm] of Object.entries(catMap)){
    if(cm.totalCount===0) continue;
    const agArr = Object.values(cm.agents).sort((a,b)=>b.balance-a.balance);
    result.push({ ...cm, agents: agArr });
  }
  return result.sort((a,b)=>a.order-b.order);
}

// ==================== 차트 ====================
function mkPie(id,labels,data,colors){const ctx=document.getElementById(id);if(!ctx)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:2,borderColor:'#fff',hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){const v=ctx.raw;const total=ctx.dataset.data.reduce((a,b)=>a+b,0);return' '+labels[ctx.dataIndex]+': '+fmtAmt(v)+' ('+(v/total*100).toFixed(1)+'%)';}}}}}});}
function mkBar(id,labels,datasets,opts={}){const ctx=document.getElementById(id);if(!ctx)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(ctx,{type:'bar',data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},scales:{x:{ticks:{font:{size:10}}},y:{ticks:{callback:v=>opts.pct?v.toFixed(1)+'%':fmtAmt(v),font:{size:10}}}},...opts.extra}});}
function mkLine(id,labels,datasets,opts={}){const ctx=document.getElementById(id);if(!ctx)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(ctx,{type:'line',data:{labels,datasets:datasets.map(d=>({...d,tension:.35,pointRadius:3,pointHoverRadius:5,borderWidth:2.5}))},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},scales:{y:{ticks:{callback:v=>opts.pct?v.toFixed(1)+'%':fmtAmt(v),font:{size:10}}},...(opts.y1?{y1:{type:'linear',position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>v.toFixed(1)+'%',font:{size:10}}}}:{})}}});}

// ==================== 페이지: 월별 데이터 관리 ====================
async function renderUploadPage(el) {
  const db     = await getMonthsDB();
  const months = await getMonthKeys();

  // IndexedDB 사용량 계산 (레코드 JSON 크기 합산으로 추정)
  const usedBytes = Object.values(db).reduce((s,v) => s + JSON.stringify(v).length, 0);
  const usedKB  = (usedBytes / 1024).toFixed(0);
  const usedMB  = (usedBytes / 1024 / 1024).toFixed(1);

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

  <!-- 저장 공간 게이지 -->
  <div class="card p-4 bg-green-50 border-green-100">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-gray-600"><i class="fas fa-database mr-1.5"></i>브라우저 저장 공간 (IndexedDB)</span>
      <span class="text-xs font-bold text-green-600" id="idb-usage-label">현재 사용: 계산 중...</span>
    </div>
    <p class="text-xs text-green-700 mt-1"><i class="fas fa-check-circle mr-1"></i>IndexedDB 사용 중 — 용량 제한 없음 (수십 개월치 저장 가능)</p>
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
          const recKB = Math.round(JSON.stringify(d).length / 1024);
          return \`<div class="month-row \${isActive?'border-blue-300 bg-blue-50':''}">
            <div class="month-dot \${isActive?'bg-blue-500':'bg-green-400'}"></div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800">\${y}년 \${mo}월</span>
                \${isActive?'<span class="badge badge-blue">현재 선택</span>':''}
                <span class="text-xs text-gray-400">≈\${recKB}KB</span>
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
  // IndexedDB 사용량 표시 (innerHTML 할당 후 DOM 직접 업데이트)
  const usageLabel = document.getElementById('idb-usage-label');
  if (usageLabel) usageLabel.textContent = '현재 사용: ' + usedKB + 'KB (' + usedMB + 'MB)';
}
// ==================== 계약리스트 스토리지 ====================
function getContractDB() {
  try { return JSON.parse(localStorage.getItem(CONTRACT_DB_KEY) || '{}'); } catch(e){ return {}; }
}
function saveContractDB(db) {
  localStorage.setItem(CONTRACT_DB_KEY, JSON.stringify(db));
}
function getContractKeys() {
  return Object.keys(getContractDB()).sort().reverse();
}

// ==================== 페이지: 계약리스트 업로드 ====================
function renderContractPage(el) {
  const db = getContractDB();
  const keys = getContractKeys();
  // 사이드바 배지 갱신
  const badge = document.getElementById('sb-contract-count');
  if(badge) badge.textContent = keys.length;

  el.innerHTML = \`
<div class="space-y-5">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-bold">계약리스트 업로드</h2>
      <p class="text-sm text-gray-500">당월 신규 계약리스트(xlsx)를 기준월별로 업로드하고 관리합니다</p>
    </div>
    <button onclick="openContractModal()" class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
      <i class="fas fa-file-contract"></i> 새 월 업로드
    </button>
  </div>

  <!-- 안내 카드 -->
  <div class="card p-5 bg-green-50 border-green-100">
    <div class="flex items-start gap-3">
      <i class="fas fa-info-circle text-green-500 mt-0.5"></i>
      <div>
        <p class="text-sm font-bold text-green-800 mb-1">계약리스트 파일 구조 안내</p>
        <p class="text-xs text-green-700">계약리스트는 <strong>A~FO열 (171컬럼)</strong>으로 구성된 당월 신규 대출 계약 목록입니다.</p>
        <p class="text-xs text-green-700 mt-1">분석에 사용되는 핵심 컬럼: <strong>C열(상품명) · T열(대출액) · Z열(정상이율) · L열(광고매체) · AH열(연체일) · AD열(계약일) · EL열(최종감정가) · EM열(소유비율합계) · EN열(지분율대출원금합계)</strong></p>
      </div>
    </div>
  </div>

  <!-- 업로드된 월 목록 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-database mr-2 text-green-500"></i>업로드된 계약리스트 (\${keys.length}건)</h3>
    \${keys.length === 0
      ? \`<div class="text-center py-12 text-gray-400">
          <i class="fas fa-inbox text-4xl mb-3"></i>
          <p class="text-sm">업로드된 계약리스트가 없습니다</p>
          <button onclick="openContractModal()" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
            첫 번째 계약리스트 업로드
          </button>
        </div>\`
      : keys.map(k => {
          const d = db[k];
          const y = k.slice(0,4), mo = parseInt(k.slice(4));
          const totalAmt = d.records.reduce((s,r)=>s+(r.amt||0), 0);
          return \`<div class="month-row">
            <div class="month-dot bg-green-400"></div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800">\${y}년 \${mo}월</span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">계약일 기준 \${d.base_date} · \${fmtN(d.count)}건 · 대출액 \${fmtAmt(totalAmt)} · 업로드 \${d.uploaded_at||'-'}</p>
            </div>
            <button onclick="viewContractDetail('\${k}')" class="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
              <i class="fas fa-search mr-1"></i>상세 보기
            </button>
            <button onclick="deleteContract('\${k}')" class="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
              <i class="fas fa-trash mr-1"></i>삭제
            </button>
          </div>\`;
        }).join('')
    }
  </div>

  <!-- 선택된 월 상세 -->
  <div id="contract-detail-area"></div>
</div>\`;

  // 첫 번째 항목 자동 표시
  if(keys.length > 0) showContractDetail(keys[0], db[keys[0]]);
}

function viewContractDetail(yyyymm) {
  const db = getContractDB();
  showContractDetail(yyyymm, db[yyyymm]);
}

function showContractDetail(yyyymm, d) {
  const area = document.getElementById('contract-detail-area');
  if(!area || !d) return;
  const y = yyyymm.slice(0,4), mo = parseInt(yyyymm.slice(4));
  const recs = d.records || [];
  const totalAmt = recs.reduce((s,r)=>s+(r.amt||0), 0);

  // 상품별 집계
  const pMap = {};
  for(const r of recs){
    const p = r.p||'기타';
    if(!pMap[p]) pMap[p]={count:0,amt:0};
    pMap[p].count++; pMap[p].amt+=r.amt;
  }
  const pArr = Object.entries(pMap).sort((a,b)=>b[1].amt-a[1].amt);

  // 에이전트별 집계
  const aMap = {};
  for(const r of recs){
    const a = r.a||'기타';
    if(!aMap[a]) aMap[a]={count:0,amt:0};
    aMap[a].count++; aMap[a].amt+=r.amt;
  }
  const aArr = Object.entries(aMap).sort((a,b)=>b[1].amt-a[1].amt).slice(0,10);

  area.innerHTML = \`
<div class="card p-5">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-sm font-bold text-gray-700"><i class="fas fa-chart-bar mr-2 text-green-500"></i>\${y}년 \${mo}월 계약리스트 상세</h3>
    <div class="flex gap-4 text-xs text-gray-500">
      <span>총 <strong class="text-gray-800">\${fmtN(recs.length)}건</strong></span>
      <span>총 대출액 <strong class="text-gray-800">\${fmtAmt(totalAmt)}</strong></span>
    </div>
  </div>

  <!-- 상품별 테이블 -->
  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"><i class="fas fa-tags mr-1"></i>상품별 신규 실행</p>
  <div class="overflow-auto mb-5">
    <table class="data-table">
      <thead><tr><th>#</th><th>상품명</th><th>카테고리</th><th>건수</th><th>대출액</th><th>구성비</th><th>평균대출액</th></tr></thead>
      <tbody>\${pArr.map(([p,v],i)=>{
        const cat=getCategoryOfProduct(p);
        const pct=(v.amt/totalAmt*100).toFixed(1);
        const avg=v.count>0?fmtAmt(v.amt/v.count):'-';
        return \`<tr>
          <td class="text-gray-400">\${i+1}</td>
          <td class="font-medium">\${p}</td>
          <td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
          <td>\${fmtN(v.count)}</td>
          <td class="font-semibold">\${fmtAmt(v.amt)}</td>
          <td><div class="flex items-center gap-2"><div class="progress-bar flex-1 w-16"><div class="progress-fill" style="width:\${pct}%;background:\${cat.color}"></div></div><span>\${pct}%</span></div></td>
          <td>\${avg}</td>
        </tr>\`;
      }).join('')}
      </tbody>
    </table>
  </div>

  <!-- 에이전트별 테이블 (TOP 10) -->
  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"><i class="fas fa-users mr-1"></i>에이전트별 신규 실행 (TOP 10)</p>
  <div class="overflow-auto">
    <table class="data-table">
      <thead><tr><th>#</th><th>에이전트</th><th>건수</th><th>대출액</th><th>구성비</th><th>평균대출액</th></tr></thead>
      <tbody>\${aArr.map(([a,v],i)=>{
        const pct=(v.amt/totalAmt*100).toFixed(1);
        const avg=v.count>0?fmtAmt(v.amt/v.count):'-';
        return \`<tr>
          <td class="text-gray-400">\${i+1}</td>
          <td class="font-medium">\${a}</td>
          <td>\${fmtN(v.count)}</td>
          <td class="font-semibold">\${fmtAmt(v.amt)}</td>
          <td><div class="flex items-center gap-2"><div class="progress-bar flex-1 w-16"><div class="progress-fill bg-green-400" style="width:\${pct}%"></div></div><span>\${pct}%</span></div></td>
          <td>\${avg}</td>
        </tr>\`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>\`;
}

function deleteContract(yyyymm) {
  const y = yyyymm.slice(0,4), mo = parseInt(yyyymm.slice(4));
  if(!confirm(\`\${y}년 \${mo}월 계약리스트를 삭제하시겠습니까?\`)) return;
  const db = getContractDB();
  delete db[yyyymm];
  saveContractDB(db);
  renderContractPage(document.getElementById('main-content'));
}

function openContractModal() {
  const yearSel = document.getElementById('contract-year');
  const now = new Date();
  yearSel.innerHTML = '';
  for(let y = now.getFullYear(); y >= 2020; y--){
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y+'년';
    yearSel.appendChild(opt);
  }
  pendingContract = null;
  document.getElementById('contract-file-name').classList.add('hidden');
  document.getElementById('contract-parse-progress').classList.add('hidden');
  document.getElementById('contract-parse-result').classList.add('hidden');
  document.getElementById('save-contract-btn').disabled = true;
  document.getElementById('contract-modal').classList.add('open');
}
function closeContractModal() {
  document.getElementById('contract-modal').classList.remove('open');
}
function handleContractDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if(file) processContractFile(file);
}
function handleContractSelect(event) {
  const file = event.target.files[0];
  if(file) processContractFile(file);
}

function processContractFile(file) {
  if(!file.name.match(/\\.xlsx?$/i)){ alert('xlsx 파일만 지원합니다.'); return; }
  const fnDiv = document.getElementById('contract-file-name');
  fnDiv.querySelector('span').textContent = '📎 ' + file.name;
  fnDiv.classList.remove('hidden');
  document.getElementById('contract-parse-progress').classList.remove('hidden');
  document.getElementById('contract-parse-result').classList.add('hidden');
  document.getElementById('save-contract-btn').disabled = true;

  const setP = (pct,msg)=>{
    document.getElementById('contract-parse-bar').style.width = pct+'%';
    document.getElementById('contract-parse-msg').textContent = msg;
  };

  const reader = new FileReader();
  reader.onload = function(e){
    try{
      setP(30,'엑셀 파싱 중...');
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data,{type:'array',cellDates:true});
      const ws = wb.Sheets[wb.SheetNames[0]];
      setP(60,'데이터 변환 중...');

      const rows = XLSX.utils.sheet_to_json(ws,{header:1});
      if(rows.length < 2) throw new Error('데이터가 없습니다');

      const headers = rows[0];
      const hIdx = name => headers.indexOf(name);
      // 계약리스트 컬럼 매핑
      const colP  = hIdx('상품명');           // C
      const colAmt = hIdx('대출액');           // T
      const colR  = hIdx('정상이율');          // Z
      const colA  = hIdx('광고매체');          // L
      const colD  = hIdx('연체일');            // AH
      const colDt = hIdx('계약일');            // AD
      const colCF = hIdx('최종감정가');        // EL
      const colCG = hIdx('소유비율합계');      // EM
      const colCH = hIdx('지분율대출원금합계'); // EN
      const colCtC = hIdx('계약구분');         // Q열 (신규/추가대출/재대출/만기연장(전환) 등)
      const colMgmt = hIdx('관리팀');          // EJ열 (관리팀)

      if(colP<0||colAmt<0) throw new Error('상품명 또는 대출액 컬럼을 찾을 수 없습니다');

      setP(80,'레코드 생성 중...');
      const records = [];
      for(let i=1; i<rows.length; i++){
        const row = rows[i];
        if(!row||!row[colAmt]) continue;
        const amt = parseFloat(row[colAmt])||0;
        if(amt<=0) continue;
        const pName = String(row[colP]||'기타').trim();
        const isCollateral = (pName==='담보론'||pName==='담보론(지분대출)'||pName==='토마토토탈론'||pName==='토마토토탈론플러스');
        const cfVal = parseFloat(row[colCF])||0;
        const cgVal = parseFloat(row[colCG])||0;
        const chVal = parseFloat(row[colCH])||0;
        records.push({
          p:   pName,
          amt: amt,
          r:   parseFloat(row[colR])||0,
          a:   String(row[colA]||'기타').trim(),
          d:   parseInt(row[colD])||0,
          dt:  row[colDt]?String(row[colDt]).slice(0,10):'',
          loanAmt:   isCollateral ? (amt+chVal) : 0,
          appraised: isCollateral ? (cfVal*cgVal/100) : 0,
          ct:  String(row[colCtC]||'').trim(),  // 계약구분 (신규/추가대출/재대출/만기연장(전환))
          mgmt: String(row[colMgmt]||'').trim(),  // 관리팀 (EJ열)
        });
      }

      setP(95,'요약 생성 중...');
      const y  = document.getElementById('contract-year').value;
      const mo = document.getElementById('contract-month').value;
      const totalAmt = records.reduce((s,r)=>s+r.amt,0);
      const prods = new Set(records.map(r=>r.p)).size;
      const agents = new Set(records.map(r=>r.a)).size;

      setTimeout(()=>{
        // 해당 월의 마지막 날 계산 (월말 결산기준일)
        const lastDay = new Date(parseInt(y), parseInt(mo), 0).getDate();
        pendingContract = {
          base_date: y+'-'+mo+'-'+String(lastDay).padStart(2,'0'),
          records,
          count: records.length,
          uploaded_at: new Date().toLocaleDateString('ko-KR')
        };
        document.getElementById('contract-parse-progress').classList.add('hidden');
        document.getElementById('contract-parse-result').classList.remove('hidden');
        document.getElementById('contract-parse-summary').innerHTML = \`
          <div class="grid grid-cols-2 gap-2">
            <div>• 총 레코드: <strong>\${fmtN(records.length)}건</strong></div>
            <div>• 총 대출액: <strong>\${fmtAmt(totalAmt)}</strong></div>
            <div>• 상품 수: <strong>\${prods}개</strong></div>
            <div>• 에이전트 수: <strong>\${agents}개</strong></div>
            <div>• 기준월: <strong>\${y}년 \${parseInt(mo)}월</strong></div>
          </div>\`;
        document.getElementById('save-contract-btn').disabled = false;
      }, 300);
    } catch(err){
      document.getElementById('contract-parse-progress').classList.add('hidden');
      alert('파싱 오류: '+err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function saveContractData() {
  if(!pendingContract) return;
  const y  = document.getElementById('contract-year').value;
  const mo = document.getElementById('contract-month').value;
  const key = y+mo;
  const db = getContractDB();
  db[key] = pendingContract;
  saveContractDB(db);
  // 사이드바 배지 갱신
  const badge = document.getElementById('sb-contract-count');
  if(badge) badge.textContent = Object.keys(db).length;
  closeContractModal();
  renderContractPage(document.getElementById('main-content'));
}

async function deleteMonth(yyyymm) {
  if (!confirm(\`\${yyyymm.slice(0,4)}년 \${parseInt(yyyymm.slice(4))}월 데이터를 삭제하시겠습니까?\`)) return;
  const db = await getMonthsDB();
  delete db[yyyymm];
  await saveMonthsDB(db);
  await refreshSidebarMonths();
  await renderUploadPage(document.getElementById('main-content'));
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
      // B열 계약번호: 가능한 헤더명을 순서대로 시도
      const colCno = ['계약번호','계약 번호','NO','번호','contract_no','계약ID'].reduce((found, n) => found>=0 ? found : hIdx(n), -1);
      // B열이 고정 위치(index=1)인 경우 fallback
      const effectiveCno = colCno >= 0 ? colCno : 1;
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
      const colDate = hIdx('계약일자'); // 계약일자 (D열) → 취급월(YYYYMM) 추출용
      const colExp  = hIdx('만기일자'); // 만기일자 (X열)
      const colUsed = hIdx('사용일수'); // 사용일수 (CY열)
      const colMgmt = hIdx('관리팀');  // AI열 (관리팀)

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
        // 계약일자 → 취급월 YYYYMM 추출 (엑셀 날짜 직렬/문자열/Date 객체 모두 처리)
        let cdYm = '';
        if (colDate >= 0 && row[colDate]) {
          const raw = row[colDate];
          if (raw instanceof Date) {
            // cellDates:true 옵션으로 Date 객체가 됐을 때 (가장 흔한 케이스)
            const yy = raw.getFullYear();
            const mm = String(raw.getMonth() + 1).padStart(2, '0');
            cdYm = String(yy) + mm;  // "202601"
          } else if (typeof raw === 'number') {
            // cellDates:false 시 엑셀 날짜 직렬 숫자
            const jsDate = new Date(Math.round((raw - 25569) * 86400 * 1000));
            const yy = jsDate.getUTCFullYear();
            const mm = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
            cdYm = String(yy) + mm;
          } else {
            // 문자열 형태: "2025-06-15", "2025.6.15", "2025/1/5" 등
            // 백슬래시 이스케이프 손실 방지를 위해 new RegExp 사용
            const ms = String(raw).match(new RegExp('(\\d{4})[.\\-/](\\d{1,2})'));
            if (ms) {
              cdYm = ms[1] + ms[2].padStart(2, '0');
            } else {
              const digits = String(raw).replace(new RegExp('[^0-9]', 'g'), '');
              if (digits.length >= 6) cdYm = digits.slice(0, 4) + digits.slice(4, 6);
            }
          }
        }

        records.push({
          p:   pName,
          b:   b,
          cno: String(row[effectiveCno] || '').trim(),  // 계약번호 (B열)
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
          cd:  cdYm,  // 취급월 YYYYMM (계약일자 D열 → 빈티지 분석용)
          mgmt: String(row[colMgmt] || '').trim(),  // 관리팀 (AI열)
        });
      }

      setProgress(95, '요약 정보 생성 중...');
      // 기준월 추출 (선택된 연월)
      const y = document.getElementById('upload-year').value;
      const mo = document.getElementById('upload-month').value;
      // 해당 월의 마지막 날 계산 (7월=31, 2월=28/29 등 정확히 처리)
      const lastDayOfMonth = new Date(parseInt(y), parseInt(mo), 0).getDate();
      const baseDate = y + '-' + mo + '-' + String(lastDayOfMonth).padStart(2,'0');

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

async function saveUploadedData() {
  if (!pendingParsed) return;
  const y = document.getElementById('upload-year').value;
  const mo = document.getElementById('upload-month').value;
  const key = y + mo;

  const db = await getMonthsDB();
  db[key] = pendingParsed;
  await saveMonthsDB(db);

  LOAN = pendingParsed;
  document.getElementById('hdr-basedate').textContent = LOAN.base_date;
  document.getElementById('hdr-date').textContent = '마감: ' + LOAN.base_date + ' | 추이: ' + (TREND?.generated_at||'-');
  document.getElementById('sb-active-month').textContent = y+'년 '+parseInt(mo)+'월';

  await refreshSidebarMonths(key);
  await augmentTrendFromStorage();
  await refreshMgmtTeamSelect();  // 새 결산자료 저장 후 관리팀 옵션 갱신
  closeUploadModal();
  // 계약리스트와 동일하게: 모달만 닫고 현재 페이지(upload) 갱신 — overview로 이동하지 않음
  await renderUploadPage(document.getElementById('main-content'));
}

// ==================== TREND 정렬 유틸 ====================
// "YYYY-MM" → "YY.M월" 변환 헬퍼 (모든 IDB 기반 레이블을 TREND.months 형식으로 통일)
// 예: "2025-07" → "25.7월",  "2026-01" → "26.1월"
function ymToTrendLabel(yyyymm) {
  // yyyymm: "2026-07" 또는 "202607" 모두 처리
  const clean = String(yyyymm).replace('-','');
  const yr = parseInt(clean.slice(0,4)) - 2000;
  const mo = parseInt(clean.slice(4,6));
  return yr + '.' + mo + '월';
}

// TREND.months 및 연동 배열을 날짜 오름차순으로 재정렬
// label 형식: "YY.M월" (예: "25.1월", "26.10월")
function sortTrendMonths() {
  if (!TREND || !TREND.months || TREND.months.length === 0) return;
  function lbl2num(m) {
    const p = String(m).split('.');
    if (p.length < 2) return 0;
    return parseInt(p[0]) * 100 + parseInt(p[1]);
  }
  const order = TREND.months.map((m, i) => ({ m, i }))
    .sort((a, b) => lbl2num(a.m) - lbl2num(b.m));
  const idx = order.map(o => o.i);
  TREND.months           = idx.map(i => TREND.months[i]);
  TREND.total.balance    = idx.map(i => TREND.total.balance[i]);
  TREND.total.new_loans  = idx.map(i => TREND.total.new_loans[i]);
  TREND.total.repay      = idx.map(i => TREND.total.repay[i]);
  TREND.total.overdue    = idx.map(i => TREND.total.overdue[i]);
  if (TREND.products) {
    for (const tp of TREND.products) {
      if (tp.balance)   tp.balance   = idx.map(i => tp.balance[i]);
      if (tp.new_loans) tp.new_loans = idx.map(i => tp.new_loans[i]);
      if (tp.repay)     tp.repay     = idx.map(i => tp.repay[i]);
      if (tp.overdue)   tp.overdue   = idx.map(i => tp.overdue[i]);
    }
  }

}

// ==================== 페이지: 종합 개요 ====================
function renderOverview(el) {
  // 차트 렌더 전 TREND 정렬 보장 (augmentTrendFromStorage 이후 순서 뒤섞임 방지)
  sortTrendMonths();
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
  \${TREND ? \`
  <!-- 연체율 추이 (기존) -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-chart-area mr-2 text-green-500"></i>월별 추이 (최근 13개월)</h3>
    <div class="chart-wrap-lg"><canvas id="ov-trend"></canvas></div>
  </div>

  <!-- 2026년 이후 트렌드 섹션 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-1"><i class="fas fa-chart-line mr-2 text-blue-500"></i>융자잔고 추이 — 신용 / 담보 <span class="text-xs font-normal text-gray-400 ml-1">(2026.1월~)</span></h3>
    <p class="text-xs text-gray-400 mb-3">시스템설정 상품그룹 기준 집계</p>
    <div class="chart-wrap-lg"><canvas id="ov-bal-grp"></canvas></div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-1"><i class="fas fa-chart-bar mr-2 text-green-500"></i>신규대출 — 신용 상품별 <span class="text-xs font-normal text-gray-400 ml-1">(결산자료 기준)</span></h3>
      <p id="ov-nl-credit-sub" class="text-xs text-gray-400 mb-3"></p>
      <div class="chart-wrap-lg"><canvas id="ov-nl-credit"></canvas></div>
    </div>
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-1"><i class="fas fa-chart-bar mr-2 text-indigo-500"></i>신규대출 — 담보 상품별 <span class="text-xs font-normal text-gray-400 ml-1">(결산자료 기준)</span></h3>
      <p id="ov-nl-collateral-sub" class="text-xs text-gray-400 mb-3"></p>
      <div class="chart-wrap-lg"><canvas id="ov-nl-collateral"></canvas></div>
    </div>
  </div>
  \` : ''}
</div>\`;

  setTimeout(()=>{
    // setTimeout 진입 시점에 TREND.months가 오염될 수 있으므로 재정렬 후 스냅샷 캡처
    sortTrendMonths();
    const _trendMonths = TREND ? TREND.months.slice() : [];


    mkPie('ov-pie',catData.map(c=>c.name),catData.map(c=>c.balance),catData.map(c=>c.color));
    const pMap=aggregateByProduct();
    const pArr=Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).slice(0,15);
    mkBar('ov-bar',pArr.map(([p])=>p),[{label:'잔고',data:pArr.map(([,v])=>v.balance/100000000),backgroundColor:pArr.map(([p])=>getCategoryOfProduct(p).color+'cc')}],{extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
    if(TREND){

      // 기존 연체율 추이
      mkLine('ov-trend',_trendMonths,[
        {label:'융자잔고(억)',data:TREND.total.balance.map(b=>b.amount),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.08)',fill:true},
        {label:'30일연체율(%)',data:TREND.total.overdue.map(o=>o.rate_30),borderColor:'#dc2626',yAxisID:'y1'}
      ],{y1:true});

      // ── 신용/담보 융자잔고 추이 (__creditByMonth 있는 월만 표시) ─────────────
      {
        // __creditByMonth에 값이 있는 월만 — 정렬된 스냅샷(_trendMonths) 기준
        const months26 = _trendMonths.filter(mn =>
          TREND.__creditByMonth && TREND.__creditByMonth[mn] !== undefined
        );

        const creditBal = months26.map(mn => TREND.__creditByMonth[mn]);
        const collBal   = months26.map(mn => TREND.__collateralByMonth[mn]);

        if(months26.length > 0){
          mkLine('ov-bal-grp', months26,[
            {label:'신용(억)', data:creditBal, borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,.07)', fill:true},
            {label:'담보(억)', data:collBal,   borderColor:'#059669', backgroundColor:'rgba(5,150,105,.07)',  fill:true}
          ],{extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억'}}}}});
        } else {
          const el = document.getElementById('ov-bal-grp');
          if(el) el.innerHTML='<div class="flex items-center justify-center h-64 text-gray-400 text-sm">결산자료(loan_data) 없음 — 신용/담보 분리 불가</div>';
        }

        // ── 신규대출: __newByCatMonth 있는 월만 ──────────────────────────────
        const nlMonths = _trendMonths.filter(mn =>
          TREND.__newByCatMonth && TREND.__newByCatMonth[mn] !== undefined
        );

        const catsNowR = (CATEGORIES && CATEGORIES.length > 0) ? CATEGORIES : DEFAULT_CATEGORIES;
        const grpsNowR = (GROUPS && GROUPS.length > 0) ? GROUPS : DEFAULT_GROUPS;
        const g2R = grpsNowR.find(g=>g.id==='g2') || {categoryIds:[]};
        const g1R = grpsNowR.find(g=>g.id==='g1') || {categoryIds:[]};

        const CAT_COLORS = ['#2563eb','#7c3aed','#dc2626','#059669','#ea580c','#0891b2','#be185d','#65a30d'];

        if(nlMonths.length > 0){
          // 신용 그룹 카테고리별 신규대출
          const g2Cats = catsNowR.filter(c=>g2R.categoryIds.includes(c.id));
          const g1Cats = catsNowR.filter(c=>g1R.categoryIds.includes(c.id));
          // subtitle 동적 업데이트
          const subCredit = document.getElementById('ov-nl-credit-sub');
          if(subCredit) subCredit.textContent = g2Cats.map(c=>c.name).join(' · ');
          const subColl = document.getElementById('ov-nl-collateral-sub');
          if(subColl) subColl.textContent = g1Cats.map(c=>c.name).join(' · ');
          mkLine('ov-nl-credit', nlMonths,
            g2Cats.map((cat,i)=>({
              label: cat.name+'(억)',
              data:  nlMonths.map(mn => TREND.__newByCatMonth[mn]?.[cat.id] || 0),
              borderColor:     CAT_COLORS[i % CAT_COLORS.length],
              backgroundColor: CAT_COLORS[i % CAT_COLORS.length]+'18',
              fill: false
            })),
            {extra:{scales:{y:{ticks:{callback:v=>v.toFixed(1)+'억'}}}}}
          );
          // 담보 그룹 카테고리별 신규대출
          mkLine('ov-nl-collateral', nlMonths,
            g1Cats.map((cat,i)=>({
              label: cat.name+'(억)',
              data:  nlMonths.map(mn => TREND.__newByCatMonth[mn]?.[cat.id] || 0),
              borderColor:     CAT_COLORS[(i+4) % CAT_COLORS.length],
              backgroundColor: CAT_COLORS[(i+4) % CAT_COLORS.length]+'18',
              fill: false
            })),
            {extra:{scales:{y:{ticks:{callback:v=>v.toFixed(1)+'억'}}}}}
          );
        } else {
          ['ov-nl-credit','ov-nl-collateral'].forEach(id=>{
            const e=document.getElementById(id);
            if(e) e.innerHTML='<div class="flex items-center justify-center h-48 text-gray-400 text-sm">결산자료(loan_data) 없음</div>';
          });
        }
      }
    }
  },50);
}

// ==================== 페이지: 잔고 구성비 ====================
function renderBalance(el) {
  const total=LOAN.records.reduce((s,r)=>s+r.b,0);
  const totalCnt = LOAN.records.length;
  const catData=aggregateByCategory().sort((a,b)=>b.balance-a.balance);
  const catMap=Object.fromEntries(catData.map(c=>[c.id,c]));
  const grpData=aggregateByGroup();
  const pMap=aggregateByProduct();

  // ── KPI 집계
  const rWSum  = LOAN.records.reduce((s,r)=>r.r>0&&r.b>0?s+r.b*r.r:s, 0);
  const rBSum  = LOAN.records.reduce((s,r)=>r.r>0&&r.b>0?s+r.b:s,     0);
  const balAvgRate = rBSum > 0 ? rWSum / rBSum : 0;
  const balAvgAmt  = totalCnt > 0 ? total / totalCnt : 0;

  // 담보 그룹(g1) 기준 LTV
  const g1Grp     = grpData.find(g => g.id === 'g1');
  const g1Cats    = g1Grp ? g1Grp.cats : [];
  const g1LtvW    = g1Cats.reduce((s,c)=>{ const cc=catMap[c.id]||c; return s+(cc.ltvWSum||0); }, 0);
  const g1LtvApp  = g1Cats.reduce((s,c)=>{ const cc=catMap[c.id]||c; return s+(cc.ltvAppSum||0); }, 0);
  const g1Count   = g1Grp ? g1Grp.count : 0;
  const balKpiLtv = g1LtvApp > 0 ? g1LtvW / g1LtvApp * 100 : null;

  // ── 전월 데이터 (TREND 기반)
  const tBal  = TREND?.total?.balance;
  const tOver = TREND?.total?.overdue;
  const curLabel = (() => {
    if (!LOAN.base_date) return null;
    const d = new Date(LOAN.base_date);
    return String(d.getFullYear()).slice(2) + '.' + (d.getMonth()+1) + '월';
  })();
  const curIdx  = tBal ? tBal.findIndex(b => b.month === curLabel) : -1;
  const prevBal = (curIdx > 0) ? tBal[curIdx - 1] : (tBal && tBal.length >= 2 ? tBal[tBal.length - 2] : null);

  // 증감 표시 헬퍼
  const diffBadge = (cur, prev, fmt, unit='') => {
    if (prev == null || prev === 0) return '';
    const diff = cur - prev;
    const diffPct = (diff / Math.abs(prev) * 100);
    const isUp = diff > 0;
    const isZero = Math.abs(diff) < 0.001;
    if (isZero) return \`<span class="text-xs text-gray-400 mt-1 block">전월 동일</span>\`;
    const arrow = isUp ? '▲' : '▼';
    const color = isUp ? '#dc2626' : '#2563eb';
    return \`<span class="text-xs mt-1 block" style="color:\${color}">
      \${arrow} \${fmt(Math.abs(diff))}\${unit} (\${Math.abs(diffPct).toFixed(1)}%)
    </span>\`;
  };

  // 전월 값
  const prevTotal   = prevBal ? prevBal.amount * 100000000 : null;
  const prevCnt     = prevBal ? prevBal.count             : null;
  const prevRate    = prevBal ? prevBal.rate               : null;
  const prevAvgAmt  = (prevTotal != null && prevCnt) ? prevTotal / prevCnt : null;

  el.innerHTML=\`
<div class="space-y-5">
  <div class="flex items-center justify-between">
    <div><h2 class="text-lg font-bold">잔고 구성비 분석</h2>
    <p class="text-sm text-gray-500">총 잔고: <strong>\${fmtAmt(total)}</strong> (\${fmtN(totalCnt)}건) | 기준일: \${LOAN.base_date}</p></div>
    <button onclick="openSettings()" class="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100">
      <i class="fas fa-sliders-h"></i>카테고리 설정
    </button>
  </div>

  <!-- KPI 4종 -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#f0fdf4"><i class="fas fa-landmark" style="color:#059669"></i></div>
        <span class="badge badge-green">잔고</span>
      </div>
      <p class="text-2xl font-bold" style="color:#059669">\${fmtAmt(total)}</p>
      <p class="text-xs text-gray-500 mt-1">총 잔고 · \${fmtN(totalCnt)}건</p>
      \${diffBadge(total, prevTotal, v => fmtAmt(v))}
      \${prevCnt != null ? diffBadge(totalCnt, prevCnt, v => fmtN(Math.round(v)), '건') : ''}
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fff7ed"><i class="fas fa-percentage" style="color:#d97706"></i></div>
        <span class="badge badge-orange">금리</span>
      </div>
      <p class="text-2xl font-bold" style="color:#d97706">\${balAvgRate.toFixed(2)}%</p>
      <p class="text-xs text-gray-500 mt-1">평균 정상이율</p>
      \${diffBadge(balAvgRate, prevRate, v => v.toFixed(2), '%p')}
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#eff6ff"><i class="fas fa-coins" style="color:#2563eb"></i></div>
        <span class="badge badge-blue">평균</span>
      </div>
      <p class="text-2xl font-bold" style="color:#2563eb">\${(balAvgAmt/10000).toFixed(0)}만</p>
      <p class="text-xs text-gray-500 mt-1">건당 평균 잔고</p>
      \${diffBadge(balAvgAmt, prevAvgAmt, v => (v/10000).toFixed(0)+'만')}
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fdf4ff"><i class="fas fa-home" style="color:#9333ea"></i></div>
        <span class="badge badge-purple">LTV</span>
      </div>
      <p class="text-2xl font-bold" style="color:#9333ea">\${balKpiLtv !== null ? balKpiLtv.toFixed(1)+'%' : '-'}</p>
      <p class="text-xs text-gray-500 mt-1">담보 평균 LTV · \${fmtN(g1Count)}건</p>
    </div>
  </div>

  \${grpData.length>0?\`
  <!-- ── 그룹 구분선 바 ── -->
  <div class="flex rounded-xl overflow-hidden h-8">
    \${grpData.map(g=>\`<div class="flex items-center justify-center text-white text-xs font-bold" style="width:\${(g.balance/total*100).toFixed(1)}%;background:\${g.color}" title="\${g.name}: \${fmtAmt(g.balance)}">\${(g.balance/total*100)>=6?g.name:''}</div>\`).join('')}
  </div>

  <!-- ── 그룹별 카드 (담보|신용 나란히 — 1카드 리스트) ── -->
  <div class="grid gap-3" style="grid-template-columns:repeat(\${grpData.length},1fr)">
    \${grpData.map(g=>{
      const pct=(g.balance/total*100);
      const avgR=g.rateBalSum>0?(g.rateWSum/g.rateBalSum).toFixed(2):'-';
      const odR=g.count>0?((g.overdueAny/g.count)*100).toFixed(1):'0';
      const odRNum=parseFloat(odR);
      const odColor=odRNum>=8?'color:#dc2626':odRNum>=4?'color:#f97316':'color:#16a34a';
      // 카테고리 로우 항목
      const isCollGrp=g.id==='g1';
      const catRows=g.cats.map(c=>{
        const cc=catMap[c.id]||c;
        const cpct=(cc.balance/total*100);
        const gpct=g.balance>0?(cc.balance/g.balance*100):0;
        const cr=cc.rateBalSum>0?(cc.rateWSum/cc.rateBalSum).toFixed(2):'-';
        const avgLtv=isCollGrp&&cc.ltvAppSum>0?(cc.ltvWSum/cc.ltvAppSum*100).toFixed(1):null;
        const od10r=cc.balance>0?((cc.bal10Over||0)/cc.balance*100).toFixed(1):'0';
        const od10Num=parseFloat(od10r);
        const od10Style=od10Num>=8?'color:#dc2626;font-weight:700':od10Num>=4?'color:#f97316':'color:#16a34a';
        return \`<tr style="border-top:1px solid #f3f4f6">
          <td style="padding:6px 8px;width:10px">
            <div style="width:8px;height:8px;border-radius:50%;background:\${cc.color};flex-shrink:0"></div>
          </td>
          <td style="padding:6px 4px;white-space:nowrap">
            <span style="font-size:12px;font-weight:700;color:#374151">\${cc.name}</span>
          </td>
          <td style="padding:6px 4px;text-align:right">
            <span style="font-size:13px;font-weight:900;color:\${cc.color}">\${cpct.toFixed(1)}%</span>
            <div style="font-size:10px;color:#9ca3af">그룹내 \${gpct.toFixed(1)}%</div>
          </td>
          <td style="padding:6px 4px;text-align:right">
            <span style="font-size:12px;font-weight:600;color:#1f2937">\${fmtAmt(cc.balance)}</span>
            <div style="font-size:10px;color:#9ca3af">\${fmtN(cc.count)}건</div>
          </td>
          <td style="padding:6px 4px;text-align:right">
            <span style="font-size:11px;color:#6b7280">금리 <b style="color:#374151">\${cr}%</b></span>
            \${avgLtv!==null?\`<div style="font-size:10px;color:#9ca3af">LTV <b style="color:#374151">\${avgLtv}%</b></div>\`:''}
          </td>
          <td style="padding:6px 8px;text-align:right">
            <span style="font-size:11px;\${od10Style}">연체 \${od10r}%</span>
          </td>
        </tr>\`;
      }).join('');
      return \`<div class="card" style="border-top:3px solid \${g.color};overflow:hidden">
        <!-- 그룹 헤더 행 -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px 8px;background:\${g.color}08">
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:10px;height:10px;border-radius:50%;background:\${g.color}"></div>
            <span style="font-size:13px;font-weight:700;color:#374151">\${g.name}</span>
            <span style="font-size:22px;font-weight:900;line-height:1;color:\${g.color}">\${pct.toFixed(1)}%</span>
          </div>
          <div style="display:flex;gap:10px;font-size:11px;color:#6b7280">
            <span>\${fmtAmt(g.balance)} / \${fmtN(g.count)}건</span>
            <span>금리 <b style="color:#374151">\${avgR}%</b></span>
            <span>연체 <b style="\${odColor}">\${odR}%</b></span>
          </div>
        </div>
        <!-- 카테고리 리스트 테이블 -->
        <table style="width:100%;border-collapse:collapse">
          <tbody>\${catRows}</tbody>
        </table>
      </div>\`;
    }).join('')}
  </div>\`:''}
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
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-bar mr-2" style="color:#6366f1"></i>상품별 잔고 현황</h3>
      <div class="chart-wrap-lg"><canvas id="bal-prod-bar"></canvas></div>
    </div>
  </div>

  <!-- ── 상품별 상세 테이블 ── -->
  <div class="card overflow-hidden">
    <div class="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-2">
      <i class="fas fa-table text-emerald-600"></i>
      <h3 class="text-sm font-bold text-gray-700">상품별 상세</h3>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>카테고리</th>
        <th>상품명</th>
        <th class="text-right">건수</th>
        <th class="text-right">잔고</th>
        <th class="text-right">구성비</th>
        <th class="text-right">평균금리</th>
        <th class="text-right">평균LTV</th>
        <th class="text-right">10일이상 연체금</th>
        <th class="text-right">10일이상 연체율</th>
        <th class="text-right">30일초과 연체율</th>
        <th class="text-right">90일초과 연체율</th>
      </tr></thead>
      <tbody>\${Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).map(([p,v])=>{
        const cat=getCategoryOfProduct(p);
        const pct2=(v.balance/total*100).toFixed(1);
        const avgR2=v.rateBalSum>0?(v.rateWSum/v.rateBalSum).toFixed(2):'-';
        const avgLtv2=v.ltvAppSum>0?(v.ltvWSum/v.ltvAppSum*100).toFixed(1):'-';
        const b10over=v.bal30_+v.bal60+v.bal90+v.balMore;
        const b30over=v.bal60+v.bal90+v.balMore;
        const b90over=v.balMore;
        const od10r2=v.balance>0?(b10over/v.balance*100).toFixed(2):'0.00';
        const od30r2=v.balance>0?(b30over/v.balance*100).toFixed(2):'0.00';
        const od90r2=v.balance>0?(b90over/v.balance*100).toFixed(2):'0.00';
        return \`<tr>
          <td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
          <td class="font-medium">\${p}</td>
          <td class="text-right">\${fmtN(v.count)}건</td>
          <td class="text-right font-semibold">\${fmtAmt(v.balance)}</td>
          <td class="text-right"><div class="flex items-center justify-end gap-2"><div class="progress-bar w-14"><div class="progress-fill" style="width:\${pct2}%;background:\${cat.color}"></div></div><span>\${pct2}%</span></div></td>
          <td class="text-right">\${avgR2}%</td>
          <td class="text-right">\${avgLtv2!=='-'?avgLtv2+'%':'-'}</td>
          <td class="text-right \${b10over>0?'text-orange-500 font-semibold':''}">\${b10over>0?fmtAmt(b10over):'-'}</td>
          <td class="text-right \${parseFloat(od10r2)>=8?'text-red-600 font-bold':parseFloat(od10r2)>=4?'text-orange-500':'text-green-600'}">
            \${od10r2}%</td>
          <td class="text-right \${parseFloat(od30r2)>=8?'text-red-600 font-bold':parseFloat(od30r2)>=4?'text-orange-500':'text-green-600'}">
            \${od30r2}%</td>
          <td class="text-right \${parseFloat(od90r2)>=8?'text-red-600 font-bold':parseFloat(od90r2)>=4?'text-orange-500':'text-green-600'}">
            \${od90r2}%</td>
        </tr>\`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>\`;
  setTimeout(()=>{
    mkPie('bal-pie',catData.map(c=>c.name),catData.map(c=>c.balance),catData.map(c=>c.color));
    const pArr2=Object.entries(pMap).sort((a,b)=>b[1].balance-a[1].balance).slice(0,15);
    mkBar('bal-prod-bar',pArr2.map(([p])=>p),[{label:'잔고',data:pArr2.map(([,v])=>v.balance/100000000),backgroundColor:pArr2.map(([p])=>getCategoryOfProduct(p).color+'cc')}],{extra:{scales:{y:{ticks:{callback:v=>v.toFixed(0)+'억',font:{size:10}},grid:{color:'#f3f4f6'}},x:{ticks:{font:{size:10}}}},plugins:{legend:{labels:{font:{size:11},boxWidth:12}}}}});
  },50);
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
      <table class="data-table"><thead><tr><th>#</th><th>상품명</th><th>카테고리</th><th>건수</th><th>잔고</th><th>구성비</th><th>평균금리</th><th>평균LTV</th><th>10일이상 연체금</th><th>10일이상 연체율</th><th>30일초과(%)</th><th>90일초과(%)</th></tr></thead>
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
        <td class="\${parseFloat(od10r)>=8?'text-red-600 font-bold':parseFloat(od10r)>=4?'text-orange-500':'text-green-600'}">\${od10r}%</td>
        <td class="\${parseFloat(od30r)>=8?'text-red-600 font-bold':parseFloat(od30r)>=4?'text-orange-500':'text-green-600'}">\${od30r}%</td>
        <td class="\${parseFloat(od90r)>=8?'text-red-600 font-bold':parseFloat(od90r)>=4?'text-orange-500':'text-green-600'}">\${od90r}%</td></tr>\`;}).join('')}
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

// ==================== 에이전트 잔고구성비 카드 빌더 ====================
function buildAgentGroupBalanceCards(agGrpData, total) {
  if (!agGrpData || agGrpData.length === 0) return '';

  // 전체 데이터 캐시 (필터 갱신용)
  _agGrpDataCache  = agGrpData;
  _agGrpTotalCache = total;

  // 필터 버튼 HTML
  const sortedAgCats = [...AGENT_CATEGORIES].sort(function(a,b){ return (a.order||99)-(b.order||99); });
  const filterBtns = '<button onclick="agGrpFilterToggle(&apos;__all__&apos;)" id="ag-grp-filter-__all__"'
    + ' style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;border:1px solid #4f46e5;background:#4f46e5;color:#fff;cursor:pointer;transition:all .15s">전체</button>'
    + sortedAgCats.map(function(c) {
      return '<button onclick="agGrpFilterToggle(&apos;' + c.id + '&apos;)" id="ag-grp-filter-' + c.id + '"'
        + ' style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;border:1px solid ' + c.color + '88;background:#fff;color:' + c.color + ';cursor:pointer;transition:all .15s">'
        + c.name + '</button>';
    }).join('');

  // 카드 HTML
  const cardsHtml = _buildBalanceCardItems(agGrpData, total);

  return '<div class="space-y-3">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
      + '<h3 class="text-sm font-bold text-gray-700"><i class="fas fa-layer-group mr-2 text-indigo-500"></i>카테고리별 잔고구성비 (담보·신용 구조)</h3>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'
        + '<span style="font-size:11px;color:#9ca3af">카테고리 필터:</span>'
        + filterBtns
      + '</div>'
    + '</div>'
    + '<div id="ag-grp-cards">' + cardsHtml + '</div>'
    + '</div>';
}

// 카드 아이템만 렌더링 (필터 적용)
function _buildBalanceCardItems(agGrpData, total) {
  // 시스템설정 order 기준 정렬
  const sortedCats = [...agGrpData].sort(function(a, b) {
    return (a.order || 99) - (b.order || 99);
  });

  // 필터 적용
  const filtered = sortedCats.filter(function(cat) {
    if (_agCatFilter.size === 0) return true;
    return _agCatFilter.has(cat.id);
  });

  if (filtered.length === 0) {
    return '<div style="text-align:center;padding:24px;color:#9ca3af;font-size:13px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">선택한 카테고리에 해당하는 데이터가 없습니다</div>';
  }

  // 상품 카테고리 order 맵 (설정 순서 기준)
  const catOrderMap = {};
  CATEGORIES.forEach(function(c, i) { catOrderMap[c.id] = c.order != null ? c.order : i + 1; });

  const cards = filtered.map(function(cat) {
    // 상품 그룹(담보/신용): GROUPS의 순서 기준
    const grpOrder = {};
    GROUPS.forEach(function(g, i) { grpOrder[g.id] = i; });
    const grpEntries = Object.values(cat.grpBal).sort(function(a, b) {
      return (grpOrder[a.id] !== undefined ? grpOrder[a.id] : 9) - (grpOrder[b.id] !== undefined ? grpOrder[b.id] : 9);
    });
    if (grpEntries.length === 0) return '';

    const cols = Math.min(grpEntries.length, 2);

    // 그룹 패널 생성
    const grpPanels = grpEntries.map(function(g, gi) {
      const gPct    = total > 0 ? (g.balance / total * 100) : 0;
      const gAvgR   = g.rateBalSum > 0 ? (g.rateWSum / g.rateBalSum).toFixed(2) : '-';
      const gOd10r  = g.balance > 0 ? (g.bal10Over / g.balance * 100).toFixed(1) : '0';
      const gOd10Num = parseFloat(gOd10r);
      const gOdColor = gOd10Num >= 8 ? '#dc2626' : gOd10Num >= 4 ? '#f97316' : '#16a34a';
      const gAvgLtv  = (g.id === 'g1' && g.ltvAppSum > 0) ? (g.ltvWSum / g.ltvAppSum * 100).toFixed(1) : null;
      const borderRight = gi < grpEntries.length - 1 ? '1px solid #e5e7eb' : 'none';

      // 카테고리 행: 설정 order 기준 정렬
      const catRowsHtml = Object.values(g.cats).sort(function(a, b) {
        return (catOrderMap[a.id] || 99) - (catOrderMap[b.id] || 99);
      }).map(function(c) {
        const cPct    = total > 0 ? (c.balance / total * 100) : 0;
        const cGpct   = g.balance > 0 ? (c.balance / g.balance * 100) : 0;
        const cAvgR   = c.rateBalSum > 0 ? (c.rateWSum / c.rateBalSum).toFixed(2) : '-';
        const cOd10r  = c.balance > 0 ? (c.bal10Over / c.balance * 100).toFixed(1) : '0';
        const cOd10Num = parseFloat(cOd10r);
        const cOdColor = cOd10Num >= 8 ? '#dc2626' : cOd10Num >= 4 ? '#f97316' : '#16a34a';
        const cOdWeight = cOd10Num >= 4 ? 700 : 400;
        const cAvgLtv  = (g.id === 'g1' && c.ltvAppSum > 0) ? (c.ltvWSum / c.ltvAppSum * 100).toFixed(1) : null;
        const ltvHtml  = cAvgLtv !== null ? '<div style="font-size:10px;color:#9ca3af">LTV <b style="color:#374151">' + cAvgLtv + '%</b></div>' : '';
        return '<tr style="border-top:1px solid #f3f4f6">'
          + '<td style="padding:5px 8px;width:12px"><div style="width:8px;height:8px;border-radius:50%;background:' + c.color + ';flex-shrink:0"></div></td>'
          + '<td style="padding:5px 4px;white-space:nowrap"><span style="font-size:12px;font-weight:700;color:#374151">' + c.name + '</span></td>'
          + '<td style="padding:5px 4px;text-align:right"><span style="font-size:13px;font-weight:900;color:' + c.color + '">' + cPct.toFixed(1) + '%</span><div style="font-size:10px;color:#9ca3af">그룹내 ' + cGpct.toFixed(1) + '%</div></td>'
          + '<td style="padding:5px 4px;text-align:right"><span style="font-size:12px;font-weight:600;color:#1f2937">' + fmtAmt(c.balance) + '</span><div style="font-size:10px;color:#9ca3af">' + fmtN(c.count) + '건</div></td>'
          + '<td style="padding:5px 4px;text-align:right"><span style="font-size:11px;color:#6b7280">금리 <b style="color:#374151">' + cAvgR + '%</b></span>' + ltvHtml + '</td>'
          + '<td style="padding:5px 8px;text-align:right"><span style="font-size:11px;color:' + cOdColor + ';font-weight:' + cOdWeight + '">연체 ' + cOd10r + '%</span></td>'
          + '</tr>';
      }).join('');

      const ltvHeaderHtml = gAvgLtv !== null ? '<span>LTV <b style="color:#374151">' + gAvgLtv + '%</b></span>' : '';

      return '<div style="border-right:' + borderRight + '">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px 6px;background:' + g.color + '08">'
          + '<div style="display:flex;align-items:center;gap:5px">'
            + '<div style="width:9px;height:9px;border-radius:50%;background:' + g.color + '"></div>'
            + '<span style="font-size:12px;font-weight:700;color:#374151">' + g.name + '</span>'
            + '<span style="font-size:20px;font-weight:900;line-height:1;color:' + g.color + '">' + gPct.toFixed(1) + '%</span>'
          + '</div>'
          + '<div style="display:flex;gap:8px;font-size:10px;color:#6b7280;flex-wrap:wrap;justify-content:flex-end">'
            + '<span>' + fmtAmt(g.balance) + ' / ' + fmtN(g.count) + '건</span>'
            + '<span>금리 <b style="color:#374151">' + gAvgR + '%</b></span>'
            + ltvHeaderHtml
            + '<span>연체 <b style="color:' + gOdColor + '">' + gOd10r + '%</b></span>'
          + '</div>'
        + '</div>'
        + '<table style="width:100%;border-collapse:collapse"><tbody>' + catRowsHtml + '</tbody></table>'
        + '</div>';
    }).join('');

    // 카테고리 합산 (전체 그룹 합계)
    const catTotalBal   = cat.balance;
    const catTotalCount = cat.count;
    const catTotalPct   = total > 0 ? (catTotalBal / total * 100) : 0;
    const catAvgR       = cat.rateBalSum > 0 ? (cat.rateWSum / cat.rateBalSum).toFixed(2) : '-';
    const catOd10r      = catTotalBal > 0 ? (cat.bal10Over / catTotalBal * 100).toFixed(1) : '0';
    // LTV: g1(담보) 그룹 합산
    const g1            = cat.grpBal && cat.grpBal['g1'];
    const catAvgLtv     = (g1 && g1.ltvAppSum > 0) ? (g1.ltvWSum / g1.ltvAppSum * 100).toFixed(1) : null;
    const catOd10Num    = parseFloat(catOd10r);
    const catOdColor    = catOd10Num >= 8 ? '#ef4444' : catOd10Num >= 4 ? '#f97316' : '#d1fae5';
    const catOdTextColor = catOd10Num >= 8 ? '#fff' : catOd10Num >= 4 ? '#fff' : '#065f46';
    const ltvSummary    = catAvgLtv !== null
      ? '<span style="font-size:11px;color:rgba(255,255,255,0.85)">LTV <b style="color:#fff">' + catAvgLtv + '%</b></span>'
      : '';

    return '<div class="card overflow-hidden">'
      + '<div style="background:' + cat.color + ';padding:7px 14px 7px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px">'
        + '<span style="color:#fff;font-size:13px;font-weight:700;white-space:nowrap">' + cat.name + '</span>'
        + '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end">'
          + '<span style="font-size:12px;color:rgba(255,255,255,0.9)">' + fmtAmt(catTotalBal) + ' / ' + fmtN(catTotalCount) + '건</span>'
          + '<span style="font-size:12px;color:rgba(255,255,255,0.85)">금리 <b style="color:#fff">' + catAvgR + '%</b></span>'
          + ltvSummary
          + '<span style="font-size:11px;background:' + catOdColor + ';color:' + catOdTextColor + ';padding:1px 7px;border-radius:999px;font-weight:700">연체 ' + catOd10r + '%</span>'
        + '</div>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:0">'
        + grpPanels
      + '</div>'
      + '</div>';
  }).join('');

  return cards;
}

// 잔고구성비 필터 토글
function agGrpFilterToggle(catId) {
  if (catId === '__all__') {
    _agCatFilter.clear();
  } else {
    if (_agCatFilter.has(catId)) {
      _agCatFilter.delete(catId);
    } else {
      _agCatFilter.add(catId);
    }
  }
  // 버튼 스타일 갱신 (에이전트 상세 테이블 버튼 + 잔고구성비 버튼 동시)
  _agCatFilterRefreshButtons();
  _agGrpFilterRefreshButtons();
  // 잔고구성비 카드 영역 갱신
  const grpCards = document.getElementById('ag-grp-cards');
  if (grpCards) grpCards.innerHTML = _buildBalanceCardItems(_agGrpDataCache, _agGrpTotalCache);
  // 에이전트 상세 테이블 tbody 갱신
  const tbody = document.getElementById('ag-detail-tbody');
  if (tbody) tbody.innerHTML = renderAgDetailRows(_agDetailArr, _agDetailTotal);
}

function _agGrpFilterRefreshButtons() {
  const allBtn = document.getElementById('ag-grp-filter-__all__');
  if (allBtn) {
    const isAll = _agCatFilter.size === 0;
    allBtn.style.background  = isAll ? '#4f46e5' : '#fff';
    allBtn.style.color       = isAll ? '#fff'    : '#4f46e5';
    allBtn.style.borderColor = isAll ? '#4f46e5' : '#c7d2fe';
  }
  AGENT_CATEGORIES.forEach(function(c) {
    const btn = document.getElementById('ag-grp-filter-' + c.id);
    if (!btn) return;
    const active = _agCatFilter.has(c.id);
    btn.style.background  = active ? c.color : '#fff';
    btn.style.color       = active ? '#fff'  : c.color;
    btn.style.borderColor = active ? c.color : c.color + '88';
  });
}

// ==================== 에이전트 상세 테이블 필터 ====================
let _agDetailArr = [];   // 현재 aArr 캐시 (필터 갱신용)
let _agDetailTotal = 0;  // 현재 total 캐시
let _agCatFilter = new Set(); // 선택된 카테고리 id 집합 (빈 Set = 전체)
let _agGrpDataCache  = []; // 잔고구성비 카드 데이터 캐시
let _agGrpTotalCache = 0;  // 잔고구성비 total 캐시

function renderAgDetailRows(aArr, total) {
  // 캐시 갱신
  _agDetailArr  = aArr;
  _agDetailTotal = total;

  // 필터 적용: 빈 Set이면 전체
  const rows = aArr.filter(function([a]) {
    if (_agCatFilter.size === 0) return true;
    const cat = getCategoryOfAgent(a);
    return _agCatFilter.has(cat.id);
  });

  if (rows.length === 0) {
    return '<tr><td colspan="15" style="text-align:center;padding:24px;color:#9ca3af;font-size:13px">선택한 카테고리에 해당하는 에이전트가 없습니다</td></tr>';
  }

  return rows.map(function([a, v], i) {
    const cat   = getCategoryOfAgent(a);
    const pct   = (v.balance / total * 100).toFixed(1);
    const avgR  = v.rateBalSum > 0 ? (v.rateWSum / v.rateBalSum).toFixed(2) : '-';
    const b10over = v.bal30_ + v.bal60 + v.bal90 + v.balMore;
    const b30over = v.bal60  + v.bal90 + v.balMore;
    const b90over = v.balMore;
    const od10r = v.balance > 0 ? (b10over / v.balance * 100).toFixed(2) : '0.00';
    const od30r = v.balance > 0 ? (b30over / v.balance * 100).toFixed(2) : '0.00';
    const od90r = v.balance > 0 ? (b90over / v.balance * 100).toFixed(2) : '0.00';
    const g1bal = (v.grpBal && v.grpBal['g1'] ? v.grpBal['g1'].balance : 0);
    const g2bal = (v.grpBal && v.grpBal['g2'] ? v.grpBal['g2'].balance : 0);
    const od10cls = parseFloat(od10r) >= 8 ? 'text-red-600 font-bold' : parseFloat(od10r) >= 4 ? 'text-orange-500' : 'text-green-600';
    const od30cls = parseFloat(od30r) >= 8 ? 'text-red-600 font-bold' : parseFloat(od30r) >= 4 ? 'text-orange-500' : 'text-green-600';
    const od90cls = parseFloat(od90r) >= 8 ? 'text-red-600 font-bold' : parseFloat(od90r) >= 4 ? 'text-orange-500' : 'text-green-600';
    return '<tr>'
      + '<td class="text-gray-400">' + (i + 1) + '</td>'
      + '<td class="font-medium">' + a + '</td>'
      + '<td><span class="badge" style="background:' + cat.color + '22;color:' + cat.color + '">' + cat.name + '</span></td>'
      + '<td class="text-right">' + fmtN(v.count) + '</td>'
      + '<td class="text-right font-semibold">' + fmtAmt(v.balance) + '</td>'
      + '<td class="text-right"><div class="flex items-center justify-end gap-2"><div class="progress-bar w-14"><div class="progress-fill" style="width:' + pct + '%;background:' + cat.color + '"></div></div><span>' + pct + '%</span></div></td>'
      + '<td class="text-right">' + avgR + '%</td>'
      + '<td class="text-right font-semibold" style="color:#1e40af">' + fmtAmt(g1bal) + '</td>'
      + '<td class="text-right text-xs text-blue-700">' + (v.balance > 0 ? (g1bal / v.balance * 100).toFixed(1) + '%' : '-') + '</td>'
      + '<td class="text-right font-semibold" style="color:#065f46">' + fmtAmt(g2bal) + '</td>'
      + '<td class="text-right text-xs text-green-700">' + (v.balance > 0 ? (g2bal / v.balance * 100).toFixed(1) + '%' : '-') + '</td>'
      + '<td class="text-right ' + (b10over > 0 ? 'text-orange-500 font-semibold' : '') + '">' + (b10over > 0 ? fmtAmt(b10over) : '-') + '</td>'
      + '<td class="text-right ' + od10cls + '">' + od10r + '%</td>'
      + '<td class="text-right ' + od30cls + '">' + od30r + '%</td>'
      + '<td class="text-right ' + od90cls + '">' + od90r + '%</td>'
      + '</tr>';
  }).join('');
}

function agCatFilterToggle(catId) {
  if (catId === '__all__') {
    _agCatFilter.clear();
  } else {
    if (_agCatFilter.has(catId)) {
      _agCatFilter.delete(catId);
    } else {
      _agCatFilter.add(catId);
    }
  }
  // 버튼 스타일 갱신 (두 필터 버튼 세트 동시)
  _agCatFilterRefreshButtons();
  _agGrpFilterRefreshButtons();
  // 테이블 tbody 갱신
  const tbody = document.getElementById('ag-detail-tbody');
  if (tbody) tbody.innerHTML = renderAgDetailRows(_agDetailArr, _agDetailTotal);
  // 잔고구성비 카드 영역 갱신
  const grpCards = document.getElementById('ag-grp-cards');
  if (grpCards) grpCards.innerHTML = _buildBalanceCardItems(_agGrpDataCache, _agGrpTotalCache);
}

function _agCatFilterRefreshButtons() {
  // 전체 버튼
  const allBtn = document.getElementById('ag-filter-__all__');
  if (allBtn) {
    const isAll = _agCatFilter.size === 0;
    allBtn.style.background = isAll ? '#4f46e5' : '#fff';
    allBtn.style.color      = isAll ? '#fff'    : '#4f46e5';
    allBtn.style.borderColor = isAll ? '#4f46e5' : '#c7d2fe';
  }
  // 카테고리 버튼
  AGENT_CATEGORIES.forEach(function(c) {
    const btn = document.getElementById('ag-filter-' + c.id);
    if (!btn) return;
    const active = _agCatFilter.has(c.id);
    btn.style.background  = active ? c.color : '#fff';
    btn.style.color       = active ? '#fff'  : c.color;
    btn.style.borderColor = active ? c.color : c.color + '88';
  });
}

// ==================== 페이지: 에이전트 분석 ====================
function renderAgent(el) {
  _agCatFilter.clear(); // 페이지 진입 시 필터 초기화
  const total=LOAN.records.reduce((s,r)=>s+r.b,0);
  const aMap=aggregateByAgent();
  const aArr=Object.entries(aMap).sort((a,b)=>b[1].balance-a[1].balance);
  const agGrpData=aggregateByAgentGroup();
  // ── 상품 카테고리별 에이전트 집계 (새 카드 섹션용)
  const prodCatData=aggregateByProductCatForAgent();

  // 에이전트 카테고리 기준 집계 (파이차트용)
  const catBal={};
  for(const [a,v] of aArr){
    const cat=getCategoryOfAgent(a);
    if(!catBal[cat.id]) catBal[cat.id]={name:cat.name,color:cat.color,balance:0,order:cat.order||99};
    catBal[cat.id].balance+=v.balance;
  }
  const catArr=Object.values(catBal).sort((a,b)=>b.balance-a.balance);

  el.innerHTML=\`
<div class="space-y-5">
  <h2 class="text-lg font-bold">에이전트(광고매체) 분석</h2>

  <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
    <!-- 카테고리 구성비 파이차트 (왼쪽 2/5) -->
    <div class="card p-5 lg:col-span-2">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2 text-green-500"></i>카테고리 구성비</h3>
      <div style="height:220px"><canvas id="ag-pie"></canvas></div>
      <div class="mt-3 space-y-1">
        \${catArr.map(c=>{
          const pct=total>0?(c.balance/total*100).toFixed(1):'0.0';
          return \`<div class="flex items-center justify-between text-xs py-0.5">
            <div class="flex items-center gap-1.5">
              <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:\${c.color};flex-shrink:0"></span>
              <span class="text-gray-700 font-medium">\${c.name}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold" style="color:\${c.color}">\${pct}%</span>
              <span class="text-gray-500 w-16 text-right">\${fmtAmt(c.balance)}</span>
            </div>
          </div>\`;
        }).join('')}
      </div>
    </div>
    <!-- 에이전트별 잔고 바차트 (오른쪽 3/5) -->
    <div class="card p-5 lg:col-span-3">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-users mr-2 text-blue-500"></i>에이전트별 잔고</h3>
      <div class="chart-wrap-lg"><canvas id="ag-bar"></canvas></div>
    </div>
  </div>

  <!-- ── 에이전트 카테고리별 잔고구성비 (담보/신용) ── -->
  \${buildAgentGroupBalanceCards(agGrpData,total)}

  <div class="card overflow-hidden">
    <div class="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold text-gray-700 flex-shrink-0"><i class="fas fa-table mr-2 text-indigo-500"></i>에이전트별 상세</h3>
      <!-- 카테고리 필터 버튼 -->
      <div class="flex flex-wrap gap-1.5 items-center justify-end">
        <span class="text-xs text-gray-400 flex-shrink-0">카테고리 필터:</span>
        <button onclick="agCatFilterToggle('__all__')" id="ag-filter-__all__"
          class="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
          style="background:#4f46e5;color:#fff;border-color:#4f46e5">전체</button>
        \${[...AGENT_CATEGORIES].sort((a,b)=>(a.order||99)-(b.order||99)).map(c=>\`
        <button onclick="agCatFilterToggle('\${c.id}')" id="ag-filter-\${c.id}"
          class="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
          style="background:#fff;color:\${c.color};border-color:\${c.color}88">\${c.name}</button>
        \`).join('')}
      </div>
    </div>
    <div class="overflow-auto">
      <table class="data-table"><thead><tr>
        <th>#</th><th>에이전트</th><th>카테고리</th><th class="text-right">건수</th><th class="text-right">잔고</th>
        <th class="text-right">구성비</th><th class="text-right">평균금리</th>
        <th class="text-right" style="color:#1e40af">담보 잔고</th><th class="text-right" style="color:#1e40af">담보 비중</th>
        <th class="text-right" style="color:#065f46">신용 잔고</th><th class="text-right" style="color:#065f46">신용 비중</th>
        <th class="text-right">10일이상 연체금</th><th class="text-right">10일이상 연체율</th>
        <th class="text-right">30일초과(%)</th><th class="text-right">90일초과(%)</th>
      </tr></thead>
      <tbody id="ag-detail-tbody">\${renderAgDetailRows(aArr,total)}</tbody>
    </table>
    </div>
  </div>

  <!-- ── 상품별 에이전트 구성비 ── -->
  \${prodCatData.length>0?\`
  <div class="card overflow-hidden">
    <div class="px-5 pt-4 pb-3 border-b border-gray-100">
      <h3 class="text-sm font-bold text-gray-700"><i class="fas fa-layer-group mr-2 text-orange-500"></i>상품별 에이전트구성비</h3>
    </div>
    <div class="p-4">
      <div class="grid gap-3" style="grid-template-columns:repeat(\${Math.min(prodCatData.length,3)},1fr)">
        \${prodCatData.map(c=>{
          const cpct=total>0?(c.totalBalance/total*100):0;
          const agentRows=c.agents.map(ag=>{
            const apct=c.totalBalance>0?(ag.balance/c.totalBalance*100):0;
            const totpct=total>0?(ag.balance/total*100):0;
            const ar=ag.rateBalSum>0?(ag.rateWSum/ag.rateBalSum).toFixed(2):'-';
            const aod10r=ag.balance>0?((ag.bal10Over||0)/ag.balance*100).toFixed(1):'0';
            const aod10Num=parseFloat(aod10r);
            const aod10Style=aod10Num>=8?'color:#dc2626;font-weight:700':aod10Num>=4?'color:#f97316':'color:#16a34a';
            return \`<tr style="border-top:1px solid #f3f4f6">
              <td style="padding:6px 8px;width:10px">
                <div style="width:7px;height:7px;border-radius:50%;background:\${c.color}55;flex-shrink:0"></div>
              </td>
              <td style="padding:6px 4px;white-space:nowrap">
                <span style="font-size:12px;font-weight:600;color:#374151">\${ag.name}</span>
              </td>
              <td style="padding:6px 4px;text-align:right">
                <span style="font-size:12px;font-weight:800;color:\${c.color}">\${totpct.toFixed(1)}%</span>
                <div style="font-size:10px;color:#9ca3af">카테고리내 \${apct.toFixed(1)}%</div>
              </td>
              <td style="padding:6px 4px;text-align:right">
                <span style="font-size:12px;font-weight:600;color:#1f2937">\${fmtAmt(ag.balance)}</span>
                <div style="font-size:10px;color:#9ca3af">\${fmtN(ag.count)}건</div>
              </td>
              <td style="padding:6px 4px;text-align:right">
                <span style="font-size:11px;color:#6b7280">금리 <b style="color:#374151">\${ar}%</b></span>
              </td>
              <td style="padding:6px 8px;text-align:right">
                <span style="font-size:11px;\${aod10Style}">연체 \${aod10r}%</span>
              </td>
            </tr>\`;
          }).join('');
          const cAvgR=c.rateBalSum>0?(c.rateWSum/c.rateBalSum).toFixed(2):'-';
          const cOd10r=c.totalBalance>0?((c.bal10Over||0)/c.totalBalance*100).toFixed(1):'0';
          const cOd10Num=parseFloat(cOd10r);
          const cOdColor=cOd10Num>=8?'#dc2626':cOd10Num>=4?'#f97316':'#16a34a';
          return \`<div class="card" style="border-top:3px solid \${c.color};overflow:hidden">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px 8px;background:\${c.color}08">
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:10px;height:10px;border-radius:50%;background:\${c.color}"></div>
                <span style="font-size:13px;font-weight:700;color:#374151">\${c.name}</span>
                <span style="font-size:22px;font-weight:900;line-height:1;color:\${c.color}">\${cpct.toFixed(1)}%</span>
              </div>
              <div style="display:flex;gap:10px;font-size:11px;color:#6b7280;flex-wrap:wrap;justify-content:flex-end">
                <span>\${fmtAmt(c.totalBalance)} / \${fmtN(c.totalCount)}건</span>
                <span>금리 <b style="color:#374151">\${cAvgR}%</b></span>
                <span>연체 <b style="color:\${cOdColor}">\${cOd10r}%</b></span>
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse">
              <tbody>\${agentRows}</tbody>
            </table>
          </div>\`;
        }).join('')}
      </div>
    </div>
  </div>\`:''}
</div>\`;
  setTimeout(()=>{
    // 파이차트: 카테고리 기준
    mkPie('ag-pie',catArr.map(c=>c.name),catArr.map(c=>c.balance),catArr.map(c=>c.color));
    // 바차트: 에이전트별 (카테고리 색상 적용)
    const top=aArr.slice(0,12);
    mkBar('ag-bar',top.map(([a])=>a),[{label:'잔고',data:top.map(([,v])=>v.balance/100000000),backgroundColor:top.map(([a])=>getCategoryOfAgent(a).color+'cc')}],{extra:{indexAxis:'y',scales:{x:{ticks:{callback:v=>v+'억'}},y:{ticks:{font:{size:10}}}}}});
  },50);
}

// ==================== 페이지: 신규대출 현황 ====================
let newLoanSelectedKey = null; // 현재 선택된 계약 기준월 key

function renderNewLoan(el) {
  const contractDB = getContractDB();
  const keys = getContractKeys(); // 최신순

  // 사이드바 배지 갱신
  const badge = document.getElementById('sb-newloan-badge');
  if (badge) badge.textContent = keys.length > 0 ? keys.length : '-';

  // 데이터 없을 때
  if (keys.length === 0) {
    el.innerHTML = \`<div class="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
      <i class="fas fa-file-signature text-5xl text-green-200"></i>
      <p class="text-lg font-medium text-gray-500">계약리스트 데이터가 없습니다</p>
      <p class="text-sm">계약리스트를 업로드하면 신규대출 현황을 분석할 수 있습니다</p>
      <button onclick="goPage('contract')" class="mt-2 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
        <i class="fas fa-upload mr-2"></i>계약리스트 업로드
      </button>
    </div>\`;
    return;
  }

  // 선택된 키가 없거나 유효하지 않으면 최신 키로
  if (!newLoanSelectedKey || !contractDB[newLoanSelectedKey]) {
    newLoanSelectedKey = keys[0];
  }
  const d    = contractDB[newLoanSelectedKey];
  const allRecs = filterByMgmtTeam(d.records || []);  // 관리팀 필터 적용

  // ── 만기연장(전환) 제외: 신규/추가대출/재대출만 집계
  // ct 필드가 없는 구버전 데이터는 전체 포함 (하위 호환)
  const hasCt = allRecs.some(r => r.ct && r.ct.length > 0);
  const EXCLUDE_CT = ['만기연장(전환)', '만기연장'];
  const recs = hasCt
    ? allRecs.filter(r => !EXCLUDE_CT.includes(r.ct))
    : allRecs;
  const excludedCount = allRecs.length - recs.length;

  // ── 기본 집계
  const totalAmt   = recs.reduce((s,r) => s + (r.amt||0), 0);
  const totalCount = recs.length;
  const rWSum      = recs.reduce((s,r) => r.r>0 ? s + r.amt*r.r : s, 0);
  const rBSum      = recs.reduce((s,r) => r.r>0 ? s + r.amt     : s, 0);
  const avgRate    = rBSum > 0 ? rWSum / rBSum : 0;
  const colRecs    = recs.filter(r => r.appraised > 0 && r.loanAmt > 0);
  const ltvW       = colRecs.reduce((s,r) => s + r.loanAmt,   0);
  const ltvApp     = colRecs.reduce((s,r) => s + r.appraised, 0);
  const avgLtv     = ltvApp > 0 ? ltvW / ltvApp * 100 : null;
  const avgAmtPer  = totalCount > 0 ? totalAmt / totalCount : 0;

  // ── 상품별 집계
  const pMap = {};
  recs.forEach(r => {
    const p = r.p || '기타';
    if (!pMap[p]) pMap[p] = { count:0, amt:0, rWSum:0, rBSum:0, ltvW:0, ltvApp:0 };
    pMap[p].count++; pMap[p].amt += r.amt;
    if (r.r > 0) { pMap[p].rWSum += r.amt * r.r; pMap[p].rBSum += r.amt; }
    if (r.appraised > 0 && r.loanAmt > 0) { pMap[p].ltvW += r.loanAmt; pMap[p].ltvApp += r.appraised; }
  });
  const pArr = Object.entries(pMap).sort((a,b) => b[1].amt - a[1].amt);

  // ── 에이전트별 집계
  const aMap = {};
  recs.forEach(r => {
    const a = r.a || '기타';
    if (!aMap[a]) aMap[a] = { count:0, amt:0, rWSum:0, rBSum:0 };
    aMap[a].count++; aMap[a].amt += r.amt;
    if (r.r > 0) { aMap[a].rWSum += r.amt * r.r; aMap[a].rBSum += r.amt; }
  });
  const aArr = Object.entries(aMap).sort((a,b) => b[1].amt - a[1].amt);

  // ── 상품 카테고리별 집계
  const catMap = {};
  recs.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '기타');
    if (!catMap[cat.id]) catMap[cat.id] = { ...cat, count:0, amt:0 };
    catMap[cat.id].count++; catMap[cat.id].amt += r.amt;
  });
  const catArr = Object.values(catMap).sort((a,b) => b.amt - a.amt);

  // ── 상품 그룹(담보/신용)별 + 그룹 내 카테고리별 집계 (2번째 스크린샷 패널용)
  const grpPanelMap = {};
  GROUPS.forEach(g => {
    grpPanelMap[g.id] = {
      id: g.id, name: g.name, color: g.color,
      count: 0, amt: 0, rWSum: 0, rBSum: 0, ltvW: 0, ltvApp: 0, bal10Over: 0,
      cats: {}
    };
  });
  recs.forEach(r => {
    const cat  = getCategoryOfProduct(r.p || '기타');
    const grp  = getGroupOfCategory(cat.id);
    const gm   = grpPanelMap[grp.id];
    if (!gm) return;
    gm.count++; gm.amt += r.amt;
    if (r.r > 0) { gm.rWSum += r.amt * r.r; gm.rBSum += r.amt; }
    if (r.appraised > 0 && r.loanAmt > 0) { gm.ltvW += r.loanAmt; gm.ltvApp += r.appraised; }
    if (!gm.cats[cat.id]) gm.cats[cat.id] = {
      id: cat.id, name: cat.name, color: cat.color, order: cat.order || 99,
      count: 0, amt: 0, rWSum: 0, rBSum: 0, ltvW: 0, ltvApp: 0
    };
    const cm = gm.cats[cat.id];
    cm.count++; cm.amt += r.amt;
    if (r.r > 0) { cm.rWSum += r.amt * r.r; cm.rBSum += r.amt; }
    if (r.appraised > 0 && r.loanAmt > 0) { cm.ltvW += r.loanAmt; cm.ltvApp += r.appraised; }
  });
  // 사용된 그룹만, order 기준 정렬
  const grpPanelArr = Object.values(grpPanelMap)
    .filter(g => g.count > 0)
    .sort((a,b) => {
      const oi = GROUPS.findIndex(g=>g.id===a.id);
      const oj = GROUPS.findIndex(g=>g.id===b.id);
      return oi - oj;
    });

  // ── 담보 그룹(g1) 기준 LTV KPI (담보/신용 패널의 담보 그룹과 동일한 값)
  const g1Data    = grpPanelMap['g1'] || { count: 0, ltvW: 0, ltvApp: 0 };
  const kpiLtv    = g1Data.ltvApp > 0 ? g1Data.ltvW / g1Data.ltvApp * 100 : null;
  const kpiLtvCnt = g1Data.count;

  // ── 일별 집계
  const dayMap = {};
  recs.forEach(r => {
    const dt = (r.dt || '').slice(0, 10) || '미상';
    if (!dayMap[dt]) dayMap[dt] = { count:0, amt:0 };
    dayMap[dt].count++; dayMap[dt].amt += r.amt;
  });
  const dayArr = Object.entries(dayMap).filter(([d]) => d !== '미상').sort((a,b) => a[0].localeCompare(b[0]));

  // ── 금리 구간별 집계
  const rateBands = [
    { label:'9~11%',  min:9,  max:11,  color:'#059669' },
    { label:'11~14%', min:11, max:14,  color:'#0891b2' },
    { label:'14~17%', min:14, max:17,  color:'#d97706' },
    { label:'17~19%', min:17, max:19,  color:'#ea580c' },
    { label:'19%이상',min:19, max:100, color:'#dc2626' },
  ];
  rateBands.forEach(b => {
    const rs = recs.filter(r => r.r > b.min && r.r <= b.max);
    b.count = rs.length; b.amt = rs.reduce((s,r) => s + r.amt, 0);

    // ── 상품 카테고리별 분류
    b.byCat = {};
    CATEGORIES.forEach(c => { b.byCat[c.id] = { name:c.name, color:c.color, count:0, amt:0 }; });
    b.byCat['__none__'] = { name:'미분류', color:'#9ca3af', count:0, amt:0 };
    rs.forEach(r => {
      const cat = getCategoryOfProduct(r.p || '');
      const cm  = b.byCat[cat.id] || b.byCat['__none__'];
      cm.count++; cm.amt += r.amt;
    });

    // ── 에이전트 카테고리별 분류
    b.byAgentCat = {};
    AGENT_CATEGORIES.forEach(c => { b.byAgentCat[c.id] = { name:c.name, color:c.color, count:0, amt:0 }; });
    b.byAgentCat['__none__'] = { name:'미분류', color:'#9ca3af', count:0, amt:0 };
    rs.forEach(r => {
      const cat = getCategoryOfAgent(r.a || '');
      const cm  = b.byAgentCat[cat.id] || b.byAgentCat['__none__'];
      cm.count++; cm.amt += r.amt;
    });
  });

  // ── 금리구간 분류표용: 사용 상품카테고리·에이전트카테고리 목록 (count>0인 것만)
  const rateUsedCats      = CATEGORIES.filter(c => rateBands.some(b => b.byCat[c.id]?.count > 0));
  const rateUsedAgentCats = AGENT_CATEGORIES.filter(c => rateBands.some(b => b.byAgentCat[c.id]?.count > 0));

  // ── 월 선택 탭
  const monthTabHtml = keys.length > 1 ? \`
  <div class="flex gap-1.5 flex-wrap">
    \${keys.map(k => {
      const y = k.slice(0,4), mo = parseInt(k.slice(4));
      const isActive = k === newLoanSelectedKey;
      return \`<button onclick="selectNewLoanMonth('\${k}')"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition \${isActive
          ? 'bg-green-600 text-white border-green-600'
          : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600'}">
        \${y}년 \${mo}월
      </button>\`;
    }).join('')}
  </div>\` : '';

  const yk  = newLoanSelectedKey.slice(0,4);
  const mok = parseInt(newLoanSelectedKey.slice(4));

  // ── 전월 데이터 추출 (TREND.total.new_loans 기준)
  // 선택 월 키(예: "202607") → TREND 라벨(예: "26.7월")로 변환
  const nlCurLabel  = String(yk).slice(2) + '.' + mok + '월';
  const nlNewArr    = TREND?.total?.new_loans;
  const nlBalArr    = TREND?.total?.balance;
  const nlCurIdx    = nlNewArr ? nlNewArr.findIndex(n => n.month === nlCurLabel) : -1;
  const nlPrevNew   = (nlCurIdx > 0) ? nlNewArr[nlCurIdx - 1] : null;
  const nlPrevBal   = (nlCurIdx > 0 && nlBalArr) ? nlBalArr[nlCurIdx - 1] : null;

  // 전월 값
  const prevTotalAmt   = nlPrevNew  ? nlPrevNew.amount  * 100000000 : null;
  const prevTotalCount = nlPrevNew  ? nlPrevNew.approve               : null;
  const prevAvgRate    = nlPrevBal  ? nlPrevBal.rate                  : null;
  const prevAvgAmtPer  = (prevTotalAmt != null && prevTotalCount)
                         ? prevTotalAmt / prevTotalCount : null;

  // 증감 배지 헬퍼
  const nlDiff = (cur, prev, fmt, unit='') => {
    if (prev == null || prev === 0) return '';
    const diff = cur - prev;
    const pct  = diff / Math.abs(prev) * 100;
    if (Math.abs(diff) < 0.001) return \`<span class="text-xs text-gray-400 mt-1 block">전월 동일</span>\`;
    const up    = diff > 0;
    const color = up ? '#dc2626' : '#2563eb';
    const arrow = up ? '▲' : '▼';
    return \`<span class="text-xs mt-1 block" style="color:\${color}">\${arrow} \${fmt(Math.abs(diff))}\${unit} (\${Math.abs(pct).toFixed(1)}%)</span>\`;
  };

  el.innerHTML = \`
<div class="space-y-5">

  <!-- 헤더 -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h2 class="text-lg font-bold">신규대출 현황</h2>
      <p class="text-sm text-gray-500">계약리스트 기준 신규 실행 현황 | \${yk}년 \${mok}월 | 기준일: \${d.base_date}</p>
      \${excludedCount > 0 ? \`<p class="text-xs text-amber-600 mt-0.5"><i class="fas fa-info-circle mr-1"></i>만기연장(전환) \${fmtN(excludedCount)}건 제외 · 신규/추가대출/재대출만 집계</p>\` : (hasCt ? '<p class="text-xs text-gray-400 mt-0.5"><i class="fas fa-check-circle mr-1 text-green-500"></i>만기연장(전환) 해당 없음</p>' : '<p class="text-xs text-gray-400 mt-0.5"><i class="fas fa-info-circle mr-1"></i>계약구분 미포함 데이터 (전체 집계)</p>')}
    </div>
    \${monthTabHtml}
  </div>

  <!-- KPI 4종 -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#f0fdf4"><i class="fas fa-file-signature" style="color:#059669"></i></div>
        <span class="badge badge-green">신규</span>
      </div>
      <p class="text-2xl font-bold" style="color:#059669">\${fmtAmt(totalAmt)}</p>
      <p class="text-xs text-gray-500 mt-1">총 신규 실행액 · \${fmtN(totalCount)}건</p>
      \${nlDiff(totalAmt, prevTotalAmt, v => fmtAmt(v))}
      \${prevTotalCount != null ? nlDiff(totalCount, prevTotalCount, v => fmtN(Math.round(v)), '건') : ''}
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fff7ed"><i class="fas fa-percentage" style="color:#d97706"></i></div>
        <span class="badge badge-orange">금리</span>
      </div>
      <p class="text-2xl font-bold" style="color:#d97706">\${avgRate.toFixed(2)}%</p>
      <p class="text-xs text-gray-500 mt-1">평균 정상이율</p>
      \${nlDiff(avgRate, prevAvgRate, v => v.toFixed(2), '%p')}
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#eff6ff"><i class="fas fa-coins" style="color:#2563eb"></i></div>
        <span class="badge badge-blue">평균</span>
      </div>
      <p class="text-2xl font-bold" style="color:#2563eb">\${(avgAmtPer/10000).toFixed(0)}만</p>
      <p class="text-xs text-gray-500 mt-1">건당 평균 대출액</p>
      \${nlDiff(avgAmtPer, prevAvgAmtPer, v => (v/10000).toFixed(0)+'만')}
    </div>
    <div class="kpi-card p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fdf4ff"><i class="fas fa-home" style="color:#9333ea"></i></div>
        <span class="badge badge-purple">LTV</span>
      </div>
      <p class="text-2xl font-bold" style="color:#9333ea">\${kpiLtv !== null ? kpiLtv.toFixed(1)+'%' : '-'}</p>
      <p class="text-xs text-gray-500 mt-1">담보 평균 LTV · \${fmtN(kpiLtvCnt)}건</p>
    </div>
  </div>

  <!-- 담보/신용 그룹별 구성 패널 + 카테고리 구성비 -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- 카테고리 구성비 파이 (1/3) -->
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2 text-blue-500"></i>카테고리 구성비</h3>
      <div style="height:200px"><canvas id="nl-cat-pie"></canvas></div>
      <div class="mt-3 space-y-1">
        \${catArr.map(c => {
          const pct = (c.amt / totalAmt * 100).toFixed(1);
          return \`<div class="flex items-center gap-2 text-xs">
            <div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:\${c.color}"></div>
            <span class="flex-1 truncate">\${c.name}</span>
            <span class="font-bold">\${pct}%</span>
            <span class="text-gray-400">\${fmtAmt(c.amt)}</span>
          </div>\`;
        }).join('')}
      </div>
    </div>
    <!-- 담보/신용 패널 (2/3) -->
    <div class="card overflow-hidden lg:col-span-2">
      <div style="display:grid;grid-template-columns:repeat(\${grpPanelArr.length},1fr)">
        \${grpPanelArr.map((g,gi) => {
          const gPct    = totalAmt > 0 ? (g.amt / totalAmt * 100) : 0;
          const gAvgR   = g.rBSum > 0 ? (g.rWSum / g.rBSum).toFixed(2) : '-';
          const gAvgLtv = g.ltvApp > 0 ? (g.ltvW / g.ltvApp * 100).toFixed(1) : null;
          const borderR = gi < grpPanelArr.length - 1 ? 'border-right:1px solid #e5e7eb' : '';

          // 카테고리 행 (order 정렬)
          const catRows = Object.values(g.cats)
            .sort((a,b) => (a.order||99)-(b.order||99))
            .map(c => {
              const cPct  = totalAmt > 0 ? (c.amt / totalAmt * 100) : 0;
              const cGpct = g.amt > 0 ? (c.amt / g.amt * 100) : 0;
              const cAvgR = c.rBSum > 0 ? (c.rWSum / c.rBSum).toFixed(2) : '-';
              const cLtv  = c.ltvApp > 0 ? (c.ltvW / c.ltvApp * 100).toFixed(1) : null;
              const ltvHtml = cLtv !== null
                ? \`<div style="font-size:10px;color:#9ca3af">LTV <b style="color:#374151">\${cLtv}%</b></div>\`
                : '';
              return \`<tr style="border-top:1px solid #f3f4f6">
                <td style="padding:7px 8px;width:12px">
                  <div style="width:9px;height:9px;border-radius:50%;background:\${c.color}"></div>
                </td>
                <td style="padding:7px 4px;white-space:nowrap">
                  <span style="font-size:12px;font-weight:700;color:#374151">\${c.name}</span>
                </td>
                <td style="padding:7px 4px;text-align:right">
                  <span style="font-size:14px;font-weight:900;color:\${c.color}">\${cPct.toFixed(1)}%</span>
                  <div style="font-size:10px;color:#9ca3af">그룹내 \${cGpct.toFixed(1)}%</div>
                </td>
                <td style="padding:7px 4px;text-align:right">
                  <span style="font-size:12px;font-weight:600;color:#1f2937">\${fmtAmt(c.amt)}</span>
                  <div style="font-size:10px;color:#9ca3af">\${fmtN(c.count)}건</div>
                </td>
                <td style="padding:7px 4px;text-align:right">
                  <span style="font-size:11px;color:#6b7280">금리 <b style="color:#374151">\${cAvgR}%</b></span>
                  \${ltvHtml}
                </td>
              </tr>\`;
            }).join('');

          return \`<div style="\${borderR}">
            <!-- 그룹 헤더 -->
            <div style="background:\${g.color};padding:8px 14px;text-align:center">
              <span style="color:#fff;font-size:13px;font-weight:700">\${g.name}</span>
            </div>
            <!-- 그룹 합계 행 -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px 7px;background:\${g.color}08;border-bottom:1px solid \${g.color}20">
              <div style="display:flex;align-items:center;gap:5px">
                <div style="width:9px;height:9px;border-radius:50%;background:\${g.color}"></div>
                <span style="font-size:12px;font-weight:700;color:#374151">\${g.name}</span>
                <span style="font-size:20px;font-weight:900;line-height:1;color:\${g.color}">\${gPct.toFixed(1)}%</span>
              </div>
              <div style="display:flex;gap:8px;font-size:10px;color:#6b7280;flex-wrap:wrap;justify-content:flex-end">
                <span>\${fmtAmt(g.amt)} / \${fmtN(g.count)}건</span>
                <span>금리 <b style="color:#374151">\${gAvgR}%</b></span>
                \${gAvgLtv ? \`<span>LTV <b style="color:#374151">\${gAvgLtv}%</b></span>\` : ''}
              </div>
            </div>
            <!-- 카테고리 테이블 -->
            <table style="width:100%;border-collapse:collapse">
              <tbody>\${catRows}</tbody>
            </table>
          </div>\`;
        }).join('')}
      </div>
    </div>
  </div>

  <!-- 상품별 + 에이전트별 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- 상품별 -->
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-tags mr-2 text-indigo-500"></i>상품별 신규 실행</h3>
      <div class="chart-wrap mb-4"><canvas id="nl-prod-bar"></canvas></div>
      <div class="overflow-auto" style="max-height:280px">
        <table class="data-table">
          <thead><tr><th>#</th><th>상품명</th><th>카테고리</th><th>건수</th><th>대출액</th><th>구성비</th><th>평균금리</th><th>평균LTV</th></tr></thead>
          <tbody>\${pArr.map(([p,v],i) => {
            const cat = getCategoryOfProduct(p);
            const pct = (v.amt / totalAmt * 100).toFixed(1);
            const avgR2 = v.rBSum > 0 ? (v.rWSum / v.rBSum).toFixed(2) : '-';
            const ltvStr = v.ltvApp > 0 ? (v.ltvW / v.ltvApp * 100).toFixed(1)+'%' : '-';
            return \`<tr>
              <td class="text-gray-400">\${i+1}</td>
              <td class="font-medium">\${p}</td>
              <td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
              <td>\${fmtN(v.count)}</td>
              <td class="font-semibold">\${fmtAmt(v.amt)}</td>
              <td><div class="flex items-center gap-1.5"><div class="progress-bar w-14 flex-shrink-0"><div class="progress-fill" style="width:\${pct}%;background:\${cat.color}"></div></div><span>\${pct}%</span></div></td>
              <td>\${avgR2}%</td>
              <td>\${ltvStr}</td>
            </tr>\`;
          }).join('')}</tbody>
        </table>
      </div>
    </div>

    <!-- 에이전트별 -->
    <div class="card p-5">
      <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-users mr-2 text-teal-500"></i>에이전트별 신규 실행</h3>
      <div class="chart-wrap mb-4"><canvas id="nl-agent-bar"></canvas></div>
      <div class="overflow-auto" style="max-height:280px">
        <table class="data-table">
          <thead><tr><th>#</th><th>에이전트</th><th>카테고리</th><th>건수</th><th>대출액</th><th>구성비</th><th>평균금리</th><th>평균대출</th></tr></thead>
          <tbody>\${aArr.map(([a,v],i) => {
            const cat = getCategoryOfAgent(a);
            const pct = (v.amt / totalAmt * 100).toFixed(1);
            const avgR2 = v.rBSum > 0 ? (v.rWSum / v.rBSum).toFixed(2) : '-';
            const avgA  = v.count > 0 ? (v.amt / v.count / 10000).toFixed(0)+'만' : '-';
            return \`<tr>
              <td class="text-gray-400">\${i+1}</td>
              <td class="font-medium">\${a}</td>
              <td><span class="badge" style="background:\${cat.color}22;color:\${cat.color}">\${cat.name}</span></td>
              <td>\${fmtN(v.count)}</td>
              <td class="font-semibold">\${fmtAmt(v.amt)}</td>
              <td><div class="flex items-center gap-1.5"><div class="progress-bar w-14 flex-shrink-0"><div class="progress-fill bg-teal-400" style="width:\${pct}%"></div></div><span>\${pct}%</span></div></td>
              <td>\${avgR2}%</td>
              <td>\${avgA}</td>
            </tr>\`;
          }).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 금리 구간별 분포 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-4"><i class="fas fa-percentage mr-2 text-orange-500"></i>금리 구간별 실행 현황</h3>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      \${rateBands.map(b => {
        const pct = totalCount > 0 ? (b.count / totalCount * 100).toFixed(1) : '0';
        return \`<div class="rounded-xl p-3 border" style="background:\${b.color}0d;border-color:\${b.color}40">
          <div class="flex items-center gap-1.5 mb-1">
            <div class="w-2.5 h-2.5 rounded-full" style="background:\${b.color}"></div>
            <span class="text-xs font-bold text-gray-600">\${b.label}</span>
          </div>
          <p class="text-xl font-black" style="color:\${b.color}">\${fmtN(b.count)}건</p>
          <p class="text-xs text-gray-500 mt-0.5">\${fmtAmt(b.amt)}</p>
          <div class="progress-bar mt-1.5"><div class="progress-fill" style="width:\${pct}%;background:\${b.color}"></div></div>
          <p class="text-xs text-gray-400 mt-1">\${pct}%</p>
        </div>\`;
      }).join('')}
    </div>
    <div class="chart-wrap"><canvas id="nl-rate-bar"></canvas></div>

    <!-- 상품 카테고리 / 에이전트 카테고리 좌우 배치 -->
    <div class="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">

      <!-- 상품 카테고리별 분류 -->
      <div>
        <h4 class="text-xs font-bold text-gray-600 mb-3"><i class="fas fa-tags mr-1.5 text-blue-400"></i>상품 카테고리별 구분</h4>
        <div class="overflow-auto">
          <table class="data-table">
            <thead><tr>
              <th class="text-left">카테고리</th>
              \${rateBands.map(b => \`<th style="color:\${b.color}">\${b.label}</th>\`).join('')}
              <th>합계</th>
            </tr></thead>
            <tbody>
              \${rateUsedCats.map(c => {
                const rowTotal = rateBands.reduce((s,b) => s + (b.byCat[c.id]?.count||0), 0);
                const rowAmt   = rateBands.reduce((s,b) => s + (b.byCat[c.id]?.amt||0),   0);
                return \`<tr>
                  <td><span class="badge" style="background:\${c.color}22;color:\${c.color}">\${c.name}</span></td>
                  \${rateBands.map(b => {
                    const d = b.byCat[c.id] || {count:0,amt:0};
                    return d.count > 0
                      ? \`<td><b>\${fmtAmt(d.amt)}</b><br><span class="text-gray-400" style="font-size:10px">\${fmtN(d.count)}건</span></td>\`
                      : \`<td class="text-gray-300">-</td>\`;
                  }).join('')}
                  <td class="font-semibold">\${fmtAmt(rowAmt)}<br><span class="text-gray-400" style="font-size:10px">\${fmtN(rowTotal)}건</span></td>
                </tr>\`;
              }).join('')}
              <tr class="font-bold bg-gray-50">
                <td>합계</td>
                \${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style="font-size:10px;color:#6b7280">\${fmtN(b.count)}건</span></td>\`).join('')}
                <td><b>\${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}</b><br><span style="font-size:10px;color:#6b7280">\${fmtN(totalCount)}건</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 에이전트 카테고리별 분류 -->
      <div>
        <h4 class="text-xs font-bold text-gray-600 mb-3"><i class="fas fa-user-tag mr-1.5 text-teal-400"></i>에이전트 카테고리별 구분</h4>
        <div class="overflow-auto">
          <table class="data-table">
            <thead><tr>
              <th class="text-left">에이전트 카테고리</th>
              \${rateBands.map(b => \`<th style="color:\${b.color}">\${b.label}</th>\`).join('')}
              <th>합계</th>
            </tr></thead>
            <tbody>
              \${rateUsedAgentCats.map(c => {
                const rowTotal = rateBands.reduce((s,b) => s + (b.byAgentCat[c.id]?.count||0), 0);
                const rowAmt   = rateBands.reduce((s,b) => s + (b.byAgentCat[c.id]?.amt||0),   0);
                return \`<tr>
                  <td><span class="badge" style="background:\${c.color}22;color:\${c.color}">\${c.name}</span></td>
                  \${rateBands.map(b => {
                    const d = b.byAgentCat[c.id] || {count:0,amt:0};
                    return d.count > 0
                      ? \`<td><b>\${fmtAmt(d.amt)}</b><br><span class="text-gray-400" style="font-size:10px">\${fmtN(d.count)}건</span></td>\`
                      : \`<td class="text-gray-300">-</td>\`;
                  }).join('')}
                  <td class="font-semibold">\${fmtAmt(rowAmt)}<br><span class="text-gray-400" style="font-size:10px">\${fmtN(rowTotal)}건</span></td>
                </tr>\`;
              }).join('')}
              <tr class="font-bold bg-gray-50">
                <td>합계</td>
                \${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style="font-size:10px;color:#6b7280">\${fmtN(b.count)}건</span></td>\`).join('')}
                <td><b>\${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}</b><br><span style="font-size:10px;color:#6b7280">\${fmtN(totalCount)}건</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>


</div>\`;

  // ── 차트 렌더링
  const NL_COLORS = ['#2563eb','#059669','#7c3aed','#d97706','#0891b2','#dc2626','#6366f1','#0d9488','#c026d3','#ea580c','#84cc16','#64748b','#be185d','#92400e','#1d4ed8','#15803d'];
  setTimeout(() => {
    // 카테고리 파이
    mkPie('nl-cat-pie', catArr.map(c=>c.name), catArr.map(c=>c.amt), catArr.map(c=>c.color));
    // 상품별 가로 막대
    mkBar('nl-prod-bar', pArr.map(([p])=>p), [{
      label:'대출액(억)', data: pArr.map(([,v])=>v.amt/100000000),
      backgroundColor: pArr.map(([p]) => getCategoryOfProduct(p).color+'cc')
    }], { extra:{ indexAxis:'y', scales:{x:{ticks:{callback:v=>v.toFixed(1)+'억'}}, y:{ticks:{font:{size:10}}}}}});
    // 에이전트별 가로 막대
    mkBar('nl-agent-bar', aArr.map(([a])=>a), [{
      label:'대출액(억)', data: aArr.map(([,v])=>v.amt/100000000),
      backgroundColor: NL_COLORS.slice(0, aArr.length)
    }], { extra:{ indexAxis:'y', scales:{x:{ticks:{callback:v=>v.toFixed(1)+'억'}}, y:{ticks:{font:{size:10}}}}}});
    // 금리 구간 막대+라인
    mkBar('nl-rate-bar', rateBands.map(b=>b.label), [
      { label:'건수', data:rateBands.map(b=>b.count), backgroundColor:rateBands.map(b=>b.color+'cc'), yAxisID:'y' },
      { label:'대출액(억)', data:rateBands.map(b=>b.amt/100000000), type:'line', borderColor:'#64748b', backgroundColor:'transparent', yAxisID:'y1', borderWidth:2, pointRadius:4 }
    ], { extra:{ scales:{
      y:  { ticks:{ callback:v=>v+'건', font:{size:10} } },
      y1: { type:'linear', position:'right', grid:{drawOnChartArea:false}, ticks:{callback:v=>v.toFixed(1)+'억', font:{size:10}} }
    }}});
  }, 50);
}

function selectNewLoanMonth(key) {
  newLoanSelectedKey = key;
  renderNewLoan(document.getElementById('main-content'));
}

// ==================== 페이지: 연체 현황 ====================
// ── 연체 카테고리 구성 패널 상태 (선택 필터: 'all' | 'od10' | 'od30' | 'od90')
let overdueFilterKey = 'all';
// ── 연체 차트 그룹 필터 ('all' | 'collateral' | 'credit')
let overdueChartGroup = 'all';

// ── 그룹 패널 HTML 생성 (중첩 템플릿 리터럴 회피용 분리 함수)
function _buildOdGrpPanelHtml(odGrpArr, filterBal, totalCatBalMap, totalGrpBalMap, odRateCatMap, odRateGrpMap) {
  if(odGrpArr.length === 0) {
    return '<div style="display:flex;align-items:center;justify-content:center;height:120px;color:#9ca3af;font-size:14px">해당 연체 건수 없음</div>';
  }
  const odRateColor = (r) => r >= 10 ? '#dc2626' : r >= 3 ? '#d97706' : '#6b7280';

  const cols = odGrpArr.length;
  let html = '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);height:100%">';
  odGrpArr.forEach((gd, gi) => {
    const gPct     = filterBal > 0 ? (gd.bal / filterBal * 100) : 0;
    const gAvgR    = gd.rBSum > 0 ? (gd.rWSum / gd.rBSum).toFixed(2) : '-';
    const borderR  = gi < odGrpArr.length - 1 ? 'border-right:1px solid #e5e7eb' : '';
    const gTotBal  = totalGrpBalMap ? (totalGrpBalMap[gd.id] || 0) : 0;
    const gOdNumer = odRateGrpMap  ? (odRateGrpMap[gd.id]   || 0) : gd.bal;
    const gOdRate  = gTotBal > 0 ? (gOdNumer / gTotBal * 100) : 0;
    const gOdColor = odRateColor(gOdRate);

    let catRows = '';
    Object.values(gd.cats).sort((a,b)=>(a.order||99)-(b.order||99)).forEach(c => {
      const cPct     = filterBal > 0 ? (c.bal / filterBal * 100) : 0;
      const cGpct    = gd.bal > 0 ? (c.bal / gd.bal * 100) : 0;
      const cAvgR    = c.rBSum > 0 ? (c.rWSum / c.rBSum).toFixed(2) : '-';
      const cTotBal  = totalCatBalMap ? (totalCatBalMap[c.id] || 0) : 0;
      const cOdNumer = odRateCatMap  ? (odRateCatMap[c.id]   || 0) : c.bal;
      const cOdRate  = cTotBal > 0 ? (cOdNumer / cTotBal * 100) : 0;
      const cOdColor = odRateColor(cOdRate);
      const odLabel  = cTotBal > 0 ? cOdRate.toFixed(1) + '%' : '-';

      catRows += '<tr style="border-top:1px solid #f3f4f6">'
        + '<td style="padding:7px 8px;width:14px"><div style="width:9px;height:9px;border-radius:50%;background:' + c.color + '"></div></td>'
        + '<td style="padding:7px 4px;white-space:nowrap"><span style="font-size:12px;font-weight:700;color:#374151">' + c.name + '</span></td>'
        + '<td style="padding:7px 4px;text-align:right"><span style="font-size:14px;font-weight:900;color:' + c.color + '">' + cPct.toFixed(1) + '%</span><div style="font-size:10px;color:#9ca3af">그룹내 ' + cGpct.toFixed(1) + '%</div></td>'
        + '<td style="padding:7px 4px;text-align:right"><span style="font-size:12px;font-weight:600;color:#1f2937">' + fmtAmt(c.bal) + '</span><div style="font-size:10px;color:#9ca3af">' + fmtN(c.count) + '건</div></td>'
        + '<td style="padding:7px 4px;text-align:right"><span style="font-size:11px;color:#6b7280">금리 <b style="color:#374151">' + cAvgR + '%</b></span></td>'
        + '<td style="padding:7px 6px;text-align:right;min-width:52px"><span style="font-size:12px;font-weight:700;color:' + cOdColor + '">' + odLabel + '</span><div style="font-size:10px;color:#9ca3af">연체율</div></td>'
        + '</tr>';
    });

    html += '<div style="' + borderR + '">'
      + '<div style="background:' + gd.color + ';padding:8px 14px;text-align:center"><span style="color:#fff;font-size:13px;font-weight:700">' + gd.name + '</span></div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px 7px;background:' + gd.color + '08;border-bottom:1px solid ' + gd.color + '20">'
      +   '<div style="display:flex;align-items:center;gap:5px">'
      +     '<div style="width:9px;height:9px;border-radius:50%;background:' + gd.color + '"></div>'
      +     '<span style="font-size:20px;font-weight:900;line-height:1;color:' + gd.color + '">' + gPct.toFixed(1) + '%</span>'
      +   '</div>'
      +   '<div style="display:flex;gap:8px;font-size:10px;color:#6b7280;flex-wrap:wrap;justify-content:flex-end;align-items:center">'
      +     '<span>' + fmtAmt(gd.bal) + ' / ' + fmtN(gd.count) + '건</span>'
      +     '<span>금리 <b style="color:#374151">' + gAvgR + '%</b></span>'
      +     (gTotBal > 0 ? '<span style="background:#f3f4f6;border-radius:4px;padding:1px 5px">연체율 <b style="color:' + gOdColor + '">' + gOdRate.toFixed(1) + '%</b></span>' : '')
      +   '</div>'
      + '</div>'
      + '<table style="width:100%;border-collapse:collapse"><tbody>' + catRows + '</tbody></table>'
      + '</div>';
  });
  html += '</div>';
  return html;
}

async function renderOverdue(el) {
  if (!LOAN || !LOAN.records) {
    el.innerHTML = '<div class="flex items-center justify-center h-64 text-gray-400 text-sm">결산자료(loan_data)가 없습니다. 먼저 데이터를 업로드하세요.</div>';
    return;
  }
  try {
  const all = LOAN.records;
  const totalBal = all.reduce((s,r)=>s+r.b, 0);

  // ── 전월 데이터 로드 (증감 계산용)
  const db = await getMonthsDB();
  const currYm = LOAN.base_date ? LOAN.base_date.slice(0,7) : null;
  let prevAll = null;
  if (currYm) {
    const prevEntries = Object.values(db).filter(v => v && v.base_date && v.records && v.base_date.slice(0,7) < currYm);
    if (prevEntries.length > 0) {
      prevEntries.sort((a,b) => b.base_date.localeCompare(a.base_date));
      prevAll = filterByMgmtTeam(prevEntries[0].records);  // 관리팀 필터 적용
    }
  }

  // 전월 구간별 집계
  const Sp = arr => ({ cnt: arr.length, amt: arr.reduce((s,r)=>s+r.b,0) });
  const gp = prevAll ? {
    r0:   Sp(prevAll.filter(r=>r.d===0)),
    r10:  Sp(prevAll.filter(r=>r.d>=1  && r.d<=10)),
    r30:  Sp(prevAll.filter(r=>r.d>=11 && r.d<=30)),
    r60:  Sp(prevAll.filter(r=>r.d>=31 && r.d<=60)),
    r90:  Sp(prevAll.filter(r=>r.d>=61 && r.d<=90)),
    r120: Sp(prevAll.filter(r=>r.d>=91 && r.d<=120)),
    r180: Sp(prevAll.filter(r=>r.d>=121&& r.d<=180)),
    rInf: Sp(prevAll.filter(r=>r.d>180)),
  } : null;
  const prevCard = gp ? {
    c1: gp.r0,
    c2: { cnt: gp.r30.cnt+gp.r60.cnt+gp.r90.cnt+gp.r120.cnt+gp.r180.cnt+gp.rInf.cnt,
          amt: gp.r30.amt+gp.r60.amt+gp.r90.amt+gp.r120.amt+gp.r180.amt+gp.rInf.amt },
    c3: { cnt: gp.r60.cnt+gp.r90.cnt+gp.r120.cnt+gp.r180.cnt+gp.rInf.cnt,
          amt: gp.r60.amt+gp.r90.amt+gp.r120.amt+gp.r180.amt+gp.rInf.amt },
    c4: { cnt: gp.r120.cnt+gp.r180.cnt+gp.rInf.cnt,
          amt: gp.r120.amt+gp.r180.amt+gp.rInf.amt },
  } : null;

  const prevTotalBal = prevAll ? prevAll.reduce((s,r)=>s+r.b,0) : 0;

  // 증감 뱃지: 금액 증감 + %p (구성비율 차이)
  const diffBadge = (curr, prev, invertColor) => {
    if (!prev) return '';
    const dAmt  = curr.amt - prev.amt;
    const currPct = totalBal    > 0 ? curr.amt / totalBal    * 100 : 0;
    const prevPct = prevTotalBal > 0 ? prev.amt / prevTotalBal * 100 : 0;
    const dPp   = currPct - prevPct;  // %p 차이
    if (dAmt === 0 && Math.abs(dPp) < 0.01) return '<div style="font-size:11px;color:#9ca3af;margin-top:4px">─ 전월 동일</div>';
    const isUp  = dAmt > 0;
    const color = invertColor
      ? (isUp ? '#059669' : '#dc2626')
      : (isUp ? '#dc2626' : '#059669');
    const arrow = isUp ? '▲' : '▼';
    const sign  = isUp ? '+' : '';
    const ppSign = dPp >= 0 ? '+' : '';
    return '<div style="font-size:11px;color:'+color+';margin-top:4px;display:flex;align-items:center;gap:4px">'
      + '<span>'+arrow+' '+sign+fmtAmt(Math.abs(dAmt))+'</span>'
      + '<span style="opacity:0.8">('+ppSign+dPp.toFixed(2)+'%p)</span>'
      + '<span style="color:#9ca3af;font-size:10px">전월대비</span>'
      + '</div>';
  };

  // ── 구간별 레코드
  const seg = {
    r0:   all.filter(r=>r.d===0),
    r10:  all.filter(r=>r.d>=1  && r.d<=10),
    r30:  all.filter(r=>r.d>=11 && r.d<=30),
    r60:  all.filter(r=>r.d>=31 && r.d<=60),
    r90:  all.filter(r=>r.d>=61 && r.d<=90),
    r120: all.filter(r=>r.d>=91 && r.d<=120),
    r180: all.filter(r=>r.d>=121&& r.d<=180),
    rInf: all.filter(r=>r.d>180),
  };
  // 집계 헬퍼
  const S = arr => ({ cnt: arr.length, amt: arr.reduce((s,r)=>s+r.b,0) });
  const g = {};
  for(const k in seg) g[k] = S(seg[k]);

  // 카드별 상위 합계 (구성비 분모 = 전체잔고)
  const card1 = g.r0;
  const card2 = { cnt: g.r30.cnt+g.r60.cnt+g.r90.cnt+g.r120.cnt+g.r180.cnt+g.rInf.cnt,
                   amt: g.r30.amt+g.r60.amt+g.r90.amt+g.r120.amt+g.r180.amt+g.rInf.amt };
  const card3 = { cnt: g.r60.cnt+g.r90.cnt+g.r120.cnt+g.r180.cnt+g.rInf.cnt,
                   amt: g.r60.amt+g.r90.amt+g.r120.amt+g.r180.amt+g.rInf.amt };
  const card4 = { cnt: g.r120.cnt+g.r180.cnt+g.rInf.cnt,
                   amt: g.r120.amt+g.r180.amt+g.rInf.amt };

  const pct = (amt) => totalBal > 0 ? (amt/totalBal*100).toFixed(1)+'%' : '-';

  // ── 서브행 렌더러
  const subRow = (label, gk, col) => {
    const d = g[gk];
    if(!d || d.cnt===0) return '';
    return \`<div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
      <span class="text-xs text-gray-500 font-medium">\${label}</span>
      <div class="text-right">
        <span class="text-xs font-bold" style="color:\${col}">\${fmtAmt(d.amt)}</span>
        <span class="text-xs text-gray-400 ml-1.5">\${fmtN(d.cnt)}건</span>
        <span class="text-xs ml-1" style="color:\${col}">\${pct(d.amt)}</span>
      </div>
    </div>\`;
  };

  // ── KPI 카드 렌더러
  const mkCard = (title, badge, iconCls, mainColor, bgColor, mainData, subHtml, diffHtml) => {
    const amtPct = pct(mainData.amt);
    return \`
    <div class="kpi-card p-5 flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:\${bgColor}">
            <i class="\${iconCls}" style="color:\${mainColor}"></i>
          </div>
          <span class="text-sm font-bold text-gray-700">\${title}</span>
        </div>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:\${bgColor};color:\${mainColor}">\${badge}</span>
      </div>
      <div class="mb-1">
        <p class="text-2xl font-black tracking-tight" style="color:\${mainColor}">\${fmtAmt(mainData.amt)}</p>
        <div class="flex items-baseline gap-2 mt-0.5">
          <span class="text-lg font-bold" style="color:\${mainColor}">\${amtPct}</span>
          <span class="text-xs text-gray-400">(\${fmtN(mainData.cnt)}건)</span>
        </div>
        \${diffHtml || ''}
      </div>
      <div class="mt-auto">\${subHtml}</div>
    </div>\`;
  };

  // ── 카테고리·그룹 패널 집계 (필터 적용)
  // 필터별 대상 레코드 (파이·패널 구성비용)
  const filterRecs = overdueFilterKey === 'od90' ? all.filter(r=>r.d>90)
                   : overdueFilterKey === 'od30' ? all.filter(r=>r.d>30)
                   : overdueFilterKey === 'od10' ? all.filter(r=>r.d>10)
                   : all;
  const filterBal = filterRecs.reduce((s,r)=>s+r.b, 0);

  // ── 연체율 계산용 분자 레코드
  // 전체(all) 탭 → 10일 초과 연체율 기준, 나머지는 filterRecs와 동일
  const odRateRecs = overdueFilterKey === 'all' ? all.filter(r=>r.d>10) : filterRecs;

  // ── 전체 레코드 기준 카테고리별 총잔고 집계 (연체율 분모)
  const totalCatBalMap = {};
  all.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '');
    if(!totalCatBalMap[cat.id]) totalCatBalMap[cat.id] = 0;
    totalCatBalMap[cat.id] += r.b;
  });
  // 전체 기준 그룹별 총잔고
  const totalGrpBalMap = {};
  all.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '');
    const grp = getGroupOfCategory(cat.id);
    if(!totalGrpBalMap[grp.id]) totalGrpBalMap[grp.id] = 0;
    totalGrpBalMap[grp.id] += r.b;
  });

  // ── 연체율 분자: 카테고리·그룹별 odRateRecs 잔고
  const odRateCatMap = {};
  odRateRecs.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '');
    if(!odRateCatMap[cat.id]) odRateCatMap[cat.id] = 0;
    odRateCatMap[cat.id] += r.b;
  });
  const odRateGrpMap = {};
  odRateRecs.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '');
    const grp = getGroupOfCategory(cat.id);
    if(!odRateGrpMap[grp.id]) odRateGrpMap[grp.id] = 0;
    odRateGrpMap[grp.id] += r.b;
  });

  // ── 카테고리 집계 (파이차트용)
  const odCatMap = {};
  CATEGORIES.forEach(c => { odCatMap[c.id] = {...c, count:0, bal:0}; });
  odCatMap['__none__'] = {id:'__none__', name:'미분류', color:'#9ca3af', count:0, bal:0};
  filterRecs.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '');
    const cm  = odCatMap[cat.id] || odCatMap['__none__'];
    cm.count++; cm.bal += r.b;
  });
  const odCatArr = Object.values(odCatMap).filter(c=>c.count>0).sort((a,b)=>b.bal-a.bal);

  // ── 그룹 패널 집계 (담보/신용 패널용)
  const odGrpMap = {};
  GROUPS.forEach(g2 => {
    odGrpMap[g2.id] = { id:g2.id, name:g2.name, color:g2.color, count:0, bal:0, rWSum:0, rBSum:0, cats:{} };
  });
  filterRecs.forEach(r => {
    const cat = getCategoryOfProduct(r.p || '');
    const grp = getGroupOfCategory(cat.id);
    const gm  = odGrpMap[grp.id];
    if(!gm) return;
    gm.count++; gm.bal += r.b;
    if(r.r>0){ gm.rWSum += r.b*r.r; gm.rBSum += r.b; }
    if(!gm.cats[cat.id]) gm.cats[cat.id] = {id:cat.id, name:cat.name, color:cat.color, order:cat.order||99, count:0, bal:0, rWSum:0, rBSum:0};
    const cm = gm.cats[cat.id];
    cm.count++; cm.bal += r.b;
    if(r.r>0){ cm.rWSum += r.b*r.r; cm.rBSum += r.b; }
  });
  const odGrpArr = Object.values(odGrpMap).filter(g2=>g2.count>0)
    .sort((a,b)=>GROUPS.findIndex(g2=>g2.id===a.id)-GROUPS.findIndex(g2=>g2.id===b.id));

  const pMap = aggregateByProduct();

  // ── 필터 탭 버튼
  const filterTabs = [
    { key:'all',  label:'전체',      color:'#374151' },
    { key:'od10', label:'10일 초과', color:'#d97706' },
    { key:'od30', label:'30일 초과', color:'#dc2626' },
    { key:'od90', label:'90일 초과', color:'#7c2d12' },
  ];

  el.innerHTML=\`
<div class="space-y-5">
  <h2 class="text-lg font-bold">연체 현황</h2>

  <!-- KPI 4카드 -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    \${mkCard('정상(0일)', '정상', 'fas fa-check-circle', '#059669', '#f0fdf4', card1,
      subRow('1~10일', 'r10', '#65a30d'), prevCard ? diffBadge(card1, prevCard.c1, true) : '')}
    \${mkCard('10일 초과', '주의', 'fas fa-exclamation-circle', '#d97706', '#fff7ed', card2,
      subRow('11~30일', 'r30', '#f97316'), prevCard ? diffBadge(card2, prevCard.c2, false) : '')}
    \${mkCard('30일 초과', '경고', 'fas fa-triangle-exclamation', '#dc2626', '#fef2f2', card3,
      subRow('31~60일', 'r60', '#ef4444') + subRow('61~90일', 'r90', '#b91c1c'), prevCard ? diffBadge(card3, prevCard.c3, false) : '')}
    \${mkCard('90일 초과', '위험', 'fas fa-skull-crossbones', '#7c2d12', '#fdf4ff', card4,
      subRow('91~120일', 'r120', '#9333ea') + subRow('121~180일', 'r180', '#7e22ce') + subRow('180일 초과', 'rInf', '#581c87'), prevCard ? diffBadge(card4, prevCard.c4, false) : '')}
  </div>

  <!-- ── 카테고리 구성 패널 (신규대출 스타일) ── -->
  <div class="card overflow-hidden">
    <!-- 패널 헤더 + 필터 탭 -->
    <div class="flex items-center justify-between flex-wrap gap-3 p-4 border-b border-gray-100">
      <h3 class="text-sm font-bold text-gray-700">
        <i class="fas fa-layer-group mr-2 text-indigo-500"></i>카테고리·그룹별 연체 구성
        <span class="text-xs font-normal text-gray-400 ml-2">\${filterBal>0?fmtAmt(filterBal)+' / '+fmtN(filterRecs.length)+'건':''}</span>
      </h3>
      <div class="flex gap-1.5 flex-wrap">
        \${filterTabs.map(t => \`
          <button data-of="\${t.key}"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
            style="\${overdueFilterKey===t.key
              ? 'background:'+t.color+';color:#fff;border-color:'+t.color
              : 'background:#fff;color:'+t.color+';border-color:#e5e7eb'}">
            \${t.label}
          </button>
        \`).join('')}
      </div>
    </div>

    <!-- 파이 + 그룹 패널 -->
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <!-- 카테고리 파이차트 (1/3) -->
      <div class="p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
        <p class="text-xs font-bold text-gray-500 mb-3"><i class="fas fa-chart-pie mr-1.5 text-blue-500"></i>카테고리 구성비</p>
        <div style="height:190px"><canvas id="od-cat-pie"></canvas></div>
        <div class="mt-3 space-y-1.5">
          \${odCatArr.map(c => {
            const cp        = filterBal>0 ? (c.bal/filterBal*100).toFixed(1) : '0.0';
            const catTotBal = totalCatBalMap[c.id] || 0;
            const odNumer   = odRateCatMap[c.id] || 0;
            const odRate    = catTotBal>0 ? (odNumer/catTotBal*100).toFixed(1) : null;
            const odColor = odRate && parseFloat(odRate)>=10 ? '#dc2626' : odRate && parseFloat(odRate)>=3 ? '#d97706' : '#6b7280';
            return \`<div class="flex items-center gap-2 text-xs">
              <div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:\${c.color}"></div>
              <span class="flex-1 truncate text-gray-600">\${c.name}</span>
              <span class="font-bold" style="color:\${c.color}">\${cp}%</span>
              <span class="text-gray-400">\${fmtAmt(c.bal)}</span>
              \${odRate !== null ? \`<span class="font-bold" style="color:\${odColor};min-width:38px;text-align:right">\${odRate}%</span>\` : ''}
            </div>\`;
          }).join('')}
          <div class="mt-2 pt-2 border-t border-gray-100 flex justify-end text-xs text-gray-400">\${overdueFilterKey==='all'?'10일초과 연체율':'연체율'}</div>
        </div>
      </div>

      <!-- 담보/신용 그룹 패널 (2/3) -->
      <div class="lg:col-span-2 overflow-hidden">
        \${ _buildOdGrpPanelHtml(odGrpArr, filterBal, totalCatBalMap, totalGrpBalMap, odRateCatMap, odRateGrpMap) }
      </div>
    </div>
  </div>

  <!-- 차트 & 추이 -->
  <div class="card p-4 pb-0">
    <!-- 공통 탭 헤더 -->
    <div class="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-gray-100">
      <span class="text-sm font-bold text-gray-600"><i class="fas fa-filter mr-1.5 text-gray-400"></i>구분</span>
      <div class="flex gap-1.5">
        \${[{k:'all',l:'전체'},{k:'collateral',l:'담보'},{k:'credit',l:'신용'}].map(t=>{
          const act=overdueChartGroup===t.k;
          return '<button data-ocg="'+t.k+'" class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition" style="'+(act?'background:#374151;color:#fff;border-color:#374151':'background:#fff;color:#374151;border-color:#e5e7eb')+'">'+t.l+'</button>';
        }).join('')}
      </div>
    </div>
    <!-- 두 차트 나란히 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
      <div>
        <p class="text-xs font-bold text-gray-500 mb-2"><i class="fas fa-chart-bar mr-1.5 text-red-400"></i>연체 구간별 잔고 현황</p>
        <div class="chart-wrap-lg"><canvas id="od-bar"></canvas></div>
      </div>
      <div>
        <p class="text-xs font-bold text-gray-500 mb-2"><i class="fas fa-chart-line mr-1.5 text-orange-400"></i>월별 연체율 추이 <span class="text-gray-400 font-normal">(결산자료 기준)</span></p>
        <div class="chart-wrap-lg"><canvas id="od-trend"></canvas></div>
      </div>
    </div>
  </div>

  <!-- 상품별 연체 현황 테이블 -->
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2 text-red-500"></i>상품별 연체 현황</h3>
    <div class="overflow-auto">
      <table class="data-table">
        <thead><tr>
          <th>상품</th>
          <th class="text-right">전체잔고</th>
          <th class="text-right">연체잔고<br><span class="font-normal">(10일↑)</span></th>
          <th class="text-right">연체율<br><span class="font-normal">(잔고기준)</span></th>
          <th class="text-right">30일↑<br>잔고</th>
          <th class="text-right">90일↑<br>잔고</th>
          <th class="text-right">건수</th>
        </tr></thead>
        <tbody>\${Object.entries(pMap)
          .sort((a,b)=>(b[1].bal10+b[1].bal30_+b[1].bal60+b[1].bal90+b[1].balMore)-(a[1].bal10+a[1].bal30_+a[1].bal60+a[1].bal90+a[1].balMore))
          .map(([p,v])=>{
            const tAmt = v.bal0+v.bal10+v.bal30_+v.bal60+v.bal90+(v.balMore||0);
            const odAmt   = v.bal10+v.bal30_+v.bal60+v.bal90+(v.balMore||0);
            const od30Amt = v.bal30_+v.bal60+v.bal90+(v.balMore||0);
            const od90Amt = v.balMore||0;
            const odR     = tAmt>0 ? (odAmt/tAmt*100).toFixed(1) : '0';
            return \`<tr>
              <td class="font-medium">\${p}</td>
              <td class="text-right">\${fmtAmt(tAmt)}</td>
              <td class="text-right font-bold" style="color:#d97706">\${fmtAmt(odAmt)}</td>
              <td class="text-right font-bold \${parseFloat(odR)>=10?'text-red-600':parseFloat(odR)>=5?'text-orange-500':''}">\${odR}%</td>
              <td class="text-right text-red-500">\${fmtAmt(od30Amt)}</td>
              <td class="text-right font-bold text-red-700">\${fmtAmt(od90Amt)}</td>
              <td class="text-right text-gray-400">\${fmtN(v.count)}</td>
            </tr>\`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>\`;

  // ── 탭 버튼 이벤트 위임 (data-ocg / data-of 속성으로 클릭 감지)
  el.addEventListener('click', function _odHandler(e) {
    const ocg = e.target.closest('[data-ocg]');
    if (ocg) { el.removeEventListener('click', _odHandler); setOverdueChartGroup(ocg.dataset.ocg); return; }
    const of_ = e.target.closest('[data-of]');
    if (of_) { el.removeEventListener('click', _odHandler); setOverdueFilter(of_.dataset.of); return; }
  });

  // ── 차트 렌더링: 그룹 필터별 레코드 재집계
  const _isCollGroup = r => { const cat=getCategoryOfProduct(r.p||''); return getGroupOfCategory(cat.id).id==='g1'; };
  const _chartRecs = overdueChartGroup==='collateral' ? all.filter(_isCollGroup)
                   : overdueChartGroup==='credit'     ? all.filter(r=>!_isCollGroup(r))
                   : all;
  const _gf = k => {
    const arr = _chartRecs.filter(r=>{
      if(k==='r10') return r.d>=1&&r.d<=10;
      if(k==='r30') return r.d>=11&&r.d<=30;
      if(k==='r60') return r.d>=31&&r.d<=60;
      if(k==='r90') return r.d>=61&&r.d<=90;
      if(k==='r120') return r.d>=91&&r.d<=120;
      if(k==='r180') return r.d>=121&&r.d<=180;
      if(k==='rInf') return r.d>180;
      return false;
    });
    return {cnt:arr.length, amt:arr.reduce((s,r)=>s+r.b,0)};
  };
  const barBands = [
    {label:'1~10일',    ..._gf('r10'),  color:'#84cc16'},
    {label:'11~30일',   ..._gf('r30'),  color:'#f97316'},
    {label:'31~60일',   ..._gf('r60'),  color:'#ef4444'},
    {label:'61~90일',   ..._gf('r90'),  color:'#b91c1c'},
    {label:'91~120일',  ..._gf('r120'), color:'#9333ea'},
    {label:'121~180일', ..._gf('r180'), color:'#7e22ce'},
    {label:'180일↑',    ..._gf('rInf'), color:'#581c87'},
  ];
  setTimeout(()=>{
    // 카테고리 파이
    if(odCatArr.length>0)
      mkPie('od-cat-pie', odCatArr.map(c=>c.name), odCatArr.map(c=>c.bal), odCatArr.map(c=>c.color));
    // 구간별 바 차트
    mkBar('od-bar', barBands.map(b=>b.label), [
      {label:'잔고(억)', data:barBands.map(b=>+(b.amt/100000000).toFixed(2)),
       backgroundColor:barBands.map(b=>b.color+'cc'), yAxisID:'y'},
      {label:'건수', data:barBands.map(b=>b.cnt),
       backgroundColor:barBands.map(b=>b.color+'33'),
       type:'line', borderColor:barBands.map(b=>b.color), yAxisID:'y1'}
    ],{extra:{scales:{
      y:{ticks:{callback:v=>v.toFixed(1)+'억'}},
      y1:{type:'linear',position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>v+'건'}}
    }}});
    // 월별 연체율 추이: 결산자료(loan_data) 다월 레코드 직접 계산
    (async () => {
      const mdb = await getMonthsDB();
      // 날짜순 정렬된 월 목록 추출
      const mEntries = Object.entries(mdb)
        .filter(([,v])=>v&&v.records&&v.base_date)
        .map(([,v])=>({label: ymToTrendLabel(v.base_date.slice(0,7)), recs: filterByMgmtTeam(v.records), bd: v.base_date}))
        .sort((a,b)=>a.bd.localeCompare(b.bd));
      if(mEntries.length>=1) {
        // 그룹 필터 함수 (현재 overdueChartGroup 기준)
        const _isColl = r=>{ const cat=getCategoryOfProduct(r.p||''); return getGroupOfCategory(cat.id).id==='g1'; };
        const _pick = recs => overdueChartGroup==='collateral' ? recs.filter(_isColl)
                            : overdueChartGroup==='credit'     ? recs.filter(r=>!_isColl(r))
                            : recs;
        const tLabels=[], tData10=[], tData30=[];
        mEntries.forEach(m=>{
          const recs = _pick(m.recs);
          const totBal   = recs.reduce((s,r)=>s+(r.b||0),0);
          const bal10    = recs.filter(r=>(r.d||0)>=10).reduce((s,r)=>s+(r.b||0),0);
          const bal30    = recs.filter(r=>(r.d||0)>=30).reduce((s,r)=>s+(r.b||0),0);
          tLabels.push(m.label);
          tData10.push(totBal>0 ? +(bal10/totBal*100).toFixed(2) : 0);
          tData30.push(totBal>0 ? +(bal30/totBal*100).toFixed(2) : 0);
        });
        const sfx = overdueChartGroup==='collateral'?'(담보)':overdueChartGroup==='credit'?'(신용)':'';
        mkLine('od-trend', tLabels,[
          {label:'10일↑연체율'+sfx, data:tData10, borderColor:'#f97316', borderDash:[4,2]},
          {label:'30일↑연체율'+sfx, data:tData30, borderColor:'#dc2626', backgroundColor:'rgba(220,38,38,.08)', fill:true}
        ],{pct:true});
      }
    })();
  },50);
  } catch(err) {
    console.error('[renderOverdue] 에러:', err);
    el.innerHTML = '<div class="p-4 text-red-500 text-sm font-mono">렌더링 오류: ' + err.message + '</div>';
  }
}

// 필터 선택 → 연체 페이지 재렌더
async function setOverdueFilter(key) {
  overdueFilterKey = key;
  const el = document.getElementById('main-content');
  await renderOverdue(el);
}
// 차트 그룹 필터 (전체/담보/신용)
async function setOverdueChartGroup(grp) {
  overdueChartGroup = grp;
  const el = document.getElementById('main-content');
  await renderOverdue(el);
}
// inline onclick handler에서 접근할 수 있도록 window에 명시 등록
window.setOverdueFilter     = setOverdueFilter;
window.setOverdueChartGroup = setOverdueChartGroup;

// ==================== 페이지: 연체 변동 분석 ====================
async function renderOverdueChange(el) {
  // ── getMonthsDB()로 올바르게 읽기 (apl_months_v1 키 사용)
  const db = await getMonthsDB();
  const months = Object.entries(db)
    .filter(([,v]) => v && v.records && v.base_date)
    .map(([k, v]) => ({ key: k, base_date: v.base_date, records: filterByMgmtTeam(v.records) }))
    .sort((a,b) => a.base_date.localeCompare(b.base_date));

  const hasCno = months.length > 0 && months[0].records.length > 0 && months[0].records[0].cno !== undefined;

  // ── 비교 월 선택 UI 렌더
  const monthOpts = months.map(m => {
    const ym = m.base_date.slice(0,7);
    return '<option value="' + ym + '">' + ym.replace('-','년 ') + '월</option>';
  }).join('');

  const latestYm  = months.length >= 1 ? months[months.length-1].base_date.slice(0,7) : '';
  const prevYm    = months.length >= 2 ? months[months.length-2].base_date.slice(0,7) : '';

  el.innerHTML = \`
<div class="space-y-5">
  <!-- 헤더 -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-bold text-gray-800">연체 변동 분석</h2>
      <p class="text-xs text-gray-500 mt-0.5">계약번호 기준으로 전월 대비 신규 연체 발생 / 연체 해소 현황을 비교합니다</p>
    </div>
  </div>

  \${!hasCno ? \`
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
    <i class="fas fa-exclamation-triangle text-amber-500 mt-0.5"></i>
    <div>
      <p class="font-semibold text-amber-800">계약번호(B열) 데이터가 필요합니다</p>
      <p class="text-sm text-amber-700 mt-1">현재 저장된 결산자료에 계약번호 필드가 없습니다.<br>
      결산자료를 <strong>다시 업로드</strong>하면 B열(계약번호)이 자동으로 포함됩니다.<br>
      이후 두 달 이상의 결산자료가 등록되면 이 페이지에서 비교 분석이 가능합니다.</p>
    </div>
  </div>\` : months.length < 2 ? \`
  <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
    <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
    <div>
      <p class="font-semibold text-blue-800">결산자료가 2개월 이상 필요합니다</p>
      <p class="text-sm text-blue-700 mt-1">현재 <strong>\${months.length}개월</strong> 분의 결산자료가 등록되어 있습니다.<br>
      연체 변동 분석은 전월과 당월을 비교하므로 최소 2개월 데이터가 필요합니다.</p>
    </div>
  </div>\` : \`
  <!-- 월 선택 -->
  <div class="bg-white rounded-xl border border-gray-200 p-4">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-600">전월</label>
        <select id="oc-prev-month" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white" onchange="renderOcResult()">
          \${monthOpts}
        </select>
      </div>
      <i class="fas fa-arrow-right text-gray-400"></i>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-600">당월</label>
        <select id="oc-curr-month" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white" onchange="renderOcResult()">
          \${monthOpts}
        </select>
      </div>
      <div class="ml-auto text-xs text-gray-400">계약번호 기준 매칭</div>
    </div>
  </div>

  <!-- 결과 영역 -->
  <div id="oc-result"></div>
  \`}
</div>\`;

  if (hasCno && months.length >= 2) {
    // 기본값 설정
    const prevSel = document.getElementById('oc-prev-month');
    const currSel = document.getElementById('oc-curr-month');
    if (prevSel && prevYm) prevSel.value = prevYm;
    if (currSel && latestYm) currSel.value = latestYm;
    await renderOcResult();
  }
}

async function renderOcResult() {
  const prevYm = document.getElementById('oc-prev-month')?.value;
  const currYm = document.getElementById('oc-curr-month')?.value;
  const resEl  = document.getElementById('oc-result');
  if (!resEl || !prevYm || !currYm || prevYm === currYm) return;

  // ── IDB에서 읽기
  let prevRecs = [], currRecs = [];
  const db = await getMonthsDB();
  Object.values(db).forEach(v => {
    if (!v || !v.base_date || !v.records) return;
    const ym = v.base_date.slice(0,7);
    if (ym === prevYm) prevRecs = v.records;
    if (ym === currYm) currRecs = v.records;
  });

  if (prevRecs.length === 0 || currRecs.length === 0) {
    resEl.innerHTML = '<div class="text-center py-8 text-gray-400">선택한 월의 데이터를 찾을 수 없습니다</div>';
    return;
  }

  // ── 계약번호 맵 생성
  const prevMap = {}; // cno → record
  const currMap = {};
  prevRecs.forEach(r => { if (r.cno) prevMap[r.cno] = r; });
  currRecs.forEach(r => { if (r.cno) currMap[r.cno] = r; });

  const prevTotal = prevRecs.reduce((s,r)=>s+(r.b||0),0);
  const currTotal = currRecs.reduce((s,r)=>s+(r.b||0),0);

  // ── 신규연체: 전월 d≤10이었는데 당월 d>10
  const newOdList = [];   // { cno, p, a, prevD, currD, currB }
  // ── 연체해소: 전월 d>10이었는데 당월 d≤10
  const resolvedList = []; // { cno, p, a, prevD, currD, prevB, currB }
  // ── 지속연체: 전월 d>10이고 당월도 d>10
  const continuedList = [];
  // ── 연체악화: 전월 d>0이고 당월 d>전월d (연체일 증가)
  // ── 매칭 실패 (cno 없음) 카운트
  let noKeyPrev = prevRecs.filter(r=>!r.cno).length;
  let noKeyCurr = currRecs.filter(r=>!r.cno).length;

  // ── 상환종료 리스트 (전월 d>10인데 당월에 계약번호 없음)
  const repaidList = [];
  const allCnos = new Set([...Object.keys(prevMap), ...Object.keys(currMap)]);
  allCnos.forEach(cno => {
    const p = prevMap[cno];
    const c = currMap[cno];
    const pd = p ? (p.d || 0) : 0;
    if (p && !c) {
      // 당월에 없는 계약 — 전월 연체(d>10)였던 경우만 상환종료로 분류
      if (pd > 10) repaidList.push({ cno, p: p.p, a: p.a, prevD: pd, currD: null, prevB: p.b||0, currB: 0 });
      return;
    }
    if (!p || !c) return;
    const cd = c.d || 0;
    if (pd <= 10 && cd > 10) {
      newOdList.push({ cno, p: c.p, a: c.a, prevD: pd, currD: cd, currB: c.b||0, prevB: p.b||0 });
    } else if (pd > 10 && cd <= 10) {
      resolvedList.push({ cno, p: c.p, a: c.a, prevD: pd, currD: cd, prevB: p.b||0, currB: c.b||0 });
    } else if (pd > 10 && cd > 10) {
      continuedList.push({ cno, p: c.p, a: c.a, prevD: pd, currD: cd, prevB: p.b||0, currB: c.b||0 });
    }
  });

  // 금액 합산
  const newOdBal      = newOdList.reduce((s,r)=>s+r.currB,0);
  const resolvedBal   = resolvedList.reduce((s,r)=>s+r.prevB,0);
  const continuedBal  = continuedList.reduce((s,r)=>s+r.prevB,0);
  const repaidBal     = repaidList.reduce((s,r)=>s+r.prevB,0);
  const totalResolvedBal = resolvedBal + repaidBal;  // 해소 + 상환종료 합산

  // 전월 d>10 전체 잔고 (연체율 분모)
  const prevOdBal  = prevRecs.filter(r=>r.d>10).reduce((s,r)=>s+(r.b||0),0);
  const currOdBal  = currRecs.filter(r=>r.d>10).reduce((s,r)=>s+(r.b||0),0);
  const prevOdRate = prevTotal>0 ? (prevOdBal/prevTotal*100).toFixed(2) : '0.00';
  const currOdRate = currTotal>0 ? (currOdBal/currTotal*100).toFixed(2) : '0.00';

  // 신규연체율 = 신규연체 잔고 / 전월 전체 잔고
  const newOdRate      = prevTotal > 0 ? (newOdBal/prevTotal*100).toFixed(2) : '0.00';
  // 해소율 = (해소+상환종료) 잔고 / 전월 d>10 연체 잔고
  const totalResolveRate = prevOdBal > 0 ? (totalResolvedBal/prevOdBal*100).toFixed(1) : '0.0';
  const resolveRate      = prevOdBal > 0 ? (resolvedBal/prevOdBal*100).toFixed(1) : '0.0';
  const repaidRate       = prevOdBal > 0 ? (repaidBal/prevOdBal*100).toFixed(1) : '0.0';
  // 잔존율 = 지속연체 잔고 / 전월 d>10 연체 잔고
  const continueRate   = prevOdBal > 0 ? (continuedBal/prevOdBal*100).toFixed(1) : '0.0';

  const matchedCnt = Object.keys(prevMap).filter(k=>currMap[k]).length;
  const totalPrevCno = Object.keys(prevMap).length;

  // 테이블 행 생성 헬퍼
  function mkRows(list, type, sortCol, sortDir) {
    if (list.length === 0) return '<tr><td colspan="6" class="text-center py-4 text-gray-400 text-xs">해당 없음</td></tr>';
    const col  = sortCol  || 'bal';
    const dir  = sortDir  || 'desc';
    const getVal = (r) => {
      if (col === 'cno')  return (r.cno  || '').toString();
      if (col === 'p')    return (r.p    || '').toString();
      if (col === 'a')    return (r.a    || '').toString();
      if (col === 'dchg') return (type === 'resolved' || type === 'repaid') ? -(r.prevD || 0) : (r.currD || 0) - (r.prevD || 0);
      /* bal */           return type === 'new' ? (r.currB || 0) : (r.prevB || 0);
    };
    const sorted = [...list].sort((x, y) => {
      const vx = getVal(x), vy = getVal(y);
      const cmp = (typeof vx === 'string') ? vx.localeCompare(vy, 'ko') : vx - vy;
      return dir === 'asc' ? cmp : -cmp;
    });
    return sorted.slice(0,100).map((r,i) => {
      const dispBal = type==='new' ? r.currB : r.prevB;
      const dBadge  = (d) => {
        if(d===0) return '<span style="color:#10b981;font-weight:600">정상</span>';
        if(d<=10) return '<span style="color:#6b7280">'+d+'일</span>';
        if(d<=30) return '<span style="color:#d97706;font-weight:600">'+d+'일</span>';
        if(d<=90) return '<span style="color:#ea580c;font-weight:600">'+d+'일</span>';
        return '<span style="color:#dc2626;font-weight:600">'+d+'일</span>';
      };
      const arrow = type==='repaid'
        ? '<span style="color:#dc2626">'+r.prevD+'일</span> → <span style="color:#6366f1;font-weight:700">상환종료</span>'
        : type==='resolved'
        ? '<span style="color:#dc2626">'+r.prevD+'일</span> → '+(r.currD===0 ? '<span style="color:#10b981;font-weight:700">정상</span>' : '<span style="color:#6b7280">'+r.currD+'일</span>')
        : type==='new'
          ? '<span style="color:#6b7280">'+(r.prevD||0)+'일</span> → <span style="color:#dc2626;font-weight:700">'+r.currD+'일</span>'
          : dBadge(r.prevD)+' → '+dBadge(r.currD);
      return '<tr style="border-bottom:1px solid #f3f4f6">'
        + '<td style="padding:7px 10px;font-size:11px;color:#6b7280;text-align:center">'+(i+1)+'</td>'
        + '<td style="padding:7px 10px;font-size:11px;font-family:monospace;color:#374151">'+r.cno+'</td>'
        + '<td style="padding:7px 10px;font-size:12px;color:#374151">'+r.p+'</td>'
        + '<td style="padding:7px 10px;font-size:11px;color:#6b7280">'+r.a+'</td>'
        + '<td style="padding:7px 10px;font-size:12px;text-align:center">'+arrow+'</td>'
        + '<td style="padding:7px 10px;font-size:12px;font-weight:600;text-align:right;color:#1f2937">'+fmtAmt(dispBal)+'</td>'
        + '</tr>';
    }).join('') + (sorted.length>100 ? '<tr><td colspan="6" class="text-center py-2 text-xs text-gray-400">외 '+(sorted.length-100)+'건...</td></tr>' : '');
  }

  function mkTable(title, list, type, accentColor, sortCol, sortDir) {
    const col = sortCol || 'bal';
    const dir = sortDir || 'desc';
    // 헤더 컬럼 정의: [colKey, label, align]
    const cols = [
      { key: null,   label: 'No',       align: 'center', sortable: false },
      { key: 'cno',  label: '계약번호',  align: 'left',   sortable: true  },
      { key: 'p',    label: '상품',      align: 'left',   sortable: true  },
      { key: 'a',    label: '채널',      align: 'left',   sortable: true  },
      { key: 'dchg', label: '연체일 변화', align: 'center', sortable: true  },
      { key: 'bal',  label: '잔고',      align: 'right',  sortable: true  },
    ];
    const thStyle = (align, active) =>
      'padding:8px 10px;font-size:10px;font-weight:600;text-align:'+align+';'
      + (active ? 'color:#3b82f6;cursor:pointer;user-select:none;white-space:nowrap'
                : 'color:#9ca3af;cursor:pointer;user-select:none;white-space:nowrap');
    const sortIcon = (key) => {
      if (!key) return '';
      if (col !== key) return ' <span style="color:#d1d5db">⇅</span>';
      return dir === 'asc' ? ' <span style="color:#3b82f6">▲</span>' : ' <span style="color:#3b82f6">▼</span>';
    };
    const ths = cols.map(c =>
      c.sortable
        ? '<th data-sort-col="'+c.key+'" data-tab-type="'+type+'" style="'+thStyle(c.align, col===c.key)+'">'+c.label+sortIcon(c.key)+'</th>'
        : '<th style="'+thStyle(c.align, false)+'">'+c.label+'</th>'
    ).join('');

    return '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">'
      + '<div style="padding:14px 18px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between">'
      + '<span style="font-size:14px;font-weight:700;color:'+accentColor+'"><i class="fas '+(type==='new'?'fa-arrow-up-right-dots':type==='resolved'?'fa-check-circle':'fa-clock')+' mr-1.5"></i>'+title+'</span>'
      + '<span style="font-size:12px;color:#6b7280">'+fmtN(list.length)+'건 / '+fmtAmt(list.reduce((s,r)=>s+(type==="new"?r.currB:r.prevB),0))+'</span>'
      + '</div>'
      + '<div style="overflow-x:auto">'
      + '<table style="width:100%;border-collapse:collapse">'
      + '<thead><tr style="background:#f8fafd">'+ths+'</tr></thead>'
      + '<tbody>' + mkRows(list, type, col, dir) + '</tbody>'
      + '</table></div></div>';
  }

  const odRateArrow = parseFloat(currOdRate) > parseFloat(prevOdRate) ? '▲' : parseFloat(currOdRate) < parseFloat(prevOdRate) ? '▼' : '─';
  const odRateColor = parseFloat(currOdRate) > parseFloat(prevOdRate) ? '#dc2626' : parseFloat(currOdRate) < parseFloat(prevOdRate) ? '#10b981' : '#6b7280';

  resEl.innerHTML = ''
    + '<div class="space-y-5">'
    // ── KPI 카드 4개
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">'
    // 연체율 변화
    + '<div class="bg-white rounded-xl border border-gray-200 p-4">'
    + '<div class="text-xs text-gray-500 mb-1">연체율 변화 <span class="text-gray-400">(10일초과)</span></div>'
    + '<div class="flex items-end gap-2">'
    + '<span style="font-size:22px;font-weight:800;color:'+odRateColor+'">' + odRateArrow + ' ' + currOdRate + '%</span>'
    + '</div>'
    + '<div class="text-xs text-gray-400 mt-1">전월 ' + prevOdRate + '% → 당월 ' + currOdRate + '%</div>'
    + '</div>'
    // 신규연체
    + '<div class="bg-white rounded-xl border border-red-200 p-4">'
    + '<div class="text-xs text-red-500 mb-1 font-medium">신규 연체 발생</div>'
    + '<div style="font-size:22px;font-weight:800;color:#dc2626">' + fmtN(newOdList.length) + '건</div>'
    + '<div class="text-xs text-gray-500 mt-1">' + fmtAmt(newOdBal) + ' / 신규연체율 <strong>' + newOdRate + '%</strong></div>'
    + '</div>'
    // 연체해소
    + '<div class="bg-white rounded-xl border border-emerald-200 p-4">'
    + '<div class="text-xs text-emerald-600 mb-1 font-medium">연체 해소 (d≤10 전환 + 상환종료)</div>'
    + '<div style="font-size:22px;font-weight:800;color:#10b981">' + fmtN(resolvedList.length + repaidList.length) + '건</div>'
    + '<div class="text-xs text-gray-500 mt-1">' + fmtAmt(totalResolvedBal) + ' / 해소율 <strong>' + totalResolveRate + '%</strong></div>'
    + '<div class="text-xs text-gray-400 mt-0.5" style="line-height:1.6">'
    + '해소 ' + fmtAmt(resolvedBal) + ' <span style="color:#10b981">' + resolveRate + '%</span>'
    + ' &nbsp;|&nbsp; 상환 ' + fmtAmt(repaidBal) + ' <span style="color:#10b981">' + repaidRate + '%</span>'
    + '</div>'
    + '</div>'
    // 지속연체
    + '<div class="bg-white rounded-xl border border-orange-200 p-4">'
    + '<div class="text-xs text-orange-500 mb-1 font-medium">지속 연체 (10일초과 유지)</div>'
    + '<div style="font-size:22px;font-weight:800;color:#ea580c">' + fmtN(continuedList.length) + '건</div>'
    + '<div class="text-xs text-gray-500 mt-1">' + fmtAmt(continuedBal) + ' / 잔존율 <strong>' + continueRate + '%</strong></div>'
    + '</div>'
    + '</div>'
    // ── 매칭 정보 바
    + '<div class="bg-gray-50 rounded-lg px-4 py-2.5 flex items-center gap-3 text-xs text-gray-500">'
    + '<i class="fas fa-link text-gray-400"></i>'
    + '<span>계약번호 매칭: 전월 <strong>' + fmtN(totalPrevCno) + '건</strong> 중 <strong>' + fmtN(matchedCnt) + '건</strong> 양쪽 존재'
    + (noKeyPrev+noKeyCurr>0 ? ' | <span class="text-amber-600">계약번호 없는 행: 전월 '+noKeyPrev+'건 / 당월 '+noKeyCurr+'건 (제외됨)</span>' : '') + '</span>'
    + '<span class="ml-auto text-gray-400">' + prevYm + ' → ' + currYm + '</span>'
    + '</div>'
    // ── 탭
    + '<div style="display:flex;gap:8px;flex-wrap:wrap" id="oc-tabs">'
    + '<button id="oct-new" class="tab-btn active" data-tab="new">🔴 신규연체 '+fmtN(newOdList.length)+'건</button>'
    + '<button id="oct-resolved" class="tab-btn" data-tab="resolved">✅ 연체해소 '+fmtN(resolvedList.length)+'건</button>'
    + '<button id="oct-repaid" class="tab-btn" data-tab="repaid">💰 상환종료 '+fmtN(repaidList.length)+'건</button>'
    + '<button id="oct-continued" class="tab-btn" data-tab="continued">⚠️ 지속연체 '+fmtN(continuedList.length)+'건</button>'
    + '</div>'
    // ── 테이블 영역
    + '<div id="oc-table-area">'
    + mkTable('신규 연체 발생 (전월 d≤10 → 당월 d>10)', newOdList, 'new', '#dc2626', 'bal', 'desc')
    + '</div>'
    + '</div>';

  // 탭 전환 함수 (클로저로 저장)  — 정렬 상태도 함께 보관
  window._ocData = {
    newOdList, resolvedList, continuedList, repaidList, mkTable,
    sortCol: 'bal', sortDir: 'desc',   // 기본: 잔고 내림차순
    activeTab: 'new'
  };

  // data-tab 버튼에 이벤트 연결 (onclick 인라인 따옴표 충돌 회피)
  setTimeout(() => {
    const tabsEl = document.getElementById('oc-tabs');
    if (tabsEl) {
      tabsEl.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => ocTab(btn.getAttribute('data-tab')));
      });
    }
    // 컬럼 헤더 정렬 이벤트 (이벤트 위임 — 테이블 영역 전체)
    const area = document.getElementById('oc-table-area');
    if (area) {
      area.addEventListener('click', e => {
        const th = e.target.closest('[data-sort-col]');
        if (!th) return;
        const clickedCol  = th.getAttribute('data-sort-col');
        const d           = window._ocData;
        if (d.sortCol === clickedCol) {
          d.sortDir = d.sortDir === 'desc' ? 'asc' : 'desc';
        } else {
          d.sortCol = clickedCol;
          d.sortDir = 'desc';
        }
        ocTab(d.activeTab);   // 현재 탭 재렌더
      });
    }
  }, 0);
}

function ocTab(tab) {
  ['new','resolved','repaid','continued'].forEach(t => {
    const btn = document.getElementById('oct-'+t);
    if(btn) btn.classList.toggle('active', t===tab);
  });
  const area = document.getElementById('oc-table-area');
  if (!area || !window._ocData) return;
  const d = window._ocData;
  d.activeTab = tab;
  const { newOdList, resolvedList, repaidList, continuedList, mkTable, sortCol, sortDir } = d;
  if (tab==='new')
    area.innerHTML = mkTable('신규 연체 발생 (전월 d≤10 → 당월 d>10)', newOdList, 'new', '#dc2626', sortCol, sortDir);
  else if (tab==='resolved')
    area.innerHTML = mkTable('연체 해소 (전월 d>10 → 당월 d≤10)', resolvedList, 'resolved', '#10b981', sortCol, sortDir);
  else if (tab==='repaid')
    area.innerHTML = mkTable('상환 종료 (전월 d>10 → 당월 계약 없음)', repaidList, 'repaid', '#6366f1', sortCol, sortDir);
  else
    area.innerHTML = mkTable('지속 연체 (전월 d>10 → 당월 d>10)', continuedList, 'continued', '#ea580c', sortCol, sortDir);
}

// ==================== 페이지: 부동산 현황 ====================
// ── 지역(cla) → 그룹 매핑
const RE_REGION_MAP = {
  '서울':'서울,경기','경기':'서울,경기','인천':'서울,경기',
  '부산':'광역시','대구':'광역시','광주':'광역시','대전':'광역시','울산':'광역시','세종':'광역시',
  '경상':'지방','경남':'지방','경북':'지방',
  '전라':'지방','전남':'지방','전북':'지방',
  '충청':'지방','충남':'지방','충북':'지방','강원':'지방',
  '제주':'제주',
};
const RE_REGIONS_ORDER  = ['서울,경기','광역시','지방','제주'];
const RE_COLTYPES_ORDER = ['아파트','빌라,맨션','단독주택','다세대','토지','오피스텔','상가'];
const RE_REGION_COLORS  = {'서울,경기':'#2563eb','광역시':'#059669','지방':'#d97706','제주':'#7c3aed'};
const RE_COLTYPE_COLORS = {'아파트':'#2563eb','빌라,맨션':'#0891b2','단독주택':'#059669','다세대':'#d97706','토지':'#ea580c','오피스텔':'#7c3aed','상가':'#dc2626'};
const RE_LTV_BANDS = [
  {key:'ltv60', label:'60%↓',  color:'#2563eb', test:v=>v>0&&v<=60},
  {key:'ltv65', label:'61~65%',color:'#0891b2', test:v=>v>60&&v<=65},
  {key:'ltv75', label:'66~75%',color:'#059669', test:v=>v>65&&v<=75},
  {key:'ltv80', label:'76~80%',color:'#d97706', test:v=>v>75&&v<=80},
  {key:'ltv85', label:'81~85%',color:'#dc2626', test:v=>v>80&&v<=85},
  {key:'ltv85p',label:'85%↑', color:'#7c3aed', test:v=>v>85},
];

// 단위: 원 → 천만원 표시
function fmtChun(v) {
  if (!v) return '-';
  const c = Math.round(v / 10000000);
  if (c === 0) return '-';
  return c.toLocaleString() + '천만';
}
function fmtReCnt(v) { return v ? v.toLocaleString() + '건' : '-'; }
function fmtRePct(v, t) { return t > 0 ? (v / t * 100).toFixed(1) + '%' : '-'; }

// 집계 함수
function calcRealestateStats(records, loanTypeName) {
  // loanTypeName === null → 담보론 + 담보론(지분대출) 합산
  const RE_LOAN_NAMES = ['담보론', '담보론(지분대출)'];
  const filtered = records.filter(r => r.clt && (loanTypeName === null ? RE_LOAN_NAMES.includes(r.p) : r.p === loanTypeName));
  const isOd = r => (r.d||0) > 10;
  const zero = () => ({cnt:0, bal:0});
  const zeroBands = () => {
    const o = {total:zero()};
    RE_LTV_BANDS.forEach(b => o[b.key]=zero());
    return o;
  };
  const addTo = (slot, r) => { slot.cnt++; slot.bal += (r.b||0); };
  // 실질 LTV 계산: loanAmt/appraised 우선, 없으면 r.ltv fallback
  const calcLtv = r => {
    if ((r.appraised||0) > 0 && (r.loanAmt||0) > 0) return r.loanAmt / r.appraised * 100;
    return r.ltv || 0;
  };
  const addBand = (bands, r) => {
    addTo(bands.total, r);
    const ltv = calcLtv(r);
    RE_LTV_BANDS.forEach(b => { if(b.test(ltv)) addTo(bands[b.key], r); });
  };
  // 평균 LTV: loanAmt/appraised 있으면 catMap과 동일한 ΣloanAmt/Σappraised 방식
  //           없으면 건별 r.ltv 잔고가중평균 방식 (fallback)
  //   → 두 방식 중 어느 것을 쓸지는 데이터가 결정 (필드 존재 여부)
  let ltvLoanSum = 0, ltvAppSum = 0;   // catMap 방식 (ΣloanAmt/Σappraised)
  let ltvWSum = 0, ltvBalSum = 0;      // fallback: 잔고가중평균 r.ltv
  let rWSum = 0, rBSum = 0;
  const summary = { all: zeroBands(), od: zeroBands(), nonOd: zeroBands() };
  const byRegion = {}, byColtype = {}, byRC = {};
  filtered.forEach(r => {
    const grp = RE_REGION_MAP[r.cla] || '기타';
    const ct  = r.clt || '';
    const od  = isOd(r);
    const key = grp + '|' + ct;
    addBand(summary.all, r);
    if (od) addBand(summary.od, r); else addBand(summary.nonOd, r);
    if (!byRegion[grp]) byRegion[grp] = {all:zeroBands(),od:zeroBands(),nonOd:zeroBands()};
    addBand(byRegion[grp].all, r);
    if (od) addBand(byRegion[grp].od, r); else addBand(byRegion[grp].nonOd, r);
    if (!byColtype[ct]) byColtype[ct] = {all:zeroBands(),od:zeroBands(),nonOd:zeroBands()};
    addBand(byColtype[ct].all, r);
    if (od) addBand(byColtype[ct].od, r); else addBand(byColtype[ct].nonOd, r);
    if (!byRC[key]) byRC[key] = {grp,ct,all:zeroBands(),od:zeroBands(),nonOd:zeroBands()};
    addBand(byRC[key].all, r);
    if (od) addBand(byRC[key].od, r); else addBand(byRC[key].nonOd, r);
    // 평균 LTV: catMap 방식 우선 (ΣloanAmt/Σappraised)
    if ((r.appraised||0) > 0 && (r.loanAmt||0) > 0) {
      ltvLoanSum += (r.loanAmt||0);
      ltvAppSum  += (r.appraised||0);
    } else if ((r.ltv||0) > 0 && (r.b||0) > 0) {
      // fallback: r.ltv 잔고가중 누적 (loanAmt/appraised 없는 레코드만)
      ltvWSum  += r.b * r.ltv;
      ltvBalSum += r.b;
    }
    // 평균 금리: r 필드가 있고 잔고 > 0
    if ((r.r||0) > 0 && (r.b||0) > 0) { rWSum += r.b * r.r; rBSum += r.b; }
  });
  // catMap 방식 LTV가 하나라도 있으면 그걸 우선 사용 (잔고 구성비 분석과 동일)
  const avgLtv = ltvAppSum > 0
    ? (ltvLoanSum / ltvAppSum * 100).toFixed(1)
    : (ltvBalSum  > 0 ? (ltvWSum / ltvBalSum).toFixed(1) : null);
  const avgRate = rBSum > 0 ? (rWSum / rBSum).toFixed(2) : null;
  return { summary, byRegion, byColtype, byRC, avgLtv, avgRate };
}

// ==================== 페이지: 연체 빈티지 ====================
// ── 관리팀 필터 헬퍼: records 배열에서 선택된 관리팀만 반환
function filterByMgmtTeam(recs) {
  if (!selectedMgmtTeam) return recs;
  return recs.filter(r => r.mgmt === selectedMgmtTeam);
}

// ── 전체 저장된 월에서 관리팀 목록 추출 (사이드바 셀렉트용)
async function getUniqueMgmtTeams() {
  const teams = new Set();
  // 현재 결산 LOAN
  if (LOAN && LOAN.records) {
    LOAN.records.forEach(r => { if (r.mgmt) teams.add(r.mgmt); });
  }
  // IDB 전체 월 결산
  try {
    const months = await getMonthsDB();
    for (const snap of Object.values(months)) {
      if (snap && snap.records) {
        snap.records.forEach(r => { if (r.mgmt) teams.add(r.mgmt); });
      }
    }
  } catch(e) {}
  // 계약리스트 IDB
  try {
    const contracts = getContractDB();
    for (const snap of Object.values(contracts)) {
      if (snap && snap.records) {
        snap.records.forEach(r => { if (r.mgmt) teams.add(r.mgmt); });
      }
    }
  } catch(e) {}
  return [...teams].sort();
}

// ── 빈티지 필터: records 배열을 현재 필터 설정으로 필터링
function vintageFilterRecs(recs) {
  if (vintageFilterType === 'all') return recs;
  const catsNow = (CATEGORIES && CATEGORIES.length > 0) ? CATEGORIES : DEFAULT_CATEGORIES;
  const grpsNow = (GROUPS     && GROUPS.length     > 0) ? GROUPS     : DEFAULT_GROUPS;
  // 상품 단위 필터 (카테고리/그룹 필터 이후 세부 상품 선택)
  if (vintageFilterProd) {
    return recs.filter(r => r.p === vintageFilterProd);
  }
  if (vintageFilterType === 'category') {
    const cat = catsNow.find(c => c.id === vintageFilterId);
    if (!cat) return recs;
    const prods = new Set(cat.products || []);
    return recs.filter(r => prods.has(r.p));
  }
  if (vintageFilterType === 'group') {
    const grp = grpsNow.find(g => g.id === vintageFilterId);
    if (!grp) return recs;
    const catIds = new Set(grp.categoryIds || []);
    const prods  = new Set(
      catsNow.filter(c => catIds.has(c.id)).flatMap(c => c.products || [])
    );
    return recs.filter(r => prods.has(r.p));
  }
  return recs;
}

async function renderVintage(el) {
  const db          = await getMonthsDB();
  const allKeys     = Object.keys(db).sort();  // YYYYMM 오래된 순

  // ── 현재 선택 월 정보
  const curRecsRaw  = LOAN ? (LOAN.records || []) : [];
  const baseDate    = LOAN ? LOAN.base_date : null;
  const baseYm      = baseDate ? baseDate.replace(/-/g,'').slice(0,6) : null;

  // ── 기준월 이하 스냅샷만 사용 (미래 데이터 제외)
  const snapKeys = baseYm ? allKeys.filter(k => k <= baseYm) : allKeys;

  // ── 필터 적용
  const curRecs     = vintageFilterRecs(curRecsRaw);

  // ── 필터 셀렉트 옵션 생성
  const catsNow = (CATEGORIES && CATEGORIES.length > 0) ? CATEGORIES : DEFAULT_CATEGORIES;
  const grpsNow = (GROUPS     && GROUPS.length     > 0) ? GROUPS     : DEFAULT_GROUPS;
  const grpOptions  = grpsNow.map(g =>
    '<option value="group__' + g.id + '"' + (vintageFilterType==='group'&&vintageFilterId===g.id?' selected':'') + '>' + g.name + '</option>'
  ).join('');
  const catOptions  = catsNow.map(c =>
    '<option value="category__' + c.id + '"' + (vintageFilterType==='category'&&vintageFilterId===c.id?' selected':'') + '>' + c.name + '</option>'
  ).join('');
  const filterSel = '<select id="vt-filter-sel" onchange="onVintageFilter(this.value)" '
    + 'class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">'
    + '<option value="all"' + (vintageFilterType==='all'?' selected':'') + '>전체</option>'
    + '<optgroup label="── 상품 그룹">' + grpOptions + '</optgroup>'
    + '<optgroup label="── 상품 카테고리">' + catOptions + '</optgroup>'
    + '</select>';

  // ── 상품 셀렉트 (카테고리/그룹 선택 시에만 표시)
  let prodSelHtml = '';
  if (vintageFilterType === 'category' || vintageFilterType === 'group') {
    // 선택된 필터 범위 내 상품 목록 추출
    let scopeProds = [];
    if (vintageFilterType === 'category') {
      const cat = catsNow.find(c => c.id === vintageFilterId);
      if (cat) scopeProds = cat.products || [];
    } else {
      const grp = grpsNow.find(g => g.id === vintageFilterId);
      if (grp) {
        const catIds = new Set(grp.categoryIds || []);
        scopeProds = catsNow.filter(c => catIds.has(c.id)).flatMap(c => c.products || []);
      }
    }
    if (scopeProds.length > 0) {
      const prodOpts = scopeProds.map(p =>
        '<option value="' + p + '"' + (vintageFilterProd===p?' selected':'') + '>' + p + '</option>'
      ).join('');
      prodSelHtml = '<select id="vt-prod-sel" onchange="onVintageProdFilter(this.value)" '
        + 'class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">'
        + '<option value=""' + (vintageFilterProd===''?' selected':'') + '>전체 상품</option>'
        + prodOpts
        + '</select>';
    }
  }

  // ── 필터 레이블 (현재 선택 표시용)
  let filterLabel = '전체';
  if (vintageFilterType === 'group') {
    const g = grpsNow.find(x => x.id === vintageFilterId);
    if (g) filterLabel = '그룹: ' + g.name;
  } else if (vintageFilterType === 'category') {
    const c = catsNow.find(x => x.id === vintageFilterId);
    if (c) filterLabel = '카테고리: ' + c.name;
  }

  // ─────────────────────────────────────────────────────────────
  // ② 코호트별 누적연체 곡선 → 히트맵 재사용 (IDB 다월)
  //    각 코호트(취급월)가 N개월 경과 후 어느 결산월에 연체율이 얼마인지
  //    cohortCurves[ym] = [ {elapsed:1, rate10, rate30}, {elapsed:2, ...}, ... ]
  // ─────────────────────────────────────────────────────────────
  const cohortCurves = {};   // { YYYYMM: [{elapsed, rate10, rate30}] }
  const maxElapsed   = 36;   // 최대 36개월까지

  snapKeys.forEach(snapYm => {
    const snap = db[snapYm];
    if (!snap || !snap.records) return;
    const snapYmNum = parseInt(snapYm.slice(0,4))*12 + parseInt(snapYm.slice(4));

    // 이 스냅샷에서 cd 필드가 있는 건들만 코호트별로 집계
    const snapMap = {};
    vintageFilterRecs(filterByMgmtTeam(snap.records)).forEach(r => {
      if (!r.cd || r.cd.length !== 6) return;
      if (!snapMap[r.cd]) snapMap[r.cd] = { bal:0, od10:0, od30:0 };
      const v = snapMap[r.cd];
      v.bal += r.b||0;
      if ((r.d||0)>=10) v.od10 += r.b||0;
      if ((r.d||0)>=30) v.od30 += r.b||0;
    });

    Object.entries(snapMap).forEach(([cohortYm, v]) => {
      if (v.bal === 0) return;
      const cohortNum = parseInt(cohortYm.slice(0,4))*12 + parseInt(cohortYm.slice(4));
      const elapsed   = snapYmNum - cohortNum;
      if (elapsed < 0 || elapsed > maxElapsed) return;
      if (!cohortCurves[cohortYm]) cohortCurves[cohortYm] = [];
      cohortCurves[cohortYm].push({
        elapsed,
        snapYm,
        rate10: +(v.od10/v.bal*100).toFixed(2),
        rate30: +(v.od30/v.bal*100).toFixed(2),
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // ③ 경과월수 구간별 연체율 히트맵  (취급월 × 경과월 → 연체율)
  //    행: 취급월 코호트, 열: 경과월 구간(1M, 2M, 3M, ...)
  // ─────────────────────────────────────────────────────────────
  // 히트맵 셀 데이터: heatmap[cohortYm][elapsed] = rate10
  const heatmap = {};
  Object.entries(cohortCurves).forEach(([cohortYm, pts]) => {
    heatmap[cohortYm] = {};
    pts.forEach(p => { heatmap[cohortYm][p.elapsed] = p.rate10; });
  });
  const hmCohorts = Object.keys(heatmap).sort().slice(-18); // 최근 18코호트
  // 등장하는 경과월 구간 목록
  const elapsedSet = new Set();
  hmCohorts.forEach(k => Object.keys(heatmap[k]).forEach(e => elapsedSet.add(+e)));
  const elapsedCols = Array.from(elapsedSet).sort((a,b)=>a-b);
  const hasHeatmap  = hmCohorts.length > 0 && elapsedCols.length > 0;

  // 히트맵 색상: 0%=초록→5%=노랑→10%↑=빨강
  function hmColor(rate) {
    if (rate <= 0)  return '#f0fdf4';
    if (rate < 2)   return '#bbf7d0';
    if (rate < 5)   return '#fef08a';
    if (rate < 10)  return '#fb923c';
    if (rate < 20)  return '#ef4444';
    return '#7f1d1d';
  }
  function hmTextColor(rate) { return rate >= 5 ? '#fff' : '#374151'; }

  // ── 취급월별 현재 연체율 집계 (테이블용)
  const vintMap = {};
  curRecs.forEach(r => {
    if (!r.cd || r.cd.length !== 6) return;
    if (!vintMap[r.cd]) vintMap[r.cd] = { bal:0, od10:0, od30:0, cnt:0, odCnt:0 };
    const v = vintMap[r.cd];
    v.bal += r.b||0; v.cnt++;
    if ((r.d||0) >= 10) { v.od10 += r.b||0; v.odCnt++; }
    if ((r.d||0) >= 30)   v.od30 += r.b||0;
  });
  const vintRows = Object.entries(vintMap)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([ym, v]) => ({
      ym, label: ym.slice(0,4) + '.' + parseInt(ym.slice(4,6)) + '월',
      ...v,
      rate10: v.bal>0 ? +(v.od10/v.bal*100).toFixed(2) : 0,
      rate30: v.bal>0 ? +(v.od30/v.bal*100).toFixed(2) : 0,
    }));

  // 다월 추이 (필터 적용)
  const trendRows = snapKeys
    .map(k => {
      const e = db[k];
      if (!e || !e.records) return null;
      const recs = vintageFilterRecs(filterByMgmtTeam(e.records));
      const tot  = recs.reduce((s,r)=>s+(r.b||0),0);
      const od10 = recs.filter(r=>(r.d||0)>=10).reduce((s,r)=>s+(r.b||0),0);
      const od30 = recs.filter(r=>(r.d||0)>=30).reduce((s,r)=>s+(r.b||0),0);
      return {
        label: ymToTrendLabel(e.base_date.slice(0,7)),
        rate10: tot>0 ? +(od10/tot*100).toFixed(2):0,
        rate30: tot>0 ? +(od30/tot*100).toFixed(2):0,
      };
    }).filter(Boolean);



  el.innerHTML = \`
<div class="space-y-5">
  <!-- 헤더 -->
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div>
      <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-chart-bar mr-2 text-indigo-500"></i>연체 빈티지 분석</h2>
      <p class="text-sm text-gray-500 mt-0.5">취급월(코호트) 기준 연체율 — ① 히트맵 ② 월별 추이</p>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      \${filterSel}
      \${prodSelHtml}
      <span class="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium border border-indigo-100">
        기준: \${baseDate || '결산자료 없음'}\${baseYm ? ' (' + snapKeys.length + '개월 / 전체 ' + allKeys.length + '개월)' : ''}
      </span>
    </div>
  </div>

  <!-- ① 경과월수 구간별 연체율 히트맵 -->
  <div class="card p-5">
    <div class="mb-3">
      <h3 class="text-sm font-bold text-gray-700"><i class="fas fa-th mr-2 text-purple-400"></i>① 경과월수 구간별 연체율 히트맵</h3>
      <p class="text-xs text-gray-400 mt-0.5">행: 취급월 코호트 &nbsp;|&nbsp; 열: 경과월 수 &nbsp;|&nbsp; 셀: 10일↑ 연체율(%)</p>
    </div>
    \${hasHeatmap ? \`
    <div class="overflow-auto">
      <table style="border-collapse:collapse;font-size:11px;min-width:100%">
        <thead>
          <tr>
            <th style="padding:5px 10px;background:#f9fafb;border:1px solid #e5e7eb;text-align:left;font-weight:600;color:#6b7280;white-space:nowrap">취급월</th>
            \${elapsedCols.map(e=>\`<th style="padding:5px 8px;background:#f9fafb;border:1px solid #e5e7eb;text-align:center;font-weight:600;color:#6b7280;white-space:nowrap">\${e}M</th>\`).join('')}
          </tr>
        </thead>
        <tbody>
          \${hmCohorts.map(cohYm => {
            const row = heatmap[cohYm] || {};
            const lbl = cohYm.slice(0,4)+'.'+parseInt(cohYm.slice(4,6))+'월';
            return \`<tr>
              <td style="padding:5px 10px;border:1px solid #e5e7eb;font-weight:600;color:#374151;white-space:nowrap;background:#f9fafb">\${lbl}</td>
              \${elapsedCols.map(e => {
                const rate = row[e];
                const bg   = rate != null ? hmColor(rate) : '#f9fafb';
                const tc   = rate != null ? hmTextColor(rate) : '#d1d5db';
                const txt  = rate != null ? rate.toFixed(1)+'%' : '-';
                return \`<td style="padding:5px 8px;border:1px solid #e5e7eb;text-align:center;background:\${bg};color:\${tc};font-weight:\${rate>=5?'700':'400'}">\${txt}</td>\`;
              }).join('')}
            </tr>\`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="flex items-center gap-3 mt-3 text-xs text-gray-500 flex-wrap">
      <span class="font-medium">범례:</span>
      \${[['0%','#f0fdf4','#374151'],['~2%','#bbf7d0','#374151'],['~5%','#fef08a','#374151'],['~10%','#fb923c','#fff'],['~20%','#ef4444','#fff'],['20%↑','#7f1d1d','#fff']].map(([l,bg,tc])=>
        \`<span style="background:\${bg};color:\${tc};padding:2px 8px;border-radius:4px;font-weight:500">\${l}</span>\`
      ).join('')}
    </div>
    \` : '<div class="flex flex-col items-center justify-center h-40 text-gray-300 gap-2"><i class="fas fa-th text-3xl"></i><p class="text-sm text-gray-400">다월 결산자료 적재 후 활성화됩니다</p></div>'}
  </div>

  <!-- ② 다월 포트폴리오 연체율 추이 -->
  <div class="card p-5">
    <div class="flex items-center justify-between mb-1">
      <div>
        <h3 class="text-sm font-bold text-gray-700">
          <i class="fas fa-chart-area mr-2 text-teal-400"></i>
          ② 월별 포트폴리오 연체율 추이 <span class="text-xs text-gray-400 font-normal">(유사 빈티지)</span>
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">
          기준월 이하 결산자료 기반 | 각 월 총잔고 대비 연체잔고 시계열 | \${trendRows.length}개월치
        </p>
      </div>
    </div>
    \${trendRows.length >= 2
      ? '<div class="chart-wrap-lg mt-3"><canvas id="vt-trend"></canvas></div>'
      : '<div class="flex items-center justify-center h-40 text-gray-400 text-sm">결산자료 2개월↑ 업로드 시 표시 (' + trendRows.length + '개월 적재)</div>'
    }
  </div>

  <!-- 취급월별 연체 상세 테이블 -->
  \${vintRows.length > 0 ? \`
  <div class="card p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-table mr-2 text-indigo-400"></i>취급월별 연체 상세 테이블</h3>
    <div class="overflow-auto">
      <table class="data-table">
        <thead><tr>
          <th>취급월</th><th class="text-right">건수</th><th class="text-right">잔고</th>
          <th class="text-right">연체건수</th>
          <th class="text-right">10일↑ 연체잔고</th><th class="text-right">10일↑ 연체율</th>
          <th class="text-right">30일↑ 연체잔고</th><th class="text-right">30일↑ 연체율</th>
        </tr></thead>
        <tbody>\${vintRows.map(v=>\`<tr>
          <td class="font-medium">\${v.label}</td>
          <td class="text-right text-gray-600">\${fmtN(v.cnt)}</td>
          <td class="text-right">\${fmtAmt(v.bal)}</td>
          <td class="text-right \${v.odCnt>0?'text-orange-600':''}">\${fmtN(v.odCnt)}</td>
          <td class="text-right \${v.od10>0?'text-orange-500':''}">\${fmtAmt(v.od10)}</td>
          <td class="text-right font-bold \${v.rate10>=10?'text-red-600':v.rate10>=5?'text-orange-500':''}">\${v.rate10.toFixed(2)}%</td>
          <td class="text-right \${v.od30>0?'text-red-400':''}">\${fmtAmt(v.od30)}</td>
          <td class="text-right font-bold \${v.rate30>=10?'text-red-700':v.rate30>=5?'text-red-500':''}">\${v.rate30.toFixed(2)}%</td>
        </tr>\`).join('')}</tbody>
      </table>
    </div>
  </div>\` : ''}

</div>\`;

  // ── 차트 렌더링
  setTimeout(() => {
    // ② 다월 포트폴리오 연체율 추이
    if (trendRows.length >= 2) {
      const tCtx = document.getElementById('vt-trend');
      if (tCtx) {
        new Chart(tCtx, {
          type: 'line',
          data: {
            labels: trendRows.map(r => r.label),
            datasets: [
              {
                label: '10일↑ 연체율(%)',
                data: trendRows.map(r => r.rate10),
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13,148,136,0.1)',
                fill: true,
                borderWidth: 2.5,
                pointRadius: 4,
                tension: 0.3
              },
              {
                label: '30일↑ 연체율(%)',
                data: trendRows.map(r => r.rate30),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220,38,38,0.08)',
                fill: true,
                borderWidth: 2,
                borderDash: [5,3],
                pointRadius: 3,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
              tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + '%' } }
            },
            scales: {
              y: { ticks: { callback: v => v + '%' }, title: { display: true, text: '연체율(%)' } }
            }
          }
        });
      }
    }
  }, 60);
}

// ── 빈티지 필터 변경 핸들러
function onVintageFilter(value) {
  if (value === 'all') {
    vintageFilterType = 'all';
    vintageFilterId   = '';
  } else {
    const sep  = value.indexOf('__');
    if (sep === -1) { vintageFilterType = 'all'; vintageFilterId = ''; }
    else {
      vintageFilterType = value.slice(0, sep);
      vintageFilterId   = value.slice(sep + 2);
    }
  }
  vintageFilterProd = '';  // 상위 필터 변경 시 상품 선택 초기화
  const el = document.getElementById('main-content');
  if (el) renderVintage(el);
}
window.onVintageFilter = onVintageFilter;

// ── 상품 단위 필터 핸들러
function onVintageProdFilter(value) {
  vintageFilterProd = value;  // '' = 전체 상품, 그 외 = 특정 상품명
  const el = document.getElementById('main-content');
  if (el) renderVintage(el);
}
window.onVintageProdFilter = onVintageProdFilter;

async function renderRealestate(el) {
  const db = await getMonthsDB();
  // entries: [{key:'202606', data:{base_date,records,...}}] 형태 — yyyymm 키 유지
  const entries = Object.entries(db)
    .filter(([k,v])=>v&&v.base_date&&v.records)
    .sort((a,b)=>b[0].localeCompare(a[0])); // 최신순
  if (!entries.length) {
    el.innerHTML = '<div class="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">'
      + '<i class="fas fa-building text-5xl text-blue-200"></i>'
      + '<p class="text-lg font-medium text-gray-500">결산자료가 없습니다</p>'
      + '<p class="text-sm">결산자료를 업로드하면 담보론 부동산 현황이 자동으로 표시됩니다</p>'
      + '<button data-page="upload" onclick="goPage(this.dataset.page)" class="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">'
      + '<i class="fas fa-upload mr-2"></i>결산자료 업로드</button></div>';
    return;
  }
  // selKey: yyyymm 형식 (ex: '202606')
  const keyList  = entries.map(([k])=>k);
  const dateList = entries.map(([k,v])=>v.base_date);
  if (!window._reSelKey || !db[window._reSelKey]) window._reSelKey = keyList[0];
  const selKey  = window._reSelKey;
  const selDate = db[selKey].base_date;
  const dataset = db[selKey];
  if (!dataset) { el.innerHTML='<div class="text-gray-400 p-8">데이터 없음</div>'; return; }
  const reSelLoanType = window._reLoanType || 'loan';
  const LT = { all:'전체 합산', loan:'담보론', loanShare:'담보론(지분대출)' };
  const loanTypeName = reSelLoanType === 'all' ? null : LT[reSelLoanType];
  const loanTypeLabel = LT[reSelLoanType] || '전체 합산';
  const stats = calcRealestateStats(filterByMgmtTeam(dataset.records), loanTypeName);
  const S = stats.summary;
  const totalBal = S.all.total.bal, totalCnt = S.all.total.cnt;
  const odBal    = S.od.total.bal,  odCnt    = S.od.total.cnt;
  const nonOdBal = S.nonOd.total.bal, nonOdCnt = S.nonOd.total.cnt;
  const odRate   = totalBal>0 ? (odBal/totalBal*100).toFixed(2) : '0.00';
  const ltv85pBal= S.all.ltv85p.bal;
  const avgLtv   = stats.avgLtv;   // 잔고가중 평균 LTV (%)
  const avgRate  = stats.avgRate;  // 잔고가중 평균 금리 (%)
  const ltvUsed  = RE_LTV_BANDS.filter(b => S.all[b.key].bal > 0);
  const regionRows = RE_REGIONS_ORDER.map(grp => {
    const d = stats.byRegion[grp]; if(!d) return null;
    return {grp, all:d.all, od:d.od, nonOd:d.nonOd};
  }).filter(Boolean).filter(r=>r.all.total.bal>0);
  const coltypeRows = RE_COLTYPES_ORDER.map(ct => {
    const d = stats.byColtype[ct]; if(!d) return null;
    return {ct, all:d.all, od:d.od, nonOd:d.nonOd};
  }).filter(Boolean).filter(r=>r.all.total.bal>0);
  const detailRows = [];
  RE_REGIONS_ORDER.forEach(grp => {
    RE_COLTYPES_ORDER.forEach(ct => {
      const d = stats.byRC[grp+'|'+ct];
      if (d && d.all.total.bal>0) detailRows.push({grp,ct,all:d.all,od:d.od,nonOd:d.nonOd});
    });
  });

  function usedBandsFor(rows) { return RE_LTV_BANDS.filter(b=>rows.some(r=>r.all[b.key].bal>0)); }

  // ── 테이블 헬퍼 (JS 문자열 연결 방식 — 백틱 불필요)
  function bandTh(ub) { return ub.map(b=>'<th style="color:'+b.color+'">'+b.label+'</th>').join(''); }
  function bandCells(ub, bd) {
    return ub.map(b=>'<td>'+fmtChun(bd[b.key].bal)+'<br><span style="font-size:10px;color:#9ca3af">'+(bd[b.key].cnt?bd[b.key].cnt+'건':'')+'</span></td>').join('');
  }
  function bandCellsBold(ub, bd) {
    return ub.map(b=>'<td><b>'+fmtChun(bd[b.key].bal)+'</b><br><span style="font-size:10px;color:#9ca3af">'+(bd[b.key].cnt?bd[b.key].cnt+'건':'')+'</span></td>').join('');
  }

  function mkOdLtvCross() {
    const ub = RE_LTV_BANDS.filter(b=>S.all[b.key].bal>0);
    // 차트 데이터: 미연체/연체 각각 LTV 구간별 잔고(천만)
    const chartData = JSON.stringify({
      bands: ub.map(b=>b.label),
      colors: ub.map(b=>b.color),
      nonOd: ub.map(b=>Math.round(S.nonOd[b.key].bal/10000000)),
      od:    ub.map(b=>Math.round(S.od[b.key].bal/10000000))
    }).replace(/"/g,'&quot;');
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">'
      + '<div class="overflow-auto"><table class="data-table">'
      + '<thead><tr><th class="text-left">구분</th><th class="text-right">건수</th>' + bandTh(ub) + '<th>합계</th><th>비율</th></tr></thead>'
      + '<tbody>'
      + '<tr><td><span class="badge badge-green">미연체</span></td><td class="text-right">'+fmtReCnt(nonOdCnt)+'</td>'+bandCells(ub,S.nonOd)+'<td class="font-semibold" style="color:#059669">'+fmtChun(nonOdBal)+'</td><td>'+fmtRePct(nonOdBal,totalBal)+'</td></tr>'
      + '<tr><td><span class="badge badge-red">연체(d&gt;10)</span></td><td class="text-right">'+fmtReCnt(odCnt)+'</td>'+bandCells(ub,S.od)+'<td class="font-semibold" style="color:#dc2626">'+fmtChun(odBal)+'</td><td>'+fmtRePct(odBal,totalBal)+'</td></tr>'
      + '<tr style="background:#f8fafd;font-weight:700;border-top:2px solid #e5e7eb"><td>합계</td><td class="text-right">'+fmtReCnt(totalCnt)+'</td>'+bandCellsBold(ub,S.all)+'<td><b>'+fmtChun(totalBal)+'</b></td><td>100%</td></tr>'
      + '</tbody></table></div>'
      + '<div><canvas id="re-chart-odltv" height="140" data-chart="'+chartData+'"></canvas></div>'
      + '</div>';
  }

  function mkRegionCross() {
    const ub = usedBandsFor(regionRows);
    // 지역별 담보종류 상세 데이터를 JSON으로 미리 직렬화 (마우스오버 툴팁용)
    const regionDetailMap = {};
    regionRows.forEach(r => {
      const ctDetails = RE_COLTYPES_ORDER.map(ct => {
        const d = stats.byRC[r.grp+'|'+ct];
        if (!d || d.all.total.bal===0) return null;
        return { ct, bal: d.all.total.bal, cnt: d.all.total.cnt, odBal: d.od.total.bal };
      }).filter(Boolean);
      regionDetailMap[r.grp] = ctDetails;
    });
    const detailJson = JSON.stringify(regionDetailMap).replace(/"/g,'&quot;');

    // 차트 데이터: 지역별 LTV 구간 누적 바 + 연체율 꺾은선
    const chartData = JSON.stringify({
      labels:   regionRows.map(r=>r.grp),
      colors:   regionRows.map(r=>RE_REGION_COLORS[r.grp]||'#6b7280'),
      bands:    ub.map(b=>b.label),
      bandClrs: ub.map(b=>b.color),
      balByBand: ub.map(b=>regionRows.map(r=>Math.round(r.all[b.key].bal/10000000))),
      totals:   regionRows.map(r=>Math.round(r.all.total.bal/10000000)),
      odRates:  regionRows.map(r=>r.all.total.bal>0?parseFloat((r.od.total.bal/r.all.total.bal*100).toFixed(2)):0)
    }).replace(/"/g,'&quot;');

    const rows = regionRows.map(r=>{
      const dot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+(RE_REGION_COLORS[r.grp]||'#6b7280')+';margin-right:6px"></span>';
      const color = RE_REGION_COLORS[r.grp]||'#6b7280';
      return '<tr class="re-region-row" data-grp="'+r.grp+'" data-detail="'+detailJson+'" data-color="'+color+'" style="cursor:pointer">'
        + '<td>'+dot+r.grp+'</td>'
        + '<td class="text-right">'+fmtReCnt(r.all.total.cnt)+'</td>'
        + bandCells(ub,r.all)
        + '<td class="font-semibold">'+fmtChun(r.all.total.bal)+'</td>'
        + '<td style="color:#dc2626">'+fmtChun(r.od.total.bal)+'</td>'
        + '<td>'+fmtRePct(r.od.total.bal,r.all.total.bal)+'</td>'
        + '</tr>';
    }).join('');

    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start" id="re-region-wrap">'
      + '<div><div class="overflow-auto"><table class="data-table">'
      + '<thead><tr><th class="text-left">지역</th><th class="text-right">건수</th>' + bandTh(ub) + '<th>잔고합계</th><th>연체잔고</th><th>연체율</th></tr></thead>'
      + '<tbody>' + rows
      + '<tr style="background:#f8fafd;font-weight:700;border-top:2px solid #e5e7eb"><td>합계</td><td class="text-right">'+fmtReCnt(totalCnt)+'</td>'+bandCellsBold(ub,S.all)+'<td><b>'+fmtChun(totalBal)+'</b></td><td style="color:#dc2626"><b>'+fmtChun(odBal)+'</b></td><td>'+fmtRePct(odBal,totalBal)+'</td></tr>'
      + '</tbody></table></div></div>'
      + '<div><canvas id="re-chart-region" height="180" data-chart="'+chartData+'"></canvas></div>'
      // 툴팁 DOM (숨김 상태)
      + '<div id="re-region-tooltip" style="display:none;position:fixed;z-index:9999;background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.13);min-width:320px;max-width:400px;padding:0;pointer-events:none"></div>'
      + '</div>';
  }

  function mkColtypeCross() {
    const ub = usedBandsFor(coltypeRows);
    // 차트 데이터: 담보종류별 LTV 구간 누적 가로 바
    const chartData = JSON.stringify({
      labels:    coltypeRows.map(r=>r.ct),
      colors:    coltypeRows.map(r=>RE_COLTYPE_COLORS[r.ct]||'#6b7280'),
      bands:     ub.map(b=>b.label),
      bandClrs:  ub.map(b=>b.color),
      balByBand: ub.map(b=>coltypeRows.map(r=>Math.round(r.all[b.key].bal/10000000))),
      totals:    coltypeRows.map(r=>Math.round(r.all.total.bal/10000000)),
      odRates:   coltypeRows.map(r=>r.all.total.bal>0?parseFloat((r.od.total.bal/r.all.total.bal*100).toFixed(2)):0)
    }).replace(/"/g,'&quot;');
    const rows = coltypeRows.map(r=>{
      const dot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+(RE_COLTYPE_COLORS[r.ct]||'#6b7280')+';margin-right:6px"></span>';
      return '<tr><td>'+dot+r.ct+'</td><td class="text-right">'+fmtReCnt(r.all.total.cnt)+'</td>'+bandCells(ub,r.all)
        +'<td class="font-semibold">'+fmtChun(r.all.total.bal)+'</td><td style="color:#dc2626">'+fmtChun(r.od.total.bal)+'</td><td>'+fmtRePct(r.od.total.bal,r.all.total.bal)+'</td></tr>';
    }).join('');
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">'
      + '<div><div class="overflow-auto"><table class="data-table">'
      + '<thead><tr><th class="text-left">담보종류</th><th class="text-right">건수</th>' + bandTh(ub) + '<th>잔고합계</th><th>연체잔고</th><th>연체율</th></tr></thead>'
      + '<tbody>' + rows
      + '<tr style="background:#f8fafd;font-weight:700;border-top:2px solid #e5e7eb"><td>합계</td><td class="text-right">'+fmtReCnt(totalCnt)+'</td>'+bandCellsBold(ub,S.all)+'<td><b>'+fmtChun(totalBal)+'</b></td><td style="color:#dc2626"><b>'+fmtChun(odBal)+'</b></td><td>'+fmtRePct(odBal,totalBal)+'</td></tr>'
      + '</tbody></table></div></div>'
      + '<div><canvas id="re-chart-coltype" height="200" data-chart="'+chartData+'"></canvas></div>'
      + '</div>';
  }

  function mkDetailCross() {
    if (!detailRows.length) return '<div class="text-gray-400 p-4 text-sm">데이터 없음</div>';
    const ub = usedBandsFor(detailRows);
    const regions = [...new Set(detailRows.map(r=>r.grp))];
    const bodyHtml = regions.map(grp => {
      const rows = detailRows.filter(r=>r.grp===grp);
      const regBal = rows.reduce((s,r)=>s+r.all.total.bal,0);
      const regOd  = rows.reduce((s,r)=>s+r.od.total.bal,0);
      const regCnt = rows.reduce((s,r)=>s+r.all.total.cnt,0);
      const rowsHtml = rows.map((r,i)=>{
        const cells = bandCells(ub,r.all);
        const rc = i===0 ? '<td rowspan="'+rows.length+'" style="font-weight:700;color:'+(RE_REGION_COLORS[grp]||'#374151')+';border-right:1px solid #e5e7eb;background:#f8fafd;vertical-align:top;padding-top:10px">'+grp+'</td>' : '';
        const dot = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:'+(RE_COLTYPE_COLORS[r.ct]||'#6b7280')+';margin-right:5px"></span>';
        return '<tr'+(i===rows.length-1?' style="border-bottom:2px solid #d1d5db"':'')+'>'+rc+'<td>'+dot+r.ct+'</td><td class="text-right">'+fmtReCnt(r.all.total.cnt)+'</td>'+cells+'<td class="font-semibold">'+fmtChun(r.all.total.bal)+'</td><td style="color:#dc2626">'+fmtChun(r.od.total.bal)+'</td><td>'+fmtRePct(r.od.total.bal,r.all.total.bal)+'</td></tr>';
      }).join('');
      const sc = ub.map(b=>'<td>'+fmtChun(rows.reduce((s,r)=>s+r.all[b.key].bal,0))+'</td>').join('');
      const sub = '<tr style="background:#eff6ff;font-weight:600;border-bottom:2px solid #bfdbfe"><td colspan="2" style="color:'+(RE_REGION_COLORS[grp]||'#374151')+'">'+grp+' 소계</td><td class="text-right">'+fmtReCnt(regCnt)+'</td>'+sc+'<td>'+fmtChun(regBal)+'</td><td style="color:#dc2626">'+fmtChun(regOd)+'</td><td>'+fmtRePct(regOd,regBal)+'</td></tr>';
      return rowsHtml + sub;
    }).join('');
    const tot = ub.map(b=>'<td><b>'+fmtChun(S.all[b.key].bal)+'</b></td>').join('');

    // 지역별 차트 데이터: 담보종류 × LTV 누적 바 + 연체율 꺾은선
    const regionChartDataArr = regions.map(function(grp) {
      const rows = detailRows.filter(r=>r.grp===grp);
      const ubR = RE_LTV_BANDS.filter(b=>rows.some(r=>r.all[b.key].bal>0));
      return JSON.stringify({
        grp:       grp,
        color:     RE_REGION_COLORS[grp]||'#6b7280',
        labels:    rows.map(r=>r.ct),
        ctColors:  rows.map(r=>RE_COLTYPE_COLORS[r.ct]||'#94a3b8'),
        bands:     ubR.map(b=>b.label),
        bandClrs:  ubR.map(b=>b.color),
        balByBand: ubR.map(b=>rows.map(r=>Math.round(r.all[b.key].bal/10000000))),
        odRates:   rows.map(r=>r.all.total.bal>0?parseFloat((r.od.total.bal/r.all.total.bal*100).toFixed(2)):0)
      }).replace(/"/g,'&quot;');
    });

    // 지역별 차트 캔버스 + 테이블 세로 구성
    const chartsHtml = regions.map(function(grp, i) {
      const color = RE_REGION_COLORS[grp]||'#6b7280';
      const dot = '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+color+';margin-right:5px;vertical-align:middle"></span>';
      return '<div style="background:#f8fafc;border-radius:10px;padding:12px 14px;border:1px solid #e5e7eb">'
        + '<div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:8px">'+dot+grp+'</div>'
        + '<canvas id="re-chart-detail-'+i+'" height="160" data-chart="'+regionChartDataArr[i]+'"></canvas>'
        + '</div>';
    }).join('');

    return '<div style="display:grid;grid-template-columns:1.6fr 1fr;gap:16px;align-items:start">'
      + '<div><div class="overflow-auto"><table class="data-table">'
      + '<thead><tr><th class="text-left">지역</th><th class="text-left">담보종류</th><th class="text-right">건수</th>' + bandTh(ub) + '<th>잔고합계</th><th>연체잔고</th><th>연체율</th></tr></thead>'
      + '<tbody>' + bodyHtml
      + '<tr style="background:#f8fafd;font-weight:700;border-top:2px solid #374151"><td colspan="2">전체 합계</td><td class="text-right">'+fmtReCnt(totalCnt)+'</td>'+tot+'<td><b>'+fmtChun(totalBal)+'</b></td><td style="color:#dc2626"><b>'+fmtChun(odBal)+'</b></td><td>'+fmtRePct(odBal,totalBal)+'</td></tr>'
      + '</tbody></table></div></div>'
      + '<div style="display:flex;flex-direction:column;gap:10px">' + chartsHtml + '</div>'
      + '</div>';
  }

  // ── LTV 분포 바
  const ltvBarHtml = ltvUsed.length > 0 ? (
    '<div class="bg-white rounded-xl border border-gray-200 p-4">'
    + '<div class="flex items-center justify-between mb-3">'
    + '<span class="text-xs font-bold text-gray-600"><i class="fas fa-sliders-h mr-1.5 text-blue-400"></i>LTV 구간별 잔고 분포</span>'
    + '<span class="text-xs text-gray-400">'+selDate+' 기준 · '+loanTypeLabel+'</span>'
    + '</div>'
    + '<div style="display:flex;height:20px;border-radius:10px;overflow:hidden;gap:1px;margin-bottom:10px">'
    + ltvUsed.map(b=>'<div style="flex:'+(S.all[b.key].bal/totalBal)+';background:'+b.color+';min-width:2px" title="'+b.label+': '+fmtChun(S.all[b.key].bal)+' ('+fmtRePct(S.all[b.key].bal,totalBal)+') '+S.all[b.key].cnt+'건"></div>').join('')
    + '</div>'
    + '<div class="flex flex-wrap gap-x-4 gap-y-1.5">'
    + ltvUsed.map(b=>'<div class="flex items-center gap-1.5"><span style="width:10px;height:10px;border-radius:2px;background:'+b.color+';display:inline-block;flex-shrink:0"></span><span class="text-xs text-gray-600">'+b.label+'</span><span class="text-xs font-semibold text-gray-800">'+fmtChun(S.all[b.key].bal)+'</span><span class="text-xs text-gray-400">('+fmtRePct(S.all[b.key].bal,totalBal)+'·'+S.all[b.key].cnt+'건)</span></div>').join('')
    + '</div></div>'
  ) : '';

  // ── 대출유형 탭 (전체 합산 / 담보론 / 담보론(지분대출))
  const loanTabsHtml = '<div class="flex gap-2">'
    + Object.entries(LT).map(([k,v]) => {
        const isActive = k === reSelLoanType;
        const isAll    = k === 'all';
        const cls      = isAll
          ? (isActive ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400')
          : (isActive ? 'bg-blue-600 text-white border-blue-600'  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300');
        const icon     = isAll ? '<i class="fas fa-layer-group mr-1.5 text-xs"></i>' : '';
        return '<button data-lt="'+k+'" onclick="window._reLoanType=this.dataset.lt;renderPage()" class="px-4 py-2 rounded-xl text-sm font-semibold border transition-all '+cls+'">'+icon+v+'</button>';
      }).join('')
    + '</div>';

  // ── 기준월 select (value = yyyymm 키)
  const dateSelHtml = '<select onchange="window._reSelKey=this.value;renderPage()" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 font-medium">'
    + keyList.map((k,i)=>'<option value="'+k+'"'+(k===selKey?' selected':'')+'>'+dateList[i]+'</option>').join('')
    + '</select>';

  el.innerHTML = '<div class="space-y-5">'
    + '<div class="flex flex-wrap items-center justify-between gap-3">'
    + '<div><h2 class="text-lg font-bold text-gray-800"><i class="fas fa-building mr-2 text-blue-500"></i>부동산 현황</h2>'
    + '<p class="text-xs text-gray-400 mt-0.5">담보 유형별 LTV·지역·담보종류 현황 — 결산자료 기준 (단위: 천만원)</p></div>'
    + dateSelHtml + '</div>'
    + loanTabsHtml
    + (totalCnt===0 ? '<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700"><i class="fas fa-info-circle mr-2"></i>선택한 결산자료에 <b>'+loanTypeLabel+'</b> 계약이 없습니다.</div>' : '')
    // KPI 카드 (5개: 전체 잔고 / 연체 / 미연체 / 평균 LTV / 평균 금리)
    + '<div class="grid grid-cols-2 md:grid-cols-5 gap-4">'
    + '<div class="bg-white rounded-xl border border-blue-200 p-4"><div class="text-xs text-blue-600 mb-1 font-medium"><i class="fas fa-coins mr-1"></i>전체 잔고</div><div style="font-size:22px;font-weight:800;color:#1d4ed8">'+fmtChun(totalBal)+'</div><div class="text-xs text-gray-400 mt-1">'+fmtReCnt(totalCnt)+'</div></div>'
    + '<div class="bg-white rounded-xl border border-red-200 p-4"><div class="text-xs text-red-600 mb-1 font-medium"><i class="fas fa-exclamation-triangle mr-1"></i>연체 잔고</div><div style="font-size:22px;font-weight:800;color:#dc2626">'+fmtChun(odBal)+'</div><div class="text-xs text-gray-400 mt-1">'+fmtReCnt(odCnt)+' / 연체율 <strong style="color:#dc2626">'+odRate+'%</strong></div></div>'
    + '<div class="bg-white rounded-xl border border-emerald-200 p-4"><div class="text-xs text-emerald-600 mb-1 font-medium"><i class="fas fa-check-circle mr-1"></i>미연체 잔고</div><div style="font-size:22px;font-weight:800;color:#059669">'+fmtChun(nonOdBal)+'</div><div class="text-xs text-gray-400 mt-1">'+fmtReCnt(nonOdCnt)+' / '+fmtRePct(nonOdBal,totalBal)+'</div></div>'
    + '<div class="bg-white rounded-xl border border-purple-200 p-4"><div class="text-xs text-purple-600 mb-1 font-medium"><i class="fas fa-chart-pie mr-1"></i>평균 LTV</div><div style="font-size:22px;font-weight:800;color:#7c3aed">'+(avgLtv!==null?avgLtv+'%':'-')+'</div><div class="text-xs text-gray-400 mt-1">잔고가중 평균 &nbsp;&nbsp;레인지: '+fmtRePct(ltv85pBal,totalBal)+'@85%↑</div></div>'
    + '<div class="bg-white rounded-xl border border-orange-200 p-4"><div class="text-xs text-orange-600 mb-1 font-medium"><i class="fas fa-percent mr-1"></i>평균 금리</div><div style="font-size:22px;font-weight:800;color:#ea580c">'+(avgRate!==null?avgRate+'%':'-')+'</div><div class="text-xs text-gray-400 mt-1">잔고가중 평균</div></div>'
    + '</div>'
    + ltvBarHtml
    + '<div class="bg-white rounded-xl border border-gray-200 p-4"><p class="text-xs font-bold text-gray-700 mb-3"><i class="fas fa-exchange-alt mr-1.5 text-red-400"></i>연체·미연체 × LTV 구간</p>' + mkOdLtvCross() + '</div>'
    + '<div class="bg-white rounded-xl border border-gray-200 p-4"><p class="text-xs font-bold text-gray-700 mb-3"><i class="fas fa-map-marker-alt mr-1.5 text-blue-400"></i>지역 × LTV 구간</p>' + mkRegionCross() + '</div>'
    + '<div class="bg-white rounded-xl border border-gray-200 p-4"><p class="text-xs font-bold text-gray-700 mb-3"><i class="fas fa-home mr-1.5 text-teal-400"></i>담보종류 × LTV 구간</p>' + mkColtypeCross() + '</div>'
    + '<div class="bg-white rounded-xl border border-gray-200 p-4"><p class="text-xs font-bold text-gray-700 mb-3"><i class="fas fa-map-marked-alt mr-1.5 text-orange-400"></i>지역 × 담보종류 × LTV 상세</p>' + mkDetailCross() + '</div>'
    + '</div>';

  // ── Chart.js 그래프 초기화
  (function bindReCharts() {
    if (typeof Chart === 'undefined') return;

    // 부동산 현황 차트는 전역 charts 객체에 등록 안 되므로 canvas별로 기존 인스턴스 제거
    function safeNewChart(id, config) {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
      return new Chart(canvas, config);
    }

    // 공통 옵션
    const pluginNoDataLabel = {
      id: 're-no-data',
      afterDraw: function(chart) {
        if (chart.data.datasets.every(d=>d.data.every(v=>!v))) {
          const ctx = chart.ctx; const {width,height} = chart;
          ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillStyle='#9ca3af'; ctx.font='12px sans-serif';
          ctx.fillText('데이터 없음', width/2, height/2); ctx.restore();
        }
      }
    };

    // ① 연체·미연체 × LTV 구간 — 누적 가로 바 (미연체/연체 각각 LTV 스택)
    (function() {
      const canvas = document.getElementById('re-chart-odltv');
      if (!canvas) return;
      const d = JSON.parse(canvas.getAttribute('data-chart').replace(/&quot;/g,'"'));
      safeNewChart('re-chart-odltv', {
        type: 'bar',
        data: {
          labels: ['미연체', '연체'],
          datasets: d.bands.map(function(label,i){
            return { label: label, data: [d.nonOd[i], d.od[i]],
              backgroundColor: d.colors[i]+'cc', borderColor: d.colors[i], borderWidth:1 };
          })
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { position:'bottom', labels:{ boxWidth:10, font:{size:10} } },
            tooltip: { callbacks: { label: function(ctx) {
              return ' '+ctx.dataset.label+': '+ctx.parsed.x.toLocaleString()+'천만';
            }}}
          },
          scales: {
            x: { stacked:true, ticks:{ font:{size:10}, callback:function(v){ return v.toLocaleString(); } } },
            y: { stacked:true }
          }
        },
        plugins: [pluginNoDataLabel]
      });
    })();

    // ② 지역 × LTV 구간 — 누적 세로 바 + 연체율 꺾은선 (혼합 차트)
    (function() {
      const canvas = document.getElementById('re-chart-region');
      if (!canvas) return;
      const d = JSON.parse(canvas.getAttribute('data-chart').replace(/&quot;/g,'"'));
      const stackDs = d.bands.map(function(label,i){
        return { type:'bar', label: label, data: d.balByBand[i],
          backgroundColor: d.bandClrs[i]+'cc', borderColor: d.bandClrs[i],
          borderWidth:1, stack:'bal', yAxisID:'y' };
      });
      const lineDs = {
        type:'line', label:'연체율(%)', data: d.odRates,
        borderColor:'#dc2626', backgroundColor:'transparent',
        pointBackgroundColor:'#dc2626', pointRadius:5, pointHoverRadius:7,
        borderWidth:2, tension:0.3, yAxisID:'y2'
      };
      safeNewChart('re-chart-region', {
        type: 'bar',
        data: { labels: d.labels, datasets: [...stackDs, lineDs] },
        options: {
          responsive: true,
          plugins: {
            legend: { position:'bottom', labels:{ boxWidth:10, font:{size:10} } },
            tooltip: { callbacks: { label: function(ctx) {
              if (ctx.dataset.yAxisID==='y2') return ' 연체율: '+ctx.parsed.y+'%';
              return ' '+ctx.dataset.label+': '+ctx.parsed.y.toLocaleString()+'천만';
            }}}
          },
          scales: {
            y:  { stacked:true, position:'left',  ticks:{ font:{size:10}, callback:function(v){ return v.toLocaleString(); } }, title:{display:true,text:'잔고(천만)',font:{size:10}} },
            y2: { stacked:false, position:'right', grid:{drawOnChartArea:false},
                  ticks:{ font:{size:10}, callback:function(v){ return v+'%'; } },
                  title:{display:true,text:'연체율',font:{size:10}} }
          }
        },
        plugins: [pluginNoDataLabel]
      });
    })();

    // ③ 담보종류 × LTV 구간 — 누적 세로 바 + 연체율 꺾은선
    (function() {
      const canvas = document.getElementById('re-chart-coltype');
      if (!canvas) return;
      const d = JSON.parse(canvas.getAttribute('data-chart').replace(/&quot;/g,'"'));
      const stackDs = d.bands.map(function(label,i){
        return { type:'bar', label: label, data: d.balByBand[i],
          backgroundColor: d.bandClrs[i]+'cc', borderColor: d.bandClrs[i],
          borderWidth:1, stack:'bal', yAxisID:'y' };
      });
      const lineDs = {
        type:'line', label:'연체율(%)', data: d.odRates,
        borderColor:'#dc2626', backgroundColor:'transparent',
        pointBackgroundColor:'#dc2626', pointRadius:4, pointHoverRadius:6,
        borderWidth:2, tension:0.3, yAxisID:'y2'
      };
      safeNewChart('re-chart-coltype', {
        type: 'bar',
        data: { labels: d.labels, datasets: [...stackDs, lineDs] },
        options: {
          responsive: true,
          plugins: {
            legend: { position:'bottom', labels:{ boxWidth:10, font:{size:10} } },
            tooltip: { callbacks: { label: function(ctx) {
              if (ctx.dataset.yAxisID==='y2') return ' 연체율: '+ctx.parsed.y+'%';
              return ' '+ctx.dataset.label+': '+ctx.parsed.y.toLocaleString()+'천만';
            }}}
          },
          scales: {
            y:  { stacked:true, position:'left',  ticks:{ font:{size:10}, callback:function(v){ return v.toLocaleString(); } } },
            y2: { stacked:false, position:'right', grid:{drawOnChartArea:false},
                  ticks:{ font:{size:10}, callback:function(v){ return v+'%'; } } }
          }
        },
        plugins: [pluginNoDataLabel]
      });
    })();

    // ④ 지역별 담보종류 × LTV 누적 바 + 연체율 꺾은선 (re-chart-detail-0, -1, -2 ...)
    (function() {
      var idx = 0;
      while (true) {
        var canvas = document.getElementById('re-chart-detail-'+idx);
        if (!canvas) break;
        (function(cvs, chartId) {
          var d = JSON.parse(cvs.getAttribute('data-chart').replace(/&quot;/g,'"'));
          var stackDs = d.bands.map(function(label, i) {
            return {
              type:'bar', label: label, data: d.balByBand[i],
              backgroundColor: d.bandClrs[i]+'cc', borderColor: d.bandClrs[i],
              borderWidth:1, stack:'bal', yAxisID:'y'
            };
          });
          var lineDs = {
            type:'line', label:'연체율(%)', data: d.odRates,
            borderColor:'#dc2626', backgroundColor:'transparent',
            pointBackgroundColor:'#dc2626', pointRadius:4, pointHoverRadius:6,
            borderWidth:2, tension:0.3, yAxisID:'y2'
          };
          safeNewChart(chartId, {
            type: 'bar',
            data: { labels: d.labels, datasets: stackDs.concat([lineDs]) },
            options: {
              responsive: true,
              plugins: {
                legend: { position:'bottom', labels:{ boxWidth:9, font:{size:9}, padding:6 } },
                tooltip: { callbacks: { label: function(ctx) {
                  if (ctx.dataset.yAxisID==='y2') return ' 연체율: '+ctx.parsed.y+'%';
                  return ' '+ctx.dataset.label+': '+ctx.parsed.y.toLocaleString()+'천만';
                }}}
              },
              scales: {
                x: { ticks:{ font:{size:9} } },
                y:  { stacked:true, position:'left',
                      ticks:{ font:{size:9}, callback:function(v){ return v.toLocaleString(); } },
                      title:{display:true, text:'잔고(천만)', font:{size:9}} },
                y2: { stacked:false, position:'right', grid:{drawOnChartArea:false},
                      ticks:{ font:{size:9}, callback:function(v){ return v+'%'; } },
                      title:{display:true, text:'연체율', font:{size:9}} }
              }
            },
            plugins: [pluginNoDataLabel]
          });
        })(canvas, 're-chart-detail-'+idx);
        idx++;
      }
    })();
  })();

  // ── 지역 행 마우스오버 툴팁 이벤트 바인딩
  (function bindRegionTooltip() {
    const tip = document.getElementById('re-region-tooltip');
    if (!tip) return;
    const rows2 = document.querySelectorAll('.re-region-row');
    rows2.forEach(function(row) {
      row.addEventListener('mouseenter', function(e) {
        const grp   = row.getAttribute('data-grp');
        const color = row.getAttribute('data-color') || '#6b7280';
        const allDetail = JSON.parse(row.getAttribute('data-detail').replace(/&quot;/g, '"'));
        const details = allDetail[grp] || [];
        if (!details.length) return;
        const totalB = details.reduce(function(s,d){return s+d.bal;},0);
        const totalC = details.reduce(function(s,d){return s+d.cnt;},0);
        const totalO = details.reduce(function(s,d){return s+d.odBal;},0);

        // 담보종류별 가로 바 + 표
        const RE_CT_COLORS2 = {'아파트':'#2563eb','빌라,맨션':'#0891b2','단독주택':'#059669','다세대':'#d97706','토지':'#7c3aed','오피스텔':'#db2777','상가':'#64748b'};
        const barHtml = details.map(function(d){
          const pct = totalB>0?(d.bal/totalB*100):0;
          const c = RE_CT_COLORS2[d.ct]||'#94a3b8';
          return '<div style="flex:'+pct+';background:'+c+';min-width:2px" title="'+d.ct+'"></div>';
        }).join('');

        const rowsHtml = details.map(function(d){
          const c = RE_CT_COLORS2[d.ct]||'#94a3b8';
          const pct = totalB>0?(d.bal/totalB*100).toFixed(1)+'%':'-';
          const odRate = d.bal>0?(d.odBal/d.bal*100).toFixed(1)+'%':'-';
          const dot = '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:'+c+';margin-right:5px;flex-shrink:0"></span>';
          return '<tr style="border-bottom:1px solid #f1f5f9">'
            + '<td style="padding:5px 8px;font-size:12px;white-space:nowrap">'+dot+d.ct+'</td>'
            + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:#374151">'+Math.round(d.bal/10000000).toLocaleString()+'천만</td>'
            + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:#6b7280">'+d.cnt.toLocaleString()+'건</td>'
            + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:#6b7280">'+pct+'</td>'
            + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:'+(parseFloat(odRate)>=5?'#dc2626':'#6b7280')+'">'+odRate+'</td>'
            + '</tr>';
        }).join('');

        tip.innerHTML = '<div style="padding:12px 14px 8px;border-bottom:1px solid #f1f5f9">'
          + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">'
          + '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+color+'"></span>'
          + '<span style="font-size:13px;font-weight:700;color:#1e293b">'+grp+'</span>'
          + '<span style="margin-left:auto;font-size:11px;color:#94a3b8">담보종류 상세</span>'
          + '</div></div>'
          + '<div style="padding:8px 14px 4px">'
          + '<div style="display:flex;height:6px;border-radius:3px;overflow:hidden;gap:1px;margin-bottom:10px">'+barHtml+'</div>'
          + '<table style="width:100%;border-collapse:collapse">'
          + '<thead><tr style="background:#f8fafc">'
          + '<th style="padding:4px 8px;font-size:11px;color:#94a3b8;text-align:left;font-weight:600">담보종류</th>'
          + '<th style="padding:4px 8px;font-size:11px;color:#94a3b8;text-align:right;font-weight:600">잔고</th>'
          + '<th style="padding:4px 8px;font-size:11px;color:#94a3b8;text-align:right;font-weight:600">건수</th>'
          + '<th style="padding:4px 8px;font-size:11px;color:#94a3b8;text-align:right;font-weight:600">비율</th>'
          + '<th style="padding:4px 8px;font-size:11px;color:#94a3b8;text-align:right;font-weight:600">연체율</th>'
          + '</tr></thead>'
          + '<tbody>'+rowsHtml+'</tbody>'
          + '<tfoot><tr style="background:#f8fafc;font-weight:700">'
          + '<td style="padding:5px 8px;font-size:12px">합계</td>'
          + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:#1d4ed8">'+Math.round(totalB/10000000).toLocaleString()+'천만</td>'
          + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:#374151">'+totalC.toLocaleString()+'건</td>'
          + '<td style="padding:5px 8px;font-size:12px;text-align:right">100%</td>'
          + '<td style="padding:5px 8px;font-size:12px;text-align:right;color:#dc2626">'+( totalB>0?(totalO/totalB*100).toFixed(1)+'%':'-')+'</td>'
          + '</tr></tfoot></table></div>';

        // 툴팁 위치: 마우스 오른쪽에 표시, 화면 밖 넘치면 왼쪽으로
        tip.style.display = 'block';
        const rect = tip.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight;
        let tx = e.clientX + 14;
        let ty = e.clientY - 10;
        if (tx + rect.width > vw - 10) tx = e.clientX - rect.width - 14;
        if (ty + rect.height > vh - 10) ty = vh - rect.height - 10;
        tip.style.left = tx + 'px';
        tip.style.top  = ty + 'px';

        // 행 하이라이트
        row.style.background = '#eff6ff';
      });
      row.addEventListener('mousemove', function(e) {
        const tip2 = document.getElementById('re-region-tooltip');
        if (!tip2 || tip2.style.display==='none') return;
        const rect2 = tip2.getBoundingClientRect();
        const vw2 = window.innerWidth, vh2 = window.innerHeight;
        let tx2 = e.clientX + 14;
        let ty2 = e.clientY - 10;
        if (tx2 + rect2.width > vw2 - 10) tx2 = e.clientX - rect2.width - 14;
        if (ty2 + rect2.height > vh2 - 10) ty2 = vh2 - rect2.height - 10;
        tip2.style.left = tx2 + 'px';
        tip2.style.top  = ty2 + 'px';
      });
      row.addEventListener('mouseleave', function() {
        const tip3 = document.getElementById('re-region-tooltip');
        if (tip3) tip3.style.display = 'none';
        row.style.background = '';
      });
    });
  })();
}

// ==================== 페이지: 월별 추이 ====================
function renderTrend(el) {
  if (!TREND) {
    el.innerHTML='<div class="flex items-center justify-center h-64 text-gray-400">추이 데이터(data.json)가 없습니다</div>';
    return;
  }
  sortTrendMonths(); // 월별 추이 페이지 진입 시에도 정렬 보장
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
    sortTrendMonths();
    const _tm = TREND.months.slice(); // 정렬 직후 스냅샷
    mkLine('tr-bal',_tm,[
      {label:'융자잔고(억)',data:tData.balance.map(b=>b.amount),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.08)',fill:true},
      {label:'신규대출(억)',data:tData.new_loans.map(n=>n.amount),borderColor:'#059669',borderDash:[5,3]}
    ],{});
    mkLine('tr-od',_tm,[
      {label:'10일연체율',data:tData.overdue.map(o=>o.rate_10),borderColor:'#f97316',borderDash:[4,2]},
      {label:'30일연체율',data:tData.overdue.map(o=>o.rate_30),borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true}
    ],{pct:true});
  },50);
}

// ==================== 페이지: 권한 설정 ====================
function renderAuthPage(el) {
  const users = loadAuthUsers();

  function html() {
    return \`
<div class="space-y-5">
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-user-shield mr-2 text-blue-600"></i>권한 설정</h2>
    <button onclick="openNewUserModal()" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
      <i class="fas fa-plus"></i>아이디 개설
    </button>
  </div>

  <div class="card overflow-hidden">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th class="text-left px-4 py-3 font-semibold text-gray-600 w-32">아이디</th>
          <th class="text-left px-4 py-3 font-semibold text-gray-600 w-24">이름</th>
          <th class="text-left px-4 py-3 font-semibold text-gray-600">허용 메뉴</th>
          <th class="text-left px-4 py-3 font-semibold text-gray-600 w-28">역할</th>
          <th class="text-center px-4 py-3 font-semibold text-gray-600 w-48">관리</th>
        </tr>
      </thead>
      <tbody>
        \${users.map((u,i) => \`
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="px-4 py-3 font-mono text-blue-700 font-medium">\${u.id}</td>
          <td class="px-4 py-3 text-gray-700">\${u.name}</td>
          <td class="px-4 py-3">
            \${u.role === 'admin'
              ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"><i class="fas fa-infinity"></i>전체</span>'
              : \`<span class="text-xs text-gray-500">\${u.allowedPages.length}개 메뉴 허용</span>\`
            }
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded text-xs font-semibold \${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-gray-100 text-gray-600'}">
              \${u.role==='admin'?'관리자':'일반'}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-center gap-2">
              <button onclick="openEditUserModal(\${i})" class="px-2.5 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 border border-blue-200">
                <i class="fas fa-key mr-1"></i>권한편집
              </button>
              <button onclick="openCopyUserModal(\${i})" class="px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 border border-green-200">
                <i class="fas fa-copy mr-1"></i>복제
              </button>
              <button onclick="resetUserPw(\${i})" class="px-2.5 py-1 text-xs bg-orange-50 text-orange-600 rounded hover:bg-orange-100 border border-orange-200">
                <i class="fas fa-redo mr-1"></i>PW초기화
              </button>
              \${u.id!=='admin'?\`<button onclick="deleteUser(\${i})" class="px-2.5 py-1 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-200"><i class="fas fa-trash"></i></button>\`:''}
            </div>
          </td>
        </tr>\`).join('')}
      </tbody>
    </table>
  </div>

  <!-- 신규 계정 모달 -->
  <div id="modal-newuser" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-bold text-gray-800"><i class="fas fa-user-plus mr-2 text-blue-600"></i>아이디 개설</h3>
        <button onclick="closeNewUserModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">아이디 <span class="text-red-500">*</span></label>
          <input id="nu-id" type="text" placeholder="영문/숫자, 4자 이상" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">이름 <span class="text-red-500">*</span></label>
          <input id="nu-name" type="text" placeholder="사용자 이름" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">초기 비밀번호 <span class="text-red-500">*</span></label>
          <input id="nu-pw" type="text" placeholder="8자 이상" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">역할</label>
          <select id="nu-role" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="user">일반 사용자</option>
            <option value="admin">관리자 (전체 허용)</option>
          </select>
        </div>
        <div id="nu-menus-wrap">
          <label class="block text-xs font-semibold text-gray-600 mb-2">허용 메뉴</label>
          <div class="grid grid-cols-2 gap-1.5 border border-gray-200 rounded-lg p-3 max-h-52 overflow-y-auto">
            \${MENU_LIST.map(m=>\`
            <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1">
              <input type="checkbox" class="nu-menu-chk rounded" value="\${m.page}" checked>
              <span>\${m.label}</span>
            </label>\`).join('')}
          </div>
          <div class="flex gap-2 mt-2">
            <button onclick="nuCheckAll(true)" class="text-xs text-blue-600 hover:underline">전체선택</button>
            <span class="text-gray-300">|</span>
            <button onclick="nuCheckAll(false)" class="text-xs text-gray-500 hover:underline">전체해제</button>
          </div>
        </div>
      </div>
      <div class="flex gap-2 mt-5">
        <button onclick="closeNewUserModal()" class="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">취소</button>
        <button onclick="submitNewUser()" class="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">개설</button>
      </div>
    </div>
  </div>

  <!-- 권한 편집 모달 -->
  <div id="modal-edituser" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-bold text-gray-800"><i class="fas fa-key mr-2 text-blue-600"></i>권한 편집</h3>
        <button onclick="closeEditUserModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div id="eu-content"></div>
      <div class="flex gap-2 mt-5">
        <button onclick="closeEditUserModal()" class="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">취소</button>
        <button onclick="submitEditUser()" class="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">저장</button>
      </div>
    </div>
  </div>

  <!-- 권한 복제 모달 -->
  <div id="modal-copyuser" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-bold text-gray-800"><i class="fas fa-copy mr-2 text-green-600"></i>권한 복제</h3>
        <button onclick="closeCopyUserModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <p class="text-sm text-gray-600 mb-4" id="copy-src-label"></p>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">복제 대상 아이디 선택</label>
          <select id="copy-target-select" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
          </select>
        </div>
      </div>
      <div class="flex gap-2 mt-5">
        <button onclick="closeCopyUserModal()" class="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">취소</button>
        <button onclick="submitCopyUser()" class="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">복제 적용</button>
      </div>
    </div>
  </div>
</div>\`;
  }

  el.innerHTML = html();

  // ── 역할 변경 시 메뉴 체크박스 표시 토글
  document.getElementById('nu-role').addEventListener('change', function() {
    document.getElementById('nu-menus-wrap').style.display = this.value === 'admin' ? 'none' : 'block';
  });

  let _editIdx = -1;
  let _copyIdx = -1;

  window.openNewUserModal = function() {
    document.getElementById('modal-newuser').classList.remove('hidden');
  };
  window.closeNewUserModal = function() {
    document.getElementById('modal-newuser').classList.add('hidden');
    ['nu-id','nu-name','nu-pw'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
    document.getElementById('nu-role').value = 'user';
    document.querySelectorAll('.nu-menu-chk').forEach(c => c.checked = true);
    document.getElementById('nu-menus-wrap').style.display = 'block';
  };
  window.nuCheckAll = function(v) {
    document.querySelectorAll('.nu-menu-chk').forEach(c => c.checked = v);
  };
  window.submitNewUser = function() {
    const id   = document.getElementById('nu-id').value.trim();
    const name = document.getElementById('nu-name').value.trim();
    const pw   = document.getElementById('nu-pw').value.trim();
    const role = document.getElementById('nu-role').value;
    if (!id || id.length < 2)  { alert('아이디는 2자 이상 입력하세요.'); return; }
    if (!name)                  { alert('이름을 입력하세요.'); return; }
    if (!pw || pw.length < 4)   { alert('비밀번호는 4자 이상 입력하세요.'); return; }
    const us = loadAuthUsers();
    if (us.find(u => u.id === id)) { alert('이미 사용 중인 아이디입니다.'); return; }
    const checked = [...document.querySelectorAll('.nu-menu-chk:checked')].map(c => c.value);
    us.push({ id, password:pw, name, role, allowedPages: role==='admin' ? MENU_LIST.map(m=>m.page) : checked, createdAt: new Date().toISOString() });
    saveAuthUsers(us);
    window.closeNewUserModal();
    renderAuthPage(el);
  };

  window.openEditUserModal = function(i) {
    _editIdx = i;
    const us = loadAuthUsers();
    const u  = us[i];
    const isAdmin = u.role === 'admin';
    document.getElementById('eu-content').innerHTML = \`
      <div class="mb-3 p-3 bg-gray-50 rounded-lg">
        <span class="text-sm font-bold text-gray-700">\${u.id}</span>
        <span class="ml-2 text-sm text-gray-500">(\${u.name})</span>
      </div>
      <div class="mb-3">
        <label class="block text-xs font-semibold text-gray-600 mb-1">역할</label>
        <select id="eu-role" onchange="euRoleChange(this.value)" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="user" \${!isAdmin?'selected':''}>일반 사용자</option>
          <option value="admin" \${isAdmin?'selected':''}>관리자 (전체 허용)</option>
        </select>
      </div>
      <div id="eu-menus-wrap" \${isAdmin?'style="display:none"':''}>
        <label class="block text-xs font-semibold text-gray-600 mb-2">허용 메뉴</label>
        <div class="grid grid-cols-2 gap-1.5 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
          \${MENU_LIST.map(m=>\`
          <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1">
            <input type="checkbox" class="eu-menu-chk rounded" value="\${m.page}" \${(u.allowedPages||[]).includes(m.page)?'checked':''}>
            <span>\${m.label}</span>
          </label>\`).join('')}
        </div>
        <div class="flex gap-2 mt-2">
          <button onclick="euCheckAll(true)" class="text-xs text-blue-600 hover:underline">전체선택</button>
          <span class="text-gray-300">|</span>
          <button onclick="euCheckAll(false)" class="text-xs text-gray-500 hover:underline">전체해제</button>
        </div>
      </div>\`;
    document.getElementById('modal-edituser').classList.remove('hidden');
  };
  window.euRoleChange = function(v) {
    document.getElementById('eu-menus-wrap').style.display = v==='admin' ? 'none' : 'block';
  };
  window.euCheckAll = function(v) {
    document.querySelectorAll('.eu-menu-chk').forEach(c => c.checked = v);
  };
  window.closeEditUserModal = function() {
    document.getElementById('modal-edituser').classList.add('hidden');
    _editIdx = -1;
  };
  window.submitEditUser = function() {
    if (_editIdx < 0) return;
    const us   = loadAuthUsers();
    const role = document.getElementById('eu-role').value;
    const checked = [...document.querySelectorAll('.eu-menu-chk:checked')].map(c => c.value);
    us[_editIdx].role         = role;
    us[_editIdx].allowedPages = role==='admin' ? MENU_LIST.map(m=>m.page) : checked;
    saveAuthUsers(us);
    window.closeEditUserModal();
    renderAuthPage(el);
  };

  window.resetUserPw = function(i) {
    const us = loadAuthUsers();
    const newPw = prompt(\`[\${us[i].id}] 새 비밀번호 입력:\`);
    if (!newPw || newPw.length < 4) { if(newPw !== null) alert('4자 이상 입력하세요.'); return; }
    us[i].password = newPw;
    saveAuthUsers(us);
    alert('비밀번호가 초기화되었습니다.');
  };

  window.deleteUser = function(i) {
    const us = loadAuthUsers();
    if (!confirm(\`[\${us[i].id}] 계정을 삭제하시겠습니까?\`)) return;
    us.splice(i, 1);
    saveAuthUsers(us);
    renderAuthPage(el);
  };

  window.openCopyUserModal = function(i) {
    _copyIdx = i;
    const us = loadAuthUsers();
    const src = us[i];
    document.getElementById('copy-src-label').textContent = \`[  \${src.id} / \${src.name}  ] 의 권한을 다른 계정에 복제합니다.\`;
    const sel = document.getElementById('copy-target-select');
    sel.innerHTML = us.filter((_,j)=>j!==i).map(u=>\`<option value="\${u.id}">\${u.id} (\${u.name})</option>\`).join('');
    if (!sel.innerHTML) { alert('복제 대상 계정이 없습니다.'); return; }
    document.getElementById('modal-copyuser').classList.remove('hidden');
  };
  window.closeCopyUserModal = function() {
    document.getElementById('modal-copyuser').classList.add('hidden');
    _copyIdx = -1;
  };
  window.submitCopyUser = function() {
    if (_copyIdx < 0) return;
    const us  = loadAuthUsers();
    const src = us[_copyIdx];
    const targetId = document.getElementById('copy-target-select').value;
    const ti = us.findIndex(u => u.id === targetId);
    if (ti < 0) return;
    us[ti].role         = src.role;
    us[ti].allowedPages = [...src.allowedPages];
    saveAuthUsers(us);
    window.closeCopyUserModal();
    renderAuthPage(el);
    alert(\`[\${targetId}] 에 권한을 복제했습니다.\`);
  };
}

// ==================== 페이지: 허용 IP 등록 ====================
function renderIPAllowPage(el) {
  function html() {
    const ipData = loadAuthIP();
    const myIP   = '확인 중...';

    return \`
<div class="space-y-5">
  <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-shield-alt mr-2 text-blue-600"></i>허용 IP 등록</h2>

  <div class="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
    회사 내부 IP인 192.168.xx가 아니라 인터넷에서 확인되는 공인 IP를 등록하세요. 여러 사무실이나 VPN을 사용하는 경우 각각 등록할 수 있으며, CIDR 대역도 지원합니다.
  </div>

  <!-- 현재 접속 공인 IP -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-5">
      <p class="text-xs text-gray-500 mb-1">현재 접속 공인 IP</p>
      <p class="text-2xl font-bold text-gray-800" id="my-public-ip">조회 중...</p>
      <p class="text-xs text-gray-400 mt-1">현재 규칙: <span class="font-medium" id="my-ip-cidr-hint">-</span> 으로 포함됩니다.</p>
    </div>
    <div class="card p-5 flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold text-gray-700">로그인 IP 제한 사용</p>
        <p class="text-xs text-gray-500 mt-0.5 \${ipData.enabled?'text-orange-500 font-medium':''}">
          \${ipData.enabled ? '활성화됨 — 허용된 IP에서만 로그인 가능' : '비활성화 — 모든 IP에서 접근 가능'}
        </p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id="ip-enable-toggle" class="sr-only peer" \${ipData.enabled?'checked':''} onchange="toggleIPRestriction(this.checked)">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  </div>

  <!-- IP 등록 폼 -->
  <div class="card p-5">
    <p class="text-sm font-semibold text-gray-700 mb-3">허용 IP 목록 <span class="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold" id="ip-list-count">\${ipData.list.length}</span></p>

    <div class="flex gap-2 mb-4">
      <input id="ip-label-input" type="text" placeholder="예: 본사, 지점, 자택, 회사 VPN" maxlength="30"
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
      <input id="ip-cidr-input" type="text" placeholder="예: 203.0.113.10 또는 203.0.113.0/24" maxlength="50"
        class="flex-[2] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
      <button onclick="addIPEntry()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 whitespace-nowrap">
        <i class="fas fa-plus mr-1"></i>추가
      </button>
      <button onclick="addMyIPEntry()" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 whitespace-nowrap border border-gray-300" title="현재 IP 추가">
        <i class="fas fa-crosshairs mr-1"></i>현재 IP 추가
      </button>
    </div>

    <div class="overflow-auto rounded-lg border border-gray-200">
      <table class="w-full text-sm" id="ip-list-table">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-center px-3 py-2.5 font-semibold text-gray-600 w-12">사용</th>
            <th class="text-left px-3 py-2.5 font-semibold text-gray-600 w-40">구분명</th>
            <th class="text-left px-3 py-2.5 font-semibold text-gray-600">공인 IP 또는 CIDR</th>
            <th class="text-center px-3 py-2.5 font-semibold text-gray-600 w-16">삭제</th>
          </tr>
        </thead>
        <tbody id="ip-tbody">
          \${ipData.list.length === 0
            ? '<tr><td colspan="4" class="text-center py-8 text-gray-400 text-sm">등록된 IP가 없습니다.</td></tr>'
            : ipData.list.map((entry,i) => \`
          <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="text-center px-3 py-2.5">
              <input type="checkbox" \${entry.enabled?'checked':''} onchange="toggleIPEntry(\${i},this.checked)"
                class="w-4 h-4 text-blue-600 rounded">
            </td>
            <td class="px-3 py-2.5 text-gray-700 font-medium">\${entry.label||'-'}</td>
            <td class="px-3 py-2.5 font-mono text-blue-700">\${entry.cidr}</td>
            <td class="text-center px-3 py-2.5">
              <button onclick="deleteIPEntry(\${i})" class="w-7 h-7 flex items-center justify-center bg-red-100 text-red-500 rounded hover:bg-red-200 mx-auto">
                <i class="fas fa-trash text-xs"></i>
              </button>
            </td>
          </tr>\`).join('')
          }
        </tbody>
      </table>
    </div>

    <div class="flex justify-end mt-3">
      <button onclick="saveIPList()" class="flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800">
        <i class="fas fa-save"></i>저장
      </button>
    </div>
    <p class="text-xs text-gray-400 mt-2 text-right" id="ip-save-time">\${ipData.savedAt ? '최근 저장: ' + new Date(ipData.savedAt).toLocaleString('ko-KR') : ''}</p>
  </div>
</div>\`;
  }

  el.innerHTML = html();

  // 공인 IP 조회
  fetch('https://api.ipify.org?format=json')
    .then(r=>r.json())
    .then(d=>{
      const ip = d.ip || '';
      const ipEl = document.getElementById('my-public-ip');
      const hintEl = document.getElementById('my-ip-cidr-hint');
      if (ipEl) ipEl.textContent = ip;
      if (hintEl) {
        const parts = ip.split('.');
        hintEl.textContent = parts.length===4 ? parts.slice(0,3).join('.')+'.0/24' : ip;
      }
    })
    .catch(()=>{ const e=document.getElementById('my-public-ip'); if(e) e.textContent='조회 실패'; });

  window._myPublicIP = '';
  fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>{ window._myPublicIP = d.ip||''; });

  window.toggleIPRestriction = function(v) {
    const ipData = loadAuthIP();
    ipData.enabled = v;
    saveAuthIP(ipData);
  };

  window.addIPEntry = function() {
    const label = (document.getElementById('ip-label-input').value||'').trim();
    const cidr  = (document.getElementById('ip-cidr-input').value||'').trim();
    if (!cidr) { alert('IP 또는 CIDR을 입력하세요.'); return; }
    const ipData = loadAuthIP();
    ipData.list.push({ label, cidr, enabled: true });
    saveAuthIP(ipData);
    renderIPAllowPage(el);
  };

  window.addMyIPEntry = function() {
    const ip = window._myPublicIP || document.getElementById('my-public-ip').textContent;
    if (!ip || ip === '조회 중...' || ip === '조회 실패') { alert('공인 IP 조회에 실패했습니다. 직접 입력해주세요.'); return; }
    document.getElementById('ip-cidr-input').value = ip;
    document.getElementById('ip-label-input').focus();
  };

  window.toggleIPEntry = function(i, v) {
    const ipData = loadAuthIP();
    ipData.list[i].enabled = v;
    saveAuthIP(ipData);
    const cnt = document.getElementById('ip-list-count');
    if(cnt) cnt.textContent = ipData.list.length;
  };

  window.deleteIPEntry = function(i) {
    const ipData = loadAuthIP();
    if (!confirm(\`[\${ipData.list[i].cidr}] 을 삭제하시겠습니까?\`)) return;
    ipData.list.splice(i, 1);
    saveAuthIP(ipData);
    renderIPAllowPage(el);
  };

  window.saveIPList = function() {
    const ipData = loadAuthIP();
    ipData.savedAt = new Date().toISOString();
    saveAuthIP(ipData);
    const t = document.getElementById('ip-save-time');
    if(t) t.textContent = '최근 저장: ' + new Date().toLocaleString('ko-KR');
    alert('저장되었습니다.');
  };
}

// ==================== 페이지: 시스템 설정 ====================
const PALETTE=['#2563eb','#059669','#7c3aed','#d97706','#0891b2','#dc2626','#6366f1','#0d9488','#c026d3','#ea580c','#84cc16','#64748b','#be185d','#92400e','#1d4ed8','#15803d'];
const GRP_PALETTE=['#1e40af','#065f46','#374151','#7e22ce','#92400e','#9f1239','#0369a1','#166534','#1d4ed8','#15803d','#a16207','#334155'];

// ── 설정 페이지 진입 탭 상태 ('product_cats' | 'product_groups' | 'agent_cats' | 'agent_groups')
let settingsMainTab = 'product_cats';

function renderSettingsPage(el) {
  editCategories = JSON.parse(JSON.stringify(CATEGORIES));
  editGroups     = JSON.parse(JSON.stringify(GROUPS));
  editAgentCategories = JSON.parse(JSON.stringify(AGENT_CATEGORIES));
  editAgentGroups     = JSON.parse(JSON.stringify(AGENT_GROUPS));
  _renderSettingsPageBody(el);
}

function _renderSettingsPageBody(el) {
  const ap  = LOAN ? [...new Set(LOAN.records.map(r=>r.p))].sort() : [];
  const aa  = LOAN ? [...new Set(LOAN.records.map(r=>r.a))].sort() : [];

  const mainTabs = [
    { key:'product_cats',   icon:'fas fa-tags',        label:'상품 카테고리' },
    { key:'product_groups', icon:'fas fa-layer-group', label:'상품 그룹' },
    { key:'agent_cats',     icon:'fas fa-user-tag',    label:'에이전트 카테고리' },
    { key:'agent_groups',   icon:'fas fa-sitemap',     label:'에이전트 그룹' },
  ];

  const tabBarHtml = \`<div class="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
    \${mainTabs.map(t=>\`<button onclick="switchSettingsMainTab('\${t.key}')"
      class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5
             \${settingsMainTab===t.key?'bg-white text-blue-700 shadow':'text-gray-500 hover:text-gray-700'}">
      <i class="\${t.icon} text-xs"></i>\${t.label}
    </button>\`).join('')}
  </div>\`;

  let bodyHtml = '';
  if (settingsMainTab === 'product_cats') {
    bodyHtml = _renderProductCatsBody(ap);
  } else if (settingsMainTab === 'product_groups') {
    bodyHtml = _renderProductGroupsBody();
  } else if (settingsMainTab === 'agent_cats') {
    bodyHtml = _renderAgentCatsBody(aa);
  } else {
    bodyHtml = _renderAgentGroupsBody();
  }

  const actionHtml = \`<div class="flex justify-between items-center mt-6 pt-5 border-t border-gray-200">
    <button onclick="resetCurrentSettingsTab()" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
      <i class="fas fa-undo mr-1.5"></i>초기화
    </button>
    <button onclick="saveCurrentSettingsTab()" class="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
      <i class="fas fa-save mr-1.5"></i>저장 적용
    </button>
  </div>\`;

  el.innerHTML = \`<div class="space-y-2 max-w-4xl mx-auto">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
        <i class="fas fa-cog text-blue-600 text-lg"></i>
      </div>
      <div>
        <h2 class="text-lg font-bold">시스템 설정</h2>
        <p class="text-sm text-gray-500">상품 구분 및 에이전트(광고매체)를 카테고리·그룹으로 관리합니다</p>
      </div>
    </div>
    <div class="card p-6" id="settings-page-card">
      \${tabBarHtml}
      <div id="settings-page-body">\${bodyHtml}</div>
      \${actionHtml}
    </div>
  </div>\`;
}

function switchSettingsMainTab(tab) {
  settingsMainTab = tab;
  const el = document.getElementById('main-content');
  _renderSettingsPageBody(el);
}

function saveCurrentSettingsTab() {
  if (settingsMainTab === 'product_cats' || settingsMainTab === 'product_groups') {
    reindexCatOrders();
    CATEGORIES = JSON.parse(JSON.stringify(editCategories));
    GROUPS     = JSON.parse(JSON.stringify(editGroups));
    saveCatsToStorage();
  } else {
    reindexAgentCatOrders();
    AGENT_CATEGORIES = JSON.parse(JSON.stringify(editAgentCategories));
    AGENT_GROUPS     = JSON.parse(JSON.stringify(editAgentGroups));
    saveAgentCatsToStorage();
  }
  const el = document.getElementById('main-content');
  _renderSettingsPageBody(el);
  alert('저장되었습니다.');
}

function resetCurrentSettingsTab() {
  if (!confirm('현재 탭을 기본값으로 초기화하시겠습니까?')) return;
  if (settingsMainTab === 'product_cats' || settingsMainTab === 'product_groups') {
    editCategories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    editGroups     = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
  } else {
    editAgentCategories = JSON.parse(JSON.stringify(DEFAULT_AGENT_CATEGORIES));
    editAgentGroups     = JSON.parse(JSON.stringify(DEFAULT_AGENT_GROUPS));
  }
  const el = document.getElementById('main-content');
  _renderSettingsPageBody(el);
}

// ── 상품 카테고리 탭 HTML
function _renderProductCatsBody(allProducts) {
  const assigned   = new Set(editCategories.flatMap(c=>c.products));
  const unassigned = allProducts.filter(p=>!assigned.has(p));
  const sortedCats = [...editCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  return \`<div class="space-y-4">
    <p class="text-xs text-gray-500">상품을 카테고리로 분류합니다. 드래그하거나 드롭다운으로 배정하세요.</p>
    <div>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미분류 상품</p>
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
}

// ── 상품 그룹 탭 HTML
function _renderProductGroupsBody() {
  const assignedCatIds = new Set(editGroups.flatMap(g=>g.categoryIds));
  const unassignedCats = editCategories.filter(c=>!assignedCatIds.has(c.id));
  return \`<div class="space-y-4">
    <p class="text-xs text-gray-500">카테고리를 드래그하거나 선택하여 상위 그룹에 배정합니다.</p>
    <div>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미배정 카테고리</p>
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

// ── 에이전트 카테고리 탭 HTML
function _renderAgentCatsBody(allAgents) {
  const assigned   = new Set(editAgentCategories.flatMap(c=>c.agents));
  const unassigned = allAgents.filter(a=>!assigned.has(a));
  const sortedCats = [...editAgentCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  return \`<div class="space-y-4">
    <p class="text-xs text-gray-500">에이전트(광고매체)를 카테고리로 분류합니다. 드래그하거나 드롭다운으로 배정하세요.</p>
    <div>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미분류 에이전트</p>
      <div id="unassigned-agent-pool" class="min-h-12 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-1"
        ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropToUnassignedAgent(event)">
        \${unassigned.length===0?'<span class="text-xs text-gray-400">모든 에이전트가 카테고리에 배정됨</span>':
          unassigned.map(a=>\`<span class="product-chip unassigned" draggable="true" ondragstart="dragAgentStart(event,'\${a}','__none__')">\${a}</span>\`).join('')}
      </div>
    </div>
    <div class="space-y-3" id="agent-cat-list">\${sortedCats.map((cat,idx)=>renderAgentCatCard(cat,idx,allAgents,sortedCats.length)).join('')}</div>
    <button onclick="addAgentCategory()" class="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-green-300 hover:text-green-500 transition">
      <i class="fas fa-plus mr-2"></i>에이전트 카테고리 추가
    </button>
  </div>\`;
}

// ── 에이전트 그룹 탭 HTML
function _renderAgentGroupsBody() {
  const assignedCatIds = new Set(editAgentGroups.flatMap(g=>g.categoryIds));
  const unassignedCats = editAgentCategories.filter(c=>!assignedCatIds.has(c.id));
  return \`<div class="space-y-4">
    <p class="text-xs text-gray-500">에이전트 카테고리를 드래그하거나 선택하여 상위 그룹에 배정합니다.</p>
    <div>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">미배정 카테고리</p>
      <div id="unassigned-agent-cat-pool" class="min-h-12 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-2"
        ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropAgentCatToUnassigned(event)">
        \${unassignedCats.length===0?'<span class="text-xs text-gray-400">모든 카테고리가 그룹에 배정됨</span>':
          unassignedCats.map(c=>\`<span class="product-chip assigned" style="background:\${c.color};border-color:\${c.color}" draggable="true" ondragstart="dragAgentCatStart(event,'\${c.id}','__none__')">\${c.name}</span>\`).join('')}
      </div>
    </div>
    <div class="space-y-3" id="agent-grp-list">\${editAgentGroups.map((g,idx)=>renderAgentGroupCard(g,idx)).join('')}</div>
    <button onclick="addAgentGroup()" class="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-teal-300 hover:text-teal-500 transition">
      <i class="fas fa-plus mr-2"></i>에이전트 그룹 추가
    </button>
  </div>\`;
}

// ── 에이전트 카테고리 카드 렌더링
function renderAgentCatCard(cat, idx, allAgents, totalCats) {
  const ap    = allAgents || [];
  const total = totalCats || editAgentCategories.length;
  const allAssigned  = new Set(editAgentCategories.flatMap(c=>c.agents));
  const available    = ap.filter(a=>!allAssigned.has(a)||cat.agents.includes(a));
  const selectable   = available.filter(a=>!cat.agents.includes(a));
  const curOrder = cat.order ?? idx+1;
  return \`<div class="cat-card" id="agentcatcard_\${cat.id}">
    <div class="cat-header bg-gray-50" onclick="toggleAgentCatCard('\${cat.id}')">
      <div class="flex items-center gap-1 flex-shrink-0 mr-1" onclick="event.stopPropagation()">
        <div class="flex flex-col gap-0.5">
          <button onclick="moveAgentCatUp('\${cat.id}')" class="w-5 h-4 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition \${idx===0?'opacity-25 pointer-events-none':''}" title="위로">
            <i class="fas fa-caret-up text-xs"></i>
          </button>
          <button onclick="moveAgentCatDown('\${cat.id}')" class="w-5 h-4 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition \${idx===total-1?'opacity-25 pointer-events-none':''}" title="아래로">
            <i class="fas fa-caret-down text-xs"></i>
          </button>
        </div>
        <input type="number" min="1" max="\${total}" value="\${curOrder}"
          class="w-9 h-7 text-center text-xs font-bold border border-gray-200 rounded-lg bg-white text-green-700 outline-none focus:border-green-400"
          onclick="event.stopPropagation()"
          onchange="setAgentCatOrder('\${cat.id}', parseInt(this.value))"
          title="표시 순서 입력"/>
      </div>
      <div class="cat-color-dot" style="background:\${cat.color}" onclick="event.stopPropagation();showAgentCatColorPicker('\${cat.id}',event)"></div>
      <input type="text" value="\${cat.name}" class="flex-1 bg-transparent font-semibold text-gray-700 outline-none text-sm" onchange="updateAgentCatName('\${cat.id}',this.value)" onclick="event.stopPropagation()"/>
      <span class="text-xs text-gray-400">\${cat.agents.length}개 에이전트</span>
      <button onclick="event.stopPropagation();removeAgentCategory('\${cat.id}')" class="text-gray-300 hover:text-red-400 ml-2"><i class="fas fa-trash text-xs"></i></button>
      <i class="fas fa-chevron-down text-xs text-gray-400 ml-2" id="agentcatarrow_\${cat.id}"></i>
    </div>
    <div id="agentcatbody_\${cat.id}" class="p-3">
      <div class="min-h-10 border border-dashed border-gray-200 rounded-lg p-2 flex flex-wrap gap-1"
           ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropToAgentCategory(event,'\${cat.id}')">
        \${cat.agents.length===0?'<span class="text-xs text-gray-400">에이전트를 드래그하여 배정하세요</span>':
          cat.agents.map(a=>\`<span class="product-chip assigned" style="background:\${cat.color};border-color:\${cat.color}" draggable="true" ondragstart="dragAgentStart(event,'\${a}','\${cat.id}')" onclick="removeAgentFromCat('\${cat.id}','\${a}')" title="클릭하여 제거">\${a} <i class="fas fa-times text-xs opacity-70"></i></span>\`).join('')}
      </div>
      <div class="mt-2 flex gap-2">
        <select id="agentaddsel_\${cat.id}" class="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none \${selectable.length===0?'opacity-50':''}">
          <option value="">\${selectable.length===0?'배정 가능한 에이전트 없음':'+ 에이전트 추가...'}</option>
          \${selectable.map(a=>\`<option value="\${a}">\${a}</option>\`).join('')}
        </select>
        <button onclick="addAgentToCatFromSelect('\${cat.id}')" class="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-40" \${selectable.length===0?'disabled':''}>추가</button>
      </div>
    </div>
  </div>\`;
}

// ── 에이전트 그룹 카드 렌더링
function renderAgentGroupCard(grp, idx) {
  const cats = editAgentCategories.filter(c=>grp.categoryIds.includes(c.id));
  return \`<div class="cat-card" id="agentgrpcard_\${grp.id}">
    <div class="cat-header" style="background:\${grp.color}18" onclick="toggleAgentGrpCard('\${grp.id}')">
      <div class="cat-color-dot" style="background:\${grp.color}" onclick="event.stopPropagation();showAgentGroupColorPicker('\${grp.id}',event)"></div>
      <input type="text" value="\${grp.name}" class="flex-1 bg-transparent font-bold text-gray-800 outline-none text-sm" onchange="updateAgentGroupName('\${grp.id}',this.value)" onclick="event.stopPropagation()"/>
      <span class="text-xs px-2 py-0.5 rounded-full text-white font-medium" style="background:\${grp.color}">\${cats.length}개 카테고리</span>
      <button onclick="event.stopPropagation();removeAgentGroup('\${grp.id}')" class="text-gray-300 hover:text-red-400 ml-2"><i class="fas fa-trash text-xs"></i></button>
      <i class="fas fa-chevron-down text-xs text-gray-400 ml-2" id="agentgrparrow_\${grp.id}"></i>
    </div>
    <div id="agentgrpbody_\${grp.id}" class="p-3">
      <div class="min-h-10 border border-dashed border-gray-200 rounded-lg p-2 flex flex-wrap gap-2"
           ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropAgentCatToGroup(event,'\${grp.id}')">
        \${cats.length===0?'<span class="text-xs text-gray-400">카테고리를 드래그하여 배정하세요</span>':
          cats.map(c=>\`<span class="product-chip assigned" style="background:\${c.color};border-color:\${c.color}" draggable="true" ondragstart="dragAgentCatStart(event,'\${c.id}','\${grp.id}')" onclick="removeAgentCatFromGroup('\${grp.id}','\${c.id}')" title="클릭하여 제거">\${c.name} <i class="fas fa-times text-xs opacity-70"></i></span>\`).join('')}
      </div>
      <div class="mt-2 flex gap-2">
        <select id="agentgrpaddsel_\${grp.id}" class="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
          <option value="">+ 카테고리 추가...</option>
          \${editAgentCategories.filter(c=>!grp.categoryIds.includes(c.id)).map(c=>\`<option value="\${c.id}">\${c.name}</option>\`).join('')}
        </select>
        <button onclick="addAgentCatToGroupFromSelect('\${grp.id}')" class="px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700">추가</button>
      </div>
    </div>
  </div>\`;
}

// ── 에이전트 카테고리/그룹 조작 함수들
function refreshSettingsBody(){ const el=document.getElementById('main-content'); _renderSettingsPageBody(el); }
function toggleAgentCatCard(id){const b=document.getElementById('agentcatbody_'+id);const a=document.getElementById('agentcatarrow_'+id);if(!b)return;const h=b.style.display==='none';b.style.display=h?'':'none';if(a)a.style.transform=h?'':'rotate(-90deg)';}
function toggleAgentGrpCard(id){const b=document.getElementById('agentgrpbody_'+id);const a=document.getElementById('agentgrparrow_'+id);if(!b)return;const h=b.style.display==='none';b.style.display=h?'':'none';if(a)a.style.transform=h?'':'rotate(-90deg)';}
function showAgentCatColorPicker(catId,event){
  event.stopPropagation();const ex=document.getElementById('color-popup');if(ex)ex.remove();
  const cat=editAgentCategories.find(c=>c.id===catId);
  const popup=document.createElement('div');popup.id='color-popup';
  popup.style.cssText='position:fixed;z-index:2000;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,.15);';
  popup.style.left=(event.clientX+10)+'px';popup.style.top=(event.clientY+10)+'px';
  popup.innerHTML=\`<p class="text-xs font-bold text-gray-500 mb-2">색상 선택</p><div class="grid grid-cols-4 gap-2">\${PALETTE.map(c=>\`<div class="color-swatch \${cat&&cat.color===c?'selected':''}" style="background:\${c}" onclick="setAgentCatColor('\${catId}','\${c}')"></div>\`).join('')}</div>\`;
  document.body.appendChild(popup);setTimeout(()=>document.addEventListener('click',()=>popup.remove(),{once:true}),50);
}
function showAgentGroupColorPicker(grpId,event){
  event.stopPropagation();const ex=document.getElementById('color-popup');if(ex)ex.remove();
  const grp=editAgentGroups.find(g=>g.id===grpId);
  const popup=document.createElement('div');popup.id='color-popup';
  popup.style.cssText='position:fixed;z-index:2000;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,.15);';
  popup.style.left=(event.clientX+10)+'px';popup.style.top=(event.clientY+10)+'px';
  popup.innerHTML=\`<p class="text-xs font-bold text-gray-500 mb-2">색상 선택</p><div class="grid grid-cols-4 gap-2">\${GRP_PALETTE.map(c=>\`<div class="color-swatch \${grp&&grp.color===c?'selected':''}" style="background:\${c}" onclick="setAgentGroupColor('\${grpId}','\${c}')"></div>\`).join('')}</div>\`;
  document.body.appendChild(popup);setTimeout(()=>document.addEventListener('click',()=>popup.remove(),{once:true}),50);
}
function setAgentCatColor(catId,color){const cat=editAgentCategories.find(c=>c.id===catId);if(cat){cat.color=color;refreshSettingsBody();}}
function setAgentGroupColor(grpId,color){const g=editAgentGroups.find(g=>g.id===grpId);if(g){g.color=color;refreshSettingsBody();}}
function updateAgentCatName(catId,name){const cat=editAgentCategories.find(c=>c.id===catId);if(cat)cat.name=name;}
function updateAgentGroupName(grpId,name){const g=editAgentGroups.find(g=>g.id===grpId);if(g)g.name=name;}
function removeAgentCategory(catId){if(!confirm('삭제 시 해당 에이전트들이 미분류로 이동합니다.'))return;editAgentCategories=editAgentCategories.filter(c=>c.id!==catId);reindexAgentCatOrders();refreshSettingsBody();}
function removeAgentGroup(grpId){if(!confirm('그룹을 삭제하면 소속 카테고리들이 미배정으로 이동합니다.'))return;editAgentGroups=editAgentGroups.filter(g=>g.id!==grpId);refreshSettingsBody();}
function addAgentCategory(){
  const maxOrder=editAgentCategories.reduce((m,c)=>Math.max(m,c.order??0),0);
  editAgentCategories.push({id:'ac'+Date.now(),name:'새 카테고리',color:PALETTE[editAgentCategories.length%PALETTE.length],order:maxOrder+1,agents:[]});
  refreshSettingsBody();
}
function addAgentGroup(){editAgentGroups.push({id:'ag'+Date.now(),name:'새 그룹',color:GRP_PALETTE[editAgentGroups.length%GRP_PALETTE.length],categoryIds:[]});refreshSettingsBody();}

function reindexAgentCatOrders(){
  const sorted=[...editAgentCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  sorted.forEach((c,i)=>{c.order=i+1;});
}
function setAgentCatOrder(catId,newOrder){
  const cat=editAgentCategories.find(c=>c.id===catId);if(!cat)return;
  const total=editAgentCategories.length;newOrder=Math.max(1,Math.min(newOrder,total));
  const oldOrder=cat.order??1;if(newOrder===oldOrder){refreshSettingsBody();return;}
  editAgentCategories.forEach(c=>{if(c.id===catId)return;const o=c.order??1;if(newOrder<oldOrder){if(o>=newOrder&&o<oldOrder)c.order=o+1;}else{if(o>oldOrder&&o<=newOrder)c.order=o-1;}});
  cat.order=newOrder;refreshSettingsBody();
}
function moveAgentCatUp(catId){
  const sorted=[...editAgentCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  const idx=sorted.findIndex(c=>c.id===catId);if(idx<=0)return;
  const cur=sorted[idx],prev=sorted[idx-1];const tmp=cur.order;cur.order=prev.order;prev.order=tmp;refreshSettingsBody();
}
function moveAgentCatDown(catId){
  const sorted=[...editAgentCategories].sort((a,b)=>(a.order??99)-(b.order??99));
  const idx=sorted.findIndex(c=>c.id===catId);if(idx<0||idx>=sorted.length-1)return;
  const cur=sorted[idx],next=sorted[idx+1];const tmp=cur.order;cur.order=next.order;next.order=tmp;refreshSettingsBody();
}
function addAgentToCatFromSelect(catId){
  const sel=document.getElementById('agentaddsel_'+catId);if(!sel||!sel.value)return;
  const agent=sel.value;editAgentCategories.forEach(c=>{c.agents=c.agents.filter(a=>a!==agent);});
  const cat=editAgentCategories.find(c=>c.id===catId);if(cat&&!cat.agents.includes(agent))cat.agents.push(agent);refreshSettingsBody();
}
function addAgentCatToGroupFromSelect(grpId){
  const sel=document.getElementById('agentgrpaddsel_'+grpId);if(!sel||!sel.value)return;
  const catId=sel.value;editAgentGroups.forEach(g=>{g.categoryIds=g.categoryIds.filter(id=>id!==catId);});
  const g=editAgentGroups.find(g=>g.id===grpId);if(g&&!g.categoryIds.includes(catId))g.categoryIds.push(catId);refreshSettingsBody();
}
function removeAgentFromCat(catId,agent){const cat=editAgentCategories.find(c=>c.id===catId);if(cat){cat.agents=cat.agents.filter(a=>a!==agent);refreshSettingsBody();}}
function removeAgentCatFromGroup(grpId,catId){const g=editAgentGroups.find(g=>g.id===grpId);if(g){g.categoryIds=g.categoryIds.filter(id=>id!==catId);refreshSettingsBody();}}

// 에이전트 드래그 앤 드롭
let dragAgentData=null;
function dragAgentStart(event,agent,fromCatId){dragAgentData={agent,fromCatId};event.dataTransfer.effectAllowed='move';}
function dropToAgentCategory(event,toCatId){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragAgentData)return;const{agent,fromCatId}=dragAgentData;editAgentCategories.forEach(c=>{c.agents=c.agents.filter(a=>a!==agent);});const t=editAgentCategories.find(c=>c.id===toCatId);if(t)t.agents.push(agent);dragAgentData=null;refreshSettingsBody();}
function dropToUnassignedAgent(event){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragAgentData)return;const{agent,fromCatId}=dragAgentData;if(fromCatId!=='__none__'){const f=editAgentCategories.find(c=>c.id===fromCatId);if(f)f.agents=f.agents.filter(a=>a!==agent);}dragAgentData=null;refreshSettingsBody();}

let dragAgentCatData=null;
function dragAgentCatStart(event,catId,fromGrpId){dragAgentCatData={catId,fromGrpId};event.dataTransfer.effectAllowed='move';}
function dropAgentCatToGroup(event,toGrpId){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragAgentCatData)return;const{catId,fromGrpId}=dragAgentCatData;if(fromGrpId!=='__none__'){const f=editAgentGroups.find(g=>g.id===fromGrpId);if(f)f.categoryIds=f.categoryIds.filter(id=>id!==catId);}const t=editAgentGroups.find(g=>g.id===toGrpId);if(t&&!t.categoryIds.includes(catId))t.categoryIds.push(catId);dragAgentCatData=null;refreshSettingsBody();}
function dropAgentCatToUnassigned(event){event.preventDefault();event.currentTarget.classList.remove('drag-over');if(!dragAgentCatData)return;const{catId,fromGrpId}=dragAgentCatData;if(fromGrpId!=='__none__'){const f=editAgentGroups.find(g=>g.id===fromGrpId);if(f)f.categoryIds=f.categoryIds.filter(id=>id!==catId);}dragAgentCatData=null;refreshSettingsBody();}

// ── 기존 상품 카테고리 모달 호환 함수 (잔고 구성비 페이지 버튼용)
function openSettings(){ goPage('settings'); settingsMainTab='product_cats'; }
function openSettingsOnGroupTab(){ goPage('settings'); settingsMainTab='product_groups'; }


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

function _refreshProductSettingsOnly(){const el=document.getElementById('main-content');_renderSettingsPageBody(el);}
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

// saveCategories: 잔고 구성비 페이지의 "카테고리 설정" 버튼 호환
function saveCategories(){
  reindexCatOrders();
  CATEGORIES=JSON.parse(JSON.stringify(editCategories));
  GROUPS=JSON.parse(JSON.stringify(editGroups));
  saveCatsToStorage(); renderPage();
}
function resetCategories(){if(!confirm('카테고리 및 그룹을 기본값으로 초기화하시겠습니까?'))return;editCategories=JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));editGroups=JSON.parse(JSON.stringify(DEFAULT_GROUPS));refreshSettingsBody();}

// ==================== 시작 ====================

// ── 로그인/로그아웃 ──────────────────────────────────────────
function togglePwVisible() {
  const pw  = document.getElementById('login-pw');
  const ico = document.getElementById('pw-eye-icon');
  if (pw.type === 'password') {
    pw.type = 'text';
    ico.className = 'fas fa-eye-slash';
  } else {
    pw.type = 'password';
    ico.className = 'fas fa-eye';
  }
}
window.togglePwVisible = togglePwVisible;

function doLogin() {
  const id = (document.getElementById('login-id').value || '').trim();
  const pw = (document.getElementById('login-pw').value || '').trim();
  const errBox = document.getElementById('login-error');
  const errMsg = document.getElementById('login-error-msg');

  const users = loadAuthUsers();
  const user  = users.find(u => u.id === id && u.password === pw);

  if (!user) {
    errMsg.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
    errBox.style.display = 'block';
    document.getElementById('login-pw').value = '';
    document.getElementById('login-pw').focus();
    return;
  }

  // 로그인 성공
  currentUser = { id: user.id, name: user.name, role: user.role, allowedPages: user.allowedPages };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

  // 로그인 화면 숨기고 앱 시작
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('hdr-username').textContent = user.name + (user.role === 'admin' ? ' (관리자)' : '');

  // 권한에 맞게 사이드바 메뉴 표시/숨김
  applyMenuPermissions();

  init();
}
window.doLogin = doLogin;

function doLogout() {
  if (!confirm('로그아웃 하시겠습니까?')) return;
  sessionStorage.removeItem(SESSION_KEY);
  currentUser = null;
  // 로그인 화면 복원
  document.getElementById('login-overlay').style.display = 'flex';
  document.getElementById('login-id').value = '';
  document.getElementById('login-pw').value = '';
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('hdr-username').textContent = '-';
  document.getElementById('login-id').focus();
}
window.doLogout = doLogout;

function applyMenuPermissions() {
  if (!currentUser) return;
  if (currentUser.role === 'admin') return; // 관리자는 전체 표시
  // 허용되지 않은 메뉴 숨김
  document.querySelectorAll('.sb-item[data-page]').forEach(el => {
    const page = el.getAttribute('data-page');
    if (!currentUser.allowedPages.includes(page)) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  });
  // 현재 페이지가 허용 안되면 첫 허용 페이지로 이동
  if (!currentUser.allowedPages.includes(currentPage)) {
    const first = currentUser.allowedPages[0] || 'upload';
    currentPage = first;
  }
}

// ── 세션 복원 (새로고침 시) ──────────────────────────────────
(function checkSession() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      currentUser = JSON.parse(saved);
      document.getElementById('login-overlay').style.display = 'none';
      document.getElementById('hdr-username').textContent = currentUser.name + (currentUser.role === 'admin' ? ' (관리자)' : '');
      // DOM 준비 후 메뉴 권한 적용 + init
      setTimeout(() => {
        applyMenuPermissions();
        init();
      }, 0);
    } else {
      // 로그인 화면 표시 상태 유지, Enter 키 포커스
      setTimeout(() => {
        const idEl = document.getElementById('login-id');
        if (idEl) idEl.focus();
      }, 100);
    }
  } catch(_) {}
})();

</script>
</body>
</html>`)
})

export default app
