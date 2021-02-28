<template>
  <section
    v-if="!isEmpty(resProductList)"
    class="home-section"
  >
    <div class="container">
      <div class="home-block">
        <div class="home-block__product-wrap">
          <template v-for="(productItem, idx) in resProductList">
            <div
              :key="idx"
              class="home-block__product-wrap__item"
            >
              <div class="home-block__product-wrap__item__head">
                <div class="home-block__product-wrap__item__logo-col">
                  <img
                    :src="imageUrl + productItem.logo"
                    :alt="productItem.title"
                    class="home-block__product-wrap__item__logo-img"
                  >
                </div> <!-- .home-block__product-wrap__item__logo-col -->

                <div class="home-block__product-wrap__item__title-col">
                  <div class="home-block__product-wrap__item__main-title">
                    {{ productItem.title }}
                  </div>

                  <div class="home-block__product-wrap__item__sub-title">
                    {{ productItem.sub_title }}
                  </div>
                </div> <!-- .home-block__product-wrap__item__title-col -->
              </div> <!-- .home-block__product-wrap__item__head -->

              <div class="home-block__product-wrap__item__body">
                {{ productItem.desc }}
              </div> <!-- .home-block__product-wrap__item__body -->
            </div> <!-- .home-block__product-wrap__item -->
          </template>
        </div> <!-- .home-block__product-wrap -->
      </div> <!-- .home-block -->
    </div>
  </section> <!-- .home-section -->
</template>

<script>
import { PAGE_INFO } from "~jsBasePath/define";
import _ from 'lodash';

export default {
  data() {
    const resProductList = this.chaining(PAGE_INFO,'resProductList', 'data', 'product_list') || null;
    const imageUrl = this.chaining(PAGE_INFO,'image_url') || '';

    return {
      resProductList,
      imageUrl,
    };
  },

  created() {
    console.log(this.resProductList);
  },

  methods: {
    isEmpty: _.isEmpty,
  },
}
</script>
