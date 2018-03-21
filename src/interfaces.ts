import { AjaxResponse } from 'rxjs'
import {
    RX_HTTP_SUCCESS,
    RX_HTTP_ERROR,
    RX_HTTP_FINALLY,
    RX_HTTP_REQUEST,
} from './actions'

export type RxHttpRequestMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate'

export type RxHttpRequestCache =
    | 'default'
    | 'no-cache'
    | 'no-store'
    | 'reload'
    | 'force-cache'

export interface HeadersPayload {
    [key: string]: string
}
export type RxHttpConfigFactory<T> = (state: T | null) => RxHttpRequestBase

export type RxHttpArgs = object | undefined

export interface RxHttpStartRequestAction {
    type: string
    args: RxHttpArgs
}
export interface RxHttpGlobalSuccessAction {
    type: typeof RX_HTTP_SUCCESS
    response: RxHttpResponse
    key?: string
    args: RxHttpArgs
}

export interface RxHttpError {
    response: Response
    body: string | object
}

export interface RxHttpSuccessAction<T = any> {
    type: string
    result: T
    response: Response
    args: RxHttpArgs
}

export interface RxHttpErrorAction {
    type: string
    error: string | object
    response: Response
    args?: RxHttpArgs
}

export interface RxHttpGlobalErrorAction {
    type: typeof RX_HTTP_ERROR
    error: RxHttpError
    args?: RxHttpArgs
}

export interface RxHttpFinallyAction {
    type: typeof RX_HTTP_FINALLY
}

export interface RxHttpRequestAction {
    type: typeof RX_HTTP_REQUEST
    actionTypes: RxHttpActionTypes
    request: RxHttpRequest
    key?: string
    args?: RxHttpArgs
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
    [key: string]: string
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
}

export interface RxHttpRequest extends RxHttpRequestBase {
    url: string
    method: string
    json?: boolean
}

export interface RxHttpRequestConfigured extends RxHttpRequest {
    json: boolean
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

export type Fetch = (
    input: RequestInfo,
    init?: RequestInit,
) => Promise<Response>
export interface RxHttpDependencies {
    fetch: Fetch
}
