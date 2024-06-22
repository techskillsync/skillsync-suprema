from flask import Flask, Blueprint, send_from_directory, current_app, jsonify, request

main_blueprint = Blueprint("main", __name__)

@main_blueprint.route("/")
@main_blueprint.route("/<path:path>")
def serve(path="index.html"):
    return send_from_directory(current_app.static_folder, path)