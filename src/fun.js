export default (() => {

    const curry = fn => function curried(cargs) {
        return cargs.length >= fn.length ? fn.apply(this, cargs) : (...fargs) => curried([...cargs, ...fargs])
    }([]);
    const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

    return {curry, compose};

})();
