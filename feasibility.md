# 🧾 Feasibility Report: Fantasy Premier League (FPL) Web Application

## 1. Introduction / Executive Summary
This report examines the feasibility of developing a **Fantasy Premier League (FPL) web and mobile application** specifically designed to help users analyse their performance within their mini-leagues, rather than simply comparing overall league standings. Unlike most existing FPL tools, which focus on broad statistics, this application will focus on allowing users to track their progress against specific rivals, uncover strategies to gain an advantage, and receive actionable insights tailored to their mini-league competition.

The app will leverage real-time data from the official FPL API and incorporate an **AI chatbot** to provide personalised recommendations. Users will be able to explore player statistics and team performance, with a clear focus on understanding how their choices affect their mini-league standings.

The system will use a **React-based frontend** for web and mobile accessibility and a **C# ASP.NET Core backend** to manage API data and serve structured responses. Initial analysis indicates the project is technically, operationally, and economically feasible. The report concludes that this mini-league–focused FPL application is a viable project with strong potential to provide unique value to fantasy football enthusiasts.

---

## 2. Background
Fantasy Premier League (FPL) is a global online game attracting millions of football enthusiasts. Participants build virtual teams composed of real-life Premier League players and earn points based on real-world performances. 

However, the official platform provides limited flexibility for analysing detailed statistics. 

The proposed FPL Web App addresses this opportunity by offering a personalised and analytical interface, leveraging the publicly accessible **FPL API** to deliver a richer user experience. There are other websites that aim to do this, but this project aims to help users catch specific rivals, and give a deeper analysis into performance within specific mini-leagues.

This project is under consideration as it aligns with the growing interest in sports analytics and web-based fantasy tools, combining **software development, API integration**, and **data visualization**.

---

## 3. Outline of the Project
The FPL Web App will be a **full-stack website** consisting of:

### Frontend (React)
Provides a responsive user interface for viewing data such as players, teams, fixtures, and rankings.
- **Mini-League Number Line Graph:** Allows users to see their position relative to other players in their mini-league in a visually intuitive number line format, which is more informative than a simple list of scores.
- **Week-by-Week Performance Graph:** Displays comparative progress over time within the mini-league, helping users track trends and understand how their strategies impact their ranking week by week.
- **AI Chatbot Interface:** Enables users to ask questions about player selection, transfer strategies, or mini-league performance and receive personalized recommendations based on their current team and rivals’ positions.

### Backend (C# / ASP.NET Core)
Retrieves live data from the official FPL API and serves it to the frontend via REST endpoints, ensuring up-to-date player and team statistics.

### Objectives
- Deliver a functional prototype capable of fetching and displaying FPL mini-league data.
- Provide interactive visualizations that highlight users’ mini-league performance over time.
- Enable filtering and comparison of players and teams within the mini-league context.
- Ensure scalability for future enhancements such as AI-powered recommendations and notifications.

### Deliverables
- Hosted web application accessible via web and mobile browsers.
- Source code repository with frontend and backend code.
- Documentation covering system design, usage instructions, and API integration.

---

## 4. Methodology / Method of Analysis

### Technical Feasibility
- **Frontend:** React for cross-platform web and mobile responsiveness.  
- **Backend:** ASP.NET Core (C#) for API integration and AI chatbot processing.  
- **FPL API:** Provides player, team, fixture, and mini-league data.  
- **AI:** Integration with OpenAI or custom ML models for personalized recommendations.  

### Operational Feasibility
The app will be **browser-based and fully responsive**, accessible on **desktop computers and mobile devices**. Users require no installation — only an internet connection and an FPL account.

### Economic Feasibility
All development tools are free (VS Code, Node.js, .NET SDK), and hosting can be done using low-cost or free tiers (GitHub Pages for frontend, Azure/Render for backend). Costs are minimal.

### Schedule Feasibility
Development can be completed in **6–8 weeks** for a functional MVP, following an iterative approach: design → prototype → test → refine → deploy.

---

## 5. Overview of Alternatives

| Alternative | Description | Advantages | Disadvantages |
|--------------|-------------|------------|---------------|
| **Do Nothing** | Continue without building the app. | No cost or effort. | No progress toward learning or solution; problem persists. |
| **Different Tech Stack (e.g., MERN)** | Use Node.js/Express backend instead of C#. | Single-language (JavaScript) stack. | Less opportunity to practice C#; weaker type safety. |
| **Proposed Solution (React + ASP.NET Core + AI Chatbot)** | Full-stack solution with mini-league focus and AI insights. | Strong architecture, scalable, personalized, responsive on web/mobile. | Slightly higher setup complexity. |

The analysis shows that the **proposed solution** provides the best balance between learning value, scalability, and unique user value.

---

## 6. Conclusion
Developing a **mini-league–focused FPL web app with AI chatbot integration** is **highly feasible**. The technologies are freely available, the project scope is realistic, and the system is designed to be easy to use across devices. The app’s mini-league focus and AI personalization differentiate it from existing tools.

---

## 7. Recommendation
It is recommended that the project **proceed to development**. Initial efforts should focus on:  
- Implementing backend endpoints to fetch mini-league data from linked FPL accounts.  
- Creating the frontend UI with visualizations (number line, week-by-week graphs).  
- Integrating the AI chatbot for personalized advice.  
- Testing responsiveness on web and mobile browsers.  

**Future Enhancements:**  
- Advanced analytics and predictions.  
- Real-time alerts and notifications.  
- Additional personalization features based on user behavior.

---

**Author:** Jonathan Lloyd  
**Date:** 8/10/25
**Project:** Fantasy Premier League Web Application


