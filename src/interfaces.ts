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

export interface RxHttpConfig {
    headers?: object
    baseUrl?: string
    mode?: RxHttpRequestMode
    cache?: RxHttpRequestCache
    json?: boolean
}

export interface RxHttpSuccessAction {
    type: '@@rx-http/SUCCESS'
    response: any
    key?: string
    args?: any
}

export interface RxHttpErrorAction {
    type: '@@rx-http/ERROR'
    error: Error | string
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

export interface RxHttpActionTypes {
    REQUEST: symbol | string
    SUCCESS: symbol | string
    ERROR: symbol | string
    CANCEL: symbol | string
    FINALLY: symbol | string
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
    body?: object
    headers?: object
    extraHeaders?: object
    mode?: RxHttpRequestMode
    cache?: RxHttpRequestCache
    json?: boolean
    baseUrl?: string
}

export interface RxHttpRequest extends RxHttpRequestBase {
    url: string
    method: string
}

export interface RxHttpFetchResponse {
    response: any
    data: any
}

export interface RxHttpFetchError {
    response: any
    status: number
    error: any
}
