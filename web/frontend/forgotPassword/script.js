document.addEventListener('DOMContentLoaded', () => {
    const iptUsername = document.getElementById('iptUsername');
    const iptEmail = document.getElementById('iptEmail');
    const btnSubmit = document.getElementById('btnSubmit');

    btnSubmit.addEventListener('click', async () => {
        const formDataSendMail = new FormData;
        formDataSendMail.append('username', iptUsername.value);
        formDataSendMail.append('email', iptEmail.value);
        const response = await fetch("https://localhost:8443/backend/views/sendMailPassword.php", {
            body: formDataSendMail,
            method: "POST"
        });
        try {
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    });
});