const card = document.getElementById("card");
const boardCell = document.getElementsByClassName("board-cell");

// variables for when the drag event starts
let isDraggable = false;
let startX, startY;
let dragContext = null;

card.addEventListener("pointerdown", (event) => {
    isDraggable = true;

    dragContext = {
        startX: event.clientX,
        startY: event.clientY,
        rects: []
    };

    for (let cell of boardCell) {
        const rect = cell.getBoundingClientRect();
        dragContext.rects.push(rect);
    }
})