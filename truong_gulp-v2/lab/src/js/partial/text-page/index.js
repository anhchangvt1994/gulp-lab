// changed 1609955567374
// changed 1609955064413
import test from '~jsPartialPath/test-page/_test';
const text = (() => {
  const  _testTextConsole = () => {
    const elText = document.getElementsByClassName('text__block');
    if(!elText) {return}

    console.log(elText.innerHTML);
  };

  return {
    init() {
      _testTextConsole();
      test.init();
    }
  }
})();

text.init();
