async function fetchWithAuth() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        console.error("Token not found, redirecting to login...");
        window.location.href = '/login.html';
        return false;
    }

    if (getTokenExpiry(authToken) <= Math.floor(Date.now() / 1000)) {
        console.log("Access token expired, attempting to refresh...");
        return await refreshAccessToken();
    }

    return true; // Токен валиден
}

function getTokenExpiry(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp;
    } catch (err) {
        console.error("Invalid token:", err);
        return 0;
    }
}

async function refreshAccessToken() {
    try {
        const response = await fetch('/api/refresh-access-token', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Failed to refresh token:', response.status);
            // Перенаправляем пользователя на страницу логина, если токен истёк
            window.location.href = '/login.html';
            return false;
        }

        const newAuthToken = response.headers.get('AuthToken');
        if (!newAuthToken) {
            console.error('Token not found in response headers');
            // Перенаправляем пользователя на страницу логина, если токен истёк
            window.location.href = '/login.html';
            return false;
        }

        localStorage.setItem('authToken', newAuthToken);
        return true;
    } catch (err) {
        console.error("Error refreshing token:", err);
        return false;
    }
}
