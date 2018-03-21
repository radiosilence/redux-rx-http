import {
    RxHttpActionTypes,
    RxHttpGlobalErrorAction,
    RxHttpResponse,
    RxHttpRequest,
    RxHttpRequestAction,
    RxHttpRequestBase,
    RxHttpRequestConfig,
    RxHttpGlobalSuccessAction,
    RxHttpQueryParams,
    RxHttpRequestActionConfigured,
    RxHttpErrorAction,
    RxHttpSuccessAction,
    RxHttpError,
    RxHttpArgs,
    RxHttpStartRequestAction,
} from './interfaces'

export const RX_HTTP_REQUEST = '@@rx-http/REQUEST'
export const RX_HTTP_SUCCESS = '@@rx-http/SUCCESS'
export const RX_HTTP_ERROR = '@@rx-http/ERROR'
export const RX_HTTP_FINALLY = '@@rx-http/FINALLY'

export const rxHttpRequest = (
    request: RxHttpRequest,
    actionTypes: RxHttpActionTypes,
    args?: {},
    key?: string,
): RxHttpRequestAction => ({
    type: RX_HTTP_REQUEST,
    actionTypes,
    key,
    request,
    args,
})

export const rxHttpGet = (
    path: string,
    actionTypes: RxHttpActionTypes,
    query?: RxHttpQueryParams | null,
    config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
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

export const rxHttpPost = <T>(
    path: string,
    actionTypes: RxHttpActionTypes,
    body?: T,
    config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
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

export const rxHttpPut = <T>(
    path: string,
    actionTypes: RxHttpActionTypes,
    body?: T,
    config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
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

export const rxHttpPatch = <T>(
    path: string,
    actionTypes: RxHttpActionTypes,
    body?: T,
    config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
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

export const rxHttpDelete = (
    path: string,
    actionTypes: RxHttpActionTypes,
    config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
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

export const rxHttpHead = (
    path: string,
    actionTypes: RxHttpActionTypes,
    config: RxHttpRequestConfig = {},
): RxHttpRequestAction =>
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

export const rxHttpStartRequest = ({
    actionTypes,
    args,
}: RxHttpRequestAction): RxHttpStartRequestAction => ({
    type: actionTypes.REQUEST,
    args,
})

export const rxHttpSuccess = (
    { data, response }: RxHttpResponse,
    key: string | undefined,
    args: RxHttpArgs,
    actionTypes: RxHttpActionTypes,
): RxHttpSuccessAction => ({
    type: actionTypes.SUCCESS,
    result: key ? data[key] : data,
    response,
    args,
})

export const rxHttpRequestConfigured = (
    config: RxHttpRequestBase,
    action: RxHttpRequestAction,
): RxHttpRequestActionConfigured => ({
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

export const rxHttpGlobalSuccess = (
    response: RxHttpResponse,
    key: string | undefined,
    args: RxHttpArgs,
): RxHttpGlobalSuccessAction => ({
    type: RX_HTTP_SUCCESS,
    response,
    key,
    args,
})

export const rxHttpError = (
    error: RxHttpError,
    args: RxHttpArgs,
    actionTypes: RxHttpActionTypes,
): RxHttpErrorAction => ({
    type: actionTypes.ERROR,
    error: error.body,
    response: error.response,
    args,
})

export const rxHttpGlobalError = (
    error: RxHttpError,
    args: object | undefined,
): RxHttpGlobalErrorAction => ({
    type: RX_HTTP_ERROR,
    args,
    error,
})

export const rxHttpFinally = (
    args: RxHttpArgs,
    actionTypes: RxHttpActionTypes,
) => ({
    type: actionTypes.FINALLY,
    args,
})

export const rxHttpGlobalFinally = (args: RxHttpArgs) => ({
    type: RX_HTTP_FINALLY,
    args,
})
