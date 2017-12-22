/**
 * Returns time-friendly string format in (MM:SS) given the number of seconds.
 * @param {Number} seconds - integer time in seconds
 */
export function getTimeStr(seconds) {
    if (seconds === null) return 'N/A';
    let res = '';

    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    if (minutes < 10) { res += '0' + minutes.toFixed(); }
    else { res += minutes.toFixed(); }

    res += ':';

    if (seconds < 10) { res += '0' + seconds.toFixed(); }
    else { res += seconds.toFixed(); }

    return res;
}

/**
 * Returns a copy of all inline styles merged into one inline-style object based on properties.
 * @param {Object[]} args - list of inline-style objects
 */
export function styleMerge(...args) {
    return Object.assign({}, ...args);
}