import { RxHttpActionTypes } from './interfaces'

export const createRxHttpActionTypes = (base: string): RxHttpActionTypes => ({
    ERROR: `${base}_ERROR`,
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    CANCEL: `${base}_CANCEL`,
    FINALLY: `${base}_FINALLY`,
})
