import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='../skillsync-client/dist', template_folder='../skillsync-client/dist')

@app.route('/')
@app.route('/<path:path>')
def serve(path='index.html'):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
