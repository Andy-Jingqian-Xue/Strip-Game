<template>
  <div class="homepage">
    <h1>Strip Game</h1>
    <p>Welcome to Strip Game! Test your memory and quick thinking.</p>
    <button @click="navigateToChoiceQuestion">Start Choice Question</button>
    <p>
      How to Play: Remember the sequence, avoid interference, and choose the
      correct strips.
    </p>
    <footer>
      <p>Created by [Your Name]</p>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    navigateToChoiceQuestion() {
      this.$router.push({ name: "choiceQuestion" });
    },
  },
};
</script>

<style>
@import "../styles/choice.css";
</style>
