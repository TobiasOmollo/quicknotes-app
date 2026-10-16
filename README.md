# Quick Notes

A lightweight, modern, and responsive client-side note-taking application designed to help you capture, organize, and manage thoughts seamlessly right in your browser.

---

## Features

- **Capture & Categorize:** Write notes with a multi-line text area and assign categories (*Personal*, *Work*, *Ideas*, *School*).
- **Search & Filter:** Find notes instantly with real-time text search.
- **Rearrange & Edit:** Reorder notes up and down or edit existing notes directly in place.
- **Local Persistence:** All notes are automatically saved to your browser's `localStorage` so your data stays intact between sessions.
- **Keyboard Shortcut:** Quickly submit notes using <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd> on macOS).
- **Zero Dependencies:** Built entirely with standard web technologies—no frameworks, npm packages, or external builds required.

---

## Tech Stack

- **HTML5:** Semantic markup, accessibility attributes (`aria-*`, `role`), and templates.
- **CSS3:** Custom properties (CSS variables), smooth gradients, responsive layout, and focus states.
- **JavaScript (ES6+):** Pure vanilla JavaScript handling state management, validation, DOM updates, and `localStorage` persistence.

---

## Project Structure

```text
quicknotes-app/
├── index.html      # Application structure and semantic markup
├── style.css       # Complete layout, theme tokens, and responsive styles
├── script.js       # App logic, state management, and persistence
├── README.md       # Project documentation
└── LICENSE         # Project license
```

---

## Setup & Getting Started

Because **Quick Notes** runs purely on client-side vanilla web technologies, there is no build step or package installation required.

### Option 1: Open Directly in Your Browser

1. Clone or download the repository to your local machine:
   ```bash
   git clone https://github.com/TobiasOmollo/quicknotes-app.git
   ```
2. Navigate to the project folder:
   ```bash
   cd quicknotes-app
   ```
3. Open `index.html` directly in any modern browser (e.g., Chrome, Firefox, Edge, Safari) by double-clicking the file or right-clicking and selecting **Open with**.

---

### Option 2: Run with a Local Development Server (Recommended)

Running via a local server provides the smoothest development experience:

- **Using VS Code Live Server:**
  Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

- **Using Python 3:**
  ```bash
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.

- **Using Node.js (`npx`):**
  ```bash
  npx serve .
  ```
  Then navigate to the URL shown in your terminal (typically `http://localhost:3000` or `http://localhost:5000`).

---

## License

This project is licensed under the terms included in the [LICENSE](LICENSE) file.
