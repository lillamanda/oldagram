import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"; 
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";



//make this an object with the databaseURL in it
const appSettings = {
    databaseURL: "https://pawsome-dca92-default-rtdb.europe-west1.firebasedatabase.app/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const postsInDB = ref(database, "posts");

const posts = [
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
]

// for(let i = 0; i < posts.length; i++){
//     push(postsInDB, posts[i]);
// }


const feedEl = document.getElementById("feed");
const feedItems = document.createDocumentFragment();
for(let i=0; i<posts.length; i++){
    const newPost = generatePost(posts[i]);
    feedItems.append(newPost);
}
feedEl.append(feedItems);

function generatePost(postArray){
    console.log("generatePost() called");

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
    let hasLiked = false;

    let likeIcon;
    const liked = "images/icon-heart-filled.png";
    const notLiked = "images/icon-heart.png"
    if(hasLiked === false){
        likeIcon = notLiked;
    }else{
        likeIcon = liked;
    }

    const likeBtn = generateBtn("Like", likeIcon);
    console.log(likeBtn);
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



// const likeBtn = document.createElement("a");
// likeBtn.href="#";
// likeBtn.innerText="hello";
// const likeIcon = document.createElement("img");
// likeIcon.setAttribute("src", "images/icon-heart.png")
// likeBtn.append(likeIcon);

// feedEl.append(likeBtn);
// console.log(likeBtn)