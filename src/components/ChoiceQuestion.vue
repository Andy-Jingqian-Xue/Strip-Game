<template>
  <h1>Strip Game</h1>
  <div class="progress-container">
    <el-progress
      type="circle"
      class="countdown-clock"
      :percentage="gameProgress"
      :stroke-width="12"
      status="success"
    >
      <span slot="format">{{ gameTimeLeft }}</span></el-progress
    >
  </div>
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
      strips: [],
      imgPwd: "src/assets/img",
      gamePhase: 1,
      memoryStrip: null,
      interferenceImage: "interference.svg",
      countdown: 10,
      countdownWidth: 100,
      countdownInterval: null,
      selectedAnswerStatus: null, // 'correct', 'wrong', 或 null
      selectedStrip: null, // 用户选择的条带
      gameDuration: 30, // 游戏总时长（秒）
      gameTimeLeft: 30, // 游戏剩余时间
      gameTimer: null, // 游戏倒计时定时器
      gameProgress: 100, // 游戏进度（百分比）
      correctAnswersCount: 0, // 答对的题目数
      //模拟提交1
      // 模拟测试2
    };
  },
  methods: {
    // 创建条带数组
    createStrips() {
      return Array.from({ length: 35 }, (_, i) => ({
        name: String(i + 1),
        image: `${i + 1}.svg`,
      }));
    },
    // 随机选择一个条带
    selectRandomStrip() {
      this.memoryStrip =
        this.strips[Math.floor(Math.random() * this.strips.length)];
    },
    // 生成选项并打乱
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
    // 打乱数组的顺序
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
    // 开始游戏
    startGame() {
      this.strips = this.createStrips();
      this.selectRandomStrip();
      this.gamePhase = 1;
      this.startCountdown();
    },
    // 检查答案
    checkAnswer(selectedStrip) {
      if (this.gamePhase === 3 && !this.isAnswering) {
        this.isAnswering = true; // 标记为正在作答
        this.selectedStrip = selectedStrip;
        this.selectedAnswerStatus =
          selectedStrip.name === this.memoryStrip.name ? "correct" : "wrong";
        // 如果答案正确，增加答对次数
        if (selectedStrip.name === this.memoryStrip.name) {
          this.correctAnswersCount++;
        }
        clearInterval(this.countdownInterval); // 停止倒计时

        setTimeout(() => {
          this.resetGame(); // 在一定时间后重置游戏
        }, 1000);
      }
    },

    // 开始倒计时
    startCountdown() {
      this.countdown = 10;
      this.countdownWidth = 0;

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }

      this.countdownInterval = setInterval(() => {
        this.countdown--;
        this.countdownWidth = ((10 - this.countdown) / 10) * 100;

        if (this.countdown === 7 && this.gamePhase === 1) {
          this.gamePhase = 2;
        } else if (this.countdown === 5 && this.gamePhase === 2) {
          this.gamePhase = 3;
          this.generateOptions();
        }

        if (this.countdown === -1) {
          clearInterval(this.countdownInterval);
          this.resetGame();
        }
      }, 1000);
    },
    // 在组件销毁前清除计时器
    beforeDestroy() {
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
      }
      clearInterval(this.countdownInterval);
    },
    // 重置游戏状态
    resetGame() {
      this.gamePhase = 1;
      this.countdown = 10;
      this.countdownWidth = 0;
      this.selectedAnswerStatus = null;
      this.selectedStrip = null;
      this.isAnswering = false;

      this.startGame();
    },
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
          this.endGame(); // 游戏时间结束
        }
      }, 1000);
    },

    endGame() {
      // 游戏结束逻辑
      // 例如：显示游戏结束消息、重置游戏状态等
      // 清除所有定时器
      clearInterval(this.gameTimer);
      clearInterval(this.countdownInterval);

      alert(`游戏结束。你共答对了 ${this.correctAnswersCount} 题目。`);
      //   this.resetGame(); // 可以在这里调用重置游戏的逻辑
    },
  },
  // 组件挂载时开始游戏
  mounted() {
    this.startGame();
    this.startGameClock(); // 启动游戏时钟
  },
};
</script>

<style scoped>
@import "../styles/choice.css";
</style>
