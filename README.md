# AI Interviewer

AI Interviewer is a React application that uses OpenRouter's AI capabilities to conduct and evaluate interviews on any topic. The application simulates a real interview experience by asking questions, evaluating answers, and providing a final assessment.

## Features

- Enter any interview topic and get AI-generated questions
- Answer questions in a conversational interface
- Receive immediate feedback and evaluation on each answer
- Complete a 10-question interview session
- Get a comprehensive evaluation with scores and recommendations

## Technologies Used

- React with Vite for frontend development
- Material UI for component library
- React Router for navigation
- OpenRouter API for AI-powered interview questions and evaluations
- Structured JSON output for consistent AI responses

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenRouter API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-interviewer.git
cd ai-interviewer
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Copy the `.env.example` file to `.env` and add your OpenRouter API key:

```bash
cp .env.example .env
```

Then edit the `.env` file and replace `your_openrouter_api_key_here` with your actual API key.

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter an interview topic (e.g., "JavaScript Development", "Data Science", "Product Management")
2. Click "Start Interview" to begin
3. Answer each question in the text area provided
4. Review the AI's evaluation of your answer
5. Continue until all 10 questions are completed
6. Review your final evaluation and score

## License

This project is licensed under the MIT License - see the LICENSE file for details.
