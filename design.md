# 🎨 Design Document: Fantasy Premier League (FPL) Web Application

## 1. Introduction
This document describes the **design and architecture** of the Fantasy Premier League Web App. It provides an overview of the system’s components, data flow, UI/UX considerations, and technical design decisions.  

The app is **mini-league–focused**, offers AI-powered recommendations, and is fully responsive on desktop and mobile devices.

---

## 2. System Architecture
The system follows a **full-stack architecture** with clear separation between frontend, backend, and external services:

[User Browser / Mobile App]
|
v
[Frontend - React]
|
v
[Backend - ASP.NET Core (C#)]
|
v
[FPL API] [AI Service (OpenAI)]

markdown
Copy code

### Components
1. **Frontend (React)**
   - Responsive web interface for desktop and mobile.
   - Visualizations:
     - Mini-League Number Line Graph  
     - Week-by-Week Performance Graph  
   - AI Chatbot interface for personalized insights.
   - Fetches data via REST API from the backend.

2. **Backend (ASP.NET Core)**
   - Retrieves real-time data from **FPL API**.
   - Processes mini-league standings and statistics.
   - Serves structured REST endpoints to the frontend.
   - Handles AI chatbot requests by forwarding prompts to AI service and returning results.
   - Optional caching for performance.

3. **FPL API**
   - Provides official player, team, fixture, and mini-league data.
   - Used by backend to power visualizations and analytics.

4. **AI Service**
   - OpenAI API or custom ML model for chatbot responses.
   - Provides personalized advice for transfers, player selection, and mini-league strategy.

---

## 3. Data Flow
1. **User Authentication**
   - User links official FPL account (OAuth or token-based).
2. **Mini-League Data Retrieval**
   - Backend fetches mini-league standings, player stats, and team data.
3. **Data Processing**
   - Backend formats data for frontend graphs and AI chatbot.
4. **Frontend Display**
   - Graphs show mini-league performance trends.
   - Chatbot provides contextual advice.
5. **Periodic Updates**
   - Backend refreshes FPL data at regular intervals to ensure up-to-date visualizations.

---

## 4. User Interface / UX Design
- **Responsive Design:** Optimized for mobile and desktop.  
- **Mini-League Number Line:** Shows each player’s rank relative to others in a visually intuitive way.  
- **Week-by-Week Performance Graph:** Tracks progress over multiple gameweeks.  
- **AI Chatbot Interface:** Floating chat window accessible from any page.  
- **Navigation:** Simple menu for Stats, Mini-League, Chatbot, and Settings.

---

## 5. Database / Storage
- **Optional:** SQLite or PostgreSQL for caching mini-league data, storing user preferences, and AI session history.  
- **Security:** Tokens and sensitive data encrypted.  

---

## 6. Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React, CSS/Bootstrap/Tailwind, Chart.js or Recharts |
| Backend | ASP.NET Core (C#), REST API |
| Database | SQLite / PostgreSQL (optional) |
| AI | OpenAI API / Custom ML service |
| Hosting | GitHub Pages (frontend), Azure or Render (backend) |

---

## 7. Future Enhancements
- Real-time mini-league alerts (push notifications).  
- Advanced predictive analytics for transfers and captain choices.  
- Social features: chat or forum within mini-leagues.  
- Improved AI recommendations with historical trend analysis.

---

## 8. Testing and Quality Assurance

### 8.1 Unit Testing
- Frontend components (React) will have unit tests for:
  - Graph rendering
  - Chatbot message handling
  - Data filtering and sorting

- Backend endpoints (ASP.NET Core) will have unit tests for:
  - FPL API data retrieval
  - Mini-league calculations
  - AI chatbot request handling

### 8.2 Integration Testing
- Verify frontend communicates correctly with backend APIs.
- Validate AI chatbot responses are accurate and context-aware.
- Ensure mini-league visualizations reflect real data.

### 8.3 User Acceptance Testing (UAT)
- Test with sample mini-league data to simulate real user scenarios.
- Confirm the interface is intuitive on both mobile and desktop.
- Validate AI chatbot provides helpful and relevant recommendations.

### 8.4 Performance and Load Testing
- Ensure pages load within 2 seconds on standard connections.
- Test backend handling of multiple simultaneous users and API calls.

### 8.5 Security Testing
- Verify tokens and sensitive data are encrypted.
- Ensure only authenticated users can access mini-league data.

---

**Author:** Jonathan Lloyd  
**Date:** 8/10/25
**Project:** Fantasy Premier League Web Application