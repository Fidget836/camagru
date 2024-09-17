document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    var sessionData = await response.json();

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
    const btnLogout = document.getElementById('btnLogout');
    const btnUploadCapture = document.getElementById('btnUploadCapture');
    const formSticker = document.getElementById('formSticker');
    const travelImg = document.getElementById('travelImg');
    const gamepadImg = document.getElementById('gamepadImg');
    const hamburgerImg = document.getElementById('hamburgerImg');
    const pandaImg = document.getElementById('pandaImg');
    const parrotImg = document.getElementById('parrotImg');
    const trophyImg = document.getElementById('trophyImg');
    const main = document.getElementById('main');
    const errorMessage = document.getElementById('errorMessage');
    btnUploadCapture.disabled = true;

    // Doit être en premier !! Check si la personne est bien login
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

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
            });
    }

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };

        // Size of picture
        var windowWidth
        var windowHeight
        if (window.innerWidth < 640) {
            windowWidth = window.innerWidth;
            windowHeight = windowWidth / 1.3333;
            var sizePictureWidth = windowWidth;
            var sizePictureHeight = windowHeight;
        } else {
            windowWidth = 640;
            windowHeight = windowWidth / 1.3333;
            var sizePictureWidth = windowWidth;
            var sizePictureHeight = windowHeight;
        }

    btnLogout.addEventListener('click', async () => {
        const response = await fetch('https://localhost:8443/backend/views/logout.php');
        const data = await response.json();
        if (data.status === 'success') {
            window.location.href = '/';
        }
    });

    // Fonction pour charger les images précédentes
    const formDataList = new FormData();
    formDataList.append('id', sessionData.user_id);
    formDataList.append('nbPicture', 6);

    const listPreviousPicturesResponse = await fetch("https://localhost:8443/backend/views/getPhoto.php", {
        method: 'POST',
        body: formDataList
    });

    for(let i = 0; i < formSticker.length; i++) {
        if (formSticker[i].checked)
        {
            const img = document.getElementById(formSticker[i].id + 'Img');
            img.classList.add("activeSticker");
        }
        
    }
    

    formSticker.addEventListener('change', (event) => {
        travelImg.classList.remove("activeSticker");
        gamepadImg.classList.remove("activeSticker");
        hamburgerImg.classList.remove("activeSticker");
        pandaImg.classList.remove("activeSticker");
        trophyImg.classList.remove("activeSticker");
        parrotImg.classList.remove("activeSticker");
        const img = document.getElementById(event.target.id + 'Img');
        img.classList.add("activeSticker");
    });

    // Afficher les images précédentes
    if (listPreviousPicturesResponse.ok) {
        listPreviousPictures = await listPreviousPicturesResponse.json();
        
        // Effacer les anciennes images si nécessaire
        pictureDiv.innerHTML = ''; 

        for (let i = 0; i < 6; i++) {
            if (listPreviousPictures.result[i] === undefined) break;
            const element = listPreviousPictures.result[i];
            
            await new Promise((resolve) => {
                const img = new Image();
                img.src = 'data:image/jpeg;base64,' + element;

                img.onload = () => {
                    const canvasThumbnail = document.createElement('canvas');
                    const contextThumbnail = canvasThumbnail.getContext('2d');

                    const thumbnailWidth = sizePictureWidth / 2.5;
                    const thumbnailHeight = sizePictureHeight / 2.5;
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
                    resolve();
                }
            });
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

        main.style.display = "none";

        canvas.width = sizePictureWidth;
        canvas.height = sizePictureHeight;
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
    
        // Vérifier que le fichier est bien une image
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    let maxWidth = sizePictureWidth;
                    let maxHeight = sizePictureHeight;
                    let ratioWidth = Math.min(maxWidth / img.width);
                    let ratioHeight = Math.min(maxHeight / img.height);
                    
                    let newWidth;
                    let newHeight;
                    if (ratioWidth < ratioHeight) {
                        newWidth = img.width * ratioWidth;
                        newHeight = img.height * ratioWidth;
                    } else {
                        newWidth = img.width * ratioHeight;
                        newHeight = img.height * ratioHeight;
                    }
                    
                    uploadCanvas.width = newWidth;
                    uploadCanvas.height = newHeight;
                    uploadContext.drawImage(img, 0, 0, newWidth, newHeight);
    
                    // Activer le bouton après l'upload
                    btnUploadCapture.disabled = false;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file (jpg, png, gif, etc.)');
            uploadImageInput.value = '';  // Réinitialise l'input file
            btnUploadCapture.disabled = true;  // Désactive le bouton si ce n'est pas une image
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
                main.style.display = "none";
    
                // Créer une nouvelle image pour afficher le résultat
                const resultImage = new Image();
                resultImage.src = imageUrl;
    
                // Ajouter l'image au conteneur validPicture
                pictureValidDiv.innerHTML = ''; // Effacer l'image précédente si nécessaire
                pictureValidDiv.appendChild(resultImage);
    
                // Afficher la div validPicture et cacher webcamDiv
                showValidPicture();
            } else {
                // Ici tu gères l'erreur sans la logguer dans la console
                errorMessage.innerHTML = '<p class="errorMessageP">' + response.statusText + '</p>';
                setTimeout(() => {
                    errorMessage.innerHTML = '';
                }, 3000);
            }
    });
    
    btnAnotherPicture.addEventListener('click', () => {
        window.location.reload();
    });

    btnHome.addEventListener('click', () => {
        window.location.href = '/';
    });
});
