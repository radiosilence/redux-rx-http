import { RX_HTTP_REQUEST, RX_HTTP_SUCCESS, RX_HTTP_ERROR, RX_HTTP_FINALLY } from './constants'

export type RxHttpSuccessGlobalActionType = typeof RX_HTTP_SUCCESS
export type RxHttpErrorGlobalActionType = typeof RX_HTTP_ERROR
export type RxHttpRequestGlobalActionType = typeof RX_HTTP_REQUEST
export type RxHttpFinallyGlobalActionType = typeof RX_HTTP_FINALLY

export type RxHttpRequestMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate'

export type RxHttpRequestCache = 'default' | 'no-cache' | 'no-store' | 'reload' | 'force-cache'

export interface Dictionary<T> {
  [key: string]: T
}

export type HeadersPayload = Dictionary<string>

export type RxHttpConfigFactory<T> = (state?: T | void) => RxHttpRequestBase

export type RxHttpArgs<T = any> = Dictionary<T> | undefined

export interface RxHttpStartRequestAction {
  type: string
  args: RxHttpArgs
}
export interface RxHttpGlobalSuccessAction {
  type: RxHttpSuccessGlobalActionType
  response: RxHttpResponse
  key?: string
  args: RxHttpArgs
  actionTypes: RxHttpActionTypes
}

export interface RxHttpError {
  response: Response
  body: string | Dictionary<any>
}

export interface RxHttpSuccessAction<T = any> {
  type: string
  result: T
  response: Response
  args: RxHttpArgs
}

export interface RxHttpErrorAction {
  type: string
  error: string | Dictionary<any>
  response: Response
  args?: RxHttpArgs
}

export interface RxHttpGlobalErrorAction {
  type: RxHttpErrorGlobalActionType
  error: RxHttpError
  args?: RxHttpArgs
  actionTypes: RxHttpActionTypes
}

export interface RxHttpFinallyAction {
  type: string
  args: RxHttpArgs
  actionTypes: RxHttpActionTypes
}

export interface RxHttpGlobalFinallyAction {
  type: RxHttpFinallyGlobalActionType
  args: RxHttpArgs
  actionTypes: RxHttpActionTypes
}

export interface RxHttpRequestAction {
  type: RxHttpRequestGlobalActionType
  actionTypes: RxHttpActionTypes
  request: RxHttpRequest
  key?: string
  args?: RxHttpArgs
}

export type RxHttpGlobalActionType =
  | RxHttpSuccessGlobalActionType
  | RxHttpErrorGlobalActionType
  | RxHttpRequestGlobalActionType
  | RxHttpFinallyGlobalActionType

export interface RxHttpRequestActionConfigured extends RxHttpRequestAction {
  request: RxHttpRequestConfigured
}

export interface RxHttpActionTypes {
  REQUEST: string
  SUCCESS: string
  ERROR: string
  CANCEL: string
  FINALLY: string
}

export type QueryStringable = string | number | boolean | object | undefined | null

export interface RxHttpQueryParams {
  [key: string]: QueryStringable | QueryStringable[]
}

export interface RxHttpRequestConfig {
  request?: RxHttpRequestBase
  args?: RxHttpArgs
  key?: string
}

export interface RxHttpRequestBase {
  query?: RxHttpQueryParams | null
  body?: any
  headers?: HeadersPayload
  extraHeaders?: HeadersPayload
  mode?: RxHttpRequestMode
  cache?: RxHttpRequestCache
  baseUrl?: string
  json?: boolean
  actions?: RxHttpGlobalActionType[]
}

export interface RxHttpRequest extends RxHttpRequestBase {
  url: string
  method: string
  json?: boolean
}

export interface RxHttpRequestConfigured extends RxHttpRequest {
  json: boolean
  actions: RxHttpGlobalActionType[]
}

export interface RxHttpResponse {
  response: Response
  data: any
}

export type RxHttpAction =
  | { type: string; args: RxHttpArgs }
  | RxHttpGlobalErrorAction
  | RxHttpErrorAction
  | RxHttpRequestAction

/* Actions */
export type RxHttpGet = (
  path: string,
  actionTypes: RxHttpActionTypes,
  query?: RxHttpQueryParams | null,
  config?: RxHttpRequestConfig,
) => RxHttpRequestAction

export type RxHttpPost = <T>(
  path: string,
  actionTypes: RxHttpActionTypes,
  body?: T,
  config?: RxHttpRequestConfig,
) => RxHttpRequestAction

export type RxHttpPut = <T>(
  path: string,
  actionTypes: RxHttpActionTypes,
  body?: T,
  config?: RxHttpRequestConfig,
) => RxHttpRequestAction

export type RxHttpPatch = <T>(
  path: string,
  actionTypes: RxHttpActionTypes,
  body?: T,
  config?: RxHttpRequestConfig,
) => RxHttpRequestAction

export type RxHttpDelete = (
  path: string,
  actionTypes: RxHttpActionTypes,
  config?: RxHttpRequestConfig,
) => RxHttpRequestAction

export type RxHttpHead = (
  path: string,
  actionTypes: RxHttpActionTypes,
  config?: RxHttpRequestConfig,
) => RxHttpRequestAction

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>
export interface RxHttpDependencies {
  fetch: Fetch
}
