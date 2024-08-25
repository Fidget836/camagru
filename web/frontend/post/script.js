document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    if (!sessionData.loggedIn) {
        window.location.href = '/';
        return;
    }


});