

/**
 * Generic trailing debounce utility.
 * Returns a debounced version of the callback that delays invocation
 * until `delayMs` milliseconds after the last call.
 *
 * Also exposes `.flush()` to fire immediately and `.cancel()` to abort.
 */

export interface DebouncedFunction<T extends (...args: never[]) => void> {
    (...args: Parameters<T>): void;
    /** Fire the pending invocation immediately (no-op if nothing pending). */
    flush: () => void;
    /** Cancel the pending invocation. */
    cancel: () => void;
}

export function debounce<T extends (...args: never[]) => void>(
    fn: T,
    delayMs: number,
): DebouncedFunction<T> {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let latestArgs: Parameters<T> | null = null;

    const debounced = ((...args: Parameters<T>): void => {
        latestArgs = args;
        if (timerId !== null) clearTimeout(timerId);
        timerId = setTimeout(() => {
            timerId = null;
            if (latestArgs) {
                fn(...latestArgs);
                latestArgs = null;
            }
        }, delayMs);
    }) as DebouncedFunction<T>;

    debounced.flush = (): void => {
        if (timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
        }
        if (latestArgs) {
            fn(...latestArgs);
            latestArgs = null;
        }
    };

    debounced.cancel = (): void => {
        if (timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
        }
        latestArgs = null;
    };

    return debounced;
}



