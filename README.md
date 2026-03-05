# 📚 PYQ-HUB

An accessible, lightning-fast, and student-friendly platform designed to help college students easily find, view, and download Previous Year Question (PYQ) papers. 

**🚀 Live Website:** [https://pyq-hub-alpha.vercel.app/](https://pyq-hub-alpha.vercel.app/)

---

## 📖 About the Project

Exam season is stressful enough without having to hunt down old question papers in endless WhatsApp groups. We built **PYQ-HUB** to solve a real problem for our college community. Our goal is simple: create the fastest, cleanest, and most reliable archive of college papers. 

We kept the site completely distraction-free—that means no ads, no countdown timers, and instant PDF access without even needing to log in.

## 💻 Tech Stack

**🎨 Frontend:**`EJS`, `Tailwind CSS`, `JavaScript`  
**⚙️ Backend:** `Node.js`, `Express.js`  
**🗄️ Database & Storage:** `MongoDB`, `Cloudinary`


## ✨ Key Features

* **Easy Filtering:** Quickly find specific papers by selecting your Academic Year, Branch, Subject, and Exam Type (Mid Sem/End Sem).
* **Instant Viewing:** Click and get your PDF instantly right in the browser.
* **Admin Dashboard:** A dedicated portal to easily see all added papers & upload new paper PDFs directly to the database.
* **User Feedback System:** Built-in contact form allowing users to report missing papers or site bugs.
* **Real-Time Statistics:** Live counters on the homepage showing total site visits and the number of available papers.

---

## 🧭 Usage Guide

* **🎓 For Students:** Click on Browse Paper ➔ Search with your year, branch & subject ➔ Click View paper on card ➔ Instantly view the PDF (No login required).
* **🔐 For Admins:** Navigate to `/admin/login` to access Dashboard ➔ Fill out the paper metadata ➔ Upload the PDF directly to Cloudinary.

---

## 🏗️ Architecture & Contributions

This project was built collaboratively, with clear roles for frontend and backend development

**🎨 Frontend Development (*Om Lanjewar*)**
* **Modular UI:** Used EJS partials to build reusable components, keeping the codebase clean and DRY
* **Mobile-First Design:** Built a fully responsive, mobile-first UI using Tailwind CSS.
* **GitHub:** [@omLanjewar16](https://github.com/omLanjewar16)

**⚙️ Backend Infrastructure (*Kapil Dharme*)**
* **Optimized Queries:** Designed database schemas using MongoDB for instant search filtering.
* **Cloud Integration:** Integrated Cloudinary for fast, secure PDF hosting and delivery.
* **GitHub:** [@Kapil-dharme](https://github.com/Kapil-dharme)

---

<details>
<summary><b>🔑 Core API Routes</b></summary>

<br>
Here are the main API endpoints used in our Website:


**Public Routes (Student Access)**
* `GET /` - Renders the main landing page, fetching real-time site visits and total paper counts.
* `GET /about` - Renders the About & Feedback page.
* `GET /user/browse` - Handles dynamic frontend requests. If `year` and `branch` query parameters are provided, it returns a JSON array of distinct subjects.
* `POST /user/browse` - Processes the search form (expects `year`, `subject`, `branch`, `examtype`). Queries MongoDB and renders the results grid.

**Protected Routes (Admin Only)**
* `GET /admin/login` - Renders the secure admin authentication portal.
* `GET /admin/logout` - Clears the active session token and safely redirects to the home page.
* `GET /admin/add-paper` - Renders the dashboard interface for uploading new papers.
* `POST /admin/add-paper` - Handles form-data. Validates and uploads a max 10MB `.pdf` file to Cloudinary, then saves the metadata to MongoDB.
* `POST /admin/delete-paper/:id` - Permanently deletes the document metadata from MongoDB and destroys the raw PDF file hosted on Cloudinary.

</details>

---

<details>
<summary><b>💻 Local Setup Instructions</b></summary>

<br>
If you want to run this project on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/Kapil-dharme/NEW-PYQ-HUB.git`
2. Navigate to the project directory: `cd NEW-PYQ-HUB`
3. Install the dependencies: `npm install`
4. Set up your `.env` variables for MongoDB and Cloudinary.
5. Start the development server: `npm start`

</details>

---
