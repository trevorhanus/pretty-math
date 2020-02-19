from flask_api.exceptions import APIException

class InvalidParams(APIException):
    status_code = 400

    def __init__(self, message):
        Exception.__init__(self)
        self.detail = message
