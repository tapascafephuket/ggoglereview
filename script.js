// ================================
//        NAVIGATION FUNCTIONS
// ================================

function goHome() {
    window.location.reload();
}

function openMenu() {
    window.open('http://photos.app.goo.gl/WhQMEagbn4DHEhjn8', '_blank');
}

function openBooking() {
    alert('Booking feature coming soon!');
}

function openLocation() {
    window.open('https://maps.app.goo.gl/9gN1eVEmbovsdFmGA', '_blank');
}

// ================================
//         REVIEW BOX TOGGLE
// ================================

function toggleReview() {
    const reviewContainer = document.getElementById('reviewContainer');
    const reviewBoxHeight = reviewContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    const centerPosition = (viewportHeight / 2) - (reviewBoxHeight / 2);

    const currentBottom = window.getComputedStyle(reviewContainer).bottom;

    if (currentBottom === `${centerPosition}px`) {
        reviewContainer.style.bottom = "-100%";
        setTimeout(() => {
            reviewContainer.style.visibility = "hidden";
        }, 500);
    } else {
        reviewContainer.style.visibility = "visible";
        setTimeout(() => {
            reviewContainer.style.bottom = `${centerPosition}px`;
        }, 10);
        resetReviewBox(); // Reset review section when opened
    }
}

// Function to reset the review box state
function resetReviewBox() {
    selectedStars = 0;
    updateStars(0); // Reset stars
    document.getElementById('ratingSection').classList.remove('hidden'); // Show stars & heading
    document.getElementById('feedbackForm').classList.add('hidden'); // Hide feedback form
    document.getElementById('loading').classList.add('hidden'); // Hide loading message
    document.getElementById('thankYouMsg').classList.add('hidden'); // Hide thank you message
}

// ================================
//       STAR RATING SYSTEM
// ================================

let selectedStars = 0; // Stores the selected rating

function rate(stars) {
    selectedStars = stars;
    updateStars(stars);

    const ratingSection = document.getElementById("ratingSection");
    const feedbackForm = document.getElementById("feedbackForm");

    if (stars <= 2) {
        // Hide stars & heading, show form
        ratingSection.classList.add("hidden");
        feedbackForm.classList.remove("hidden");
    } else {
        // Redirect for high ratings (3-5 stars)
        window.open('https://g.page/r/CYI2SWIeCoYxEBM/review', '_blank');
    }
}

function highlightStars(stars) {
    updateStars(stars);
}

function resetStars() {
    updateStars(selectedStars);
}

function updateStars(stars) {
    const starElements = document.querySelectorAll(".stars i");
    starElements.forEach((star, index) => {
        star.classList.toggle("hovered", index < stars);
        star.classList.toggle("active", index < selectedStars);
    });
}

// ================================
//        FEEDBACK FORM
// ================================

function attachReviewEventListeners() {
    const feedbackForm = document.getElementById('feedbackForm');
    const backButton = document.getElementById('backButton');

    if (feedbackForm && backButton) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
        
            // Show loading message
            feedbackForm.classList.add('hidden');
            document.getElementById('loading').classList.remove('hidden');
        
            // Send form data to Formspree
            const formData = new FormData(feedbackForm);
        
            fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                document.getElementById('loading').classList.add('hidden');
        
                if (response.ok) {
                    document.getElementById('thankYouMsg').classList.remove('hidden');
                } else {
                    alert("Something went wrong. Please try again.");
                }
            })
            .catch(error => {
                document.getElementById('loading').classList.add('hidden');
                alert("Network error. Please check your connection.");
            });
        });

        backButton.addEventListener('click', function() {
            document.getElementById('feedbackForm').classList.add('hidden'); // Hide feedback form
            document.getElementById('ratingSection').classList.remove('hidden'); // Show rating section again
        });        
    }
}

// ================================
//        LOAD REVIEW SECTION
// ================================

function loadReviewSection() {
    fetch('review.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('reviewContainer').innerHTML = html;
            setTimeout(attachReviewEventListeners, 100);
        })
        .catch(error => console.error('Error loading review section:', error));
}

// Load the review section when the page loads
window.onload = function() {
    loadReviewSection();
    
    // Check if URL contains ?review=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('review')) {
        setTimeout(() => {
            toggleReview();
        }, 500); // Delay to ensure review section is fully loaded
    }
};
