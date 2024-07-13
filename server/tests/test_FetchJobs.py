import unittest
from utils.FetchJobs import get_jobs_from_linkedin

class TestFetchJobs(unittest.TestCase):

	def test_get_jobs_from_linkedin(self):
		"""
		Job Postings should be an array of dicts
		Each dict should have the fields:
		 - title
		 - company
		 - location
		 - link
		 - description
		 - posting_url
		 - logo_url
		 - salary (can be null)
		 - due_date (can be null)
		 - date_posted
		"""

		job_postings = get_jobs_from_linkedin("Software", "Vancouver")

		for job in job_postings:
			title = job.get('title')
			company = job.get('company')
			location = job.get('location')
			link = job.get('link')
			description = job.get('description')
			posting_url = job.get('posting_url')
			logo_url = job.get('logo.url')
			date_posted = job.get('date_posted')

			self.assertEqual(type(title), str)
			self.assertEqual(type(company), str)
			self.assertEqual(type(location), str)
			self.assertEqual(type(link), str)
			self.assertEqual(type(description), str)
			self.assertEqual(type(posting_url), str)
			self.assertEqual(type(logo_url), str)
			self.assertEqual(type(date_posted), str)
