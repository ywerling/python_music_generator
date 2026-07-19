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
        self.assertIn(b"Open brown noise", response.data)
        self.assertIn(b'href="/brown-noise"', response.data)
        self.assertIn(b"Open pink noise", response.data)
        self.assertIn(b'href="/pink-noise"', response.data)
        self.assertIn(b"Hear night rain", response.data)
        self.assertIn(b'href="/night-rain"', response.data)
        self.assertIn(b"Meditation bowls", response.data)
        self.assertIn(b'href="/meditation-bowls"', response.data)

    def test_white_noise_page_contains_controls(self):
        response = self.client.get("/white-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)

    def test_brown_noise_page_contains_controls(self):
        response = self.client.get("/brown-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)

    def test_pink_noise_page_contains_controls(self):
        response = self.client.get("/pink-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)

    def test_blue_noise_page_contains_controls(self):
        response = self.client.get("/blue-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)

    def test_violet_noise_page_contains_controls(self):
        response = self.client.get("/violet-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)
    def test_green_noise_page_contains_controls(self):
        response = self.client.get("/green-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)
    def test_grey_noise_page_contains_controls(self):
        response = self.client.get("/grey-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)
    def test_black_noise_page_contains_controls(self):
        response = self.client.get("/black-noise")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleNoise"', response.data)
        self.assertIn(b'id="volume"', response.data)


    def test_night_rain_page_contains_controls(self):
        response = self.client.get("/night-rain")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleRain"', response.data)
        self.assertIn(b'id="rainVolume"', response.data)

    def test_meditation_bowls_page_contains_controls(self):
        response = self.client.get("/meditation-bowls")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="toggleMeditation"', response.data)
        self.assertIn(b'id="meditationVolume"', response.data)


if __name__ == "__main__":
    unittest.main()
