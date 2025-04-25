const gamesContainer = document.getElementById("games");

games.forEach((game) => {
  const gameLink = document.createElement("a");
  gameLink.href = "#";
  gameLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (game.embed) {
      openOverlay(game.link);
    } else {
      window.open(game.link, "_blank");
    }
  });

  gameLink.classList.add("game");

  gameLink.innerHTML = `<h2>${game.title}</h2>`;
  gamesContainer.appendChild(gameLink);
});
let currentIndex = 0;

const gameElements = document.querySelectorAll(".game");

updateActiveGame();

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    currentIndex = (currentIndex + 1) % gameElements.length;
    updateActiveGame();
  } else if (e.key === "ArrowUp") {
    currentIndex = (currentIndex - 1 + gameElements.length) % gameElements.length;
    updateActiveGame();
  } else if (e.key === "Enter") {
    gameElements[currentIndex].click();
  }
});

gameElements.forEach((el, index) => {
  el.addEventListener("click", () => {
    currentIndex = index;
    updateActiveGame();
  });
});

function updatePreview(game) {
  const previewImg = document.getElementById("preview-image");
  const previewVideo = document.getElementById("preview-video");
  const previewDesc = document.getElementById("preview-description");
  const credits = document.getElementById("credits");
  const creditText = document.createElement("a");

  clearTimeout(previewImg._videoTimeout);

  const existingVideo = document.getElementById("preview-video");
  if (existingVideo) existingVideo.remove();
  previewImg.classList.remove("fade-out");
  previewImg.style.opacity = "1";

  previewImg.style.opacity = "1";
  previewImg.style.display = "block";
  previewImg.classList.remove("fade-out");

  previewImg.src = game.image;
  previewImg.alt = game.title;
  previewImg.style.display = "block";

  previewDesc.textContent = game.description;
  previewDesc.style.display = game.description ? "block" : "none";
  credits.style.display = game.creditText ? "block" : "none";
  creditText.textContent = game.creditText;
  creditText.href = game.creditLink;
  creditText.target = "_blank";
  credits.innerHTML = "Created by ";
  credits.appendChild(creditText);

  previewDesc.className = "preview-box";
  credits.className = "preview-box";

  const oldWarning = document.getElementById("embed-warning");
  if (oldWarning) oldWarning.remove();

  if (!game.embed) {
    const warningDiv = document.createElement("div");
    warningDiv.id = "embed-warning";
    warningDiv.className = "preview-box warning";
    warningDiv.textContent =
      "⚠️ This game will open in a new tab. Please return to this tab when you are done playing.";
    credits.after(warningDiv);
  }

  const themeClass = game.theme || "theme-green";
  if (themeClass.startsWith("theme-")) {
    previewDesc.classList.add(themeClass);
    credits.classList.add(themeClass);
  }

  if (game.video) {
    previewImg._videoTimeout = setTimeout(() => {
      const videoEl = document.createElement("video");
      videoEl.id = "preview-video";
      videoEl.src = game.video;
      videoEl.autoplay = true;
      videoEl.muted = true;
      videoEl.loop = false;
      videoEl.playsInline = true;
      videoEl.style.maxWidth = "100%";
      videoEl.style.borderRadius = "8px";

      previewImg.parentElement.insertBefore(videoEl, previewImg.nextSibling);

      requestAnimationFrame(() => {
        videoEl.classList.add("fade-in");
        previewImg.classList.add("fade-out");
      });

      videoEl.addEventListener("ended", () => {
        videoEl.remove();
        previewImg.classList.remove("fade-out");
        previewImg.style.opacity = "1";
      });
    }, 3000);
  }
}

function updateActiveGame() {
  gameElements.forEach((el, i) => {
    el.classList.toggle("active", i === currentIndex);
  });

  const activeElement = gameElements[currentIndex];
  const gamesContainer = document.getElementById("games");

  const elementTop = activeElement.offsetTop;
  const elementHeight = activeElement.offsetHeight;
  const containerHeight = gamesContainer.clientHeight;

  gamesContainer.scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;

  updatePreview(games[currentIndex]);
}

const overlay = document.getElementById("overlay");
const iframe = document.getElementById("game-iframe");
const closeBtn = document.getElementById("close-overlay");
const disclaimer = document.getElementById("disclaimer-text");
const openDisclaimerBtn = document.getElementById("open-disclaimer");
const overlayContent = document.querySelector(".overlay-content");

function openOverlay(url) {
  overlay.classList.remove("hidden");
  overlay.classList.remove("disclaimer-mode");
  overlayContent.classList.remove("disclaimer-mode");
  disclaimer.classList.add("hidden");
  iframe.src = url;
  iframe.style.opacity = "1";
  iframe.style.pointerEvents = "auto";
}

openDisclaimerBtn.addEventListener("click", () => {
  overlay.classList.remove("hidden");
  overlay.classList.add("disclaimer-mode");
  disclaimer.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
  overlay.classList.remove("disclaimer-mode");
  overlayContent.classList.remove("disclaimer-mode");
  disclaimer.classList.add("hidden");
  iframe.src = "";
  iframe.style.opacity = "1";
  iframe.style.pointerEvents = "auto";
});
