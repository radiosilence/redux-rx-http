import { Dispatch } from 'redux'
import { RxApiConfig, RxApiRequestAction, Action } from './interfaces'
import { RX_API_REQUEST, RX_API_REQUEST_CONFIGURED } from './actions'

const configured = (config: RxApiConfig, action: RxApiRequestAction): RxApiRequestAction => ({
    ...action,
    type: RX_API_REQUEST_CONFIGURED,
    apiRequest: {
        ...action.apiRequest,
        url: `${config.baseUrl}${action.apiRequest.url}`,
        headers: {
            ...config.headers,
            ...action.apiRequest.headers,
        },
    },
})

export const createRxApiMiddleware = (config: RxApiConfig) =>
    (store: any) => (next: any) => (action: any) => action.type === RX_API_REQUEST
        ? next(configured(config, action))
        : next(action)
