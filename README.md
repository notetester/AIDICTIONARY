# AIDICTIONARY

비전공자가 이해할 수 있는 쉬운 설명에서 시작해, 정확한 기술 정의·작동 원리·트레이드오프·실무 검증 기준까지 이어지는 공개 AI·IT 용어 사전입니다.

사이트: https://notetester.github.io/AIDICTIONARY/

## 편집 원칙

AIDICTIONARY는 “쉽다”와 “정확하다”를 서로 바꾸지 않습니다.

1. **직관** — 처음 접한 사람도 전체 모습을 잡을 수 있는 쉬운 설명
2. **정확한 정의** — 수식, 조건, 적용 범위를 포함한 기술적 설명
3. **작동 원리** — 입력에서 출력까지 실제 처리 순서
4. **실무 판단** — 장단점, 실패 조건, 검증 체크리스트
5. **오해 교정** — 자주 발생하는 잘못된 단순화와 정확한 해석
6. **지식 확장** — 선행 개념, 직접 관련 개념, 다음 학습 개념의 연결

세부 작성 기준은 [EDITORIAL_GUIDE.md](./EDITORIAL_GUIDE.md)를 따릅니다.

## 주요 기능

- 한글명·영문명·별칭·본문·심화 설명 통합 검색
- 분야와 난이도 필터
- 가나다순·영문순·난이도순 정렬
- 쉬운 설명과 정확한 기술 정의를 분리한 계층형 해설
- 작동 원리, 수식, 트레이드오프, 흔한 오해, 실무 체크리스트
- 선행 학습·다음 학습·역참조 관계
- 관련 용어를 2단계로 펼치는 지식 트리
- 공유 가능한 용어별 해시 링크
- 다크 모드와 모바일 반응형 UI
- 외부 라이브러리와 빌드 과정이 없는 정적 GitHub Pages 사이트

## 데이터 구조

기본 용어 데이터:

```text
data/terms-ml.js
data/terms-llm.js
data/terms-it.js
data/terms-expert-ai.js
```

전문가 심화 해설:

```text
data/term-details.js
```

기본 용어는 이름·한 문장 정의·기본 설명·예시·관련 용어를 담당합니다. 심화 해설은 다음 필드를 선택적으로 추가합니다.

```js
{
  intuition: "비전공자용 직관 설명",
  precise: "정확한 기술 정의",
  mechanism: ["작동 단계 1", "작동 단계 2"],
  why: "왜 중요한가",
  tradeoffs: ["장점과 한계"],
  misconceptions: [
    ["잘못된 이해", "정확한 설명"]
  ],
  practice: ["실무 또는 실험 체크리스트"],
  prerequisites: ["먼저 학습할 term id"],
  next: ["다음에 학습할 term id"],
  formula: [
    ["이름", "수식", "기호 설명"]
  ],
  sources: [
    ["1차 자료 이름", "https://..."]
  ]
}
```

## 현재 중점 확장 영역

- LoRA, rank, alpha, scaling, target modules
- Attention projection과 gated MLP
- QLoRA, NF4, mixed precision
- 멀티시드, paired evaluation, 효과 크기와 신뢰구간
- Structured Output, JSON Schema, constrained decoding
- repair loop, contract compliance, train–serve–eval skew
- RAG, grounding, evidence, citation

## 로컬 실행

```bash
python -m http.server 8000
```

그다음 `http://localhost:8000`을 엽니다.

## 배포

`main`에 push하면 `.github/workflows/deploy-pages.yml`이 GitHub Pages에 자동 배포합니다.

## 검증

`.github/workflows/validate.yml`이 다음을 검사합니다.

- 모든 JavaScript 파일의 문법
- 최소 용어 수와 분야 수
- 용어 ID 중복
- 필수 필드 누락
- 심화 해설이 실제 용어 ID를 참조하는지
- 해결되지 않은 관계 링크 경고

## 기여

오탈자, 부정확한 설명, 새 용어와 관계 추가는 Issue 또는 Pull Request로 제출할 수 있습니다. [CONTRIBUTING.md](./CONTRIBUTING.md)와 [EDITORIAL_GUIDE.md](./EDITORIAL_GUIDE.md)를 참고하세요.

## 라이선스

GNU GPL v3
