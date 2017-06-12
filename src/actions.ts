export const RX_HTTP_REQUEST = '@@rx-http/_REQUEST'
export const RX_HTTP_REQUEST_INTERNAL = '@@rx-http/REQUEST'
export const RX_HTTP_SUCCESS = '@@rx-http/SUCCESS'
export const RX_HTTP_ERROR = '@@rx-http/ERROR'

import {
    RxHttpRequest,
    RxHttpRequestConfig,
    RxHttpRequestBase,
    RxHttpRequestAction,
    RxHttpActionTypes,
} from './interfaces'

export const rxHttp = (request: RxHttpRequest,
                       actionTypes: RxHttpActionTypes,
                       args?: {},
                       key?: string): RxHttpRequestAction => ({
    type: RX_HTTP_REQUEST,
    actionTypes,
    key,
    request,
    args,
})

export const rxHttpGet = (path: string,
                          actionTypes: RxHttpActionTypes,
                          config: RxHttpRequestConfig): RxHttpRequestAction =>
    rxHttp(
        {
            ...config.request,
            url: path,
            method: 'GET',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpPost = (path: string,
                           actionTypes: RxHttpActionTypes,
                           config: RxHttpRequestConfig): RxHttpRequestAction =>
    rxHttp(
        {
            ...config.request,
            url: path,
            method: 'POST',
        },
        actionTypes,
        config.args,
        config.key,
    )


export const rxHttpPut = (path: string,
                          actionTypes: RxHttpActionTypes,
                          config: RxHttpRequestConfig): RxHttpRequestAction =>
    rxHttp(
        {
            ...config.request,
            url: path,
            method: 'PUT',
        },
        actionTypes,
        config.args,
        config.key,
    )


export const rxHttpPatch = (path: string,
                            actionTypes: RxHttpActionTypes,
                            config: RxHttpRequestConfig): RxHttpRequestAction =>
    rxHttp(
        {
            ...config.request,
            url: path,
            method: 'PATCH',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpDelete = (path: string,
                             actionTypes: RxHttpActionTypes,
                             config: RxHttpRequestConfig): RxHttpRequestAction =>
    rxHttp(
        {
            ...config.request,
            url: path,
            method: 'DELETE',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpHead = (path: string,
                           actionTypes: RxHttpActionTypes,
                           config: RxHttpRequestConfig): RxHttpRequestAction =>
    rxHttp(
        {
            ...config.request,
            url: path,
            method: 'HEAD',
        },
        actionTypes,
        config.args,
        config.key,
    )
