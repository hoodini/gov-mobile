
# gov-mobile

**gov-mobile** is a modern, mobile-friendly web application for device management, built with React, Vite, and Tailwind CSS. It provides a responsive dashboard for managing devices, placing orders, and handling user profiles, optimized for both desktop and mobile experiences.

---

## 🚀 Features

- **Device Management Dashboard:** View, add, and manage devices in a user-friendly interface.
- **Order Devices:** Place and track device orders seamlessly.
- **User Profile Management:** Update and manage user information securely.
- **Mobile-First & Responsive:** Optimized for all screen sizes using Tailwind CSS.
- **Reusable UI Components:** Built with Radix UI and custom components for consistency and accessibility.
- **API Integrations:** Modular API clients for CRM, ERP, and integrations.
- **Authentication:** Secure login and session management.
- **Modern Tooling:** Uses Vite for fast builds and hot reloading.

---

## 🗂️ Project Structure

- `src/pages/` — Main application pages (Dashboard, Devices, Orders, Profile, etc.)
- `src/components/ui/` — Reusable UI components (buttons, dialogs, forms, etc.)
- `src/hooks/` — Custom React hooks
- `src/api/` — API clients and integrations
- `src/lib/` — Utility libraries
- `src/utils/` — Shared utilities
- `src/data/` — Static data for CRM and ERP

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd gov-mobile-656f376f
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

### Development

Start the Vite development server:

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Linting

Run ESLint to check for code quality issues:

```sh
npm run lint
```

### Build for Production

Create an optimized production build:

```sh
npm run build
```

### Preview Production Build

Serve the production build locally:

```sh
npm run preview
```

---

## 🚀 Deployment

You can deploy the production build to any static hosting provider (e.g., Vercel, Netlify, GitHub Pages, Firebase Hosting, etc.).

### Steps for Deployment

1. **Build the app:**
   ```sh
   npm run build
   ```
   This will generate a `dist/` folder with the production build.

2. **Deploy the `dist/` folder:**
   - **Vercel:** Connect your repo and set the build command to `npm run build` and output directory to `dist`.
   - **Netlify:** Drag and drop the `dist/` folder in the Netlify dashboard or connect your repo.
   - **GitHub Pages:** Use a tool like [`vite-plugin-gh-pages`](https://github.com/peaceiris/vite-plugin-gh-pages) or manually push the `dist/` folder to the `gh-pages` branch.
   - **Firebase Hosting:**
     ```sh
     npm install -g firebase-tools
     firebase login
     firebase init
     firebase deploy
     ```

Refer to your hosting provider's documentation for more details.

---

## 📦 Environment Variables

Create a `.env` file in the root directory to store environment-specific variables. Example:

```env
VITE_API_URL=https://api.example.com
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
