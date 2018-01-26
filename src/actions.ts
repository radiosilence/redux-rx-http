import {
    RxHttpActionTypes,
    RxHttpGlobalErrorAction,
    RxHttpFetchResponse,
    RxHttpRequest,
    RxHttpRequestAction,
    RxHttpRequestBase,
    RxHttpRequestConfig,
    RxHttpGlobalSuccessAction,
    RxHttpQueryParams,
    RxHttpRequestActionConfigured,
    RxHttpErrorAction,
    RxHttpSuccessAction,
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
    = ({ data, response }: RxHttpFetchResponse,
       key: string | undefined,
       args: object | undefined,
       actionTypes: RxHttpActionTypes): RxHttpSuccessAction => ({
        type: actionTypes.SUCCESS,
            result: key ? data[key] : data,
        response,
        args,
    })

export const rxHttpRequestConfigured
    = (config: RxHttpRequestBase,
       action: RxHttpRequestAction): RxHttpRequestActionConfigured => ({
    ...action,
    type: RX_HTTP_REQUEST,
    request: {
        json: true,
        ...config,
        ...action.request,
        url: `${action.request.baseUrl || config.baseUrl}${action.request.url}`,
        headers: action.request.headers || {
            ...config.headers,
            ...action.request.extraHeaders,
        },
    },
})

export const rxHttpGlobalSuccess
    = (response: RxHttpFetchResponse,
       key: string | undefined,
       args: object | undefined): RxHttpGlobalSuccessAction => ({
        type: RX_HTTP_SUCCESS,
        response,
        key,
        args,
    })

export const rxHttpError
    = (error: any, args: object | undefined,
       actionTypes: RxHttpActionTypes): RxHttpErrorAction => ({
        type: actionTypes.ERROR,
        error: error.body,
        response: error.response,
        args,
    })

export const rxHttpGlobalError
    = (error: any, args: object | undefined): RxHttpGlobalErrorAction => ({
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
