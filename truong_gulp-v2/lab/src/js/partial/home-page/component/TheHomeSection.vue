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
import { PAGE_INFO } from "~jsBasePath/define";

export default {
  data() {
    return {
      PAGE_INFO,
    };
  },
  created() {
    console.log(this.PAGE_INFO);
  }
}
</script>
