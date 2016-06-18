import chai from 'chai';
import arr from '../src/arr';

const expect = chai.expect;

let testArr = [0, 1, true, 'three', 4, [5, 6], {
    key: 'value'
}, a => Math.sqrt(a)];

describe('arr', () => {

    it('pickRand should pick a random element from an array', () => {
        let rndItem = arr.pickRand(testArr);
        expect(testArr.indexOf(rndItem) > -1).to.equal(true);
    });

    it('shuffle should reorder array elements (not mutating)', () => {
        let shuffled = arr.shuffle(testArr);
        expect(testArr.toString() !== shuffled.toString()).to.equal(true);
    });

    it('range should create an array of integers', () => {
        let nums = arr.range(3, 9);
        expect(nums).to.deep.equal([3, 4, 5, 6, 7, 8, 9]);
    });

});
