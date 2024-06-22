import unittest

def run_tests():
    loader = unittest.TestLoader()
    test_suite = loader.discover(start_dir="tests")
    runner = unittest.TextTestRunner()
    runner.run(test_suite)