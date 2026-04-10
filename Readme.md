# 🧩 TaskBoard — Ship It

A minimal, elegant task management board built with **pure HTML, CSS, and JavaScript**.
Create cards, add todos, track progress, and share your board — all without a backend.

---

## 🚀 Features

* 📌 Create and delete task cards
* ✅ Add, complete, and remove todos
* 📊 Real-time progress tracking per card
* 🔗 Share board via URL (state stored in hash)
* 💾 No database required (fully client-side)
* 🎨 Modern dark UI with smooth animations
* ⚡ Lightweight and fast (no frameworks)

---

## 🖥️ Demo Preview

> Open `index.html` in your browser to start using TaskBoard.

---

## 📂 Project Structure

```
TaskBoard/
│
├── index.html     # Main HTML structure
├── style.css      # Styling and UI design
├── script.js      # Application logic
└── README.md      # Project documentation
```

---

## ⚙️ How It Works

### 🧠 Data Handling

* All data is stored in a JavaScript array (`cards`)
* Each card contains:

  * `id`
  * `title`
  * `todos[]`

### 🔗 URL-Based Persistence

* Board state is encoded into the URL hash using:

  * `btoa()` + `encodeURIComponent()`
* Allows easy sharing of the board without a backend

### 🔄 Rendering

* UI updates dynamically using DOM manipulation
* Partial updates for smoother UX (e.g., progress bar updates)

---

## 🧪 Usage Guide

### ➕ Create a Card

* Click **"New Card"**
* Enter a title
* Press **Enter** or click **Create Card**

### 📝 Add Todo

* Click **"Add todo"** inside a card
* Enter task text
* Confirm to add

### ✅ Complete Task

* Click the checkbox to mark as done
* Progress updates automatically

### 🗑️ Delete

* Remove todos or entire cards using delete buttons

### 🔗 Share Board

* Click **"Share Board"**
* Link is copied to clipboard
* Share with others to view the same board state

---

## 🎨 UI Highlights

* Glassmorphism-style header
* Smooth card & todo animations
* Custom checkbox styling
* Responsive layout for mobile devices
* Clean typography using:

  * DM Sans
  * DM Serif Display
  * DM Mono

---

## 📱 Responsive Design

* Works on desktop, tablet, and mobile
* Optimized spacing and layout for smaller screens

---

## ⚠️ Limitations

* No backend or database (data is not permanently saved)
* Data is lost if URL is not preserved
* URL length may grow with large boards

---

## 🛠️ Future Improvements

* 💾 LocalStorage support
* ☁️ Backend integration (Spring Boot API)
* 👥 Multi-user collaboration
* 🏷️ Tags / priorities
* 📅 Due dates
* 🔔 Notifications

---

## 👨‍💻 Author

**Fasrin Rahman**

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## ⭐ Support

If you like this project:

* Give it a ⭐ on GitHub
* Share it with others
* Improve it and create your own version 🚀
