export default (() => {
  const _consoleTest = () => {
    console.log('test compile for es9');
  };

  return {
    init() {
      _consoleTest();
      // globalTest.init();
    }
  }
})();
