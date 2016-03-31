import mat from './mat';
export default (() => {

    const pickRand = arr => arr[mat.rand.int(0, arr.length-1)];
    const shuffle = arr => arr.slice().reverse().map((v, i, a) => a[mat.rand.int(0, i)]);
    const range = (start, end) => Array.apply(null, Array(end - start + 1)).map((n, i) => i + start);

    return {pickRand, shuffle, range};

})();
