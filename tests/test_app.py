import unittest

from app import app


class AppRoutesTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_landing_page_links_to_white_noise(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Open white noise", response.data)
        self.assertIn(b'href="/white-noise"', response.data)

    def test_white_noise_page_contains_controls(self):
        response = self.client.get("/white-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)


if __name__ == "__main__":
    unittest.main()
