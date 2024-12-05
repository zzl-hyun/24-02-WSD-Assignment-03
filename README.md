# 24-02-WSD-Assignment-03
### 구인구직 백엔드 서버 만들기 (사람인..?)
## 프로젝트 기본 정보
- 웹 크롤링 이해 및 적용: 사람인에서 채용 공고 데이터를 크롤링하여 수집.
- 데이터베이스 설계: 크롤링한 데이터를 SQL (MySQL) 또는 NoSQL (MongoDB)로 구조화.
- REST API 개발: 크롤링한 데이터를 기반으로 한 다양한 기능의 API 개발 및 회원 인증 기능 구현.
- 문서화 및 인증: Swagger를 이용한 API 문서화와 JWT 기반 인증 시스템 적용.
- 클라우드 배포: JCloud를 사용하여 백엔드 서버를 배포.

## 기술 스택
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" alt="dd">

<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=Express&logoColor=white">

<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">

<img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white">

<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white">

<img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black">

<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">

<img src="https://img.shields.io/badge/jcloud-ed1944?style=for-the-badge&logo=Openstack&logoColor=white">



## Swagger 접속
http://113.198.66.75:10042/api-docs

![alt text](image.png)
- 접속 후 Authorize 칸에  JWT Access Token, CSRF Token을 기입해야 함


## 설치 및 실행 가이드
~~~
npm install
npm start
~~~

## MVCS 패턴 적용
### 1. Model
-   **역할**:
    - 데이터베이스와 직접 소통하며, 데이터의 구조와 상태를 정의
    - 실제 데이터를 표현하기 위한 스키마를 정의
    ```
    User.js
    Token.js
    Job.js
    Application.js
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
    auth.controller.js
    job.controller.js
    application.controller.js
    ```
### 4. Service
- **역할**:
    - 비즈니스 로직과 데이터의 처리 세부 사항을 캡슐화
    - 복잡한 데이터 처리나 여러 Model을 사용하는 작업을 수행
    - Controller가 Service를 호출하고, Service는 Model과 소통
    ```
    auth.service.js
    job.service.js
    application.service.js
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

