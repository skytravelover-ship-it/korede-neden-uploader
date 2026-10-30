# 인스타 자동 업로드 (@korede.neden)

정해진 시간에 캐러셀과 릴스를 인스타그램 공식 API로 올립니다.
GitHub Actions가 30분마다 확인하므로 Mac이 꺼져 있어도 올라갑니다.
@koreli.mom 업로드 장치와 구조는 같고, **저장소·토큰·게시 기록은 완전히 따로**입니다.

## koreli.mom 장치와 다른 점
| | koreli.mom | korede.neden |
|---|---|---|
| 형식 | 캐러셀만 | 캐러셀 + **릴스** |
| 게시 조건 | 시간이 되면 게시 | 시간이 되고 **`reviewed: true`인 것만** 게시 (원어민 검수 전에는 절대 안 올라감) |
| 해시태그 검사 | 30개 | **5개** (인스타 앱 상한) |
| 첫 댓글 | 질문 댓글 있음 | 없음 (계정 지침: 참여 유도 문구 쓰지 않음). 필요하면 `posts/<id>/comment.txt`를 직접 만들면 달림 |
| 원본 위치 | `카드뉴스/` | `업로드_v3_N주차/` |

## 구성
| 파일 | 역할 |
|---|---|
| `posts.json` | 게시 일정. `launch_date`(런칭일), 게시물마다 `day`(런칭일로부터 며칠 뒤)·`time`(터키 시간)·`reviewed`(검수 완료 여부) |
| `posts/<id>/` | 올릴 파일. 캐러셀: `01.jpg…`, `caption.txt` / 릴스: `video.mp4`, `cover.jpg`, `caption.txt` |
| `build_posts.py` | `업로드_v3_N주차` 폴더 → `posts/`로 복사 (PNG→JPEG). 이미지나 캡션을 고친 뒤 실행 |
| `publish.py` | 시간이 된 게시물 업로드. `state.json`에 기록해 두 번 올리지 않음 |
| `.github/workflows/publish.yml` | 30분마다 `publish.py` 실행 |

현재 일정 (런칭일 = 0일 = 11/9(월) 예정, 터키 시간 20:00):
| id | 내용 | 날짜 | 지금 상태 |
|---|---|---|---|
| 01-hitap | 호칭 캐러셀 | 0일 (11/9 월) | 검수 대기 |
| 02-telaffuz | 호칭 발음 릴스 | 2일 (11/11 수) | 검수 + **녹음 대기** |
| 03-kimjang | 김장 캐러셀 | 4일 (11/13 금) | 검수 대기 |
| 04-suneung | 수능 캐러셀 | 7일 (11/16 월) | 검수 대기 |
| 05-selamlasma | 인사말 릴스 | 9일 (11/18 수) | 검수 + **녹음 대기** |
| 06-bahsis | 팁 캐러셀 | 11일 (11/20 금) | 검수 대기 |
| 07-kore-yasi | 한국 나이 캐러셀 | 14일 (11/23 월) | 검수 대기 |
| 08-yemek-selami | 밥 먹었어? 릴스 | 16일 (11/25 수) | 검수 + **녹음 대기** |
| 09-miyeokguk | 미역국 캐러셀 | 18일 (11/27 금) | 검수 대기 |

## 처음 한 번만 하는 설정 (Jong이 직접)
비밀번호 입력, 계정 연결, 권한 승인은 본인이 해야 합니다.

1. **korede.neden을 프로페셔널 계정으로 전환**
   설정 → 계정 유형 → 프로페셔널 → 크리에이터. API 게시는 프로페셔널 계정만 됩니다.
2. **koreli.mom에 쓰던 Meta 개발자 앱에 korede.neden 추가**
   - 새 앱을 만들 필요는 없을 것으로 봅니다 [추정: 화면에서 확인].
   - 비즈니스 포트폴리오에 korede.neden 인스타 계정을 추가하고, koreli.mom 때처럼 시스템 사용자에 이 계정 권한을 줍니다.
   - 권한: `instagram_business_basic`, `instagram_business_content_publish`, `instagram_business_manage_comments`
   - korede.neden용 **인스타 사용자 ID**와 **토큰**을 받습니다. koreli.mom의 ID·토큰을 그대로 쓰면 안 됩니다.
3. **GitHub 저장소 새로 만들기 (공개)**
   - 예: `korede-neden-uploader`. 이 폴더의 내용을 저장소 맨 위에 올립니다.
   - 공개여야 하는 이유: 인스타 API는 이미지를 공개 URL에서 가져갑니다. 그래서 게시 전 이미지가 저장소에서 보일 수 있습니다.
   - Settings → Secrets and variables → Actions:
     - Secrets: `IG_USER_ID`, `IG_ACCESS_TOKEN`
     - Variables: `IG_API_HOST` = `graph.facebook.com` (시스템 사용자 토큰일 때)
4. **런칭일 넣기:** `posts.json`의 `"launch_date": null`을 `"launch_date": "2026-11-09"`처럼 바꿉니다.
   - 이 단계까지 해도 `reviewed`가 false인 게시물은 올라가지 않습니다.
   - Actions 탭에서 "Run workflow"로 한 번 돌려 오류가 없는지 확인합니다.

## 평소 운영
1. **검수가 끝난 게시물:** 고칠 문장이 있으면 원본(`제작소스/v3`)을 고쳐 다시 렌더링합니다.
2. `python3 build_posts.py` 실행
3. `posts.json`에서 그 게시물의 `"reviewed": false`를 `true`로 바꿉니다.
4. `python3 publish.py --check` 로 점검한 뒤 저장소에 올립니다.

**릴스:** 녹음본을 넣은 최종 영상은 원본 폴더에 `reel_final.mp4`라는 이름으로 둡니다. 그러면 `build_posts.py`가 가져갑니다.
- `reel_임시음성_게시금지.mp4`는 절대 복사되지 않습니다.

**그 밖의 명령**
- `python3 publish.py --dry-run`: 지금 올라갈 것을 보여 줍니다(실제로 올리지 않음).
- `python3 publish.py --only 04-suneung`: 한 개를 지금 바로 올립니다. 이때도 `reviewed: true`여야 합니다.

## 안전장치
- `reviewed: true`가 아닌 게시물은 어떤 경우에도 올리지 않습니다.
- 이미 올린 게시물은 `state.json`에 남아 다시 올리지 않습니다.
- 게시 시각에서 6시간 넘게 지난 게시물은 자동으로 올리지 않습니다. 런칭일을 잘못 넣었을 때 한꺼번에 올라가는 것을 막기 위해서입니다.
- 아래 문제가 있는 게시물은 건너뜁니다.
  - 캐러셀: 장수가 2~10장 밖, 이미지 8MB 초과, 비율 오류
  - 릴스: 영상 300MB 초과, 길이가 3초~15분 밖, 파일 구조 오류
  - 캡션: 2,200자 초과, 해시태그 5개 초과
- 하루 게시 한도를 API에서 확인한 뒤 올립니다.

## 릴스 업로드 방식
- `IG_API_HOST`가 `graph.facebook.com`이면 영상 파일을 직접 전송합니다. Meta의 resumable upload(rupload.facebook.com) 방식입니다.
- 그 밖의 경우에는 저장소의 공개 URL을 알려 주고 인스타가 가져가게 합니다.
- 커버는 `cover.jpg`를 쓰고, 피드와 릴스 탭에 모두 표시되게 설정합니다(`share_to_feed`).
- 근거: [Meta 콘텐츠 게시 문서](https://developers.facebook.com/docs/instagram-platform/content-publishing), [IG User Media 레퍼런스](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media) (2026-10-30 확인)
  - 형식: MP4, H.264
  - 크기와 길이: 최대 300MB, 3초~15분
  - moov 정보가 파일 앞에 있어야 함
- 실제 계정으로는 아직 시험하지 않았습니다. 가짜 API로만 흐름을 확인했습니다. **첫 릴스는 `--only`로 직접 올려 보고 결과를 확인하는 것을 권합니다.**

## API 없이 쓰는 방법 (예비)
`업로드_v3_N주차` 폴더에 이미지, 영상, 캡션이 다 있습니다. 그래서 인스타 앱이나 Meta Business Suite의 **예약 게시**로 직접 올려도 됩니다.
