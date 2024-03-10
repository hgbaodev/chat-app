from rest_framework.response import Response
from rest_framework import status

class SuccessResponse(Response):
    def __init__(self, data=None, status=status.HTTP_200_OK, template_name=None, headers=None, exception=False, content_type=None):
        data = {
            'success': True,
            'status': status,
            'result': data
        }
        super().__init__(data, status, headers, exception, content_type)

class ErrorResponse(Response):
    def __init__(self, error_message=None, status=status.HTTP_400_BAD_REQUEST, template_name=None, headers=None, exception=False, content_type=None):
        data = {
            'success': False,
            'status': status,
            'error_message': error_message
        }
        super().__init__(data, status, headers, exception, content_type)
