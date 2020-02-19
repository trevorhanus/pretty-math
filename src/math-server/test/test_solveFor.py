import unittest
from symserver import errors
from symserver.operations import solveFor



class TestSolveFor(unittest.TestCase):

    def test_happy_path(self):
        input = {
            'expr': 'x = 1',
            'variables': ['x'],
            'target_var': ['x']
        }

        result = solveFor(input)

        self.assertEqual(result.get('resultAsLatex'), r'\left[ 1\right]')

    def test_ln_solve(self):
        input = {
            'expr': 'x = exp(y)',
            'variables': ['x', 'y'],
            'target_var': ['y']
        }

        result = solveFor(input)

        self.assertEqual(result.get('resultAsLatex'), r'\left[ \log{\left(x \right)}\right]')

    def test_throws_on_no_equals(self):
        input = {
            'expr': 'x**2',
            'variables': ['x'],
            'target_var': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            solveFor(input)

    def test_throws_on_multi_equals(self):
        input = {
            'expr': 'x**2 = y = 10',
            'variables': ['x'],
            'target_var': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            solveFor(input)

    def test_throws_on_no_values(self):
        input = {
            'expr': 'x**2 = ',
            'variables': ['x'],
            'target_var': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            solveFor(input)

    def test_multi_solution(self):
        input = {
            "operation": "solveFor",
            "expr": "x**2 = exp(y)",
            "variables": ["x", "y"],
            "target_var": ["x"]
        }

        result = solveFor(input)

        self.assertEqual(result.get('resultAsLatex'), r"\left[ - \sqrt{e^{y}}, \  \sqrt{e^{y}}\right]")
