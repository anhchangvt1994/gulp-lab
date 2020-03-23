import test from '../test/_test';
const text = (() => {
  const  _testTextConsole = () => {
    const elText = document.getElementsByClassName('text__block');
    if(!elText) {return}

    // console.log(elText.innerHTML);
  };

  return {
    init() {
      _testTextConsole();
      test.init();
    }
  }
})();

text.init();
