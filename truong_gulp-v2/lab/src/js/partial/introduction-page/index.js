import Vue from 'vue';
import TheTestComponent from './component/TheTestComponent.vue';
import test01 from '~jsPartialPath/test-page/_test';
import '~jsPartialPath/test-page/test/test';

// test
const test = (() => {
  const testFunc = () => {
    const elIntroductionWrap = document.getElementsByClassName('introduction__wrap');

    if(!elIntroductionWrap) {return;}
    elIntroductionWrap[0].classList.add('test');
  };

  const _renderTestComponent = () => {
    const elTest = document.getElementById('test');

    console.log(elTest);

    if(!elTest) {
      return;
    }

    new Vue({
      render: (h) => h(TheTestComponent),
    }).$mount(elTest);
  }; // _renderTestComponent()

  return {
    init() {
      // console.log('run');
      testFunc();

      _renderTestComponent();

      test01.init();
    }
  }
})();

test.init();
