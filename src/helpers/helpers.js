/**
 * Returns time-friendly string format in (MM:SS) given the number of seconds.
 * @param {Number} seconds - integer time in seconds
 */
export function getTimeStr(seconds) {
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