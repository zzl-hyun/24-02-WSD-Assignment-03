module.exports = {
    // MISSING_FIELDS: 클라이언트에서 필수 필드가 누락된 경우 발생.
    // UNAUTHORIZED_ACCESS: 사용자가 인증되지 않은 경우 발생.
    // FORBIDDEN_ACTION: 인증은 되었으나 특정 작업에 대한 권한이 없는 경우.
    // RESOURCE_CONFLICT: 리소스가 중복되는 경우.
    // VALIDATION_ERROR: 입력 데이터가 유효성 검사를 통과하지 못한 경우.
    // NOT_IMPLEMENTED: 해당 기능이 아직 구현되지 않은 경우.
    // BAD_GATEWAY: 서버 간 통신 에러.
    // SERVICE_UNAVAILABLE: 서버 과부하 또는 유지보수 상태.
    // REQUEST_TIMEOUT: 요청 시간이 초과된 경우.
    ALREADY_APPLIED: { code: 'ALREADY_APPLIED', message: 'You have already applied for this job.', status: 400},
    ALREADY_REGISTERED: { code: 'ALREADY_REGISTERED', message: 'Email is already registered.', status: 400 },
    ALREADY_PROCESSED: { code: 'ALREADY_PROCESSED', message: '이미 처리된 작업입니다.', status: 409},
    BAD_GATEWAY: { code: 'BAD_GATEWAY', message: 'Invalid response received from the upstream server.', status: 502 },
    COMPANY_NOT_FOUND: { code: 'COMPANY_NOT_FOUND', message: 'Company not found', status: 404},
    EXPIRED_TOKEN: { code: "EXPIRED_TOKEN", message: 'Token has expired.', status: 403},
    FORBIDDEN_ACTION: { code: 'FORBIDDEN_ACTION', message: 'You do not have permission to perform this action.', status: 403 },
    INCORRECT_OLD_PASSWORD: { code : 'INCORRECT_OLD_PASSWORD', message: 'The old password you provided is incorrect.', status: 400},
    INCORRECT_PASSWORD: { code : 'INCORRECT_PASSWORD', message: 'The password you provided is incorrect.', status: 400},
    INVALID_ACCESS_TOKEN: { code: 'INVALID_ACCESS_TOKEN', message: 'Invalid token.', status: 403},
    INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.', status: 401 },
    INVALID_REFRESH_TOKEN: { code: 'INVALID_REFRESH_TOKEN', message: 'The provided refresh token is invalid.', status: 401},
    INVALID_TOKEN_FORMAT: { code: 'INVALID_TOKEN_FORMAT', message: 'Invalid token format.', status: 401},
    JOB_NOT_FOUND: { code: 'JOB_NOT_FOUND', message: 'Job not found.', status: 404 },
    MISSING_FIELDS: { code: 'MISSING_FIELDS', message: 'Required fields are missing.', status: 400 },
    MISSING_TOKEN: { code: 'MISSING_TOKEN', message: 'Access Denied. Missing or invalid Authorization header.', status: 401},
    NOT_FOUND: { code: 'NOT_FOUND', message: 'Not found.', status: 404 },
    NOT_IMPLEMENTED: { code: 'NOT_IMPLEMENTED', message: 'This functionality is not yet implemented.', status: 501 },
    REQUEST_TIMEOUT: { code: 'REQUEST_TIMEOUT', message: 'The request took too long to process.', status: 408 },
    RESOURCE_CONFLICT: { code: 'RESOURCE_CONFLICT', message: 'The resource already exists.', status: 409 },
    RESUME_REQUIRED: { code: 'RESUME_REQUIRED', message: 'Required resume', status: 400},
    SERVER_ERROR: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.', status: 500 },
    SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', message: 'The service is temporarily unavailable.', status: 503 },
    TOKEN_NOT_FOUND: { code: 'TOKEN_NOT_FOUND', message: 'Token not found', status: 404},
    TOKEN_BLACKLISTED: { code: 'TOKEN_BLACKLISTED', message: 'Access token is invalid', status: 403},
    UNAUTHORIZED_ACCESS: { code: 'UNAUTHORIZED_ACCESS', message: 'Access denied. Please log in.', status: 401 },
    USER_NOT_FOUND: { code: 'USER_NOT_FOUND', message: 'User not found.', status: 404 },
    VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 422 },
};
