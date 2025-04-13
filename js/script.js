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

  previewImg.src = game.image;
  previewImg.alt = game.title;
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

  const themeClass = game.theme || "theme-green";

  if (themeClass.startsWith("theme-")) {
    previewDesc.classList.add(themeClass);
    credits.classList.add(themeClass);
  }
}

function updateActiveGame() {
  gameElements.forEach((el, i) => {
    el.classList.toggle("active", i === currentIndex);
  });

  gameElements[currentIndex].scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  updatePreview(games[currentIndex]);
}

const overlay = document.getElementById("overlay");
const iframe = document.getElementById("game-iframe");
const closeBtn = document.getElementById("close-overlay");

function openOverlay(url) {
  iframe.src = url;
  overlay.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
  iframe.src = ""; // clear the iframe
  overlay.classList.add("hidden");
});
