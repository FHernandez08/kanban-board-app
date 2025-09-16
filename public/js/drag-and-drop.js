const card = document.getElementById("test-card");
const boardCell = document.getElementsByClassName("board-cell");

// variables for when the drag event starts
let isDraggable = false;
let startX, startY;
let dragContext = null;

// helpers for the count functionality
function getHeaderCountEl(status) {
  return document.querySelector(`.board-header[data-status="${status}"] .count`);
}
function incrementCount(status) {
  const el = getHeaderCountEl(status);
  if (!el) return;
  const n = parseInt(el.textContent || "0", 10) || 0;
  el.textContent = String(n + 1);
}
function decrementCount(status) {
  const el = getHeaderCountEl(status);
  if (!el) return;
  const n = parseInt(el.textContent || "0", 10) || 0;
  el.textContent = String(Math.max(0, n - 1));
}


card.addEventListener("pointerdown", (event) => {
    isDraggable = true;

    if (dragContext?.previewEl) {
    dragContext.previewEl.remove();
    dragContext = null;
}


    const clone = event.target.cloneNode(true);
    clone.classList.add("drag-preview");
    clone.style.position = "fixed";
    clone.style.pointerEvents = "none";
    clone.style.opacity = "0.7";
    clone.style.zIndex = "1000";
    clone.style.left = event.clientX + "px";
    clone.style.top = event.clientY + "px";

    document.body.append(clone);

    const cardEl = event.target.closest(".card") || event.target;
    const sourceCell = cardEl.closest(".board-cell");

    dragContext = {
        startX: event.clientX,
        startY: event.clientY,
        rects: [],
        cardId: cardEl,
        previewEl: clone,
        candidateCell: null,
        prevCandidateCell: null,
        sourceCell,
    };

    event.target.setPointerCapture(event.pointerId);

    for (let cell of boardCell) {
        const rect = cell.getBoundingClientRect();
        dragContext.rects.push({ cell, rect });
    }
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
            };
        };

        dragContext.candidateCell = candidateCell;

        if (candidateCell !== dragContext.prevCandidateCell) {
            if (dragContext.prevCandidateCell) {
                dragContext.prevCandidateCell.classList.remove('drop-hover');
            }

            if (candidateCell) {
                candidateCell.classList.add('drop-hover');
            };

            dragContext.prevCandidateCell = candidateCell;
        };
    };
});


card.addEventListener("pointerup", (event) => {
  if (!isDraggable || dragContext === null) return;

  isDraggable = false;

  if (!dragContext.candidateCell) {
    if (dragContext.prevCandidateCell) {
      dragContext.prevCandidateCell.classList.remove("drop-hover");
    }
    if (dragContext.previewEl) dragContext.previewEl.remove();
    dragContext = null;
    return;
  }

  // Commit path: stick the real card
  const targetCell = dragContext.candidateCell;
  const sourceCell = dragContext.sourceCell;

  targetCell.append(dragContext.cardId);

  const targetStatus = targetCell.dataset.status;
  const sourceStatus = sourceCell.dataset.status;

  console.log({ sourceStatus, targetStatus });

  if (targetStatus !== sourceStatus) {
    decrementCount(sourceStatus);
    incrementCount(targetStatus);
  }
  
  if (dragContext.prevCandidateCell) {
    dragContext.prevCandidateCell.classList.remove("drop-hover");
  }
  if (dragContext.previewEl) dragContext.previewEl.remove();
  dragContext = null;
  isDraggable = false;
});