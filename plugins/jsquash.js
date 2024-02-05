import resize from'@jsquash/resize'
import { encode,decode } from '@jsquash/avif'

export default defineNuxtPlugin(() => {
    return {
        provide:{
            resize:resize,
            encode:encode,
            decode:decode,

        }
    }
})