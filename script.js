const CAT_URL = "https://api.thecatapi.com/v1/images/search";
const cats = document.querySelector(".target");
const btn = document.querySelector(".gen-btn");
const downloadBtn = document.querySelector(".download");
const liveBtn = document.querySelector(".live");
const fullscreenBtn = document.querySelector(".fullscreen");
const modeBtn = document.querySelector(".mode");
const body = document.body;
// buffers
let liveViewInterval = null;
let isLiveViewActive = false;
let fullscreenView = false;
let theme = "light";
// fetch and display cat image

async function generateCat() {
  try {
    btn.textContent = "Loading...";
    const response = await fetch(CAT_URL);
    const data = await response.json();
    const imgURL = data[0].url;
    cats.innerHTML = `<img src="${imgURL}" alt="Cute Cat" />`;
    btn.textContent = "Generate Cat";
  } catch (error) {
    console.error("Error fetching cat image:", error);
    btn.textContent = "Generate Cat";
  }
}

// download cat image

function downloadCat() {
  const img = cats.querySelector("img");
  if (img) {
    const link = document.createElement("a");
    link.href = img.src;
    link.download = "cute-cat.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
// fullscreen live view

function openFullscreenLiveView() {
  if (!fullscreenView) {
    body.innerHTML = `
            <div class="fullscreen-view">
                <button class="btn bottom-corner exit-fullscreen">Exit Fullscreen</button>
                <div class="cat-container fullscreen-cat" style=" display: flex; justify-content: center; align-items: center;">
                    ${cats.innerHTML}
                </div>
                <button class="pause-live btn">👀</button>
            </div>
            `;
  }
  fullscreenView = true;
  generateCat();
  liveViewInterval = setInterval(() => {
    const catContainer = document.querySelector(".cat-container");
    if (catContainer) {
      generateCat().then(() => {
        catContainer.innerHTML = cats.innerHTML;
        catContainer.querySelector("img").style.height = "100%";
      });
    }
  }, 5000);
  // pause live view button
  const pauseLiveBtn = document.querySelector(".pause-live");
  let isPaused = false;
  if (pauseLiveBtn) {
    pauseLiveBtn.addEventListener("click", () => {
      if (isPaused) {
        // Resume live view
        liveViewInterval = setInterval(() => {
          const catContainer = document.querySelector(".cat-container");
          if (catContainer) {
            generateCat().then(() => {
              catContainer.innerHTML = cats.innerHTML;
              catContainer.querySelector("img").style.height = "100%";
            });
          }
        }, 5000);
        pauseLiveBtn.textContent = "👀";
        isPaused = false;
      } else {
        // Pause live view
        clearInterval(liveViewInterval);
        pauseLiveBtn.textContent = "⏸️";
        isPaused = true;
      }
    });
  }
  if (fullscreenView) {
    const exitBtn = document.querySelector(".exit-fullscreen");
    exitBtn.addEventListener("click", () => {
      fullscreenView = false;
      location.reload();
      clearInterval(liveViewInterval);
      document.documentElement.style.colorScheme = theme; // Restore theme
    });
  }
}

// toggle mode
modeBtn.addEventListener("click", () => {
  // Get the current computed color scheme
  const currentScheme = getComputedStyle(document.documentElement).colorScheme;
  console.log("Current color scheme:", currentScheme);
  // Toggle between light and dark
  if (!currentScheme.includes("dark") || theme === "light") {
    document.documentElement.style.colorScheme = "dark";
    theme = "dark";
  } else {
    document.documentElement.style.colorScheme = "light";
    theme = "light";
  }
});

// live view functionality every 5 seconds

liveBtn.addEventListener("click", () => {
  if (isLiveViewActive) {
    clearInterval(liveViewInterval);
    liveBtn.textContent = "😽";
    isLiveViewActive = false;
  } else {
    generateCat();
    liveViewInterval = setInterval(generateCat, 10000);
    liveBtn.textContent = "🐈";
    isLiveViewActive = true;
  }
});
// Event listeners
btn.addEventListener("click", generateCat);
downloadBtn.addEventListener("click", downloadCat);
fullscreenBtn.addEventListener("click", openFullscreenLiveView);
