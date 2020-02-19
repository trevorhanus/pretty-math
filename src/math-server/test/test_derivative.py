import unittest
from symserver import errors
from symserver.operations import derivative


class TestDerivative(unittest.TestCase):

    def test_happy_path(self):
        input = {
            'expr': 'x**2',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), '2 x')

    def test_derivative_order(self):
        input = {
            'expr': 'x**2',
            'variables': ['x'],
            'wrt': ['x', 'x']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), '2')
        self.assertEqual(result.get('parsedExprAsLatex'), 'x^{2}')

    def test_derivative_order2(self):
        input = {
            'expr': 'x**3 * y**2',
            'variables': ['x', 'y'],
            'wrt': ['x', 'y']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), r'6 x^{2} y')

    def test_derivative_order2_inverse_order(self):
        input = {
            'expr': 'x**3 * y**2',
            'variables': ['x', 'y'],
            'wrt': ['y', 'x']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), r'6 x^{2} y')

    def test_derivative_no_var_in_expr(self):
        input = {
            'expr': 'x**3 * y**2',
            'variables': ['x', 'y'],
            'wrt': ['z']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), r'0')

    def test_throws_on_no_wrt(self):
        input = {
            'expr': 'x**2',
            'variables': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            derivative(input)

    def test_throws_on_no_variables(self):
        input = {
            'expr': 'x**2',
            'wrt': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            derivative(input)

    def test_multi_char_var(self):
        input = {
            'expr': 'ab**2',
            'variables': ['ab'],
            'wrt': ['ab']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), '2 ab')

    def test_deriv_trig(self):
        input = {
            'expr': 'sin(x) + cos(x) + tan(x)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)

        self.assertEqual(result.get('resultAsLatex'), r"- \sin{\left (x \right )} + \cos{\left (x \right )} + \tan^{2}{\left (x \right )} + 1")


    def test_multiple_var(self):
        input = {
            'expr': 'ab**2 + ac**(-1)',
            'variables': ['ab', 'ac'],
            'wrt': ['ab']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"2 ab")


    def test_ln(self):
        input = {
            'expr': 'ln(x)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"\frac{1}{x}")


    def test_diffvar_not_in_expr(self):
        input = {
            'expr': 'x**2',
            'variables': ['x'],
            'wrt': ['y']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"0")

    def test_ln_1(self):
        input = {
            'expr': 'ln(x)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"\frac{1}{x}")


    def test_ln_2(self):
        input = {
            'expr': 'log(x)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"\frac{1}{x}")


    def test_ln_3(self):
        input = {
            'expr': 'log(x, exp(1))',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"\frac{1}{x}")


    def test_log10(self):
        input = {
            'expr': 'log(x, 10)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = derivative(input)
        self.assertEqual(result.get('resultAsLatex'), r"\frac{1}{x \log{\left (10 \right )}}")  # log here is actually ln, make sure to switch in PrettyMath or the answer will be wrong
