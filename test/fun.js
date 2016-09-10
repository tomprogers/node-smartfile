import chai from 'chai';
import fun from '../src/fun';

const expect = chai.expect;
const add3Numbers = (a, b, c) => a + b + c;
const partialAdd3Numbers = fun.partial(add3Numbers);
const curriedAdd3Numbers = fun.curry(add3Numbers);
const pow = fun.partialRight(Math.pow);

describe('fun', () => {

    it('partial should partially apply arguments', () => {
        expect(partialAdd3Numbers()(1, 2, 3) === partialAdd3Numbers(1)(2, 3)).to.equal(true);
        expect(partialAdd3Numbers(1, 2)(3) === partialAdd3Numbers(1, 2, 3)()).to.equal(true);
    });

    it('curry should break down a function into multiple function calls', () => {
        expect(curriedAdd3Numbers(1, 2, 3) === curriedAdd3Numbers(1)(2)(3)).to.equal(true);
        expect(curriedAdd3Numbers(1, 2)(3) === curriedAdd3Numbers(1)(2, 3)).to.equal(true);
        expect(curriedAdd3Numbers()(1)(2)()()(3) === curriedAdd3Numbers()()(1)()(2, 3)).to.equal(true);
    });

    it('compose should compose functions', () => {
        let ƒ = fun.compose(
            Math.sqrt,
            curriedAdd3Numbers(5, 6),
            pow(2)
        );
        expect(ƒ(5) === 6).to.equal(true);
    });

    it('pipe should pipe functions', () => {
        let ƒ = fun.pipe(
            pow(2),
            curriedAdd3Numbers(5, 6),
            Math.sqrt
        );
        expect(ƒ(5) === 6).to.equal(true);
    });

});
