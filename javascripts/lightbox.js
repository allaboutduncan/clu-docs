document.addEventListener("DOMContentLoaded", function() {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  document.body.appendChild(overlay);

  // Create image element inside overlay
  const overlayImage = document.createElement("img");
  overlay.appendChild(overlayImage);

  // Close when clicking overlay
  overlay.addEventListener("click", function() {
    overlay.classList.remove("active");
    // Wait for transition before hiding
    setTimeout(() => {
      if(!overlay.classList.contains("active")) {
          overlay.style.display = "none";
      }
    }, 300);
  });

  // Attach click to all content images
  const images = document.querySelectorAll('.md-content img:not(.twemoji)');
  
  images.forEach(img => {
    // Exclude images that are inside links
    if (img.parentElement.tagName.toLowerCase() === 'a') {
      return;
    }
    
    img.style.cursor = "pointer";
    img.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      overlayImage.src = this.src;
      overlay.style.display = "flex";
      // Force reflow
      void overlay.offsetWidth;
      overlay.classList.add("active");
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      overlay.click();
    }
  });
});
