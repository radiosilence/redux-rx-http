import { Dispatch } from 'redux'
import { RxHttpConfig, RxHttpRequestAction } from './interfaces'
import { RX_HTTP_REQUEST, RX_HTTP_REQUEST_INTERNAL } from './actions'

const configured = (config: RxHttpConfig, action: RxHttpRequestAction): RxHttpRequestAction => ({
    ...action,
    type: RX_HTTP_REQUEST_INTERNAL,
    request: {
        ...action.request,
        url: `${config.baseUrl}${action.request.url}`,
        headers: {
            ...config.headers,
            ...action.request.headers,
        },
    },
})

export const createRxHttpMiddleware = (config: (store: any) => RxHttpConfig) =>
    (store: any) => (next: any) => (action: any) => action.type === RX_HTTP_REQUEST
        ? next(configured(config(store.getState()), action))
        : next(action)
