import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"; 
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// import { getStorage, ref, uploadBytes } from "firebase/storage";
// const imageStorage = getStorage();


//make this an object with the databaseURL in it
const appSettings = {
    databaseURL: "https://pawsome-dca92-default-rtdb.europe-west1.firebasedatabase.app/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const postsInDB = ref(database, "posts");

/* const posts = [
    {
        name: "Vincent van Gogh",
        username: "vincey1853",
        location: "Zundert, Netherlands",
        avatar: "images/avatar-vangogh.jpg",
        post: "images/post-vangogh.jpg",
        comment: "just took a few mushrooms lol",
        likes: 21
    },
    {
        name: "Gustave Courbet",
        username: "gus1819",
        location: "Ornans, France",
        avatar: "images/avatar-courbet.jpg",
        post: "images/post-courbet.jpg",
        comment: "i'm feelin a bit stressed tbh",
        likes: 4
    },
        {
        name: "Joseph Ducreux",
        username: "jd1735",
        location: "Paris, France",
        avatar: "images/avatar-ducreux.jpg",
        post: "images/post-ducreux.jpg",
        comment: "gm friends! which coin are YOU stacking up today?? post below and WAGMI!",
        likes: 152
    }
]*/

// for(let i = 0; i < posts.length; i++){
//     push(postsInDB, posts[i]);
// }

const addBtn = document.getElementById("add-btn"); 
let addBtnActive = true; //If true, button to add post, if false - button to close window
const addPostModal = document.getElementById("add-post-modal");
addBtn.addEventListener("click", function(){

    if (addBtnActive){ 
        openModal(); 
    }

    else{ 
        closeModal(); 
    }

    // When the user clicks anywhere outside of the modal, close it
    
    /* window.onclick = function(event) {
        if (event.target == modal) {
            closeModal()
        }
    }
    */

    // add options for avatars (12 or so?)

    // clicking submit should close the snackbar

});

function openModal(){
    addPostModal.style.visibility = "visible";
    addPostModal.style.opacity = "1";
    addBtn.style.rotate = "45deg";
    addBtnActive = false;
}
function closeModal(){
    addPostModal.style.visibility = "hidden";
    addPostModal.style.opacity = "0";
    addBtn.style.rotate = "";
    addBtnActive = true;
}


const feedEl = document.getElementById("feed");
const feedItems = document.createDocumentFragment();

onValue(postsInDB, function(snapshot){
    if(snapshot.exists()){
        let currentPosts = Object.entries(snapshot.val());
        clearFeed();

        for(let i=0; i<currentPosts.length; i++){
            const newPost = generatePost(currentPosts[i]);
            feedItems.append(newPost);
        }
    }
    feedEl.append(feedItems);

});

// for(let i=0; i<posts.length; i++){
//     const newPost = generatePost(posts[i]);
//     feedItems.append(newPost);
// }
// feedEl.append(feedItems);

function generatePost(array){

    const postKey = array[0];
    const postArray = array[1];

    const newPost = document.createElement("div");
    newPost.setAttribute("class", "post-container");

    /* Generate a div for information about the poster */
    const posterInfo = document.createElement("div");
    posterInfo.setAttribute("class", "poster-info");

    const posterAvatar = document.createElement("img");
    posterAvatar.setAttribute("class", "avatar");
    posterAvatar.setAttribute("src", postArray.avatar);
    posterAvatar.setAttribute("alt", `${postArray.name}s avatar`);

    const posterPersonalia = document.createElement("h3");
    posterPersonalia.setAttribute("class", "bold");
    posterPersonalia.append(`${postArray.name}`);

    const posterLocation = document.createElement("span");
    posterLocation.setAttribute("class", "small");
    posterLocation.append(`${postArray.location}`);
    
    posterPersonalia.append(posterLocation);

    posterInfo.append(posterAvatar, posterPersonalia);
    
    /* Image */
    const postedImg = document.createElement("img");
    postedImg.setAttribute("class", "posted-img");
    postedImg.setAttribute("src", `${postArray.post}`);
    postedImg.setAttribute("alt", `${postArray.name}s posted image`);

    /* Post action buttons */
    const postActions = getPostActions(postArray);

    /* Likes / comments */
    const numberOfLikes = document.createElement("p");
    numberOfLikes.setAttribute("class", "bold");
    numberOfLikes.append(`${postArray.likes} likes`);

    const postersComment = document.createElement("p");
    const posterUserName = document.createElement("span");
    posterUserName.setAttribute("class", "bold");
    posterUserName.append(`${postArray.username}`);
    postersComment.append(posterUserName);
    postersComment.append(` ${postArray.comment}`);

    /* Add comment field + inactive styled input field */

    newPost.append(posterInfo, postedImg, postActions, numberOfLikes, postersComment);

    return newPost;
    
}

function getPostActions(postArray){
    const iconContainer = document.createElement("div");
    
    // Check if local user has liked
    // add to localStorage: key for image + liked/unliked
    let hasLiked = false;

    let likeIcon;
    const liked = "images/icon-heart-filled.png";
    const notLiked = "images/icon-heart.png"
    if(hasLiked === false){
        likeIcon = notLiked;
    }else{
        likeIcon = liked;
    }

    // Add like-function to doubleclicking the image as well

    const likeBtn = generateBtn("Like", likeIcon);
    likeBtn.addEventListener("click", function(){
        if(hasLiked === false){
            hasLiked = true;
            likeIcon = liked; 
            postArray.likes += 1;
            likeBtn.firstElementChild.setAttribute("src", likeIcon);
        }else{
            hasLiked = false;
            likeIcon = notLiked; 
            postArray.likes -= 1;
            likeBtn.firstElementChild.setAttribute("src", likeIcon);
        }
    
        // Update website
        // Check you haven't liked before - unlike
        console.log("likeBtn clicked!");
        console.log(likeBtn);
    });

    const commentBtn = generateBtn("Comment", "images/icon-comment.png");
    commentBtn.addEventListener("click", function(){
        // automatically click into comment field
        // add comment field underneath as well
        console.log("commentBtn clicked!");
        console.log(commentBtn);
    });

    const shareBtn = generateBtn("Share", "images/icon-dm.png");
    shareBtn.addEventListener("click", function(){
        // Snackbar opens with a copy-able link
        // How do you link to a specific div in a website?
        console.log("shareBtn clicked!");
        console.log(shareBtn);
    });

    function generateBtn(btnFunction, iconLink){
        const newBtn = document.createElement("button"); 
        newBtn.setAttribute("class", "icon-btn");

        const icon = document.createElement("img");
        icon.setAttribute("src", iconLink);
        icon.setAttribute("alt", btnFunction);

        newBtn.append(icon);
        return newBtn;
    }

    iconContainer.append(likeBtn, commentBtn, shareBtn);    

    return iconContainer; 
}

function clearFeed(){
    feedEl.textContent = "";
}


const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

inputFile.addEventListener("change", uploadImage);

function uploadImage(){
    console.log("uploadImage() ran")
    // Do I move imgLink outside of the function, so I can access it from an upload function for the entire form? 
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    console.log(inputFile.files[0])
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.textContent = "";
    imageView.style.border = 0;
}

dropArea.addEventListener("dragover", function(e){
    e.preventDefault();
});

dropArea.addEventListener("drop", function(e){
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadImage();
});


const submitNewPostBtn = document.getElementById("ap-submit-btn"); 
submitNewPostBtn.addEventListener("click", function(e){
    e.preventDefault();
    console.log("submit-button clicked")
    uploadNewPost(e);
    console.log(e);
    // closeModal();
});


const comment = document.getElementById("ap-comment"); 
const name = document.getElementById("ap-name");
const location = document.getElementById("ap-location"); 


function uploadNewPost(e){
    console.log("uploadNewPost(e) ran")

    const newPost = {};
    // newPost.imageURL = inputFile.files[0];
    //newPost.post = (link to image, maybe rename this) 
    newPost.comment = comment.value; 
    newPost.name = name.value; 
    newPost.location = location.value; 
    
    newPost.likes = 0; 
    newPost.username = name.value; 
    newPost.avatar; 

    push(postsInDB, newPost);

    clearForm();

    closeModal();
}

function clearForm(){
    name.value = ""; 
    location.value = "";
    comment.value = ""; 
    imageView.innerHTML = `<img src="images/uploadIcon.png">
    <p>Drag and drop or click here <br> to upload image</p>
    <span>Upload any images from desktop</span>`;
    imageView.style.backgroundImage = "none";
    imageView.style.border = "2px dashed #bbb5ff";
}