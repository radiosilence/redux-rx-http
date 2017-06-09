import { AjaxResponse } from 'rxjs'

export interface RxApiConfig {
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

export interface RxApiRequestActionTypes {
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

export interface RxApiRequestAction extends Action {
    actionTypes: RxApiRequestActionTypes
    apiRequest: RxApiRequest
    key?: string
    args?: {}
}

export interface RxApiRequest {
    method: HTTPMethod
    url: string
    params?: QueryParams
    body?: object
    headers?: object
}

export interface RxApiResponse extends Action {
    result: object
    args?: object
}

export interface RxApiResponseAction extends Action {
    actionTypes: RxApiRequestActionTypes
    response: AjaxResponse
    key?: string
    error?: object
    args?: object
}
