from __future__ import annotations

import unittest

from scrapers.directory_sites import DirectorySiteScraper


class DirectoryCandidateTests(unittest.TestCase):
    def setUp(self):
        self.scraper = DirectorySiteScraper()

    def test_prioritizes_group_and_filters_utility_paths(self):
        html = """
        <html>
          <body>
            <a href="/login">Entrar</a>
            <a href="/termos">Termos</a>
            <a href="/group/som-automotivo-rj">Grupo principal</a>
            <form action="/join-group-verify/12345"></form>
            <script>
              var fallbackHref = "/group/f88674e6-4130-46d7-a80b-fcb54cd0d680/join";
            </script>
          </body>
        </html>
        """
        urls = self.scraper._extract_candidate_urls(
            html=html,
            base_url="https://example.com/?s=som+automotivo",
            domain="example.com",
            keyword="Som automotivo",
        )
        self.assertTrue(urls)
        self.assertIn("https://example.com/group/som-automotivo-rj", urls)
        self.assertNotIn("https://example.com/login", urls)
        self.assertNotIn("https://example.com/termos", urls)


if __name__ == "__main__":
    unittest.main()

