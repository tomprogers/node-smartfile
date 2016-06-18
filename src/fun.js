export default (() => {

    const partial = fn => (...pargs) => (...args) => fn.apply(null, [...pargs, ...args]);
    const curry = fn => function curried(cargs) {
        return cargs.length >= fn.length ? fn.apply(this, cargs) : (...args) => curried([...cargs, ...args])
    }([]);
    const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

    return {partial, curry, compose};

})();
