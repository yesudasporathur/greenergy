function zoomImage(event) {
    const container = document.querySelector('.image-container');
    const image = document.getElementById('zoomedImage');
    
    // Get container dimensions
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Get mouse position relative to container
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    
    // Calculate zoom level based on mouse position
    const zoomLevel = 1.5; // Adjust as needed
    const zoomX = mouseX / containerWidth;
    const zoomY = mouseY / containerHeight;
    
    // Apply zoom and position adjustments
    image.style.transformOrigin = `${zoomX * 100}% ${zoomY * 100}%`;
    image.classList.add('zoomedImage-zoomed');
}

function resetZoom() {
    const image = document.getElementById('zoomedImage');
    image.classList.remove('zoomedImage-zoomed');
}