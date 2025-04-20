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

  // DOM Manipulation Methods
  /**
   * Appends content to each selected element.
   * @param {string|HTMLElement} content - The content to append.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  append(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('beforeend', content);
      } else if (content instanceof HTMLElement) {
        el.appendChild(content);
      }
    });
  }

  /**
   * Prepends content to each selected element.
   * @param {string|HTMLElement} content - The content to prepend.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  prepend(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('afterbegin', content);
      } else if (content instanceof HTMLElement) {
        el.insertBefore(content, el.firstChild);
      }
    });
  }

  /**
   * Inserts content before each selected element.
   * @param {string|HTMLElement} content - The content to insert before.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  before(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('beforebegin', content);
      } else if (content instanceof HTMLElement) {
        el.parentNode.insertBefore(content, el);
      }
    });
  }

  /**
   * Inserts content after each selected element.
   * @param {string|HTMLElement} content - The content to insert after.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  after(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('afterend', content);
      } else if (content instanceof HTMLElement) {
        el.parentNode.insertBefore(content, el.nextSibling);
      }
    });
  }

  /**
   * Removes all selected elements from the DOM.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  remove() {
    return this.each(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  /**
   * Clones the selected elements.
   * @param {boolean} [deep=true] - Whether to perform a deep clone (including child nodes).
   * @returns {KAnime} - Returns a new instance containing the cloned elements.
   */
  clone(deep = true) {
    const clones = this.elements.map(el => el.cloneNode(deep));
    return new KAnime(clones);
  }

  /**
   * Wraps each selected element with the specified HTML structure.
   * @param {string|HTMLElement} wrapper - The HTML structure or element to wrap around the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  wrap(wrapper) {
    return this.each(el => {
      const wrapElement = typeof wrapper === 'string'
        ? document.createElement('div').insertAdjacentHTML('afterbegin', wrapper).firstElementChild
        : wrapper.cloneNode(true);

      el.parentNode.insertBefore(wrapElement, el);
      wrapElement.appendChild(el);
    });
  }

  /**
   * Removes the parent of each selected element, keeping the elements in the DOM.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
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
  /**
   * Adds an event listener to the selected elements with support for delegation, multiple events (comma-separated), and custom context.
   * @param {string} events - Event(s) to listen for (e.g., 'click, mouseover'). Multiple events can be separated by commas or spaces.
   * @param {string|Function} selectorOrHandler - A CSS selector for delegation or the event handler function.
   * @param {Function} [handler] - The event handler function (if delegation is used).
   * @param {Object} [context=null] - Custom context for the handler (optional).
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  on(events, selectorOrHandler, handler = null, context = null) {
    const isDelegation = typeof selectorOrHandler === 'string';
    const eventList = events.split(/[,\s]+/); // Split by commas or spaces

    return this.each(el => {
      eventList.forEach(event => {
        if (isDelegation) {
          // Delegation: selectorOrHandler is a CSS selector
          el.addEventListener(event, e => {
            if (e.target.matches(selectorOrHandler)) {
              handler.call(context || e.target, e);
            }
          });
        } else {
          // Direct binding: selectorOrHandler is the handler
          el.addEventListener(event, e => {
            selectorOrHandler.call(context || el, e);
          });
        }
      });
    });
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
   * Triggers an event on the selected elements.
   * @param {string} event - The name of the event to trigger.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  trigger(event) {
    return this.each(el => {
      const evt = new Event(event, { bubbles: true, cancelable: true });
      el.dispatchEvent(evt);
    });
  }

  /**
   * Binds handlers for mouseenter and mouseleave events.
   * @param {Function} mouseEnterHandler - Handler for the mouseenter event.
   * @param {Function} mouseLeaveHandler - Handler for the mouseleave event.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  hover(mouseEnterHandler, mouseLeaveHandler) {
    return this.each(el => {
      el.addEventListener('mouseenter', mouseEnterHandler);
      el.addEventListener('mouseleave', mouseLeaveHandler);
    });
  }

  // Animation Methods
  /**
   * Applies a fade-in effect using CSS transitions for better performance.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  fadeIn() {
    return this.each(el => {
      if (window.getComputedStyle(el).display === 'none') {
        el.style.display = 'block';
        el.style.opacity = 0;
      }
      el.style.transition = `opacity ${this.duration}ms ease-in-out`;

      // Ensure reflow to apply transition
      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.opacity = 1;
      });
    });
  }

  /**
   * Applies a fade-out effect using CSS transitions for better performance.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  fadeOut() {
    return this.each(el => {
      el.style.opacity = 1;
      el.style.transition = `opacity ${this.duration}ms ease-in-out`;

      // Ensure reflow to apply transition
      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.opacity = 0;

        setTimeout(() => {
          el.style.display = 'none';
        }, this.duration);
      });
    });
  }

  /**
   * Applies a slide-up effect using CSS transitions for better performance.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  slideUp() {
    return this.each(el => {
      if (window.getComputedStyle(el).display === 'none') {
        return;
      }

      const style = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const paddingTop = parseFloat(style.paddingTop);
      const paddingBottom = parseFloat(style.paddingBottom);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);

      el.style.height = `${height}px`;
      el.style.paddingTop = `${paddingTop}px`;
      el.style.paddingBottom = `${paddingBottom}px`;
      el.style.marginTop = `${marginTop}px`;
      el.style.marginBottom = `${marginBottom}px`;
      el.style.overflow = 'hidden';
      el.style.transition = `height ${this.duration}ms ease-in-out, padding ${this.duration}ms ease-in-out, margin ${this.duration}ms ease-in-out`;

      // Ensure reflow to apply transition
      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.height = '0';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
        el.style.marginTop = '0';
        el.style.marginBottom = '0';

        setTimeout(() => {
          el.style.display = 'none';
          el.style.removeProperty('height');
          el.style.removeProperty('padding-top');
          el.style.removeProperty('padding-bottom');
          el.style.removeProperty('margin-top');
          el.style.removeProperty('margin-bottom');
          el.style.removeProperty('overflow');
          el.style.removeProperty('transition');
        }, this.duration);
      });
    });
  }

  /**
   * Applies a slide-down effect using CSS transitions for better performance.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  slideDown() {
    return this.each(el => {
      if (window.getComputedStyle(el).display !== 'none') {
        return;
      }

      el.style.display = 'block';
      const style = window.getComputedStyle(el);
      const height = el.scrollHeight;
      const paddingTop = parseFloat(style.paddingTop);
      const paddingBottom = parseFloat(style.paddingBottom);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);

      el.style.height = '0';
      el.style.paddingTop = '0';
      el.style.paddingBottom = '0';
      el.style.marginTop = '0';
      el.style.marginBottom = '0';
      el.style.overflow = 'hidden';
      el.style.transition = `height ${this.duration}ms ease-in-out, padding ${this.duration}ms ease-in-out, margin ${this.duration}ms ease-in-out`;

      // Ensure reflow to apply transition
      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.height = `${height}px`;
        el.style.paddingTop = `${paddingTop}px`;
        el.style.paddingBottom = `${paddingBottom}px`;
        el.style.marginTop = `${marginTop}px`;
        el.style.marginBottom = `${marginBottom}px`;

        setTimeout(() => {
          el.style.removeProperty('height');
          el.style.removeProperty('padding-top');
          el.style.removeProperty('padding-bottom');
          el.style.removeProperty('margin-top');
          el.style.removeProperty('margin-bottom');
          el.style.removeProperty('overflow');
          el.style.removeProperty('transition');
        }, this.duration);
      });
    });
  }

  /**
   * Toggles between fadeIn and fadeOut based on the element's visibility.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  fadeToggle() {
    return this.each(el => {
      const isHidden = window.getComputedStyle(el).display === 'none';
      if (isHidden) {
        this.fadeIn();
      } else {
        this.fadeOut();
      }
    });
  }

  /**
   * Toggles between slideUp and slideDown based on the element's visibility.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  slideToggle() {
    return this.each(el => {
      const isHidden = window.getComputedStyle(el).display === 'none';
      if (isHidden) {
        this.slideDown();
      } else {
        this.slideUp();
      }
    });
  }

  // Form Handling Methods
  /**
   * Serializes form data into a string, including disabled fields.
   * @returns {string} - Serialized form data in key=value format.
   */
  serialize() {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('serialize can only be used on form elements.');
    }

    const formData = new FormData(form);
    const params = new URLSearchParams();

    // Include disabled fields
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

  /**
   * Serializes form data into an array of objects, including disabled fields.
   * @returns {Array} - Array of objects with name and value pairs.
   */
  serializeArray() {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('serializeArray can only be used on form elements.');
    }

    const serializedArray = [];

    // Include disabled fields
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

  /**
   * Gets or sets the value of form fields.
   * @param {string} [value] - Value to set (optional).
   * @returns {string|Array|KAnime} - Returns the current value(s) or the instance for chaining.
   */
  val(value) {
    if (value === undefined) {
      if (this.elements[0].type === 'checkbox' || this.elements[0].type === 'radio') {
        // Return values of checked checkboxes or radio buttons
        return this.elements.filter(el => el.checked).map(el => el.value);
      }
      return this.elements[0].value; // Return value of the first element
    }
    return this.each(el => el.value = value); // Set value for all elements
  }

  /**
   * Returns serialized form data to be used in URLs (GET).
   * @returns {string} - Serialized form data.
   */
  param() {
    return this.serialize();
  }

  /**
   * Attaches a submit event to the selected form.
   * @param {Function} callback - A callback function to handle form data and submission.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  submit(callback) {
    return this.each(el => {
      if (el instanceof HTMLFormElement) {
        el.addEventListener('submit', event => {
          event.preventDefault(); // Prevent default form submission
          const formData = new FormData(el);
          const data = Object.fromEntries(formData.entries()); // Convert FormData to an object
          callback(data, el); // Pass the data and form element to the callback
        });
      } else {
        throw new Error('The submit method can only be used on form elements.');
      }
    });
  }

  /**
   * Submits a form via AJAX with support for file uploads.
   * @param {Object} [options] - Options for the AJAX request.
   * @param {string} [options.method='POST'] - HTTP method (e.g., 'POST', 'GET').
   * @param {Object} [options.headers={}] - Additional headers for the request.
   * @param {number} [options.timeout=0] - Timeout in milliseconds (0 for no timeout).
   * @param {boolean} [options.json=false] - Whether to send the data as JSON (files will be ignored if true).
   * @returns {Promise} - Resolves with the server response or rejects with an error.
   */
  async ajaxSubmit(options = {}) {
    const form = this.elements[0];
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('ajaxSubmit can only be used on form elements.');
    }

    const formData = new FormData(form);
    const method = options.method || 'POST';
    const headers = {
      ...options.headers
    };

    let body;
    if (options.json) {
      // Convert FormData to JSON (files will be ignored)
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
   * Sets or gets multiple attributes for the selected elements.
   * @param {Object} [attributes] - An object where keys are attribute names and values are attribute values.
   * @returns {Object|KAnime} - Returns an object with attributes if no argument is provided, or the instance for chaining.
   */
  attrs(attributes) {
    if (attributes === undefined) {
      const el = this.elements[0];
      if (!el) return {};
      return Array.from(el.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {});
    }
    return this.each(el => {
      for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
      }
    });
  }

  /**
   * Toggles an attribute on the selected elements.
   * @param {string} attribute - The name of the attribute to toggle.
   * @param {boolean} [force] - A boolean value to force adding or removing the attribute.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  toggleAttr(attribute, force) {
    return this.each(el => {
      if (force === undefined) {
        if (el.hasAttribute(attribute)) {
          el.removeAttribute(attribute);
        } else {
          el.setAttribute(attribute, '');
        }
      } else if (force) {
        el.setAttribute(attribute, '');
      } else {
        el.removeAttribute(attribute);
      }
    });
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

  // Utility Methods
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
   * Extends the target object with properties from source objects.
   * @param {Object} target - The target object to extend.
   * @param {...Object} sources - The source objects to copy properties from.
   * @returns {Object} - Returns the extended target object.
   */
  static extend(target, ...sources) {
    return Object.assign(target, ...sources);
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

  /**
   * Removes elements from the DOM but keeps their data and events.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  detach() {
    return this.each(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  /**
   * Replaces each selected element with the provided content.
   * @param {string|HTMLElement} content - The content to replace the selected elements with.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  replaceWith(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('beforebegin', content);
        el.parentNode.removeChild(el);
      } else if (content instanceof HTMLElement) {
        el.parentNode.replaceChild(content, el);
      }
    });
  }

  /**
   * Removes all child nodes of the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  empty() {
    return this.each(el => {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    });
  }

  /**
   * Selects the closest ancestor of each selected element that matches the selector.
   * @param {string} selector - A CSS selector to match the ancestor.
   * @returns {KAnime} - Returns a new instance containing the matched ancestors.
   */
  closest(selector) {
    const ancestors = this.elements.map(el => el.closest(selector)).filter(el => el);
    return new KAnime(ancestors);
  }

  /**
   * Selects the next sibling of each selected element.
   * @returns {KAnime} - Returns a new instance containing the next siblings.
   */
  next() {
    const nextSiblings = this.elements.map(el => el.nextElementSibling).filter(el => el);
    return new KAnime(nextSiblings);
  }

  /**
   * Selects the previous sibling of each selected element.
   * @returns {KAnime} - Returns a new instance containing the previous siblings.
   */
  prev() {
    const prevSiblings = this.elements.map(el => el.previousElementSibling).filter(el => el);
    return new KAnime(prevSiblings);
  }

  /**
   * Finds descendants of each selected element that match the selector.
   * @param {string} selector - A CSS selector to match descendants.
   * @returns {KAnime} - Returns a new instance containing the matched elements.
   */
  find(selector) {
    const descendants = this.elements.flatMap(el => Array.from(el.querySelectorAll(selector)));
    return new KAnime(descendants);
  }

  /**
   * Stores or retrieves data associated with the selected elements.
   * @param {string} key - The key for the data.
   * @param {any} [value] - The value to store (if omitted, retrieves the value).
   * @returns {any|KAnime} - Returns the stored value or the current instance for chaining.
   */
  data(key, value) {
    if (value === undefined) {
      return this.elements[0]?.dataset[key];
    }
    return this.each(el => {
      el.dataset[key] = value;
    });
  }

  /**
   * Toggles the visibility of the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  toggle() {
    return this.each(el => {
      const isHidden = window.getComputedStyle(el).display === 'none';
      el.style.display = isHidden ? 'block' : 'none';
    });
  }

  /**
   * Stops the currently running animations on the selected elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  stop() {
    return this.each(el => {
      el.style.transition = 'none';
    });
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
   * Performs an AJAX request with enhanced features.
   * @param {Object} options - Request options.
   * @param {string} options.url - Request URL.
   * @param {string} [options.method='GET'] - HTTP method (e.g., 'GET', 'POST').
   * @param {Object} [options.data=null] - Data to be sent (JSON or FormData).
   * @param {Object} [options.headers={}] - Request headers.
   * @param {number} [options.timeout=0] - Timeout in milliseconds (0 for no timeout).
   * @returns {Promise} - Returns a promise with the response.
   */
  async ajax({ url, method = 'GET', data = null, headers = {}, timeout = 0 }) {
    const controller = new AbortController();
    const signal = controller.signal;

    if (timeout > 0) {
      setTimeout(() => controller.abort(), timeout);
    }

    const isFormData = data instanceof FormData;
    const requestHeaders = {
      ...headers,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    };

    const body = isFormData ? data : data ? JSON.stringify(data) : null;

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method.toUpperCase() === 'GET' ? null : body,
        signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType && contentType.includes('text/')) {
        return await response.text();
      } else {
        return await response.blob();
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
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
   * Loads and executes a script from a remote URL.
   * @param {string} url - The URL of the script to load.
   * @returns {Promise} - Resolves when the script is loaded.
   */
  static getScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Checks if any of the selected elements match the selector.
   * @param {string} selector - A CSS selector to match.
   * @returns {boolean} - Returns true if any element matches the selector.
   */
  is(selector) {
    return this.elements.some(el => el.matches(selector));
  }

  /**
   * Plays the selected video or audio elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  play() {
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.play().catch(err => console.error('Error playing media:', err));
      }
    });
  }

  /**
   * Pauses the selected video or audio elements.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  pause() {
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.pause();
      }
    });
  }

  /**
   * Sets or gets the current playback time of the selected video or audio elements.
   * @param {number} [time] - The time to set in seconds (optional).
   * @returns {number|KAnime} - Returns the current time or the instance for chaining.
   */
  currentTime(time) {
    if (time === undefined) {
      return this.elements[0] instanceof HTMLMediaElement ? this.elements[0].currentTime : null;
    }
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.currentTime = time;
      }
    });
  }

  /**
   * Sets or gets the volume of the selected video or audio elements.
   * @param {number} [volume] - The volume level to set (0.0 to 1.0).
   * @returns {number|KAnime} - Returns the current volume or the instance for chaining.
   */
  volume(volume) {
    if (volume === undefined) {
      return this.elements[0] instanceof HTMLMediaElement ? this.elements[0].volume : null;
    }
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.volume = Math.min(1, Math.max(0, volume));
      }
    });
  }

  /**
   * Mutes or unmutes the selected video or audio elements.
   * @param {boolean} [mute=true] - Whether to mute (true) or unmute (false).
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  mute(mute = true) {
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.muted = mute;
      }
    });
  }

  /**
   * Checks if the selected video or audio elements are currently playing.
   * @returns {boolean} - Returns true if any element is playing.
   */
  isPlaying() {
    return this.elements.some(el => el instanceof HTMLMediaElement && !el.paused && !el.ended);
  }

  /**
   * Loads a new source into the selected video or audio elements.
   * @param {string} src - The source URL to load.
   * @returns {KAnime} - Returns the current instance for chaining.
   */
  loadSource(src) {
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.src = src;
        el.load();
      }
    });
  }

  /**
   * Sets or gets the playback rate of the selected video or audio elements.
   * @param {number} [rate] - The playback rate to set (e.g., 1.0 for normal speed).
   * @returns {number|KAnime} - Returns the current playback rate or the instance for chaining.
   */
  playbackRate(rate) {
    if (rate === undefined) {
      return this.elements[0] instanceof HTMLMediaElement ? this.elements[0].playbackRate : null;
    }
    return this.each(el => {
      if (el instanceof HTMLMediaElement) {
        el.playbackRate = rate;
      }
    });
  }

  /**
   * Gets or sets the width of the selected elements.
   * @param {number} [value] - The width to set in pixels (optional).
   * @returns {number|KAnime} - Returns the current width or the instance for chaining.
   */
  width(value) {
    if (value === undefined) {
      return this.elements[0]?.offsetWidth || 0;
    }
    return this.each(el => {
      el.style.width = `${value}px`;
    });
  }

  /**
   * Gets or sets the height of the selected elements.
   * @param {number} [value] - The height to set in pixels (optional).
   * @returns {number|KAnime} - Returns the current height or the instance for chaining.
   */
  height(value) {
    if (value === undefined) {
      return this.elements[0]?.offsetHeight || 0;
    }
    return this.each(el => {
      el.style.height = `${value}px`;
    });
  }

  /**
   * Gets the width of the document.
   * @returns {number} - Returns the width of the document in pixels.
   */
  static documentWidth() {
    return Math.max(
      document.documentElement.clientWidth,
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth
    );
  }

  /**
   * Gets the height of the document.
   * @returns {number} - Returns the height of the document in pixels.
   */
  static documentHeight() {
    return Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
  }

  /**
   * Gets or sets the scroll position of the selected elements.
   * @param {number} [x] - The horizontal scroll position to set (optional).
   * @param {number} [y] - The vertical scroll position to set (optional).
   * @returns {Object|KAnime} - Returns the current scroll position or the instance for chaining.
   */
  scroll(x, y) {
    if (x === undefined && y === undefined) {
      return {
        x: this.elements[0]?.scrollLeft || 0,
        y: this.elements[0]?.scrollTop || 0
      };
    }
    return this.each(el => {
      if (x !== undefined) el.scrollLeft = x;
      if (y !== undefined) el.scrollTop = y;
    });
  }

  /**
   * Gets the offset of the first selected element relative to the document.
   * @returns {Object} - Returns an object with `top` and `left` properties.
   */
  offset() {
    const el = this.elements[0];
    if (!el) return { top: 0, left: 0 };

    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  }
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
