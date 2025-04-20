# KAnime.js

**KAnime** is a lightweight JavaScript micro-library for DOM manipulation, animations, event handling, and AJAX — all with zero dependencies.

> A minimalist utility belt for working with the DOM, styling, events, and forms. Lightweight, chainable, and written in pure JavaScript.

---

## 🚀 Installation

```bash
npm install kanime
```

Or CDN
```html
<script src="https://cdn.jsdelivr.net/gh/Guilherme-fagundes/kanime@1.0.3/dist/kanime.min.js"></script>
```

---

## 📦 Importing

```js
import KAnime from 'kanime';

const el = new KAnime('.selector');
```

---

## 📚 Examples of Usage

The `KAnime` library can be used in two ways: the **traditional way** by instantiating the `KAnime` class, or the **simplified way** using the global `$` method. Below are examples for both approaches.

### **Traditional Usage**

#### **1. Animation with `fadeIn`**
```javascript
// Instantiate KAnime and apply the fadeIn effect
const element = new KAnime('.my-element');
element.fadeIn();
```

#### **2. Animation with `slideDown`**
```javascript
// Instantiate KAnime and apply the slideDown effect
const element = new KAnime('.my-element');
element.slideDown();
```

#### **3. Form Handling**
```javascript
// Serialize form data and send it via AJAX
const form = new KAnime('form');
form.submit((data, formElement) => {
  console.log('Form data:', data);
  // Send the data via AJAX
  new KAnime(formElement).ajaxSubmit({
    method: 'POST',
    url: '/submit',
    data,
  });
});
```

#### **4. Style Manipulation**
```javascript
// Change the style of an element
const element = new KAnime('.my-element');
element.css('color', 'red');
```

---

### **Simplified Usage**

#### **1. Animation with `fadeIn`**
```javascript
// Select an element and apply the fadeIn effect
$('.my-element').fadeIn();
```

#### **2. Animation with `slideDown`**
```javascript
// Select an element and apply the slideDown effect
$('.my-element').slideDown();
```

#### **3. Form Handling**
```javascript
// Serialize form data and send it via AJAX
$('form').submit((data, form) => {
  console.log('Form data:', data);
  // Send the data via AJAX
  $(form).ajaxSubmit({
    method: 'POST',
    url: '/submit',
    data,
  });
});
```

#### **4. Style Manipulation**
```javascript
// Change the style of an element
$('.my-element').css('color', 'red');
```

---

## ✨ Features

Below is a comprehensive list of all methods available in the `KAnime` class, along with their usage:

| **Method**         | **Description**                                                                 | **Usage**                                                                                     |
|--------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| `append(content)`  | Appends content to each selected element.                                      | `$('.my-element').append('<div>New Content</div>');`                                         |
| `prepend(content)` | Prepends content to each selected element.                                     | `$('.my-element').prepend('<div>New Content</div>');`                                        |
| `before(content)`  | Inserts content before each selected element.                                  | `$('.my-element').before('<div>Before Content</div>');`                                      |
| `after(content)`   | Inserts content after each selected element.                                   | `$('.my-element').after('<div>After Content</div>');`                                        |
| `remove()`         | Removes all selected elements from the DOM.                                    | `$('.my-element').remove();`                                                                 |
| `clone(deep)`      | Clones the selected elements.                                                  | `const clone = $('.my-element').clone();`                                                    |
| `wrap(wrapper)`    | Wraps each selected element with the specified HTML structure.                 | `$('.my-element').wrap('<div class="wrapper"></div>');`                                    |
| `unwrap()`         | Removes the parent of each selected element, keeping the elements in the DOM.  | `$('.my-element').unwrap();`                                                                 |
| `on(event, handler)` | Adds an event listener to the selected elements.                              | `$('.my-element').on('click', () => console.log('Clicked!'));`                               |
| `off(event, handler)` | Removes an event listener from the selected elements.                       | `$('.my-element').off('click', handler);`                                                   |
| `fadeIn()`         | Applies a fade-in effect using CSS transitions.                                | `$('.my-element').fadeIn();`                                                                 |
| `fadeOut()`        | Applies a fade-out effect using CSS transitions.                               | `$('.my-element').fadeOut();`                                                                |
| `slideUp()`        | Applies a slide-up effect using CSS transitions.                               | `$('.my-element').slideUp();`                                                                |
| `slideDown()`      | Applies a slide-down effect using CSS transitions.                             | `$('.my-element').slideDown();`                                                              |
| `serialize()`      | Serializes form data into a string.                                             | `const data = $('form').serialize();`                                                        |
| `ajaxSubmit(options)` | Submits a form via AJAX with support for file uploads.                      | `$('form').ajaxSubmit({ method: 'POST', url: '/submit' });`                                  |
| `css(property, value)` | Gets or sets the style of the selected elements.                           | `$('.my-element').css('color', 'red');`                                                      |
| `addClass(className)` | Adds a CSS class to all selected elements.                                  | `$('.my-element').addClass('active');`                                                       |
| `removeClass(className)` | Removes a CSS class from all selected elements.                          | `$('.my-element').removeClass('active');`                                                    |
| `toggleClass(className)` | Toggles a CSS class on all selected elements.                            | `$('.my-element').toggleClass('active');`                                                    |
| `attr(attribute, value)` | Gets or sets an attribute of the selected elements.                      | `$('.my-element').attr('data-id', '123');`                                                   |
| `width(value)`      | Gets or sets the width of the selected elements.                              | `$('.my-element').width(300);`                                                               |
| `height(value)`     | Gets or sets the height of the selected elements.                             | `$('.my-element').height(200);`                                                              |
| `scroll(x, y)`      | Gets or sets the scroll position of the selected elements.                    | `$('.my-element').scroll(0, 100);`                                                           |
| `offset()`          | Gets the offset of the first selected element relative to the document.       | `const offset = $('.my-element').offset();`                                                  |
| `play()`            | Plays the selected video or audio elements.                                   | `$('video').play();`                                                                          |
| `pause()`           | Pauses the selected video or audio elements.                                  | `$('video').pause();`                                                                         |
| `currentTime(time)` | Gets or sets the current playback time of the selected video or audio.        | `$('video').currentTime(10);`                                                                |
| `volume(value)`     | Gets or sets the volume of the selected video or audio elements.              | `$('video').volume(0.5);`                                                                     |
| `mute(mute)`        | Mutes or unmutes the selected video or audio elements.                        | `$('video').mute(true);`                                                                      |
| `isPlaying()`       | Checks if the selected video or audio elements are currently playing.         | `const playing = $('video').isPlaying();`                                                    |
| `loadSource(src)`   | Loads a new source into the selected video or audio elements.                 | `$('video').loadSource('video.mp4');`                                                        |
| `playbackRate(rate)` | Gets or sets the playback rate of the selected video or audio elements.      | `$('video').playbackRate(1.5);`                                                               |

This table provides a quick reference for all available methods and their usage examples.

---

## 📚 API Reference

### ▶️ Initialization

```js
const el = new KAnime('.my-class');
```

---

### 🎨 Style & Class Methods

```js
el.css('color', 'red');             // Set style
el.css('width');                    // Get style
el.addClass('active');              // Add class
el.removeClass('active');           // Remove class
el.toggleClass('active');           // Toggle class
```

---

### ✍️ Content & Attributes

```js
el.text('Hello world');             // Set text
el.html('<strong>Bold</strong>');   // Set HTML
el.attr('data-id', '123');          // Set attribute
el.attr('data-id');                 // Get attribute
el.removeAttr('data-id');           // Remove attribute
```

---

### 🎬 Effects & Animations

```js
el.fadeIn();                        // Fade in
el.fadeOut();                       // Fade out
el.slideUp();                       // Slide up
el.slideDown();                     // Slide down

// Custom animation with easing
el.animate({ width: 300, height: 150 }, 600, 'ease-in-out', () => {
  console.log('Animation completed!');
});
```

---

### 🧠 Events

```js
el.onClick(() => console.log('Clicked!'));
el.on('mouseenter', () => console.log('Hovered!'));
el.onKeyDown(e => console.log('Key:', e.key));
```

---

### ✅ Utility Methods

```js
el.isVisible();                     // Returns true/false
el.hasClass('active');              // Returns true/false
el.hasAttr('data-id');              // Returns true/false
el.isChecked();                     // For checkboxes/radios
el.isEnabled();                     // true if not disabled
el.isDisabled();                    // true if disabled
```

---

### 📧 Forms

#### Submit normally

```js
new KAnime('#myForm').submit();
```

#### Submit via AJAX (supports file uploads)

```js
new KAnime('#myForm').ajaxSubmit({
  url: '/submit-endpoint',
  method: 'POST',
  success: (data) => console.log('Success:', data),
  error: (err) => console.error('Error:', err)
});
```

## Recent Improvements

### Support for Advanced Selectors
- Static method `select` to create KAnime instances with advanced CSS selectors.

### Virtual DOM Manipulation
- Static method `createVirtualElement` to create DOM elements virtually before adding them to the document.

### Plugin Support
- API for registering and using plugins with the `use` and `callPlugin` methods.

### Internationalization (i18n) Support
- Support for string translation with the static method `i18n.translate` and language configuration with `i18n.setLocale`.

## Simplified Usage

The `KAnime` library allows you to manipulate elements in a simple and intuitive way using the global `$` method. Here are usage examples for different functionalities:

### **1. Animation with `fadeIn`**
```javascript
// Select an element and apply the fadeIn effect
$('.my-element').fadeIn();
```

### **2. Animation with `slideDown`**
```javascript
// Select an element and apply the slideDown effect
$('.my-element').slideDown();
```

### **3. Form Handling**
```javascript
// Serialize form data and send it via AJAX
$('form').submit((data, form) => {
  console.log('Form data:', data);
  // Send the data via AJAX
  $(form).ajaxSubmit({
    method: 'POST',
    url: '/submit',
    data,
  });
});
```

### **4. Style Manipulation**
```javascript
// Change the style of an element
$('.my-element').css('color', 'red');
```

These examples demonstrate how the `KAnime` library can be used to manipulate elements, apply animations, manage forms, and change styles in a simple and efficient way.

## 🤝 Contributing

Pull requests, suggestions, and feedback are welcome.  
Feel free to open an issue if you find bugs or want to propose new features!

---

## 📄 License

MIT © [Guilherme K. Fagundes](https://github.com/Guildherme-fagundes)

