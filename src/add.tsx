/**
 * Calculates the sum of left and right
 *
 * @param left
 * @param right
 */
export function addizione(left: number | null, right: number | null): number | null {
    if (left === null) {
        return null;
    }
    if (right === null) {
        return null;
    }
    return left + right;
}

// is it really that silly?

(window as any)["x"]="x";