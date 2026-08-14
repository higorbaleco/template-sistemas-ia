from __future__ import annotations

import unittest

from validators.link_validator import LinkValidator


class _FakeResponse:
    def __init__(self, status_code: int, text: str):
        self.status_code = status_code
        self.text = text


class LinkValidatorTests(unittest.TestCase):
    def setUp(self):
        self.validator = LinkValidator()

    def test_whatsapp_invalid_reason_code(self):
        response = _FakeResponse(
            200,
            "This invite link is no longer valid",
        )
        result = self.validator._validate_whatsapp(
            "https://chat.whatsapp.com/abc1234567890",
            response,
        )
        self.assertFalse(result["valid"])
        self.assertEqual(result["reason_code"], "expired_or_invalid")

    def test_whatsapp_valid_reason_code(self):
        response = _FakeResponse(
            200,
            "<html><body>Click to join</body></html>",
        )
        result = self.validator._validate_whatsapp(
            "https://chat.whatsapp.com/abc1234567890",
            response,
        )
        self.assertTrue(result["valid"])
        self.assertEqual(result["reason_code"], "active_invite")


if __name__ == "__main__":
    unittest.main()

