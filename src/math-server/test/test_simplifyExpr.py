import unittest
from symserver import errors
from symserver.operations import simplifyExpr



class TestSimplifyExpr(unittest.TestCase):

    def test_happy_path(self):
        input = {
            'expr': 'x',
            'variables': ['x']
        }

        result = simplifyExpr(input)

        self.assertEqual(result.get('resultAsLatex'), r'x')

    def test_basic(self):
        input = {
            'expr': '(x**2 + x)/x',
            'variables': ['x']
        }

        result = simplifyExpr(input)

        self.assertEqual(result.get('resultAsLatex'), r'x + 1')
