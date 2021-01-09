<template>
  <div class="test">
    {{ test + 'wow' }}
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
      this.test = 'hello vue!!!';
    }, // setTestValue()
  },
};
</script>
