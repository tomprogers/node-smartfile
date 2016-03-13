export default (() => {

    const flot = (min, max) => Math.random() * (max - min) + min;
    const int = (min, max) => flot(min, max) | 0;
    const bool = () => Math.random() > 0.5;

    return {
        rand: {flot, int, bool}
    };

})();
