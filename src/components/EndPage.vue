<template>
  <div class="end-page-container">
    <h1>Game Over</h1>
    <p>Your score is: {{ score }}</p>
    <el-button @click="restartGame" type="primary">Restart</el-button>
    <el-button @click="goToHomePage" type="success">Back to Homepage</el-button>
  </div>
</template>

<script>
export default {
  computed: {
    score() {
      return this.$store.state.score;
    },
  },

  methods: {
    restartGame() {
      this.$router.push({ name: "choiceQuestion" });
    },
    goToHomePage() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
@import "../styles/endpage.css";
</style>
