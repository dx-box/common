# @dx-box/common

- 개발 생산성을 높이고 일관된 코드 품질을 유지하기 위한 구성 자동화 패키지

---

**English version:** [README.en.md](./README.en.md)

---

## 주요 기능

1. TypeScript, ESLint, Prettier 기본설정 템플릿 제공 및 기존 설정과 병합
2. Git pre-commit 훅을 통한 Prettier, ESLint 자동 수정
3. import 문 자동 정렬

### 기본 설정 템플릿 제공

templates 폴더에 기본 eslint, prettier, tsconfi 등의 설정 파일을 제공합니다.

### 자동 설정 파일 생성 및 병합

사용자가 기존에 작성한 설정과 템플릿 설정을 병합하여 `tsconfig.json`, `.prettierrc.json`, ESLint 설정
파일(`.eslintrc.cjs` 또는 `eslint.config.js`)로 저장합니다.

### ESLint 버전 대응

ESLint 버전 8과 9 이상을 자동 감지하여, 적합한 설정 형식을 적용합니다.

- v8 - `.eslintrc.cjs`
- v9 이상 - Flat Config `eslint.config.js`

### 코드 포맷 및 린트 실행 지원

`dx-fix` 스크립트를 실행하여 코드 스타일 검사와 자동 수정을 수행합니다.

### Git pre-commit 훅 자동 설정 (Husky)

Git 저장소에 Husky pre-commit 훅을 등록해 커밋 전에 자동으로 린트 및 포맷 검사를 실행하도록 구성합니다.

---

## 사용법

- `npm install @dx-box/common --save-dev`로 설치
- `npx dx-init` 명령어로 기본 설정과 Git 훅 자동 적용
- `eslint.config.js`, `.prettierrc.json`, `tsconfig.json` 파일 자동 생성 및 병합 지원

---

## TODO

- 기능 추가
  - [ ] eslint v9 override 가능하도록 변경
  - [x] 절대경로 설정
  - [x] 빌드 minify 로직 추가
  - [x] `npx dx-absolute`로 src 내 모든 경로 절대경로로 변경
  - [x] tsconfig be,fe 분리
  - [x] changeset
  - [ ] github actions / gitlab ci/cd / jenkins
  - [x] 대화형 프롬프트로 설정
  - [x] dx-init 커맨드 추가
  - [x] `dx.config.ts` 제거 및 override 로직 개선
  - [ ] `yml`, `yaml` 지원하지 않음
- README 재작성
  - [ ] 한글문서
  - [ ] 영어문서

---

기여와 제안은 언제나 환영합니다!
