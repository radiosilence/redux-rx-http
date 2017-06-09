import { AjaxResponse } from 'rxjs'

export interface RxAPIConfig {
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

export interface RxAPIRequestActionTypes {
    REQUEST: symbol | string
    SUCCESS: symbol | string
    ERROR: symbol | string
    CANCEL: symbol | string
}

export interface HTTPMethods {
    GET: 'GET'
    POST: 'POST'
    PUT: 'PUT'
    DELETE: 'DELETE'
    PATCH: 'PATCH'
    OPTIONS: 'OPTIONS'
    HEAD: 'HEAD'
}

export interface QueryParams {
    [key: string]: any
}

export type HTTPMethod = keyof HTTPMethods

export interface RxAPIRequestAction extends Action {
    type: '@@redux-rx-api/API_REQUEST' | '@@redux-rx-api/API_REQUEST_CONFIGURED'
    actionTypes: RxAPIRequestActionTypes
    apiRequest: RxAPIRequest
    key?: string
    args?: {}
}

export interface RxAPIRequest {
    method: HTTPMethod
    url: string
    params?: QueryParams
    body?: object
    headers?: object
}

export interface RxAPIResponse extends Action {
    result: object
    args?: object
}

export interface RxAPIResponseAction extends Action {
    actionTypes: RxAPIRequestActionTypes
    response: AjaxResponse
    key?: string
    error?: object
    args?: object
}
