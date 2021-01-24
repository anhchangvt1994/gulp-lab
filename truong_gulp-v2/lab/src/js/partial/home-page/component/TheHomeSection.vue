<template>
  <section class="home-section">
    <div class="container">
      <div class="home-block">
        <div class="home-block__parterm-wrap">
        </div> <!-- .home-block__parterm-wrap -->
      </div> <!-- .home-block -->
    </div>
  </section> <!-- .home-section -->
</template>

<script>
// import { PAGE_INFO } from "~jsBasePath/define";
import test01 from '~jsPartialPath/test-page/_test';
export default {
  data() {
    return {
      // PAGE_INFO,
    };
  },
  created() {
    test01.init();
    // console.log(this.PAGE_INFO);
  }
}
</script>
