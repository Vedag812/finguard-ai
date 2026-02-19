# <p align="center">🛡️ FinGuard AI</p>
<p align="center"><b>Predictive Risk Intelligence for Modern Banking</b></p>

<p align="center">
  <a href="https://workspace-extracted.vercel.app">
    <img src="https://img.shields.io/badge/Live-Vercel-black?style=for-the-badge&logo=vercel" alt="Live on Vercel">
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Framework">
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/Firebase-Admin-orange?style=for-the-badge&logo=firebase" alt="Backend">
  </a>
</p>

---

## 🏛️ Project Vision
**FinGuard AI** is a professional-grade predictive risk dashboard designed to transform reactive credit monitoring into a proactive prevention strategy. By leveraging real-time stress signals and explainable AI, it empowers risk managers to identify and mitigate credit defaults before they occur.

## 🖼️ Visual Showcase

### 📊 Intelligence at a Glance
Experience a powerful, high-fidelity interface designed for deep financial analysis and real-time monitoring of portfolio health.

<p align="center">
  <img src="docs/screenshots/portfolio-overview.png" width="90%" alt="Portfolio Overview">
</p>

### 🔍 Risk Monitoring & Explainability
Move beyond black-box scores. FinGuard provides granular transparency into *why* a customer is flagged, powered by SHAP feature importance.

<p align="center">
  <img src="docs/screenshots/risk-alerts.png" width="45%" alt="Risk Alerts">
  <img src="docs/screenshots/risk-analysis.png" width="45%" alt="Risk Analysis Detail">
</p>

### ◈ Behavioral Deep-Dives
Drill down into individual customer journeys, behavioral heatmaps, and transaction stress signals.

<p align="center">
  <img src="docs/screenshots/customer-360.png" width="45%" alt="Customer 360">
  <img src="docs/screenshots/behavioral-heatmaps.png" width="45%" alt="Behavioral Heatmaps">
</p>

### ↗ Targeted Interventions & Governance
Automated approval workflows and comprehensive reporting ensure that every risk mitigation step is logged and auditable.

<p align="center">
  <img src="docs/screenshots/interventions-list.png" width="45%" alt="Interventions List">
  <img src="docs/screenshots/export-modal.png" width="45%" alt="Export & Reporting">
</p>

---

## 🏛️ System Architecture

FinGuard AI utilizes a resilient architecture designed for 100% availability and data integrity, even in unstable network environments.

### 🛡️ Resilient Data Layer
At the core of the application is a custom **Firestore Resilience Proxy**. This layer handles all database interactions with an automatic fallback mechanism:
- **gRPC Sanitization**: Aggressively cleans environment variables to ensure 100% compatibility with production gRPC metadata requirements.
- **Dynamic Failover**: Detects `NOT_FOUND` or `SERVICE_DISABLED` events at the SDK level and transparently redirects operations to an optimized **In-Memory Session Store**.
- **Context Integrity**: Explicit method delegation maintains the integrity of the Firebase Admin SDK while providing a failsafe interface.

### 📈 Predictive Intelligence Engine
The dashboard processes behavioral signals to calculate granular risk scores:
- **Stress Signal Tracking**: Monitoring salary credit delays, discretionary spend collapse, and stress-borrowing through UPI patterns.
- **Explainable AI (XAI)**: Every risk alert is accompanied by SHAP-driven feature importance, providing deep transparency into the model's decision-making process.

---

## ✨ Enterprise Features

### 🔍 Risk Monitoring & Alerts
A high-performance datagrid featuring 100+ active records with real-time horizontal and vertical filtering.

### ↗ Automated Intervention Lifecycle
AI-driven recommendations for proactive risk mitigation:
- **Strategic Relief**: Automated suggestions for Payment Holidays and EMI Restructuring.
- **ROI Projections**: Each intervention displays estimated prevented loss vs. campaign cost.
- **Audit Logging**: All interactions are logged with unique IDs for downstream auditability.

### 🎨 Design System & UX
- **Corporate Dark Aesthetics**: Optimized for high-focus environments using a curated color palette (Barclays secondary orange, sleek charcoal, and status-saturated signals).
- **Atomic UI Architecture**: A proprietary component library built for speed, consistency, and accessible data visualization.

---

## 🛠 Technical Specification

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS 4
- **Backend**: Node.js API Routes with resilient Firebase Admin integration
- **Visuals**: Framer Motion, Recharts, and Custom SVG Data Gauges

---
<p align="center">
  <i>FinGuard AI is a demonstration of enterprise-grade resilient engineering. Designed for performance, built for impact.</i>
</p>
