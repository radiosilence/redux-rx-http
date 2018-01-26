import { AjaxResponse } from 'rxjs'

export type RxHttpRequestMode = 'cors'
    | 'no-cors'
    | 'same-origin'
    | 'navigate'

export type RxHttpRequestCache = 'default'
    | 'no-cache'
    | 'no-store'
    | 'reload'
    | 'force-cache'

export interface HeadersPayload {
    [key: string]: string
}
export type RxHttpConfigFactory<T> = (state: T | null) => RxHttpRequestBase

export interface RxHttpGlobalSuccessAction {
    type: '@@rx-http/SUCCESS'
    response: any
    key?: string
    args?: any
}

export interface RxHttpError {
    response: Response
    error: any
}

export interface RxHttpSuccessAction {
    type: string
    result: any
    args: any
}

export interface RxHttpErrorAction {
    type: string,
    error: RxHttpError
    args: any
}

export interface RxHttpGlobalErrorAction {
    type: '@@rx-http/ERROR'
    error: RxHttpError
    args?: object
}

export interface RxHttpFinallyAction {
    type: '@@rx-http/FINALLY'
}

export interface RxHttpRequestAction {
    type: '@@rx-http/REQUEST' | '@@rx-http/_REQUEST'
    actionTypes: RxHttpActionTypes
    request: RxHttpRequest
    key?: string
    args?: {}
}

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

export interface RxHttpQueryParams {
    [key: string]: any
}

export interface RxHttpRequestConfig {
    request?: RxHttpRequestBase
    args?: {}
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
}

export interface RxHttpRequest extends RxHttpRequestBase {
    url: string
    method: string
    json?: boolean
}

export interface RxHttpRequestConfigured extends RxHttpRequest {
    json: boolean
}

export interface RxHttpFetchResponse {
    response: Response
    data: any
}

export interface RxHttpFetchError {
    response: Response
    status: number
    error: any
}

/* Actions */

export type RxHttpGet
    = (path: string,
       actionTypes: RxHttpActionTypes,
       query?: RxHttpQueryParams | null,
       config?: RxHttpRequestConfig) => RxHttpRequestAction

export type RxHttpPost
    = <T>(path: string,
          actionTypes: RxHttpActionTypes,
          body?: T,
          config?: RxHttpRequestConfig) => RxHttpRequestAction

export type RxHttpPut
    = <T>(path: string,
          actionTypes: RxHttpActionTypes,
          body?: T,
          config?: RxHttpRequestConfig) => RxHttpRequestAction

export type RxHttpPatch
    = <T>(path: string,
          actionTypes: RxHttpActionTypes,
          body?: T,
          config?: RxHttpRequestConfig) => RxHttpRequestAction

export type RxHttpDelete
    = (path: string,
       actionTypes: RxHttpActionTypes,
       config?: RxHttpRequestConfig) => RxHttpRequestAction

export type RxHttpHead
    = (path: string,
       actionTypes: RxHttpActionTypes,
       config?: RxHttpRequestConfig) => RxHttpRequestAction

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>
export interface RxHttpDependencies {
    fetch: Fetch
}
