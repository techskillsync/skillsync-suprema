from flask import request, jsonify
from flask import Blueprint, send_from_directory
from werkzeug.utils import secure_filename
import os

main_blueprint = Blueprint('main', __name__, static_folder='../../skillsync-client/dist')

@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')
def serve(path='index.html'):
    static_folder = main_blueprint.static_folder
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, 'index.html')



@main_blueprint.route('/api/resumefeedback', methods=['POST'] )
def resumefeedback():
    """
    Handle file upload for resume feedback.

    Request Requirements:
        - Content-Type: multipart/form-data
        - Form Data:
            - file input with name 'resume' (file must be a PDF)

    Returns:
        - JSON response indicating success or error.

    Example request:
    <form action="/upload_resume" method="post" enctype="multipart/form-data">
        <input type="file" name="resume" accept=".pdf,.doc,.docx">
        <input type="submit" value="Upload Resume">
    </form>
    """
    
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file"}), 400
    
    file = request.files['resume']

    if file.filename == '':
        return jsonify({"error":"could not select file"})
    if not file.filename.endswith('.pdf'):
        return jsonify({"error":"file must be a .pdf"})
    
    safe_filename = secure_filename(file.filename)
    print(safe_filename)
    # Now you would probably want to do something like this:
    # file.save('./', safe_filename)
    return jsonify({"message": "File uploaded successfully"}), 200