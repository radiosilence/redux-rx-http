import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mapTo'

import { ActionsObservable, combineEpics } from 'redux-observable'
import { Observable, AjaxResponse } from 'rxjs'

import {
    Action,
    RxApiRequestAction,
    RxApiActionTypes,
    RxApiRequest,
    RxApiResponse,
    RxApiResponseAction,
} from './interfaces'

import { RX_API_REQUEST_CONFIGURED, RX_API_SUCCESS, RX_API_ERROR } from './actions'

const apiRequest = (action$: any, action: RxApiRequestAction) => {
    const {
        apiRequest: {
            url,
            method,
            params,
            body,
            headers,
        },
        actionTypes,
        key,
        args,
    } = action

    return ajax({
        url,
        headers,
        method: (method as string),
        body,
    })
        .mergeMap((response: AjaxResponse) => [
            apiGlobalSuccess(response, key, args),
            apiSuccess(response, key, args, actionTypes),
        ])
        .takeUntil(action$.ofType(actionTypes.CANCEL))
        .catch((error: any) => [
            apiGlobalError(error, args),
            apiError(error, args, actionTypes),
        ])
}

const apiSuccess = ({ response }: AjaxResponse,
                    key: string | undefined,
                    args: object | undefined,
                    actionTypes: RxApiActionTypes) => ({
        type: actionTypes.SUCCESS,
        result: key ? response[key] : response,
        args,
    })

const apiGlobalSuccess = ({ response }: AjaxResponse,
                          key: string | undefined,
                          args: object | undefined) => ({
        type: RX_API_SUCCESS,
        key,
        response,
        args,
    })

const apiError = (error: any, args: object | undefined,
                  actionTypes: RxApiActionTypes) => ({
        type: actionTypes.ERROR,
        payload: error.xhr.response,
        error: true,
        args,
    })

const apiGlobalError = (error: any, args: object | undefined) => ({
    type: RX_API_ERROR,
    args,
    error,
})

const apiRequestEpic = (action$: ActionsObservable<RxApiRequestAction>) =>
    action$.ofType(RX_API_REQUEST_CONFIGURED)
        .mergeMap(action => apiRequest(action$, action))

const startRequestEpic = (action$: ActionsObservable<RxApiRequestAction>):
    Observable<Action> =>
    action$.ofType(RX_API_REQUEST_CONFIGURED)
        .map(({ actionTypes }: RxApiRequestAction) => ({ type: actionTypes.REQUEST }))

export const rxApiEpic = combineEpics(
    apiRequestEpic,
    startRequestEpic,
)
