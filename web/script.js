document.addEventListener('DOMContentLoaded', async () => {
    const btnProfil = document.getElementById('btnProfil');
    const btnInfoProfil = document.getElementById('btnInfoProfil');
    const btnLogout = document.getElementById('btnLogout');
    const btnPost = document.getElementById('btnPost');
    const feedMainDiv = document.getElementById('feedMainDiv');
    const btnMorePicture = document.getElementById("btnMorePicture");
    var feedCount = 0;

    btnInfoProfil.addEventListener('click', () => {
        window.location.href = "/info-profil";
    });

    btnProfil.addEventListener('click', () => {
        window.location.href = "/profil";
    });
    
    btnPost.addEventListener('click', () => {
        window.location.href = "/post";
    });
    

    // Size of picture
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    var sizePictureWidth;
    var sizePictureHeight;
    if (windowWidth < 950) {
        sizePictureWidth = 240;
        sizePictureHeight = 180;
    } else if (windowWidth < 1300) {
        sizePictureWidth = 480;
        sizePictureHeight = 360;
    } else {
        sizePictureWidth = 640;
        sizePictureHeight = 480;
    }



    // Check login status
    const response = await fetch('https://localhost:8443/backend/views/sessionStatus.php');
    var sessionData = await response.json();

    if (sessionData.loggedIn) {
        btnProfil.style.display = 'none';
        btnInfoProfil.style.display = 'block';
        btnLogout.style.display = 'block';
        btnPost.style.display = 'block';

        const formDataSession = new FormData;
        formDataSession.append('user_id', sessionData.user_id);
        const responseSession = await fetch('https://localhost:8443/backend/views/updateSession.php', {
            body: formDataSession,
            method: "POST"
        });
        sessionData = await responseSession.json();
    } else {
        btnInfoProfil.style.display = 'none';
        btnLogout.style.display = 'none';
        btnPost.style.display = 'none';
    }
    
    const recoverComment = async (id, nbPicture) => {
        const formDataGetComment = new FormData;
        formDataGetComment.append('id', id);
        formDataGetComment.append('nbPicture', nbPicture);

        const response = await fetch('https://localhost:8443/backend/views/getComment.php', {
            body: formDataGetComment,
            method: 'POST'
        });

        if (response.ok) {

            try {
                const resultComments = await response.json();
                
                return resultComments.result;
            } catch (error) {
                console.log(error);
            }

        } else {
            console.log("Error in the fetch getComment");
        }
    };

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
                    
                    await new Promise((resolve) => {
                        const img = new Image();
                        img.src = 'data:image/jpeg;base64,' + element.photoData;
                        
                        img.onload = async () => {
                            const canvasThumbnail = document.createElement('canvas');
                            const contextThumbnail = canvasThumbnail.getContext('2d');

                            const thumbnailWidth = sizePictureWidth;
                            const thumbnailHeight = sizePictureHeight;
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
                            imgElement.id = `imgElement_${element.id}`;
                            imgElement.src = thumbnailImg.src;
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
                            commentInput.id = `commentInput_${element.id}`;
                            let commentButton = document.createElement('button');
                            commentButton.textContent = 'Add comment';
                            commentButton.className = 'commentButton';
                            commentButton.id = `commentButton_${element.id}`;



                            commentButton.addEventListener('click', async () => {
                                if (sessionData.loggedIn) {
                                    const idElement = commentButton.id.split('_')[1];
                                    const commentValue = document.getElementById(`commentInput_${idElement}`).value;
                                    const img = document.getElementById(`imgElement_${idElement}`);
                                    if (commentValue.trim() !== "") {
                                        const formDataComment = new FormData();
                                        formDataComment.append('post_id', idElement);
                                        formDataComment.append('user_id', sessionData.user_id);
                                        formDataComment.append('comment', commentValue);
                                        
                                        try {
                                            const response = await fetch('https://localhost:8443/backend/views/putComment.php', {
                                                method: 'POST',
                                                body: formDataComment
                                            });
                                            
                                            if (response.ok) {
                                                const resultStatus = await response.json();
                                                document.getElementById(`commentInput_${idElement}`).value = "";
                                                
                                                const commentDivList = document.getElementById(`commentListDiv_${idElement}`);
                                                
                                                let commentsListNew = [];
                                                commentsListNew = await recoverComment(element.id, commentDivList.childNodes.length + 1);
                                                
                                                commentDivList.textContent = "";
                                                for(let i = 0; i < commentsListNew.length; i++) {
                                                    let commentRead = document.createElement('p');
                                                    commentRead.textContent = commentsListNew[i].comment;
                                                    commentRead.classList.add("commentP");  
                                                    commentListDiv.appendChild(commentRead);
                                                }
                                                
                                                if (sessionData.notification === 1) {
                                                    const formDataCommentMail = new FormData;
                                                    formDataCommentMail.append('post_id', element.id);
                                                    formDataCommentMail.append('comment', commentValue);
                                                    await fetch('https://localhost:8443/backend/views/sendMailNewComment.php', {
                                                        method: 'POST',
                                                        body: formDataCommentMail
                                                    });
                                                }
                                                
                                            } else {
                                                const errorText = await response.text();
                                                console.error('Erreur lors de l\'envoi du commentaire:', errorText);
                                            }
                                        } catch (error) {
                                            console.error('Erreur de requête:', error);
                                        }
                                    } else {
                                        console.log("Le champ de commentaire est vide.");
                                    }
                                }
                            });

                            commentDiv.appendChild(commentH3);
                            commentDiv.appendChild(commentInput);
                            commentDiv.appendChild(commentButton);

                            let commentListDiv = document.createElement('div');
                            commentListDiv.id = `commentListDiv_${element.id}`;
                            commentDiv.appendChild(commentListDiv);

                            let commentsList = [];
                            commentsList = await recoverComment(element.id, 5);
                            
                            for(let i = 0; i < commentsList.length; i++) {
                                let commentRead = document.createElement('p');
                                commentRead.textContent = commentsList[i].comment;
                                commentRead.classList.add("commentP");
                                commentListDiv.appendChild(commentRead);
                            }


                            let buttonListDiv = document.createElement('button');
                            buttonListDiv.textContent = 'More comment';
                            buttonListDiv.className = 'buttonListDiv';

                            buttonListDiv.addEventListener('click', async () => {
                                const commentDivList = document.getElementById(`commentListDiv_${element.id}`);
                                let nbpicture = commentDivList.childNodes.length + 5;
                                
                                let commentsListNew = [];
                                commentsListNew = await recoverComment(element.id, nbpicture);
                                
                                if (commentsListNew.length !== nbpicture - 5) {
                                    commentDivList.textContent = "";
                                    for(let i = 0; i < commentsListNew.length; i++) {
                                        let commentRead = document.createElement('p');
                                        commentRead.textContent = commentsListNew[i].comment;
                                        commentRead.classList.add("commentP");
                                        commentListDiv.appendChild(commentRead);
                                    }
                                }
                            });

                            commentDiv.appendChild(buttonListDiv);
                            handleDiv.appendChild(commentDiv);


                            // Like Div
                            let likeDiv = document.createElement('div');
                            likeDiv.className = "likeDiv";
                            let likeImg = document.createElement("img");
                            likeImg.classList.add("likeImg");
                            likeImg.src = "frontend/pictures/like.png";
                            if (sessionData.loggedIn) {
                                const formDataGetLike = new FormData;
                                formDataGetLike.append('post_id', element.id);
                                formDataGetLike.append('user_id', sessionData.user_id);

                                const response = await fetch("https://localhost:8443/backend/views/getLike.php", {
                                    body: formDataGetLike,
                                    method: 'POST'
                                });

                                if (response.ok) {
                                    try {
                                        const result = await response.json();
                                        
                                        if (result.result[0] === 1) {
                                            likeImg.classList.add("active");
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    }
                                } else {
                                    console.log("Error in getLike");
                                }
                            }



                            likeImg.addEventListener('click', async () => {
                                if (sessionData.loggedIn) {
                                    if (!likeImg.classList.contains("active")) {
                                        const formDataLike = new FormData;
                                        formDataLike.append('post_id', element.id);
                                        formDataLike.append('user_id', sessionData.user_id);
            
                                        const response = await fetch("https://localhost:8443/backend/views/putLike.php", {
                                            body: formDataLike,
                                            method: 'POST'
                                        });
            
                                        if (response.ok) {
                                            try {
                                                const message = await response.json();
                                                likeImg.classList.add("active");
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        } else {
                                            console.log("Error to put the like");
                                        }
                                    } else {
                                        const formDataDeleteLike = new FormData;
                                        formDataDeleteLike.append('post_id', element.id);
                                        formDataDeleteLike.append('user_id', sessionData.user_id);

                                        const response = await fetch("https://localhost:8443/backend/views/deleteLike.php", {
                                            body: formDataDeleteLike,
                                            method: 'POST'
                                        });

                                        if (response.ok) {
                                            try {
                                                const result = await response.json();
                                                likeImg.classList.remove("active");
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        } else {
                                            console.log("Error in delete like");
                                        }
                                    }
                                }
                            });


                            likeDiv.appendChild(likeImg);
                            handleDiv.appendChild(likeDiv);

                            if (element.user_id === sessionData.user_id) {
                                let deleteDiv = document.createElement('div');
                                deleteDiv.className = "deleteDiv";
                                let deleteImg = document.createElement('img');
                                deleteImg.className = "deleteImg";
                                deleteImg.src = "frontend/pictures/trash.png";

                                deleteImg.addEventListener('click', async () => {
                                    const formDataDelete = new FormData;
                                    formDataDelete.append('post_id', element.id);
                                    formDataDelete.append('user_id', sessionData.user_id);
                                    const response = await fetch("https://localhost:8443/backend/views/deletePicture.php", {
                                        body: formDataDelete,
                                        method: "POST"
                                    });

                                    try {
                                        const result = await response.json();
                                        window.location.reload();
                                    } catch (error) {
                                        console.log(error);
                                    }
                                });

                                deleteDiv.appendChild(deleteImg);
                                handleDiv.appendChild(deleteDiv);
                            }


                            pictureFeedDiv.appendChild(handleDiv);


                            feedMainDiv.appendChild(pictureFeedDiv);
                            resolve();
                        }
                    });
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

    btnMorePicture.addEventListener('click', () => {
        getPicture();
    });

});