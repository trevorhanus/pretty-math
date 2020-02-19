import unittest
from symserver import errors
from symserver.operations import integral


class TestIntegral(unittest.TestCase):


    def test_happy_path(self):
        input = {
            'expr': 'x**2',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'\frac{x^{3}}{3}')

    def test_redundant_vars(self):
        input = {
            'expr': 'x**2',
            'variables': ['x', 'y', 'z'],
            'wrt': ['x']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'\frac{x^{3}}{3}')

    def test_redundant_vars1(self):
        input = {
            'expr': 'x**2',
            'variables': ['x', 'y', 'z'],
            'wrt': ['y']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), 'x^{2} y')

    def test_intvar_not_in_expr(self):
        input = {
            'expr': 'x**2',
            'variables': ['x'],
            'wrt': ['y']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'x^{2} y')

    def test_throws_on_no_wrt(self):
        input = {
            'expr': 'x**2',
            'variables': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            integral(input)

    def test_throws_on_no_variables(self):
        input = {
            'expr': 'x**2',
            'wrt': ['x']
        }

        with self.assertRaises(errors.InvalidParams):
            integral(input)

    def test_log(self):
        input = {
            'expr': 'x**(-1)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'\log{\left(x \right)}')

    def test_multiple_var0(self):
        input = {
            'expr': 'ab**(-1) + exp(ac)',
            'variables': ['ab', 'ac'],
            'wrt': ['ab']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'ab e^{ac} + \log{\left(ab \right)}')

    def test_multiple_var1(self):
        input = {
            'expr': 'ab**(-1) + exp(ac)',
            'variables': ['ab', 'ac'],
            'wrt': ['ac']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'e^{ac} + \frac{ac}{ab}')

    def test_abs(self):
        input = {
            'expr': 'abs(x)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'\int \operatorname{abs}{\left(x \right)}\, dx')

    def test_trig(self):
        input = {
            'expr': 'sin(x) + cos(x) + tan(x)',
            'variables': ['x'],
            'wrt': ['x']
        }

        result = integral(input)

        self.assertEqual(result.get('resultAsLatex'), r'- \log{\left(\cos{\left(x \right)} \right)} + \sin{\left(x \right)} - \cos{\left(x \right)}')
