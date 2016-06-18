import mat from './mat';
export default (() => {

    const pickRand = arr => arr[mat.rand.int(0, arr.length-1)];
    const range = (start, end) => Array.apply(null, Array(end - start + 1)).map((n, i) => i + start);
    const shuffle = arr => arr.slice().reverse().reduce((p, c, i, a) => {
        let rnd = mat.rand.int(0, i);
        let tmp = a[i];
        a[i] = a[rnd];
        a[rnd] = tmp;
        return a;
    }, []);

    return {pickRand, range, shuffle};

})();
