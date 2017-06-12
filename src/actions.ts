export const RX_HTTP_REQUEST = '@@rx-http/_REQUEST'
export const RX_HTTP_REQUEST_INTERNAL = '@@rx-http/REQUEST'
export const RX_HTTP_SUCCESS = '@@rx-http/SUCCESS'
export const RX_HTTP_ERROR = '@@rx-http/ERROR'

import {
    RxHttpRequest,
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
                          request?: RxHttpRequestBase,
                          args?: {},
                          key?: string): RxHttpRequestAction =>
    rxHttp(
        {
            ...request,
            url: path,
            method: 'GET',
        },
        actionTypes,
        args,
        key,
    )

export const rxHttpPost = (path: string,
                           actionTypes: RxHttpActionTypes,
                           request?: RxHttpRequestBase,
                           args?: {},
                           key?: string): RxHttpRequestAction =>
    rxHttp(
        {
            ...request,
            url: path,
            method: 'POST',
        },
        actionTypes,
        args,
        key,
    )

export const rxHttpPatch = (path: string,
                            actionTypes: RxHttpActionTypes,
                            request?: RxHttpRequestBase,
                            args?: {},
                            key?: string): RxHttpRequestAction =>
    rxHttp(
        {
            ...request,
            url: path,
            method: 'PATCH',
        },
        actionTypes,
        args,
        key,
    )

export const rxHttpPut = (path: string,
                          actionTypes: RxHttpActionTypes,
                          request?: RxHttpRequestBase,
                          args?: {},
                          key?: string): RxHttpRequestAction =>
    rxHttp(
        {
            ...request,
            url: path,
            method: 'PUT',
        },
        actionTypes,
        args,
        key,
    )

export const rxHttpDelete = (path: string,
                             actionTypes: RxHttpActionTypes,
                             request?: RxHttpRequestBase,
                             args?: {},
                             key?: string): RxHttpRequestAction =>
    rxHttp(
        {
            ...request,
            url: path,
            method: 'DELETE',
        },
        actionTypes,
        args,
        key,
    )

export const rxHttpHead = (path: string,
                           actionTypes: RxHttpActionTypes,
                           request?: RxHttpRequestBase,
                           args?: {},
                           key?: string): RxHttpRequestAction =>
    rxHttp(
        {
            ...request,
            url: path,
            method: 'HEAD',
        },
        actionTypes,
        args,
        key,
    )
