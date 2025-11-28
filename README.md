# 🍿 PopCorn

![Project Status: Completed](https://img.shields.io/badge/Status-Completed-success)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

**PopCorn** is a modern, client-side web application designed for streaming local media files (videos and audio) directly in the browser. It combines a clean, aesthetic "glassmorphism" user interface with the powerful **Plyr** library to provide a seamless and feature-rich playback experience for your personal media library.

## ✨ Key Features

* **Aesthetic UI:** Features a modern **glassmorphism** design theme with vibrant red accent colors, making the player visually appealing.
* **Theming:** Persistent **Dark Mode** and **Light Mode** toggling, saved using `localStorage`.
* **Intuitive File Handling:** Supports **drag-and-drop** and makes the entire drop-zone clickable for easy file selection.
* **Advanced Playback:** Utilizes the **Plyr** library for comprehensive controls, including speed, quality, volume, fullscreen, and keyboard shortcuts.
* **Supported Formats:** Plays common media types including **MP4**, **MKV**, **MOV**, and **MP3**.
* **Responsive:** Built with Bootstrap for a great experience on any screen size.
* **Toast Notifications:** Provides success and warning messages for file selection and validation.

## 🛠️ Technologies Used

| Tool | Purpose |
| :--- | :--- |
| **HTML5** | Application structure. |
| **CSS3** | Custom styling, including glassmorphism and theme variables. |
| **JavaScript (ES6+)** | Core application logic, event handling, and theme persistence. |
| **Bootstrap 5** | Responsive layout and UI components (Tabs, Navbar). |
| **Plyr** | Advanced, accessible media player library. |
| **Font Awesome** | Icons for UI elements. |

## 🚀 Usage

This application is entirely client-side, meaning it runs directly in your browser without requiring a server.

---

### 🌐 Live Access (Easiest Method)

Access the latest stable version of PopCorn directly on GitHub Pages:

➜ **[PopCorn Deployed Site](https://chaitanyakumars2403.github.io/PopCorn/)**

---

### 💻 Running Locally (For Development)

If you wish to examine or modify the code, you can run the application directly from your file system.

1.  **Clone the repository** or download the files:
    ```bash
    git clone https://github.com/ChaitanyaKumarS2403/PopCorn.git
    ```
2.  Navigate to the project directory.
3.  Open the `index.html` file in any modern web browser (Chrome, Firefox, Edge, etc.).

---

### How to Stream

1.  Navigate to the **Browse** tab (or click **"Start Streaming Now"** on the Home tab).
2.  In the Browse tab, you can either:
    * **Drag and Drop** your media file onto the dashed area.
    * **Click anywhere** within the dashed area (or the "Browse Files" button) to open your system's file selector.
3.  Upon selecting a valid file, the application will automatically switch to the **Screen** tab and begin playback.

## 📜 License

This project is licensed under the [**MIT License**](https://github.com/ChaitanyaKumarS2403/PopCorn/blob/main/LICENSE).
