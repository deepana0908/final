const BASE_URL = 'http://localhost:5000';

export default async function request(url, options) {
    try {
        const resp = await fetch(BASE_URL + url, options);

        if (resp.ok) {
            const body = await resp.json();

            console.log(body);
            
            if (body.status == 'error') {
                throw new Error(body.data);
            }

            return body.data;
        } else {
            console.log("Error in HTTP:\n" + resp.json());
            throw new Error("Connection error. Try again later.");
        }
    } catch (error) {
        throw error;
    }
}