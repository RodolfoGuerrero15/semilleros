document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Se presiono el boton")

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log(response);
            if (response.ok) {
                window.location.href = '/main.html'; // Redirigir a la página principal
            } else {
                errorMessage.textContent = 'Usuario o contraseña incorrectos';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});