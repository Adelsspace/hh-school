document.addEventListener("DOMContentLoaded", () => {
  const sourceZone = document.getElementById("source-zone");
  const gridZone = document.getElementById("grid-zone");
  const freeZone = document.getElementById("free-zone");
  let currentDragged = null;
  let dragOffset = { x: 0, y: 0 };

  function createElement() {
    const div = document.createElement("div");
    div.className = "draggable";
    div.draggable = true;
    div.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
    return div;
  }

  function maintainSource() {
    while (sourceZone.children.length < 5) {
      const newElement = createElement();
      sourceZone.appendChild(newElement);
    }
  }

  function handleDragStart(e) {
    currentDragged = e.target;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const rect = currentDragged.getBoundingClientRect();
    dragOffset = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    currentDragged.style.opacity = "0.4";
  }
  function handleDrop(e, element) {
    e.preventDefault();
    const zone = e.target.closest(".zone");
    const clientX = e.clientX || e.changedTouches[0].clientX;
    const clientY = e.clientY || e.changedTouches[0].clientY;
    if (!zone) {
      element.remove();
      maintainSource();
      return;
    }

    const rectGrid = gridZone.getBoundingClientRect();
    const rectFree = freeZone.getBoundingClientRect();

    if (
      clientX >= rectGrid.x &&
      clientX + rectGrid.width >= rectGrid.x + rectGrid.width &&
      clientY >= rectGrid.y &&
      clientY + rectGrid.height >= rectGrid.y + rectGrid.height
    ) {
      const x = clientX - rectGrid.left - dragOffset.x;
      const y = clientY - rectGrid.top - dragOffset.y;

      if (
        x >= 0 &&
        y >= 0 &&
        x + element.offsetWidth <= rectGrid.width &&
        y + element.offsetHeight <= rectGrid.height
      ) {
        element.style.position = "static";
        gridZone.appendChild(element);
      } else {
        element.remove();
      }
    }
    if (
      clientX >= rectFree.x &&
      clientX + rectFree.width >= rectFree.x + rectFree.width &&
      clientY >= rectFree.y &&
      clientY + rectFree.height >= rectFree.y + rectFree.height
    ) {
      freeZone.appendChild(element);
      const x = clientX - rectFree.left - dragOffset.x;
      const y = clientY - rectFree.top - dragOffset.y;

      if (
        x >= 0 &&
        y >= 0 &&
        x + element.offsetWidth <= rectFree.width &&
        y + element.offsetHeight <= rectFree.height
      ) {
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
      } else {
        element.remove();
      }
    }

    if (element.parentElement !== sourceZone) {
      maintainSource();
    }
  }

  document.addEventListener("dragover", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => handleDrop(e, currentDragged));

  document.body.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) handleDragStart(e);
  });

  document.body.addEventListener("dragend", () => {
    if (currentDragged) {
      currentDragged.style.opacity = "1";
      if (currentDragged.parentElement === sourceZone) {
        currentDragged.style.position = "static";
      }
      currentDragged = null;
    }
  });

  document.body.addEventListener("touchstart", (e) => {
    if (e.target.classList.contains("draggable")) {
      handleDragStart(e);
    }
  });

  document.body.addEventListener("touchmove", (e) => {
    if (currentDragged) {
      const touch = e.touches[0];
      currentDragged.style.position = "absolute";
      currentDragged.style.left = `${touch.clientX - dragOffset.x}px`;
      currentDragged.style.top = `${touch.clientY - dragOffset.y}px`;
    }
  });

  document.body.addEventListener("touchend", (e) => {
    if (currentDragged) {
      handleDrop(e, currentDragged);
      currentDragged.style.opacity = "1";
      currentDragged = null;
    }
  });

  maintainSource();
});
