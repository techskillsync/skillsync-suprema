from flask import request, jsonify
from flask import Blueprint, send_from_directory
import os
from services.Resume_Analysis import GPT_feedback

main_blueprint = Blueprint('main', __name__, static_folder='../../skillsync-client/dist')

@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')
def serve(path='index.html'):
    static_folder = main_blueprint.static_folder
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, 'index.html')

@main_blueprint.route('/api/upload-resume-feedback', methods=['POST'] )
def upload_resume_feedback():
    """
    Handle file upload for resume feedback.

    Request Requirements:
        - Content-Type: multipart/form-data
        - Form Data:
            - file input with name 'resume' (file must be a PDF)

    Returns:
        - JSON response with feedback or error.
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