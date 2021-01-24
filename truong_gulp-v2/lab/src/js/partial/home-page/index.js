import Vue from 'vue';
import TheHomeSection from './component/TheHomeSection.vue';
import { PAGE_INFO } from "~jsBasePath/define";

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
      console.log(PAGE_INFO);
      _renderHomeSection();
    }
  };
})();

HomePage.init();
