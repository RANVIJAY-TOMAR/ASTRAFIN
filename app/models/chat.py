from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field, constr


Role = constr(to_lower=True, pattern=r"^(user|assistant)$")


class Message(BaseModel):
    role: Role
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    history: List[Message] = Field(default_factory=list)


class Suggestion(BaseModel):
    id: str
    name: str
    description: str
    min_amount: int
    max_amount: int
    interest_rate: float
    term_months: List[int]
    eligibility: List[str]


class ChatResponse(BaseModel):
    reply: str
    suggestions: List[Suggestion]
    source: Optional[str] = None

