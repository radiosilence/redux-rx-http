import { RxApiActionTypes } from './interfaces'

export const createRxApiActionTypes = (base: string): RxApiActionTypes => ({
    ERROR: `${base}_ERROR`,
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    CANCEL: `${base}_CANCEL`,
})
