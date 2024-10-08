document.addEventListener('DOMContentLoaded', async () => {
    const login = document.getElementById('login');
    const register = document.getElementById('register');
    const loginRight = document.getElementById('loginRight');
    const registerLeft = document.getElementById('registerLeft');
    const errorRegister = document.getElementById('errorRegister');
    const errorLogin = document.getElementById('errorLogin');
    const formRegister = document.getElementById('formRegister');
    const formLogin = document.getElementById('formLogin');

    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    if (sessionData.loggedIn) {
        window.location.href = '/';
        return;
    }
    
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };

    /***** Form Register*****/
    formRegister.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(formRegister);

        const username = formData.get('usernameRegister');
        const email = formData.get('emailRegister');
        const password = formData.get('passwordRegister');
        const confirmPassword = formData.get('confirmPasswordRegister');


        const response = await fetch("https://localhost:8443/backend/views/register.php", {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.status === 'error') {
            errorRegister.innerHTML = '<p class="errorStyle">' + data.message + '</p>';
            setTimeout(() => {
                errorRegister.innerHTML = '';
            }, 3000);
        } else {
            alert("An email has been sent to verify your account !");
            window.location.href = '/';
        }

    });
    
    /***** Form Login*****/
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(formLogin);

        const username = formData.get('usernameLogin');
        const password = formData.get('passwordLogin');

        const response = await fetch ("https://localhost:8443/backend/views/login.php", {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.status === 'error') {
            errorLogin.innerHTML = '<p class="errorStyle">' + data.message + '</p>';
            setTimeout(() => {
                errorLogin.innerHTML = '';
            }, 3000);
        } else {
            window.location.href = '/';
        }
    });

});