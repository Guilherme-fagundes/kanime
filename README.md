
# KAnime.js

**KAnime** is a lightweight JavaScript micro-library for DOM manipulation, animations, event handling, and AJAX — all with zero dependencies.

> A minimalist utility belt for working with the DOM, styling, events, and forms. Lightweight, chainable, and written in pure JavaScript.

---

## 🚀 Installation

```bash
npm install kanime
```

---

## 📦 Importing

```js
import KAnime from 'kanime';

const el = new KAnime('.selector');
```

---

## 🔧 Basic Usage

```js
const box = new KAnime('.box');

box
  .fadeIn()
  .css('background', 'skyblue')
  .addClass('visible')
  .onClick(() => {
    console.log('Box clicked!');
  });
```

---

## ✨ Features

- ✅ Chainable, modern syntax
- ✅ DOM element selection and manipulation
- ✅ `fadeIn`, `fadeOut`, `slideUp`, `slideDown`
- ✅ Custom `animate()` method with easing and callback
- ✅ Event handling (click, keyboard, mouse, etc.)
- ✅ Class, attribute, and style manipulation
- ✅ Form handling (`submit`, `ajaxSubmit` with file upload support)
- ✅ Utility methods (`isVisible`, `isChecked`, `hasAttr`, etc.)
- ✅ Lightweight (~5kb minified)

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

### 📨 Forms

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

## 🤝 Contributing

Pull requests, suggestions, and feedback are welcome.  
Feel free to open an issue if you find bugs or want to propose new features!

---

## 📄 License

MIT © [Guilherme K. Fagundes](https://github.com/Guildherme-fagundes)
```

