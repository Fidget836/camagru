document.addEventListener('DOMContentLoaded', async () => {
    const btnProfil = document.getElementById('btnProfil');
    const btnLogout = document.getElementById('btnLogout');
    const btnPost = document.getElementById('btnPost');
    const mainDiv = document.getElementById('mainDiv');
    var feedCount = 0;

    btnProfil.addEventListener('click', () => {
        window.location.href = "/profil";
    });

    btnPost.addEventListener('click', () => {
        window.location.href = "/post";
    });

    // Check login status
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    const sessionData = await response.json();

    if (sessionData.loggedIn) {
        btnProfil.style.display = 'none';
        btnLogout.style.display = 'block';
        btnPost.style.display = 'block';
    } else {
        btnLogout.style.display = 'none';
        btnPost.style.display = 'none';
    }


    const getPicture = async () => {
        // Recover the feed of picture
        const formDataFeed = new FormData();
        formDataFeed.append('offset', feedCount); //Offset
        formDataFeed.append('nbPicture', 10); // Limit
    
        const result = await fetch('https://localhost:8443/backend/views/getFeed.php', {
            method: 'POST',
            body: formDataFeed
        });
        
        if (result.ok) {
            try {
                feed = await result.json();
                
                for (let i = 0; i < feed.result.length; i++) {
                    const element = feed.result[i];
                    
                    const img = new Image();
                    img.src = 'data:image/jpeg;base64,' + element;
                    
                    img.onload = () => {
                        const canvasThumbnail = document.createElement('canvas');
                        const contextThumbnail = canvasThumbnail.getContext('2d');

                        const thumbnailWidth = 640;
                        const thumbnailHeight = 480;
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
                        
                        mainDiv.appendChild(thumbnailImg);
                    }
                }
                feedCount += feed.result.length;
            } catch (error) {
                console.log("error getPicture in the feed : " + error);
            }
        }
    }
    
    getPicture();


    document.getElementById('btnLogout').addEventListener('click', async () => {
        const response = await fetch('https://localhost:8443/backend/views/logout.php');
        const data = await response.json();
        if (data.status === 'success') {
            window.location.reload(); // Refresh the page to reflect the changes
        }
    });

});