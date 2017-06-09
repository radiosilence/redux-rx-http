import { AjaxResponse } from 'rxjs'

export interface RxHttpConfig {
    headers?: object
    baseUrl?: string
}

export interface Action {
    type: symbol | string
}

export interface Success<T> extends Action {
    result: T
}

export interface Error extends Action {
    error: Error | string
}

export interface Alert extends Action {
    message: string
}

export interface RxHttpActionTypes {
    REQUEST: symbol | string
    SUCCESS: symbol | string
    ERROR: symbol | string
    CANCEL: symbol | string
}

export interface QueryParams {
    [key: string]: any
}

export interface RxHttpRequestAction extends Action {
    actionTypes: RxHttpActionTypes
    request: RxHttpRequest
    key?: string
    args?: {}
}

export interface RxHttpRequest {
    method: string
    url: string
    params?: QueryParams
    body?: object
    headers?: object
}

export interface RxHttpResponse extends Action {
    result: object
    args?: object
}

export interface RxHttpResponseAction extends Action {
    actionTypes: RxHttpActionTypes
    response: AjaxResponse
    key?: string
    error?: object
    args?: object
}
