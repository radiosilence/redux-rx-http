import { RxApiRequestActionTypes } from './interfaces'

export const createRxApiRequestTypes = (base: string): RxApiRequestActionTypes => ({
    ERROR: `${base}_ERROR`,
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    CANCEL: `${base}_CANCEL`,
})
