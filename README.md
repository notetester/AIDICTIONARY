# AIDICTIONARY

AI부터 소프트웨어 개발, 데이터베이스, 네트워크, 클라우드·인프라, Git 협업, 보안·품질까지 한국어로 쉽게 설명하는 공개 IT 용어 사전입니다.

## 주요 기능

- 한글명·영문명·별칭·설명 통합 검색
- 분야와 난이도 필터
- 가나다순·영문순·난이도순 정렬
- 관련 용어 이동과 공유 가능한 상세 링크
- 다크 모드와 모바일 반응형 UI
- 빌드 도구나 외부 라이브러리 없이 GitHub Pages에서 실행
- 분야별 용어 데이터를 `data/terms-*.js`로 분리하여 간단히 확장

## 현재 수록 범위

초기 버전에는 107개 용어가 들어 있습니다.

- LLM·생성형 AI
- AI·머신러닝
- 개발·웹
- 데이터·DB
- 클라우드·인프라
- 네트워크
- Git·협업
- 보안·품질

LoRA rank·alpha·target modules, attention·MLP, 멀티시드, 그리드 서치, grounding, 구조화 출력과 repair loop처럼 실제 AI 실험에서 마주치는 용어도 포함합니다.

## 로컬 실행

정적 파일 서버를 사용하면 됩니다.

```bash
python -m http.server 8000
```

그다음 `http://localhost:8000`을 엽니다.

## GitHub Pages 배포

`main` 브랜치에 변경이 반영되면 `.github/workflows/deploy-pages.yml`이 사이트를 자동 배포합니다.

사이트 주소:

```text
https://notetester.github.io/AIDICTIONARY/
```

수동 재배포가 필요하면 저장소의 **Actions → Deploy static content to Pages → Run workflow**를 실행합니다.

## 용어 추가

분야에 맞는 `data/terms-*.js` 파일의 `rows` 배열에 다음 순서로 항목을 추가합니다.

```js
[
  "unique-slug",
  "한글 용어",
  "English Term",
  ["별칭"],
  "AI·머신러닝",
  "입문",
  "한 문장 정의",
  "자세한 설명",
  "실제 예시",
  ["related-term-id"],
  ["검색 키워드"]
]
```

## 기여

오탈자, 부정확한 설명, 새 용어 제안은 Issue 또는 Pull Request로 제출할 수 있습니다. 자세한 기준은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.

## 라이선스

이 저장소의 기존 라이선스인 GNU GPL v3를 따릅니다.
