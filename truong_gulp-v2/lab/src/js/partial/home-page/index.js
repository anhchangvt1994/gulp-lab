import Vue from 'vue';
import TheHomeSection from './component/TheHomeSection.vue';

const HomePage = (() => {
  const _renderHomeSection = () => {
    const elHomeSection = document.getElementById('home-section');

    if(!elHomeSection) {
      return;
    }

    Vue.prototype.chaining = (obj, ...rest) => {
      let tmp = obj;
      for (let key in rest) {
        let name = rest[key];
        tmp = tmp?.[name];
      }
      return tmp || "";
    };

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
