import unittest
from symserver import errors
from symserver.operations import factorExpr



class TestSimplifyExpr(unittest.TestCase):

    def test_happy_path(self):
        input = {
            'expr': 'x',
            'variables': ['x']
        }

        result = factorExpr(input)

        self.assertEqual(result.get('resultAsLatex'), r'x')

    def test_basic(self):
        input = {
            'expr': '(x**2 + 2 * x + 1)',
            'variables': ['x']
        }

        result = factorExpr(input)

        self.assertEqual(result.get('resultAsLatex'), r'\left(x + 1\right)^{2}')
