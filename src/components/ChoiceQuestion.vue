<template>
  <h1>Strip Game</h1>

  <!-- Progress Container with Back Button and Timer -->
  <div class="progress-container">
    <el-button class="back-button" @click="goToHomePage">Back</el-button>
    <el-progress
      type="circle"
      class="countdown-clock"
      :percentage="gameProgress"
      :stroke-width="12"
      status="success"
    >
      <span>{{ gameTimeLeft }}</span>
    </el-progress>
  </div>

  <!-- Game Play Area -->
  <div>
    <div class="countdown-timer-bar-container">
      <div class="red-part"></div>
      <div class="green-part"></div>
      <div class="blue-part"></div>
      <div
        class="countdown-timer-bar"
        :style="{ width: countdownWidth + '%' }"
      ></div>
    </div>

    <div class="game-container">
      <!-- Memory Phase -->
      <section v-if="gamePhase === 1" class="memory-phase">
        <img
          v-if="memoryStrip"
          :src="`${imgPwd}/${memoryStrip.image}`"
          :alt="memoryStrip.name"
          class="strip-image"
        />
      </section>

      <!-- Interference Phase -->
      <section v-if="gamePhase === 2" class="interference-phase">
        <img
          :src="`${imgPwd}/${interferenceImage}`"
          alt="Interference Image"
          class="strip-image"
        />
      </section>

      <!-- Answer Phase -->
      <div v-if="gamePhase === 3" class="options">
        <section
          v-for="strip in optionStrips"
          :key="strip.name"
          class="option-strip"
          @click="checkAnswer(strip)"
          :class="{
            'correct-answer':
              selectedAnswerStatus === 'correct' &&
              strip.name === selectedStrip.name,
            'wrong-answer':
              selectedAnswerStatus === 'wrong' &&
              strip.name === selectedStrip.name,
          }"
        >
          <img
            :src="`${imgPwd}/${strip.image}`"
            :alt="strip.name"
            class="strip-image"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Game data
      strips: [],
      imgPwd: "src/assets/img",
      gamePhase: 1,
      memoryStrip: null,
      interferenceImage: "interference.svg",
      countdown: 10,
      countdownWidth: 100,
      countdownInterval: null,
      selectedAnswerStatus: null,
      selectedStrip: null,
      gameDuration: 30,
      gameTimeLeft: 30,
      gameTimer: null,
      gameProgress: 100,
      correctAnswersCount: 0,
    };
  },
  methods: {
    // Create an array of strips
    createStrips() {
      return Array.from({ length: 35 }, (_, i) => ({
        name: String(i + 1),
        image: `${i + 1}.svg`,
      }));
    },

    // Randomly select a strip
    selectRandomStrip() {
      this.memoryStrip =
        this.strips[Math.floor(Math.random() * this.strips.length)];
    },

    // Generate and shuffle options
    generateOptions() {
      let optionsSet = new Set([this.memoryStrip]);
      while (optionsSet.size < 4) {
        optionsSet.add(
          this.strips[Math.floor(Math.random() * this.strips.length)]
        );
      }
      this.optionStrips = Array.from(optionsSet);
      this.shuffleArray(this.optionStrips);
    },

    // Shuffle array utility
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    // Start the game
    startGame() {
      this.strips = this.createStrips();
      this.selectRandomStrip();
      this.gamePhase = 1;
      this.startCountdown();
    },

    // Check the answer and update the score
    checkAnswer(selectedStrip) {
      if (this.gamePhase === 3 && !this.isAnswering) {
        this.isAnswering = true;
        this.selectedStrip = selectedStrip;
        this.selectedAnswerStatus =
          selectedStrip.name === this.memoryStrip.name ? "correct" : "wrong";
        if (selectedStrip.name === this.memoryStrip.name) {
          this.$store.commit("incrementScore");
        } else {
          this.$store.commit("decrementScore");
        }
        clearInterval(this.countdownInterval);

        setTimeout(() => {
          this.resetGame();
        }, 1000);
      }
    },

    // Start the countdown
    startCountdown() {
      this.updateCountdown();
      this.countdown = 10;
      this.countdownWidth = 0;

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }

      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, 100);
    },

    updateCountdown() {
      this.countdown = this.countdown - 0.1;

      if (this.countdown < 0) {
        clearInterval(this.countdownInterval);
        this.resetGame();
        return;
      }

      this.countdownWidth = ((10 - this.countdown) / 10) * 100;

      if (this.countdown <= 8 && this.countdown > 7.9 && this.gamePhase === 1) {
        this.gamePhase = 2;
      } else if (
        this.countdown <= 6 &&
        this.countdown > 5.9 &&
        this.gamePhase === 2
      ) {
        this.gamePhase = 3;
        this.generateOptions();
      }
    },

    // Reset the game state
    resetGame() {
      this.gamePhase = 1;
      this.countdown = 10;
      this.countdownWidth = 0;
      this.selectedAnswerStatus = null;
      this.selectedStrip = null;
      this.isAnswering = false;

      this.startGame();
    },

    // Start the game clock
    startGameClock() {
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
      }

      this.gameTimeLeft = this.gameDuration;
      this.gameTimer = setInterval(() => {
        if (this.gameTimeLeft > 0) {
          this.gameTimeLeft--;
          this.gameProgress = (this.gameTimeLeft / this.gameDuration) * 100;
        } else {
          clearInterval(this.gameTimer);
          this.endGame();
        }
      }, 1000);
    },

    // Navigate to Home Page
    goToHomePage() {
      this.$router.push("/");
    },

    // End the game and show results
    endGame() {
      clearInterval(this.gameTimer);
      clearInterval(this.countdownInterval);

      // 跳转到游戏结束页面，并传递分数
      this.$router.push({
        name: "EndPage",
      });
    },
  },
  mounted() {
    this.startGame();
    this.startGameClock();
    this.$store.commit("resetScore");
  },
};
</script>

<style scoped>
@import "../styles/choice.css";
</style>
