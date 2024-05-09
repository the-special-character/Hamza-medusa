export function readRequestBody(body: any, fieldNames: string[]): any {
    const output = {};
    for (const name in fieldNames) {
        output[name] = body[name];
    }
    return output;
}
