import Vue from 'vue';
import TheHomeSection from './component/TheHomeSection.vue';

const HomePage = (() => {
  const _renderHomeSection = () => {
    const elHomeSection = document.getElementById('home-section');

    if(!elHomeSection) {
      return;
    }

    new Vue({
      render: (h) => h(TheHomeSection),
    }).$mount(elHomeSection);
  }; // _renderHomeSection()

  return {
    init() {
      _renderHomeSection();
    }
  };
})();

HomePage.init();
