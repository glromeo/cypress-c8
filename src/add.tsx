/**
 * Calculates the sum of left and right
 *
 * @param left
 * @param right
 */
export function add(left: number | undefined, right: number | undefined): number | undefined {
    if (left === undefined) {
        return undefined;
    }
    if (right === undefined) {
        return undefined;
    }
    return left + right;
}