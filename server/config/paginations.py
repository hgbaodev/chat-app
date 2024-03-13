from rest_framework import pagination
from rest_framework.response import Response

class CustomPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'meta': {
                'total': self.page.paginator.count,
                'current_page': self.page.number,
                'last_page': self.page.paginator.num_pages,
                'per_page': self.page.paginator.per_page
            },
            'results': data,
        })