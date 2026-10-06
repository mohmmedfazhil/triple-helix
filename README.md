# District Innovation Mission · Triple Helix Platform

An enterprise **Government-Academia-Industry (Triple Helix)** innovation platform built for district administration problem-solving, collegiate engineering collaboration, milestone governance, and automated accreditation.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context & Hooks (`useApp`)
- **Animation**: Tailwind CSS Transitions & Micro-interactions

---

## 🚀 Key Features

1. **Strict Role-Based Multi-Portal Architecture**:
   - **Academic Institutions**: Registration (with NAAC accreditation), problem statement selection, student team creation.
   - **Industry Mentors**: Expert onboarding, project guidance, technical milestone feedback.
   - **Collegiate Students**: Team lead & student member dashboards, milestone code/CAD uploads.
   - **District Collector**: High-level governance analytics, district KPI metrics, certificate verification.
   - **Super Admin**: Problem statement curation, milestone decisions, institutional approvals, mentor pairing, hero slideshow manager, and immutable audit trails.

2. **Strict Super Admin Verification & Approval Workflow**:
   - Newly registered Academic Institutions & Mentors enter a **Pending Approval** state.
   - Login is strictly blocked until the Super Admin verifies credentials.
   - Super Admin dashboard includes dedicated approval queues with one-click **Approve** and **Reject** actions.

3. **Automated Transactional Email Notifications**:
   - Outbound registration confirmation emails.
   - Official Super Admin approval emails granting portal login access.
   - Rejection emails detailing administrative remarks.
   - Milestone submission, approval, and deadline reminders.

4. **District Administration Standards**:
   - Tamil Nadu state emblem & Coimbatore district innovation branding.
   - Technical blueprint graph-paper backdrop.
   - Dynamic Hero Slideshow with customizable banners.
   - FAQ with Accordion & Contact Us inquiry forms.

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Navigate to project folder
cd triple-helix-platform

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) to view the application.

### 4. Build for Production
```bash
npm run build
```

---

## 📋 Default Test Credentials

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin.triplehelix@tn.gov.in` | `admin123` |
| **District Collector** | `collector.cbe@tn.gov.in` | `admin123` |
| **Academic Institution** | `coordinator@psgtech.ac.in` | `password123` |
| **Industry Mentor** | `rajeshwari.krishnan@bosch.com` | `password123` |
| **Collegiate Student** | `710022104018` | `student123` |

*(MFA test bypass code: `123456` or the displayed 6-digit code).*
