# @korede.neden 캐러셀 제작 규칙 (자동 작업용)

2일마다 도는 예약 작업과, Jong이 "컨펌"이라고 답한 세션이 이 문서를 따릅니다.
보고는 한국어, 결론 먼저. 확인 못 한 것은 [추정]으로 표시합니다.

## 계정
- 터키어 사용자에게 한국 생활 문화를 사전처럼 설명하는 계정. 디자인 B(사전 스타일), 1080×1350, 6장.
- 게시: 월·금 터키 시간 20:00. GitHub Actions가 `reviewed: true`인 게시물만 올립니다.
- **새 캐러셀은 날짜 없이 재고로 보관합니다.** 슬롯마다 컨펌된 재고 1개가 자동으로 골라져 올라갑니다.
  - 고르는 순서: 시기(season) → 우선 지정(priority) → 반응 좋은 분류(category) → 먼저 만든 순
  - 다음 게시 순서 확인: `python3 publish.py --queue`
- 터키어는 원어민 검수가 없습니다. 쉬운 문장으로 쓰고, 스스로 두 번 교정합니다.

## 한 번 실행할 때 할 일
1. 저장소를 임시 폴더에 받습니다: `git clone https://github.com/skytravelover-ship-it/korede-neden-uploader "$(mktemp -d)/repo"`
2. `studio/topics.md`에서 다룬 주제와 후보를 확인하고, **겹치지 않는 새 주제 1개**를 고릅니다.
   - 재고에 많은 분류보다 적은 분류를 고릅니다. `stats.json`에서 반응 좋은 분류도 참고합니다.
   - 명절·계절 주제는 그 시기 2~4주 전에 만들어 두면 됩니다(season으로 시기에만 올라감).
3. 사실 확인: 1차 출처 2개 이상을 직접 엽니다.
   - 우선순위: 정부·공공기관(korea.kr, 국가유산청, 법령), 국립국어원 표준국어대사전, 한국민족문화대백과(encykorea), 한국관광공사.
   - 블로그·커뮤니티·위키는 단서로만 쓰고 근거로 쓰지 않습니다.
   - 출처가 갈리거나 유래가 통설뿐이면 그 문장은 쓰지 않습니다.
4. 사진: Pexels 무료 사진만 씁니다(Chrome으로 검색).
   - 받기: `curl -sL -A "Mozilla/5.0" -o studio/ph/<이름>.jpg "https://images.pexels.com/photos/<ID>/pexels-photo-<ID>.jpeg?auto=compress&cs=tinysrgb&w=1600"`
   - `studio/credits.md`에 한 줄 추가합니다.
   - **화면 속 대상 = 설명하는 대상.** 다른 나라 물건이나 장소로 대신하지 않습니다. 맞는 사진이 없으면 사진 없는 슬라이드 형식(steps, num, trio, table)을 씁니다.
5. `studio/content.js`에 `POSTS.<새 키>`를 추가합니다. 구성은 기존 게시물과 같게 합니다.
   - 1 cover(질문) → 2~5 text / trio / steps / num → 6 end(오늘의 단어 + 출처)
   - 질문 1개와 답 1개를 한 문장씩 먼저 정합니다. 둘 다 못 쓰면 다른 주제로 바꿉니다.
   - 낯선 단어는 이름보다 뜻을 먼저 씁니다.
   - 숫자는 기간, 대상, 출처를 함께 씁니다.
   - 1인칭 경험담, 참여 유도("친구에게 보내"), 정치·종교·사건사고·술 중심 소재는 쓰지 않습니다.
6. 렌더링: `python3 studio/render.py <키> <번호-id>`
   - `studio/carousels/<id>/sheet.png`를 열어 직접 봅니다.
   - 글자 넘침, 잘린 사진, 사진과 내용 불일치가 있으면 고칩니다.
7. `studio/carousels/<id>/caption.txt`를 씁니다.
   - 요약 2~3줄, 출처 1줄, 해시태그 5개 이하. 마지막은 `#koredeneden`.
8. `posts.json`에 재고로 추가합니다:
   `{"id", "type": "carousel", "src": "studio/carousels/<id>", "day": null, "reviewed": false, "category", "title"}`
   - `category`: dil(말·표현) / yemek(음식·식탁) / gelenek(명절·전통) / gunluk(생활·제도)
   - 시기가 있는 주제만 `"season": {"from": "MM-DD", "to": "MM-DD"}`를 넣습니다. 이 기간에만 올라가고, 기간 안에서는 먼저 올라갑니다.
9. `python3 build_posts.py && python3 publish.py --check`를 실행합니다. 오류가 없으면 커밋하고 푸시합니다.
10. 보고(한국어):
    - 주제, 표지 질문(터키어 + 한국어 뜻), 슬라이드별 한 줄 요약(한국어), 근거 URL, 분류·시기
    - 재고 현황과 다음 게시 순서(`python3 publish.py --queue` 결과 요약)
    - 반응: `stats.json`이 있으면 게시된 글별 좋아요·댓글·저장·공유·도달과 분류별 순위
    - 쓰지 않은 내용과 이유
    - `sheet.png` 경로(이미지로 보여 줄 것)
    - 마지막 줄: "컨펌하시면 재고에 들어가 순서대로 올라갑니다. '먼저'라고 하시면 다음 슬롯에 올립니다."

## 컨펌 처리 (Jong이 "컨펌 <id>" 또는 "OK"라고 답했을 때)
1. 저장소를 최신으로 받습니다.
2. 해당 게시물을 `"reviewed": true`로 바꾸고 `publish.py --check`를 돌린 뒤 푸시합니다.
3. 수정 요청이 오면: 고치고 → 다시 렌더링 → 다시 보고합니다. 이때 `reviewed`는 false로 둡니다.

## 순서 바꾸기 (Jong의 말 → 할 일)
- "컨펌 <id>": `reviewed: true`
- "<id> 먼저": `"priority": 1` (여러 개면 숫자가 클수록 먼저)
- "<id> 빼": `reviewed: false`로 되돌림(재고에는 남김)
- "<id> 12/4에": `day`를 launch_date 기준 일수로 넣어 날짜 지정

## 재고 관리
- 컨펌 대기가 3개 이상이면 보고 첫 줄에 "확인 대기 N개"를 적습니다.
- 다음 2주 슬롯이 비어 있으면(컨펌된 재고 부족) 보고 첫 줄에 적습니다.

## 절대 하지 않을 것
- `reviewed: true`를 Jong의 컨펌 없이 넣지 않습니다.
- 토큰, 비밀번호, 시크릿을 보거나 바꾸지 않습니다.
- 게시물을 직접 올리지 않습니다(`--only` 금지). 게시는 GitHub Actions만 합니다.
