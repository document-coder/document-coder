import sys
from django.test.runner import DiscoverRunner
import debugpy

class DebugTestRunner(DiscoverRunner):
  def run_failed_tests(self, failed_tests):
    if failed_tests:
      print("\nTest failed! Waiting for debugger to attach...")
      # Stop at the first failure
      # breakpoint()
      return super().run_failed_tests(failed_tests)
    return []

  def run_suite(self, suite, **kwargs):
    result = super().run_suite(suite, **kwargs)
    if not result.wasSuccessful():
      print("\nOne or more tests failed. Starting debugger...")
      # Break into debugger on failure
      # breakpoint()
    return result
