/**
 * A function to simulate a delay.
 * 
 * @param {int} delay in milliseconds
 * @returns a promise that resolves when the timeout expires.
 */
export default function sleep(delay=1000) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, delay);
    });
}