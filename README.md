# 🔮 타로티카 (Tarotica) | 나를 돌아보는 AI 타로

> 매일 한 장의 타로와 AI 심층 리딩으로 내 마음을 돌아보는 모바일 웹 애플리케이션

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Mobile Web](https://img.shields.io/badge/Platform-Mobile%20Web-2877F5)](#)

---

## 1. 서비스 소개

**타로티카(Tarotica)**는 일상의 고민(연애, 진로, 인간관계, 금전 등)을 타로 리딩과 따뜻한 공감의 문장으로 돌아볼 수 있도록 돕는 모바일 친화적 웹서비스입니다.  
토스 스타일의 깔끔하고 직관적인 화이트 & 블루 디자인 시스템을 채택하여, 사용자가 심리적 부담 없이 하루의 운세와 조언을 확인할 수 있습니다.

---

## 2. 주요 기능 및 9개 화면 구성

| 화면 | 식별자 | 주요 기능 및 특징 |
| :--- | :--- | :--- |
| **1. 홈** | `home` | • 오늘 날짜 및 무료/유료 크레딧 표시<br>• 하루 1회 무료 '오늘의 타로' 즉시 진입<br>• AI 심층 타로(3장) 진입 패널 및 출석 체크 배너 |
| **2. 오늘의 타로** | `daily` | • The Sun(태양) 카드 중심의 일일 운세<br>• 총운, 연애운, 금전운 3대 영역 해석<br>• 실천 조언 및 보관함 자동 저장 |
| **3. 질문 작성** | `question` | • 6개 카테고리(연애, 진로, 금전, 관계, 학업, 기타) 선택<br>• 최대 300자 고민 서술형 입력 필드<br>• 크레딧 소모량(10 크레딧) 사전 명시 |
| **4. 카드 선택** | `cards` | • 과거 / 현재 / 미래 3장 슬롯 배치<br>• 78장 타로 덱에서 나를 위한 3장 선별<br>• 10크레딧 차감 확인 후 리딩 생성 |
| **5. AI 심층 리딩** | `result` | • 3장 카드 조합 스토리 및 심층 해석<br>• 과거(전차) - 현재(운명의 수레바퀴) - 미래(별)<br>• '오늘은 이것 하나만 해봐요' 실천 액션 제안 |
| **6. 보관함** | `archive` | • 이전 리딩 기록 조회 (필터: 전체, 오늘의 타로, 심층 타로)<br>• 과거 일자별 리딩 히스토리 재열람 |
| **7. 리딩 공유** | `share` | • 인스타그램 스토리 규격(9:16) 감성 카드 뷰<br>• '내 질문 포함하기' 사생활 보호 토글<br>• Web Share API 연동 및 이미지 저장 안내 |
| **8. 크레딧 상점** | `store` | • 보유 크레딧(무료/유료) 잔액 표시<br>• 30 / 100 / 300 크레딧 충전 패키지 선택<br>• 구매 즉시 잔액 갱신 시뮬레이션 |
| **9. 출석 체크** | `attendance` | • 7일 연속 출석 캘린더<br>• 매일 무료 2크레딧 지급, 7일 연속 시 추가 10크레딧<br>• 실시간 수령 토스트 피드백 |

---

## 3. 🚀 Vercel 배포 가이드

본 프로젝트는 Vercel 배포에 필요한 모든 설정(`vercel.json`, `package.json`, `manifest.json`, `favicon.svg`)이 완비되어 있습니다.

### 방법 1: GitHub 연동 자동 배포 (가장 권장)

1. [Vercel](https://vercel.com)에 로그인합니다.
2. 대시보드 우측 상단의 **[Add New...] ➔ [Project]**를 클릭합니다.
3. GitHub 계정에서 **`chrislim-jpg/taro`** 저장소를 선택하고 **[Import]**를 클릭합니다.
4. 배포 설정 확인:
   - **Framework Preset**: `Other` (기본값)
   - **Root Directory**: `./` (기본값)
   - **Build and Output Settings**: 기본값 그대로 유지
5. **[Deploy]** 버튼을 클릭하면 약 30초 내에 배포가 완료되며 고유 도메인(예: `https://taro-xxx.vercel.app`)이 발급됩니다.
6. 이후 GitHub에 `git push`할 때마다 Vercel이 자동으로 감지하여 무중단 자동 배포(CI/CD)됩니다.

---

### 방법 2: Vercel CLI 터미널 배포

터미널에서 명령어 한 줄로 즉시 배포할 수도 있습니다:

```bash
# 1. Vercel CLI 설치 (최초 1회)
npm install -g vercel

# 2. Vercel 로그인
vercel login

# 3. 프로젝트 디렉토리에서 프로덕션 배포
vercel --prod
```

---

## 4. 로컬 실행 및 테스트 방법

외부 빌드 도구나 복잡한 환경 설정 없이 로컬에서 바로 실행할 수 있습니다.

```bash
# 방법 A: npm serve 사용 (Node.js 환경)
npm run dev
# 브라우저에서 http://localhost:3000 접속

# 방법 B: Python 기본 내장 서버 사용
python3 -m http.server 3000
# 브라우저에서 http://localhost:3000 접속

# 방법 C: VS Code Live Server 확장을 사용하여 index.html 우클릭 -> Open with Live Server
```

---

## 5. 프로젝트 폴더 및 파일 구조

```
taro/
├── index.html              # 타로티카 메인 애플리케이션 (SEO & 모바일 최적화)
├── vercel.json             # Vercel 배포 라우팅 및 보안/캐시 헤더 설정
├── package.json            # Vercel 프로젝트 감지 및 npm 스크립트 정의
├── manifest.json           # 모바일 PWA 웹앱 매니페스트
├── favicon.svg             # 타로티카 벡터 심볼 파비콘 (달 & 별)
├── .gitignore              # Git 제외 파일 목록
├── README.md               # 본 문서 (서비스 및 Vercel 배포 가이드)
│
├── taro-app/               # [타로티카 공식 기획 & 디자인 산출물]
│   ├── tarot_app_prd.md              # 제품 요구사항 정의서 (PRD)
│   ├── tarot_app_functional_spec.md  # 상세 기능명세서 (F-01 ~ F-04)
│   ├── tarot_app_user_flow.md        # 상세 유저플로우
│   ├── tarot_app_wireframe.md        # UI 와이어프레임
│   └── tarot_app_design_guide.md     # Figma 기반 디자인 가이드
│
└── docs/ (선택 참고)
    ├── PRD.md
    ├── USER_FLOW.md
    ├── FUNCTIONAL_SPEC.md
    └── WIREFRAME.md
```

---

## 6. Vercel 배포 최적화 설정 (`vercel.json`)

- **Clean URLs**: URL 끝에 `.html` 없이 깔끔하게 접근 가능 (`cleanUrls: true`)
- **보안 헤더 탑재**:
  - `X-Content-Type-Options: nosniff` (MIME 스니핑 방지)
  - `X-Frame-Options: DENY` (클릭재킹 공격 방지)
  - `X-XSS-Protection: 1; mode=block` (XSS 필터 활성화)
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **정적 에셋 캐싱**: 파비콘 및 매니페스트 1일 캐싱 및 백그라운드 갱신
