import { parseEnvString } from '../jslibs/parseEnvString'
export const storageFolder = parseEnvString('GRAFITTI_STORAGE', 'storage')
