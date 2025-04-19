var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _KAnime = class _KAnime {
  constructor(selector) {
    if (!_KAnime.isModernBrowser()) {
      throw new Error("Your browser is incompatible with the KAnime library. Please update to a recent version.");
    }
    this.elements = Array.from(document.querySelectorAll(selector));
    this.duration = 500;
  }
  // Encadeamento
  each(callback) {
    this.elements.forEach(callback);
    return this;
  }
  // Configurar duração
  setDuration(ms) {
    this.duration = ms;
    return this;
  }
  // Manipulação de eventos
  on(event, handler) {
    return this.each((el) => el.addEventListener(event, handler));
  }
  // Adicionando suporte a eventos 'off' e 'one'
  off(event, handler) {
    return this.each((el) => el.removeEventListener(event, handler));
  }
  one(event, handler) {
    return this.each((el) => {
      const onceHandler = (e) => {
        handler(e);
        el.removeEventListener(event, onceHandler);
      };
      el.addEventListener(event, onceHandler);
    });
  }
  // Manipulação de formulários
  // Serializa os dados do formulário para uma string (chave=valor)
  serialize() {
    const formData = new FormData(this.elements[0]);
    const serialized = [];
    formData.forEach((value, key) => {
      serialized.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return serialized.join("&");
  }
  // Serializa os dados do formulário para um array de objetos
  serializeArray() {
    const formData = new FormData(this.elements[0]);
    const serializedArray = [];
    formData.forEach((value, key) => {
      serializedArray.push({ name: key, value });
    });
    return serializedArray;
  }
  // Define ou retorna o valor de um campo do formulário
  val(value) {
    if (value === void 0) {
      return this.elements[0].value;
    }
    return this.each((el) => el.value = value);
  }
  // Adiciona o valor serializado aos parâmetros da URL (para GET)
  param() {
    return this.serialize();
  }
  // Manipulação de estilo
  css(property, value) {
    if (value === void 0) {
      return window.getComputedStyle(this.elements[0])[property];
    }
    return this.each((el) => el.style[property] = value);
  }
  // Manipulação de classes
  addClass(className) {
    return this.each((el) => el.classList.add(className));
  }
  removeClass(className) {
    return this.each((el) => el.classList.remove(className));
  }
  toggleClass(className) {
    return this.each((el) => el.classList.toggle(className));
  }
  // Mostrar e esconder
  show() {
    return this.each((el) => el.style.display = "block");
  }
  hide() {
    return this.each((el) => el.style.display = "none");
  }
  // Manipulação de conteúdo
  html(content) {
    if (content === void 0) {
      return this.elements[0].innerHTML;
    }
    return this.each((el) => el.innerHTML = content);
  }
  text(content) {
    if (content === void 0) {
      return this.elements[0].innerText;
    }
    return this.each((el) => el.innerText = content);
  }
  // Manipulação de atributos
  attr(attribute, value) {
    if (value === void 0) {
      return this.elements[0].getAttribute(attribute);
    }
    return this.each((el) => el.setAttribute(attribute, value));
  }
  removeAttr(attribute) {
    return this.each((el) => el.removeAttribute(attribute));
  }
  // FADE IN
  fadeIn() {
    return this.each((el) => {
      el.style.opacity = 0;
      el.style.display = "block";
      let last = +/* @__PURE__ */ new Date();
      const tick = () => {
        el.style.opacity = +el.style.opacity + (/* @__PURE__ */ new Date() - last) / this.duration;
        last = +/* @__PURE__ */ new Date();
        if (+el.style.opacity < 1) {
          requestAnimationFrame(tick);
        } else {
          el.style.opacity = 1;
        }
      };
      tick();
    });
  }
  // FADE OUT
  fadeOut() {
    return this.each((el) => {
      el.style.opacity = 1;
      let last = +/* @__PURE__ */ new Date();
      const tick = () => {
        el.style.opacity = +el.style.opacity - (/* @__PURE__ */ new Date() - last) / this.duration;
        last = +/* @__PURE__ */ new Date();
        if (+el.style.opacity > 0) {
          requestAnimationFrame(tick);
        } else {
          el.style.opacity = 0;
          el.style.display = "none";
        }
      };
      tick();
    });
  }
  // SLIDE UP
  slideUp() {
    return this.each((el) => {
      el.style.height = el.offsetHeight + "px";
      el.style.transition = `height ${this.duration}ms ease`;
      el.offsetHeight;
      el.style.overflow = "hidden";
      el.style.height = "0";
      setTimeout(() => {
        el.style.display = "none";
        el.style.removeProperty("height");
        el.style.removeProperty("overflow");
        el.style.removeProperty("transition");
      }, this.duration);
    });
  }
  // SLIDE DOWN
  slideDown() {
    return this.each((el) => {
      el.style.display = "block";
      const height = el.scrollHeight;
      el.style.height = "0";
      el.style.overflow = "hidden";
      el.style.transition = `height ${this.duration}ms ease`;
      el.offsetHeight;
      el.style.height = height + "px";
      setTimeout(() => {
        el.style.removeProperty("height");
        el.style.removeProperty("overflow");
        el.style.removeProperty("transition");
      }, this.duration);
    });
  }
  // Verificações
  // Verifica se o elemento está visível
  isVisible() {
    return this.elements.some((el) => {
      return window.getComputedStyle(el).display !== "none" && el.offsetHeight > 0;
    });
  }
  // Verifica se o elemento contém uma classe
  hasClass(className) {
    return this.elements.some((el) => el.classList.contains(className));
  }
  // Verifica se o elemento contém um atributo específico
  hasAttr(attribute) {
    return this.elements.some((el) => el.hasAttribute(attribute));
  }
  // Verifica se o elemento está selecionado (para checkboxes ou radio buttons)
  isChecked() {
    return this.elements.some((el) => el.checked === true);
  }
  // Verifica se o elemento está habilitado
  isEnabled() {
    return this.elements.some((el) => !el.disabled);
  }
  // Verifica se o elemento está desabilitado
  isDisabled() {
    return this.elements.some((el) => el.disabled);
  }
  // Método de submit padrão
  submit() {
    return this.each((el) => el.submit());
  }
  // Método ANIMATE
  animate(properties, duration = this.duration, easing = "linear") {
    return new Promise((resolve) => {
      this.each((el) => {
        const startStyles = {};
        const endStyles = {};
        for (const prop in properties) {
          startStyles[prop] = parseFloat(getComputedStyle(el)[prop]) || 0;
          endStyles[prop] = properties[prop];
        }
        let startTime;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easeProgress = this._ease(progress, easing);
          for (const prop in properties) {
            const startValue = startStyles[prop];
            const endValue = endStyles[prop];
            const currentValue = startValue + (endValue - startValue) * easeProgress;
            el.style[prop] = currentValue + (prop === "opacity" ? "" : "px");
          }
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(step);
      });
    });
  }
  // Função para aplicar easing (simplificada)
  _ease(t, type) {
    switch (type) {
      case "linear":
        return t;
      case "ease-in":
        return t * t;
      case "ease-out":
        return t * (2 - t);
      case "ease-in-out":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t;
    }
  }
  // Adicionando suporte a AJAX moderno
  ajax({ url, method = "GET", data = null, headers = {} }) {
    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: data ? JSON.stringify(data) : null
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }
  // Melhorando compatibilidade com navegadores modernos
  static isModernBrowser() {
    return "querySelector" in document && "addEventListener" in window && "fetch" in window;
  }
  // Compatibility check for older browsers
  static checkCompatibility() {
    const isCompatible = "querySelector" in document && "addEventListener" in window && "fetch" in window;
    if (!isCompatible) {
      throw new Error("Your browser is incompatible with the KAnime library. Please update to a recent version.");
    }
  }
  // Suporte a seletores avançados
  static select(selector) {
    return new _KAnime(selector);
  }
  // Manipulação de DOM Virtual
  static createVirtualElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }
  static use(pluginName, pluginFunction) {
    if (typeof pluginFunction !== "function") {
      throw new Error(`Plugin ${pluginName} must be a function.`);
    }
    this.plugins[pluginName] = pluginFunction;
  }
  static callPlugin(pluginName, ...args) {
    if (this.plugins[pluginName]) {
      return this.plugins[pluginName](...args);
    } else {
      throw new Error(`Plugin ${pluginName} not found.`);
    }
  }
  static listPlugins() {
    return Object.keys(this.plugins);
  }
  static removePlugin(pluginName) {
    if (this.plugins[pluginName]) {
      delete this.plugins[pluginName];
    } else {
      throw new Error(`Plugin ${pluginName} not found.`);
    }
  }
};
// Suporte a plugins
__publicField(_KAnime, "plugins", {});
// Suporte a Internacionalização (i18n)
__publicField(_KAnime, "i18n", {
  locale: "en",
  translations: {},
  setLocale(locale) {
    this.locale = locale;
  },
  addTranslations(locale, translations) {
    this.translations[locale] = {
      ...this.translations[locale],
      ...translations
    };
  },
  translate(key) {
    var _a;
    return ((_a = this.translations[this.locale]) == null ? void 0 : _a[key]) || key;
  }
});
let KAnime = _KAnime;
export {
  KAnime as default
};
