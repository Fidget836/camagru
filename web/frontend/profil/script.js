document.addEventListener('DOMContentLoaded', () => {
    const btnLoginToRegister = document.getElementById('btnLoginToRegister');
    const btnRegisterToLogin = document.getElementById('btnRegisterToLogin');
    const login = document.getElementById('login');
    const register = document.getElementById('register');
    const errorRegister = document.getElementById('errorRegister');

    /***** Form Register*****/
    const formRegister = document.getElementById('formRegister');
    const formLogin = document.getElementById('formLogin');

    btnLoginToRegister.addEventListener('click', () => {
        login.classList.add('invisible');
        register.classList.remove('invisible');
    });

    btnRegisterToLogin.addEventListener('click', () => {
        register.classList.add('invisible');
        login.classList.remove('invisible');
    });

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
            }, 4000);
        } else {
            window.location.href = '/';
        }

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

            console.log('RENTRE DANS LOGIN\n');
            
            console.log(data);
            
        });
    });

    /***** Form Login*****/
    // const formLogin = document.getElementById('formLogin');

    // formLogin.addEventListener('submit' async (event) => {
        
    // });

});