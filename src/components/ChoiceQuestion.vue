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
          v-for="strip in memoryStrips"
          :key="strip.name"
          :src="`${imgPwd}/${strip.image}`"
          :alt="strip.name"
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
          @click="selectedStrips.length < 2 && checkAnswer(strip)"
          :class="{
            disabled: selectedStrips.length >= 2,
            'correct-answer': isSelectedAndCorrect(strip.name),
            'wrong-answer': isSelectedAndWrong(strip.name),
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
      memoryStrips: [],
      optionStrips: [],
      selectedStrips: [],
      imgPwd: "src/assets/img",
      gamePhase: 1,
      memoryStrip: null,
      interferenceImage: "interference.svg",
      countdown: 10,
      countdownWidth: 100,
      countdownInterval: null,
      selectedAnswerStatus: null,
      gameDuration: 30,
      gameTimeLeft: 30,
      gameTimer: null,
      gameProgress: 100,
      correctAnswersCount: 0,
    };
  },

  beforeDestroy() {
    // 清除游戏计时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    // 清除每轮游戏的计时器
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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
    selectRandomStrips() {
      // 随机选择两个不同的条带
      while (this.memoryStrips.length < 2) {
        let strip = this.strips[Math.floor(Math.random() * this.strips.length)];
        if (!this.memoryStrips.includes(strip)) {
          this.memoryStrips.push(strip);
        }
      }
    },

    generateOptions() {
      // 生成八个选项
      let optionsSet = new Set(this.memoryStrips);
      while (optionsSet.size < 8) {
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

    startGame() {
      this.strips = this.createStrips();
      this.selectRandomStrips(); // 修改这里
      this.gamePhase = 1;
      this.startCountdown();
    },

    checkAnswer(selectedStrip) {
      if (this.gamePhase !== 3 || this.selectedStrips.length >= 2) {
        // 如果已经选择了两个条带，直接返回
        return;
      }

      const isCorrect = this.memoryStrips.some(
        (memoryStrip) => memoryStrip.name === selectedStrip.name
      );

      // 如果已经选中，则不再添加
      if (
        !this.selectedStrips.find((strip) => strip.name === selectedStrip.name)
      ) {
        this.selectedStrips.push({
          ...selectedStrip,
          status: isCorrect ? "correct" : "wrong",
        });
      }

      // 更新分数
      if (isCorrect) {
        this.$store.commit("incrementScore");
      } else {
        this.$store.commit("decrementScore");
      }

      // 如果玩家已经选择了两个条带，结束这一轮游戏
      if (this.selectedStrips.length >= 2) {
        clearInterval(this.countdownInterval);
        setTimeout(() => {
          this.resetGame();
        }, 1000);
      }
    },

    isSelectedAndCorrect(name) {
      const stripInfo = this.selectedStrips.find(
        (strip) => strip.name === name
      );
      return stripInfo && stripInfo.status === "correct";
    },

    isSelectedAndWrong(name) {
      const stripInfo = this.selectedStrips.find(
        (strip) => strip.name === name
      );
      return stripInfo && stripInfo.status === "wrong";
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

    resetGame() {
      // 清空选中的条带和状态
      this.selectedStrips = [];
      this.memoryStrips = [];
      this.selectRandomStrips();

      // 重置游戏阶段
      this.gamePhase = 1;

      // 重置倒计时和宽度
      this.countdown = 10;
      this.countdownWidth = 100;

      // 停止任何正在进行的倒计时
      clearInterval(this.countdownInterval);

      // 重新启动倒计时
      this.startCountdown();
    },

    resetSelectedStrips() {
      // 重置玩家的选择
      this.selectedStrips = [];
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

      // 在离开页面时，也清除所有计时器
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
      }
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
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
