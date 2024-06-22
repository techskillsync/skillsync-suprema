import os
from flask import Blueprint, send_from_directory

main_blueprint = Blueprint('main', __name__, static_folder='../skillsync-client/dist', template_folder='../skillsync-client/dist')

@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')
def serve(path='index.html'):
    if path != "" and os.path.exists(os.path.join(main_blueprint.static_folder, path)):
        return send_from_directory(main_blueprint.static_folder, path)
    else:
        return send_from_directory(main_blueprint.static_folder, 'index.html')