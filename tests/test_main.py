import time
import unittest
from selenium import webdriver
from tests import run_test_app


class MainTestCase(unittest.TestCase):
    def setUp(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument('headless')
        self.client = webdriver.Chrome(options=options)

        if not self.client:
            self.skipTest('Web browser not available.')

    def tearDown(self) -> None:
        if self.client:
            self.client.quit()

    def test_pie(self):
        self.client.get('http://localhost:5000/pie')
        time.sleep(2)
