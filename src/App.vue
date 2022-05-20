<template>
  <div class="wrapper">
    <nav>
      <h3>Using an ML Model in a Web Fronted</h3>
    </nav>
    <div class="page">
      <h1>Welcome!</h1>

      <br /><br />
      <video class="video" ref="video"></video>
      <br />
      <canvas class="output"></canvas>
      <br />
      <button v-on:click="predictHands">Predict hands</button>
    </div>
  </div>
</template>

<script>
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import Camera from "@mediapipe/hands";

export default {
  name: "App",
  components: {},
  computed: {
    videoElement() {
      return this.$refs.video;
    }
  },
  data() {
    return {
      video: undefined,
      model: undefined,
      detectorConfig: {
        runtime: "mediapipe", // or 'tfjs'
        modelType: "full"
      },
      detector: undefined
    };
  },
  methods: {
    setupWebCam: async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");
      }
      this.videoElement.width = window.innerWidth;
      this.videoElement.height = window.innerHeight;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
      this.videoElement.srcObject = stream;
      return new Promise((resolve) => (this.videoElement.onloadedmetadata = () => resolve(this.videoElement)));
    },
    predictHands: async () => {
      const hands = await this.detector.estimateHands(this.videoElement);
      console.log(hands);
    }
  },
  mounted: async () => {
    this.model = handPoseDetection.SupportedModels.MediaPipeHands;
    this.detector = await handPoseDetection.createDetector(this.model, this.detectorConfig);
    this.video = await this.setupWebCam();
    this.video.play();
    console.log(this.videoElement);
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.wrapper {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

nav {
  width: 100%;
  min-height: 50px;
  overflow: auto;
  padding: 0 20px;
  margin: 0;
  background-color: lightseagreen;
}

.page {
  padding: 20px;
}
</style>
