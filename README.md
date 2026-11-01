# ♻️ SmartWaste AI - AI-Based Smart Waste Management System

A production-grade, full-stack website and smart city logistics system for automated waste classification, recycling optimization, and efficient municipal waste collection powered by Artificial Intelligence, IoT telemetry, and GIS route optimization.

---

## 🌟 Advanced System Features

### 1. 📷 Multimodal AI Waste Classification
- **Computer Vision Model:** Identifies discarded objects via upload or live camera using **Gemini 3.8 Flash Vision** (multimodal vision reasoning).
- **7 Segregated Waste Streams:**
  - 🥤 **Plastic** (PET #1, HDPE #2, PP #5)
  - 📦 **Paper & Cardboard**
  - 🥫 **Metal** (Aluminum cans, tin, scrap iron)
  - 🍾 **Glass** (Clear & amber bottles, food jars)
  - 🍌 **Organic Waste** (Food scraps, agricultural biomass, compost)
  - 📱 **E-Waste** (Smartphones, lithium-ion batteries, PCBs)
  - ⚠️ **Hazardous Waste** (Solvents, fluorescent bulbs, motor fluids)
- **Detailed Output:** Confidence score percentage, recyclability tier, color-coded bin recommendation, step-by-step cleaning/disposal instructions, and carbon impact metrics.

### 2. 📡 Smart Bin Monitoring & IoT Telemetry
- **Interactive OpenStreetMap / Leaflet Grid:** Shows bin ID, geolocation, waste stream, and exact fill percentage.
- **Tri-State Status Indicator:**
  - 🟢 **Empty** (0–30%)
  - 🟡 **Half Full** (31–79%)
  - 🔴 **Full** (≥80% Alert State)
- **Configurable Fill Threshold:** Municipal administrators can adjust the collection alert threshold (50% to 95%, default: 80%).
- **Automatic Alert Generator:** When a bin crosses the threshold, a high-priority dispatch alert notification is created in real-time.
- **Simulated IoT Sensor Fluctuations:** Includes an IoT Telemetry Simulator (`POST /api/simulation/iot-tick` and manual slider) to test sensor triggers.

### 3. 🚚 AI Collection Route Optimization
- **Fleet Vehicle Tracking:** Real-time simulated locations for electric municipal trucks (`EcoTruck Zero 1`, `EcoTruck Zero 2`), battery percentages, speeds, and loads.
- **TSP Nearest-Neighbor Heuristic:** Automatically clusters all bins needing collection (`status: Full` or `fillLevel >= threshold`), sequences optimal stops starting from the Central Depot, and concludes at the Materials Recovery Facility (MRF).
- **Route Visualization:** Renders the route polyline with numbered turn-by-turn stop badges directly on the Leaflet map.
- **Quantified Fuel & Carbon Savings:** Calculates total route mileage (km), estimated completion time (mins), and avoided greenhouse gas emissions (kg CO₂).

### 4. 🔔 Real-Time Notifications System
- **Notification Panel Drawer:** Accessible from the top navbar with an unread badge counter.
- **Triggered Event Types:**
  - 📦 Pickup request submitted by citizen.
  - 🚛 Request status advanced by driver or administrator (`Pending` ➔ `Assigned` ➔ `In Progress` ➔ `Completed`).
  - 🚨 Smart bin fill threshold exceeded (urgent dispatch alert).
  - 🎁 Eco-Reward voucher redeemed.
- Features: One-click mark as read, mark all read, clear history, and direct navigation links.

### 5. 🏆 Eco-Points, Rewards & Leaderboard
- **Citizen Wallet:** Shows balance, lifetime points, and badge tiers (Seedling ➔ Active Recycler ➔ Specialist ➔ Green Guardian).
- **Points Activity Rules:**
  - 📸 Scan item: +15 pts
  - 📦 Schedule pickup: +50 pts
  - ✨ Zero contamination bonus: +25 pts
- **Achievement Badges:** 6 unlockable badges (Zero-Waste Novice, Plastic Pioneer, Compost Champion, E-Waste Guardian, Cardboard Conqueror, Community Green Hero).
- **Community Leaderboard:** Live neighborhood citizen rankings.
- **Redeemable Rewards Catalog:** Transit passes, cured compost bags, zero-waste grocery coupons, and solar utility credits with generated voucher codes.

### 6. 🛡️ Administrator Command Center
- **Smart Bins Fleet & IoT Simulator:** Configurable alert threshold slider, manual sensor fill test, and one-click empty trigger.
- **AI Route Optimization Center:** Vehicle picker, route generation, and dispatch controller.
- **Waste Category Governance:** Customize bin colors, target recyclability rates, instructions, and contamination fees.
- **User Directory:** Promote user roles (`citizen` ➔ `collector` ➔ `admin`) and assign operational zones.
- **CSV Audit Reports:** Export historical pickup logs.

### 7. 🌍 Environmental Impact & Methodology Transparency
- **Scientific Life-Cycle Assessment (LCA) Transparency Modal:**
  - Explains the exact mathematical basis behind CO₂ offset formulas (EPA WARM v15, IPCC Tier 1 solid waste guidelines, Aluminum Association LCA).
  - Explicit disclaimer clarifying that statistics are simulated based on international models for academic project demonstration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (SPA with TypeScript) |
| **Styling & Theme** | Tailwind CSS (Nature-inspired Green & White Environmental Theme) |
| **Icons & Micro-animations** | Lucide React, Motion, Canvas-Confetti |
| **Mapping Engine** | Leaflet 1.9 + OpenStreetMap Carto Tiles |
| **Backend API Server** | Node.js Express + TSX Full-Stack Engine |
| **Artificial Intelligence** | `@google/genai` (Gemini 3.8 Flash Multimodal Model) |
| **Route Optimization** | Algorithmic Travelling Salesperson / Greedy Nearest-Neighbor Engine |
| **Data Persistence** | In-Memory Database with Seeded Municipal Telemetry |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Configure `.env` (or set via AI Studio Secrets):
   ```env
   # GEMINI_API_KEY: Used for server-side Gemini 3.8 Flash multimodal calls
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```

3. Run Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for Production:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Demo Accounts for Testing

| Role | Email | Password | Pre-seeded Features |
|---|---|---|---|
| **Citizen** | `citizen@smartwaste.ai` | `password123` | 420 Eco-Points, 2 pickup requests |
| **Waste Collector** | `collector@smartwaste.ai` | `password123` | Metro Sector A & B route access |
| **Administrator** | `admin@smartwaste.ai` | `password123` | City Central Command, Full Privileges |

---

## 📄 License
Academic & Educational Project License - Built with Google AI Studio.
