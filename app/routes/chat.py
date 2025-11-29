from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.models.chat import ChatRequest, ChatResponse
from app.services.conversation import ConversationEngine


router = APIRouter(prefix="/api/chat", tags=["chat"])


def get_engine() -> ConversationEngine:
    return ConversationEngine()


@router.post("/respond", response_model=ChatResponse)
async def chat_respond(
    payload: ChatRequest, engine: ConversationEngine = Depends(get_engine)
) -> ChatResponse:
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    conversation = [message.model_dump() for message in payload.history]
    result = engine.respond(payload.message, conversation)

    return ChatResponse(**result, source="llm" if engine._client else "rule")

