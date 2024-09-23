document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    var sessionData = await response.json();

    const btnLogout = document.getElementById('btnLogout');
    const iptUsername = document.getElementById('iptUsername');
    const btnUsername = document.getElementById('btnUsername');
    const iptEmail = document.getElementById('iptEmail');
    const btnEmail = document.getElementById('btnEmail');
    const iptPassword = document.getElementById('iptPassword');
    const iptConfirmPassword = document.getElementById('iptConfirmPassword');
    const btnPassword = document.getElementById('btnPassword');
    const errorMessage = document.getElementById('errorMessage');
    const btnON = document.getElementById('btnON');
    const btnOFF = document.getElementById('btnOFF');


    if (!sessionData.loggedIn) {
        window.location.href = '/';
        return ;
    } else {
        const formDataSession = new FormData;
        formDataSession.append('user_id', sessionData.user_id);
        const responseSession = await fetch('https://localhost:8443/backend/views/updateSession.php', {
            body: formDataSession,
            method: "POST"
        });
        sessionData = await responseSession.json();
    }
    
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
    
    const formDataNotif = new FormData;
    formDataNotif.append('user_id', sessionData.user_id);
    const responseNotif = await fetch('https://localhost:8443/backend/views/getNotification.php', {
        body: formDataNotif,
        method: "POST"
    });
    const resultNotif = await responseNotif.json();
    if (resultNotif.message == true) {
        btnON.classList.add('active');
    } else {
        btnOFF.classList.add('active');
    }

    btnLogout.addEventListener('click', async () => {
        const response = await fetch('https://localhost:8443/backend/views/logout.php');
        const data = await response.json();
        if (data.status === 'success') {
            window.location.href = '/';
        }
    });

    btnUsername.addEventListener('click', async () => {
        const formDataUsername = new FormData;
        formDataUsername.append('user_id', sessionData.user_id);
        formDataUsername.append('username', iptUsername.value);

        const response = await fetch("https://localhost:8443/backend/views/changeUsername.php", {
            body: formDataUsername,
            method: "POST"
        });
        try {
            const result = await response.json();
            if (result.status === 'success') {
                alert("You have changed your username");
                window.location.reload();
            } else {
                errorMessage.innerHTML = '<p class="errorMessageP">' + result.message + '</p>';
                setTimeout(() => {
                    errorMessage.innerHTML = '';
                }, 3000);
            }
        } catch (error) {
        }
    });

    btnEmail.addEventListener('click', async () => {
        const formDataEmail = new FormData;
        formDataEmail.append('user_id', sessionData.user_id);
        formDataEmail.append('email', iptEmail.value);

        const response = await fetch("https://localhost:8443/backend/views/changeEmail.php", {
            body: formDataEmail,
            method: "POST"
        });
        try {
            const result = await response.json();
            if (result.status === 'success') {
                alert("You have changed your email");
                window.location.reload();
            } else {
                errorMessage.innerHTML = '<p class="errorMessageP">' + result.message + '</p>';
                setTimeout(() => {
                    errorMessage.innerHTML = '';
                }, 3000);
            }
        } catch (error) {
        }
    });

    btnPassword.addEventListener('click', async (event) => {
        event.preventDefault();

        const formDataPassword = new FormData;
        formDataPassword.append('user_id', sessionData.user_id);
        formDataPassword.append('password', iptPassword.value);
        formDataPassword.append('confirmPassword', iptConfirmPassword.value);

        const response = await fetch("https://localhost:8443/backend/views/changePassword.php", {
            body: formDataPassword,
            method: "POST"
        });
        try {
            const result = await response.json();
            if (result.status === 'success') {
                alert("You have changed your password");
                window.location.reload();
            } else {
                errorMessage.innerHTML = '<p class="errorMessageP">' + result.message + '</p>';
                setTimeout(() => {
                    errorMessage.innerHTML = '';
                }, 3000);
            }
        } catch (error) {
        }
    });

    btnON.addEventListener('click', async () => {
        const formDatabtnON = new FormData;
        formDatabtnON.append('user_id', sessionData.user_id);

        const response = await fetch("https://localhost:8443/backend/views/notificationON.php", {
            body: formDatabtnON,
            method: "POST"
        });
        try {
            const result = await response.json();
            if (result.status === 'success') {
                alert("You have active your notification");
                window.location.reload();
            } else {
                errorMessage.innerHTML = '<p class="errorMessageP">' + result.message + '</p>';
                setTimeout(() => {
                    errorMessage.innerHTML = '';
                }, 3000);
            }
        } catch (error) {
        }

    });


    btnOFF.addEventListener('click', async () => {
        const formDatabtnOFF = new FormData;
        formDatabtnOFF.append('user_id', sessionData.user_id);

        const response = await fetch("https://localhost:8443/backend/views/notificationOFF.php", {
            body: formDatabtnOFF,
            method: "POST"
        });
        try {
            const result = await response.json();
            if (result.status === 'success') {
                alert("You have desactive your notification");
                window.location.reload();
            } else {
                errorMessage.innerHTML = '<p class="errorMessageP">' + result.message + '</p>';
                setTimeout(() => {
                    errorMessage.innerHTML = '';
                }, 3000);
            }
        } catch (error) {
        }

    });
});