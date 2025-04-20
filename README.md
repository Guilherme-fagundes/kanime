# KAnime.js

**KAnime** is a lightweight JavaScript micro-library for DOM manipulation, animations, event handling, forms, and media — all with zero dependencies.

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

The `KAnime` library can be used by instantiating the `KAnime` class or using the global `k` function.

### **Animation Example**

```javascript
// Fade in effect
k('.my-element').kShowFade();
```

### **Form Handling Example**

```javascript
// Serialize form data and send it via HTTP
k('form').kOnFormSubmit((data, formElement) => {
  console.log('Form data:', data);
  // Send the data via HTTP
  k(formElement).kSubmitForm({
    method: 'POST',
    url: '/submit',
    data,
  });
});
```

### **Style Manipulation Example**

```javascript
// Change the style of an element
k('.my-element').kStyle('color', 'red');
```

### **Media Example**

```javascript
// Play a video
k('video').kPlayMedia();
k('video').kSetVolume(0.5);
```

---

## ✨ Features

Below is a list of all main methods available in the `KAnime` class, with their usage:

| **Method**             | **Description**                                              | **Usage**                                      |
|------------------------|-------------------------------------------------------------|------------------------------------------------|
| `kAdd(content)`        | Appends content to each selected element.                   | `k('.el').kAdd('<div>New</div>');`             |
| `kAddFirst(content)`   | Prepends content to each selected element.                  | `k('.el').kAddFirst('<div>New</div>');`        |
| `kInsertBefore(content)`| Inserts content before each selected element.              | `k('.el').kInsertBefore('<div>Before</div>');` |
| `kInsertAfter(content)`| Inserts content after each selected element.                | `k('.el').kInsertAfter('<div>After</div>');`   |
| `kRemove()`            | Removes all selected elements from the DOM.                 | `k('.el').kRemove();`                          |
| `kClone(deep)`         | Clones the selected elements.                               | `const clone = k('.el').kClone();`             |
| `kWrapWith(wrapper)`   | Wraps each selected element with the specified HTML.        | `k('.el').kWrapWith('<div class="wrap"></div>');` |
| `kUnwrap()`            | Removes the parent of each selected element.                | `k('.el').kUnwrap();`                          |
| `kListen(event, handler)` | Adds an event listener to the selected elements.         | `k('.el').kListen('click', handler);`          |
| `kRemoveListener(event, handler)` | Removes an event listener.                       | `k('.el').kRemoveListener('click', handler);`  |
| `kShowFade()`          | Shows the elements with a fade-in animation.                | `k('.el').kShowFade();`                        |
| `kHideFade()`          | Hides the elements with a fade-out animation.               | `k('.el').kHideFade();`                        |
| `kToggleFade()`        | Toggles fade-in/fade-out based on visibility.               | `k('.el').kToggleFade();`                      |
| `kFormData()`          | Serializes form data into a query string.                   | `k('form').kFormData();`                       |
| `kFormArray()`         | Serializes form data into an array of objects.              | `k('form').kFormArray();`                      |
| `kValue(value)`        | Gets or sets the value of form fields.                      | `k('input').kValue('new');`                    |
| `kOnFormSubmit(cb)`    | Adds a submit event handler to forms.                       | `k('form').kOnFormSubmit(cb);`                 |
| `kSubmitForm(options)` | Submits a form via HTTP request.                            | `k('form').kSubmitForm({method: 'POST'});`     |
| `kAttr(attr, value)`   | Gets or sets an attribute.                                  | `k('.el').kAttr('data-id', '1');`              |
| `kStyle(prop, value)`  | Gets or sets a CSS property.                                | `k('.el').kStyle('color', 'blue');`            |
| `kAddClass(className)` | Adds a CSS class.                                           | `k('.el').kAddClass('active');`                |
| `kRemoveClass(className)` | Removes a CSS class.                                     | `k('.el').kRemoveClass('active');`             |
| `kToggleClass(className)` | Toggles a CSS class.                                     | `k('.el').kToggleClass('active');`             |
| `kPlayMedia()`         | Plays the selected video or audio elements.                 | `k('video').kPlayMedia();`                     |
| `kPauseMedia()`        | Pauses the selected video or audio elements.                | `k('video').kPauseMedia();`                    |
| `kSetVolume(value)`    | Sets the volume for video/audio elements.                   | `k('video').kSetVolume(0.5);`                  |
| `kMuteMedia()`         | Mutes video/audio elements.                                 | `k('video').kMuteMedia();`                     |
| `kUnmuteMedia()`       | Unmutes video/audio elements.                               | `k('video').kUnmuteMedia();`                   |
| `kSeekMedia(time)`     | Seeks to a specific time in video/audio elements.           | `k('video').kSeekMedia(10);`                   |
| `kGetMediaTime()`      | Gets the current playback time.                             | `k('video').kGetMediaTime();`                  |
| `kGetMediaDuration()`  | Gets the duration of the media.                             | `k('video').kGetMediaDuration();`              |

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
```

---

### 🧠 Events

```js
el.kListen('click', () => console.log('Clicked!'));
el.kRemoveListener('click', handler);           // Remove event listener
el.kDispatch('customEvent');                    // Trigger custom event
```

---

### 📧 Forms

#### Submit normally

```js
k('#myForm').kOnFormSubmit((data, form) => {
  // handle data
});
```

#### Submit via HTTP

```js
k('#myForm').kSubmitForm({
  url: '/submit-endpoint',
  method: 'POST',
  // ...other options
});
```

---

### 🎥 Media Methods

```js
el.kPlayMedia();                          // Play video/audio
el.kPauseMedia();                         // Pause video/audio
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

## 🤝 Contributing

Pull requests, suggestions, and feedback are welcome.  
Feel free to open an issue if you find bugs or want to propose new features!

---

## 📄 License

MIT © [Guilherme K. Fagundes](https://github.com/Guildherme-fagundes)

