# KAnime.js

**KAnime** is a modern, lightweight JavaScript micro-library for DOM manipulation, animations (with advanced easings), event handling (including delegation), forms, and media control — all with zero dependencies.

> A minimalist utility belt for working with the DOM, styling, events, forms, and media. Lightweight, chainable, and written in pure JavaScript.

---

## 🚀 Installation

```bash
npm install kanime
```

Or CDN
```html
<script src="https://cdn.jsdelivr.net/gh/Guilherme-fagundes/kanime@1.0.8/dist/kanime.min.js"></script>
```

---

## 📦 Importing

```js
import KAnime from 'kanime';

const el = new KAnime('.selector');
// or use the global shortcut:
const el = k('.selector');
```

---

## 📚 Examples of Usage

You can use `KAnime` by instantiating the class or using the global `k` function.

### Animation Example

```javascript
// Fade in effect
k('.my-element').kShowFade();
```

### Animate any CSS property (with advanced easings)

```javascript
k('.box').kanime(
  { left: '200px', opacity: 0.5 },
  600,
  'bounce', // Try: 'linear', 'ease', 'ease-in', 'ease-out', 'cubic-in', 'cubic-out', 'cubic-in-out', 'bounce', 'elastic'
  () => console.log('Animation finished!')
);
```

### Event Delegation Example

```javascript
// Listen for clicks on any button inside .container (delegation)
k('.container').kListen('click', 'button', e => {
  alert('Button clicked: ' + e.target.textContent);
});
```

### Form Handling Example

```javascript
// Serialize form data and send it via HTTP
k('form').kOnFormSubmit((data, formElement) => {
  console.log('Form data:', data);
  k(formElement).kSubmitForm({
    method: 'POST',
    url: '/submit',
    data,
  });
});
```

### Style Manipulation Example

```javascript
k('.my-element').kStyle('color', 'red');
```

### Media Example

```javascript
k('video').kPlayMedia();
k('video').kSetVolume(0.5);
```

---

## ✨ Features

Below is a list of all main methods available in the `KAnime` class, with their usage:

| **Method**                | **Description**                                              | **Usage**                                      |
|---------------------------|-------------------------------------------------------------|------------------------------------------------|
| `kAdd(content)`           | Appends content to each selected element.                   | `k('.el').kAdd('<div>New</div>');`             |
| `kAddFirst(content)`      | Prepends content to each selected element.                  | `k('.el').kAddFirst('<div>New</div>');`        |
| `kInsertBefore(content)`  | Inserts content before each selected element.               | `k('.el').kInsertBefore('<div>Before</div>');` |
| `kInsertAfter(content)`   | Inserts content after each selected element.                | `k('.el').kInsertAfter('<div>After</div>');`   |
| `kRemove()`               | Removes all selected elements from the DOM.                 | `k('.el').kRemove();`                          |
| `kClone(deep)`            | Clones the selected elements.                               | `const clone = k('.el').kClone();`             |
| `kWrapWith(wrapper)`      | Wraps each selected element with the specified HTML.        | `k('.el').kWrapWith('<div class="wrap"></div>');` |
| `kUnwrap()`               | Removes the parent of each selected element.                | `k('.el').kUnwrap();`                          |
| `kListen(events, handlerOrSelector, handler)` | Adds event listeners (with delegation support). | `k('.el').kListen('click', handler);` or `k('.container').kListen('click', 'button', handler);` |
| `kRemoveListener(event, handler)` | Removes an event listener.                          | `k('.el').kRemoveListener('click', handler);`  |
| `kOnce(event, handler)`   | Adds a one-time event listener.                             | `k('.el').kOnce('click', handler);`            |
| `kDispatch(event)`        | Triggers an event on the selected elements.                 | `k('.el').kDispatch('click');`                 |
| `kHover(enter, leave)`    | Adds mouseenter and mouseleave event listeners.             | `k('.el').kHover(enter, leave);`               |
| `kShowFade()`             | Shows the elements with a fade-in animation.                | `k('.el').kShowFade();`                        |
| `kHideFade()`             | Hides the elements with a fade-out animation.               | `k('.el').kHideFade();`                        |
| `kToggleFade()`           | Toggles fade-in/fade-out based on visibility.               | `k('.el').kToggleFade();`                      |
| `kanime(props, duration, easing, cb)`| Animates any CSS property with advanced easings. | `k('.el').kanime({left:'100px'}, 500, 'bounce');` |
| `kFormData()`             | Serializes form data into a query string.                   | `k('form').kFormData();`                       |
| `kFormArray()`            | Serializes form data into an array of objects.              | `k('form').kFormArray();`                      |
| `kValue(value)`           | Gets or sets the value of form fields.                      | `k('input').kValue('new');`                    |
| `kOnFormSubmit(cb)`       | Adds a submit event handler to forms.                       | `k('form').kOnFormSubmit(cb);`                 |
| `kSubmitForm(options)`    | Submits a form via HTTP request.                            | `k('form').kSubmitForm({method: 'POST'});`     |
| `kAttr(attr, value)`      | Gets or sets an attribute.                                  | `k('.el').kAttr('data-id', '1');`              |
| `kStyle(prop, value)`     | Gets or sets a CSS property.                                | `k('.el').kStyle('color', 'blue');`            |
| `kAddClass(className)`    | Adds a CSS class.                                           | `k('.el').kAddClass('active');`                |
| `kRemoveClass(className)` | Removes a CSS class.                                        | `k('.el').kRemoveClass('active');`             |
| `kToggleClass(className)` | Toggles a CSS class.                                        | `k('.el').kToggleClass('active');`             |
| `kPlayMedia()`            | Plays the selected video or audio elements.                 | `k('video').kPlayMedia();`                     |
| `kPauseMedia()`           | Pauses the selected video or audio elements.                | `k('video').kPauseMedia();`                    |
| `kToggleMedia()`          | Toggles play/pause for video/audio elements.                | `k('video').kToggleMedia();`                   |
| `kSetVolume(value)`       | Sets the volume for video/audio elements.                   | `k('video').kSetVolume(0.5);`                  |
| `kMuteMedia()`            | Mutes video/audio elements.                                 | `k('video').kMuteMedia();`                     |
| `kUnmuteMedia()`          | Unmutes video/audio elements.                               | `k('video').kUnmuteMedia();`                   |
| `kSeekMedia(time)`        | Seeks to a specific time in video/audio elements.           | `k('video').kSeekMedia(10);`                   |
| `kGetMediaTime()`         | Gets the current playback time.                             | `k('video').kGetMediaTime();`                  |
| `kGetMediaDuration()`     | Gets the duration of the media.                             | `k('video').kGetMediaDuration();`              |
| `kCalculate()`            | Gets position and size of the first element (top, left, width, height). | `k('.el').kCalculate();` |

---

## 📚 API Reference

### ▶️ Initialization

```js
const el = new KAnime('.my-class');
// or
const el = k('.my-class');
```

---

### 🎨 Style & Class Methods

```js
el.kStyle('color', 'red');             // Set style
el.kStyle('width');                    // Get style
el.kAddClass('active');                // Add class
el.kRemoveClass('active');             // Remove class
el.kToggleClass('active');             // Toggle class
```

---

### ✍️ Content & Attributes

```js
el.kAttr('data-id', '123');            // Set attribute
el.kAttr('data-id');                   // Get attribute
```

---

### 🎬 Effects & Animations

```js
el.kShowFade();                        // Fade in
el.kHideFade();                        // Fade out
el.kToggleFade();                      // Toggle fade

// Animate any property with advanced easings
el.kanime({ left: '100px', opacity: 0.5 }, 800, 'elastic');
```

**Available easings:**  
`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-in`, `cubic-out`, `cubic-in-out`, `bounce`, `elastic`

---

### 🧠 Events

```js
el.kListen('click', () => console.log('Clicked!')); // Direct
el.kListen('click', 'button', e => console.log('Delegated:', e.target)); // Delegation
el.kRemoveListener('click', handler);           // Remove event listener
el.kDispatch('customEvent');                    // Trigger custom event
el.kOnce('click', handler);                     // One-time event
el.kHover(enterHandler, leaveHandler);          // Hover events
```

---

### 📧 Forms

```js
k('#myForm').kOnFormSubmit((data, form) => {
  // handle data
});
k('#myForm').kSubmitForm({
  url: '/submit-endpoint',
  method: 'POST',
});
k('form').kFormData();      // Query string
k('form').kFormArray();     // Array of objects
k('input').kValue('novo');  // Set value
const v = k('input').kValue(); // Get value
```

---

### 🎥 Media Methods

```js
el.kPlayMedia();                          // Play video/audio
el.kPauseMedia();                         // Pause video/audio
el.kToggleMedia();                        // Toggle play/pause
el.kSetVolume(0.5);                       // Set volume
el.kMuteMedia();                          // Mute
el.kUnmuteMedia();                        // Unmute
el.kSeekMedia(10);                        // Seek to 10s
el.kGetMediaTime();                       // Get current time
el.kGetMediaDuration();                   // Get duration
```

---

### 🔄 DOM Manipulation

```js
el.kAdd('<div>New Content</div>');        // Append content
el.kAddFirst('<div>New Content</div>');   // Prepend content
el.kInsertBefore('<div>Before</div>');    // Insert before
el.kInsertAfter('<div>After</div>');      // Insert after
el.kRemove();                             // Remove element
el.kClone();                              // Clone element
el.kWrapWith('<div class="wrapper"></div>'); // Wrap element
el.kUnwrap();                             // Unwrap parent
```

---

### 📏 Utilities

```js
const pos = k('.box').kCalculate();
// pos = { top, left, width, height }
```

---

## 🤝 Contributing

Pull requests, suggestions, and feedback are welcome.  
Feel free to open an issue if you find bugs or want to propose new features!

---

## 📄 License

MIT © [Guilherme K. Fagundes](https://github.com/Guilherme-fagundes)

