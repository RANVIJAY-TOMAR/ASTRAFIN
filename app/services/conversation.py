from __future__ import annotations

import os
import random
from typing import Dict, List, Optional

from openai import OpenAI
from openai import APIError as OpenAIError

from app.data.loan_products import LOAN_PRODUCTS, LoanProduct, list_products


class ConversationEngine:
    """Orchestrates chatbot conversations about loans."""

    def __init__(self) -> None:
        self._client: Optional[OpenAI] = None
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self._client = OpenAI(api_key=api_key)

    def available_products(self) -> List[Dict[str, object]]:
        return list_products()

    def suggest_products(self, message: str) -> List[LoanProduct]:
        lowered = message.lower()
        suggestions: List[LoanProduct] = []

        if any(keyword in lowered for keyword in ["home", "house", "mortgage"]):
            suggestions.append(LOAN_PRODUCTS["home_plus"])
        if any(keyword in lowered for keyword in ["car", "vehicle", "auto"]):
            suggestions.append(LOAN_PRODUCTS["auto_express"])
        if any(keyword in lowered for keyword in ["business", "company", "startup"]):
            suggestions.append(LOAN_PRODUCTS["biz_growth"])
        if any(keyword in lowered for keyword in ["debt", "consolidate", "credit card"]):
            suggestions.append(LOAN_PRODUCTS["debt_relief"])
        if any(keyword in lowered for keyword in ["school", "college", "education", "study"]):
            suggestions.append(LOAN_PRODUCTS["edu_future"])

        if not suggestions:
            suggestions = list(LOAN_PRODUCTS.values())[:3]

        return suggestions

    def _get_conversation_stage(self, conversation: List[Dict[str, str]], message: str) -> str:
        """Determine what stage of the conversation we're in."""
        if len(conversation) == 0:
            return "initial_greeting"
        
        # Count messages to determine stage
        message_count = len([m for m in conversation if m.get("role") == "user"])
        
        # Check if they've mentioned loan-related terms
        lowered = message.lower()
        loan_keywords = ["loan", "borrow", "finance", "mortgage", "credit", "debt", "rate", "interest", "home", "car", "business", "education"]
        has_loan_intent = any(keyword in lowered for keyword in loan_keywords)
        
        # Check conversation history for loan mentions
        conversation_text = " ".join([m.get("content", "").lower() for m in conversation])
        has_mentioned_loans = any(keyword in conversation_text for keyword in loan_keywords)
        
        if message_count <= 2 and not has_loan_intent and not has_mentioned_loans:
            return "rapport_building"
        elif has_loan_intent or has_mentioned_loans:
            return "loan_discussion"
        elif message_count <= 4:
            return "transitioning"
        else:
            return "loan_discussion"

    def respond(self, message: str, conversation: List[Dict[str, str]]) -> Dict[str, object]:
        """Return a chatbot response."""

        stage = self._get_conversation_stage(conversation, message)
        loan_suggestions = self.suggest_products(message) if stage == "loan_discussion" else []
        mood = self._detect_emotion(message)
        
        ai_reply = self._attempt_llm_response(message, conversation, loan_suggestions, stage)

        if not ai_reply:
            ai_reply = self._fallback_response(message, loan_suggestions, stage, conversation, mood)

        return {
            "reply": ai_reply,
            "suggestions": [loan.to_dict() for loan in loan_suggestions],
        }

    def _attempt_llm_response(
        self,
        message: str,
        conversation: List[Dict[str, str]],
        suggestions: List[LoanProduct],
        stage: str,
    ) -> Optional[str]:
        if not self._client:
            return None

        # Stage-specific prompts for relationship building
        if stage == "initial_greeting":
            system_prompt = """You are Astra, a friendly and personable loan advisor at AstraFin. You're like a trusted friend who happens to work in finance.

CRITICAL: This is the FIRST message. DO NOT mention loans, financing, or anything business-related yet. Just be warm and friendly.

Your approach:
- Greet them warmly and naturally (like you just met at a coffee shop)
- Ask how their day is going or make a friendly observation
- Show genuine interest in them as a person
- Keep it light, casual, and human
- Use natural language with contractions
- Maybe ask what brought them here today (but don't assume it's about loans)
- Keep it under 80 words
- Be genuinely curious about them

Example tone: "Hey! Thanks for stopping by. How's your day going? 😊" or "Hi there! Nice to meet you. What brings you here today?"""
        
        elif stage == "rapport_building":
            system_prompt = """You are Astra, a friendly loan advisor at AstraFin. You're building a relationship first, like a good salesperson.

CRITICAL: DO NOT jump into loans yet. Build rapport and connection first.

Your approach:
- Show genuine interest in what they're saying
- Ask follow-up questions about their life, goals, or situation
- Share a bit about yourself if it feels natural (but keep it brief)
- Find common ground or things to relate to
- Make them feel heard and understood
- Keep it conversational and friendly
- Use phrases like "That's interesting!", "Tell me more about that", "I can relate to that"
- Only mention loans if THEY bring it up first
- Keep responses under 100 words

Remember: People buy from people they like. Build the relationship first."""
        
        elif stage == "transitioning":
            system_prompt = """You are Astra, a friendly loan advisor at AstraFin. You're naturally transitioning from getting to know them to understanding their financial needs.

Your approach:
- Acknowledge what they've shared about themselves
- Gently ask about their goals or what they're looking to accomplish
- Still be warm and personal, but start exploring their needs
- Use phrases like "So what are you hoping to achieve?", "What's your situation like?", "I'm curious - what brought you here today?"
- Don't push too hard - let them guide the conversation
- If they mention financial goals, show interest and ask follow-up questions
- Keep it natural and conversational (under 120 words)"""
        
        else:  # loan_discussion
            system_prompt = """You are Astra, a friendly and empathetic loan advisor at AstraFin. You've built rapport, now you're helping them with their financial needs.

Your personality:
- Warm, approachable, and conversational (like talking to a trusted friend)
- Use natural language, occasional contractions (I'm, you're, that's), and varied sentence lengths
- Show empathy and understanding - acknowledge their situation
- Ask thoughtful follow-up questions to understand their needs better
- Be encouraging and supportive, especially if they seem uncertain
- Use casual phrases like "I get it", "That makes sense", "Here's the thing", "You know what"
- Occasionally use emojis sparingly (😊 👍 💡) but don't overdo it
- Keep responses conversational and under 150 words
- Never sound robotic or use corporate jargon

Important guidelines:
- Always be transparent that final approval depends on underwriting
- Don't make promises about approval or rates
- Focus on understanding their needs first, then suggest options
- If they seem stressed or worried, acknowledge it and be reassuring
- Match their energy level - if they're casual, be casual; if formal, be professional but still warm"""

        # Only include loan products if we're in loan discussion stage
        context_content = ""
        if stage == "loan_discussion" and suggestions:
            suggestion_summary = "\n".join(
                f"• {loan.name}: {loan.description} Interest rates start at {loan.interest_rate}% "
                f"with terms ranging from {min(loan.term_months)} to {max(loan.term_months)} months. "
                f"Loan amounts: ${loan.min_amount:,} to ${loan.max_amount:,}"
                for loan in suggestions
            )
            context_content = f"""Available loan products you can discuss:
{suggestion_summary}

"""
        
        # Build conversation context
        if len(conversation) > 0:
            recent_context = conversation[-5:] if len(conversation) >= 5 else conversation
            context_content += "\nRecent conversation context:\n"
            for msg in recent_context:
                role_label = "Customer" if msg.get("role") == "user" else "You"
                context_content += f"{role_label}: {msg.get('content', '')}\n"
        
        # Add stage-specific reminders
        if stage == "rapport_building":
            context_content += "\nREMINDER: You're in rapport-building stage. DO NOT mention loans yet. Just be friendly and get to know them."
        elif stage == "transitioning":
            context_content += "\nREMINDER: You're transitioning. Gently explore their needs but don't push. Let them guide the conversation."

        messages = [
            {"role": "system", "content": system_prompt},
        ]
        
        if context_content.strip():
            messages.append({
                "role": "system",
                "content": context_content.strip()
            })
        
        # Add conversation history (last 10 messages for context)
        messages.extend(conversation[-10:])
        messages.append({"role": "user", "content": message})

        try:
            completion = self._client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.85,  # Higher temperature for more natural, varied responses
                max_tokens=350,  # Increased for more natural conversation
                presence_penalty=0.3,  # Encourage variety in responses
                frequency_penalty=0.2,  # Reduce repetition
            )
        except OpenAIError:
            return None

        response = completion.choices[0].message.content if completion.choices else None
        
        # Post-process to ensure human-like quality
        if response:
            response = self._humanize_response(response)
        
        return response
    
    def _humanize_response(self, response: str) -> str:
        """Post-process AI response to make it more human-like."""
        # Remove overly formal patterns
        response = response.replace("I understand that", "I get that")
        response = response.replace("I would like to", "I'd like to")
        response = response.replace("I am", "I'm")
        response = response.replace("you are", "you're")
        response = response.replace("it is", "it's")
        response = response.replace("that is", "that's")
        response = response.replace("do not", "don't")
        response = response.replace("cannot", "can't")
        response = response.replace("will not", "won't")
        
        # Ensure it doesn't end too formally
        if response.endswith(".") and len(response.split()) > 20:
            # For longer responses, sometimes end with a question or casual phrase
            pass
        
        return response.strip()

    def _fallback_response(
        self,
        message: str,
        suggestions: List[LoanProduct],
        stage: str,
        conversation: List[Dict[str, str]],
        mood: str,
    ) -> str:
        lowered = message.lower()
        message_count = len([m for m in conversation if m.get("role") == "user"])
        empathy_prefix = self._empathy_prefix(mood)
        
        # Stage-based responses
        if stage == "initial_greeting":
            greetings = [
                "Hey there! 😊 Thanks for stopping by. How's your day going?",
                "Hi! Nice to meet you. What brings you here today?",
                "Hey! Welcome. How are you doing today?",
                "Hi there! Great to have you here. What's on your mind?",
            ]
            response = random.choice(greetings)
            response = self._wrap_with_empathy(empathy_prefix, response)
            return self._add_soft_closing(response, stage)
        
        elif stage == "rapport_building":
            # Build rapport - ask personal questions, show interest
            if message_count == 1:
                response = "That's great to hear! Tell me a bit more about yourself - what do you do, or what are you passionate about? 😊"
            elif message_count == 2:
                response = "I love that! So what are you hoping to accomplish? Any big plans or goals you're working towards?"
            else:
                response = "That sounds really interesting! I'm curious - what made you reach out today? Is there something specific you're looking to achieve?"
            response = self._wrap_with_empathy(empathy_prefix, response)
            return self._add_soft_closing(response, stage)
        
        elif stage == "transitioning":
            # Gently transition to understanding their needs
            if any(word in lowered for word in ["goal", "want", "need", "looking", "hoping"]):
                response = "That's awesome! I'd love to help you with that. Can you tell me a bit more about what you're thinking? What's your situation like?"
            else:
                response = "Got it! So what are you hoping to accomplish? I'm here to help figure out the best way forward for you."
            response = self._wrap_with_empathy(empathy_prefix, response)
            return self._add_soft_closing(response, stage)
        
        else:  # loan_discussion
            # Now we can discuss loans
            if any(word in lowered for word in ["rate", "interest", "cost", "price", "how much"]):
                intro = "Great question! Let me break down the rates for you - it really depends on what type of loan you're interested in."
            elif any(word in lowered for word in ["urgent", "quick", "soon", "asap", "fast"]):
                intro = "I totally get that you need this sorted quickly! Let's find something that works for your timeline."
            else:
                intro = "Perfect! I'd love to help you find financing that actually fits your situation."
            
            intro = self._wrap_with_empathy(empathy_prefix, intro)
            lines = [intro]
            
            if suggestions:
                lines.append("\nHere are a few options that might work for you:")
                for loan in suggestions[:3]:
                    lines.append(
                        f"• {loan.name} - {loan.description} Rates start around {loan.interest_rate}% with terms up to {max(loan.term_months)} months."
                    )

            # Natural follow-up question
            if any(word in lowered for word in ["home", "house", "mortgage"]):
                follow_up = "What's your target loan amount? And are you thinking about a fixed or variable rate?"
            elif any(word in lowered for word in ["car", "vehicle", "auto"]):
                follow_up = "What kind of vehicle are you looking at? And what's your budget range?"
            elif any(word in lowered for word in ["business", "company"]):
                follow_up = "Tell me a bit more about your business - how long have you been operating, and what do you need the funds for?"
            else:
                follow_up = "What's the loan amount you're thinking about? And what's your timeline for getting this sorted?"

            lines.append(f"\n{follow_up}")
            lines.append("\nJust so you know - final approval and rates depend on a full application review, but I'm here to guide you through everything! 👍")

            response = "\n\n".join(lines)
            return self._add_soft_closing(response, stage)

    def _detect_emotion(self, message: str) -> str:
        lowered = message.lower()
        mood_keywords = {
            "stressed": ["worried", "stressed", "anxious", "overwhelmed", "nervous", "unsure", "confused"],
            "excited": ["excited", "thrilled", "can't wait", "pumped", "stoked"],
            "urgent": ["urgent", "asap", "deadline", "rush", "quick", "soon"],
            "celebratory": ["celebrate", "milestone", "wedding", "baby", "graduation", "anniversary"],
        }
        for mood, keywords in mood_keywords.items():
            if any(keyword in lowered for keyword in keywords):
                return mood
        if "?" in message and not any(keyword in lowered for keyword in ["loan", "rate", "interest"]):
            return "curious"
        return "neutral"

    def _empathy_prefix(self, mood: str) -> str:
        phrases = {
            "stressed": [
                "I hear you — let's take this one step at a time.",
                "Totally understand that this can feel heavy.",
            ],
            "urgent": [
                "Got it, speed matters here.",
                "I feel the clock with you, so let's move quickly.",
            ],
            "excited": [
                "Love the energy you're bringing!",
                "I can feel your excitement from here!",
            ],
            "celebratory": [
                "Congratulations on the milestone!",
                "That's such a special moment — thanks for sharing it with me.",
            ],
            "curious": [
                "Great questions — I appreciate your curiosity.",
                "Love that you're digging in with thoughtful questions.",
            ],
        }
        if mood in phrases:
            return random.choice(phrases[mood])
        return ""

    def _wrap_with_empathy(self, prefix: str, text: str) -> str:
        if not prefix:
            return text
        if text.lower().startswith(prefix.lower()):
            return text
        return f"{prefix} {text}".strip()

    def _add_soft_closing(self, text: str, stage: str) -> str:
        stripped = text.strip()
        if not stripped or stripped.endswith(("?", "!", "…")):
            # Already ends with strong punctuation or question
            return stripped
        closers_map = {
            "initial_greeting": [
                "How's the day treating you so far?",
                "Happy to chat whenever you're ready.",
            ],
            "rapport_building": [
                "Tell me whatever feels most relevant.",
                "I'm all ears if you want to share more.",
            ],
            "transitioning": [
                "What details feel most important to you right now?",
                "Where would you like to start?",
            ],
            "loan_discussion": [
                "Does that line up with what you'd need?",
                "How does that feel compared to what you were imagining?",
                "Want me to dig into numbers next?",
            ],
        }
        closers = closers_map.get(stage, ["What else is on your mind?"])
        closer = random.choice(closers)
        if "\n\n" in stripped:
            return f"{stripped}\n\n{closer}"
        return f"{stripped} {closer}"

