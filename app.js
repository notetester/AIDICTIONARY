(() => {
  "use strict";

  const terms = Array.isArray(window.AIDICTIONARY_TERMS) ? window.AIDICTIONARY_TERMS : [];
  const details = window.AIDICTIONARY_DETAILS && typeof window.AIDICTIONARY_DETAILS === "object"
    ? window.AIDICTIONARY_DETAILS
    : {};
  const learningPaths = Array.isArray(window.AIDICTIONARY_PATHS) ? window.AIDICTIONARY_PATHS : [];

  function loadLearnedTerms() {
    try {
      const stored = JSON.parse(localStorage.getItem("aictionary-learned-terms") || "[]");
      return new Set(Array.isArray(stored) ? stored : []);
    } catch {
      return new Set();
    }
  }

  const learnedTerms = loadLearnedTerms();
  const state = { query: "", category: "전체", level: "전체", sort: "korean" };
  const categoryOrder = ["LLM·생성형 AI", "AI·머신러닝", "개발·웹", "데이터·DB", "클라우드·인프라", "네트워크", "Git·협업", "보안·품질"];
  const levelOrder = { "입문": 0, "중급": 1, "고급": 2 };
  const termMap = new Map(terms.map((term) => [term.id, term]));
  const reverseLinks = new Map();

  for (const term of terms) {
    for (const relatedId of term.related || []) {
      if (!reverseLinks.has(relatedId)) reverseLinks.set(relatedId, new Set());
      reverseLinks.get(relatedId).add(term.id);
    }
  }
  for (const [termId, detail] of Object.entries(details)) {
    for (const linkedId of [...(detail.prerequisites || []), ...(detail.next || [])]) {
      if (!reverseLinks.has(linkedId)) reverseLinks.set(linkedId, new Set());
      reverseLinks.get(linkedId).add(termId);
    }
  }

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
    deepCount: document.querySelector("#deepCount"),
    learningPathGrid: document.querySelector("#learningPathGrid"),
    learningProgressSummary: document.querySelector("#learningProgressSummary"),
    themeToggle: document.querySelector("#themeToggle"),
    termDialog: document.querySelector("#termDialog"),
    dialogCategory: document.querySelector("#dialogCategory"),
    dialogContent: document.querySelector("#dialogContent")
  };

  const normalize = (value) => String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/\s+/g, " ")
    .trim();

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const uniqueIds = (ids) => [...new Set((ids || []).filter((id) => termMap.has(id)))];

  function detailText(detail) {
    if (!detail) return "";
    const values = [];
    const visit = (value) => {
      if (typeof value === "string") values.push(value);
      else if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object") Object.values(value).forEach(visit);
    };
    visit(detail);
    return values.join(" ");
  }

  const searchableText = (term) => normalize([
    term.term,
    term.english,
    ...(term.aliases || []),
    term.category,
    term.short,
    term.description,
    term.example,
    ...(term.keywords || []),
    detailText(details[term.id])
  ].join(" "));

  function categories() {
    const found = new Set(terms.map((term) => term.category));
    return [
      ...categoryOrder.filter((category) => found.has(category)),
      ...[...found].filter((category) => !categoryOrder.includes(category)).sort((a, b) => a.localeCompare(b, "ko"))
    ];
  }

  function createCategoryFilters() {
    elements.categoryFilters.innerHTML = ["전체", ...categories()]
      .map((category) => `<button class="filter-chip" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === state.category}">${escapeHtml(category)}</button>`)
      .join("");
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
    const hasDeep = Boolean(details[term.id]);
    const isLearned = learnedTerms.has(term.id);
    return `<article class="term-card${hasDeep ? " has-deep-detail" : ""}${isLearned ? " is-learned" : ""}" tabindex="0" role="button" data-term-id="${escapeHtml(term.id)}" aria-label="${escapeHtml(term.term)} 상세 보기">
      <div class="card-top">
        <span class="category-badge">${escapeHtml(term.category)}</span>
        <span class="level-badge">${escapeHtml(term.level)}</span>
      </div>
      ${hasDeep ? `<span class="deep-badge">전문가 해설</span>` : ""}
      ${isLearned ? `<span class="learned-badge">학습 완료</span>` : ""}
      <h3>${escapeHtml(term.term)}</h3>
      <p class="english-name">${escapeHtml(term.english)}</p>
      <p class="short-definition">${escapeHtml(term.short)}</p>
      ${aliases ? `<p class="card-aliases">함께 쓰는 말: ${escapeHtml(aliases)}</p>` : ""}
      <span class="card-open" aria-hidden="true">↗</span>
    </article>`;
  }

  function render() {
    const result = visibleTerms();
    elements.termGrid.innerHTML = result.map(cardTemplate).join("");
    elements.emptyState.hidden = result.length !== 0;
    elements.resultSummary.textContent = `전체 ${terms.length}개 중 ${result.length}개 용어 · 전문가 해설 ${Object.keys(details).filter((id) => termMap.has(id)).length}개`;
    elements.clearFilters.hidden = !(state.query || state.category !== "전체" || state.level !== "전체" || state.sort !== "korean");
    elements.categoryFilters.querySelectorAll("[data-category]")
      .forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.category === state.category)));
  }

  function saveLearnedTerms() {
    localStorage.setItem("aictionary-learned-terms", JSON.stringify([...learnedTerms]));
  }

  function validPathTerms(path) {
    return uniqueIds(path.terms || []);
  }

  function renderLearningPaths() {
    if (!elements.learningPathGrid) return;
    const pathMarkup = learningPaths.map((path) => {
      const ids = validPathTerms(path);
      const completed = ids.filter((id) => learnedTerms.has(id)).length;
      const percent = ids.length ? Math.round((completed / ids.length) * 100) : 0;
      const nextId = ids.find((id) => !learnedTerms.has(id)) || ids[0];
      const preview = ids.slice(0, 5).map((id) => {
        const term = termMap.get(id);
        return `<button type="button" data-path-term-id="${escapeHtml(id)}" class="${learnedTerms.has(id) ? "is-complete" : ""}">${escapeHtml(term.term)}</button>`;
      }).join("");
      return `<article class="learning-path-card" data-path-id="${escapeHtml(path.id)}">
        <div class="path-card-top">
          <span>${escapeHtml(path.level || "")}</span>
          <strong>${completed}/${ids.length}</strong>
        </div>
        <h3>${escapeHtml(path.title)}</h3>
        <p class="path-subtitle">${escapeHtml(path.subtitle || "")}</p>
        <p>${escapeHtml(path.description || "")}</p>
        <div class="path-progress" aria-label="${escapeHtml(path.title)} 진행률 ${percent}%"><span style="width:${percent}%"></span></div>
        <div class="path-preview">${preview}</div>
        <details class="path-all-terms">
          <summary>전체 ${ids.length}개 학습 순서</summary>
          <ol>${ids.map((id) => {
            const term = termMap.get(id);
            return `<li><button type="button" data-path-term-id="${escapeHtml(id)}" class="${learnedTerms.has(id) ? "is-complete" : ""}">${escapeHtml(term.term)} <small>${escapeHtml(term.english)}</small></button></li>`;
          }).join("")}</ol>
        </details>
        ${nextId ? `<button class="path-start-button" type="button" data-path-start-id="${escapeHtml(nextId)}">${completed === ids.length ? "다시 보기" : completed ? "이어서 학습" : "학습 시작"}</button>` : ""}
      </article>`;
    }).join("");

    elements.learningPathGrid.innerHTML = pathMarkup;
    if (elements.learningProgressSummary) {
      const pathTermIds = uniqueIds(learningPaths.flatMap((path) => path.terms || []));
      const learnedInPaths = pathTermIds.filter((id) => learnedTerms.has(id)).length;
      elements.learningProgressSummary.textContent = `${learnedInPaths}/${pathTermIds.length}개 핵심 용어 학습 완료`;
    }
  }

  function toggleLearned(id) {
    if (!termMap.has(id)) return;
    if (learnedTerms.has(id)) learnedTerms.delete(id);
    else learnedTerms.add(id);
    saveLearnedTerms();
    render();
    renderLearningPaths();
    openTerm(id, false);
  }

  function relationButtons(ids, relationType = "related") {
    const valid = uniqueIds(ids);
    if (!valid.length) return `<p class="muted-note">아직 연결된 용어가 없습니다.</p>`;
    return `<div class="related-list">${valid.map((id) => {
      const linked = termMap.get(id);
      return `<button class="related-button relation-${relationType}" type="button" data-related-id="${escapeHtml(id)}">
        <span>${escapeHtml(linked.term)}</span>
        <small>${escapeHtml(linked.english)}</small>
      </button>`;
    }).join("")}</div>`;
  }

  function inferredPrerequisites(term) {
    const explicit = details[term.id]?.prerequisites || [];
    if (explicit.length) return uniqueIds(explicit);
    return uniqueIds((term.related || []).filter((id) => {
      const candidate = termMap.get(id);
      return candidate && (levelOrder[candidate.level] ?? 0) <= (levelOrder[term.level] ?? 0);
    })).slice(0, 4);
  }

  function inferredNext(term) {
    const explicit = details[term.id]?.next || [];
    if (explicit.length) return uniqueIds(explicit);
    return uniqueIds((term.related || []).filter((id) => {
      const candidate = termMap.get(id);
      return candidate && (levelOrder[candidate.level] ?? 0) >= (levelOrder[term.level] ?? 0);
    })).slice(0, 6);
  }

  function allNeighbors(term) {
    const detail = details[term.id] || {};
    return uniqueIds([
      ...(detail.prerequisites || []),
      ...(term.related || []),
      ...(detail.next || []),
      ...[...(reverseLinks.get(term.id) || [])]
    ]).filter((id) => id !== term.id);
  }

  function knowledgeTree(term, maxDepth = 2) {
    const renderNode = (id, depth, path) => {
      const current = termMap.get(id);
      if (!current) return "";
      const nextPath = new Set(path);
      nextPath.add(id);
      const children = depth < maxDepth
        ? allNeighbors(current).filter((childId) => !nextPath.has(childId)).slice(0, depth === 0 ? 8 : 4)
        : [];
      return `<li>
        <button type="button" data-related-id="${escapeHtml(id)}">
          <span>${escapeHtml(current.term)}</span><small>${escapeHtml(current.category)} · ${escapeHtml(current.level)}</small>
        </button>
        ${children.length ? `<ul>${children.map((childId) => renderNode(childId, depth + 1, nextPath)).join("")}</ul>` : ""}
      </li>`;
    };
    const roots = allNeighbors(term).slice(0, 10);
    if (!roots.length) return `<p class="muted-note">관계 데이터가 추가되면 이곳에 2단계 지식 트리가 표시됩니다.</p>`;
    return `<ul class="knowledge-tree">${roots.map((id) => renderNode(id, 0, new Set([term.id]))).join("")}</ul>`;
  }

  function paragraphSection(title, value, className = "") {
    if (!value) return "";
    return `<section class="detail-section ${className}"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(value)}</p></section>`;
  }

  function bulletSection(title, values, className = "") {
    if (!Array.isArray(values) || !values.length) return "";
    return `<section class="detail-section ${className}"><h3>${escapeHtml(title)}</h3><ol class="detail-list">${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ol></section>`;
  }

  function misconceptionsSection(values) {
    if (!Array.isArray(values) || !values.length) return "";
    return `<section class="detail-section misconception-section">
      <h3>흔한 오해와 정확한 이해</h3>
      <div class="misconception-list">${values.map(([myth, fact]) => `<article>
        <p class="myth"><strong>오해</strong>${escapeHtml(myth)}</p>
        <p class="fact"><strong>정확히는</strong>${escapeHtml(fact)}</p>
      </article>`).join("")}</div>
    </section>`;
  }

  function formulaSection(values) {
    if (!Array.isArray(values) || !values.length) return "";
    return `<section class="detail-section">
      <h3>수식과 기호</h3>
      <div class="formula-list">${values.map(([label, expression, note]) => `<article>
        <strong>${escapeHtml(label)}</strong>
        <code>${escapeHtml(expression)}</code>
        <p>${escapeHtml(note)}</p>
      </article>`).join("")}</div>
    </section>`;
  }

  function sourceSection(values) {
    if (!Array.isArray(values) || !values.length) return "";
    return `<section class="detail-section">
      <h3>더 깊이 확인할 1차 자료</h3>
      <ul class="source-list">${values.map(([label, url]) => `<li><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a></li>`).join("")}</ul>
    </section>`;
  }

  function openTerm(id, updateHash = true) {
    const term = termMap.get(id);
    if (!term) return;
    const detail = details[id] || {};
    const directRelated = uniqueIds(term.related || []);
    const backlinks = uniqueIds([...(reverseLinks.get(id) || [])]).filter((linkedId) => !directRelated.includes(linkedId));
    const prerequisites = inferredPrerequisites(term);
    const nextTerms = inferredNext(term);

    elements.dialogCategory.textContent = `${term.category} · ${term.level}${details[id] ? " · 전문가 해설" : ""}`;
    elements.dialogContent.innerHTML = `
      <div class="dialog-title-wrap">
        <h2 id="dialogTerm">${escapeHtml(term.term)}</h2>
        <p class="english-name">${escapeHtml(term.english)}</p>
        ${(term.aliases || []).length ? `<p class="dialog-aliases">별칭: ${escapeHtml(term.aliases.join(", "))}</p>` : ""}
      </div>

      <section class="explanation-layer easy-layer">
        <p class="layer-label">1단계 · 비전공자도 이해하는 설명</p>
        <p class="dialog-lead">${escapeHtml(detail.intuition || term.short)}</p>
      </section>

      <section class="explanation-layer exact-layer">
        <p class="layer-label">2단계 · 정확한 기술 정의</p>
        <p>${escapeHtml(detail.precise || term.description)}</p>
      </section>

      ${bulletSection("작동 원리", detail.mechanism, "mechanism-section")}
      ${paragraphSection("왜 중요한가", detail.why)}
      ${bulletSection("트레이드오프와 한계", detail.tradeoffs)}
      ${formulaSection(detail.formula)}
      ${misconceptionsSection(detail.misconceptions)}
      ${bulletSection("실무·실험 체크리스트", detail.practice, "practice-section")}

      <section class="detail-section">
        <h3>구체적인 예시</h3>
        <p class="example-box">${escapeHtml(term.example)}</p>
      </section>

      <section class="mastery-section">
        <div>
          <strong>${learnedTerms.has(term.id) ? "이 용어를 학습 완료했습니다." : "설명을 읽고 이해했다면 학습 기록에 남겨 보세요."}</strong>
          <p>기록은 이 브라우저에만 저장되며 언제든 해제할 수 있습니다.</p>
        </div>
        <button id="masteryButton" type="button">${learnedTerms.has(term.id) ? "학습 완료 해제" : "학습 완료로 표시"}</button>
      </section>

      <section class="detail-section learning-route">
        <h3>전문가로 이어지는 학습 경로</h3>
        <div class="route-grid">
          <article><h4>먼저 알면 좋은 용어</h4>${relationButtons(prerequisites, "prerequisite")}</article>
          <article><h4>다음으로 확장할 용어</h4>${relationButtons(nextTerms, "next")}</article>
        </div>
      </section>

      ${directRelated.length ? `<section class="detail-section"><h3>직접 관련된 용어</h3>${relationButtons(directRelated)}</section>` : ""}
      ${backlinks.length ? `<section class="detail-section"><h3>이 용어를 참조하는 다른 용어</h3>${relationButtons(backlinks, "backlink")}</section>` : ""}

      <details class="tree-panel">
        <summary>관련 개념을 2단계 지식 트리로 펼치기</summary>
        <p>한 용어에서 끝내지 않고 연결된 개념을 계속 따라가며 학습할 수 있습니다.</p>
        ${knowledgeTree(term)}
      </details>

      ${sourceSection(detail.sources)}

      <div class="share-row">
        <button class="share-button" id="copyLinkButton" type="button">용어 링크 복사</button>
        <a class="share-button" href="https://github.com/notetester/AIDICTIONARY/issues/new" target="_blank" rel="noreferrer">설명 개선 제안</a>
      </div>`;

    if (!elements.termDialog.open) elements.termDialog.showModal();
    elements.termDialog.scrollTop = 0;
    if (updateHash) history.replaceState(null, "", `#term=${encodeURIComponent(term.id)}`);

    elements.dialogContent.querySelectorAll("[data-related-id]")
      .forEach((button) => button.addEventListener("click", () => openTerm(button.dataset.relatedId)));

    elements.dialogContent.querySelector("#masteryButton")?.addEventListener("click", () => toggleLearned(term.id));

    elements.dialogContent.querySelector("#copyLinkButton")?.addEventListener("click", async (event) => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        event.currentTarget.textContent = "복사 완료";
      } catch {
        event.currentTarget.textContent = "주소창 링크를 복사해 주세요";
      }
    });
  }

  function clearHash() {
    if (window.location.hash.startsWith("#term=")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
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

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
  elements.categoryFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (button) {
      state.category = button.dataset.category;
      render();
    }
  });
  elements.levelFilter.addEventListener("change", (event) => {
    state.level = event.target.value;
    render();
  });
  elements.sortFilter.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });
  elements.randomButton.addEventListener("click", () => {
    const visible = visibleTerms();
    const pool = visible.length ? visible : terms;
    if (pool.length) openTerm(pool[Math.floor(Math.random() * pool.length)].id);
  });
  elements.clearFilters.addEventListener("click", resetFilters);
  elements.learningPathGrid?.addEventListener("click", (event) => {
    const termButton = event.target.closest("[data-path-term-id]");
    if (termButton) {
      openTerm(termButton.dataset.pathTermId);
      return;
    }
    const startButton = event.target.closest("[data-path-start-id]");
    if (startButton) openTerm(startButton.dataset.pathStartId);
  });
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.termGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-term-id]");
    if (card) openTerm(card.dataset.termId);
  });
  elements.termGrid.addEventListener("keydown", (event) => {
    const card = event.target.closest("[data-term-id]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openTerm(card.dataset.termId);
    }
  });
  elements.termDialog.addEventListener("close", clearHash);
  elements.termDialog.addEventListener("click", (event) => {
    const rect = elements.termDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      elements.termDialog.close();
    }
  });
  window.addEventListener("hashchange", handleHash);
  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
      event.preventDefault();
      elements.searchInput.focus();
    }
  });

  initializeTheme();
  createCategoryFilters();
  elements.termCount.textContent = terms.length.toLocaleString("ko-KR");
  elements.categoryCount.textContent = categories().length.toLocaleString("ko-KR");
  if (elements.deepCount) {
    elements.deepCount.textContent = Object.keys(details).filter((id) => termMap.has(id)).length.toLocaleString("ko-KR");
  }
  render();
  renderLearningPaths();
  handleHash();
})();