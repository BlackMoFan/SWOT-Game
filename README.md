# SWOT Simulation Game

## Overview

The **SWOT Simulation Game** is an interactive web-based platform designed to facilitate negotiation and collaboration between two teams: the **Business Development** team and the **Risk Management** team. The game is based on SWOT (Strengths, Weaknesses, Opportunities, and Threats) analysis and is structured into two stages:

1. **Analysis and Due Diligence**: Teams input and evaluate SWOT factors.
2. **Structuring**: Teams negotiate and finalize scores collaboratively.

This platform is ideal for educational purposes, team-building exercises, and strategic decision-making simulations.

> ## Note on Backend Usage
>
> Currently, this project does not utilize the backend part, although it is the intended design. For testing purposes only, we are using `localStorage` to store and manage data. The backend implementation is planned for future development to handle data persistence and API requests.

---

## Features

### **Two-Stage Gameplay**

- **Stage 1**:
  - Teams independently input their SWOT factors and assign scores.
  - Each team provides reasons for their scores to justify their analysis.
- **Stage 2**:
  - Teams collaborate and negotiate to finalize scores.
  - Includes approval workflows for both teams to agree on the final decisions.

### **User Interface**

- **Left Menu Bar**: Provides easy navigation and access to game instructions.
- **Main Simulation Interface**: Allows teams to input scores, reasons, and view progress.
- **Modal Windows**: Displays additional information, hints, and finalization options.

### **Data Management**

- **Document Sharing**: Risk Management team can upload and share documents for review.
- **Local Storage**: Inputs are stored locally or in a mock database for testing purposes.
- **Approval System**: Tracks and manages team approvals for finalizing negotiations.

### **Real-Time Feedback**

- Displays average scores for SWOT factors.
- Provides visual indicators for team progress and approvals.

---

## Technologies Used

### **Frontend**

- **React**: For building the user interface.
- **Tailwind CSS**: For styling and responsive design.
- **Zustand**: For state management.

### **Backend**

- **Flask**: For handling API requests and backend logic.
- **PostgreSQL**: For database management.
- **SQLAlchemy**: For ORM (Object-Relational Mapping).

---

## Setup Instructions

### **Prerequisites**

- **Frontend**:
  - Node.js and npm installed.
- **Backend**:
  - Python (3.8 or higher) and pip installed.
  - PostgreSQL installed and running.

---

### **Backend Setup (NOT USED)**

1. Navigate to the [`backend`](backend) directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the database:
   - Create a PostgreSQL database.
   - Update the `.env` file with your database credentials:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/database_name
     ```
4. Run the Flask application:
   ```bash
   python app.py
   ```

---

### **Frontend Setup**

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm run dev
   ```

---

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Log in either as **Business Development** team or the **Risk Management**
3. Follow the on-screen instructions to:
   - Input SWOT factors and scores in **Stage 1**.
   - Collaborate and negotiate in **Stage 2**.
4. Finalize the negotiation once both teams approve the scores.

---

## What to Expect

- **Interactive Gameplay**: Engage in a structured negotiation process with clear roles and responsibilities.
- **Real-Time Feedback**: View average scores and progress indicators for both teams.
- **Collaborative Decision-Making**: Work together to finalize SWOT scores and reach a consensus.
- **Educational Value**: Learn about SWOT analysis and negotiation strategies in a hands-on environment.

---

## Project Structure

```
swot-simulation-game/
├── backend/                # Backend code (Flask, PostgreSQL)
│   ├── app.py              # Main Flask application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
├── frontend/               # Frontend code (React, Tailwind CSS)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page-level components
│   │   └── state/          # Zustand state management
├── README.md               # Project documentation
├── .gitignore              # Git ignore file
└── LICENSE                 # License file
```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork:
   ```bash
   git commit -m "Add feature-name"
   git push origin feature-name
   ```
4. Submit a pull request for review.

---
