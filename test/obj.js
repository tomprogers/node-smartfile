import chai from 'chai';
import obj from '../src/obj';

const expect = chai.expect;

let testArr = [0, 1, true, 'three', 4, [5, 6], {key: 'value'}, a => Math.sqrt(a)];
let testObj = {
    arr: obj.clone(testArr),
    deep: {
        arr: obj.clone(testArr)
    }
};

describe('obj', () => {

    it('isObj shoud check if argument is an object', () => {
        expect(obj.isObj()).to.equal(false);
        expect(obj.isObj(undefined)).to.equal(false);
        expect(obj.isObj(true)).to.equal(false);
        expect(obj.isObj(null)).to.equal(false);
        expect(obj.isObj(1)).to.equal(false);
        expect(obj.isObj('1')).to.equal(false);
        expect(obj.isObj([])).to.equal(false);
        expect(obj.isObj({})).to.equal(true);
    });

    it('clone shoud deep copy an array', () => {
        let cloned = obj.clone(testArr);
        // array slice for cloning an array works correctly
        // if the array contains only primitives
        let sliced = testArr.slice();
        expect(testArr === cloned).to.equal(false);
        expect(testArr === sliced).to.equal(false);

        // in the cloned array every item is a new value
        cloned[6].key = 'changed value';
        expect(testArr[6].key === 'value').to.equal(true);
        expect(testArr[6].key === cloned[6].key).to.equal(false);

        // but in the sliced array non primitives are just references and can be overwritten
        sliced[6].key = 'changed value';
        expect(testArr[6].key === 'value').to.equal(false);
        expect(testArr[6].key === sliced[6].key).to.equal(true);

    });

    it('clone shoud deep copy an object', () => {
        let cloned = obj.clone(testObj);
        expect(testObj === cloned).to.equal(false);
        cloned.arr[6].key = 'changed value';
        expect(testObj.arr[6].key === 'value').to.equal(true);
        expect(testObj.arr[6].key === cloned.arr[6].key).to.equal(false);
    });

});
