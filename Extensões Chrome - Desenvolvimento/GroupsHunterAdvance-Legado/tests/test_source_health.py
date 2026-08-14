from __future__ import annotations

import tempfile
import unittest

from services.source_health import SourceHealthStore


class SourceHealthStoreTests(unittest.TestCase):
    def test_allocate_pages_prefers_healthier_source(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            filepath = f"{tmpdir}/health.json"
            store = SourceHealthStore(filepath=filepath)
            store.reset()

            # Fonte A degrada por três execuções sem links.
            for _ in range(3):
                store.record_run(
                    source_key="source_a",
                    source_kind="directory",
                    pages_allocated=4,
                    links_found=0,
                    elapsed_ms=3200,
                    blocked_events=1,
                    timeout_events=1,
                    reason="captcha_or_blocked",
                )

            # Fonte B performa melhor.
            for _ in range(2):
                store.record_run(
                    source_key="source_b",
                    source_kind="directory",
                    pages_allocated=4,
                    links_found=10,
                    elapsed_ms=1400,
                    blocked_events=0,
                    timeout_events=0,
                    reason="ok",
                )

            allocation = store.allocate_pages(
                sources=["source_a", "source_b"],
                total_pages=12,
                execution_mode="quality",
            )
            self.assertEqual(sum(allocation.values()), 12)
            self.assertGreater(allocation["source_b"], allocation["source_a"])


if __name__ == "__main__":
    unittest.main()

