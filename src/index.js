/**
 * KAnime.js - A lightweight library for DOM manipulation, animations, events, and AJAX.
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
      // Handle CSS selectors
      this.elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof HTMLElement) {
      // Handle single HTML element
      this.elements = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      // Handle NodeList or array of elements
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

  /**
   * Adds an event to all selected elements.
   * @param {string} event - Event name.
   * @param {Function} handler - Function to be executed when the event occurs.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  on(event, handler) {
    return this.each(el => el.addEventListener(event, handler));
  }

  /**
   * Removes an event from all selected elements.
   * @param {string} event - Event name.
   * @param {Function} handler - Function associated with the event.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  off(event, handler) {
    return this.each(el => el.removeEventListener(event, handler));
  }

  /**
   * Adds an event that will be executed only once.
   * @param {string} event - Event name.
   * @param {Function} handler - Function to be executed when the event occurs.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  one(event, handler) {
    return this.each(el => {
      const onceHandler = (e) => {
        handler(e);
        el.removeEventListener(event, onceHandler);
      };
      el.addEventListener(event, onceHandler);
    });
  }

  /**
   * Serializes form data into a string in the key=value format.
   * @returns {string} - Serialized form data.
   */
  serialize() {
    const formData = new FormData(this.elements[0]);
    const serialized = [];
    formData.forEach((value, key) => {
      serialized.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return serialized.join('&');
  }

  /**
   * Serializes form data into an array of objects.
   * @returns {Array} - Array of objects with form data.
   */
  serializeArray() {
    const formData = new FormData(this.elements[0]);
    const serializedArray = [];
    formData.forEach((value, key) => {
      serializedArray.push({ name: key, value: value });
    });
    return serializedArray;
  }

  /**
   * Sets or returns the value of a form field.
   * @param {string} [value] - Value to be set (optional).
   * @returns {string|KAnime} - Returns the current value or the instance for chaining.
   */
  val(value) {
    if (value === undefined) {
      return this.elements[0].value; // Returns the value
    }
    return this.each(el => el.value = value); // Sets the value
  }

  /**
   * Returns serialized form data to be used in URLs (GET).
   * @returns {string} - Serialized form data.
   */
  param() {
    return this.serialize();
  }

  /**
   * Manipulates the style of the selected elements.
   * @param {string} property - CSS property.
   * @param {string} [value] - Property value (optional).
   * @returns {string|KAnime} - Returns the current value or the instance for chaining.
   */
  css(property, value) {
    if (value === undefined) {
      return window.getComputedStyle(this.elements[0])[property]; // get
    }
    return this.each(el => el.style[property] = value); // set
  }

  /**
   * Adds a CSS class to all selected elements.
   * @param {string} className - Class name.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  addClass(className) {
    return this.each(el => el.classList.add(className));
  }

  /**
   * Removes a CSS class from all selected elements.
   * @param {string} className - Class name.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  removeClass(className) {
    return this.each(el => el.classList.remove(className));
  }

  /**
   * Toggles a CSS class on all selected elements.
   * @param {string} className - Class name.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  toggleClass(className) {
    return this.each(el => el.classList.toggle(className));
  }

  /**
   * Shows all selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  show() {
    return this.each(el => el.style.display = 'block');
  }

  /**
   * Hides all selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  hide() {
    return this.each(el => el.style.display = 'none');
  }

  /**
   * Sets or returns the HTML content of the selected elements.
   * @param {string} [content] - HTML content to be set (optional).
   * @returns {string|KAnime} - Returns the current content or the instance for chaining.
   */
  html(content) {
    if (content === undefined) {
      return this.elements[0].innerHTML;
    }
    return this.each(el => el.innerHTML = content);
  }

  /**
   * Sets or returns the text content of the selected elements.
   * @param {string} [content] - Text content to be set (optional).
   * @returns {string|KAnime} - Returns the current text or the instance for chaining.
   */
  text(content) {
    if (content === undefined) {
      return this.elements[0].innerText;
    }
    return this.each(el => el.innerText = content);
  }

  /**
   * Sets or returns an attribute of the selected elements.
   * @param {string} attribute - Attribute name.
   * @param {string} [value] - Attribute value (optional).
   * @returns {string|KAnime} - Returns the current value or the instance for chaining.
   */
  attr(attribute, value) {
    if (value === undefined) {
      return this.elements[0].getAttribute(attribute);
    }
    return this.each(el => el.setAttribute(attribute, value));
  }

  /**
   * Removes an attribute from the selected elements.
   * @param {string} attribute - Attribute name.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  removeAttr(attribute) {
    return this.each(el => el.removeAttribute(attribute));
  }

  /**
   * Applies a fade-in effect to the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  fadeIn() {
    return this.each(el => {
      el.style.opacity = 0;
      el.style.display = 'block';

      let last = +new Date();
      const tick = () => {
        el.style.opacity = +el.style.opacity + (new Date() - last) / this.duration;
        last = +new Date();
        if (+el.style.opacity < 1) {
          requestAnimationFrame(tick);
        } else {
          el.style.opacity = 1;
        }
      };
      tick();
    });
  }

  /**
   * Applies a fade-out effect to the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  fadeOut() {
    return this.each(el => {
      el.style.opacity = 1;

      let last = +new Date();
      const tick = () => {
        el.style.opacity = +el.style.opacity - (new Date() - last) / this.duration;
        last = +new Date();
        if (+el.style.opacity > 0) {
          requestAnimationFrame(tick);
        } else {
          el.style.opacity = 0;
          el.style.display = 'none';
        }
      };
      tick();
    });
  }

  /**
   * Applies a slide-up effect to the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  slideUp() {
    return this.each(el => {
      el.style.height = el.offsetHeight + 'px';
      el.style.transition = `height ${this.duration}ms ease`;
      el.offsetHeight; // reflow
      el.style.overflow = 'hidden';
      el.style.height = '0';

      setTimeout(() => {
        el.style.display = 'none';
        el.style.removeProperty('height');
        el.style.removeProperty('overflow');
        el.style.removeProperty('transition');
      }, this.duration);
    });
  }

  /**
   * Applies a slide-down effect to the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  slideDown() {
    return this.each(el => {
      el.style.display = 'block';
      const height = el.scrollHeight;
      el.style.height = '0';
      el.style.overflow = 'hidden';
      el.style.transition = `height ${this.duration}ms ease`;
      el.offsetHeight; // reflow
      el.style.height = height + 'px';

      setTimeout(() => {
        el.style.removeProperty('height');
        el.style.removeProperty('overflow');
        el.style.removeProperty('transition');
      }, this.duration);
    });
  }

  /**
   * Checks if any of the selected elements are visible.
   * @returns {boolean} - Returns true if any element is visible.
   */
  isVisible() {
    return this.elements.some(el => {
      return window.getComputedStyle(el).display !== 'none' && el.offsetHeight > 0;
    });
  }

  /**
   * Checks if any of the selected elements contain a specific class.
   * @param {string} className - Class name.
   * @returns {boolean} - Returns true if any element contains the class.
   */
  hasClass(className) {
    return this.elements.some(el => el.classList.contains(className));
  }

  /**
   * Checks if any of the selected elements contain a specific attribute.
   * @param {string} attribute - Attribute name.
   * @returns {boolean} - Returns true if any element contains the attribute.
   */
  hasAttr(attribute) {
    return this.elements.some(el => el.hasAttribute(attribute));
  }

  /**
   * Checks if any of the selected elements are checked (checkboxes or radio buttons).
   * @returns {boolean} - Returns true if any element is checked.
   */
  isChecked() {
    return this.elements.some(el => el.checked === true);
  }

  /**
   * Checks if any of the selected elements are enabled.
   * @returns {boolean} - Returns true if any element is enabled.
   */
  isEnabled() {
    return this.elements.some(el => !el.disabled);
  }

  /**
   * Checks if any of the selected elements are disabled.
   * @returns {boolean} - Returns true if any element is disabled.
   */
  isDisabled() {
    return this.elements.some(el => el.disabled);
  }

  /**
   * Submits the form of the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  submit() {
    return this.each(el => el.submit());
  }

  /**
   * Animates the properties of the selected elements.
   * @param {Object} properties - Properties to be animated.
   * @param {number} [duration=this.duration] - Animation duration.
   * @param {string} [easing='linear'] - Easing type.
   * @returns {Promise} - Returns a promise that resolves when the animation ends.
   */
  animate(properties, duration = this.duration, easing = 'linear') {
    return new Promise((resolve) => {
      this.each(el => {
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
            el.style[prop] = currentValue + (prop === 'opacity' ? '' : 'px');
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

  /**
   * Function to apply easing (simplified).
   * @param {number} t - Animation progress (0 to 1).
   * @param {string} type - Easing type.
   * @returns {number} - Value adjusted by easing.
   */
  _ease(t, type) {
    switch (type) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-out':
        return t * (2 - t);
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t; // Default linear easing
    }
  }

  /**
   * Performs an AJAX request.
   * @param {Object} options - Request options.
   * @param {string} options.url - Request URL.
   * @param {string} [options.method='GET'] - HTTP method.
   * @param {Object} [options.data=null] - Data to be sent.
   * @param {Object} [options.headers={}] - Request headers.
   * @returns {Promise} - Returns a promise with the response.
   */
  ajax({ url, method = 'GET', data = null, headers = {} }) {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : null
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  /**
   * Checks if the browser supports modern APIs.
   * @returns {boolean} - Returns true if the browser is compatible.
   */
  static isModernBrowser() {
    return 'querySelector' in document && 'addEventListener' in window && 'fetch' in window;
  }

  /**
   * Throws an error if the browser is not compatible.
   */
  static checkCompatibility() {
    const isCompatible = 'querySelector' in document && 'addEventListener' in window && 'fetch' in window;

    if (!isCompatible) {
      throw new Error('Your browser is incompatible with the KAnime library. Please update to a recent version.');
    }
  }

  /**
   * Creates a KAnime instance based on a selector.
   * @param {string} selector - CSS selector.
   * @returns {KAnime} - New KAnime instance.
   */
  static select(selector) {
    return new KAnime(selector);
  }

  /**
   * Creates a virtual DOM element with attributes and children.
   * @param {string} tagName - Tag name of the element.
   * @param {Object} attributes - Element attributes.
   * @param {Array} children - Element children.
   * @returns {HTMLElement} - Created DOM element.
   */
  static createVirtualElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);

    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  }

  /**
   * List of registered plugins.
   * @type {Object}
   */
  static plugins = {};

  /**
   * Registers a plugin.
   * @param {string} pluginName - Plugin name.
   * @param {Function} pluginFunction - Plugin function.
   */
  static use(pluginName, pluginFunction) {
    if (typeof pluginFunction !== 'function') {
      throw new Error(`Plugin ${pluginName} must be a function.`);
    }
    this.plugins[pluginName] = pluginFunction;
  }

  /**
   * Calls a registered plugin.
   * @param {string} pluginName - Plugin name.
   * @param {...any} args - Arguments for the plugin function.
   * @returns {any} - Returns the result of the plugin function.
   */
  static callPlugin(pluginName, ...args) {
    if (this.plugins[pluginName]) {
      return this.plugins[pluginName](...args);
    } else {
      throw new Error(`Plugin ${pluginName} not found.`);
    }
  }

  /**
   * Lists all registered plugins.
   * @returns {Array} - Array with the names of the plugins.
   */
  static listPlugins() {
    return Object.keys(this.plugins);
  }

  /**
   * Removes a registered plugin.
   * @param {string} pluginName - Plugin name.
   */
  static removePlugin(pluginName) {
    if (this.plugins[pluginName]) {
      delete this.plugins[pluginName];
    } else {
      throw new Error(`Plugin ${pluginName} not found.`);
    }
  }

  /**
   * Internationalization (i18n) support.
   * @type {Object}
   */
  static i18n = {
    locale: 'en',
    translations: {},

    /**
     * Sets the current language.
     * @param {string} locale - Language code.
     */
    setLocale(locale) {
      this.locale = locale;
    },

    /**
     * Adds translations for a language.
     * @param {string} locale - Language code.
     * @param {Object} translations - Translations.
     */
    addTranslations(locale, translations) {
      this.translations[locale] = {
        ...this.translations[locale],
        ...translations
      };
    },

    /**
     * Translates a key to the current language.
     * @param {string} key - Translation key.
     * @returns {string} - Translation or the key itself if not found.
     */
    translate(key) {
      return this.translations[this.locale]?.[key] || key;
    }
  };
}

// Define a global function for simplified selection
/**
 * Simplified global selection method, similar to jQuery's $().
 * @param {string|HTMLElement|NodeList} selector - CSS selector, HTML element, or NodeList.
 * @param {HTMLElement} [context=document] - Context for the selection (optional).
 * @returns {KAnime} - Returns a new instance of KAnime.
 */
const $ = (selector, context = document) => new KAnime(selector, context);

// Attach the global function to the window object (for browser environments)
if (typeof window !== 'undefined') {
  window.$ = $;
}

export default KAnime;
