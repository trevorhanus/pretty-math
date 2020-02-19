export interface DerivativeRequestBody {
    operation: 'derivative';
    expr: string;
    variables: string[];
    wrt: string[];
}

export interface DerivativeResponse {
    resultAsLatex: string;
    resultAsPython: string;
}

export type DoDerivativeCallback = (err: any, res?: DerivativeResponse) => void;

export async function doDerivative(body: DerivativeRequestBody, cb: DoDerivativeCallback) {
    try {
        const URL = process.env.SYMSERVER_ENDPOINT;

        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        cb(null, await res.json());
    } catch (e) {
        cb(e);
    }
}

export interface IntegralRequestBody {
    operation: 'integral';
    expr: string;
    wrt: string;
    leftBound: string;
    rightBound: string;
    variables: string[];
}

export interface IntegralResponse {
    resultAsLatex: string;
    resultAsPython: string;
}

export type DoIntegralCallback = (err: any, res?: IntegralResponse) => void;

export async function doIntegral(body: IntegralRequestBody, cb: DoIntegralCallback) {
    try {
        const URL = process.env.SYMSERVER_ENDPOINT;

        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        cb(null, await res.json());
    } catch (e) {
        cb(e);
    }
}
