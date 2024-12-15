# 24-02-WSD-Assignment-03
### 구인구직 백엔드 서버 만들기 (사람인..?)
## 프로젝트 기본 정보
- 웹 크롤링 이해 및 적용: 사람인에서 채용 공고 데이터를 크롤링하여 수집.
- 데이터베이스 설계: 크롤링한 데이터를 SQL (MySQL) 또는 NoSQL (MongoDB)로 구조화.
- REST API 개발: 크롤링한 데이터를 기반으로 한 다양한 기능의 API 개발 및 회원 인증 기능 구현.
- 문서화 및 인증: Swagger를 이용한 API 문서화와 JWT 기반 인증 시스템 적용.
- 클라우드 배포: JCloud를 사용하여 백엔드 서버를 배포.


```mermaid
gantt
  dateFormat  YYYY-MM-DD
  section 초기 세팅
  서버 세팅 :a1, 2024-11-27, 1d
  크롤링: a2, 2024-11-28, 1d
  section API 개발
  Job API: a3, 2024-11-29, 2d
  Auth API: a3, 2024-11-30, 3d
  Debug API: a3, 2024-12-2, 1d
  지원 API: a3, 2024-12-3, 2d
  북마크 API: a3, 2024-12-6, 2d
  알림 API: a3, 2024-12-7, 2d
  section 마무리
  Refactor: a4, 2024-12-05, 4d
```

## 기술 스택
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=Express&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white)
![jcloud](https://img.shields.io/badge/jcloud-ed1944?style=for-the-badge&logo=Openstack&logoColor=white)


## 사용법
모든 API는 /api 경로를 통해서 접근할 수 있습니다.<br>
API 호출 시, 기본적으로 ip:port/api를 포함하여 요청해야 합니다.
~~~
GET http://<ip>:<port>/api/csrf-token
~~~

## Swagger 접속
![link.pdf](link.pdf)

![alt text](image.png)
- 접속 후 Authorize 칸에  JWT Access Token, CSRF Token을 기입해야 함


## 설치 및 실행 가이드
~~~
Node.js 설치
npm 설치
mongoDB 설치 및 실행
Redis 설치 및 실행
~~~
~~~
.env 설정
PORT=
MONGO_URI=
REDIS_HOST=
REDIS_PORT=
REDIS_USER=
REDIS_PSWD=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
COOKIE_SECRET=
NODE_ENV=
~~~
~~~
$ npm install
$ npm start
~~~
## 백그라운드 실행(현재)
~~~
$ nohup node ./bin/www > app.log 2>&1 &
~~~

## Jcloud 접속시
~~~
$ tmux attach
~~~


## MVCS 패턴 적용
### 1. Model
-   **역할**:
    - 데이터베이스와 직접 소통하며, 데이터의 구조와 상태를 정의
    - 실제 데이터를 표현하기 위한 스키마를 정의
    ```
    Job.js
    Company.js
    User.js
    Application.js
    Bookmark.js
    Token.js
    LoginHistory.js
    Notification.js
    ```
### 2. View
- **역할**:
    - 사용자에게 데이터를 보여주는 UI레이어
    - API 기반 벡엔드에선 json응답이 뷰의 역할을 대신
    - 프론트에선 HTML/CSS/JS 파일이 뷰 역할

### 3. Controller
- **역할**:
    - 사용자의 request를 받아 필요한 데이터를 Model에서 가져오고 View로 전달
    - 비즈니스 로직은 처리하지 않으며, **요청/흐름**만 관리
    ```
    application.controller.js
    auth.controller.js
    bookmark.controller.js
    job.controller.js
    notification.controller.js
    ```
### 4. Service
- **역할**:
    - 비즈니스 로직과 데이터의 처리 세부 사항을 캡슐화
    - 복잡한 데이터 처리나 여러 Model을 사용하는 작업을 수행
    - Controller가 Service를 호출하고, Service는 Model과 소통
    ```
    application.service.js
    auth.service.js
    bookmark.service.js
    job.service.js
    notification.service.js
    ```
## MVCS의 흐름
요청(Request) 흐름:
```
User -> Controller -> Service -> Model
```
응답(Response) 흐름:
```
User <- View <- Controller <- Service <- Model
```


## 인증 및 보안 구현

- 인증 미들웨어: middlewares/authenticateToken.js
  - Access Token 발급 및 검증 : 
  - JWT 기반 인증: <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white">
  - Refresh Token 구현
  - 토큰 갱신 메커니즘 (필수)
- 토큰 블랙리스트 관리 : utils/tokenBlacklist.js
<!-- 권한 검사 미들웨어 -->
- 입력 데이터 및 파라미터 검증: middlewares/validators.js
- Rate Limiting: [express-rate-limit (50 회/분)](https://express-rate-limit.mintlify.app/overview)
- XSS 방지: [xss-clean](https://www.npmjs.com/package/xss-clean)
- CSRF 보호: [csurf](https://github.com/expressjs/csurf)
- 암호화 처리: [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

아래는 요청하신 API 문서를 마크다운 형식으로 정리한 내용입니다:



## REST API 엔드포인트 목록

**Base URL**: `http://113.198.66.75:10042/api/`

### CSRF
- CSRF 토큰 요청: `GET /csrf-token`


### **Admin (관리자 API)**
- 지원자 조회: `GET /admin/applications`
- 지원서 수락/거절: `PUT /admin/applications/{id}`
- 공고 수정: `PUT /admin/jobs/{id}`
- 공고 삭제: `DELETE /admin/jobs/{id}`

### **Applications (지원 API)**
- 지원: `POST /applications`
- 지원 목록 조회: `GET /applications`
- 지원 취소: `DELETE /applications/{id}`

### **Auth (회원 관리 API)**
- 회원 가입: `POST /auth/register`
- 사용자 로그인: `POST /auth/login`
- 토큰 갱신: `POST /auth/refresh`
- 유저 정보 조회: `GET /auth/profile`
- 사용자 업데이트: `PUT /auth/profile`
- 회원 탈퇴: `DELETE /auth/delete`
- 로그아웃: `POST /auth/logout`

### **Bookmarks (북마크 관리 API)**
- 북마크 추가/제거: `POST /bookmarks`
- 북마크 목록 조회: `GET /bookmarks`

### **Debug (디버깅용 API)**
- Application collection 조회: `GET /debug/application`
- Bookmark collection 조회: `GET /debug/bookmark`
- Company collection 조회: `GET /debug/company`
- Job collection 조회: `GET /debug/job`
- LoginHistory collection 조회: `GET /debug/loginHistory`
- Token collection 조회: `GET /debug/token`
- accessToken 검증: `POST /debug/token`
- User collection 조회: `GET /debug/user`
- Notification collection 조회: `GET /debug/notification`

### **Jobs (채용공고 API)**
- 채용공고 목록 조회: `GET /jobs`
- 채용공고 상세 조회: `GET /jobs/{id}`

### **Notifications (알림 관리 API)**
- 알림 생성: `POST /notifications/create`
- 수신 목록 조회: `GET /notifications`
- 알림을 읽음으로 표시: `PATCH /notifications/{id}/read`
- 알림 삭제: `DELETE /notifications/{id}`


## d. 인증 및 보안 구현
- [x] JWT 기반 인증 ✅ 2024-12-07
	- [x] Access Token 발급 및 검증 (필수) ✅ 2024-12-04
	- [x] Refresh Token 구현 (가산점) ✅ 2024-12-04
	- [x] 토큰 갱신 메커니즘 (필수) ✅ 2024-12-07
	- [x] 토큰 블랙리스트 관리 (Optional) ✅ 2024-12-07
- [x] 보안 미들웨어 구현 ✅ 2024-12-07
	- [x] 인증 미들웨어 ✅ 2024-12-07
	- [x] 권한 검사 미들웨어 ✅ 2024-12-07
	- [x] 입력 데이터 및 파라미터 검증 ✅ 2024-12-04
	- [x] Rate Limiting (Optional) ✅ 2024-12-04
- [ ] 보안 강화 (Optional)
	- [x] XSS 방지 ✅ 2024-12-04
	- [x] CSRF 보호 ✅ 2024-12-04
	- [x] SQL Injection 방지 ✅ 2024-12-08
	- [x] 암호화 처리 ✅ 2024-12-04
- [ ] 고급 API 기능 구현
	- [x] 정렬 기능 ✅ 2024-12-05
	- [ ] 데이터 집계 API
- [ ] API 최적화 (Optional)
	- [ ] 응답 데이터 캐싱
	- [ ] N+1 문제 해결
	- [ ] 벌크 연산 처리
	- [ ] 부분 응답 처리
- [ ] API 테스트 (Optional)
	- [ ] 단위 테스트 작성
	- [x] 통합 테스트 작성 ✅ 2024-12-08
	- [ ] 엣지 케이스 테스트
	- [ ] 테스트 커버리지 측정

## f. 에러 처리 및 로깅
- [x] 에러 처리 구현 ✅ 2024-12-07
	- [x] 글로벌 에러 핸들러 (미들웨어 등) ✅ 2024-12-03
	- [x] 커스텀 에러 클래스 (인증 및 데이터 포맷 에러 필수 구현) ✅ 2024-12-03
	- [x] HTTP 상태 코드 매핑 ✅ 2024-12-03
	- [x] 에러 응답 포맷 통일 ✅ 2024-12-03
- [ ] 로깅 시스템 구축 (가산점)
	- [x] 요청/응답 로깅 ✅ 2024-12-03
	- [x] 에러 로깅 ✅ 2024-12-03
	- [ ] 성능 모니터링
	- [ ] 로그 레벨 관리
- [ ] 모니터링 시스템 (Optional)
	- [ ] 성능 메트릭 수집
	- [ ] 알림 시스템 구축
	- [ ] 로그 분석 도구 연동
	- [ ] 대시보드 구성



