/* istanbul ignore file */
export type Headers = Record<string, string>;

declare const ONLINE_TEST_MODE: boolean;

const ServerAddress: string = IsInToolsMode()
    ? `https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-dxtin/endpoint` // 本地测试（工具模式的服务器地址）
    : ONLINE_TEST_MODE
    ? `http://` // 在线测试（在线测试服的地址）
    : 'http://'; // 正式服的服务器地址

export const ServerAuthKey: string = IsInToolsMode()
    ? 'Invalid_NotDedicatedServer' // 本地测试的秘钥
    : ONLINE_TEST_MODE
    ? GetDedicatedServerKeyV3('server') // 在线测试（在线测试服的秘钥）
    : GetDedicatedServerKeyV3('server'); // 正式服的服务器秘钥

// 无需加signature验证的请求，写在这个地方的请求发到服务器后，服务器不需要验证signature
export const NoSignatureURLs: string[] = ['/api/v1/game/statistic/saveStatisticData'];

export type OpenAPIConfig = {
    NETWORK_ACTIVITY_TIMEOUT: number;
    ABSOLUTE_TIMEOUT: number;
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string;
    USERNAME?: string;
    PASSWORD?: string;
    HEADERS?: Headers;
    ENCODE_PATH?: (path: string) => string;
    AUTHKEY: string;
};

export const OpenAPI: OpenAPIConfig = {
    NETWORK_ACTIVITY_TIMEOUT: 3000,
    ABSOLUTE_TIMEOUT: 3000,
    BASE: ServerAddress,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: {
        'Content-Type': 'application/json',
        "apiKey":"HIZH7rzmt2JBpVNIqY9jyJ87t7yytJT1UWxcWM4znErbAGXjtRlDoddiqamvASYz",
        "Accept":"application/json"
    },
    ENCODE_PATH: undefined,
    AUTHKEY: ServerAuthKey,
};
