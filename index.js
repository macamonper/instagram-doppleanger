const swiperWrapper = document.querySelector(".swiper-wrapper");
const heartIcon = document.querySelector(".heart");
const btnSendComment = document.querySelector(".btn-send-comment");
const commentToPost = document.querySelector(".comment-to-post");
const textAreaComment = document.querySelector(".textarea-comment");
const postCommentBtn = document.querySelector(".btn-post-comment");
const containerComments = document.querySelector(".post-comments");
const formComments = document.querySelector(".create-comment");
let liked = false;
const comments = [];

//CARROUSEL

const swiper = new Swiper(".mySwiper", {
  observer: true,
  preloadImages: true,
  cssMode: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    paginationClickable: true,
  },
  a11y: {
    prevSlideMessage: "Previous slide",
    nextSlideMessage: "Next slide",
  },
  effect: "slide",
  mousewheel: true,
  keyboard: true,
});

fetch("https://picsum.photos/v2/list?page=1&limit=4")
  .then((response) => response.json())
  .then((data) => carrousel(data));

const carrousel = (data) => {
  const images = data.reduce((acc, curr) => {
    return (
      acc +
      `
       <div class="swiper-slide">
          <img src="${curr.download_url}" alt="photo taken by ${curr.author}">
        </div>
      `
    );
  }, "");

  swiperWrapper.innerHTML = images;
};

//LIKES

heartIcon.onclick = (e) => {
  liked = !liked;

  if (liked) {
    heartIcon.classList.remove("far");
    heartIcon.classList.add("fas", "pulse");
  } else {
    heartIcon.classList.remove("fas", "pulse");
    heartIcon.classList.add("far");
  }
};

//COMMENTS
const postComment = () => {
  if (textAreaComment.value === "") {
    postCommentBtn.disabled = true;
    postCommentBtn.classList.add(`disabled`);
  } else {
    postCommentBtn.disabled = false;
    postCommentBtn.classList.remove(`disabled`);
  }
};
postComment();

textAreaComment.addEventListener("keyup", postComment);

const saveInLs = (key, object) => {
  const stringifyObject = JSON.stringify(object);
  return localStorage.setItem(key, stringifyObject);
};

const getComments = () => {
  const commentsInLs = localStorage.getItem("comments");
  if (commentsInLs === null) {
    return comments;
  } else {
    return JSON.parse(commentsInLs);
  }
};

const addCommentHtml = (arr) => {
  const createHtml = arr.reduce((acc, comment) => {
    return (
      acc +
      `
      <div class="comment-container">
        <p class="username-tag">
          ${comment.user}
          <span class="comment-posted">
            ${comment.comment}
          </span>
        </p>
      </div>
      `
    );
  }, "");
  containerComments.innerHTML = createHtml;
};

const postedComments = () => {
  const comments = getComments();
  addCommentHtml(comments);
};
postedComments();

formComments.onsubmit = (e, index) => {
  e.preventDefault();
  const newComment = {
    user: `comment`,
    comment: textAreaComment.value,
  };

  const commentsStored = getComments();

  if (index > -1) {
    commentsStored[index] = newComment;
  } else {
    commentsStored.push(newComment);
  }
  formComments.reset();
  saveInLs("comments", commentsStored);
  addCommentHtml(commentsStored);
};
