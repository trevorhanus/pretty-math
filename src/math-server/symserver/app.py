from symserver import operations
from flask import request, jsonify
from flask_api import FlaskAPI, status, exceptions
from flask_cors import CORS


app = FlaskAPI(__name__)
CORS(app)


@app.route('/', methods=['POST'])
@app.route('/api/math', methods=['POST'])
def do_math():
    return operations.handle_request(request.get_json())


@app.route('/_health', methods=['GET'])
def health_check():
    return '', status.HTTP_200_OK


@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, exceptions.APIException):
        code = e.status_code
    return jsonify(error=str(e)), code
