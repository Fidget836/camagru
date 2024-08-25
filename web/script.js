document.addEventListener('DOMContentLoaded', async () => {
    const btnProfil = document.getElementById('btnProfil');
    const btnLogout = document.getElementById('btnLogout');
    const btnPost = document.getElementById('btnPost');

    btnProfil.addEventListener('click', () => {
        window.location.href = "/profil";
    });

    btnPost.addEventListener('click', () => {
        window.location.href = "/post";
    });

    // Check login status
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    console.log(sessionData);

    if (sessionData.loggedIn) {
        btnProfil.style.display = 'none';
        btnLogout.style.display = 'block';
        btnPost.style.display = 'block';
        // document.getElementById('status').innerText = ` Connected !`;
    } else {
        btnLogout.style.display = 'none';
        btnPost.style.display = 'none';
        // document.getElementById('status').innerText = `Not Connected !`;
    }

    document.getElementById('btnLogout').addEventListener('click', async () => {
        const response = await fetch('https://localhost:8443/backend/views/logout.php');
        const data = await response.json();
        if (data.status === 'success') {
            window.location.reload(); // Refresh the page to reflect the changes
        }
    });

});