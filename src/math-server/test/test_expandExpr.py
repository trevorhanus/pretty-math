import unittest
from symserver import errors
from symserver.operations import expandExpr



class TestSimplifyExpr(unittest.TestCase):

    def test_happy_path(self):
        input = {
            'expr': 'x',
            'variables': ['x']
        }

        result = expandExpr(input)

        self.assertEqual(result.get('resultAsLatex'), r'x')

    def test_basic(self):
        input = {
            'expr': '(x + 1)**2',
            'variables': ['x']
        }

        result = expandExpr(input)

        self.assertEqual(result.get('resultAsLatex'), r'x^{2} + 2 x + 1')
