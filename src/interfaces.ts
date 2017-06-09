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

export interface RxApiActionTypes {
    REQUEST: symbol | string
    SUCCESS: symbol | string
    ERROR: symbol | string
    CANCEL: symbol | string
}

export interface QueryParams {
    [key: string]: any
}

export interface RxApiRequestAction extends Action {
    actionTypes: RxApiActionTypes
    apiRequest: RxApiRequest
    key?: string
    args?: {}
}

export interface RxApiRequest {
    method: string
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
    actionTypes: RxApiActionTypes
    response: AjaxResponse
    key?: string
    error?: object
    args?: object
}
