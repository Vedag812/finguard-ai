# 🛡️ FinGuard AI: Predictive Risk Intelligence for Modern Banking

**FinGuard AI** is a professional-grade predictive risk dashboard designed to transform reactive credit monitoring into a proactive prevention strategy. By leveraging real-time stress signals and explainable AI, it empowers risk managers to identify and mitigate credit defaults before they occur.

[![Live on Vercel](https://img.shields.io/badge/Live-Vercel-black?style=flat-square&logo=vercel)](https://workspace-extracted.vercel.app)
[![Framework](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Firebase-Admin-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)

---

## 🖼️ Visual Showcase

### 📊 Comprehensive Risk Dashboard
Discover a powerful, high-fidelity interface designed for deep financial analysis and real-time monitoring.

| Portfolio Overview | Risk Analysis & Explainability |
|:---:|:---:|
| ![Portfolio Overview](docs/screenshots/Screenshot%202026-02-19%20203903.png) | ![Risk Analysis](docs/screenshots/Screenshot%202026-02-19%20203934.png) |

### ↗ Targeted Interventions & Behavioral Signals
Proactively manage credit risk with AI-suggested actions and granular behavioral tracking.

| Intervention Recommendations | Behavioral Heatmaps |
|:---:|:---:|
| ![Interventions](docs/screenshots/Screenshot%202026-02-19%20203944.png) | ![Signals](docs/screenshots/Screenshot%202026-02-19%20204004.png) |

---

## 🏛️ System Architecture

FinGuard AI utilizes a resilient architecture designed for 100% availability and data integrity, even in unstable network environments.

### 🛡️ Resilient Data Layer
At the core of the application is a custom **Firestore Resilience Proxy**. This layer handles all database interactions with an automatic fallback mechanism:
- **gRPC Scrubbing**: Aggressive environment variable cleaning ensures 100% compatibility with production gRPC metadata requirements.
- **Failover Logic**: Detects `NOT_FOUND` or `SERVICE_DISABLED` events at the SDK level and transparently redirects operations to an optimized **In-Memory Session Store**.
- **Context Preservation**: Explicit method delegation maintains the integrity of the Firebase Admin SDK while providing a failsafe interface.

### 📈 Predictive Intelligence Engine
The dashboard processes behavioral signals to calculate granular risk scores:
- **Stress Signal Tracking**: Monitoring salary credit delays, discretionary spend collapse, and stress-borrowing through UPI patterns.
- **Explainable AI (XAI)**: Every risk alert is accompanied by SHAP-driven feature importance, providing deep transparency into the model's decision-making process.

---

## ✨ Enterprise Features

### 🔍 Risk Monitoring & Alerts
A high-performance datagrid featuring 100+ active records with real-time filtering. Risk managers can deep-dive into individual customer signals, viewing historical trends and behavioral anomalies.

### ↗ Automated Intervention Lifecycle
AI-driven recommendations for proactive risk mitigation:
- **Strategic Relief**: Automated suggestions for Payment Holidays and EMI Restructuring.
- **ROI Projections**: Each intervention displays estimated prevented loss vs. campaign cost.
- **Audit Logging**: Successful interventions are logged with unique IDs for downstream tracking.

### 🎨 Design System & UX
- **Corporate Dark Aesthetics**: Optimized for high-focus environments using a curated color palette (Barclays secondary orange, sleek charcoal, and status-driven signals).
- **Atomic UI Architecture**: A proprietary component library built for speed, consistency, and accessible data visualization.

---

## 🛠 Technical Specification

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS 4
- **Backend**: Node.js API Routes with resilient Firebase Admin integration
- **Visuals**: Framer Motion, Recharts, and Custom SVG Data Gauges

## 📂 Project Structure

```text
src/
├── app/api/       # Resilient RESTful endpoints with Proxy integration
├── components/
│   ├── dashboard/ # Analytical Gauges, Charts, and Metrics
│   ├── pages/     # Feature modules (Risk Alerts, Interventions, 360)
│   ├── ui/        # Proprietary Atomic UI System
├── lib/           # Resilience Proxy, Theme Tokens, UI Utilities
└── hooks/         # Custom state management and data lifecycle
```

---
*FinGuard AI is a demonstration of enterprise-grade resilient engineering. Designed for performance, built for impact.*
