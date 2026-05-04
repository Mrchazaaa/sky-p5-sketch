import { SCENE_CONSTANTS } from "../config/scene-constants.js";

const { cloud: CLOUD } = SCENE_CONSTANTS;

class Cloud {
  constructor(sketch, width, height, speed, startRandomly = false) {
    this.sketch = sketch;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.startRandomly = startRandomly;
    this.initialise();
  }

    initialise() {
      this.cloudPoints = [];
      this.cloudWidth = CLOUD.widthScale;
      this.cloudPointNum = Math.floor(
        Math.random() * (CLOUD.maxPoints - CLOUD.minPoints) + CLOUD.minPoints
      );

      const cloudPointMinWidth =
        (this.cloudWidth / (this.cloudPointNum - 1)) * CLOUD.minRadiusScale;
      const cloudPointMaxWidth = cloudPointMinWidth * CLOUD.maxRadiusScale;

      for (let i = 0; i < this.cloudPointNum; i += 1) {
        const ellipseRadius = this.createPointRadius(i, cloudPointMinWidth, cloudPointMaxWidth);
        const xOffset = this.cloudWidth * (i / this.cloudPointNum) * this.height;
        const radius = ellipseRadius * this.height;

        this.cloudPoints.push([xOffset, radius, ellipseRadius]);
      }

      this.lastTime = new Date();
      this.startingPointPx = -((this.cloudWidth + cloudPointMaxWidth) * this.height);
      this.startingPointPerc = this.startingPointPx / this.width;
      this.xPerc = this.startRandomly ? Math.random() : this.startingPointPerc;
      this.x = this.xPerc * this.width;

      this.yPerc = Math.random() * CLOUD.yRange;
      this.y = (this.height + 10 + cloudPointMaxWidth / 2) * this.yPerc;
    }

    createPointRadius(index, minWidth, maxWidth) {
      if (index === 0 || index === this.cloudPointNum - 1) {
        return minWidth;
      }

      if (index < Math.floor(this.cloudPointNum / 2)) {
        return Math.random() * ((maxWidth - minWidth) / 2) + minWidth;
      }

      if (index === Math.floor(this.cloudPointNum / 2) - 1) {
        return Math.random() * (maxWidth - minWidth) + minWidth;
      }

      return Math.random() * ((maxWidth - minWidth) / 2) + minWidth;
    }

    update(width, height) {
      const now = new Date();
      let timeDiff = (now - this.lastTime) / 1000;

      timeDiff = Math.min(timeDiff, CLOUD.maxTimeStepSeconds);

      const offset = (this.width / this.speed) * timeDiff;

      this.x += offset;
      this.xPerc = this.x / this.width;

      if (this.x >= this.width + this.cloudPoints[0][1] / 2) {
        const overshoot = this.x - (this.width + this.cloudPoints[0][1] / 2);
        this.startingPointPx =
          -((this.cloudWidth + this.cloudPoints[this.cloudPoints.length - 1][2]) * this.height);
        this.startingPointPerc = this.startingPointPx / this.width;
        this.xPerc = this.startingPointPerc - overshoot / this.width;
        this.x = this.xPerc * this.width;
      }

      this.lastTime = now;

      if (width !== this.width || height !== this.height) {
        this.resize(width, height);
      }
    }

    resize(width, height) {
      this.width = width;
      this.height = height;
      this.x = this.xPerc * this.width;
      this.y = this.height * this.yPerc;

      for (let i = 0; i < this.cloudPoints.length; i += 1) {
        this.cloudPoints[i][0] = this.cloudWidth * (i / this.cloudPointNum) * this.height;
        this.cloudPoints[i][1] = this.cloudPoints[i][2] * this.height;
      }
    }

    draw() {
      this.sketch.rect(
        this.cloudPoints[0][0] + this.x - this.cloudPoints[0][1] / 2,
        this.y - 1,
        this.cloudPoints[this.cloudPoints.length - 1][0] +
          this.cloudPoints[this.cloudPoints.length - 1][1] / 2 +
          this.cloudPoints[0][1] / 2,
        10,
        0,
        0,
        5,
        5
      );

      for (let i = 0; i < this.cloudPoints.length; i += 1) {
        this.sketch.arc(
          this.cloudPoints[i][0] + this.x,
          this.y,
          this.cloudPoints[i][1],
          this.cloudPoints[i][1],
          this.sketch.PI,
          0,
          this.sketch.CHORD
        );
      }
    }
  }

export class CloudLayer {
  constructor(sketch, width, height) {
    this.sketch = sketch;
    this.width = width;
    this.height = height;
    this.clouds = Array.from({ length: CLOUD.initialCount }, () => this.createCloud(true));
  }

    createCloud(startRandomly = false) {
      const speed = CLOUD.speeds[Math.floor(Math.random() * CLOUD.speeds.length)];
      return new Cloud(this.sketch, this.width, this.height, speed, startRandomly);
    }

    resize(width, height) {
      this.width = width;
      this.height = height;
      this.clouds.forEach((cloud) => cloud.resize(width, height));
    }

    draw(theme) {
      if (
        this.clouds.length < CLOUD.countLimit &&
        Math.random() < CLOUD.creationSuccessRate
      ) {
        this.clouds.push(this.createCloud());
      }

      this.sketch.noStroke();
      this.sketch.fill(theme.cloudColor);

      this.clouds.forEach((cloud) => {
        cloud.update(this.width, this.height);
        cloud.draw();
      });
    }
}
