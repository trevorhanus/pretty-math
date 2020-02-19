import { expect } from 'chai';
import * as sinon from 'sinon';
import {
    DerivativeNode,
    getPythonSafeSymbol,
    parseCalchub,
    resolveDerivative,
    resolveTree,
    SymServerSdk
} from '../../../internal';

describe('DerivativeResolver', () => {
    let doDerivativeStub;

    beforeEach(() => {
        doDerivativeStub = sinon.stub(SymServerSdk, 'doDerivative');
    });

    afterEach(() => {
        doDerivativeStub.restore();
    });

    it('simple derivative', (done) => {
        const pythonX = getPythonSafeSymbol('x');

        doDerivativeStub.callsFake((req, cb) => {
            setTimeout(() => {
                cb(null, { resultAsPython: `2${pythonX}` });
            }, 10);
        });

        const expr = '\\diff{x^{2}, \\wrt{x}}';
        const expected = {
            op: '\u229B',
            left: '2',
            right: 'x',
        };

        const { root } = parseCalchub(expr);
        resolveDerivative(root.only as DerivativeNode, {}, (err, answer) => {
            if (err) {
                console.log(err);
            }

            expect(expected).to.deep.eq(answer.toShorthand());

            const req = doDerivativeStub.getCall(0).args[0];
            expect(req.expr).to.eq(`${pythonX}**2`);
            expect(req.variables).to.deep.eq([pythonX]);
            expect(req.wrt).to.deep.eq([pythonX]);
            done();
        });
    });

    it('local symbols', (done) => {
        const pythonX = getPythonSafeSymbol('x');

        doDerivativeStub.callsFake((req, cb) => {
            setTimeout(() => {
                cb(null, { resultAsPython: `2${pythonX}` });
            }, 10);
        });

        const expr = '\\dfunc{f,x} = \\diff{x^2, \\wrt{x}}';
        const expected = {
            op: '=',
            left: {
                op: '\\dfunc',
                left: {
                    op: ',',
                    left: 'f',
                    right: 'loc:x',
                }
            },
            right: {
                op: '\u229B',
                left: '2',
                right: 'loc:x',
            },
        };

        const { root } = parseCalchub(expr);

        expect(root.only.toShorthand()).to.deep.eq({
            op: '=',
            left: {
                op: '\\dfunc',
                left: {
                    op: ',',
                    left: 'f',
                    right: 'loc:x',
                }
            },
            right: {
                op: '\\diff',
                left: {
                    op: ',',
                    left: {
                        op: '^',
                        left: 'loc:x',
                        right: '2'
                    },
                    right: {
                        op: '\\wrt',
                        left: 'loc:x'
                    }
                },
            },
        });

        resolveTree(root.only, {}, (err, answer) => {
            if (err) {
                console.log(err);
            }

            expect(expected).to.deep.eq(answer.toShorthand());
            const req = doDerivativeStub.getCall(0).args[0];
            expect(req.expr).to.eq(`${pythonX}**2`);
            expect(req.variables).to.deep.eq([pythonX]);
            expect(req.wrt).to.deep.eq([pythonX]);
            done();
        });
    });

});
