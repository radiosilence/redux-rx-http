import { AjaxResponse } from 'rxjs'

export interface APIConfig {
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

export interface APIRequestActionTypes {
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

export interface APIRequestAction extends Action {
    type: '@@redux-rx-api/API_REQUEST' | '@@redux-rx-api/API_REQUEST_CONFIGURED'
    actionTypes: APIRequestActionTypes
    apiRequest: APIRequest
    key?: string
    args?: {}
}

export interface APIRequest {
    method: HTTPMethod
    url: string
    params?: QueryParams
    body?: object
    headers?: object
}

export interface APIResponse extends Action {
    result: object
    args?: object
}

export interface APIResponseAction extends Action {
    actionTypes: APIRequestActionTypes
    response: AjaxResponse
    key?: string
    error?: object
    args?: object
}
