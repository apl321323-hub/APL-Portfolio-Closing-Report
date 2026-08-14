#!/usr/bin/env python3
"""Fix all fmtAmt/fmtN lines in rate cross table that are missing escape backslashes"""

with open('src/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixes = {}

# --- 3103 (index 3102) ---
# 3중 중첩 백틱 내부: \`<td><b>${fmtAmt(d.amt)}</b>...\`
# 목표: \`<td><b>\${fmtAmt(d.amt)}</b><br><span class="text-gray-400" style="font-size:10px">\${fmtN(d.count)}건</span></td>\`
line = lines[3102]
print(f"3103 before: {line!r}")
if '${fmtAmt(d.amt)}' in line or '${fmtN(d.count)}' in line:
    line = line.replace('${fmtAmt(d.amt)}', r'\${fmtAmt(d.amt)}')
    line = line.replace('${fmtN(d.count)}', r'\${fmtN(d.count)}')
    lines[3102] = line
    fixes[3103] = True
print(f"3103 after:  {lines[3102]!r}")

# --- 3106 (index 3105) ---
# \`<tr>...\` 내부 직접 레벨: <td class="font-semibold">${fmtAmt(rowAmt)}<br>..${fmtN(rowTotal)}건
line = lines[3105]
print(f"\n3106 before: {line!r}")
if '${fmtAmt(rowAmt)}' in line or '${fmtN(rowTotal)}' in line:
    line = line.replace('${fmtAmt(rowAmt)}', r'\${fmtAmt(rowAmt)}')
    line = line.replace('${fmtN(rowTotal)}', r'\${fmtN(rowTotal)}')
    lines[3105] = line
    fixes[3106] = True
print(f"3106 after:  {lines[3105]!r}")

# --- 3112 (index 3111) ---
# 합계행 바로 아래 td: <td><b>${fmtAmt(rateBands.reduce(...))}</b>..${fmtN(totalCount)}건
line = lines[3111]
print(f"\n3112 before: {line!r}")
if '${fmtAmt(rateBands.reduce' in line or '${fmtN(totalCount)}' in line:
    line = line.replace('${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}', r'\${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}')
    line = line.replace('${fmtN(totalCount)}', r'\${fmtN(totalCount)}')
    lines[3111] = line
    fixes[3112] = True
print(f"3112 after:  {lines[3111]!r}")

# --- 3138 (index 3137) ---
line = lines[3137]
print(f"\n3138 before: {line!r}")
if '${fmtAmt(d.amt)}' in line or '${fmtN(d.count)}' in line:
    line = line.replace('${fmtAmt(d.amt)}', r'\${fmtAmt(d.amt)}')
    line = line.replace('${fmtN(d.count)}', r'\${fmtN(d.count)}')
    lines[3137] = line
    fixes[3138] = True
print(f"3138 after:  {lines[3137]!r}")

# --- 3141 (index 3140) ---
line = lines[3140]
print(f"\n3141 before: {line!r}")
if '${fmtAmt(rowAmt)}' in line or '${fmtN(rowTotal)}' in line:
    line = line.replace('${fmtAmt(rowAmt)}', r'\${fmtAmt(rowAmt)}')
    line = line.replace('${fmtN(rowTotal)}', r'\${fmtN(rowTotal)}')
    lines[3140] = line
    fixes[3141] = True
print(f"3141 after:  {lines[3140]!r}")

# --- 3147 (index 3146) ---
line = lines[3146]
print(f"\n3147 before: {line!r}")
if '${fmtAmt(rateBands.reduce' in line or '${fmtN(totalCount)}' in line:
    line = line.replace('${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}', r'\${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}')
    line = line.replace('${fmtN(totalCount)}', r'\${fmtN(totalCount)}')
    lines[3146] = line
    fixes[3147] = True
print(f"3147 after:  {lines[3146]!r}")

with open('src/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"\n✅ Fixed lines: {list(fixes.keys())}")
print("Saved!")
