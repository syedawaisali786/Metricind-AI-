# 📊 MetricMind-AI

### AI-Powered Business Intelligence & Analytics Platform

MetricMind-AI is a modern Business Intelligence dashboard designed to transform business data into **governed metrics, interactive analytics, AI-assisted insights, and actionable recommendations**.

The platform provides a centralized interface for monitoring business performance across revenue, cost, profit, orders, products, regions, and time periods.

---

## 🚀 Overview

MetricMind-AI combines a modern React dashboard with a Node.js backend and a governed semantic layer to provide reliable business analytics.

### Core Capabilities

- 📊 Executive Business Dashboard
- 📈 Revenue & Profit Analytics
- 💰 Governed Business Metrics
- 🌍 Regional Performance Analysis
- 📦 Product Performance Analysis
- 📅 Monthly Performance Tracking
- 🔎 Business Filters
- 🤖 AI Analyst & AI Recommendations
- 💡 Executive Insights
- 📋 Business Reports
- 🧠 Semantic Layer
- ⚙️ Deterministic Business Logic
- ❄️ Snowflake Data Connectivity

---

# ✨ Key Features

## 📊 Executive Dashboard

The main dashboard provides a high-level view of business performance through governed KPI cards.

### Key Metrics

- Total Revenue
- Total Cost
- Total Profit
- Total Orders
- Profit Margin

The dashboard allows users to quickly understand the current state of the business.

---

## 🔎 Business Filters

MetricMind-AI supports interactive business filtering by:

- 🌍 Country
- 🗺️ Region
- 📦 Product
- 📅 Month

Users can apply filters to narrow the analysis and explore specific business segments.

---

## 📈 Revenue Analytics

The Revenue Analytics module provides visual analysis of:

- Monthly Revenue
- Monthly Profit
- Revenue Trends
- Profitability Trends

Interactive charts make it easier to identify changes in business performance over time.

---

## 📦 Product Performance

The Product Performance module analyzes profit contribution across products.

It provides:

- Product-level profit analysis
- Profit contribution percentages
- Total product profit
- Product comparison

This helps identify products that contribute most to overall profitability.

---

## 🌍 Regional Performance

MetricMind-AI provides regional revenue and profitability analysis.

Users can compare:

- Region
- Orders
- Revenue
- Cost
- Profit
- Profit Margin

This makes it easier to identify high-performing and underperforming regions.

---

## 🤖 AI Analyst

The AI Analyst provides an interactive interface for asking business-related questions.

Users can ask questions about:

- Revenue
- Profit
- Cost
- Orders
- Products
- Regions
- Monthly performance

The system uses governed business metrics and the semantic layer to provide consistent analytical results.

---

## 💡 AI Recommendations

MetricMind-AI provides deterministic business recommendations based on current business performance.

Recommendations can highlight areas such as:

- Strong profitability
- Weak profitability
- Regional opportunities
- Product performance
- Business risks
- Areas requiring attention

The recommendations are generated from governed business metrics rather than arbitrary dashboard values.

---

## 🧠 Semantic Layer

MetricMind-AI includes a governed semantic layer that defines business metrics and dimensions consistently.

### Governed Metrics

Examples include:

- Total Revenue
- Total Cost
- Total Profit
- Total Orders
- Profit Margin

### Business Dimensions

- Country
- Region
- Product
- Month

The semantic layer helps ensure that analytics use consistent business definitions across the application.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────────┐
                    │      MetricMind-AI       │
                    │   Business Intelligence  │
                    └────────────┬─────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
        ┌───────▼────────┐              ┌────────▼────────┐
        │    Frontend    │              │     Backend     │
        │ React + TS     │              │ Node + Express  │
        └───────┬────────┘              └────────┬────────┘
                │                                │
                │                         ┌──────▼──────┐
                │                         │ Semantic    │
                │                         │ Layer       │
                │                         └──────┬──────┘
                │                                │
                │                         ┌──────▼──────┐
                │                         │  Snowflake  │
                │                         │    Data     │
                │                         └─────────────┘
                │
        ┌───────▼─────────────────────────┐
        │ Dashboard • Analytics • Reports │
        │ AI Analyst • Recommendations    │
        └─────────────────────────────────┘
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Axios
Recharts
CSS
Backend
Node.js
Express.js
Axios
Snowflake connectivity
Data & Analytics
Snowflake
Governed Semantic Layer
Business Metrics
Business Dimensions
Deterministic Analytics
📂 Project Structure
MetricMind-AI/
│
├── backend/
│   ├── server.js
│   ├── semanticLayer.js
│   ├── agentOrchestrator.js
│   ├── snowflake.js
│   ├── test-snowflake.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── CountryPerformance.tsx
│   │   │   ├── ExecutiveInsights.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── KPICards.tsx
│   │   │   ├── MonthlyPerformance.tsx
│   │   │   ├── Recommendations.tsx
│   │   │   ├── RegionChart.tsx
│   │   │   └── RegionalPerformance.tsx
│   │   │
│   │   ├── Analytics.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── Chat.tsx
│   │
│   └── package.json
│
├── dbt/
│   └── metricmind/
│
├── public/
│
├── README.md
└── package.json
▶️ Getting Started
1. Clone the Repository
git clone <repository-url>
cd MetricMind-AI
2. Install Frontend Dependencies
cd frontend
npm install
3. Start the Frontend
npm run dev
The Vite development server will start locally.
⚙️ Backend Setup
Open another terminal:
cd backend
npm install
Start the backend:
node server.js
🔐 Environment Configuration
Create a .env file inside the backend directory.
Example:
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
⚠️ Never commit .env, passwords, private keys, or other credentials to GitHub.
📊 Dashboard Modules
Module
Purpose
Dashboard
Executive business overview
Analytics
Detailed business analysis
AI Analyst
Natural-language business analysis
Reports
Business reporting
Performance
Regional and product performance
AI Recommendations
Data-driven decision support
📈 Analytics Available
MetricMind-AI currently provides analysis for:
Revenue
Total Revenue
Monthly Revenue
Regional Revenue
Profit
Total Profit
Monthly Profit
Product Profit
Regional Profit
Profit Margin
Operations
Total Orders
Product Performance
Regional Performance
🧠 Business Intelligence Approach
MetricMind-AI follows a governed analytics approach:
Raw Business Data
        ↓
Semantic Layer
        ↓
Governed Metrics & Dimensions
        ↓
Analytics Engine
        ↓
Dashboard Visualizations
        ↓
AI Analyst
        ↓
Recommendations & Insights
This approach helps maintain consistency between dashboard calculations, analytical queries, and AI-generated business insights.
🎯 Project Objectives
The primary objectives of MetricMind-AI are to:
Centralize business analytics
Simplify complex business data
Provide reliable KPI monitoring
Enable interactive data exploration
Support natural-language business analysis
Identify important business trends
Provide actionable recommendations
Improve data-driven decision making
🔮 Future Enhancements
Potential future improvements include:
Advanced predictive analytics
Automated business alerts
Forecasting
More AI-powered analytical agents
Advanced role-based access control
Additional data sources
Automated report generation
Cloud deployment
Enhanced conversational analytics
👨‍💻 Author
Syed Awais Ali
MetricMind-AI — AI-Powered Business Intelligence Dashboard
Built as a practical Business Intelligence and analytics project combining modern web technologies, governed metrics, data visualization, and AI-assisted decision support.
📸 Dashboard Preview
Executive Dashboard
Add your latest dashboard screenshot here.
Analytics
Add your analytics screenshot here.
AI Analyst
Add your AI Analyst screenshot here.
AI Recommendations
Add your AI Recommendations screenshot here.
⭐ Project Highlights
MetricMind-AI transforms business data into governed metrics, interactive analytics, AI-assisted insights, and actionable recommendations through a modern Business Intelligence platform.

### One important change from your current README

Your old README says only:

> "AI-powered Business Intelligence Dashboard"

Your **actual project is now much stronger than that**. From the dashboard you showed me, we should emphasize **Governed Metrics + Semantic Layer + Analytics + AI Analyst + Recommendations + Snowflake**. That will make the README match what you are actually demonstrating during the Axlero review.

Also, **don't put your real Snowflake password, `.env`, or RSA private key anywhere in the README or GitHub.**

If you want, the next step can be making the README **visually premium** with badges, a polished hero section, feature cards, architecture diagram, and your actual dashboard screenshots.
