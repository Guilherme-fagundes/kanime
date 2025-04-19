class KAnime {
  constructor(selector) {
    this.elements = Array.from(document.querySelectorAll(selector));
    this.duration = 500;
  }

  each(callback) {
    this.elements.forEach(callback);
    return this;
  }

  setDuration(ms) {
    this.duration = ms;
    return this;
  }

  // Eventos genéricos
  on(event, handler) {
    return this.each(el => el.addEventListener(event, handler));
  }

  // Eventos mouse e teclado (agrupados por nomes)
  _registerEvent(method, event) {
    this[method] = handler => this.on(event, handler);
  }

  // CSS
  css(property, value) {
    if (value === undefined) {
      return window.getComputedStyle(this.elements[0])[property];
    }
    return this.each(el => el.style[property] = value);
  }

  // Classes
  addClass(className) {
    return this.each(el => el.classList.add(className));
  }

  removeClass(className) {
    return this.each(el => el.classList.remove(className));
  }

  toggleClass(className) {
    return this.each(el => el.classList.toggle(className));
  }

  // Visibilidade
  show() {
    return this.each(el => el.style.display = 'block');
  }

  hide() {
    return this.each(el => el.style.display = 'none');
  }

  // Conteúdo
  html(content) {
    if (content === undefined) return this.elements[0].innerHTML;
    return this.each(el => el.innerHTML = content);
  }

  text(content) {
    if (content === undefined) return this.elements[0].innerText;
    return this.each(el => el.innerText = content);
  }

  // Atributos
  attr(attribute, value) {
    if (value === undefined) return this.elements[0].getAttribute(attribute);
    return this.each(el => el.setAttribute(attribute, value));
  }

  removeAttr(attribute) {
    return this.each(el => el.removeAttribute(attribute));
  }

  // Fade
  fadeIn() {
    return this.each(el => {
      el.style.opacity = 0;
      el.style.display = 'block';
      this._fade(el, 0, 1);
    });
  }

  fadeOut() {
    return this.each(el => this._fade(el, 1, 0, () => {
      el.style.display = 'none';
    }));
  }

  _fade(el, from, to, callback) {
    let last = performance.now();
    const tick = now => {
      const delta = (now - last) / this.duration;
      el.style.opacity = Math.min(to, Math.max(from, +el.style.opacity + (to - from) * delta));
      last = now;
      if ((to > from && +el.style.opacity < to) || (to < from && +el.style.opacity > to)) {
        requestAnimationFrame(tick);
      } else {
        el.style.opacity = to;
        if (callback) callback();
      }
    };
    requestAnimationFrame(tick);
  }

  // Slide
  slideUp() {
    return this.each(el => {
      el.style.height = el.offsetHeight + 'px';
      el.style.transition = `height ${this.duration}ms ease`;
      el.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        el.style.height = '0';
      });

      setTimeout(() => {
        el.style.display = 'none';
        this._resetTransition(el);
      }, this.duration);
    });
  }

  slideDown() {
    return this.each(el => {
      el.style.display = 'block';
      const height = el.scrollHeight;
      el.style.height = '0';
      el.style.overflow = 'hidden';
      el.style.transition = `height ${this.duration}ms ease`;
      requestAnimationFrame(() => {
        el.style.height = height + 'px';
      });

      setTimeout(() => {
        this._resetTransition(el);
      }, this.duration);
    });
  }

  _resetTransition(el) {
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
  }

  // Verificações
  isVisible() {
    return this.elements.some(el =>
      window.getComputedStyle(el).display !== 'none' && el.offsetHeight > 0
    );
  }

  hasClass(className) {
    return this.elements.some(el => el.classList.contains(className));
  }

  hasAttr(attribute) {
    return this.elements.some(el => el.hasAttribute(attribute));
  }

  isChecked() {
    return this.elements.some(el => el.checked);
  }

  isEnabled() {
    return this.elements.some(el => !el.disabled);
  }

  isDisabled() {
    return this.elements.some(el => el.disabled);
  }

  // Submissão
  submit() {
    return this.each(el => el.submit());
  }

  ajaxSubmit({ url, method = 'POST', success = () => {}, error = () => {}, headers = {}, dataType = 'json' }) {
    return this.each(el => {
      const formData = new FormData(el);

      fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          ...headers,
        },
        body: formData,
      })
        .then(res => {
          if (!res.ok) throw new Error('Request failed');
          return res[dataType]();
        })
        .then(success)
        .catch(error);
    });
  }

  animate(properties, duration = this.duration, easing = 'linear', callback = () => {}) {
    return this.each(el => {
      const startStyles = {};
      const endStyles = properties;
      for (const prop in properties) {
        startStyles[prop] = parseFloat(getComputedStyle(el)[prop]) || 0;
      }

      let startTime = null;
      const animateStep = time => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = this._ease(progress, easing);

        for (const prop in endStyles) {
          const start = startStyles[prop];
          const end = endStyles[prop];
          const value = start + (end - start) * eased;
          el.style[prop] = value + (prop === 'opacity' ? '' : 'px');
        }

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          callback();
        }
      };

      requestAnimationFrame(animateStep);
    });
  }

  _ease(t, type) {
    const easingMap = {
      linear: t,
      'ease-in': t * t,
      'ease-out': t * (2 - t),
      'ease-in-out': t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    };
    return easingMap[type] ?? t;
  }
}

// Auto-registro de eventos do mouse e teclado
const mouseEvents = ['click', 'mouseenter', 'mouseleave', 'mousemove', 'mousedown', 'mouseup'];
const keyEvents = ['keydown', 'keyup', 'keypress'];

[...mouseEvents, ...keyEvents].forEach(event => {
  const method = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
  KAnime.prototype[method] = function (handler) {
    return this.on(event, handler);
  };
});

export default KAnime;
