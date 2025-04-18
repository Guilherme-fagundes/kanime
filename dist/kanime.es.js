class g {
  constructor(e) {
    this.elements = Array.from(document.querySelectorAll(e)), this.duration = 500;
  }
  // Encadeamento
  each(e) {
    return this.elements.forEach(e), this;
  }
  // Configurar duração
  setDuration(e) {
    return this.duration = e, this;
  }
  // Manipulação de eventos
  on(e, t) {
    return this.each((s) => s.addEventListener(e, t));
  }
  // Mouse events
  onClick(e) {
    return this.on("click", e);
  }
  onMouseEnter(e) {
    return this.on("mouseenter", e);
  }
  onMouseLeave(e) {
    return this.on("mouseleave", e);
  }
  onMouseMove(e) {
    return this.on("mousemove", e);
  }
  onMouseDown(e) {
    return this.on("mousedown", e);
  }
  onMouseUp(e) {
    return this.on("mouseup", e);
  }
  // Keyboard events
  onKeyDown(e) {
    return this.on("keydown", e);
  }
  onKeyUp(e) {
    return this.on("keyup", e);
  }
  onKeyPress(e) {
    return this.on("keypress", e);
  }
  // Manipulação de estilo
  css(e, t) {
    return t === void 0 ? window.getComputedStyle(this.elements[0])[e] : this.each((s) => s.style[e] = t);
  }
  // Manipulação de classes
  addClass(e) {
    return this.each((t) => t.classList.add(e));
  }
  removeClass(e) {
    return this.each((t) => t.classList.remove(e));
  }
  toggleClass(e) {
    return this.each((t) => t.classList.toggle(e));
  }
  // Mostrar e esconder
  show() {
    return this.each((e) => e.style.display = "block");
  }
  hide() {
    return this.each((e) => e.style.display = "none");
  }
  // Manipulação de conteúdo
  html(e) {
    return e === void 0 ? this.elements[0].innerHTML : this.each((t) => t.innerHTML = e);
  }
  text(e) {
    return e === void 0 ? this.elements[0].innerText : this.each((t) => t.innerText = e);
  }
  // Manipulação de atributos
  attr(e, t) {
    return t === void 0 ? this.elements[0].getAttribute(e) : this.each((s) => s.setAttribute(e, t));
  }
  removeAttr(e) {
    return this.each((t) => t.removeAttribute(e));
  }
  // FADE IN
  fadeIn() {
    return this.each((e) => {
      e.style.opacity = 0, e.style.display = "block";
      let t = +/* @__PURE__ */ new Date();
      const s = () => {
        e.style.opacity = +e.style.opacity + (/* @__PURE__ */ new Date() - t) / this.duration, t = +/* @__PURE__ */ new Date(), +e.style.opacity < 1 ? requestAnimationFrame(s) : e.style.opacity = 1;
      };
      s();
    });
  }
  // FADE OUT
  fadeOut() {
    return this.each((e) => {
      e.style.opacity = 1;
      let t = +/* @__PURE__ */ new Date();
      const s = () => {
        e.style.opacity = +e.style.opacity - (/* @__PURE__ */ new Date() - t) / this.duration, t = +/* @__PURE__ */ new Date(), +e.style.opacity > 0 ? requestAnimationFrame(s) : (e.style.opacity = 0, e.style.display = "none");
      };
      s();
    });
  }
  // SLIDE UP
  slideUp() {
    return this.each((e) => {
      e.style.height = e.offsetHeight + "px", e.style.transition = `height ${this.duration}ms ease`, e.offsetHeight, e.style.overflow = "hidden", e.style.height = "0", setTimeout(() => {
        e.style.display = "none", e.style.removeProperty("height"), e.style.removeProperty("overflow"), e.style.removeProperty("transition");
      }, this.duration);
    });
  }
  // SLIDE DOWN
  slideDown() {
    return this.each((e) => {
      e.style.display = "block";
      const t = e.scrollHeight;
      e.style.height = "0", e.style.overflow = "hidden", e.style.transition = `height ${this.duration}ms ease`, e.offsetHeight, e.style.height = t + "px", setTimeout(() => {
        e.style.removeProperty("height"), e.style.removeProperty("overflow"), e.style.removeProperty("transition");
      }, this.duration);
    });
  }
  // Verificações
  // Verifica se o elemento está visível
  isVisible() {
    return this.elements.some((e) => window.getComputedStyle(e).display !== "none" && e.offsetHeight > 0);
  }
  // Verifica se o elemento contém uma classe
  hasClass(e) {
    return this.elements.some((t) => t.classList.contains(e));
  }
  // Verifica se o elemento contém um atributo específico
  hasAttr(e) {
    return this.elements.some((t) => t.hasAttribute(e));
  }
  // Verifica se o elemento está selecionado (para checkboxes ou radio buttons)
  isChecked() {
    return this.elements.some((e) => e.checked === !0);
  }
  // Verifica se o elemento está habilitado
  isEnabled() {
    return this.elements.some((e) => !e.disabled);
  }
  // Verifica se o elemento está desabilitado
  isDisabled() {
    return this.elements.some((e) => e.disabled);
  }
  // Método de submit padrão
  submit() {
    return this.each((e) => e.submit());
  }
  // Método ajaxSubmit - Submissão via AJAX (com upload de arquivos)
  ajaxSubmit(e) {
    const {
      url: t,
      method: s = "POST",
      success: l = function() {
      },
      error: o = function() {
      },
      headers: a = {},
      dataType: h = "json"
    } = e;
    return this.each((i) => {
      const u = new FormData(i), n = {
        method: s,
        headers: {
          Accept: "application/json",
          ...a
        },
        body: u
      };
      fetch(t, n).then((r) => {
        if (r.ok)
          return r[h]();
        throw new Error("Request failed");
      }).then((r) => l(r)).catch((r) => o(r));
    });
  }
  // Método ANIMATE
  animate(e, t = this.duration, s = "linear", l = function() {
  }) {
    return this.each((o) => {
      const a = {}, h = {};
      for (const n in e)
        a[n] = parseFloat(getComputedStyle(o)[n]) || 0, h[n] = e[n];
      let i;
      const u = (n) => {
        i || (i = n);
        const r = Math.min((n - i) / t, 1), d = this._ease(r, s);
        for (const c in e) {
          const y = a[c], m = h[c], p = y + (m - y) * d;
          o.style[c] = p + (c === "opacity" ? "" : "px");
        }
        r < 1 ? requestAnimationFrame(u) : l();
      };
      requestAnimationFrame(u);
    });
  }
  // Função para aplicar easing (simplificada)
  _ease(e, t) {
    switch (t) {
      case "linear":
        return e;
      case "ease-in":
        return e * e;
      case "ease-out":
        return e * (2 - e);
      case "ease-in-out":
        return e < 0.5 ? 2 * e * e : -1 + (4 - 2 * e) * e;
      default:
        return e;
    }
  }
}
export {
  g as default
};
