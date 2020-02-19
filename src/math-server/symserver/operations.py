from symserver import errors
from sympy import Symbol
from sympy import diff
from sympy import integrate
from sympy import solve
from sympy import expand
from sympy import simplify
from sympy import factor
from sympy.parsing.sympy_parser import parse_expr
from sympy.printing import latex


def handle_request(request_json):
    if request_json is None:
        raise errors.InvalidParams('A request body is required.')

    operation = request_json.get('operation')

    if operation is None:
        raise errors.InvalidParams('No operation provided.')

    if operation == 'derivative':
        return derivative(request_json=request_json)

    if operation == 'integral':
        return integral(request_json=request_json)

    if operation == 'solveFor':
        return solveFor(request_json=request_json)

    if operation == 'expandExpr':
        return expandExpr(request_json=request_json)

    if operation == 'simplifyExpr':
        return simplifyExpr(request_json=request_json)

    if operation == 'factorExpr':
        return factorExpr(request_json=request_json)

    else:
        raise errors.InvalidParams('Operation ' + operation + ' not supported.')


def derivative(request_json):

    # get params
    raw_expr = request_json.get('expr')  # python safe string
    variables = request_json.get('variables')  # list of python safe strings
    wrt = request_json.get('wrt')  # list of python safe strings

    # verify required params
    if wrt is None:
        raise errors.InvalidParams('param \'wrt\' is required.')
    if variables is None:
        raise errors.InvalidParams('list of variables are required')

    # parse the expression
    expr = parse_expr(raw_expr)

    # extract variables and define them as SymPy Symbols
    all_variables = variables + list(set(wrt) - set(variables))
    sym_vars = {}

    i = 0
    for var in all_variables:
        sym_vars[str(i)] = Symbol(var)
        i = i + 1

    result = expr

    derivative_order = len(wrt)
    for deriv in list(range(derivative_order)):
        deriv_var_index = all_variables.index(wrt[deriv])
        result = diff(result, sym_vars[str(deriv_var_index)])

    return dict(
        requestParams=request_json,
        parsedExprAsLatex=latex(expr),
        resultAsLatex=latex(result),
        resultAsPython=str(result),
    )


def integral(request_json):

    # get params
    raw_expr = request_json.get('expr')  # python safe string
    variables = request_json.get('variables')  # list of python safe strings
    wrt = request_json.get('wrt')  # variable to integrate with respect to
    leftBound = request_json.get('leftBound')
    rightBound = request_json.get('rightBound')

    # verify required params
    if wrt is None:
        raise errors.InvalidParams('param \'wrt\' is required.')
    if variables is None:
        raise errors.InvalidParams('list of variables are required')

    # parse the expression
    expr = parse_expr(raw_expr)

    if leftBound is not None and rightBound is not None:
        result = integrate(expr, (Symbol(wrt), leftBound, rightBound))
    else:
        result = integrate(expr, Symbol(wrt))

    result = simplify(result)

    return dict(
        requestParams=request_json,
        parsedExprAsLatex=latex(expr),
        resultAsLatex=latex(result),
        resultAsPython=str(result),
    )


def solveFor(request_json):

    # get params
    raw_expr = request_json.get('expr')  # python safe string
    variables = request_json.get('variables')  # list of python safe strings
    target_var = request_json.get('target_var')  # list containing on python safe string

    # verify required params
    if target_var is None:
        raise errors.InvalidParams('param \'target_var\' is required.')
    if variables is None:
        raise errors.InvalidParams('a list of variables is required')
    # if target_var[0] not in variables:
    #     raise errors.InvalidParams('\'target_var\' is not in variables list')

    # rearrange the expression
    split_expr = raw_expr.split("=")

    if len(split_expr) == 2:
        if split_expr[0].strip() and split_expr[1].strip():
            rearranged_expr = split_expr[0] + '- (' + split_expr[1] + ')'
        else:
            raise errors.InvalidParams('values required on both sides of the \'=\'')
    else:
        raise errors.InvalidParams('exactly one \'=\' is required')

    expr = parse_expr(rearranged_expr)

    # extract variables and define them as SymPy Symbols
    all_variables = variables + list(set(target_var) - set(variables))
    sym_vars = {}

    i = 0
    for var in all_variables:
        sym_vars[str(i)] = Symbol(var)
        i = i + 1

    target_var_index = all_variables.index(target_var[0])
    result = None
    result = solve(expr, sym_vars[str(target_var_index)])

    return dict(
        requestParams=request_json,
        parsedExprAsLatex=latex(expr),
        resultAsLatex=latex(result),
        resultAsPython=str(result),
    )


def expandExpr(request_json):

    # get params
    raw_expr = request_json.get('expr')  # python safe string
    variables = request_json.get('variables')  # list of python safe strings

    # verify required params
    if variables is None:
        raise errors.InvalidParams('a list of variables is required')

    if len(raw_expr.split("=")) > 1:
        raise errors.InvalidParams('input must be an expression and therefore contain no equals sign')

    expr = parse_expr(raw_expr)

    # extract variables and define them as SymPy Symbols
    sym_vars = {}

    i = 0
    for var in variables:
        sym_vars[str(i)] = Symbol(var)
        i = i + 1

    result = None
    result = expand(expr)

    return dict(
        requestParams=request_json,
        parsedExprAsLatex=latex(expr),
        resultAsLatex=latex(result),
        resultAsPython=str(result),
    )


def simplifyExpr(request_json):

    # get params
    raw_expr = request_json.get('expr')  # python safe string
    variables = request_json.get('variables')  # list of python safe strings

    # verify required params
    if variables is None:
        raise errors.InvalidParams('a list of variables is required')

    if len(raw_expr.split("=")) > 1:
        raise errors.InvalidParams('input must be an expression and therefore contain no equals sign')

    expr = parse_expr(raw_expr)

    # extract variables and define them as SymPy Symbols
    sym_vars = {}

    i = 0
    for var in variables:
        sym_vars[str(i)] = Symbol(var)
        i = i + 1

    result = None
    result = simplify(expr)

    return dict(
        requestParams=request_json,
        parsedExprAsLatex=latex(expr),
        resultAsLatex=latex(result),
        resultAsPython=str(result),
    )


def factorExpr(request_json):

    # get params
    raw_expr = request_json.get('expr')  # python safe string
    variables = request_json.get('variables')  # list of python safe strings

    # verify required params
    if variables is None:
        raise errors.InvalidParams('a list of variables is required')

    if len(raw_expr.split("=")) > 1:
        raise errors.InvalidParams('input must be an expression and therefore contain no equals sign')

    expr = parse_expr(raw_expr)

    # extract variables and define them as SymPy Symbols
    sym_vars = {}

    i = 0
    for var in variables:
        sym_vars[str(i)] = Symbol(var)
        i = i + 1

    result = None
    result = factor(expr)

    return dict(
        requestParams=request_json,
        parsedExprAsLatex=latex(expr),
        resultAsLatex=latex(result),
        resultAsPython=str(result),
    )
