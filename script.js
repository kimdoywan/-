(() => {
  const screens = {
    home: document.getElementById("home-screen"),
    stores: document.getElementById("stores-screen"),
    map: document.getElementById("map-screen"),
    parking: document.getElementById("parking-screen")
  };
  const homeSearchForm = document.getElementById("home-search-form");
  const homeSearchInput = document.getElementById("home-search-input");
  const storesSearchForm = document.getElementById("stores-search-form");
  const storesSearchInput = document.getElementById("stores-search-input");
  const categoryFilters = document.getElementById("category-filters");
  const storeList = document.getElementById("store-list");
  const detailBackdrop = document.getElementById("detail-backdrop");
  const detailSheet = document.getElementById("detail-sheet");
  const detailContent = document.getElementById("detail-content");
  const textSizeToggle = document.getElementById("text-size-toggle");
  let activeScreen = "home";
  let activeCategory = "all";
  let activeAlley = "";
  let searchTerm = "";
  let lastDetailTrigger = null;

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function getCategory(categoryId) {
    return categories.find((category) => category.id === categoryId);
  }

  function setText(id, text) {
    document.getElementById(id).textContent = text;
  }

  function showScreen(screenName) {
    if (!screens[screenName]) return;
    activeScreen = screenName;
    Object.entries(screens).forEach(([name, screen]) => {
      screen.hidden = name !== screenName;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (screenName === "stores") renderStores();
  }

  function renderAlleyButtons() {
    const container = document.getElementById("home-alley-list");
    container.replaceChildren();
    alleys.forEach((alley) => {
      const button = createElement("button", "alley-button");
      button.type = "button";
      button.append(
        createElement("span", "", alley),
        createElement("span", "", "→")
      );
      button.addEventListener("click", () => {
        activeAlley = alley;
        activeCategory = "all";
        searchTerm = "";
        storesSearchInput.value = "";
        showScreen("stores");
      });
      container.append(button);
    });
  }

  function renderCategoryFilters() {
    categoryFilters.replaceChildren();
    const options = [{ id: "all", name: "전체" }, ...categories];
    options.forEach((category) => {
      const button = createElement("button", "category-filter", category.name);
      button.type = "button";
      button.setAttribute("aria-pressed", String(activeCategory === category.id));
      button.addEventListener("click", () => {
        activeCategory = category.id;
        renderStores();
      });
      categoryFilters.append(button);
    });
  }

  function makeCategoryTag(category) {
    const tag = createElement("span", "category-tag", category ? category.name : "");
    if (category) {
      tag.style.backgroundColor = category.color;
      tag.style.color = "#FFFFFF";
    }
    return tag;
  }

  function getVisibleStores() {
    const normalizedTerm = searchTerm.trim().toLocaleLowerCase();
    return stores.filter((store) => {
      if (activeCategory !== "all" && store.category !== activeCategory) return false;
      if (activeAlley && store.alley !== activeAlley) return false;
      if (!normalizedTerm) return true;
      const category = getCategory(store.category);
      const searchableText = [store.name, ...store.products, category ? category.name : ""]
        .join(" ")
        .toLocaleLowerCase();
      return searchableText.includes(normalizedTerm);
    });
  }

  function makeStoreCard(store) {
    const category = getCategory(store.category);
    const button = createElement("button", "store-card");
    button.type = "button";
    button.dataset.storeId = String(store.id);
    button.setAttribute("aria-label", `${store.name}, 상세 정보 보기`);

    const copy = createElement("span", "store-card-copy");
    copy.append(
      makeCategoryTag(category),
      createElement("span", "store-card-name", store.name),
      createElement("span", "store-card-products", store.products.join(", "))
    );
    button.append(copy, createElement("span", "card-chevron", "›"));
    return button;
  }

  function renderStores() {
    renderCategoryFilters();
    const visibleStores = getVisibleStores();
    setText("store-count", `${visibleStores.length}곳`);
    const alleyNote = document.getElementById("active-alley");
    alleyNote.hidden = !activeAlley;
    alleyNote.textContent = activeAlley ? `${activeAlley} 점포만 표시 중` : "";
    document.getElementById("clear-filters").hidden = activeCategory === "all" && !activeAlley && !searchTerm;

    storeList.replaceChildren();
    if (visibleStores.length === 0) {
      storeList.append(createElement("p", "empty-state", "조건에 맞는 점포가 없습니다."));
      return;
    }
    visibleStores.forEach((store) => storeList.append(makeStoreCard(store)));
  }

  function appendDetailFact(container, label, value) {
    container.append(createElement("dt", "", label), createElement("dd", "", value));
  }

  function openStoreDetail(store, trigger) {
    lastDetailTrigger = trigger;
    detailContent.replaceChildren();
    const category = getCategory(store.category);
    const categoryTag = makeCategoryTag(category);
    categoryTag.classList.add("detail-category");
    const title = createElement("h2", "detail-title", store.name);
    title.id = "detail-name";
    detailContent.append(categoryTag, title);

    const photoArea = createElement("div", "detail-photo");
    if (store.photo) {
      const image = document.createElement("img");
      image.src = store.photo;
      image.alt = `${store.name} 사진`;
      image.addEventListener("error", () => {
        photoArea.replaceChildren(createElement("span", "", "사진 준비 중"));
      }, { once: true });
      photoArea.append(image);
    } else {
      photoArea.append(createElement("span", "", "사진 준비 중"));
    }
    detailContent.append(photoArea);

    const products = createElement("div", "product-list");
    store.products.forEach((product) => products.append(createElement("span", "product-chip", product)));
    detailContent.append(products);

    const facts = createElement("dl", "detail-facts");
    appendDetailFact(facts, "영업시간", store.hours);
    appendDetailFact(facts, "위치", store.alley || "골목 정보 없음");
    appendDetailFact(facts, "연락처", store.phone || "공개하지 않음");
    detailContent.append(facts);

    detailBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => detailBackdrop.classList.add("is-open"));
    document.getElementById("detail-close").focus();
  }

  function closeStoreDetail() {
    if (detailBackdrop.hidden) return;
    detailBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    window.setTimeout(() => {
      if (detailBackdrop.classList.contains("is-open")) return;
      detailBackdrop.hidden = true;
      if (lastDetailTrigger && lastDetailTrigger.isConnected) lastDetailTrigger.focus();
    }, 230);
  }

  function renderMap() {
    const stage = document.getElementById("map-stage");
    const legend = document.getElementById("map-legend");
    stage.replaceChildren();
    legend.replaceChildren();
    stores.forEach((store) => {
      const category = getCategory(store.category);
      const pin = createElement("button", "map-pin");
      pin.type = "button";
      pin.style.left = `${store.x}%`;
      pin.style.top = `${store.y}%`;
      pin.dataset.storeId = String(store.id);
      pin.setAttribute("aria-label", `${store.name}, 위치 ${store.x}, ${store.y}`);
      const dot = createElement("span", "map-pin-dot");
      dot.style.backgroundColor = category ? category.color : "#2B7A4B";
      pin.append(dot, createElement("span", "map-pin-name", store.name));
      stage.append(pin);
      legend.append(createElement("span", "map-legend-item", store.name));
    });
    if (stores.length === 0) stage.append(createElement("p", "empty-state", "표시할 점포가 없습니다."));
  }

  function renderParkings() {
    const container = document.getElementById("parking-list");
    container.replaceChildren();
    parkings.forEach((parking) => {
      const card = createElement("article", "parking-card");
      card.append(createElement("h2", "", parking.name));
      const details = createElement("dl", "parking-details");
      appendDetailFact(details, "장소", parking.place);
      appendDetailFact(details, "요금", parking.fee);
      appendDetailFact(details, "안내", parking.note);
      card.append(details);
      container.append(card);
    });
  }

  function submitSearch(value) {
    searchTerm = value.trim();
    activeCategory = "all";
    activeAlley = "";
    storesSearchInput.value = searchTerm;
    showScreen("stores");
    storesSearchInput.focus();
    storesSearchInput.setSelectionRange(searchTerm.length, searchTerm.length);
  }

  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      const screenName = button.dataset.screen;
      if (screenName === "stores") {
        searchTerm = "";
        activeCategory = "all";
        activeAlley = "";
        storesSearchInput.value = "";
      }
      if (screenName === "map") renderMap();
      if (screenName === "parking") renderParkings();
      showScreen(screenName);
    });
  });

  document.querySelector(".brand").addEventListener("click", (event) => {
    event.preventDefault();
    searchTerm = "";
    activeCategory = "all";
    activeAlley = "";
    homeSearchInput.value = "";
    storesSearchInput.value = "";
    showScreen("home");
  });

  homeSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitSearch(homeSearchInput.value);
  });

  storesSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchTerm = storesSearchInput.value.trim();
    renderStores();
  });

  storesSearchInput.addEventListener("input", () => {
    searchTerm = storesSearchInput.value;
    renderStores();
  });

  document.getElementById("clear-filters").addEventListener("click", () => {
    activeCategory = "all";
    activeAlley = "";
    searchTerm = "";
    storesSearchInput.value = "";
    renderStores();
  });

  storeList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-store-id]");
    if (!button) return;
    const store = stores.find((item) => String(item.id) === button.dataset.storeId);
    if (store) openStoreDetail(store, button);
  });

  document.getElementById("map-stage").addEventListener("click", (event) => {
    const button = event.target.closest("[data-store-id]");
    if (!button) return;
    const store = stores.find((item) => String(item.id) === button.dataset.storeId);
    if (store) openStoreDetail(store, button);
  });

  document.getElementById("detail-close").addEventListener("click", closeStoreDetail);
  detailBackdrop.addEventListener("click", (event) => {
    if (event.target === detailBackdrop) closeStoreDetail();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStoreDetail();
  });

  textSizeToggle.addEventListener("click", () => {
    const enabled = textSizeToggle.getAttribute("aria-pressed") !== "true";
    document.documentElement.classList.toggle("large-type", enabled);
    textSizeToggle.setAttribute("aria-pressed", String(enabled));
    textSizeToggle.title = enabled ? "큰 글자 끄기" : "큰 글자 켜기";
    try {
      localStorage.setItem("gujeoni-large-type", String(enabled));
    } catch (error) {
      // 글자 크기 설정은 저장소를 사용할 수 없는 환경에서도 현재 화면에 적용됩니다.
    }
  });

  setText("market-name", market.name);
  setText("app-name", market.appName);
  setText("market-intro", market.intro);
  setText("footer-market", market.name);
  setText("footer-address", market.address);
  const footerPhone = document.getElementById("footer-phone");
  footerPhone.textContent = market.phone;
  if (market.phone) footerPhone.href = `tel:${market.phone.replace(/[^\d+]/g, "")}`;
  renderAlleyButtons();
  renderStores();
  renderMap();
  renderParkings();

  try {
    const savedLargeType = localStorage.getItem("gujeoni-large-type") === "true";
    document.documentElement.classList.toggle("large-type", savedLargeType);
    textSizeToggle.setAttribute("aria-pressed", String(savedLargeType));
    textSizeToggle.title = savedLargeType ? "큰 글자 끄기" : "큰 글자 켜기";
  } catch (error) {
    textSizeToggle.setAttribute("aria-pressed", "false");
  }
})();
