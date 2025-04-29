document.addEventListener("DOMContentLoaded", () => {
  const MORE_GAMES_PREVIEW_IMAGE = "/img/more_games.jpg";

  const gamesContainer = document.getElementById("games");
  const overlay = document.getElementById("overlay");
  const overlayContent = document.querySelector(".overlay-content");
  const iframe = document.getElementById("game-iframe");
  const disclaimer = document.getElementById("disclaimer-text");
  const moreGamesText = document.getElementById("more-games-overlay-text");
  const closeBtn = document.getElementById("close-overlay");
  const openDisclaimerBtn = document.getElementById("open-disclaimer");

  if (!gamesContainer) return;

  games.forEach((g) => (new Image().src = g.image));
  new Image().src = MORE_GAMES_PREVIEW_IMAGE;

  const frag = document.createDocumentFragment();

  games.forEach((game) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "game";
    a.innerHTML = `<h2>${game.title}</h2>`;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      game.embed ? openOverlay(game.link) : window.open(game.link, "_blank");
    });
    frag.appendChild(a);
  });

  const moreBtn = document.createElement("a");
  moreBtn.href = "#";
  moreBtn.className = "game more-games";
  moreBtn.innerHTML = "<h2>More games…</h2>";
  moreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openMoreGamesOverlay();
  });
  frag.appendChild(moreBtn);

  gamesContainer.appendChild(frag);

  const gameElements = [...gamesContainer.querySelectorAll(".game")];
  let currentIndex = 0;
  updateActiveGame();

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      currentIndex = (currentIndex + 1) % gameElements.length;
      updateActiveGame();
    }
    if (e.key === "ArrowUp") {
      currentIndex = (currentIndex - 1 + gameElements.length) % gameElements.length;
      updateActiveGame();
    }
    if (e.key === "Enter") {
      gameElements[currentIndex].click();
    }
  });

  gameElements.forEach((el, i) => {
    el.addEventListener("click", () => {
      currentIndex = i;
      updateActiveGame();
    });
    el.addEventListener("mouseenter", () => {
      currentIndex = i;
      setActiveGame(i, false);
    });
  });

  function openOverlay(url) {
    overlay.classList.remove("hidden", "disclaimer-mode");
    overlayContent.classList.remove("disclaimer-mode");
    disclaimer.classList.add("hidden");
    moreGamesText?.classList.add("hidden");
    iframe.src = url;
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
    resetOverlayStyling();
  }

  function openMoreGamesOverlay() {
    overlay.classList.remove("hidden");
    overlay.classList.add("disclaimer-mode");
    overlayContent.classList.add("disclaimer-mode");

    overlay.style.backgroundColor = "rgba(0,0,0,0.95)";
    overlayContent.style.backgroundColor = "transparent";
    overlayContent.style.color = "#fff";

    disclaimer.classList.add("hidden");
    moreGamesText.classList.remove("hidden");

    const linksHTML = (more_games || [])
      .map((l) => `<li><a href="${l.link}" target="_blank">${l.title}</a></li>`)
      .join("");
    moreGamesText.innerHTML = `<h2>More Games</h2><p>We weren’t able to embed these games due to the festival’s setup — but you should still check them out:</p><ul class="more-games-list">${linksHTML}</ul>`;

    iframe.src = "";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.display = "none";
  }

  function resetOverlayStyling() {
    overlay.style.backgroundColor = "";
    overlayContent.style.backgroundColor = "";
    overlayContent.style.color = "";
  }

  openDisclaimerBtn?.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    overlay.classList.add("disclaimer-mode");
    disclaimer.classList.remove("hidden");
    moreGamesText?.classList.add("hidden");
  });

  closeBtn?.addEventListener("click", () => {
    overlay.classList.add("hidden");
    overlay.classList.remove("disclaimer-mode");
    overlayContent.classList.remove("disclaimer-mode");
    disclaimer.classList.add("hidden");
    moreGamesText?.classList.add("hidden");
    iframe.src = "";
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
    iframe.style.display = "block";

    resetOverlayStyling();
  });

  function updatePreview(game) {
    const img = document.getElementById("preview-image");
    const desc = document.getElementById("preview-description");
    const creds = document.getElementById("credits");
    const creditLink = document.createElement("a");
    const previewMedia = document.getElementById("preview-media");
    if (!img) return;

    clearTimeout(img._videoTimeout);
    document.getElementById("preview-video")?.remove();

    img.classList.remove("fade-out");
    img.style.opacity = "1";
    img.crossOrigin = "anonymous";
    img.src = game.image;
    img.alt = game.title;
    img.style.display = "block";

    if (previewMedia) previewMedia.style.aspectRatio = "16 / 9";

    desc.textContent = game.description || "";
    desc.style.display = game.description ? "block" : "none";

    creds.style.display = game.creditText ? "block" : "none";
    creds.innerHTML = "Created by ";
    creditLink.textContent = game.creditText || "";
    creditLink.href = game.creditLink || "#";
    creditLink.target = "_blank";
    if (game.creditText) creds.appendChild(creditLink);

    desc.className = "preview-box";
    creds.className = "preview-box";

    document.getElementById("embed-warning")?.remove();
    if (!game.embed) {
      const warn = document.createElement("div");
      warn.id = "embed-warning";
      warn.className = "preview-box warning";
      warn.textContent =
        "⚠️ This game will open in a new tab. Please return to this tab when you are done playing.";
      creds.after(warn);
    }

    const themeClass = game.theme || "theme-auto";
    const applyTheme = () => {
      try {
        const ct = new ColorThief();
        const palette = ct.getPalette(img, 5);
        const [r, g, b] = palette[0];
        const bg = `rgba(${r},${g},${b},0.85)`;
        const dark = `rgb(${Math.max(r - 40, 0)},${Math.max(g - 40, 0)},${Math.max(b - 40, 0)})`;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const font = lum < 128 ? "#fff" : "#000";
        if (!document.getElementById(`style-${themeClass}`)) {
          const st = document.createElement("style");
          st.id = `style-${themeClass}`;
          st.textContent = `.${themeClass}{--background-color:${bg};--border-gradient-start:${bg};--border-gradient-end:${dark};--text-color:${font};--border-color:${font};}`;
          document.head.appendChild(st);
        }
        desc.classList.add(themeClass);
        creds.classList.add(themeClass);
      } catch (err) {
        console.warn("ColorThief failed", err);
      }
    };
    img.complete ? applyTheme() : (img.onload = applyTheme);

    if (game.video && !document.querySelector(".more-games.active")) {
      img._videoTimeout = setTimeout(() => {
        const vid = document.createElement("video");
        vid.id = "preview-video";
        vid.src = game.video;
        vid.autoplay = true;
        vid.muted = true;
        vid.loop = false;
        vid.playsInline = true;
        vid.style.maxWidth = "100%";
        vid.style.borderRadius = "8px";
        img.parentElement.insertBefore(vid, img.nextSibling);
        requestAnimationFrame(() => {
          vid.classList.add("fade-in");
          img.classList.add("fade-out");
        });
        vid.addEventListener("ended", () => {
          vid.remove();
          img.classList.remove("fade-out");
          img.style.opacity = "1";
        });
      }, 2000);
    }
  }

  function updateMoreGamesPreview() {
    const img = document.getElementById("preview-image");
    const desc = document.getElementById("preview-description");
    const creds = document.getElementById("credits");
    const previewMedia = document.getElementById("preview-media");
    if (!img) return;

    clearTimeout(img._videoTimeout);
    document.getElementById("preview-video")?.remove();

    img.src = MORE_GAMES_PREVIEW_IMAGE;
    img.alt = "More games teaser";
    img.style.display = "block";

    if (previewMedia) previewMedia.style.aspectRatio = "16 / 13";

    desc.textContent = "";
    desc.style.display = "none";

    creds.innerHTML = "";
    creds.style.display = "none";

    document.getElementById("embed-warning")?.remove();
  }

  function setActiveGame(idx, scroll = true) {
    gameElements.forEach((el, i) => el.classList.toggle("active", i === idx));
    if (scroll) {
      const el = gameElements[idx];
      gamesContainer.scrollTop =
        el.offsetTop - gamesContainer.clientHeight / 2 + el.offsetHeight / 2;
    }
    idx < games.length ? updatePreview(games[idx]) : updateMoreGamesPreview();
  }

  function updateActiveGame() {
    setActiveGame(currentIndex, true);
  }
});
