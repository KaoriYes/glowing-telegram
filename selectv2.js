// Create a div element for overlay
const overlay = document.createElement("div");
overlay.setAttribute("id", "overlay");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "9999";
overlay.style.display = "flex";
overlay.style.justifyContent = "flex-start";
overlay.style.alignItems = "center";
overlay.style.pointerEvents = "none";
// overlay.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

// Create a content div inside the overlay
const content = document.createElement("div");
content.setAttribute("id", "content");
content.style.backgroundColor = "#5b5b5b";
content.style.display = "flex";
// content.style.flexDirection = "column";
content.style.alignItems = "center";
content.style.justifyContent = "center";
content.style.padding = "20px";
content.style.width = "12.5vw";
content.style.borderRadius = "10px";
content.style.pointerEvents = "initial";

// Create a button for selecting text
const button = document.createElement("button");
button.textContent = "Klik om te selecteren";
button.style.padding = "1em 2em";
button.style.borderRadius = ".25em";
button.style.backgroundColor = "#3b3b3b";
button.style.color = "white";
button.style.cursor = "pointer";
button.style.fontSize = "1.5em";

const paragraph = document.createElement("p");

// Append paragraph and button to the content div
content.appendChild(paragraph);
content.appendChild(button);

// Append content div to the overlay
overlay.appendChild(content);

// Append overlay to the body
document.body.appendChild(overlay);


// Initialize variables
let selectedPoints = [];
const body = document.querySelector("main");
let isTextSelectionActive = false; // Flag to track if text selection is active

// Function to handle word selection
function handleWordSelection(event) {

        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        const clickedPoint = range.cloneRange();
        clickedPoint.collapse(true);

        const firstClickIndicator = body.querySelector(".first-click-indicator");
        button.style.backgroundColor = "#2b2b2b";
        button.textContent = "Klik op het einde van tekst die je wilt selecteren";

        if (selectedPoints.length < 2) {
            selectedPoints.push(clickedPoint);

            // If the indicator node doesn't exist, create and insert it
            if (!firstClickIndicator) {
                const newIndicator = document.createElement("span");
                newIndicator.classList.add("first-click-indicator");
                clickedPoint.insertNode(newIndicator);
            }
        }

        if (selectedPoints.length === 2) {
            body.removeEventListener("click", handleWordSelection);
            body.classList.remove("selectable");
            isTextSelectionActive = false;

            // Remove the indicator node if it exists
            if (firstClickIndicator) {
                firstClickIndicator.remove();
            }

            // Create a range that spans the two selected points
            const selectionRange = document.createRange();
            selectionRange.setStart(selectedPoints[0].startContainer, selectedPoints[0].startOffset);
            selectionRange.setEnd(selectedPoints[1].startContainer, selectedPoints[1].startOffset);

            // Log the selected text to the console
            const selectedText = selectionRange.toString();
            console.log("Selected Text:", selectedText);
            button.textContent = "De tekst is geselecteerd";
            // Highlight the selection
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectionRange);

            // Call the function to copy the selected text
            // copyToClipboard(selectedText);

            // Reset selection
            selectedPoints.length = 0;
            selectedPoints = [];

            // Re-add the click event listener for further selections
            body.addEventListener("click", handleWordSelection);
        }
    }



// Function to toggle word selection on the body
function toggleWordSelection() {
    if (!body.classList.contains("selectable")) {
        console.log(selectedPoints);
        // Add event listener to allow word selection
        body.classList.add("selectable");
        body.addEventListener("click", handleWordSelection);
        isTextSelectionActive = true;
        console.log("You can now select text within the body.");
    } else {
        // Remove event listener to prevent further selections
        selectedPoints = [];
        selectedPoints.length = 0;
        body.classList.remove("selectable");
        body.removeEventListener("click", handleWordSelection);
        isTextSelectionActive = false;
        console.log("Word selection within the body is disabled.");
    }
}

// Add event listener to start text selection
button.addEventListener("click", function(event) {
    event.stopPropagation();
    toggleWordSelection();

    button.textContent = "Klik op het eerste punt van de gewenste tekst";
});



// Add event listener to handle updating selection while moving mouse
document.body.addEventListener('mousemove', function(event) {
    if (selectedPoints.length === 1) {
        const clickedPoint = document.caretRangeFromPoint(event.clientX, event.clientY);
        if (clickedPoint && selectedPoints[0]) {
            const selectionRange = document.createRange();
            selectionRange.setStart(selectedPoints[0].startContainer, selectedPoints[0].startOffset);
            selectionRange.setEnd(clickedPoint.startContainer, clickedPoint.startOffset);

            // Apply the selection to the document
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectionRange);
        }
    }
});



