(() => {
  const DEFAULTS = { hideShorts: true, hidePlayables: true };

  // Accueil 2026 :
  // ytd-rich-section-renderer > ytd-rich-shelf-renderer[is-shorts]
  //   > ytm-shorts-lockup-view-model-v2 > a.reel-item-endpoint[href^="/shorts/"]
  const SHORTS_SHELF =
    "ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, ytm-reel-shelf-renderer";
  const SHORTS_LOCKUP =
    "ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2";
  const SHORTS_LINK =
    'a.reel-item-endpoint[href^="/shorts/"], a.shortsLockupViewModelHostEndpoint[href^="/shorts/"], a[href^="/shorts/"]';
  // Jeux intégrés (Playables) :
  // ytd-rich-shelf-renderer > a[href="/playables"] + ytd-mini-game-card-view-model
  const PLAYABLES_LINK = 'a[href="/playables"], a[href^="/playables/"]';
  const PLAYABLES_CARD =
    "ytd-mini-game-card-view-model, mini-game-card-view-model";
  const SECTION =
    "ytd-rich-section-renderer, ytm-rich-section-renderer";
  const ITEM =
    "ytd-rich-item-renderer, ytm-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytd-compact-video-renderer";

  let bootstrapped = false;

  function apply(settings) {
    document.documentElement.classList.toggle(
      "ac-hide-shorts",
      settings.hideShorts !== false
    );
    document.documentElement.classList.toggle(
      "ac-hide-playables",
      settings.hidePlayables !== false
    );
  }

  function nuke(el) {
    if (!el || !el.isConnected) return;
    // YouTube réécrit souvent display — on retire le nœud
    try {
      el.remove();
    } catch {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
    }
  }

  function isShortsShelf(shelf) {
    if (!shelf) return false;
    if (shelf.hasAttribute("is-shorts")) return true;
    if (shelf.tagName === "YTD-REEL-SHELF-RENDERER" || shelf.tagName === "YTM-REEL-SHELF-RENDERER") {
      return true;
    }
    if (shelf.querySelector(SHORTS_LOCKUP)) return true;
    if (shelf.querySelector(SHORTS_LINK)) return true;
    const title = shelf.querySelector("#title");
    if (title && (title.textContent || "").trim().toLowerCase() === "shorts") {
      return true;
    }
    return false;
  }

  function playablesTitleMatch(text) {
    const t = (text || "").trim().toLowerCase();
    return t.includes("jeux intégrés") || t.includes("playables");
  }

  function isPlayablesShelf(shelf) {
    if (!shelf) return false;
    if (shelf.querySelector(PLAYABLES_CARD)) return true;
    if (shelf.querySelector(PLAYABLES_LINK)) return true;
    if (shelf.querySelector("ytd-rich-item-renderer[is-mini-game-card-shelf]")) {
      return true;
    }
    const title = shelf.querySelector("#title");
    if (title && playablesTitleMatch(title.textContent)) return true;
    return false;
  }

  function hideShorts() {
    if (!document.documentElement.classList.contains("ac-hide-shorts")) return;

    document.querySelectorAll(SHORTS_SHELF).forEach((shelf) => {
      if (!isShortsShelf(shelf)) return;
      nuke(shelf.closest(SECTION) || shelf);
    });

    document
      .querySelectorAll("ytd-rich-shelf-renderer:not([is-shorts])")
      .forEach((shelf) => {
        if (!isShortsShelf(shelf)) return;
        nuke(shelf.closest(SECTION) || shelf);
      });

    document.querySelectorAll(SECTION).forEach((section) => {
      if (
        section.querySelector(
          `ytd-rich-shelf-renderer[is-shorts], ${SHORTS_LOCKUP}, ${SHORTS_LINK}`
        )
      ) {
        nuke(section);
      }
    });

    document
      .querySelectorAll(
        `ytd-rich-item-renderer:has(${SHORTS_LOCKUP}), ytd-rich-item-renderer:has(${SHORTS_LINK}), ytd-grid-video-renderer:has(a[href^="/shorts/"]), ytd-video-renderer:has(a[href^="/shorts/"]), ytd-compact-video-renderer:has(a[href^="/shorts/"])`
      )
      .forEach(nuke);

    document.querySelectorAll(`${SHORTS_LOCKUP}, ${SHORTS_LINK}`).forEach((el) => {
      nuke(el.closest(SECTION) || el.closest(ITEM) || el);
    });

    document
      .querySelectorAll(
        'ytd-guide-entry-renderer a[href="/shorts"], ytd-guide-entry-renderer a[href="/shorts/"], ytd-mini-guide-entry-renderer a[href="/shorts"], ytd-mini-guide-entry-renderer a[href="/shorts/"], ytd-mini-guide-entry-renderer a[title="Shorts"], ytd-mini-guide-entry-renderer a[aria-label="Shorts"], ytd-guide-entry-renderer a[title="Shorts"], ytd-guide-entry-renderer a[aria-label="Shorts"]'
      )
      .forEach((a) => {
        nuke(
          a.closest(
            "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, tp-yt-paper-item"
          ) || a
        );
      });
  }

  function hidePlayables() {
    if (!document.documentElement.classList.contains("ac-hide-playables")) return;

    document
      .querySelectorAll(
        "ytd-rich-shelf-renderer, ytm-rich-shelf-renderer"
      )
      .forEach((shelf) => {
        if (!isPlayablesShelf(shelf)) return;
        nuke(shelf.closest(SECTION) || shelf);
      });

    document.querySelectorAll(SECTION).forEach((section) => {
      if (
        section.querySelector(
          `${PLAYABLES_CARD}, ${PLAYABLES_LINK}, ytd-rich-item-renderer[is-mini-game-card-shelf]`
        )
      ) {
        nuke(section);
      }
    });

    document
      .querySelectorAll(
        `ytd-rich-item-renderer[is-mini-game-card-shelf], ytd-rich-item-renderer:has(${PLAYABLES_CARD}), ytd-rich-item-renderer:has(${PLAYABLES_LINK})`
      )
      .forEach(nuke);

    document.querySelectorAll(`${PLAYABLES_CARD}, ${PLAYABLES_LINK}`).forEach((el) => {
      nuke(el.closest(SECTION) || el.closest(ITEM) || el);
    });

    document
      .querySelectorAll(
        'ytd-guide-entry-renderer a[href="/playables"], ytd-guide-entry-renderer a[href^="/playables"], ytd-mini-guide-entry-renderer a[href="/playables"], ytd-mini-guide-entry-renderer a[href^="/playables"]'
      )
      .forEach((a) => {
        nuke(
          a.closest(
            "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, tp-yt-paper-item"
          ) || a
        );
      });
  }

  function scan() {
    hideShorts();
    hidePlayables();
  }

  function refresh() {
    chrome.storage.sync.get(DEFAULTS, (stored) => {
      const shortsOn = stored.hideShorts !== false;
      const playablesOn = stored.hidePlayables !== false;
      const wasShorts = document.documentElement.classList.contains("ac-hide-shorts");
      const wasPlayables = document.documentElement.classList.contains(
        "ac-hide-playables"
      );

      // Réafficher : les nœuds ont été retirés → reload (pas au premier boot)
      if (
        bootstrapped &&
        ((wasShorts && !shortsOn) || (wasPlayables && !playablesOn))
      ) {
        location.reload();
        return;
      }

      apply({ hideShorts: shortsOn, hidePlayables: playablesOn });
      if (shortsOn || playablesOn) scan();
      bootstrapped = true;
    });
  }

  apply(DEFAULTS);
  refresh();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    if ("hideShorts" in changes || "hidePlayables" in changes) refresh();
  });

  let scheduled = false;
  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  }

  const startObserver = () => {
    scan();
    new MutationObserver(scheduleScan).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  } else {
    startObserver();
  }

  [300, 800, 1500, 3000, 6000].forEach((ms) => setTimeout(scan, ms));
  setInterval(scan, 2000);
})();
