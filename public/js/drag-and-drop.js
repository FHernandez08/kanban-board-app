const card = document.getElementById("test-card");
const boardCell = document.getElementsByClassName("board-cell");

// variables for when the drag event starts
let isDraggable = false;
let startX, startY;
let dragContext = null;

card.addEventListener("pointerdown", (event) => {
    isDraggable = true;
    console.log(isDraggable);
    console.log("pointerdown fired");

    dragContext = {
        startX: event.clientX,
        startY: event.clientY,
        rects: [],
        cardId: event.target,
        previewEl,
    };

    console.log(dragContext.startX, dragContext.startY);

    for (let cell of boardCell) {
        const rect = cell.getBoundingClientRect();
        dragContext.rects.push(rect);
    }

    console.log(dragContext.rects);
});

card.addEventListener("pointermove", (event) => {
    if (!isDraggable || dragContext === null) {
        return
    }
    else {
        currentPositionX = event.clientX;
        currentPositionY = event.clientY;

        dragContext.previewEl.style.transform = translate(currentPositionX, currentPositionY);
    }
})