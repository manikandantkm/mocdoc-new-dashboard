document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    // Remove 'active' class from all links
    navLinks.forEach(link => link.classList.remove('active'));

    // Add 'active' class to the link corresponding to the current page
    if (currentUrl.includes("index.html")) {
        document.getElementById('overviewLink').classList.add('active');
    } else if (currentUrl.includes("bill.html")) {
        document.getElementById('billLink').classList.add('active');
    } else if (currentUrl.includes("patient.html")) {
        document.getElementById('patientLink').classList.add('active');
    } else if (currentUrl.includes("pharmacy.html")) {
        document.getElementById('pharmacyLink').classList.add('active');
    } else if (currentUrl.includes("lab.html")) {
        document.getElementById('labLink').classList.add('active');
    } else if (currentUrl.includes("visit.html")) {
        document.getElementById('visitLink').classList.add('active');
    } else if (currentUrl.includes("favourite.html")) {
        document.getElementById('faouriteLink').classList.add('active');
    }
});



function toggleFavorite(icon) {
    const boxId = icon.getAttribute("data-id");
    const card = document.querySelector(`#${boxId}`);
    const isFavorite = icon.classList.toggle("active");

    icon.classList.add("beat");
    setTimeout(() => {
        icon.classList.remove("beat");
    }, 300);

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite) {
        if (!favorites.includes(boxId)) {
            favorites.push(boxId);
            localStorage.setItem(`card-${boxId}`, card.outerHTML);
        }
    } else {
        favorites = favorites.filter((id) => id !== boxId);
        localStorage.removeItem(`card-${boxId}`);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));

    if (window.location.pathname.includes("favourite.html")) {
        const cardElement = document.querySelector(`#${boxId}`);
        if (cardElement) cardElement.remove();

        // Check and display dummy message if no favorites left
        const noFavorites = document.querySelector(".no-favorites");
        const favoriteContainer = document.querySelector(".favorite-container");

        if (favorites.length === 0) {
            noFavorites.style.display = "block";
        } else {
            noFavorites.style.display = "none";
        }
    }
}

function loadFavoritesPage() {
    if (window.location.pathname.includes("favourite.html")) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const favoriteContainer = document.querySelector(".favorite-container");
        const noFavorites = document.querySelector(".no-favorites");

        favoriteContainer.innerHTML = ""; // Clear the container

        if (favorites.length === 0) {
            // Show dummy image and message if no favorites
            noFavorites.style.display = "block";
        } else {
            noFavorites.style.display = "none";

            favorites.forEach((boxId) => {
                const cardHTML = localStorage.getItem(`card-${boxId}`);
                if (cardHTML) {
                    favoriteContainer.innerHTML += cardHTML;
                }
            });

            // Reattach event listeners to heart icons
            const heartIcons = favoriteContainer.querySelectorAll(".favourite-icon");
            heartIcons.forEach((icon) => {
                icon.addEventListener("click", () => toggleFavorite(icon));
            });
        }
    }
}

// Initialize heart icons on page load
function initializeFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((boxId) => {
        const icon = document.querySelector(`.favourite-icon[data-id="${boxId}"]`);
        if (icon) icon.classList.add("active");
    });
}

// Add event listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    loadFavoritesPage();
    initializeFavorites();

    // Attach event listener to all heart icons
    const heartIcons = document.querySelectorAll(".favourite-icon");
    heartIcons.forEach((icon) => {
        icon.addEventListener("click", () => toggleFavorite(icon));
    });
});



const dropdownMenu = document.getElementById('visibilityOptions');
const toggleButton = document.getElementById('toggleVisibilityDropdown');

// Generate a unique key for the current page
const pageKey = `selectedBoxes_${window.location.pathname.replace(/\//g, '_')}`;

// Load checkbox states from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCheckboxes = JSON.parse(localStorage.getItem(pageKey)) || [];
    const checkboxes = document.querySelectorAll('#visibilityOptions input[type="checkbox"]');
    const boxes = document.querySelectorAll('.card');

    // Set checkboxes based on saved state
    checkboxes.forEach(checkbox => {
        if (savedCheckboxes.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    // Show only the saved boxes or all boxes if none are saved
    if (savedCheckboxes.length > 0) {
        boxes.forEach(box => box.style.display = 'none');
        savedCheckboxes.forEach(boxId => {
            const box = document.getElementById(boxId);
            if (box) {
                box.style.display = 'block';
            }
        });
    } else {
        boxes.forEach(box => box.style.display = 'block');
    }
});

// Toggle dropdown visibility
toggleButton.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Save button functionality
document.getElementById('saveVisibility').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('#visibilityOptions input[type="checkbox"]');
    const boxes = document.querySelectorAll('.card');
    const selectedBoxes = [];

    // Collect all selected checkbox values
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedBoxes.push(checkbox.value);
        }
    });

    // Show only selected boxes
    if (selectedBoxes.length > 0) {
        boxes.forEach(box => box.style.display = 'none');
        selectedBoxes.forEach(boxId => {
            const box = document.getElementById(boxId);
            if (box) {
                box.style.display = 'block';
            }
        });
    } else {
        // If no checkbox is selected, show all boxes
        boxes.forEach(box => box.style.display = 'block');
    }

    // Save selected boxes to localStorage with a page-specific key
    localStorage.setItem(pageKey, JSON.stringify(selectedBoxes));

    // Close the dropdown menu
    dropdownMenu.style.display = 'none';
});

// Close dropdown if clicked outside
document.addEventListener('click', (event) => {
    if (!dropdownMenu.contains(event.target) && event.target !== toggleButton) {
        dropdownMenu.style.display = 'none';
    }
});