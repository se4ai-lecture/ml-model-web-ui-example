<template>
  <div class="wrapper">
    <nav>
      <h3>Using an ML Model in a Web Fronted</h3>
    </nav>
    <div class="page">
      <h1>Welcome!</h1>
      {{ message }}
      <br /><br />
      <strong>Gesture:</strong> {{ gesture }}
      <br />
      <video class="video" ref="video"></video>
      <br />
      <canvas class="canvas" ref="canvas" width="720" height="480"></canvas>
    </div>
  </div>
</template>

<script>
// functionality adapted from https://developers.google.com/mediapipe/solutions/vision/hand_landmarker/web_js
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";

export default {
  name: "App",
  components: {},
  computed: {
    videoElement() {
      return this.$refs.video;
    },
    canvasElement() {
      return this.$refs.canvas;
    }
  },
  data() {
    return {
      canvasCtx: null,
      message: "Loading webcam and canvas...",
      gesture: "--"
    };
  },
  methods: {
    onResults(results) {
      this.message = "Loading complete!";
      // analyze the gesture
      this.predictGesture(results);
      // print hand landmarks on canvas
      this.canvasCtx.save();
      this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
          drawLandmarks(this.canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        }
      }
      this.canvasCtx.restore();
    },
    predictGesture(results) {
      // abort if no hands have been detected
      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        return;
      }

      // get base and tip y coordinates of all fingers
      const thumbBaseY = results.multiHandLandmarks[0][1].y;
      const thumbTipY = results.multiHandLandmarks[0][4].y;
      const indexBaseY = results.multiHandLandmarks[0][5].y;
      const indexTipY = results.multiHandLandmarks[0][8].y;
      const middleBaseY = results.multiHandLandmarks[0][9].y;
      const middleTipY = results.multiHandLandmarks[0][12].y;
      const ringBaseY = results.multiHandLandmarks[0][13].y;
      const ringTipY = results.multiHandLandmarks[0][16].y;
      const pinkyBaseY = results.multiHandLandmarks[0][17].y;
      const pinkyTipY = results.multiHandLandmarks[0][20].y;

      // get base and tip x coordinates for all fingers
      const thumbBaseX = results.multiHandLandmarks[0][1].x;
      const thumbTipX = results.multiHandLandmarks[0][4].x;
      const indexBaseX = results.multiHandLandmarks[0][5].x;
      const indexTipX = results.multiHandLandmarks[0][8].x;
      const middleBaseX = results.multiHandLandmarks[0][9].x;
      const middleTipX = results.multiHandLandmarks[0][12].x;
      const ringBaseX = results.multiHandLandmarks[0][13].x;
      const ringTipX = results.multiHandLandmarks[0][16].x;
      const pinkyBaseX = results.multiHandLandmarks[0][17].x;
      const pinkyTipX = results.multiHandLandmarks[0][20].x;

      // paper
      // check if all fingers are extended upwards, i.e., y coordinate of tip is smaller than base
      if (
        thumbTipY < thumbBaseY &&
        indexTipY < indexBaseY &&
        middleTipY < middleBaseY &&
        ringTipY < ringBaseY &&
        pinkyTipY < pinkyBaseY
      ) {
        console.log("PAPER!");
        this.gesture = "PAPER";
        return;
      }

      // rock
      // check if all fingers are folded, i.e., y coordinate of tip is larger than base
      if (
        // thumbTipY > thumbBaseY &&
        indexTipY > indexBaseY &&
        middleTipY > middleBaseY &&
        ringTipY > ringBaseY &&
        pinkyTipY > pinkyBaseY
      ) {
        console.log("ROCK!");
        this.gesture = "ROCK";
        return;
      }

      // scissors
      // check if all fingers except index and middle finger are folded and there is sufficient distance between the x coordinates of the index and middle fingers
      if (
        indexTipY < indexBaseY &&
        middleTipY < middleBaseY &&
        ringTipY > ringBaseY &&
        pinkyTipY > pinkyBaseY &&
        this.absoluteDistance(indexTipX, middleTipX) > 0.07
      ) {
        console.log("SCISSORS!");
        this.gesture = "SCISSORS";
        return;
      }

      // no gesture recognized
      this.gesture = "--";
    },
    absoluteDistance(coordinate1, coordinate2) {
      return Math.abs(coordinate1 - coordinate2);
    }
  },
  // executed after DOM has been loaded
  mounted: async function () {
    console.log("MOUNTED!");
    // set canvas context for drawing
    this.canvasCtx = this.canvasElement.getContext("2d");

    // instantiate handpose ML model (taken from `./models/`, created and filled during build)
    const hands = new Hands({
      locateFile: (file) => {
        return `./models/${file}`;
        // alternative: use a CDN
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    // configure basic model options
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    // set prediction handler function
    hands.onResults(this.onResults);

    // instantiate and start camera object
    const camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await hands.send({ image: this.videoElement });
      },
      width: 1280,
      height: 720
    });
    camera.start();
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
  margin: 0;
  padding: 15px 0;
  background-color: lightseagreen;
}
nav h3 {
  margin-left: 20px;
}

.page {
  padding: 20px;
}

.video {
  width: 0;
  margin: 0;
}
</style>
