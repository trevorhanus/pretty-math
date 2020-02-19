export enum TokenName {

    Missing,
    Space,

    // Constants
    // ---------------------

    e,
    pi,
    Infinity,

    // Unary Operators
    // ---------------------

    Factorial,
    Negate,

    // Binary Operators
    // ---------------------

    Add,
    Assign,
    Comma,
    Divide,
    ImplMultiply,
    Multiply,
    Power,
    Subtract,

    // Trig
    // ---------------------

    Acos,
    Asin,
    Atan,
    Acosh,
    Asinh,
    Atanh,
    Cos,
    Cosh,
    Sin,
    Sinh,
    Tan,
    Tanh,

    // Arithmetic Functions
    // ---------------------

    Abs,
    Exp,
    Frac,
    Ln,
    Log,
    Max,
    Min,
    Sqrt,
    Sum,

    // Linear Algebra
    Matrix,
    CrossP,
    DotP,
    Transpose,

    // Unique to CalcHub
    // ---------------------
    
    Dfunc,
    UserDefinedFunc,

    // Calculus
    // ---------------------

    Derivative,
    Integral,
    Pwrt,
    Wrt,

    // Arrays
    // ---------------------

    Array,
    ArrayOpener,
    ArrayCloser,

    // Parens
    // ---------------------

    EscapedLeftCurlyParens,
    LeftCurlyParens,
    LeftRoundParens,

    EscapedRightCurlyParens,
    RightCurlyParens,
    RightRoundParens,

    // Operands
    // --------------------

    Literal,
    Symbol,

    // Greeks
    // --------------------

    alpha,
    beta,
    gamma,
    delta,
    epsilon,
    zeta,
    eta,
    theta,
    kappa,
    lambda,
    mu,
    nu,
    xi,
    rho,
    sigma,
    tau,
    upsilon,
    phi,
    chi,
    psi,
    omega,

    Gamma,
    Delta,
    Theta,
    Lambda,
    Xi,
    Pi,
    Sigma,
    Upsilon,
    Phi,
    Psi,
    Omega,
    
}
