class KAnime {
  // =========================
  // Core & Utility
  // =========================
  /**
   * Creates an instance of KAnime.
   * @example
   * // Select elements by CSS selector
   * const el = new KAnime('.my-class');
   * // Or use the global shortcut
   * const el = k('.my-class');
   */
  constructor(selector) {
    if (!KAnime.kIsModernBrowser()) {
      throw new Error("Your browser is incompatible with the KAnime library. Please update to a recent version.");
    }
    if (typeof selector === "string") {
      this.elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof HTMLElement) {
      this.elements = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      this.elements = Array.from(selector);
    } else {
      throw new Error("Invalid selector. Must be a string, HTMLElement, or NodeList.");
    }
    this.kDuration = 500;
  }
  /**
   * Executes a callback for each selected element.
   * @param {Function} callback
   * @returns {KAnime}
   * @example
   * k('.item').kForEach(el => console.log(el));
   */
  kForEach(callback) {
    this.elements.forEach(callback);
    return this;
  }
  /**
   * Sets the default animation duration.
   * @param {number} ms
   * @returns {KAnime}
   * @example
   * k('.box').kSetDuration(1000);
   */
  kSetDuration(ms) {
    this.kDuration = ms;
    return this;
  }
  /**
   * Checks if the browser supports required features.
   * @returns {boolean}
   * @example
   * if (KAnime.kIsModernBrowser()) { ... }
   */
  static kIsModernBrowser() {
    return "querySelector" in document && "addEventListener" in window && "fetch" in window;
  }
  /**
   * Creates a new KAnime instance for the given selector.
   * @param {string} selector
   * @returns {KAnime}
   * @example
   * const el = KAnime.kSelect('.my-class');
   */
  static kSelect(selector) {
    return new KAnime(selector);
  }
  /**
   * Returns the position and size of the first selected element relative to the document.
   * @returns {{top: number, left: number, width: number, height: number}}
   * @example
   * const pos = k('.box').kCalculate();
   * // pos = { top, left, width, height }
   */
  kCalculate() {
    if (!this.elements[0]) {
      return null;
    }
    const el = this.elements[0];
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  }
  // =========================
  // DOM Manipulation
  // =========================
  /**
   * Adds content to the end of each selected element.
   * @param {string|HTMLElement} content
   * @returns {KAnime}
   * @example
   * k('.list').kAdd('<li>Item</li>');
   */
  kAdd(content) {
    return this.kForEach((el) => {
      if (typeof content === "string") {
        el.insertAdjacentHTML("beforeend", content);
      } else if (content instanceof HTMLElement) {
        el.appendChild(content);
      }
    });
  }
  /**
   * Adds content to the start of each selected element.
   * @param {string|HTMLElement} content
   * @returns {KAnime}
   * @example
   * k('.list').kAddFirst('<li>First</li>');
   */
  kAddFirst(content) {
    return this.kForEach((el) => {
      if (typeof content === "string") {
        el.insertAdjacentHTML("afterbegin", content);
      } else if (content instanceof HTMLElement) {
        el.insertBefore(content, el.firstChild);
      }
    });
  }
  /**
   * Inserts content before each selected element.
   * @param {string|HTMLElement} content
   * @returns {KAnime}
   * @example
   * k('.item').kInsertBefore('<div>Before</div>');
   */
  kInsertBefore(content) {
    return this.kForEach((el) => {
      if (typeof content === "string") {
        el.insertAdjacentHTML("beforebegin", content);
      } else if (content instanceof HTMLElement) {
        el.parentNode.insertBefore(content, el);
      }
    });
  }
  /**
   * Inserts content after each selected element.
   * @param {string|HTMLElement} content
   * @returns {KAnime}
   * @example
   * k('.item').kInsertAfter('<div>After</div>');
   */
  kInsertAfter(content) {
    return this.kForEach((el) => {
      if (typeof content === "string") {
        el.insertAdjacentHTML("afterend", content);
      } else if (content instanceof HTMLElement) {
        el.parentNode.insertBefore(content, el.nextSibling);
      }
    });
  }
  /**
   * Removes all selected elements from the DOM.
   * @returns {KAnime}
   * @example
   * k('.item').kRemove();
   */
  kRemove() {
    return this.kForEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
  /**
   * Clones the selected elements.
   * @param {boolean} deep
   * @returns {KAnime}
   * @example
   * const clone = k('.item').kClone();
   */
  kClone(deep = true) {
    const clones = this.elements.map((el) => el.cloneNode(deep));
    return new KAnime(clones);
  }
  /**
   * Wraps each selected element with the specified HTML structure.
   * @param {string|HTMLElement} wrapper
   * @returns {KAnime}
   * @example
   * k('.item').kWrapWith('<div class="wrap"></div>');
   */
  kWrapWith(wrapper) {
    return this.kForEach((el) => {
      const wrapElement = typeof wrapper === "string" ? document.createElement("div").insertAdjacentHTML("afterbegin", wrapper).firstElementChild : wrapper.cloneNode(true);
      el.parentNode.insertBefore(wrapElement, el);
      wrapElement.appendChild(el);
    });
  }
  /**
   * Removes the parent of each selected element, keeping the elements in the DOM.
   * @returns {KAnime}
   * @example
   * k('.item').kUnwrap();
   */
  kUnwrap() {
    return this.kForEach((el) => {
      const parent = el.parentNode;
      if (parent && parent !== document.body) {
        while (parent.firstChild) {
          parent.parentNode.insertBefore(parent.firstChild, parent);
        }
        parent.parentNode.removeChild(parent);
      }
    });
  }
  // =========================
  // Event Handling (with delegation)
  // =========================
  /**
   * Adds event listeners to the selected elements.
   * Supports delegation if a selector is passed as the second argument.
   * @param {string} events
   * @param {Function|string} handlerOrSelector - Handler function or selector for delegation.
   * @param {Function} [handler] - Handler function if delegation is used.
   * @returns {KAnime}
   * @example
   * // Direto
   * k('.btn').kListen('click', e => alert('Clicked!'));
   * // Delegação
   * k('.container').kListen('click', 'button', e => alert(e.target.textContent));
   */
  kListen(events, handlerOrSelector, handler) {
    const eventList = events.split(/[,\s]+/);
    return this.kForEach((el) => {
      eventList.forEach((event) => {
        if (typeof handlerOrSelector === "string" && typeof handler === "function") {
          el.addEventListener(event, function(e) {
            if (e.target.closest(handlerOrSelector) && el.contains(e.target)) {
              handler.call(e.target, e);
            }
          });
        } else if (typeof handlerOrSelector === "function") {
          el.addEventListener(event, (e) => handlerOrSelector.call(el, e));
        }
      });
    });
  }
  /**
   * Removes event listeners from the selected elements.
   * @param {string} event
   * @param {Function} handler
   * @returns {KAnime}
   * @example
   * k('.btn').kRemoveListener('click', handler);
   */
  kRemoveListener(event, handler) {
    return this.kForEach((el) => el.removeEventListener(event, handler));
  }
  /**
   * Adds a one-time event listener to the selected elements.
   * @param {string} event
   * @param {Function} handler
   * @returns {KAnime}
   * @example
   * k('.btn').kOnce('click', () => alert('Clicked once!'));
   */
  kOnce(event, handler) {
    return this.kForEach((el) => {
      const onceHandler = (e) => {
        handler(e);
        el.removeEventListener(event, onceHandler);
      };
      el.addEventListener(event, onceHandler);
    });
  }
  /**
   * Triggers an event on the selected elements.
   * @param {string} event
   * @returns {KAnime}
   * @example
   * k('.btn').kDispatch('click');
   */
  kDispatch(event) {
    return this.kForEach((el) => {
      const evt = new Event(event, { bubbles: true, cancelable: true });
      el.dispatchEvent(evt);
    });
  }
  /**
   * Adds mouseenter and mouseleave event listeners.
   * @param {Function} mouseEnterHandler
   * @param {Function} mouseLeaveHandler
   * @returns {KAnime}
   * @example
   * k('.item').kHover(
   *   () => console.log('Mouse in'),
   *   () => console.log('Mouse out')
   * );
   */
  kHover(mouseEnterHandler, mouseLeaveHandler) {
    return this.kForEach((el) => {
      el.addEventListener("mouseenter", mouseEnterHandler);
      el.addEventListener("mouseleave", mouseLeaveHandler);
    });
  }
  // =========================
  // Animation (with expanded easings)
  // =========================
  /**
   * Shows the elements with a fade-in animation.
   * @returns {KAnime}
   * @example
   * k('.box').kShowFade();
   */
  kShowFade() {
    return this.kForEach((el) => {
      if (window.getComputedStyle(el).display === "none") {
        el.style.display = "block";
        el.style.opacity = 0;
      }
      el.style.transition = `opacity ${this.kDuration}ms ease-in-out`;
      void el.offsetWidth;
      requestAnimationFrame(() => {
        el.style.opacity = 1;
      });
    });
  }
  /**
   * Hides the elements with a fade-out animation.
   * @returns {KAnime}
   * @example
   * k('.box').kHideFade();
   */
  kHideFade() {
    return this.kForEach((el) => {
      el.style.opacity = 1;
      el.style.transition = `opacity ${this.kDuration}ms ease-in-out`;
      void el.offsetWidth;
      requestAnimationFrame(() => {
        el.style.opacity = 0;
        setTimeout(() => {
          el.style.display = "none";
        }, this.kDuration);
      });
    });
  }
  /**
   * Toggles fade-in/fade-out based on visibility.
   * @returns {KAnime}
   * @example
   * k('.box').kToggleFade();
   */
  kToggleFade() {
    return this.kForEach((el) => {
      const isHidden = window.getComputedStyle(el).display === "none";
      if (isHidden) {
        this.kShowFade();
      } else {
        this.kHideFade();
      }
    });
  }
  /**
   * Animates CSS properties of the selected elements.
   * @param {Object} properties - CSS properties and their target values.
   * @param {number} duration - Animation duration in milliseconds.
   * @param {string} [easing='linear'] - Easing function: 'linear', 'ease', 'ease-in', etc.
   * @param {Function} [callback] - Callback to execute after animation ends.
   * @returns {KAnime}
   * @example
   * k('.box').kanime({ left: '200px', opacity: 0.5 }, 600, 'ease', () => {
   *   console.log('Animation finished!');
   * });
   */
  kanime(properties, duration = 400, easing = "linear", callback) {
    const easings = {
      linear: (t) => t,
      ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      "ease-in": (t) => t * t,
      "ease-out": (t) => t * (2 - t),
      "ease-in-out": (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      "cubic-in": (t) => t * t * t,
      "cubic-out": (t) => --t * t * t + 1,
      "cubic-in-out": (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      "bounce": (t) => {
        const n1 = 7.5625, d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        else return n1 * (t -= 2.625 / d1) * t + 0.984375;
      },
      "elastic": (t) => {
        return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * (2 * Math.PI / 3));
      }
    };
    return this.kForEach((el) => {
      const start = {};
      const end = {};
      const units = {};
      for (const prop in properties) {
        const computed = window.getComputedStyle(el)[prop];
        const match = /^([\d.+-]+)([a-z%]*)$/i.exec(computed);
        start[prop] = match ? parseFloat(match[1]) : 0;
        units[prop] = match ? match[2] : "";
        end[prop] = parseFloat(properties[prop]);
      }
      const startTime = performance.now();
      const animateFrame = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const easeT = easings[easing] ? easings[easing](t) : t;
        for (const prop in properties) {
          const value = start[prop] + (end[prop] - start[prop]) * easeT;
          el.style[prop] = value + units[prop];
        }
        if (t < 1) {
          requestAnimationFrame(animateFrame);
        } else if (typeof callback === "function") {
          callback.call(el);
        }
      };
      requestAnimationFrame(animateFrame);
    });
  }
  // =========================
  // Media
  // =========================
  /**
   * Plays the selected <video> or <audio> elements.
   * @returns {KAnime}
   * @example
   * k('video').kPlayMedia();
   */
  kPlayMedia() {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        el.play();
      } else {
        throw new Error("kPlayMedia can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Pauses the selected <video> or <audio> elements.
   * @returns {KAnime}
   * @example
   * k('video').kPauseMedia();
   */
  kPauseMedia() {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        el.pause();
      } else {
        throw new Error("kPauseMedia can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Toggles play/pause for <video> or <audio> elements.
   * @returns {KAnime}
   * @example
   * k('video').kToggleMedia();
   */
  kToggleMedia() {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        if (el.paused) {
          el.play();
        } else {
          el.pause();
        }
      } else {
        throw new Error("kToggleMedia can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Sets the volume for <video> or <audio> elements.
   * @param {number} value
   * @returns {KAnime}
   * @example
   * k('video').kSetVolume(0.5);
   */
  kSetVolume(value) {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        el.volume = Math.min(Math.max(value, 0), 1);
      } else {
        throw new Error("kSetVolume can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Mutes <video> or <audio> elements.
   * @returns {KAnime}
   * @example
   * k('video').kMuteMedia();
   */
  kMuteMedia() {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        el.muted = true;
      } else {
        throw new Error("kMuteMedia can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Unmutes <video> or <audio> elements.
   * @returns {KAnime}
   * @example
   * k('video').kUnmuteMedia();
   */
  kUnmuteMedia() {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        el.muted = false;
      } else {
        throw new Error("kUnmuteMedia can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Seeks to a specific time in <video> or <audio> elements.
   * @param {number} time
   * @returns {KAnime}
   * @example
   * k('video').kSeekMedia(10);
   */
  kSeekMedia(time) {
    return this.kForEach((el) => {
      if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
        el.currentTime = Math.max(0, Math.min(time, el.duration || 0));
      } else {
        throw new Error("kSeekMedia can only be used on <video> or <audio> elements.");
      }
    });
  }
  /**
   * Gets the current playback time of the first <video> or <audio> element.
   * @returns {number}
   * @example
   * const t = k('video').kGetMediaTime();
   */
  kGetMediaTime() {
    if (this.elements[0].tagName === "VIDEO" || this.elements[0].tagName === "AUDIO") {
      return this.elements[0].currentTime;
    } else {
      throw new Error("kGetMediaTime can only be used on <video> or <audio> elements.");
    }
  }
  /**
   * Gets the duration of the first <video> or <audio> element.
   * @returns {number}
   * @example
   * const d = k('video').kGetMediaDuration();
   */
  kGetMediaDuration() {
    if (this.elements[0].tagName === "VIDEO" || this.elements[0].tagName === "AUDIO") {
      return this.elements[0].duration;
    } else {
      throw new Error("kGetMediaDuration can only be used on <video> or <audio> elements.");
    }
  }
  // =========================
  // Form
  // =========================
  /**
   * Serializes form data into a query string.
   * @returns {string}
   * @example
   * const params = k('form').kFormData();
   */
  kFormData() {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("kFormData can only be used on form elements.");
    }
    new FormData(form);
    const params = new URLSearchParams();
    Array.from(form.elements).forEach((el) => {
      if (!el.disabled && el.name) {
        if (el.type === "checkbox" || el.type === "radio") {
          if (el.checked) params.append(el.name, el.value);
        } else {
          params.append(el.name, el.value);
        }
      }
    });
    return params.toString();
  }
  /**
   * Serializes form data into an array of objects.
   * @returns {Array}
   * @example
   * const arr = k('form').kFormArray();
   */
  kFormArray() {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("kFormArray can only be used on form elements.");
    }
    const serializedArray = [];
    Array.from(form.elements).forEach((el) => {
      if (!el.disabled && el.name) {
        if (el.type === "checkbox" || el.type === "radio") {
          if (el.checked) serializedArray.push({ name: el.name, value: el.value });
        } else {
          serializedArray.push({ name: el.name, value: el.value });
        }
      }
    });
    return serializedArray;
  }
  /**
   * Gets or sets the value of form fields.
   * @param {any} value
   * @returns {any|KAnime}
   * @example
   * k('input').kValue('novo valor');
   * const v = k('input').kValue();
   */
  kValue(value) {
    if (value === void 0) {
      if (this.elements[0].type === "checkbox" || this.elements[0].type === "radio") {
        return this.elements.filter((el) => el.checked).map((el) => el.value);
      }
      return this.elements[0].value;
    }
    return this.kForEach((el) => el.value = value);
  }
  /**
   * Alias for kFormData.
   * @returns {string}
   * @example
   * const params = k('form').kFormParams();
   */
  kFormParams() {
    return this.kFormData();
  }
  /**
   * Adds a submit event handler to forms.
   * @param {Function} callback
   * @returns {KAnime}
   * @example
   * k('form').kOnFormSubmit((data, form) => { ... });
   */
  kOnFormSubmit(callback) {
    return this.kForEach((el) => {
      if (el instanceof HTMLFormElement) {
        el.addEventListener("submit", (event) => {
          event.preventDefault();
          const formData = new FormData(el);
          const data = Object.fromEntries(formData.entries());
          callback(data, el);
        });
      } else {
        throw new Error("kOnFormSubmit can only be used on form elements.");
      }
    });
  }
  /**
   * Submits a form via HTTP request.
   * @param {Object} options
   * @returns {Promise}
   * @example
   * k('form').kSubmitForm({ method: 'POST', json: true });
   */
  async kSubmitForm(options = {}) {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("kSubmitForm can only be used on form elements.");
    }
    const formData = new FormData(form);
    const method = options.method || "POST";
    const headers = { ...options.headers };
    let body;
    if (options.json) {
      body = JSON.stringify(Object.fromEntries(formData.entries()));
      headers["Content-Type"] = "application/json";
    } else {
      body = method.toUpperCase() === "GET" ? null : formData;
    }
    const controller = new AbortController();
    const timeout = options.timeout || 0;
    if (timeout > 0) {
      setTimeout(() => controller.abort(), timeout);
    }
    try {
      const response = await fetch(form.action, {
        method,
        headers,
        body,
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }
  // =========================
  // Attribute and Style
  // =========================
  /**
   * Gets or sets an attribute for the selected elements.
   * @param {string} attribute
   * @param {any} value
   * @returns {any|KAnime}
   * @example
   * k('.item').kAttr('data-id', '123');
   * const id = k('.item').kAttr('data-id');
   */
  kAttr(attribute, value) {
    if (value === void 0) {
      return this.elements[0].getAttribute(attribute);
    }
    return this.kForEach((el) => el.setAttribute(attribute, value));
  }
  /**
   * Gets or sets a CSS property for the selected elements.
   * @param {string} property
   * @param {any} value
   * @returns {any|KAnime}
   * @example
   * k('.item').kStyle('color', 'red');
   * const color = k('.item').kStyle('color');
   */
  kStyle(property, value) {
    if (value === void 0) {
      return window.getComputedStyle(this.elements[0])[property];
    }
    return this.kForEach((el) => el.style[property] = value);
  }
  /**
   * Adds a CSS class to the selected elements.
   * @param {string} className
   * @returns {KAnime}
   * @example
   * k('.item').kAddClass('active');
   */
  kAddClass(className) {
    return this.kForEach((el) => el.classList.add(className));
  }
  /**
   * Removes a CSS class from the selected elements.
   * @param {string} className
   * @returns {KAnime}
   * @example
   * k('.item').kRemoveClass('active');
   */
  kRemoveClass(className) {
    return this.kForEach((el) => el.classList.remove(className));
  }
  /**
   * Toggles a CSS class on the selected elements.
   * @param {string} className
   * @returns {KAnime}
   * @example
   * k('.item').kToggleClass('active');
   */
  kToggleClass(className) {
    return this.kForEach((el) => el.classList.toggle(className));
  }
}
const k = (selector, context = document) => new KAnime(selector, context);
if (typeof window !== "undefined") {
  window.k = k;
}
window.KAnime = KAnime;
window.k = k;
export {
  KAnime as default
};
