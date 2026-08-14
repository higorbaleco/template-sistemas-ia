"""Rate limiter por domínio (thread-safe) com delays randomizados."""

import time
import random
import threading
from urllib.parse import urlparse

from config import REQUEST_DELAY_MIN, REQUEST_DELAY_MAX


class RateLimiter:
    """Controla o intervalo entre requests ao mesmo domínio."""

    def __init__(self, delay_min: float = REQUEST_DELAY_MIN,
                 delay_max: float = REQUEST_DELAY_MAX):
        self._delay_min = delay_min
        self._delay_max = delay_max
        self._timestamps: dict[str, float] = {}
        self._locks: dict[str, threading.Lock] = {}
        self._global_lock = threading.Lock()

    def _get_lock(self, domain: str) -> threading.Lock:
        with self._global_lock:
            if domain not in self._locks:
                self._locks[domain] = threading.Lock()
            return self._locks[domain]

    def wait(self, url: str) -> None:
        """Bloqueia até ser seguro fazer request para o domínio."""
        domain = urlparse(url).netloc
        lock = self._get_lock(domain)

        with lock:
            now = time.time()
            last = self._timestamps.get(domain, 0)
            delay = random.uniform(self._delay_min, self._delay_max)
            elapsed = now - last
            if elapsed < delay:
                time.sleep(delay - elapsed)
            self._timestamps[domain] = time.time()

    def wait_domain(self, domain: str) -> None:
        """Bloqueia até ser seguro fazer request para o domínio (por nome)."""
        lock = self._get_lock(domain)

        with lock:
            now = time.time()
            last = self._timestamps.get(domain, 0)
            delay = random.uniform(self._delay_min, self._delay_max)
            elapsed = now - last
            if elapsed < delay:
                time.sleep(delay - elapsed)
            self._timestamps[domain] = time.time()
