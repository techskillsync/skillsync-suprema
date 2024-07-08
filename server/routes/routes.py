from flask import request, jsonify
from flask import Blueprint, send_from_directory
import os
from services.Resume_Analysis import GPT_feedback
from services.ResumeEnhancer import GetResumeAndPostingSimilarity

main_blueprint = Blueprint('main', __name__, static_folder='../../skillsync-client/dist')

@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')
def serve(path='index.html'):
	static_folder = main_blueprint.static_folder
	if path != "" and os.path.exists(os.path.join(static_folder, path)):
		return send_from_directory(static_folder, path)
	else:
		return send_from_directory(static_folder, 'index.html')

@main_blueprint.route('/api/resume-enhancer', methods=['POST'])
def resume_enhancer():
	"""
	Handle resume and job posting upload for resume enhancer.

	Request Requirements:
		- Content-Type: application/json
		- Body:
			- json object with two fields: 'resume', and 'job_posting'.
			  'resume' and 'job_posting' must be a string.
		
		- Returns:
			- A JSON object with a string in its message feild,
			  indicating either the similarity or the error message.
			  ie.
			  	{ "message": "error"/"0.13413435" }

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

	similarity_score = GetResumeAndPostingSimilarity(resume, job_posting)
	return jsonify({"message": str(similarity_score)})

@main_blueprint.route('/api/upload-resume-feedback', methods=['POST'])
def upload_resume_feedback():
	"""
	Handle file upload for resume feedback.

	Request Requirements:
		- Content-Type: multipart/form-data
		- Form Data:
			- file input with name 'resume' (file must be a PDF)

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
