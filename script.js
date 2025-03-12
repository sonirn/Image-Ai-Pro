const API_KEY = "sk-4bd6535dbe254768be64b798cb53e623";  // Replace with your API key
const API_URL = "https://api.deepseek.com/v1/generate"; // API endpoint

const generateBtn = document.getElementById("generateBtn");
const imageContainer = document.getElementById("imageContainer");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("historyContainer");

// Function to fetch image from DeepSeek API
async function fetchImage(prompt) {
    loading.style.display = "block";
    imageContainer.innerHTML = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: prompt, model: "janus-pro" })
        });

        const data = await response.json();
        loading.style.display = "none";

        if (data && data.image_url) {
            const imgUrl = data.image_url;
            displayImage(imgUrl, prompt);
            saveToHistory(prompt, imgUrl);
        } else {
            alert("No images found! Try a different prompt.");
        }
    } catch (error) {
        loading.style.display = "none";
        alert("Error fetching image: " + error.message);
    }
}

// Function to display the generated image
function displayImage(imgUrl, prompt) {
    const imgWrapper = document.createElement("div");
    
    const img = document.createElement("img");
    img.src = imgUrl;
    
    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download";
    downloadBtn.classList.add("download-btn");
    downloadBtn.onclick = () => downloadImage(imgUrl, prompt);

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(downloadBtn);
    imageContainer.appendChild(imgWrapper);
}

// Function to save images to history
function saveToHistory(prompt, imgUrl) {
    let history = JSON.parse(localStorage.getItem("imageHistory")) || [];
    history.push({ prompt, imgUrl });
    localStorage.setItem("imageHistory", JSON.stringify(history));
    loadHistory();
}

// Function to load history on page load
function loadHistory() {
    historyContainer.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("imageHistory")) || [];

    history.forEach(item => {
        const imgWrapper = document.createElement("div");

        const img = document.createElement("img");
        img.src = item.imgUrl;

        const caption = document.createElement("p");
        caption.textContent = item.prompt;

        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download";
        downloadBtn.classList.add("download-btn");
        downloadBtn.onclick = () => downloadImage(item.imgUrl, item.prompt);

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(caption);
        imgWrapper.appendChild(downloadBtn);
        historyContainer.appendChild(imgWrapper);
    });
}

// Function to download an image
function downloadImage(imgUrl, prompt) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `${prompt.replace(/\s+/g, "_")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listener for button click
generateBtn.addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    if (prompt) fetchImage(prompt);
});

// Load history on page load
window.onload = loadHistory;
