from sympy import pprint
from sympy.matrices import *
from sympy.solvers import solve
from sympy import Symbol
from sympy.parsing.sympy_parser import parse_expr
from sympy.printing.python import python
from sympy import diff
from mpmath import *

M = Matrix([
    [10, 2, 3, 4],
    [1, 12, 3, 4],
    [1, 20, 13, 4],
    [5, 5, 5, 5],
])

print(M.det())
