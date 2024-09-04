document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.getElementById('btnCapture');
    const radios = document.querySelectorAll('input[name="stickerChoice"]');   
    const pictureDiv = document.getElementById('picturesDiv'); 
    const webcamDiv = document.getElementById('webcam'); 
    const validPictureDiv = document.querySelector('.validPicture'); 
    const pictureValidDiv = document.querySelector('.pictureValid');
    const btnHome = document.getElementById('btnHome');
    const btnAnotherPicture = document.getElementById('btnAnotherPicture');
    const uploadImageInput = document.getElementById('uploadImage');
    const uploadCanvas = document.getElementById('uploadCanvas');
    const uploadContext = uploadCanvas.getContext('2d');
    const btnUploadCapture = document.getElementById('btnUploadCapture');

    // Doit être en premier !! Check si la personne est bien login
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

    // Fonction pour charger les images précédentes
    const formDataList = new FormData();
    formDataList.append('id', sessionData.user_id);
    formDataList.append('nbPicture', 5);

    const listPreviousPicturesResponse = await fetch("https://localhost:8443/backend/views/getPhoto.php", {
        method: 'POST',
        body: formDataList
    });

    // Afficher les images précédentes
    if (listPreviousPicturesResponse.ok) {
        listPreviousPictures = await listPreviousPicturesResponse.json();
        
        // Effacer les anciennes images si nécessaire
        pictureDiv.innerHTML = ''; 

        for (let i = 0; i < 5; i++) {
            if (listPreviousPictures.result[i] === undefined) break;
            const element = listPreviousPictures.result[i];
            
            const img = new Image();
            img.src = 'data:image/jpeg;base64,' + element;

            img.onload = () => {
                const canvasThumbnail = document.createElement('canvas');
                const contextThumbnail = canvasThumbnail.getContext('2d');

                const thumbnailWidth = 177;
                const thumbnailHeight = 100;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    height = Math.round(height * (thumbnailWidth / width));
                    width = thumbnailWidth;
                } else {
                    width = Math.round(width * (thumbnailHeight / height));
                    height = thumbnailHeight;
                }
                canvasThumbnail.width = width;
                canvasThumbnail.height = height;

                contextThumbnail.drawImage(img, 0, 0, width, height);

                const thumbnailDataUrl = canvasThumbnail.toDataURL('image/jpeg');
                const thumbnailImg = new Image();
                thumbnailImg.src = thumbnailDataUrl;
                
                pictureDiv.appendChild(thumbnailImg);
            }
        };
    } else {
        console.log("Error to recover the previous pictures !");
    }

    // Fonction pour afficher la div validPicture
    function showValidPicture() {
        const validPictureDiv = document.querySelector('.validPicture');
        validPictureDiv.classList.add('visible');
    }

    // Événement du bouton "Take the picture"
    captureButton.addEventListener('click', async () => {
        let sticker = null;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                sticker = radios[i].value;
            }
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Conversion de l'image en data URL (base64)
        const dataUrl = canvas.toDataURL('image/png');

        const formData = new FormData();
        formData.append('photo', dataUrl);
        formData.append('sticker', sticker);
        formData.append('canvaWidth', canvas.width);
        formData.append('canvaHeight', canvas.height);
        formData.append('id', sessionData.user_id);

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

            // Ajouter l'image au conteneur validPicture
            pictureValidDiv.innerHTML = ''; // Effacer l'image précédente si nécessaire
            pictureValidDiv.appendChild(resultImage);

            // Afficher la div validPicture et cacher webcamDiv
            showValidPicture();
        } else {
            console.error('Erreur lors de la génération de l\'image:', response.statusText);
        }
    });

    uploadImageInput.addEventListener('change', () => {
        const file = uploadImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    // Calculer les nouvelles dimensions tout en conservant le ratio
                    let maxWidth = 640;
                    let maxHeight = 480;
                    let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    
                    // Nouvelles dimensions de l'image
                    let newWidth = img.width * ratio;
                    let newHeight = img.height * ratio;
    
                    // Redimensionner le canvas et dessiner l'image redimensionnée
                    uploadCanvas.width = newWidth;
                    uploadCanvas.height = newHeight;
                    uploadContext.drawImage(img, 0, 0, newWidth, newHeight);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Événement du bouton "Add sticker to uploaded image!"
    btnUploadCapture.addEventListener('click', async () => {
        let sticker = null;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                sticker = radios[i].value;
            }
        }

        // Conversion de l'image en data URL (base64)
        const dataUrl = uploadCanvas.toDataURL('image/png');

        const formData = new FormData();
        formData.append('photo', dataUrl);
        formData.append('sticker', sticker);
        formData.append('canvaWidth', uploadCanvas.width);
        formData.append('canvaHeight', uploadCanvas.height);
        formData.append('id', sessionData.user_id);

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

            // Ajouter l'image au conteneur validPicture
            pictureValidDiv.innerHTML = ''; // Effacer l'image précédente si nécessaire
            pictureValidDiv.appendChild(resultImage);

            // Afficher la div validPicture et cacher webcamDiv
            showValidPicture();
        } else {
            console.error('Erreur lors de la génération de l\'image:', response.statusText);
        }
    });

    btnAnotherPicture.addEventListener('click', () => {
        window.location.reload();
    });

    btnHome.addEventListener('click', () => {
        window.location.href = '/';
    });
});
