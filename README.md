# AstraFin Loan Advisor

Human-like AI chatbot that educates customers about AstraFin loan products and guides them toward the right offer.

## Features

- Conversational FastAPI backend with optional OpenAI integration.
- Knowledge base of multiple loan products with eligibility details.
- Smart suggestion engine that tailors products to user intent.
- Modern web UI with real-time chat, product cards, and status indicators.

## Getting Started

### Prerequisites

- Python 3.11+
- Node/npm (optional) if you plan to extend the front-end build tooling.

### Setup

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create a `.env` file to enable AI-powered human-like conversations:

```bash
OPENAI_API_KEY=sk-...
```

**AI Features:**
- Powered by OpenAI GPT-4o-mini for natural, human-like conversations
- Empathetic and conversational responses (not robotic!)
- Context-aware - remembers recent conversation
- Natural language with contractions and casual phrases
- Temperature tuned for varied, authentic responses

Without an API key, Astra will use intelligent fallback responses that are still warm and human-like.

### Run the App

```bash
uvicorn app.main:app --reload
```

Then open `http://127.0.0.1:8000` in your browser.

## Project Structure

```
app/
  data/            # Loan product catalog
  models/          # Pydantic request/response schemas
  routes/          # API routes
  services/        # Conversation engine and integrations
  main.py          # FastAPI app entrypoint
static/            # CSS and JS assets for UI
templates/         # Jinja2 templates
```

## Next Steps

- Add persistence for chat sessions.
- Integrate CRM/lead capture APIs.
- Extend LLM prompts with compliance and personalization rules.

