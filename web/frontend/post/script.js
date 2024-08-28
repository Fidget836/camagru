document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('btnCapture');
    const context = canvas.getContext('2d');
    const photo = document.getElementById('photo');

    // Doit etre en premier !! Check si la personne est bien login
    if (!sessionData.loggedIn) {
        window.location.href = '/';
        return ;
    }


    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });
    }

    const sticker = new Image();
    sticker.src = "https://localhost:8443/frontend/post/stickers/french_flag.png";

    captureButton.addEventListener('click', async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // context.drawImage(sticker, 0, 0, sticker.width, sticker.height);
    
        // Conversion de l'image en data URL (base64)
        const dataUrl = canvas.toDataURL('image/png');
    
        const formData = new FormData();
        formData.append('photo', dataUrl);
        formData.append('sticker', "french_flag.png");
    
        const response = await fetch("https://localhost:8443/backend/views/photo.php", {
            method: 'POST',
            body: formData
        });
    
        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            // Créer une nouvelle image pour afficher le résultat
            const resultImage = new Image();
            resultImage.src = imageUrl;
            
            // Ajouter l'image au document ou remplacer l'ancienne image
            document.body.appendChild(resultImage);
        } else {
            console.error('Erreur lors de la génération de l\'image:', response.statusText);
        }
    });

});