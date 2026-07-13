(() => {
  "use strict";

  const terms = Array.isArray(window.AIDICTIONARY_TERMS) ? window.AIDICTIONARY_TERMS : [];
  const state = { query: "", category: "전체", level: "전체", sort: "korean" };
  const categoryOrder = ["LLM·생성형 AI", "AI·머신러닝", "개발·웹", "데이터·DB", "클라우드·인프라", "네트워크", "Git·협업", "보안·품질"];
  const levelOrder = { "입문": 0, "중급": 1, "고급": 2 };
  const termMap = new Map(terms.map((term) => [term.id, term]));

  const elements = {
    searchInput: document.querySelector("#searchInput"),
    categoryFilters: document.querySelector("#categoryFilters"),
    levelFilter: document.querySelector("#levelFilter"),
    sortFilter: document.querySelector("#sortFilter"),
    randomButton: document.querySelector("#randomButton"),
    clearFilters: document.querySelector("#clearFilters"),
    termGrid: document.querySelector("#termGrid"),
    emptyState: document.querySelector("#emptyState"),
    resultSummary: document.querySelector("#resultSummary"),
    termCount: document.querySelector("#termCount"),
    categoryCount: document.querySelector("#categoryCount"),
    themeToggle: document.querySelector("#themeToggle"),
    termDialog: document.querySelector("#termDialog"),
    dialogCategory: document.querySelector("#dialogCategory"),
    dialogContent: document.querySelector("#dialogContent")
  };

  const normalize = (value) => String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim();
  const escapeHtml = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const searchableText = (term) => normalize([term.term, term.english, ...(term.aliases || []), term.category, term.short, term.description, term.example, ...(term.keywords || [])].join(" "));

  function categories() {
    const found = new Set(terms.map((term) => term.category));
    return [...categoryOrder.filter((category) => found.has(category)), ...[...found].filter((category) => !categoryOrder.includes(category)).sort((a, b) => a.localeCompare(b, "ko"))];
  }

  function createCategoryFilters() {
    elements.categoryFilters.innerHTML = ["전체", ...categories()].map((category) => `<button class="filter-chip" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === state.category}">${escapeHtml(category)}</button>`).join("");
  }

  function visibleTerms() {
    const query = normalize(state.query);
    return terms.filter((term) => {
      const queryMatch = !query || searchableText(term).includes(query);
      const categoryMatch = state.category === "전체" || term.category === state.category;
      const levelMatch = state.level === "전체" || term.level === state.level;
      return queryMatch && categoryMatch && levelMatch;
    }).sort((a, b) => {
      if (state.sort === "english") return a.english.localeCompare(b.english, "en", { sensitivity: "base" });
      if (state.sort === "level") return (levelOrder[a.level] - levelOrder[b.level]) || a.term.localeCompare(b.term, "ko");
      return a.term.localeCompare(b.term, "ko");
    });
  }

  function cardTemplate(term) {
    const aliases = (term.aliases || []).slice(0, 2).join(" · ");
    return `<article class="term-card" tabindex="0" role="button" data-term-id="${escapeHtml(term.id)}" aria-label="${escapeHtml(term.term)} 상세 보기"><div class="card-top"><span class="category-badge">${escapeHtml(term.category)}</span><span class="level-badge">${escapeHtml(term.level)}</span></div><h3>${escapeHtml(term.term)}</h3><p class="english-name">${escapeHtml(term.english)}</p><p class="short-definition">${escapeHtml(term.short)}</p>${aliases ? `<p class="card-aliases">함께 쓰는 말: ${escapeHtml(aliases)}</p>` : ""}<span class="card-open" aria-hidden="true">↗</span></article>`;
  }

  function render() {
    const result = visibleTerms();
    elements.termGrid.innerHTML = result.map(cardTemplate).join("");
    elements.emptyState.hidden = result.length !== 0;
    elements.resultSummary.textContent = `전체 ${terms.length}개 중 ${result.length}개 용어`;
    elements.clearFilters.hidden = !(state.query || state.category !== "전체" || state.level !== "전체" || state.sort !== "korean");
    elements.categoryFilters.querySelectorAll("[data-category]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.category === state.category)));
  }

  const relatedTermLabel = (id) => termMap.get(id)?.term || id;

  function openTerm(id, updateHash = true) {
    const term = termMap.get(id);
    if (!term) return;
    const related = (term.related || []).filter((relatedId) => termMap.has(relatedId));
    elements.dialogCategory.textContent = `${term.category} · ${term.level}`;
    elements.dialogContent.innerHTML = `<div class="dialog-title-wrap"><h2 id="dialogTerm">${escapeHtml(term.term)}</h2><p class="english-name">${escapeHtml(term.english)}</p>${(term.aliases || []).length ? `<p class="dialog-aliases">별칭: ${escapeHtml(term.aliases.join(", "))}</p>` : ""}</div><p class="dialog-lead">${escapeHtml(term.short)}</p><section class="detail-section"><h3>자세한 설명</h3><p>${escapeHtml(term.description)}</p></section><section class="detail-section"><h3>예시</h3><p class="example-box">${escapeHtml(term.example)}</p></section>${related.length ? `<section class="detail-section"><h3>관련 용어</h3><div class="related-list">${related.map((relatedId) => `<button class="related-button" type="button" data-related-id="${escapeHtml(relatedId)}">${escapeHtml(relatedTermLabel(relatedId))}</button>`).join("")}</div></section>` : ""}<div class="share-row"><button class="share-button" id="copyLinkButton" type="button">용어 링크 복사</button><a class="share-button" href="https://github.com/notetester/AIDICTIONARY/issues/new" target="_blank" rel="noreferrer">설명 개선 제안</a></div>`;
    elements.termDialog.showModal();
    if (updateHash) history.replaceState(null, "", `#term=${encodeURIComponent(term.id)}`);
    elements.dialogContent.querySelectorAll("[data-related-id]").forEach((button) => button.addEventListener("click", () => openTerm(button.dataset.relatedId)));
    document.querySelector("#copyLinkButton")?.addEventListener("click", async (event) => {
      try { await navigator.clipboard.writeText(window.location.href); event.currentTarget.textContent = "복사 완료"; }
      catch { event.currentTarget.textContent = "주소창 링크를 복사해 주세요"; }
    });
  }

  function clearHash() {
    if (window.location.hash.startsWith("#term=")) history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  function handleHash() {
    const match = window.location.hash.match(/^#term=(.+)$/);
    if (!match) return;
    const id = decodeURIComponent(match[1]);
    if (termMap.has(id)) openTerm(id, false);
  }

  function resetFilters() {
    Object.assign(state, { query: "", category: "전체", level: "전체", sort: "korean" });
    elements.searchInput.value = "";
    elements.levelFilter.value = "전체";
    elements.sortFilter.value = "korean";
    render();
  }

  function initializeTheme() {
    const saved = localStorage.getItem("aictionary-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = saved || (systemDark ? "dark" : "light");
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("aictionary-theme", next);
  }

  elements.searchInput.addEventListener("input", (event) => { state.query = event.target.value; render(); });
  elements.categoryFilters.addEventListener("click", (event) => { const button = event.target.closest("[data-category]"); if (button) { state.category = button.dataset.category; render(); } });
  elements.levelFilter.addEventListener("change", (event) => { state.level = event.target.value; render(); });
  elements.sortFilter.addEventListener("change", (event) => { state.sort = event.target.value; render(); });
  elements.randomButton.addEventListener("click", () => { const pool = visibleTerms().length ? visibleTerms() : terms; if (pool.length) openTerm(pool[Math.floor(Math.random() * pool.length)].id); });
  elements.clearFilters.addEventListener("click", resetFilters);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.termGrid.addEventListener("click", (event) => { const card = event.target.closest("[data-term-id]"); if (card) openTerm(card.dataset.termId); });
  elements.termGrid.addEventListener("keydown", (event) => { const card = event.target.closest("[data-term-id]"); if (card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openTerm(card.dataset.termId); } });
  elements.termDialog.addEventListener("close", clearHash);
  elements.termDialog.addEventListener("click", (event) => { const rect = elements.termDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) elements.termDialog.close(); });
  window.addEventListener("hashchange", handleHash);
  document.addEventListener("keydown", (event) => { const tag = document.activeElement?.tagName; if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) { event.preventDefault(); elements.searchInput.focus(); } });

  initializeTheme();
  createCategoryFilters();
  elements.termCount.textContent = terms.length.toLocaleString("ko-KR");
  elements.categoryCount.textContent = categories().length.toLocaleString("ko-KR");
  render();
  handleHash();
})();
