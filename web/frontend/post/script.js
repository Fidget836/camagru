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
        return;
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

    captureButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        context.drawImage(sticker, 50, 340, sticker.width, sticker.height);




        // Conversion de l'image en data URL (base64)
        // const dataUrl = canvas.toDataURL('image/png');

        // Affichage de l'image capturée dans un nouvel élément HTML (ou vous pouvez l'envoyer au serveur)
                // photo.src = dataUrl;
                // const img = document.createElement('img');
                // img.src = dataUrl;
                // document.body.appendChild(img);

        // Envoyer l'image capturée au serveur via fetch
        /*
        fetch('/backend/savePhoto.php', {
            method: 'POST',
            body: JSON.stringify({ image: dataUrl }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
        */
    });

});