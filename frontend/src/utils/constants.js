const AWS_S3=true;
const EC2_DEPLOY=true;

let BASE_PROFILE_IMAGE_URL='';
let BASE_POST_IMAGE_URL='';

if(EC2_DEPLOY){
    BASE_PROFILE_IMAGE_URL='http://localhost:4000/public/uploads/profiles/';
    BASE_POST_IMAGE_URL='http://localhost:4000/public/uploads/posts/';
}
else{
    BASE_PROFILE_IMAGE_URL='http://54.92.219.74:8080/public/uploads/profiles/';
    BASE_POST_IMAGE_URL='http://54.92.219.74:8080/public/uploads/posts/';
}

if(AWS_S3){
    BASE_PROFILE_IMAGE_URL='';
    BASE_POST_IMAGE_URL='';
}

export {BASE_PROFILE_IMAGE_URL,BASE_POST_IMAGE_URL};
export const SOCKET_ENDPOINT = EC2_DEPLOY?'http://54.92.219.74:8080':"http://localhost:4000";

// export const BASE_PROFILE_IMAGE_URL = 'https://instagrammern.herokuapp.com/public/uploads/profiles/';
// export const BASE_POST_IMAGE_URL = 'https://instagrammern.herokuapp.com/public/uploads/posts/';
// export const SOCKET_ENDPOINT = "https://instagrammern.herokuapp.com";

export const stories = [
    {
        title: "JavaScript",
        image: "javascript"
    },
    {
        title: "Node.js",
        image: "nodejs"
    },
    {
        title: "Express.js",
        image: "expressjs"
    },
    {
        title: "MongoDB",
        image: "mongodb"
    },
    {
        title: "React.js",
        image: "reactjs"
    },
    {
        title: "Socket.io",
        image: "socketio"
    },
    {
        title: "TailwindCSS",
        image: "tailwind"
    },
    {
        title: "MaterialUI",
        image: "mui"
    },
    {
        title: "Redux",
        image: "redux"
    },
    {
        title: "Multer",
        image: "multer"
    },
    {
        title: "Sendgrid",
        image: "sendgrid"
    },
    {
        title: "Axios",
        image: "axios"
    },
    {
        title: "Toastify",
        image: "toastify"
    },
]