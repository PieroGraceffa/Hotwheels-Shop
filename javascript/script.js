// Garage

// Global variable to store the total number of gallery items
var totalItems = 24;

// Initialize likes and comments objects for each item
var likes = {};
var comments = {};

// Function to add a comment to the specified item
function addComment(itemIndex) {
  const commentInput = document.getElementById(`comment-input-${itemIndex}`);
  const commentList = document.getElementById(`comments-${itemIndex}`);
  const commentText = commentInput.value;
  if (commentText.trim() !== "") {
    const newComment = document.createElement("li");
    newComment.textContent = commentText;
    commentList.appendChild(newComment);
    commentInput.value = "";
    // Store the comment in the comments object
    if (!comments[itemIndex]) {
      comments[itemIndex] = [];
    }
    comments[itemIndex].push(commentText);
    // Save comments in localStorage
    saveComments();
  }
}

// Function to increment likes for the specified item
function likeItem(itemIndex) {
  if (!likes[itemIndex]) {
    likes[itemIndex] = 0;
  }
  likes[itemIndex]++;
  const likesElement = document.getElementById(`likes-${itemIndex}`);
  likesElement.textContent = likes[itemIndex].toString();
  // Save likes in localStorage
  saveLikes();
}

// Function to save the comments in localStorage
function saveComments() {
  localStorage.setItem("comments", JSON.stringify(comments));
}

// Function to save the likes in localStorage
function saveLikes() {
  localStorage.setItem("likes", JSON.stringify(likes));
}

// Load initial likes and comments counts
window.addEventListener("DOMContentLoaded", function () {
  // Retrieve comments from localStorage
  const storedComments = localStorage.getItem("comments");
  if (storedComments) {
    comments = JSON.parse(storedComments);
    for (let i = 1; i <= totalItems; i++) {
      const commentList = document.getElementById(`comments-${i}`);
      if (comments[i]) {
        comments[i].forEach(function (comment) {
          const newComment = document.createElement("li");
          newComment.textContent = comment;
          commentList.appendChild(newComment);
        });
      }
    }
  }

  // Retrieve likes from localStorage
  const storedLikes = localStorage.getItem("likes");
  if (storedLikes) {
    likes = JSON.parse(storedLikes);
    for (let i = 1; i <= totalItems; i++) {
      const likesElement = document.getElementById(`likes-${i}`);
      likesElement.textContent = likes[i] ? likes[i].toString() : "0";
    }
  }
});


// Favorite Functionality
// Function to toggle the favorite class and update favorites count
function addToFavorites(itemNumber) {
  var item = document.querySelector(".gallery-item:nth-child(" + itemNumber + ")");
  item.classList.toggle("favorite");

  // Update counter and display alert
  var favoritesCount = parseInt(localStorage.getItem("favoritesCount")) || 0;
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  var imageSrc = item.querySelector("img").src;

  // Check if the image is already in favorites
  var existingIndex = favorites.findIndex(function (favorite) {
    return favorite.image === imageSrc;
  });

  if (item.classList.contains("favorite")) {
    // Image is not in favorites, add it
    if (existingIndex === -1) {
      favoritesCount++;
      alert(favoritesCount + " item(s) added to favorites!");

      // Store hotwheel in favorites array in localStorage
      var hotwheel = {
        image: imageSrc
      };
      favorites.push(hotwheel);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      // Image is already in favorites
      alert("This item is already in favorites!");
    }
  } else {
    // Image is in favorites, remove it
    if (existingIndex !== -1) {
      favoritesCount--;
      alert(favoritesCount + " item(s) removed from favorites!");

      favorites.splice(existingIndex, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }

  localStorage.setItem("favoritesCount", favoritesCount);
}

// Function to display favorites on favorites.html
function displayFavorites() {
  var favoritesContainer = document.getElementById("favorites-container");

  // Read favorites from localStorage
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Display favorites
  favoritesContainer.innerHTML = ""; // Clear previous contents
  for (var i = 0; i < favorites.length; i++) {
    var favorite = favorites[i];
    var img = document.createElement("img");
    img.src = favorite.image;
    favoritesContainer.appendChild(img);
  }
}

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Event listener for "Add to Favorites" buttons
  var addToFavoritesButtons = document.querySelectorAll(".add-to-favorites");
  addToFavoritesButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var itemNumber = button.dataset.itemNumber;
      addToFavorites(itemNumber);
    });
  });

  // Check if on favorites.html and call displayFavorites()
  if (window.location.pathname === "/favorites.html") {
    displayFavorites();
  }
});

// Call the displayFavorites function when the page loads
displayFavorites();

