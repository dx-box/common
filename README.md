# @dx-box/common

> 개발 경험(DX)을 향상시키는 TypeScript, ESLint, Prettier 기본 설정 및 Git 훅 자동화 패키지입니다.

---

**English version:** [README.en.md](./README.en.md)

---

## 주요 기능 및 TODO

1. Git 훅을 통한 Prettier, ESLint 자동 수정  
2. TypeScript, ESLint, Prettier용 절대 경로(alias) 설정  
3. import 문 자동 정렬  
4. 컴포넌트 props 정렬  
5. 컴포넌트 인자(props) 정렬  
6. 컴포넌트 멤버 정렬 (state, hooks, handlers 등)  
7. 사용자 설정과 병합 가능한 설정 로딩 지원  
8. 프레임워크별 옵션 분리 (React, Vue 등) — 추후 계획  

---

## 사용법

- `npm install @dx-box/common --save-dev`로 설치  
- `dx-common init` 명령어로 기본 설정과 Git 훅 자동 적용  
- `.eslintrc.json`, `.prettierrc`, `tsconfig.json` 파일 자동 생성 및 병합 지원  

---

기여와 제안은 언제나 환영합니다!
