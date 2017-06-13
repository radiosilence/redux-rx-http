import { AjaxResponse } from 'rxjs'

export interface RxHttpConfig {
    headers?: object
    baseUrl?: string
}

export interface RxHttpSuccess {
    type: '@@rx-http/SUCCESS'
    response: any
    key?: string
    args?: any
}

export interface RxHttpError {
    type: '@@rx-http/ERROR'
    error: Error | string
    args?: object
}

export interface RxHttpFinally {
    type: '@@rx-http/FINALLY'
}

export interface RxHttpActionTypes {
    REQUEST: symbol | string
    SUCCESS: symbol | string
    ERROR: symbol | string
    CANCEL: symbol | string
    FINALLY: symbol | string
}

export interface QueryParams {
    [key: string]: any
}

export interface RxHttpRequestAction {
    type: '@@rx-http/REQUEST' | '@@rx-http/_REQUEST'
    actionTypes: RxHttpActionTypes
    request: RxHttpRequest
    key?: string
    args?: {}
}

export interface RxHttpRequestConfig {
    request?: RxHttpRequestBase
    args?: {}
    key?: string
}

export interface RxHttpRequestBase {
    params ?: QueryParams
    body ?: object
    headers ?: object
}

export interface RxHttpRequest extends RxHttpRequestBase {
    url: string
    method: string,
}
