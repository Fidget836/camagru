document.addEventListener('DOMContentLoaded', () => {
    const iptPassword = document.getElementById('iptPassword');
    const iptConfirmPassword = document.getElementById('iptConfirmPassword');
    const btnSubmit = document.getElementById('btnSubmit');
    const errorMessage = document.getElementById('errorMessage');

    btnSubmit.addEventListener('click', async (event) => {
        event.preventDefault();

        const paramUrl = window.location.search;
        const password = iptPassword.value;
        const confirmPassword = iptConfirmPassword.value;
        const token = paramUrl.split('=')[1];
        
        const formDataChangePassword = new FormData;
        formDataChangePassword.append('token', token);
        formDataChangePassword.append('password', password);
        formDataChangePassword.append('confirmPassword', confirmPassword);
        const response = await fetch("https://localhost:8443/backend/views/changePasswordDisconnect.php", {
            body: formDataChangePassword,
            method: "POST"
        });

        try {
            const result = await response.json();           
            if (result.status === 'success'){
                alert("You have changed your password");
                window.location.href = "/profil";
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