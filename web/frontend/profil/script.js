document.addEventListener('DOMContentLoaded', async () => {
    const btnLoginToRegister = document.getElementById('btnLoginToRegister');
    const btnRegisterToLogin = document.getElementById('btnRegisterToLogin');
    const login = document.getElementById('login');
    const register = document.getElementById('register');
    const loginRight = document.getElementById('loginRight');
    const registerLeft = document.getElementById('registerLeft');
    const errorRegister = document.getElementById('errorRegister');
    const errorLogin = document.getElementById('errorLogin');
    const btnMail = document.getElementById('btnMail');

    const formRegister = document.getElementById('formRegister');
    const formLogin = document.getElementById('formLogin');

    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    if (sessionData.loggedIn) {
        window.location.href = '/';
        return;
    }
    
    if (window.innerWidth > 1300) {
        btnLoginToRegister.addEventListener('click', () => {
            login.classList.add('invisible');
            register.classList.remove('invisible');
        });
        
        btnRegisterToLogin.addEventListener('click', () => {
            register.classList.add('invisible');
            login.classList.remove('invisible');
        });
    } else {
        register.classList.remove('invisible');
        loginRight.classList.add('invisible');
        registerLeft.classList.add('invisible');
    }
    
    btnMail.addEventListener('click', async () => {
        const response = await fetch("https://localhost:8443/backend/views/sendMail.php", {
            method: 'GET'
        });

        if (response.ok) {
            try {
                const result = await response.json();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Error in the fetch sendMail");
        }
    });
    
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
        
        console.log(data);
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