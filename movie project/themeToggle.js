// Importing search history details from script.js

// Theme toggle functionality
import history from "./script.js";

const mode = document.getElementById('themeToggle');

mode.addEventListener("change", () => {
    if (mode.value === "dark") {  
        document.body.style.backgroundColor = "black";
    } else { 
        document.body.style.backgroundColor = "white";
    }
});

// Search history modal and list creation
const searchHistoryModal = document.querySelector(".searchHistoryModal");
const searchedContent = document.getElementById("history-content");
searchedContent.innerHTML = "";

const detailsList = document.createElement("ul");
detailsList.classList.add('history-ul');

// Ensure `searchedDetail` is an array before iterating
if (Array.isArray(history)) {
    history.forEach(detail => {
        const listItem = document.createElement("li");
        listItem.textContent = detail;
        detailsList.appendChild(listItem);
    });
}

searchedContent.appendChild(detailsList);

// Corrected modal display property
document.getElementById('history').addEventListener('click', () => {

    searchHistoryModal.style.display = 'grid';
    searchHistoryModal.style.zIndex = '999';
});

// Close button functionality
document.getElementById('history-close-detail').addEventListener('click', () => {
    searchHistoryModal.style.display = 'none';
    searchHistoryModal.style.zIndex = '-1';
});
