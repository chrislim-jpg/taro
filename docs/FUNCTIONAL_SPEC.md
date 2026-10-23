# [오늘의 타로] 기능명세서 (Functional Specification)

본 문서는 '오늘의 타로' 웹서비스의 화면별 컴포넌트, 이벤트 핸들링, 전역 상태 제어, 데이터 스키마 및 주요 자바스크립트 함수 시그니처를 상세히 정의한 기술 사양서입니다.

---

## 1. 시스템 아키텍처 원칙

- **단일 페이지(SPA)**: 외부 프레임워크(React, Vue 등) 없이 하나의 `index.html`과 순수 자바스크립트(Vanilla JS)로 상태를 관리합니다.
- **화면 표시 메커니즘**: 모든 화면은 `<section class="screen">` 태그로 작성되며, 활성화된 화면만 표시되고 비활성 화면은 `.hidden` (`display: none;`) 처리됩니다.
- **무서버·정적 데이터**: 외부 API 호출이나 DB 없이 로컬 스크립트(`js/tarot-data.js`)에 정의된 배열 데이터를 참조합니다.

---

## 2. 전역 상태 모델 (State Management)

서비스의 단일 진실 공급원(Single Source of Truth)으로 사용되는 전역 객체 명세입니다.

```javascript
const AppState = {
  // 현재 활성화된 화면 식별자: 'HOME' | 'TOPIC' | 'DRAW' | 'RESULT'
  currentScreen: 'HOME',

  // 사용자가 선택한 고민 주제 코드: 'today' | 'love' | 'career' | 'money'
  selectedTopic: null,

  // 현재 추첨 슬롯에 배정된 서로 다른 3장의 카드 객체 배열
  drawnCards: [],

  // 사용자가 최종 탭하여 선택한 1장의 카드 객체
  pickedCard: null,

  // 카드 선택 인터랙션 중복 실행 방지 락 플래그
  isSelecting: false
};
```

---

## 3. 화면별 상세 기능 명세

### 3.1 [SCR-01] 메인 인트로 화면

| 항목 | 상세 내용 |
| :--- | :--- |
| **화면 코드 / ID** | `SCR-01` / `<section id="screen-home" class="screen">` |
| **주요 UI 요소** | 1. 장식 심볼: `<div class="intro-symbol">🔮</div>`<br>2. 타이틀: `<h1 class="main-title">오늘의 타로</h1>`<br>3. 서브카피: `<p class="sub-title">마음속 질문을 품고, 오늘의 카드를 확인해보세요.</p>`<br>4. CTA 버튼: `<button id="btn-start" class="btn-primary">타로 시작하기</button>` |
| **이벤트 및 트리거** | `#btn-start`에 대한 `click` 및 `keydown(Enter/Space)` 이벤트 |
| **시스템 처리 로직** | 1. `changeScreen('TOPIC')` 함수 호출<br>2. 인트로 화면에 `.fade-out` 애니메이션을 거쳐 `.hidden` 추가<br>3. `SCR-02` 화면의 `.hidden` 제거 및 `.fade-in` 활성화 |
| **예외 및 제약사항** | 별도 유효성 검사 없음. 페이지 첫 진입 시 기본 노출. |

---

### 3.2 [SCR-02] 주제 선택 화면

| 항목 | 상세 내용 |
| :--- | :--- |
| **화면 코드 / ID** | `SCR-02` / `<section id="screen-topic" class="screen hidden">` |
| **주요 UI 요소** | 1. 가이드 헤더: `<h2 class="section-title">어떤 이야기가 궁금하신가요?</h2>`<br>2. 보조 텍스트: `<p class="section-desc">관심 있는 주제 하나를 선택해주세요.</p>`<br>3. 4개 주제 버튼 컨테이너: `<div class="topic-grid">`<br>  - `<button class="btn-topic" data-topic="today">🌟 오늘의 운세</button>`<br>  - `<button class="btn-topic" data-topic="love">❤️ 연애</button>`<br>  - `<button class="btn-topic" data-topic="career">💼 일과 커리어</button>`<br>  - `<button class="btn-topic" data-topic="money">💰 금전</button>` |
| **이벤트 및 트리거** | `.btn-topic` 클릭 또는 키보드 선택 |
| **시스템 처리 로직** | 1. 클릭된 버튼의 `dataset.topic` 값 추출<br>2. `AppState.selectedTopic`에 저장<br>3. `prepareDrawCards()` 함수 실행 (22장 중 중복 없는 3장 무작위 선정)<br>4. `changeScreen('DRAW')` 호출 |
| **예외 및 제약사항** | 4개 버튼 중 반드시 1개를 선택해야만 다음 화면으로 진행 가능 (미선택 통과 불가). |

---

### 3.3 [SCR-03] 3장 카드 추첨 화면

| 항목 | 상세 내용 |
| :--- | :--- |
| **화면 코드 / ID** | `SCR-03` / `<section id="screen-draw" class="screen hidden">` |
| **주요 UI 요소** | 1. 주제 뱃지: `<div id="draw-topic-badge" class="badge"></div>`<br>2. 안내 문구: `<h2 class="draw-title">마음을 가다듬고 한 장을 골라주세요</h2>`<br>3. 덱 컨테이너: `<div id="card-deck" class="deck-container">`<br>4. 카드 3개 슬롯: `<div class="card-item" tabindex="0" data-slot="0..2">`<br>  - `<div class="card-inner">`<br>    - `<div class="card-face card-back">...골드 문양...</div>`<br>    - `<div class="card-face card-front">...앞면 렌더링...</div>`<br>5. 접근성 가이드: `<p class="draw-subtext">터치 또는 키보드(Tab, Enter)로 카드를 선택할 수 있습니다.</p>` |
| **이벤트 및 트리거** | `.card-item` 클릭 또는 포커스 상태에서 `Enter/Space` 입력 |
| **시스템 처리 로직** | 1. **중복 클릭 방지**: `if (AppState.isSelecting) return;`<br>2. **상태 잠금**: `AppState.isSelecting = true`<br>3. **클릭 차단**: `#card-deck`에 `.locked` (`pointer-events: none;`) 추가<br>4. **비선택 카드 흐림**: 나머지 2개 카드에 `.dimmed` (`opacity: 0.3;`) 부여<br>5. **3D 플립 애니메이션**: 선택된 카드에 `.is-flipped` 부여 (`transform: rotateY(180deg);` 0.6초)<br>6. **데이터 확정**: 해당 슬롯 카드를 `AppState.pickedCard`에 바인딩<br>7. **화면 전환 딜레이**: 플립(0.6초) + 감상(0.4초) 후 `renderResult()` 호출 및 `changeScreen('RESULT')` 실행 |
| **예외 및 제약사항** | 한 번 카드를 탭하면 취소하거나 다른 카드로 변경 불가. 다중 터치 원천 차단. |

---

### 3.4 [SCR-04] 타로 결과 화면

| 항목 | 상세 내용 |
| :--- | :--- |
| **화면 코드 / ID** | `SCR-04` / `<section id="screen-result" class="screen hidden">` |
| **주요 UI 요소** | 1. 카드 비주얼 영역: `<div class="result-card-box">`<br>  - `<img id="result-card-img" alt="타로 카드">`<br>  - `<div id="result-fallback" class="fallback-box">...심볼+카드명...</div>`<br>2. 카드명: `<h2 id="result-card-title"></h2>`<br>3. 키워드 태그: `<div id="result-keywords" class="keyword-group"></div>`<br>4. 주제별 해석 영역: `<div class="interpretation-box">`<br>  - `<h3 id="result-topic-heading"></h3>`<br>  - `<p id="result-interpretation-text"></p>`<br>5. 실천 조언 박스: `<div class="advice-box">`<br>  - `<h4>💡 오늘의 실천 조언</h4>`<br>  - `<p id="result-advice-text"></p>`<br>6. 면책 고지: `<p class="disclaimer">※ 본 서비스의 결과는 재미와 자기 성찰을 위한 콘텐츠입니다.</p>`<br>7. 버튼 그룹: `<div class="result-btn-group">`<br>  - `<button id="btn-retry" class="btn-secondary">같은 주제로 다시 뽑기</button>`<br>  - `<button id="btn-home" class="btn-ghost">처음으로</button>` |
| **이미지 Fallback 처리** | ```javascript
const imgEl = document.getElementById('result-card-img');
const fallbackEl = document.getElementById('result-fallback');
imgEl.onerror = () => {
  imgEl.style.display = 'none';
  fallbackEl.style.display = 'flex';
};
``` |
| **버튼 동작** | - `#btn-retry`: `prepareDrawCards()` 재호출 후 `changeScreen('DRAW')` 실행 (주제 유지)<br>- `#btn-home`: `AppState` 완전 초기화 후 `changeScreen('HOME')` 실행 |

---

## 4. 데이터 스키마 및 카드 매핑 규격

메이저 아르카나 22장은 아래 구조의 배열 형태로 관리됩니다.

```typescript
interface TarotCard {
  id: number;                   // 0 ~ 21 고유 번호
  name: string;                 // "0. 바보 (The Fool)"
  symbol: string;               // "🎒" (이미지 미노출 시 대체 심볼)
  image: string;                // "assets/images/00_the_fool.png"
  keywords: string[];           // ["새로운 시작", "순수함", "자유"]
  interpretations: {
    today: string;              // 오늘의 운세 해석 문구
    love: string;               // 연애운 해석 문구
    career: string;             // 일과 커리어 해석 문구
    money: string;              // 금전운 해석 문구
  };
  advice: string;               // 오늘의 실천 조언 한 줄
}
```

---

## 5. 핵심 자바스크립트 함수 명세 (Function Blueprint)

### 5.1 `changeScreen(screenName)`
- **역할**: 단일 페이지 내에서 요청된 화면만 활성화하고 나머지는 숨김 처리.
- **파라미터**: `screenName: 'HOME' | 'TOPIC' | 'DRAW' | 'RESULT'`
- **동작**:
  1. 모든 `.screen` 요소에 `.hidden` 클래스 추가 및 `.active` 제거.
  2. 대상 화면 엘리먼트(`screen-home`, `screen-topic` 등)의 `.hidden` 제거, `.active` 부여.
  3. `AppState.currentScreen = screenName;` 갱신.
  4. 화면 전환 시 스크롤 상단(`window.scrollTo(0, 0)`) 이동.

### 5.2 `prepareDrawCards()`
- **역할**: 22장의 타로 덱에서 서로 다른 3장의 카드를 무작위 선별하여 DOM 슬롯에 배정.
- **알고리즘**: Fisher-Yates Shuffle
```javascript
function prepareDrawCards() {
  const pool = [...TAROT_CARDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  AppState.drawnCards = pool.slice(0, 3);
  AppState.isSelecting = false;
  AppState.pickedCard = null;

  // DOM 3개 카드 슬롯 초기화 (뒤집힘 해제, 흐림 해제, 앞면 데이터 바인딩)
  const cardElements = document.querySelectorAll('.card-item');
  document.getElementById('card-deck').classList.remove('locked');
  cardElements.forEach((el, idx) => {
    el.classList.remove('is-flipped', 'dimmed');
    const frontEl = el.querySelector('.card-front');
    frontEl.innerHTML = `
      <div class="card-front-symbol">${AppState.drawnCards[idx].symbol}</div>
      <div class="card-front-name">${AppState.drawnCards[idx].name}</div>
    `;
  });
}
```

### 5.3 `handleCardSelect(slotIndex)`
- **역할**: 3장 중 1장 선택 시 인터랙션 잠금, 애니메이션 트리거, 결과 데이터 연결.
- **파라미터**: `slotIndex: number` (0, 1, 2)
```javascript
function handleCardSelect(slotIndex) {
  if (AppState.isSelecting) return;
  AppState.isSelecting = true;

  document.getElementById('card-deck').classList.add('locked');
  const cardElements = document.querySelectorAll('.card-item');

  cardElements.forEach((el, idx) => {
    if (idx === slotIndex) {
      el.classList.add('is-flipped'); // 선택된 카드 플립
    } else {
      el.classList.add('dimmed');     // 나머지 카드 흐림
    }
  });

  AppState.pickedCard = AppState.drawnCards[slotIndex];

  // 1초(0.6s 플립 + 0.4s 대기) 후 결과 화면 렌더링 및 전환
  setTimeout(() => {
    renderResult();
    changeScreen('RESULT');
  }, 1000);
}
```

### 5.4 `renderResult()`
- **역할**: `AppState.pickedCard`와 `AppState.selectedTopic` 데이터를 `SCR-04` 화면의 각 DOM 위치에 삽입.
- **매핑 규칙**:
  - 카드 타이틀: `card.name`
  - 키워드: `card.keywords.map(kw => `<span class="tag">#${kw}</span>`).join('')`
  - 주제 해석 제목: `TOPIC_LABELS[AppState.selectedTopic] + ' 마음의 흐름'`
  - 본문 해석: `card.interpretations[AppState.selectedTopic]`
  - 조언: `card.advice`
