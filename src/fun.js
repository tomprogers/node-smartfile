const partial = fn => (...pargs) => (...args) => fn(...pargs, ...args)
const partialRight = fn => (...pargs) => (...args) => fn(...args, ...pargs.reverse())
const curry = (f, arr = []) => (...args) => (a => a.length === f.length ? f(...a) : curry(f, a))([...arr, ...args])
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const pipe = (...fns) => compose(...fns.reverse())


export default {
  partial,
  partialRight,
  curry,
  compose,
  pipe
}
