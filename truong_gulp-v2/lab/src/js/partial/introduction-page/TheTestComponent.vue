<template>
  <div class="test">
    {{ test }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: null,
    }
  },

  created() {
    this.setTestValue();
  },

  methods: {
    setTestValue() {
      this.test = 'hello vuejs';
    }, // setTestValue()
  },
};
</script>
