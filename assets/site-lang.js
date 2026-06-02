(function () {
  var LANGS = ["pt", "en", "es"];
  var DEFAULT = "pt";
  var current = DEFAULT;

  function htmlLang(code) {
    if (code === "pt") return "pt-BR";
    if (code === "es") return "es";
    return "en";
  }

  function resolveLang() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get("lang");
    if (fromQuery && LANGS.indexOf(fromQuery) !== -1) return fromQuery;

    try {
      var stored = localStorage.getItem("palpiteiros-site-lang");
      if (stored && LANGS.indexOf(stored) !== -1) return stored;
    } catch (_err) {
      /* ignore */
    }

    var browser = (navigator.language || "").slice(0, 2).toLowerCase();
    if (LANGS.indexOf(browser) !== -1) return browser;
    return DEFAULT;
  }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT;
    current = lang;

    var catalog = window.PALPITEIROS_I18N || {};
    var strings = catalog[lang] || catalog[DEFAULT] || {};

    document.documentElement.lang = htmlLang(lang);

    if (strings.title) document.title = strings.title;
    if (strings.description) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", strings.description);
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key || strings[key] == null) return;
      el.textContent = strings[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (!key || strings[key] == null) return;
      el.innerHTML = strings[key];
    });

    LANGS.forEach(function (code) {
      document.querySelectorAll('[data-lang-btn="' + code + '"]').forEach(function (btn) {
        var active = code === lang;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
        btn.classList.toggle("is-active", active);
      });
    });

    try {
      localStorage.setItem("palpiteiros-site-lang", lang);
    } catch (_err) {
      /* ignore */
    }

    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
  }

  window.PalpiteirosSite = {
    setLang: applyLang,
    getLang: function () {
      return current;
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang-btn"));
      });
    });
    applyLang(resolveLang());
  });
})();
