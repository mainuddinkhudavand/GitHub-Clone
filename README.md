# GitHub Clone - MERN Stack & Custom Version Control Engine

A full-stack GitHub clone built with Node.js/Express, MongoDB/Mongoose, and React (Vite). Includes custom git-like CLI commands (`init`, `add`, `commit`, `push`, `pull`, `revert`), full authentication & IDOR authorization controls, and a fully mobile-responsive UI design.

---

## 🔒 Security Hardening Summary

1. **Authentication & JWT Verification**:
   - `authMiddleware` validates JWT tokens via `Authorization: Bearer <token>` and `x-auth-token` headers.
   - All profile modifications, repo creations/updates/deletions, and issue operations require valid user authentication.

2. **BOLA / IDOR Protection**:
   - `authorizeOwner` middleware prevents users from editing or deleting other users' profiles, repositories, or issues.

3. **Data Sanitization & Leak Prevention**:
   - Password hashes are strictly omitted from all API user responses (`getAllUsers`, `getUserProfile`, `login`, `signup`, `updateUserProfile`).

4. **Rate Limiting & DoS Protection**:
   - In-memory rate limiting prevents brute-force login and denial of service attacks.

5. **Security HTTP Headers**:
   - Integrated headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Strict-Transport-Security`, and `Referrer-Policy`.

6. **CLI Path Traversal Protection**:
   - Path normalization (`path.resolve`) enforces filesystem sandboxing for CLI commands (`add`, `commit`, `revert`).

---

## 📱 Mobile Responsiveness Features

- **Responsive Header & Navbar**: Touch-friendly hamburger menu toggle (`@media (max-width: 900px)`), collapsible search bar, and flexible user dropdown.
- **Stacked Dashboard & Sidebars**: Smooth single-column stacked layout on tablet and mobile viewports (`@media (max-width: 768px)`).
- **Profile & Settings Views**: Fluid avatar dimensions, scrollable tab navigation, and touch-optimized form fields.
- **Code Explorer & Issue Tracker**: Mobile-optimized file tree, code viewer, horizontally scrollable repo tabs, and responsive modal dialogues.

---

## 🚀 Getting Started

### Backend Setup
```bash
cd backend-main
npm install
npm start
```

### Frontend Setup
```bash
cd frontend-main
npm install
npm run dev
```

### CLI Operations
```bash
node backend-main/index.js init
node backend-main/index.js add <filename>
node backend-main/index.js commit "Initial commit"
node backend-main/index.js push
```
