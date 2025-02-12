document.addEventListener("DOMContentLoaded", function () {
    fetch('nav.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.innerHTML = data;
                attachLogoutHandler(); // Вызываем функцию для навешивания обработчика logout
            } else {
                console.error("Element with ID 'navbar' not found.");
            }
        })
        .catch(error => {
            console.error("Error loading navigation:", error);
        });
});

// Функция для навешивания обработчика на logout после загрузки nav.html
function attachLogoutHandler() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();

            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error("No authToken found");
                return;
            }
            fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        localStorage.removeItem('authToken');
                        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; HttpOnly;";
                        alert("Logged out successfully");
                        window.location.href = "/login.html";
                    } else {
                        console.error("Logout failed");
                    }
                })
                .catch(error => console.error("Error:", error));
        });
    } else {
        console.error("Logout link not found.");
    }
}

