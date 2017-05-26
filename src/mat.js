const flot = (min, max) => Math.random() * (max - min) + min
const int = (min, max) => flot(min, max + 1) | 0
const bool = () => Math.random() > 0.5


export default {
  rand: {
    flot,
    int,
    bool
  }
}
