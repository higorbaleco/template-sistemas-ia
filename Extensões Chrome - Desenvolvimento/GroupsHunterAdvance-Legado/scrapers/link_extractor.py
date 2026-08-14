"""Utilitários para extração e normalização de links de WhatsApp e Telegram."""

import html
import re
from urllib.parse import parse_qs, unquote_plus, urlparse, urlunparse

from config import WHATSAPP_LINK_PATTERN, TELEGRAM_LINK_PATTERN

_URL_CANDIDATE_PATTERN = re.compile(r"https?://[^\s\"'<>]+", re.IGNORECASE)
_MAX_URL_CANDIDATES = 80


def extract_whatsapp_links(text: str) -> list[str]:
    """Extrai links de grupo WhatsApp de texto bruto e texto codificado."""
    links = []
    for snippet in _expand_search_snippets(text):
        links.extend(_extract_links_by_pattern(snippet, WHATSAPP_LINK_PATTERN))
    return deduplicate_links(links)


def extract_telegram_links(text: str) -> list[str]:
    """Extrai links de grupo/canal Telegram de texto bruto e codificado."""
    links = []
    for snippet in _expand_search_snippets(text):
        links.extend(_extract_links_by_pattern(snippet, TELEGRAM_LINK_PATTERN))
    return deduplicate_links(links)


def extract_all_links(text: str) -> list[str]:
    """Extrai links de WhatsApp e Telegram de um texto."""
    links = extract_whatsapp_links(text) + extract_telegram_links(text)
    return deduplicate_links(links)


def _iter_url_candidates(text: str):
    """Itera sobre URLs encontradas no texto com limite de segurança."""
    count = 0
    for match in _URL_CANDIDATE_PATTERN.finditer(text):
        yield match.group(0)
        count += 1
        if count >= _MAX_URL_CANDIDATES:
            break


def _expand_search_snippets(text: str) -> list[str]:
    """
    Gera variações de texto para capturar links escondidos em:
    - escape de barra (\\/)
    - entidades HTML
    - valores URL-encoded dentro de query params (?u=https%3A%2F%2F...)
    """
    snippets = []
    seen = set()

    def add(value: str):
        value = value.strip()
        if not value or value in seen:
            return
        seen.add(value)
        snippets.append(value)

    for variant in _decode_variants(text):
        add(variant)

    # Extrair e decodificar valores de query params que costumam conter URL real
    for snippet in list(snippets):
        for raw_url in _iter_url_candidates(snippet):
            cleaned_url = html.unescape(raw_url).replace("\\/", "/")
            parsed = urlparse(cleaned_url)
            if not parsed.query:
                continue
            for values in parse_qs(parsed.query, keep_blank_values=False).values():
                for value in values:
                    for decoded in _decode_variants(value):
                        add(decoded)

    return snippets


def _decode_variants(text: str) -> list[str]:
    """Retorna variações úteis de um texto com decodificação segura."""
    variants = []
    seen = set()

    def add(value: str):
        if value in seen:
            return
        seen.add(value)
        variants.append(value)

    add(text)
    html_decoded = html.unescape(text)
    add(html_decoded)
    add(html_decoded.replace("\\/", "/"))

    # Evita custo alto com HTML gigante
    if len(text) > 120_000:
        return variants

    current = html_decoded
    for _ in range(3):
        decoded = unquote_plus(current)
        if decoded == current:
            break
        add(decoded)
        add(decoded.replace("\\/", "/"))
        current = decoded

    return variants


def _extract_links_by_pattern(text: str, pattern: re.Pattern[str]) -> list[str]:
    """Extrai e normaliza links encontrados por um regex pattern."""
    links = []
    for raw in pattern.findall(text):
        normalized = _normalize_link(raw)
        if normalized:
            links.append(normalized)
    return links


def _normalize_link(url: str) -> str:
    """Normaliza link: força https, remove query/fragment e trailing slash."""
    url = url.strip().strip("\"'<>(),.;").replace("\\/", "/")
    if url.startswith("//"):
        url = f"https:{url}"
    if not url.startswith(("http://", "https://")):
        url = f"https://{url.lstrip('/')}"

    parsed = urlparse(url)
    if not parsed.netloc:
        return ""

    clean = urlunparse(
        ("https", parsed.netloc.lower(), parsed.path.rstrip("/"), "", "", "")
    )
    return clean.rstrip("/")


def deduplicate_links(links: list[str]) -> list[str]:
    """Remove duplicatas mantendo a ordem original (case-insensitive)."""
    seen = set()
    result = []
    for link in links:
        key = link.lower()
        if key not in seen:
            seen.add(key)
            result.append(link)
    return result


def classify_link(url: str) -> str:
    """Retorna 'whatsapp', 'telegram' ou 'unknown'."""
    if "chat.whatsapp.com" in url:
        return "whatsapp"
    if "t.me" in url:
        return "telegram"
    return "unknown"
