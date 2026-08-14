#!/usr/bin/env python3
"""Fix lines 3111 and 3146 - replace escaped quotes with normal quotes"""

with open('src/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 3111 (index 3110) 현재 상태 출력
print("BEFORE 3111:", repr(lines[3110]))
print("BEFORE 3146:", repr(lines[3145]))

# 실제 파일에 기록된 내용 (repr 기준으로):
# '                \\${rateBands.map(b => \\`<td><b>\\${fmtAmt(b.amt)}</b><br><span style=\\"font-size:10px;color:#6b7280\\">\\${fmtN(b.count)}건</span></td>\\`).join(\\'\\')}\n'
# 이 중 style=\\" 를 style=" 로 바꿔야 함

# 파일에 실제로 저장된 문자열 (Python str 관점):
# \${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style=\"font-size:10px;color:#6b7280\">\${fmtN(b.count)}건</span></td>\`).join('')}\n

# 목표:
# \${rateBands.map(b => \`<td><b>\${fmtAmt(b.amt)}</b><br><span style="font-size:10px;color:#6b7280">\${fmtN(b.count)}건</span></td>\`).join('')}\n

# style=\" -> style="  (백슬래시+큰따옴표 → 그냥 큰따옴표)
for idx in [3110, 3145]:
    original = lines[idx]
    # 이중 이스케이프된 큰따옴표를 단순 큰따옴표로 교체
    # 파일 내 실제 문자: \" -> "
    fixed = original.replace('\\"', '"')
    lines[idx] = fixed
    print(f"Line {idx+1} AFTER: {repr(fixed)}")

with open('src/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n✅ Saved!")

# 최종 내용 확인 (Read tool처럼 표시)
with open('src/index.tsx', 'r', encoding='utf-8') as f:
    lines2 = f.readlines()
print(f"\nLine 3111 final: {lines2[3110]}")
print(f"Line 3146 final: {lines2[3145]}")
