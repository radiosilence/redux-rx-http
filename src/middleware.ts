import { RxAPIConfig, RxAPIRequestAction, Action } from './interfaces'
import { API_REQUEST, API_REQUEST_CONFIGURED } from './actions'

const configured = (config: RxAPIConfig, action: RxAPIRequestAction): RxAPIRequestAction => ({
    ...action,
    type: API_REQUEST_CONFIGURED,
    apiRequest: {
        ...action.apiRequest,
        url: `${config.baseUrl}${action.apiRequest.url}`,
        headers: {
            ...config.headers,
            ...action.apiRequest.headers,
        },
    },
})

export const createRxAPIMiddleware = (config: RxAPIConfig) =>
    (store: any) => (next: (a: Action) => any) =>
        (action: RxAPIRequestAction) => action.type === API_REQUEST
            ? configured(config, action)
            : next(action)
