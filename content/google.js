(() => {
  const DEFAULTS = {
    hideAiOverview: true,
    hideAiMode: true,
    hideRelatedQuestions: true,
  };

  const CLASS_MAP = {
    hideAiOverview: "ac-hide-ai-overview",
    hideAiMode: "ac-hide-ai-mode",
    hideRelatedQuestions: "ac-hide-related-questions",
  };

  const MARK = {
    hideAiOverview: "data-ac-ai-overview",
    hideAiMode: "data-ac-ai-mode",
    hideRelatedQuestions: "data-ac-related",
  };

  // Racine Aperçu IA (échantillon FR 2026) :
  // <div data-mcpr class="YzCcne"> > .hdzaWe > [jscontroller=EYwa3d][data-aim=1]
  // Ne jamais cibler .YzCcne seul : d'autres blocs (ex. Liens associés) partagent la classe.
  const AI_OVERVIEW_SELECTORS = [
    ".YzCcne[data-mcpr]",
    '.YzCcne:has([jscontroller="EYwa3d"])',
    ".YzCcne:has(#m-x-content)",
    '[jscontroller="EYwa3d"][jsname="dEwkXc"]',
    '[jscontroller="EYwa3d"][data-aim="1"]',
  ];

  const AI_OVERVIEW_ROOT =
    ".YzCcne[data-mcpr], .YzCcne:has([jscontroller='EYwa3d']), .YzCcne:has(#m-x-content)";

  const AI_LABELS = [
    "ai overview",
    "aperçu ia",
    "aperçu par l'ia",
    "résumé ia",
    "visión general creada por la ia",
    "ki-übersicht",
    "panoramica ia",
  ];

  const AI_MODE_LABELS = ["mode ia", "ai mode", "modo ia"];

  const RELATED_QUESTIONS_LABELS = [
    "autres questions",
    "people also ask",
    "otras preguntas",
    "andere fragen",
    "outras perguntas",
  ];

  /** Marque l’élément — le CSS (classe html) masque ; désactiver le toggle le réaffiche sans F5. */
  function mark(el, attr) {
    if (!el || el.getAttribute(attr) === "1") return;
    el.setAttribute(attr, "1");
  }

  /** Remonte uniquement jusqu'au conteneur Aperçu IA, jamais un wrapper de résultats. */
  function aiOverviewRoot(el) {
    if (!el) return null;
    return (
      el.closest(AI_OVERVIEW_ROOT) ||
      el.closest('[jscontroller="EYwa3d"]') ||
      null
    );
  }

  function outermostAiModeTab(el) {
    return (
      el.closest('[role="listitem"]:has(a[href*="udm=50"]), [role="listitem"]:has([jsname="KliEFc"])') ||
      el.closest('[jsname="xBNgKe"][role="listitem"], [jsname="xBNgKe"], .olrp5b') ||
      el
    );
  }

  /** Conteneur « Autres questions » — s’arrête au bloc PAA, pas à un MjjYud générique. */
  function outermostRelatedQuestions(el) {
    return (
      el.closest('[jscontroller="Da4hkd"]') ||
      el.closest(".cUnQKe:has(.related-question-pair)") ||
      el.closest(".A6K0A:has(.related-question-pair)") ||
      el.closest(".ULSxyf:has(.related-question-pair)") ||
      el.closest(".MjjYud:has(.related-question-pair)") ||
      el.closest(".cUnQKe") ||
      el
    );
  }

  function apply(settings) {
    const root = document.documentElement;
    for (const [key, className] of Object.entries(CLASS_MAP)) {
      root.classList.toggle(className, settings[key] !== false);
    }
  }

  function refresh() {
    chrome.storage.sync.get(DEFAULTS, (stored) => {
      apply({ ...DEFAULTS, ...stored });
      cleanPage();
    });
  }

  function removeAiOverview() {
    if (!document.documentElement.classList.contains("ac-hide-ai-overview")) return;
    const attr = MARK.hideAiOverview;

    for (const selector of AI_OVERVIEW_SELECTORS) {
      document.querySelectorAll(selector).forEach((el) => {
        mark(aiOverviewRoot(el) || el, attr);
      });
    }

    document.querySelectorAll('[role="heading"], h1, h2, [jsname="cUzNTd"]').forEach((el) => {
      const text = (el.textContent || "").trim().toLowerCase();
      if (!text || text.length > 40) return;
      if (!AI_LABELS.some((l) => text === l || text.startsWith(l))) return;
      const root = aiOverviewRoot(el);
      if (root) mark(root, attr);
    });
  }

  function removeAiModeTab() {
    if (!document.documentElement.classList.contains("ac-hide-ai-mode")) return;
    const attr = MARK.hideAiMode;

    document
      .querySelectorAll('a[href*="udm=50"], a[href*="udm%3D50"]')
      .forEach((el) => mark(outermostAiModeTab(el), attr));

    document.querySelectorAll('[jsname="KliEFc"], .R1QWuf').forEach((el) => {
      const text = (el.textContent || "").trim().toLowerCase();
      if (!AI_MODE_LABELS.some((l) => text === l)) return;
      mark(outermostAiModeTab(el), attr);
    });

    document.querySelectorAll('button[jsname="B6rgad"], [data-id="aimode"]').forEach((el) => {
      mark(el, attr);
    });
  }

  function removeRelatedQuestions() {
    if (!document.documentElement.classList.contains("ac-hide-related-questions")) return;
    const attr = MARK.hideRelatedQuestions;

    document
      .querySelectorAll(
        '[jscontroller="Da4hkd"].cUnQKe, [jscontroller="Da4hkd"][jsname="bq0EGf"], .cUnQKe:has(.related-question-pair), .related-question-pair'
      )
      .forEach((el) => mark(outermostRelatedQuestions(el), attr));

    document.querySelectorAll('[role="heading"], span.mgAbYb').forEach((el) => {
      const text = (el.textContent || "").trim().toLowerCase();
      if (!RELATED_QUESTIONS_LABELS.some((l) => text === l)) return;
      const host =
        el.closest('[jscontroller="Da4hkd"]') ||
        el.closest(".cUnQKe:has(.related-question-pair)") ||
        el.closest(".A6K0A:has(.related-question-pair)") ||
        el.closest(".ULSxyf:has(.related-question-pair)");
      if (host) mark(outermostRelatedQuestions(host), attr);
    });
  }

  function cleanPage() {
    removeAiOverview();
    removeAiModeTab();
    removeRelatedQuestions();
  }

  apply(DEFAULTS);
  refresh();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    if (!Object.keys(changes).some((k) => k in CLASS_MAP)) return;
    refresh();
  });

  let scheduled = false;
  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      cleanPage();
    });
  }

  const startObserver = () => {
    cleanPage();
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

  setTimeout(cleanPage, 500);
  setTimeout(cleanPage, 1500);
  setTimeout(cleanPage, 3000);
})();
