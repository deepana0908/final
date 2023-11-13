/**
 * A custom hook to parse the query string on the URL.
 */
export default function useQuery() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams;
}