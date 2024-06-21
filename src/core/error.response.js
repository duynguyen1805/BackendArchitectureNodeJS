"use strict";

// const { StatusCodes, ReasonPhrases } = require("../core/httpStatusCode");

// class ErrorResponse extends Error {
//   constructor(message, status) {
//     super(message);
//     this.status = status;
//   }
// }

// class ConflictRequestError extends ErrorResponse {
//   constructor(
//     message = ReasonPhrases.CONFLICT,
//     statusCode = StatusCodes.CONFLICT
//   ) {
//     super(message, statusCode);
//   }
// }

// class BadRequestError extends ErrorResponse {
//   constructor(
//     message = ReasonPhrases.FORBIDDEN,
//     statusCode = StatusCodes.FORBIDDEN
//   ) {
//     super(message, statusCode);
//   }
// }

// module.exports = {
//   ConflictRequestError,
//   BadRequestError,
// };

const { StatusCodes, ReasonPhrases } = require("../core/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class MultipleChoices extends ErrorResponse {
  constructor(
    message = ReasonPhrases.MULTIPLE_CHOICES,
    status = StatusCodes.MULTIPLE_CHOICES
  ) {
    super(message, status);
  }
}

class MovedPermanently extends ErrorResponse {
  constructor(
    message = ReasonPhrases.MOVED_PERMANENTLY,
    status = StatusCodes.MOVED_PERMANENTLY
  ) {
    super(message, status);
  }
}

class MovedTemporarily extends ErrorResponse {
  constructor(
    message = ReasonPhrases.MOVED_TEMPORARILY,
    status = StatusCodes.MOVED_TEMPORARILY
  ) {
    super(message, status);
  }
}

class SeeOther extends ErrorResponse {
  constructor(
    message = ReasonPhrases.SEE_OTHER,
    status = StatusCodes.SEE_OTHER
  ) {
    super(message, status);
  }
}

class NotModified extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_MODIFIED,
    status = StatusCodes.NOT_MODIFIED
  ) {
    super(message, status);
  }
}

class UseProxy extends ErrorResponse {
  constructor(
    message = ReasonPhrases.USE_PROXY,
    status = StatusCodes.USE_PROXY
  ) {
    super(message, status);
  }
}

class TemporaryRedirect extends ErrorResponse {
  constructor(
    message = ReasonPhrases.TEMPORARY_REDIRECT,
    status = StatusCodes.TEMPORARY_REDIRECT
  ) {
    super(message, status);
  }
}

class PermanentRedirect extends ErrorResponse {
  constructor(
    message = ReasonPhrases.PERMANENT_REDIRECT,
    status = StatusCodes.PERMANENT_REDIRECT
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    status = StatusCodes.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class PaymentRequiredError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.PAYMENT_REQUIRED,
    status = StatusCodes.PAYMENT_REQUIRED
  ) {
    super(message, status);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    status = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}

class MethodNotAllowedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.METHOD_NOT_ALLOWED,
    status = StatusCodes.METHOD_NOT_ALLOWED
  ) {
    super(message, status);
  }
}

class NotAcceptableError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_ACCEPTABLE,
    status = StatusCodes.NOT_ACCEPTABLE
  ) {
    super(message, status);
  }
}

class ProxyAuthenticationRequiredError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.PROXY_AUTHENTICATION_REQUIRED,
    status = StatusCodes.PROXY_AUTHENTICATION_REQUIRED
  ) {
    super(message, status);
  }
}

class RequestTimeoutError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.REQUEST_TIMEOUT,
    status = StatusCodes.REQUEST_TIMEOUT
  ) {
    super(message, status);
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status);
  }
}

class GoneError extends ErrorResponse {
  constructor(message = ReasonPhrases.GONE, status = StatusCodes.GONE) {
    super(message, status);
  }
}

class LengthRequiredError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.LENGTH_REQUIRED,
    status = StatusCodes.LENGTH_REQUIRED
  ) {
    super(message, status);
  }
}

class PreconditionFailedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.PRECONDITION_FAILED,
    status = StatusCodes.PRECONDITION_FAILED
  ) {
    super(message, status);
  }
}

class RequestTooLongError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.REQUEST_TOO_LONG,
    status = StatusCodes.REQUEST_TOO_LONG
  ) {
    super(message, status);
  }
}

class RequestUriTooLongError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.REQUEST_URI_TOO_LONG,
    status = StatusCodes.REQUEST_URI_TOO_LONG
  ) {
    super(message, status);
  }
}

class UnsupportedMediaTypeError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNSUPPORTED_MEDIA_TYPE,
    status = StatusCodes.UNSUPPORTED_MEDIA_TYPE
  ) {
    super(message, status);
  }
}

class RequestedRangeNotSatisfiableError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.REQUESTED_RANGE_NOT_SATISFIABLE,
    status = StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE
  ) {
    super(message, status);
  }
}

class ExpectationFailedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.EXPECTATION_FAILED,
    status = StatusCodes.EXPECTATION_FAILED
  ) {
    super(message, status);
  }
}

class ImATeapotError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.IM_A_TEAPOT,
    status = StatusCodes.IM_A_TEAPOT
  ) {
    super(message, status);
  }
}

class InsufficientSpaceOnResourceError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INSUFFICIENT_SPACE_ON_RESOURCE,
    status = StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE
  ) {
    super(message, status);
  }
}

class MethodFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.METHOD_FAILURE,
    status = StatusCodes.METHOD_FAILURE
  ) {
    super(message, status);
  }
}

class MisdirectedRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.MISDIRECTED_REQUEST,
    status = StatusCodes.MISDIRECTED_REQUEST
  ) {
    super(message, status);
  }
}

class UnprocessableEntityError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNPROCESSABLE_ENTITY,
    status = StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    super(message, status);
  }
}

class LockedError extends ErrorResponse {
  constructor(message = ReasonPhrases.LOCKED, status = StatusCodes.LOCKED) {
    super(message, status);
  }
}

class FailedDependencyError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FAILED_DEPENDENCY,
    status = StatusCodes.FAILED_DEPENDENCY
  ) {
    super(message, status);
  }
}

class PreconditionRequiredError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.PRECONDITION_REQUIRED,
    status = StatusCodes.PRECONDITION_REQUIRED
  ) {
    super(message, status);
  }
}

class TooManyRequestsError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.TOO_MANY_REQUESTS,
    status = StatusCodes.TOO_MANY_REQUESTS
  ) {
    super(message, status);
  }
}

class RequestHeaderFieldsTooLargeError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.REQUEST_HEADER_FIELDS_TOO_LARGE,
    status = StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
  ) {
    super(message, status);
  }
}

class UnavailableForLegalReasonsError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAVAILABLE_FOR_LEGAL_REASONS,
    status = StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS
  ) {
    super(message, status);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    status = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}

class NotImplementedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_IMPLEMENTED,
    status = StatusCodes.NOT_IMPLEMENTED
  ) {
    super(message, status);
  }
}

class BadGatewayError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_GATEWAY,
    status = StatusCodes.BAD_GATEWAY
  ) {
    super(message, status);
  }
}

class ServiceUnavailableError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.SERVICE_UNAVAILABLE,
    status = StatusCodes.SERVICE_UNAVAILABLE
  ) {
    super(message, status);
  }
}

class GatewayTimeoutError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.GATEWAY_TIMEOUT,
    status = StatusCodes.GATEWAY_TIMEOUT
  ) {
    super(message, status);
  }
}

class HttpVersionNotSupportedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.HTTP_VERSION_NOT_SUPPORTED,
    status = StatusCodes.HTTP_VERSION_NOT_SUPPORTED
  ) {
    super(message, status);
  }
}

class InsufficientStorageError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INSUFFICIENT_STORAGE,
    status = StatusCodes.INSUFFICIENT_STORAGE
  ) {
    super(message, status);
  }
}

class NetworkAuthenticationRequiredError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NETWORK_AUTHENTICATION_REQUIRED,
    status = StatusCodes.NETWORK_AUTHENTICATION_REQUIRED
  ) {
    super(message, status);
  }
}

class RedisErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    status = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}

// -------------------------------------------------------------

// class SuccessResponse {
//   constructor(message, status) {
//     this.message = message;
//     this.status = status;
//   }
// }

// class Continue extends SuccessResponse {
//   constructor(message = ReasonPhrases.CONTINUE, status = StatusCodes.CONTINUE) {
//     super(message, status);
//   }
// }

// class SwitchingProtocols extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.SWITCHING_PROTOCOLS,
//     status = StatusCodes.SWITCHING_PROTOCOLS
//   ) {
//     super(message, status);
//   }
// }

// class Processing extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.PROCESSING,
//     status = StatusCodes.PROCESSING
//   ) {
//     super(message, status);
//   }
// }

// class OK extends SuccessResponse {
//   constructor(message = ReasonPhrases.OK, status = StatusCodes.OK) {
//     super(message, status);
//   }
// }

// class Created extends SuccessResponse {
//   constructor(message = ReasonPhrases.CREATED, status = StatusCodes.CREATED) {
//     super(message, status);
//   }
// }

// class Accepted extends SuccessResponse {
//   constructor(message = ReasonPhrases.ACCEPTED, status = StatusCodes.ACCEPTED) {
//     super(message, status);
//   }
// }

// class NonAuthoritativeInformation extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
//     status = StatusCodes.NON_AUTHORITATIVE_INFORMATION
//   ) {
//     super(message, status);
//   }
// }

// class NoContent extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.NO_CONTENT,
//     status = StatusCodes.NO_CONTENT
//   ) {
//     super(message, status);
//   }
// }

// class ResetContent extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.RESET_CONTENT,
//     status = StatusCodes.RESET_CONTENT
//   ) {
//     super(message, status);
//   }
// }

// class PartialContent extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.PARTIAL_CONTENT,
//     status = StatusCodes.PARTIAL_CONTENT
//   ) {
//     super(message, status);
//   }
// }

// class MultiStatus extends SuccessResponse {
//   constructor(
//     message = ReasonPhrases.MULTI_STATUS,
//     status = StatusCodes.MULTI_STATUS
//   ) {
//     super(message, status);
//   }
// }

module.exports = {
  // SuccessResponse,
  ErrorResponse,
  // Continue,
  // SwitchingProtocols,
  // Processing,
  // OK,
  // Created,
  // Accepted,
  // NonAuthoritativeInformation,
  // NoContent,
  // ResetContent,
  // PartialContent,
  // MultiStatus,
  MultipleChoices,
  MovedPermanently,
  MovedTemporarily,
  SeeOther,
  NotModified,
  UseProxy,
  TemporaryRedirect,
  PermanentRedirect,
  BadRequestError,
  UnauthorizedError,
  PaymentRequiredError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  NotAcceptableError,
  ProxyAuthenticationRequiredError,
  RequestTimeoutError,
  ConflictError,
  GoneError,
  LengthRequiredError,
  PreconditionFailedError,
  RequestTooLongError,
  RequestUriTooLongError,
  UnsupportedMediaTypeError,
  RequestedRangeNotSatisfiableError,
  ExpectationFailedError,
  ImATeapotError,
  InsufficientSpaceOnResourceError,
  MethodFailureError,
  MisdirectedRequestError,
  UnprocessableEntityError,
  LockedError,
  FailedDependencyError,
  PreconditionRequiredError,
  TooManyRequestsError,
  RequestHeaderFieldsTooLargeError,
  UnavailableForLegalReasonsError,
  InternalServerError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
  HttpVersionNotSupportedError,
  InsufficientStorageError,
  NetworkAuthenticationRequiredError,
  RedisErrorResponse,
};
