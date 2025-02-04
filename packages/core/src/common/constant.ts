/**
 * 事件类型
 */
export enum EVENTTYPES {
  ERROR = 'error',
  CONSOLEERROR = 'consoleError',
  UNHANDLEDREJECTION = 'unhandledrejection',
  CLICK = 'click',
  LOAD = 'load',
  BEFOREUNLOAD = 'beforeunload',
  FETCH = 'fetch',
  XHROPEN = 'xhr-open',
  XHRSEND = 'xhr-send',
  HASHCHANGE = 'hashchange',
  HISTORYPUSHSTATE = 'history-pushState',
  HISTORYREPLACESTATE = 'history-replaceState',
  POPSTATE = 'popstate',
  ONLINE = 'online',
  OFFLINE = 'offline'
}

/**
 * 接口错误状态
 */
export enum SpanStatus {
  Ok = 'ok',
  DeadlineExceeded = 'deadline_exceeded',
  Unauthenticated = 'unauthenticated',
  PermissionDenied = 'permission_denied',
  NotFound = 'not_found',
  ResourceExhausted = 'resource_exhausted',
  InvalidArgument = 'invalid_argument',
  Unimplemented = 'unimplemented',
  Unavailable = 'unavailable',
  InternalError = 'internal_error',
  UnknownError = 'unknown_error',
  Cancelled = 'cancelled',
  AlreadyExists = 'already_exists',
  FailedPrecondition = 'failed_precondition',
  Aborted = 'aborted',
  OutOfRange = 'out_of_range',
  DataLoss = 'data_loss'
}

/**
 * 用户行为
 */
export enum BREADCRUMBTYPES {
  HTTP = 'Http',
  CLICK = 'Click',
  RESOURCE = 'Resource_Error',
  CODEERROR = 'Code_Error',
  ROUTE = 'Route',
  CUSTOM = 'Custom'
}

/**
 * 状态
 */
export enum STATUS_CODE {
  ERROR = 'error',
  OK = 'ok'
}

export enum HTTPTYPE {
  XHR = 'xhr',
  FETCH = 'fetch'
}

export enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401
}

export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}
