# Portfolio Projects Summary

This document contains all project details and descriptions for Muhammad Iqbal Hilmy Izzulhaq's portfolio website.

---

## 1. Financial Wellness Agent (FWA)
**Complexity:** 10/10 | **Date:** December 2025

**Description:**  
Production-ready AI-powered personal finance PWA with **multi-agent architecture** and **real-time market analysis**. Features **6 specialized AI agents** (Planner, Report Generator, Transaction Parser, Budget Analyzer, Goal Advisor, Market Agent), **AI-powered stock analysis** for IDX and global markets, **portfolio management**, and **personalized investment recommendations**. Achieved **95% cost optimization** ($3-11/month).

**Technologies:** Next.js, FastAPI, AWS Lambda, SQS, Gemini AI, Firestore, Cloud Run, yfinance

**Metrics:** 6 AI Agents | Stock Analysis | 95% Cost Savings

**Links:**
- Demo: https://fwa-frontend-5brcxjzeya-et.a.run.app

**Case Study:**
- **Problem:** Indonesian users lack accessible, intelligent personal finance tools that combine AI chat with real-time market analysis. Traditional apps are expensive, don't scale, and lack natural language interaction with investment insights.
- **Approach:** Built a serverless multi-agent architecture with 6 specialized AI agents: Planner (Gemini 3 Pro) for orchestration, plus 5 specialists (Gemini 2.5 Flash) for reports, transactions, budgets, goals, and market analysis. Integrated yfinance for real-time stock data (IDX and global markets) with sentiment analysis and price targets. Beautiful card-based UI with skeleton loaders, bilingual support (EN/ID), and conversation memory.
- **Results:** Production-deployed on Cloud Run (asia-southeast2). AI stock analysis with buy/hold/sell recommendations and risk levels. Portfolio tracking with performance snapshots. 95% cost reduction ($3-11/month) through serverless architecture and smart model selection. Comprehensive security with Clerk auth, JWT exchange, and AI guardrails.

**Gallery:** Video demo + 7 screenshots (Home, AI Chat, Recommendations, Market Analysis, Market View, Reports, Saving Goals)

---

## 2. FocusForge - Learning Focus App
**Complexity:** 9/10 | **Date:** December 2025

**Description:**  
A **Tauri 2.0** desktop application for enhanced learning through **Pomodoro-style focus sessions**, **AI-powered knowledge consolidation**, and **gamification**. Features **TensorFlow.js face detection** for distraction tracking with eye gaze analysis, **Gemini AI** (2.5 Flash / 3 Pro) for Socratic learning analysis, **AI Timer Assistant v2** with context-aware recommendations, **11 achievement badges**, **Analytics Dashboard** with productivity heatmap, and **global Quick Notes** (Ctrl+Alt+N).

**Technologies:** Tauri 2.0, React, TypeScript, TensorFlow.js, Gemini AI, SQLite, Zustand

**Metrics:** Face Detection | AI Timer Assistant | 11 Badges

**Links:**
- Download (.exe): https://drive.google.com/file/d/1agIbR4pk8wvYLyD7Q9Hlnin-VHqzCr40/view?usp=sharing
- Repository: https://github.com/Shiverion/focusforge

**Case Study:**
- **Problem:** Students and learners struggle with maintaining focus during study sessions and lack tools to track their attention and consolidate knowledge effectively.
- **Approach:** Built a Tauri 2.0 desktop app with TensorFlow.js MediaPipe face detection to track eye gaze and detect distractions. Integrated Gemini AI (2.5 Flash / 3 Pro) for post-session Socratic analysis that compares active recall with session notes. Added AI Timer Assistant v2 with dual integration points (task selector + task creation) providing context-aware timer suggestions based on topic complexity, learning style, and energy level. Gamification with 11 achievement badges across streak, focus, and milestone categories.
- **Results:** Cross-platform desktop app with real-time distraction detection, AI-powered learning consolidation, and comprehensive badge system. Features system tray integration with live timer display, global shortcuts (Ctrl+Alt+N for quick notes), Picture-in-Picture camera mode, cross-window state sync via Tauri events, and desktop + Pushover phone notifications.

**Features:**
- Pomodoro timer with configurable durations (presets: Standard 25/5, Deep Work 50/10, Light Review 15/3, Extended 45/8)
- **AI Timer Assistant v2**: Context-aware suggestions based on topic, complexity, learning style, energy level
- TensorFlow.js face detection with eye gaze tracking (up/down/left/right/center)
- Auto-logs distraction after 10 seconds of looking away or absence
- Camera enforcement (timer pauses if camera disabled)
- Auto Picture-in-Picture mode when switching apps
- Global Quick Notes (Ctrl+Alt+N) with task selector and cross-window sync
- Deep Learning Workflow (Active Recall → AI Analysis → Master Summary)
- Learning History grouped by task as expandable folders
- 11 Achievable Badges (Streak: Spark/Flame/Blaze, Focus: Laser/Zen/Untouchable, Milestone: 5 badges)
- Analytics Dashboard with weekly focus chart and productivity heatmap
- Desktop + Pushover phone notifications

**Gallery:** Video demo + 3 screenshots (Home, Learning History, Stats & Badges)

---

## 3. Meeting Summarizer
**Complexity:** 8/10 | **Date:** November 2025

**Description:**  
A full-stack web application for transcribing meeting recordings and generating AI-powered summaries. Features **OpenAI Whisper** for audio transcription, **GPT-4o-mini** for intelligent summarization, and **Clerk** for user authentication. Deployed on **Google Cloud Run** with a complete CI/CD pipeline via GitHub Actions.

**Technologies:** React, FastAPI, OpenAI, GCP, Docker

**Metrics:** AI Transcription | Cloud Native

**Links:**
- Demo: https://meeting-summarizer-frontend-536127761034.asia-southeast1.run.app

**Case Study:**
- **Problem:** Professionals waste hours manually transcribing and summarizing meeting recordings, leading to delayed action items and lost insights.
- **Approach:** Built a microservices architecture with React frontend, FastAPI backend, and Express PDF service. Integrated OpenAI Whisper for transcription and GPT-4o-mini for intelligent summarization with adaptive formatting based on content type.
- **Results:** Reduced meeting documentation time by 90%. Supports audio files up to 60 minutes with free tier usage management. Deployed to Google Cloud Run with automated CI/CD.

---

## 4. Cybersecurity Analyzer Agent
**Complexity:** 7/10 | **Date:** December 2025

**Description:**  
A web-based tool designed to identify security vulnerabilities in Python code. Features **AI-Driven Analysis** using OpenAI's agents, **Static Code Analysis** with Semgrep via MCP, and an interactive chat interface. Architected for deployment on serverless container platforms like Azure Container Apps and Google Cloud Run.

**Technologies:** Python, OpenAI, Semgrep, Azure, GCP

**Metrics:** AI-Driven Security

**Links:**
- Azure Demo: https://cyber-analyzer.livelycoast-f551c6c5.southeastasia.azurecontainerapps.io/
- GCP Demo: https://cyber-analyzer-xag3yi2i3q-uc.a.run.app/
- Repository: https://github.com/Shiverion/cybersecurity-agent

**Case Study:**
- **Problem:** Developers often miss security vulnerabilities in their code, and traditional static analysis tools require complex setup and interpretation.
- **Approach:** Combined OpenAI Agents with Semgrep static analysis via MCP (Model Context Protocol). Created conversational interface for explaining vulnerabilities in plain language.
- **Results:** Deployed on both Azure Container Apps and Google Cloud Run. Provides actionable security recommendations with AI-powered explanations.

---

## 5. Trader Agent Simulator
**Complexity:** 7/10 | **Date:** September 2025

**Description:**  
Built an intelligent trader agent using the **OpenAI Agents SDK**, capable of alternating between trading and rebalancing its portfolio using real-time insights from a researcher agent. Leveraged advanced async context management for clean multi-server handling, and integrated support for multiple LLM providers (OpenAI, DeepSeek, Google, Anthropic).

**Technologies:** Python, OpenAI SDK, Multi-Agent, Async

**Metrics:** Multi-LLM Support

**Case Study:**
- **Problem:** Manual portfolio management is time-consuming and prone to emotional decision-making. Multiple LLM providers offer different strengths.
- **Approach:** Designed a multi-agent system where a trader agent collaborates with a researcher agent. Used async context management for parallel MCP server connections.
- **Results:** Successfully demonstrated autonomous trading decisions with real-time market research. Supports seamless switching between OpenAI, DeepSeek, Google, and Anthropic models.

---

## 6. Galaxy Morphology Classification
**Complexity:** 6/10 | **Date:** December 2025

**Description:**  
An interpretable deep learning project for classifying galaxy morphologies (Elliptical vs Spiral) using the **Galaxy Zoo 2** dataset from SDSS images. Achieved **99.07% accuracy** and **ROC-AUC 0.9995** with **ResNet18** transfer learning. Features **Grad-CAM** and **Integrated Gradients** for scientific interpretability.

**Technologies:** PyTorch, ResNet18, Grad-CAM, Captum, Astropy, NumPy

**Metrics:** 99.07% Accuracy | ROC-AUC 0.9995

**Links:**
- Repository: https://github.com/Shiverion/galaxy-morphology-classification

**Case Study:**
- **Problem:** Astronomical datasets require interpretable ML models where researchers can understand why predictions are made - critical for building trust in astrophysics research.
- **Approach:** Used ResNet18 with ImageNet transfer learning on 24,273 high-confidence galaxy images (80%+ citizen science vote agreement). Implemented Grad-CAM and Integrated Gradients for visual interpretability.
- **Results:** Achieved 99.07% test accuracy with near-perfect ROC-AUC (0.9995). Model attention aligns with expected morphological features - bulge regions for ellipticals, spiral arms for spirals.

---

## 7. Career Digital Twin (RAG Chatbot)
**Complexity:** 5/10 | **Date:** August 2025

**Description:**  
Built and deployed a personal agent to represent my skills and experience to potential employers, automating the initial stages of job applications.

**Technologies:** Python, RAG, LangChain, HuggingFace

**Metrics:** Automated Screening

**Links:**
- Demo: https://huggingface.co/spaces/Shiverion/career_conversations
- Repository: https://github.com/Shiverion/Resume-chatbot-with-RAG

**Case Study:**
- **Problem:** Job seekers spend excessive time answering repetitive questions from recruiters about their background and qualifications.
- **Approach:** Built a RAG-based chatbot using LangChain that indexes my resume and project portfolio. Deployed on HuggingFace Spaces for easy access.
- **Results:** Automated initial screening conversations, allowing recruiters to get instant answers about my skills and experience 24/7.

---

## 8. Indonesian Parliament Activity Chatbot
**Complexity:** 5/10 | **Date:** May 2025

**Description:**  
This project implements a chatbot that can answer questions about the activities and agendas of the Indonesian Parliament members. It utilizes a SQL database containing agenda data and leverages large language models (LLMs) through the **Langchain** library to interact with the database and provide natural language responses.

**Technologies:** Python, LangChain, SQL, NLP

**Metrics:** Real-time Data

**Case Study:**
- **Problem:** Citizens lack easy access to information about their parliamentary representatives' activities and voting records.
- **Approach:** Built a LangChain SQL agent that converts natural language questions into SQL queries against parliament activity database.
- **Results:** Enabled citizens to query parliament activities in plain Indonesian, improving government transparency and civic engagement.

---

## 9. Telco Churn Analysis
**Complexity:** 4/10 | **Date:** February 2025

**Description:**  
Developed a churn prediction model using **AllKNN** with hyperparameter tuning, focused on minimizing false negatives. Achieved **93.7% recall**, reducing potential high-risk churn losses by $18.8K and cutting total misclassification costs by $48.5K, outperforming benchmark models like XGBoost and Random Forest.

**Technologies:** Python, Scikit-learn, XGBoost, Pandas

**Metrics:** 93.7% Recall | -$48.5K Costs

**Links:**
- Repository: https://github.com/Shiverion/Telcho-Churn-Analysis

**Case Study:**
- **Problem:** Telecom companies lose significant revenue from customer churn. Traditional models optimize for accuracy, missing high-risk churners.
- **Approach:** Focused on recall optimization to catch high-risk customers. Used AllKNN with hyperparameter tuning, comparing against XGBoost and Random Forest.
- **Results:** Achieved 93.7% recall, reducing high-risk churn losses by $18.8K and total misclassification costs by $48.5K compared to baseline models.

---

## 10. Airbnb Data Analysis
**Complexity:** 3/10 | **Date:** January 2025

**Description:**  
Analyzed Airbnb listings in Bangkok to identify peak-season revenue opportunities for December. Implemented dynamic pricing, extended-stay discounts, and last-minute deals. These optimizations increased total December revenue by **7.6%**, generating an additional **฿3.9 million** in high-demand areas.

**Technologies:** Python, Pandas, Data Viz, Analytics

**Metrics:** +7.6% Revenue | +฿3.9M

**Links:**
- Repository: https://github.com/Shiverion/AirBnB-Data-Analysis

**Case Study:**
- **Problem:** Airbnb hosts in Bangkok were missing peak-season revenue opportunities due to static pricing strategies.
- **Approach:** Analyzed listing data to identify high-demand areas and optimal pricing windows. Developed dynamic pricing, extended-stay discounts, and last-minute deal strategies.
- **Results:** Projected 7.6% increase in December revenue (฿3.9 million) through data-driven pricing recommendations for high-demand Bangkok neighborhoods.

---

## Filter Categories

| Filter | Keywords |
|--------|----------|
| **Full Stack** | Next.js, FastAPI, React, Tauri, Cloud Run, Docker, AWS Lambda |
| **AI / ML** | OpenAI, RAG, LangChain, NLP, Multi-Agent, OpenAI SDK, Gemini AI, PyTorch, TensorFlow.js, ResNet18 |
| **Data Science** | Python, Pandas, Scikit-learn, XGBoost, Analytics, Data Viz, Captum, Astropy |
| **Cloud / Web** | Azure, GCP, HuggingFace, Semgrep, SQL, Firestore, SQLite |

---

## Project Sorting

Projects are automatically sorted by:
1. **Complexity** (descending) - Full-stack multi-agent systems first
2. **Date** (descending) - Most recent first

---

*Last updated: December 2025*
