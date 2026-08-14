#!/usr/bin/env python3
"""Fix lines 3111 and 3146 in index.tsx - escape ${} inside nested backtick template literals"""

with open('src/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
print(f"Line 3111 current: {repr(lines[3110])}")
print(f"Line 3146 current: {repr(lines[3145])}")

# 3111 (index 3110): 합계행 - 상품 카테고리
# 현재 내용의 실제 문자열:
#   '                ${rateBands.map(b => \`<td>${fmtAmt(b.amt)}<br><span style="font-size:10px;color:#6b7280">${fmtN(b.count)}건</span></td>\`).join(\'\')}\n'
# 목표: 외부 ${}를 \${}로 이스케이프, 내부 백틱 안의 ${}도 \${}로, 금액 위에 <b> 추가
#   '                \${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style="font-size:10px;color:#6b7280">\${fmtN(b.count)}건</span></td>\`).join(\'\')}\n'

indent = '                '
# 실제 파일에서 백틱은 \` (백슬래시+백틱)으로 저장됨
new_3111 = indent + r"\${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style=\"font-size:10px;color:#6b7280\">\${fmtN(b.count)}건</span></td>\`).join('')}" + "\n"
new_3146 = indent + r"\${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style=\"font-size:10px;color:#6b7280\">\${fmtN(b.count)}건</span></td>\`).join('')}" + "\n"

print(f"\nNew 3111: {repr(new_3111)}")
print(f"New 3146: {repr(new_3146)}")

lines[3110] = new_3111
lines[3145] = new_3146

# 3112 (index 3111): 합계 전체 합계 td - 상품 카테고리
# 현재: '                <td>${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}<br><span ...>${fmtN(totalCount)}건</span></td>\n'
# 목표: <b> 추가
curr_3112 = lines[3111]
new_3112 = curr_3112.replace(
    '<td>${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}<br>',
    '<td><b>${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}</b><br>'
)
lines[3111] = new_3112
print(f"Line 3112: {repr(new_3112)}")

# 3147 (index 3146): 합계 전체 합계 td - 에이전트 카테고리
curr_3147 = lines[3146]
new_3147 = curr_3147.replace(
    '<td>${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}<br>',
    '<td><b>${fmtAmt(rateBands.reduce((s,b)=>s+b.amt,0))}</b><br>'
)
lines[3146] = new_3147
print(f"Line 3147: {repr(new_3147)}")

with open('src/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n✅ Saved!")
print(f"\nFinal verify 3111: {repr(lines[3110])}")
print(f"Final verify 3112: {repr(lines[3111])}")
print(f"Final verify 3146: {repr(lines[3145])}")
print(f"Final verify 3147: {repr(lines[3146])}")
