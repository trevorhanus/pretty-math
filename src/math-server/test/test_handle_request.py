import unittest
from symserver import errors
from symserver.operations import handle_request


class TestHandleRequest(unittest.TestCase):

    def test_throws_on_no_json(self):

        with self.assertRaises(errors.InvalidParams):
            handle_request(None)


    def test_throws_on_no_operation(self):
        json = {
            'operation': None,
            'expr': 'foo'
        }

        with self.assertRaises(errors.InvalidParams):
            handle_request(json)


    def test_throws_on_unknown_operation(self):
        json = {
            'operation': 'foo',
        }

        with self.assertRaises(errors.InvalidParams):
            handle_request(json)
