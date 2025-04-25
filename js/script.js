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
  const previewDesc = document.getElementById("preview-description");
  const credits = document.getElementById("credits");
  const creditText = document.createElement("a");

  clearTimeout(previewImg._videoTimeout);

  const existingVideo = document.getElementById("preview-video");
  if (existingVideo) existingVideo.remove();

  previewImg.classList.remove("fade-out");
  previewImg.style.opacity = "1";

  previewImg.crossOrigin = "anonymous";
  previewImg.src = game.image;
  previewImg.alt = game.title;
  previewImg.style.display = "block";

  previewDesc.textContent = game.description || "";
  previewDesc.style.display = game.description ? "block" : "none";

  credits.style.display = game.creditText ? "block" : "none";
  credits.innerHTML = "Created by ";
  creditText.textContent = game.creditText || "";
  creditText.href = game.creditLink || "#";
  creditText.target = "_blank";
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

  const themeClass = game.theme || "theme-auto";

  const applyThemeFromImage = () => {
    try {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(previewImg, 5);

      const [r1, g1, b1] = palette[0];
      const backgroundColor = `rgba(${r1}, ${g1}, ${b1}, 0.85)`;
      const darker = `rgb(${Math.max(0, r1 - 40)}, ${Math.max(0, g1 - 40)}, ${Math.max(
        0,
        b1 - 40
      )})`;

      const luminance = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;
      const fontColor = luminance < 128 ? "#ffffff" : "#000000";

      if (!document.getElementById(`style-${themeClass}`)) {
        const style = document.createElement("style");
        style.id = `style-${themeClass}`;
        style.textContent = `
          .${themeClass} {
            --background-color: ${backgroundColor};
            --border-gradient-start: ${backgroundColor};
            --border-gradient-end: ${darker};
            --text-color: ${fontColor};
            --border-color: ${fontColor};
          }
        `;
        document.head.appendChild(style);
      }

      previewDesc.classList.add(themeClass);
      credits.classList.add(themeClass);
    } catch (err) {
      console.warn("Color extraction failed:", err);
    }
  };

  if (previewImg.complete) {
    applyThemeFromImage();
  } else {
    previewImg.onload = applyThemeFromImage;
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
