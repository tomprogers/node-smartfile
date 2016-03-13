import mat from './mat';
export default (() => {

    const pickRand = arr => arr[mat.rand.int(0, arr.length)];
    const shuffle = arr => arr.slice().reverse().map((v, i, a) => a[mat.rand.int(0, i)]);

    return {pickRand, shuffle};

})();
