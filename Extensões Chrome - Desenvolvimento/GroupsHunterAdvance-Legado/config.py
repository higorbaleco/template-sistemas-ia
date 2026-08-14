import re

# ── Regex Patterns ──────────────────────────────────────────────
WHATSAPP_LINK_PATTERN = re.compile(
    r'(?:https?://)?chat\.whatsapp\.com/[A-Za-z0-9]{10,}'
)
TELEGRAM_LINK_PATTERN = re.compile(
    r'(?:https?://)?t\.me/(?:joinchat/)?[A-Za-z0-9_\-]{5,}'
)

# ── Categorias (PT-BR) ─────────────────────────────────────────
CATEGORIES = {
    "personalizado": [],
    "amizade": ["amizade", "amigos", "bate-papo", "conversa"],
    "figurinhas": ["figurinhas", "stickers", "figurinha whatsapp"],
    "vendas": ["vendas", "compra", "venda", "negocio", "loja"],
    "jogos": ["jogos", "games", "gamer", "free fire", "minecraft"],
    "musica": ["musica", "spotify", "playlist", "funk", "sertanejo"],
    "emprego": ["emprego", "vaga", "trabalho", "freela", "freelancer"],
    "educacao": ["educacao", "estudo", "concurso", "enem", "vestibular"],
    "noticias": ["noticias", "news", "informacao", "jornalismo"],
    "tecnologia": ["tecnologia", "programacao", "ti", "dev", "python"],
    "religiao": ["religiao", "igreja", "evangelico", "catolico", "oracao"],
    "esportes": ["esportes", "futebol", "basquete", "corrida", "academia"],
    "humor": ["humor", "memes", "engracado", "piadas", "zoeira"],
    "namoro": ["namoro", "relacionamento", "paquera", "solteiros"],
    "culinaria": ["culinaria", "receitas", "cozinha", "gastronomia"],
    "investimentos": ["investimentos", "acoes", "cripto", "bitcoin", "renda"],
}

# ── Sites Diretório ────────────────────────────────────────────
#
# strategy "search_engine":
#   Busca por resultados do domínio usando motores de busca e extrai
#   links de convite encontrados nas páginas candidatas.
#
# strategy "direct":
#   Varredura direta do site (seed URLs + crawl interno + endpoints join).
#
# strategy "browser":
#   Igual ao direct, porém habilita fallback de renderização dinâmica
#   (browser/jina) para páginas protegidas por JS/anti-bot.
#
# strategy "redirect":
#   Página de busca lista IDs de grupos; o endpoint de join devolve o
#   link real via redirect (302).
#
# strategy "html":
#   Extrai links diretamente do HTML da página de resultados do site.
#
DIRECTORY_SITES = {
    # ── WhatsApp ──
    "grupodewhatsapp.com": {
        "name": "GrupoDeWhatsApp.com",
        "domain": "grupodewhatsapp.com",
        "type": "whatsapp",
        "strategy": "browser",
        "default_enabled": True,
    },
    "gruposwhats.app": {
        "name": "GruposWhats.app",
        "domain": "gruposwhats.app",
        "type": "whatsapp",
        "strategy": "direct",
        "default_enabled": True,
    },
    "gruposdewhatsapp.site": {
        "name": "GruposDeWhatsApp.site",
        "domain": "gruposdewhatsapp.site",
        "type": "whatsapp",
        "strategy": "browser",
        "default_enabled": True,
    },
    "grupos.whats.link": {
        "name": "grupos.whats.link",
        "domain": "grupos.whats.link",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "grupax.com.br": {
        "name": "Grupax",
        "domain": "grupax.com.br",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "gruposbrasil.com.br": {
        "name": "GruposBrasil",
        "domain": "gruposbrasil.com.br",
        "type": "both",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "gruposdewhatss.com.br": {
        "name": "GruposDeWhatss.com.br",
        "domain": "gruposdewhatss.com.br",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "us.gruposwats.com": {
        "name": "US GruposWats",
        "domain": "us.gruposwats.com",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "gruposdewhatss.app": {
        "name": "GruposDeWhatss.app",
        "domain": "gruposdewhatss.app",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "gruposdezap.com.br": {
        "name": "GruposDeZap",
        "domain": "gruposdezap.com.br",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "wgrupos.com": {
        "name": "WGrupos",
        "domain": "wgrupos.com",
        "type": "both",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    # ── Bench (novas fontes) ──
    "grupozap.net.br": {
        "name": "GrupoZap.net.br (bench)",
        "domain": "grupozap.net.br",
        "type": "whatsapp",
        "strategy": "direct",
        "default_enabled": False,
    },
    "gruposwpp.com.br": {
        "name": "GruposWPP.com.br (bench)",
        "domain": "gruposwpp.com.br",
        "type": "whatsapp",
        "strategy": "search_engine",
        "default_enabled": False,
    },
    "gruposbrwhats.com": {
        "name": "GruposBRWhats.com (bench)",
        "domain": "gruposbrwhats.com",
        "type": "whatsapp",
        "strategy": "browser",
        "default_enabled": False,
    },
    # ── Telegram ──
    "grupostelegram.net": {
        "name": "GruposTelegram.net",
        "domain": "grupostelegram.net",
        "type": "telegram",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    "telegrupos.com.br": {
        "name": "TeleGrupos",
        "domain": "telegrupos.com.br",
        "type": "telegram",
        "strategy": "search_engine",
        "default_enabled": True,
    },
    # ── Adulto (+18) ──
    "grupoporno.com": {
        "name": "GrupoPorno.com",
        "domain": "grupoporno.com",
        "type": "both",
        "strategy": "search_engine",
        "default_enabled": False,
        "adult_only": True,
    },
    "gruposputariatelegram.com": {
        "name": "GruposPutariaTelegram.com",
        "domain": "gruposputariatelegram.com",
        "type": "telegram",
        "strategy": "search_engine",
        "default_enabled": False,
        "adult_only": True,
    },
}

ADULT_DIRECTORY_SITES = {
    key for key, value in DIRECTORY_SITES.items()
    if value.get("adult_only")
}

# ── Google Dork Queries por Rede Social ────────────────────────
SOCIAL_MEDIA_QUERIES = {
    "facebook": 'site:facebook.com "{link_domain}" {keyword}',
    "reddit": 'site:reddit.com "{link_domain}" {keyword}',
    "x": 'site:x.com "{link_domain}" {keyword}',
    "twitter": 'site:twitter.com "{link_domain}" {keyword}',
    "linkedin": 'site:linkedin.com "{link_domain}" {keyword}',
    "instagram": 'site:instagram.com "{link_domain}" {keyword}',
    "pinterest": 'site:pinterest.com "{link_domain}" {keyword}',
    "youtube": 'site:youtube.com "{link_domain}" {keyword}',
    "tiktok": 'site:tiktok.com "{link_domain}" {keyword}',
}

SOCIAL_MEDIA_LABELS = {
    "facebook": "Facebook",
    "reddit": "Reddit",
    "x": "X",
    "twitter": "Twitter / X",
    "linkedin": "LinkedIn",
    "instagram": "Instagram",
    "pinterest": "Pinterest",
    "youtube": "YouTube",
    "tiktok": "TikTok",
}

# ── Execução adaptativa ──────────────────────────────────────────
DEFAULT_EXECUTION_MODE = "balanced"
EXECUTION_MODES = {
    "quality": {
        "label": "Qualidade",
        "min_pages_per_source": 1,
        "max_pages_per_source": 160,
        "health_weight_power": 1.35,
        "retry_unknown": True,
    },
    "balanced": {
        "label": "Balanceado",
        "min_pages_per_source": 1,
        "max_pages_per_source": 120,
        "health_weight_power": 1.0,
        "retry_unknown": True,
    },
    "speed": {
        "label": "Velocidade",
        "min_pages_per_source": 1,
        "max_pages_per_source": 80,
        "health_weight_power": 0.75,
        "retry_unknown": False,
    },
}

# ── Saúde de fontes ──────────────────────────────────────────────
SOURCE_HEALTH_FILE = ".run/source_health.json"
SOURCE_DEPRIORITIZE_ZERO_STREAK = 3
SOURCE_DEPRIORITIZE_COOLDOWN_MINUTES = 45

# ── Fallback browser seletivo ────────────────────────────────────
BROWSER_FALLBACK_ALLOWLIST = {
    "grupodewhatsapp.com",
    "gruposwhats.app",
    "gruposdewhatsapp.site",
    "gruposbrwhats.com",
}
BROWSER_FALLBACK_MAX_SECONDS_PER_SITE = 25
BROWSER_FALLBACK_MAX_TOTAL_SECONDS = 70
BROWSER_FALLBACK_MAX_PAGES = 4

# ── Rate Limiting ──────────────────────────────────────────────
REQUEST_DELAY_MIN = 0.35
REQUEST_DELAY_MAX = 0.95
GOOGLE_DELAY_MIN = 0.6
GOOGLE_DELAY_MAX = 1.5
MAX_WORKERS = 5
VALIDATION_WORKERS = 16
REQUEST_TIMEOUT = 15
MAX_PAGES = 1000
DEFAULT_PAGES = 10
PAGES_STEP = 10
MAX_GOOGLE_QUERIES = 120
