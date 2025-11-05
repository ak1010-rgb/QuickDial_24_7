# QuickDial24-7


# QuickDial24-7

QuickDial24-7 is a service provider directory platform built with **React** and **Firebase**.  
Users can browse services, and providers can register, edit their profiles, and manage listings.  
Admins have access to a protected dashboard for managing data.

---

## 🚀 Features

- 🔍 **Browse Service Providers** by category  
- 👤 **Provider Registration** with profile details  
- 🔐 **Authentication** (Email/Password, Google Sign-In)  
- 📝 **Profile Editing** for service providers  
- 🛠️ **Admin Dashboard** (Protected route)  
- 🔑 **Forgot Password** feature  
- 📱 **Responsive UI** with Tailwind CSS  
- 🔔 **Toast Notifications** for better UX

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Tailwind CSS  
- **Backend/Database:** Firebase Firestore  
- **Authentication:** Firebase Auth  
- **Hosting:** Vercel (recommended)  

---

## 📂 Project Structure

```

src/
├── components/       # Reusable UI components
├── data/             # Static data (e.g., sample providers)
├── pages/            # Application pages (Home, Login, Admin, etc.)
├── routes/           # Protected routes logic
├── firebase.js       # Firebase initialization
└── App.js            # Main app and routes

````

---

## ⚡ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/<your-username>/QuickDial24-7.git
cd QuickDial24-7
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

* Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
* Enable **Authentication** (Email/Password, Google Sign-In)
* Enable **Firestore Database**
* Update `firebase.js` with your config

### 4. Run the App

```bash
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file at the project root:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

⚠️ **Never commit sensitive keys!**
Add `.env` to `.gitignore`.

---

## 🌍 Deployment

To deploy on **Vercel**:

```bash
npm run build
```

Then push the project to GitHub and import it into [Vercel](https://vercel.com/).

---

## 📜 License

This project is for learning and practice purposes.
Feel free to fork and modify.

---

## 👨‍💻 Author

* **Apoorv Yadav**

---

```

---


