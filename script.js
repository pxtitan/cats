const CAT_URL = "https://api.thecatapi.com/v1/images/search";
const cats = document.querySelector(".cat-target");
const btn = document.querySelector(".cat-btn");
const downloadBtn = document.querySelector(".download");

btn.addEventListener("click", catFetch);
downloadBtn.addEventListener("click", downloadCatImage);
window.addEventListener("DOMContentLoaded", catFetch);

async function catFetch() {
    try {
        btn.disabled = true;
        btn.textContent = "Loading...";
        downloadBtn.disabled = true;

        const response = await fetch(CAT_URL);
        const data = await response.json();
        const imageUrl = data?.[0]?.url;

        if (!imageUrl) {
            throw new Error("No image returned from API");
        }

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Random cat";
        img.style.width = "80%";
        img.style.height = "auto";

        cats.innerHTML = "";
        cats.appendChild(img);
        downloadBtn.disabled = false;
    } catch (error) {
        console.error("Error fetching cat image:", error);
        alert("Could not load a cat right now. Please try again.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Generate Cat";
    }
}

async function downloadCatImage() {
    const img = document.querySelector(".cat-target img");
    
    if (img) {
        try {
            downloadBtn.disabled = true;

            const response = await fetch(img.src);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = "cat_image.jpg";
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading cat image:", error);
            // Fallback: open the image in a new tab if blob download fails (e.g., CORS edge cases)
            const anchor = document.createElement("a");
            anchor.href = img.src;
            anchor.target = "_blank";
            anchor.rel = "noopener";
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            alert("Direct download failed. Opened image in a new tab—use Save As.");
        }
    } else {
        alert("No cat image to download!");
    }

    if (downloadBtn) {
        downloadBtn.disabled = false;
    }
}