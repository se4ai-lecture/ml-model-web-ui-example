# Using an ML Model in a Web Frontend
(You can work in pairs, if you want to.)

Your task is to implement the basic image recognition functionality for the game "Rock Paper Scissors" (see https://en.wikipedia.org/wiki/Rock_paper_scissors for more details).
This starting project already contains a basic web app written in [Vue.js](https://vuejs.org/guide/introduction.html), as well as the base prediction functionality using the [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) library from Google (based on TensorFlow.js).
Implement the necessary functionality in the `predictGesture()` function of `src/App.vue`.
To do this, get familiar with the [hand landmark model](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker#models) and devise rules to identify each of the three gestures (rock, paper, and scissors).
If you are stuck, you can consult the example from [Practical Machine Learning in JavaScript](https://link.springer.com/chapter/10.1007/978-1-4842-6418-8_5#Sec24), but careful: the chapter uses a slightly different Handpose library.

**Bonus task if you are quick:** implement the remaining functionality to play the game vs. the computer that chooses one of the three gestures, either randomly or using a more [advanced algorithm](https://towardsdatascience.com/how-to-win-over-70-matches-in-rock-paper-scissors-3e17e67e0dab).

## Prerequisites
- You need a webcam on your device.
- Download and install Node.js (https://nodejs.org/en/download).

## Usage

```bash
# install dependencies
npm install

# run dev server with hot reload --> http://localhost:8000/
npm start

# run eslint for code issues
npm run lint

# run prettier for formatting
npm run format

# create minified build for production --> ./dist/
npm run build
```
