import axios from 'axios';

function csrfToken(): string {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='));

    return match ? decodeURIComponent(match.split('=')[1]) : '';
}

export const http = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

http.interceptors.request.use((config) => {
    config.headers['X-XSRF-TOKEN'] = csrfToken();

    return config;
});

export default http;
