/**
 * Clears the ncore query params of the undefined values
 * @param {Object} params 
 * @returns Only the clear, processable params object
 */
export function clearParams(params: Record<string, string | undefined>): Record<string, string> {
    const result: Record<string, string> = {};
    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined) {
            result[key] = value;
        }
    });
    return result;
}
