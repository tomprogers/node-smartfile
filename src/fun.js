export default (() => {

    const partial = fn => (...pargs) => (...args) => fn.apply(null, [...pargs, ...args]);
    const partialRight = fn => (...pargs) => (...args) => fn.apply(null, [...args, ...pargs.reverse()]);
    const curry = fn => function curried(cargs) {
        return cargs.length >= fn.length ? fn.apply(this, cargs) : (...args) => curried([...cargs, ...args])
    }([]);
    const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g.apply(null, [...args])));
    const pipe = (...fns) => compose.apply(null, [...fns.reverse()]);

    return {
        partial,
        partialRight,
        curry,
        compose,
        pipe
    };

})();
