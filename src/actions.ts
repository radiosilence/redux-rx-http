import { RX_HTTP_REQUEST, RX_HTTP_SUCCESS, RX_HTTP_ERROR, RX_HTTP_FINALLY } from './constants'

import {
  RxHttpActionTypes,
  RxHttpResponse,
  RxHttpRequest,
  RxHttpRequestAction,
  RxHttpRequestBase,
  RxHttpRequestConfig,
  RxHttpQueryParams,
  RxHttpError,
  RxHttpArgs,
  RxHttpGlobalActionType,
  RxHttpRequestGlobalActionType,
  RxHttpRequestActionConfigured,
  RxHttpGlobalErrorAction,
  RxHttpErrorAction,
  RxHttpSuccessAction,
  RxHttpGlobalSuccessAction,
  RxHttpFinallyAction,
  RxHttpGlobalFinallyAction,
} from './interfaces'

const DEFAULT_GLOBAL_ACTIONS: RxHttpGlobalActionType[] = [
  RX_HTTP_REQUEST,
  RX_HTTP_SUCCESS,
  RX_HTTP_ERROR,
  RX_HTTP_FINALLY,
]

export const rxHttpRequest = (
  request: RxHttpRequest,
  actionTypes: RxHttpActionTypes,
  args?: {},
  key?: string,
): RxHttpRequestAction => ({
  type: RX_HTTP_REQUEST as RxHttpRequestGlobalActionType,
  actionTypes,
  key,
  request,
  args,
})

export const rxHttpRequestConfigured = (
  config: RxHttpRequestBase,
  action: RxHttpRequestAction,
): RxHttpRequestActionConfigured => ({
  ...action,
  type: RX_HTTP_REQUEST as RxHttpRequestGlobalActionType,
  request: {
    json: true,
    actions: DEFAULT_GLOBAL_ACTIONS,
    ...config,
    ...action.request,
    url: `${action.request.baseUrl || config.baseUrl}${action.request.url}`,
    headers: action.request.headers || {
      ...config.headers,
      ...action.request.extraHeaders,
    },
  },
})

export const rxHttpGet = (
  path: string,
  actionTypes: RxHttpActionTypes,
  query?: RxHttpQueryParams | null,
  config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
  rxHttpRequest(
    {
      ...config.request,
      url: path,
      method: 'GET',
      query,
    },
    actionTypes,
    config.args,
    config.key,
  )

export const rxHttpPost = <T>(
  path: string,
  actionTypes: RxHttpActionTypes,
  body?: T,
  config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
  rxHttpRequest(
    {
      ...config.request,
      url: path,
      method: 'POST',
      body,
    },
    actionTypes,
    config.args,
    config.key,
  )

export const rxHttpPut = <T>(
  path: string,
  actionTypes: RxHttpActionTypes,
  body?: T,
  config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
  rxHttpRequest(
    {
      ...config.request,
      url: path,
      method: 'PUT',
      body,
    },
    actionTypes,
    config.args,
    config.key,
  )

export const rxHttpPatch = <T>(
  path: string,
  actionTypes: RxHttpActionTypes,
  body?: T,
  config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
  rxHttpRequest(
    {
      ...config.request,
      url: path,
      method: 'PATCH',
      body,
    },
    actionTypes,
    config.args,
    config.key,
  )

export const rxHttpDelete = (
  path: string,
  actionTypes: RxHttpActionTypes,
  config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
  rxHttpRequest(
    {
      ...config.request,
      url: path,
      method: 'DELETE',
    },
    actionTypes,
    config.args,
    config.key,
  )

export const rxHttpHead = (
  path: string,
  actionTypes: RxHttpActionTypes,
  config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
  rxHttpRequest(
    {
      ...config.request,
      url: path,
      method: 'HEAD',
    },
    actionTypes,
    config.args,
    config.key,
  )

export const rxHttpStartRequest = ({ actionTypes, args }: RxHttpRequestAction) => ({
  type: actionTypes.REQUEST,
  args,
})

export const rxHttpSuccess = (
  { data, response }: RxHttpResponse,
  key: string | undefined,
  args: RxHttpArgs,
  actionTypes: RxHttpActionTypes,
): RxHttpSuccessAction => ({
  type: actionTypes.SUCCESS,
  result: key ? data[key] : data,
  response,
  args,
})

export const rxHttpGlobalSuccess = (
  response: RxHttpResponse,
  key: string | undefined,
  args: RxHttpArgs,
  actionTypes: RxHttpActionTypes,
): RxHttpGlobalSuccessAction => ({
  type: RX_HTTP_SUCCESS,
  response,
  key,
  args,
  actionTypes,
})

export const rxHttpError = (
  error: RxHttpError,
  args: RxHttpArgs,
  actionTypes: RxHttpActionTypes,
): RxHttpErrorAction => ({
  type: actionTypes.ERROR,
  error: error.body,
  response: error.response,
  args,
})

export const rxHttpGlobalError = (
  error: RxHttpError,
  args: object | undefined,
  actionTypes: RxHttpActionTypes,
): RxHttpGlobalErrorAction => ({
  type: RX_HTTP_ERROR,
  args,
  error,
  actionTypes,
})

export const rxHttpFinally = (args: RxHttpArgs, actionTypes: RxHttpActionTypes): RxHttpFinallyAction => ({
  type: actionTypes.FINALLY,
  args,
  actionTypes,
})

export const rxHttpGlobalFinally = (args: RxHttpArgs, actionTypes: RxHttpActionTypes): RxHttpGlobalFinallyAction => ({
  type: RX_HTTP_FINALLY,
  args,
  actionTypes,
})
