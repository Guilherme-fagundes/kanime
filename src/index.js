/**
 * KAnime.js - A lightweight library for DOM manipulation, animations, events, and HTTP requests.
 * 
 * @class KAnime
 * @param {string} selector - A CSS selector to select DOM elements.
 */
class KAnime {
  /**
   * Creates an instance of KAnime.
   * @param {string|HTMLElement|NodeList} selector - CSS selector, HTML element, or NodeList.
   */
  constructor(selector) {
    if (!KAnime.isModernBrowser()) {
      throw new Error('Your browser is incompatible with the KAnime library. Please update to a recent version.');
    }

    if (typeof selector === 'string') {
      this.elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof HTMLElement) {
      this.elements = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      this.elements = Array.from(selector);
    } else {
      throw new Error('Invalid selector. Must be a string, HTMLElement, or NodeList.');
    }

    this.duration = 500; // Default duration
  }

  /**
   * Iterates over the selected elements and executes a callback.
   * @param {Function} callback - Function to be executed for each element.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  each(callback) {
    this.elements.forEach(callback);
    return this;
  }

  /**
   * Sets the default duration for animations.
   * @param {number} ms - Duration in milliseconds.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  setDuration(ms) {
    this.duration = ms;
    return this;
  }

  // DOM Manipulation Methods
  append(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('beforeend', content);
      } else if (content instanceof HTMLElement) {
        el.appendChild(content);
      }
    });
  }

  prepend(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('afterbegin', content);
      } else if (content instanceof HTMLElement) {
        el.insertBefore(content, el.firstChild);
      }
    });
  }

  before(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('beforebegin', content);
      } else if (content instanceof HTMLElement) {
        el.parentNode.insertBefore(content, el);
      }
    });
  }

  after(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('afterend', content);
      } else if (content instanceof HTMLElement) {
        el.parentNode.insertBefore(content, el.nextSibling);
      }
    });
  }

  remove() {
    return this.each(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  clone(deep = true) {
    const clones = this.elements.map(el => el.cloneNode(deep));
    return new KAnime(clones);
  }

  wrap(wrapper) {
    return this.each(el => {
      const wrapElement = typeof wrapper === 'string'
        ? document.createElement('div').insertAdjacentHTML('afterbegin', wrapper).firstElementChild
        : wrapper.cloneNode(true);

      el.parentNode.insertBefore(wrapElement, el);
      wrapElement.appendChild(el);
    });
  }

  unwrap() {
    return this.each(el => {
      const parent = el.parentNode;
      if (parent && parent !== document.body) {
        while (parent.firstChild) {
          parent.parentNode.insertBefore(parent.firstChild, parent);
        }
        parent.parentNode.removeChild(parent);
      }
    });
  }

  // Event Handling Methods
  on(events, selectorOrHandler, handler = null, context = null) {
    const isDelegation = typeof selectorOrHandler === 'string';
    const eventList = events.split(/[,\s]+/);

    return this.each(el => {
      eventList.forEach(event => {
        if (isDelegation) {
          el.addEventListener(event, e => {
            if (e.target.matches(selectorOrHandler)) {
              handler.call(context || e.target, e);
            }
          });
        } else {
          el.addEventListener(event, e => {
            selectorOrHandler.call(context || el, e);
          });
        }
      });
    });
  }

  off(event, handler) {
    return this.each(el => el.removeEventListener(event, handler));
  }

  one(event, handler) {
    return this.each(el => {
      const onceHandler = (e) => {
        handler(e);
        el.removeEventListener(event, onceHandler);
      };
      el.addEventListener(event, onceHandler);
    });
  }

  trigger(event) {
    return this.each(el => {
      const evt = new Event(event, { bubbles: true, cancelable: true });
      el.dispatchEvent(evt);
    });
  }

  hover(mouseEnterHandler, mouseLeaveHandler) {
    return this.each(el => {
      el.addEventListener('mouseenter', mouseEnterHandler);
      el.addEventListener('mouseleave', mouseLeaveHandler);
    });
  }

  // Animation Methods
  fadeShow() {
    return this.each(el => {
      if (window.getComputedStyle(el).display === 'none') {
        el.style.display = 'block';
        el.style.opacity = 0;
      }
      el.style.transition = `opacity ${this.duration}ms ease-in-out`;

      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.opacity = 1;
      });
    });
  }

  fadeHide() {
    return this.each(el => {
      el.style.opacity = 1;
      el.style.transition = `opacity ${this.duration}ms ease-in-out`;

      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.opacity = 0;

        setTimeout(() => {
          el.style.display = 'none';
        }, this.duration);
      });
    });
  }

  fadeShowHide() {
    return this.each(el => {
      const isHidden = window.getComputedStyle(el).display === 'none';
      if (isHidden) {
        this.fadeShow();
      } else {
        this.fadeHide();
      }
    });
  }

  // Media Methods
  play() {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        el.play();
      } else {
        throw new Error('The play method can only be used on <video> or <audio> elements.');
      }
    });
  }

  pause() {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        el.pause();
      } else {
        throw new Error('The pause method can only be used on <video> or <audio> elements.');
      }
    });
  }

  togglePlay() {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        if (el.paused) {
          el.play();
        } else {
          el.pause();
        }
      } else {
        throw new Error('The togglePlay method can only be used on <video> or <audio> elements.');
      }
    });
  }

  setVolume(value) {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        el.volume = Math.min(Math.max(value, 0), 1); // Ensure volume is between 0 and 1
      } else {
        throw new Error('The setVolume method can only be used on <video> or <audio> elements.');
      }
    });
  }

  mute() {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        el.muted = true;
      } else {
        throw new Error('The mute method can only be used on <video> or <audio> elements.');
      }
    });
  }

  unmute() {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        el.muted = false;
      } else {
        throw new Error('The unmute method can only be used on <video> or <audio> elements.');
      }
    });
  }

  seekTo(time) {
    return this.each(el => {
      if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
        el.currentTime = Math.max(0, Math.min(time, el.duration || 0));
      } else {
        throw new Error('The seekTo method can only be used on <video> or <audio> elements.');
      }
    });
  }

  getCurrentTime() {
    if (this.elements[0].tagName === 'VIDEO' || this.elements[0].tagName === 'AUDIO') {
      return this.elements[0].currentTime;
    } else {
      throw new Error('The getCurrentTime method can only be used on <video> or <audio> elements.');
    }
  }

  getDuration() {
    if (this.elements[0].tagName === 'VIDEO' || this.elements[0].tagName === 'AUDIO') {
      return this.elements[0].duration;
    } else {
      throw new Error('The getDuration method can only be used on <video> or <audio> elements.');
    }
  }

  // Form Handling Methods
  serialize() {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('serialize can only be used on form elements.');
    }

    const formData = new FormData(form);
    const params = new URLSearchParams();

    Array.from(form.elements).forEach(el => {
      if (!el.disabled && el.name) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) params.append(el.name, el.value);
        } else {
          params.append(el.name, el.value);
        }
      }
    });

    return params.toString();
  }

  serializeArray() {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('serializeArray can only be used on form elements.');
    }

    const serializedArray = [];

    Array.from(form.elements).forEach(el => {
      if (!el.disabled && el.name) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) serializedArray.push({ name: el.name, value: el.value });
        } else {
          serializedArray.push({ name: el.name, value: el.value });
        }
      }
    });

    return serializedArray;
  }

  val(value) {
    if (value === undefined) {
      if (this.elements[0].type === 'checkbox' || this.elements[0].type === 'radio') {
        return this.elements.filter(el => el.checked).map(el => el.value);
      }
      return this.elements[0].value;
    }
    return this.each(el => el.value = value);
  }

  param() {
    return this.serialize();
  }

  submit(callback) {
    return this.each(el => {
      if (el instanceof HTMLFormElement) {
        el.addEventListener('submit', event => {
          event.preventDefault();
          const formData = new FormData(el);
          const data = Object.fromEntries(formData.entries());
          callback(data, el);
        });
      } else {
        throw new Error('The submit method can only be used on form elements.');
      }
    });
  }

  async submitRequest(options = {}) {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('submitRequest can only be used on form elements.');
    }

    const formData = new FormData(form);
    const method = options.method || 'POST';
    const headers = { ...options.headers };

    let body;
    if (options.json) {
      body = JSON.stringify(Object.fromEntries(formData.entries()));
      headers['Content-Type'] = 'application/json';
    } else {
      body = method.toUpperCase() === 'GET' ? null : formData;
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

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  // Attribute and Style Methods
  attr(attribute, value) {
    if (value === undefined) {
      return this.elements[0].getAttribute(attribute);
    }
    return this.each(el => el.setAttribute(attribute, value));
  }

  css(property, value) {
    if (value === undefined) {
      return window.getComputedStyle(this.elements[0])[property];
    }
    return this.each(el => el.style[property] = value);
  }

  addClass(className) {
    return this.each(el => el.classList.add(className));
  }

  removeClass(className) {
    return this.each(el => el.classList.remove(className));
  }

  toggleClass(className) {
    return this.each(el => el.classList.toggle(className));
  }

  // Utility Methods
  static isModernBrowser() {
    return 'querySelector' in document && 'addEventListener' in window && 'fetch' in window;
  }

  static select(selector) {
    return new KAnime(selector);
  }
}

// Define a global function for simplified selection
const $ = (selector, context = document) => new KAnime(selector, context);

if (typeof window !== 'undefined') {
  window.$ = $;
}

window.KAnime = KAnime;
window.$ = $;

export default KAnime;
