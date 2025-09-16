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

    const clone = event.target.cloneNode(true);
    clone.classList.add("drag-preview");
    clone.style.position = "fixed";
    clone.style.pointerEvents = "none";
    clone.style.opacity = "0.7";
    clone.style.zIndex = "1000";

    clone.style.left = event.clientX + "px";
    clone.style.top = event.clientY + "px";

    document.body.append(clone);

    dragContext = {
        startX: event.clientX,
        startY: event.clientY,
        rects: [],
        cardId: event.target,
        previewEl: clone,
        candidateCell: null,
        prevCandidateCell: null
    };

    event.target.setPointerCapture(event.pointerId);

    console.log(dragContext.startX, dragContext.startY);

    for (let cell of boardCell) {
        const rect = cell.getBoundingClientRect();
        dragContext.rects.push(rect);
    }

    console.log(dragContext.rects);
});

card.addEventListener("pointermove", (event) => {
    console.log(dragContext.previewEl)
    if (!isDraggable || dragContext === null) {
        return
    }
    else {
        let x = event.clientX;
        let y = event.clientY;
        let candidateCell = null;

        let dx = x - dragContext.startX;
        let dy = y - dragContext.startY;

        dragContext.previewEl.style.transform = `translate(${dx}px, ${dy}px)`;

        for (let entry of dragContext.rects) {
            const rect = entry.rect;

            if ((rect.left <= x && x <= rect.right) && (rect.top <= y && y <= rect.bottom)) {
                candidateCell = entry.cell;
                break;
            }
        }

        dragContext.candidateCell = candidateCell;

        if (candidateCell !== dragContext.prevCandidateCell) {
            if (dragContext.prevCandidateCell) {
                dragContext.prevCandidateCell.classList.remove('drop-hover');
            }

            if (candidateCell) {
                candidateCell.classList.add('drop-hover');
            }

            dragContext.prevCandidateCell = candidateCell;
        }
    }
})