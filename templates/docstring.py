"""Modelo de docstring de funcao publica.

Regra (CLAUDE.md, secao 9): toda funcao publica declara contrato,
nao implementacao. Uma linha.
"""


def calculate_total(items: list[dict], discount_pct: float = 0.0) -> float:
    """Retorna o valor total dos itens aplicando o desconto percentual informado."""
    subtotal = sum(item["price"] * item["quantity"] for item in items)
    return subtotal * (1 - discount_pct / 100)
