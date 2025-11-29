from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class LoanProduct:
    """Represents a loan product that can be offered to a customer."""

    id: str
    name: str
    description: str
    min_amount: int
    max_amount: int
    interest_rate: float
    term_months: List[int]
    eligibility: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, object]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "min_amount": self.min_amount,
            "max_amount": self.max_amount,
            "interest_rate": self.interest_rate,
            "term_months": self.term_months,
            "eligibility": self.eligibility,
        }


LOAN_PRODUCTS: Dict[str, LoanProduct] = {
    "home_plus": LoanProduct(
        id="home_plus",
        name="HomePlus Mortgage",
        description=(
            "Flexible home loan with competitive fixed and variable rate options, "
            "ideal for first-time buyers and upgraders."
        ),
        min_amount=50000,
        max_amount=750000,
        interest_rate=6.25,
        term_months=[120, 180, 240, 360],
        eligibility=[
            "Minimum credit score 670",
            "Stable employment history",
            "Debt-to-income ratio below 45%",
        ],
    ),
    "auto_express": LoanProduct(
        id="auto_express",
        name="AutoExpress Loan",
        description=(
            "Quick approval car loan with low down payment and flexible terms for new and used vehicles."
        ),
        min_amount=5000,
        max_amount=80000,
        interest_rate=5.1,
        term_months=[36, 48, 60, 72],
        eligibility=[
            "Credit score 630+",
            "Vehicle not older than 7 years",
            "Proof of insurance",
        ],
    ),
    "biz_growth": LoanProduct(
        id="biz_growth",
        name="BizGrowth Line",
        description=(
            "Revolving line of credit for small businesses covering working capital and expansion needs."
        ),
        min_amount=10000,
        max_amount=250000,
        interest_rate=8.9,
        term_months=[12, 24, 36, 48],
        eligibility=[
            "2+ years operating history",
            "Annual revenue above $120k",
            "Business credit score 70+",
        ],
    ),
    "debt_relief": LoanProduct(
        id="debt_relief",
        name="DebtRelief Consolidation",
        description=(
            "Personal loan designed to consolidate multiple debts into a single manageable payment."
        ),
        min_amount=3000,
        max_amount=60000,
        interest_rate=7.4,
        term_months=[24, 36, 48, 60],
        eligibility=[
            "Credit score 650+",
            "No bankruptcies in last 3 years",
            "Proof of employment",
        ],
    ),
    "edu_future": LoanProduct(
        id="edu_future",
        name="EduFuture Loan",
        description=(
            "Education financing for undergraduate and postgraduate programs with grace periods."
        ),
        min_amount=2000,
        max_amount=120000,
        interest_rate=4.8,
        term_months=[48, 72, 96, 144],
        eligibility=[
            "Enrollment proof",
            "Co-signer for applicants with limited credit",
            "Flexible repayment grace period",
        ],
    ),
}


def list_products() -> List[Dict[str, object]]:
    return [product.to_dict() for product in LOAN_PRODUCTS.values()]


def get_product(product_id: str) -> LoanProduct | None:
    return LOAN_PRODUCTS.get(product_id)

