from flask import request, jsonify
from flask import Blueprint, send_from_directory
import os
from services import get_linkedin_jobs
from services import GPT_feedback
from services import resume_relevance

main_blueprint = Blueprint('main', __name__, static_folder='../../skillsync-client/dist')

@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')
def serve(path='index.html'):
	static_folder = main_blueprint.static_folder
	if path != "" and os.path.exists(os.path.join(static_folder, path)):
		return send_from_directory(static_folder, path)
	else:
		return send_from_directory(static_folder, 'index.html')

@main_blueprint.route('/api/linkedin-jobs', methods=['POST'])
def linkedin_jobs():
	"""
	Fetches 3 jobs from LinkedIn and returns the successfully fetched jobs.

	Post Request Requirements:
		- Content-Type: application/json
		- Body: json object with the fields 'keywords' and 'location'
				{ "keywords": "Software", "location": "Canada" }
	Returns:
		- A list of 0-3 job postings or error
		  [ {'title': 'Dev', ...}, {'title': 'PenTest', ...} ]
		  { "message": "Invalid Content-Type" }
	"""
	if request.headers.get('Content-Type') != 'application/json':
		return jsonify({"error": "Invalid Content-Type"}), 400

	data = request.get_json()

	keywords = data.get('keywords')
	location = data.get('location')

	# Check if the required fields are present
	if not keywords or not location:
		return jsonify({"error": "Missing required fields"}), 400
	
	jobs = get_linkedin_jobs(keywords, location)

	return jsonify(jobs)

@main_blueprint.route('/api/resume-enhancer', methods=['POST'])
def resume_enhancer():
	"""
	Returns a value between 0 and 1 based on how qualified the applicant is.

	Post Request Requirements:
		- Content-Type: application/json
		- Body: json object with two fields: 'resume' (string), and 'job_posting' (string).
				{ "resume": "John...", "job_posting": "We a..." }
	Returns:
		- A JSON object with a 'message' field indicating the similarity or an error message
		  { "message": "Invalid Content-Type" }, { "message": "0.314159" }

	"""
	if request.headers.get('Content-Type') != 'application/json':
		return jsonify({"error": "Invalid Content-Type"}), 400

	data = request.get_json()

	# Access the 'resume' and 'job_posting' fields from the data object
	resume = data.get('resume')
	job_posting = data.get('job_posting')

	# Check if the required fields are present
	if not resume or not job_posting:
		return jsonify({"error": "Missing required fields"}), 400

	similarity_score = resume_relevance(resume, job_posting)
	return jsonify({"message": str(similarity_score)})



@main_blueprint.route('/api/GPT-resume-feedback', methods=['POST'])
def GPT_resume_feedback():
	"""
	Handle file upload for resume feedback.

	Request Requirements:
		- Content-Type: multipart/form-data
		- Form Data: file input with name 'resume' (file must be a PDF)
	Returns:
		- JSON object with feedback or error in the 'message' field.
	"""

	if 'resume' not in request.files:
		return jsonify({"error": "No resume file"}), 400

	file = request.files['resume']

	if file.filename == '':
		return jsonify({"error":"could not select file"})
	if not file.filename.endswith('.pdf'):
		return jsonify({"error":"file must be a .pdf"})

	feedback = GPT_feedback(file)

	return jsonify({"message": feedback}), 200
