import {
    RxHttpActionTypes,
    RxHttpConfig,
    RxHttpErrorAction,
    RxHttpFetchResponse,
    RxHttpRequest,
    RxHttpRequestAction,
    RxHttpRequestBase,
    RxHttpRequestConfig,
    RxHttpSuccessAction,
    RxHttpQueryParams,
} from './interfaces'

export const RX_HTTP_REQUEST = '@@rx-http/REQUEST'
export const RX_HTTP_SUCCESS = '@@rx-http/SUCCESS'
export const RX_HTTP_ERROR = '@@rx-http/ERROR'
export const RX_HTTP_FINALLY = '@@rx-http/FINALLY'

export const rxHttpRequest
    = (request: RxHttpRequest,
       actionTypes: RxHttpActionTypes,
       args?: {},
       key?: string): RxHttpRequestAction => ({
    type: RX_HTTP_REQUEST,
    actionTypes,
    key,
    request,
    args,
})

export const rxHttpGet
    = (path: string,
       actionTypes: RxHttpActionTypes,
       query?: RxHttpQueryParams | null,
       config: RxHttpRequestConfig = {}): RxHttpRequestAction =>
    rxHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'GET',
            query,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpPost
    = <T>(path: string,
          actionTypes: RxHttpActionTypes,
          body?: T,
          config: RxHttpRequestConfig = {}): RxHttpRequestAction =>
    rxHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'POST',
            body,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpPut
    = <T>(path: string,
          actionTypes: RxHttpActionTypes,
          body?: T,
          config: RxHttpRequestConfig = {}): RxHttpRequestAction =>
    rxHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'PUT',
            body,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpPatch
    = <T>(path: string,
          actionTypes: RxHttpActionTypes,
          body?: T,
          config: RxHttpRequestConfig = {}): RxHttpRequestAction =>
    rxHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'PATCH',
            body,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpDelete
    = (path: string,
       actionTypes: RxHttpActionTypes,
       config: RxHttpRequestConfig = {}): RxHttpRequestAction =>
    rxHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'DELETE',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpHead
    = (path: string,
       actionTypes: RxHttpActionTypes,
       config: RxHttpRequestConfig = {}): RxHttpRequestAction =>
    rxHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'HEAD',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const rxHttpSuccess
    = ({ data }: RxHttpFetchResponse,
       key: string | undefined,
       args: object | undefined,
       actionTypes: RxHttpActionTypes) => ({
        type: actionTypes.SUCCESS,
        result: key ? data[key] : data,
        args,
    })

export const rxHttpRequestConfigured
    = (config: RxHttpConfig,
       action: RxHttpRequestAction): RxHttpRequestAction => ({
    ...action,
    type: RX_HTTP_REQUEST,
    request: {
        ...config,
        ...action.request,
        url: `${action.request.baseUrl || config.baseUrl}${action.request.url}`,
        headers: {
            ...config.headers,
            ...action.request.headers,
        },
    },
})

export const rxHttpGlobalSuccess
    = (response: RxHttpFetchResponse,
       key: string | undefined,
       args: object | undefined): RxHttpSuccessAction => ({
        type: RX_HTTP_SUCCESS,
        response,
        key,
        args,
    })

export const rxHttpError
    = (error: any, args: object | undefined,
       actionTypes: RxHttpActionTypes) => ({
        type: actionTypes.ERROR,
        payload: error,
        error: error.error,
        args,
    })

export const rxHttpGlobalError
    = (error: any, args: object | undefined): RxHttpErrorAction => ({
    type: RX_HTTP_ERROR,
    args,
    error,
})

export const rxHttpFinally
    = (args: any, actionTypes: RxHttpActionTypes) => ({
    type: actionTypes.FINALLY,
    args,
})

export const rxHttpGlobalFinally
    = (args: any) => ({
    type: RX_HTTP_FINALLY,
    args,
})
