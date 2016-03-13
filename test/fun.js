import chai from 'chai';
import fun from '../src/fun';

const expect = chai.expect;

let add3Numbers = fun.curry((a, b, c) => a + b + c);

describe('fun', () => {

    it('curry should break down a function into multiple function calls', () => {
        expect(add3Numbers(1, 2, 3) === add3Numbers(1)(2)(3)).to.equal(true);
        expect(add3Numbers(1, 2)(3) === add3Numbers(1)(2, 3)).to.equal(true);
        expect(add3Numbers()(1)(2)()()(3) === add3Numbers()()(1)()(2, 3)).to.equal(true);
    });

    it('compose should compose functions', () => {
        let pow = fun.curry((exp,base) => Math.pow(base,exp));
        let ƒ = fun.compose(
            Math.sqrt,
            pow(2),
            add3Numbers(1,2)
        );
        expect(ƒ(4) === 7).to.equal(true);
    });

});
