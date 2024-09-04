document.addEventListener('DOMContentLoaded', async () => {
    const btnProfil = document.getElementById('btnProfil');
    const btnLogout = document.getElementById('btnLogout');
    const btnPost = document.getElementById('btnPost');
    const feedMainDiv = document.getElementById('feedMainDiv');
    const btnMorePicture = document.getElementById("btnMorePicture");
    var feedCount = 0;
    var idCount = 0;

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
                console.log(feed);
                
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
                        


                        // Create div for picture
                        let pictureFeedDiv = document.createElement('div');
                        pictureFeedDiv.className = 'pictureFeed';

                        let imgElement = document.createElement('img');
                        imgElement.className = 'imgFeed';
                        imgElement.id = idCount;
                        imgElement.src = thumbnailImg.src;
                            // mainDiv.appendChild(thumbnailImg);
                        pictureFeedDiv.appendChild(imgElement);

                        // Div Comment + Like
                        let handleDiv = document.createElement('div');
                        handleDiv.className = "handleDiv";

                        // Comment Div
                        let commentDiv = document.createElement('div');
                        commentDiv.className = "commentDiv";
                        let commentH3 = document.createElement('h3');
                        commentH3.textContent = "Comment";

                        let commentInput = document.createElement('input');
                        commentInput.type = 'text';
                        commentInput.placeholder = 'Write your comment...';
                        commentInput.className = 'commentInput';
                        let commentButton = document.createElement('button');
                        commentButton.textContent = 'Add comment';
                        commentButton.className = 'commentButton';
                        commentButton.id = idCount;
                        idCount++;

                        commentButton.addEventListener('click', (event) => {
                            const clickedButton = event.target;
                            // console.log(clickedButton);
                            // console.log("BUTTON ID : " + clickedButton.id);
                            console.log(document.getElementById(clickedButton.id));          
                        });

                        let commentRead = document.createElement('p');
                        commentRead.textContent = "Magnifique Photo !";
                        commentDiv.appendChild(commentH3);
                        commentDiv.appendChild(commentInput);
                        commentDiv.appendChild(commentButton);
                        commentDiv.appendChild(commentRead);
                        handleDiv.appendChild(commentDiv);


                        // Like Div
                        let likeDiv = document.createElement('div');
                        likeDiv.className = "likeDiv";
                        let likeImg = document.createElement("img");
                        likeImg.className = "likeImg";
                        likeImg.src = "frontend/pictures/like.png";
                        likeDiv.appendChild(likeImg);
                        handleDiv.appendChild(likeDiv);


                        pictureFeedDiv.appendChild(handleDiv);


                        feedMainDiv.appendChild(pictureFeedDiv);
                    }
                }
                feedCount += feed.result.length;
                // let buttonMorePicture = document.createElement('button');
                // buttonMorePicture.className = "button";
                // buttonMorePicture.textContent = "More Picture";
                // mainDiv.appendChild(buttonMorePicture);
            } catch (error) {
                console.log("error getPicture in the feed : " + error);
            }
        }
    }
    
    getPicture();

    // console.log(document.querySelectorAll('.commentButton'));

    // document.querySelectorAll('.commentButton').forEach(button => {
    //     button.addEventListener('click', (event) => {
    //         const clickedButton = event.target;

    //         console.log(clickedButton);
    //         console.log("BUTTON ID : " + clickedButton.id);
            
    //     })
    // });
    

    document.getElementById('btnLogout').addEventListener('click', async () => {
        const response = await fetch('https://localhost:8443/backend/views/logout.php');
        const data = await response.json();
        if (data.status === 'success') {
            window.location.reload(); // Refresh the page to reflect the changes
        }
    });

    btnMorePicture.addEventListener('click', () => {
        getPicture();
    });

});