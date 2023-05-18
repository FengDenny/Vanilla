const maxAverageSubI = {
  init: function(nums, k, delay) {
    this.nums = nums;
    this.k = k;
    this.delay = delay;
    this.numLength = nums.length;
    this.inputCode = document.getElementById("input-code");
    this.mathCode = document.getElementById("math-code");
    this.finalCode = document.getElementById("final-code");
    return this;
  },
  // Maximum Average Subarray I algorithm
  findMaxAverage: function(nums, k) {
    let sum = nums.slice(0, k).reduce((acc, num) => acc + num, 0);
    let maxAverage = sum / k;
    maxAverage = nums.slice(k).reduce((acc, num, i) => {
      sum = sum + num - nums[i];
      const currentAverage = sum / k;
      return Math.max(acc, currentAverage);
    }, maxAverage);

    return maxAverage;
  },

  simulateSlidingWindow: function() {
    return new Promise((resolve) => {
      this.inputCode.textContent = `[${this.nums.join(", ")}]`;
  
      const animateWindow = (start, end) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const currentWindow = this.nums
              .slice(start, end + 1)
              .map((num) => `[${num}]`)
              .join(", ");
            const code = `[${this.nums.slice(0, start).join(", ")}] _ ${currentWindow} _ [${this.nums.slice(
              end + 1
            ).join(", ")}]`;
            this.inputCode.textContent = code;
            resolve();
          }, this.delay);
        });
      };
  
      animateWindow(0, this.k - 1).then(() => {
        let maxAverage = this.findMaxAverage(this.nums.slice(0, this.k), this.k);
        this.mathCode.textContent = `${this.nums.slice(0, this.k).reduce((acc, num) => acc + num, 0)} / ${this.k} = ${maxAverage.toFixed(5)}`;
  
        const animateNextWindow = (startIndex) => {
          const endIndex = startIndex + this.k;
          if (endIndex >= this.numLength) {
            resolve(maxAverage);
            return;
          }
  
          animateWindow(startIndex + 1, endIndex).then(() => {
            const currentWindow = this.nums.slice(startIndex + 1, endIndex + 1);
            maxAverage = this.findMaxAverage(currentWindow, this.k);
            this.mathCode.textContent = `${currentWindow.reduce((acc, num) => acc + num, 0)} / ${this.k} = ${maxAverage.toFixed(5)}`;
            animateNextWindow(startIndex + 1);
          });
        };
  
        animateNextWindow(0);
      });
    });
  },
  

  displayFinalCode: function() {
    return new Promise((resolve) => {
      const maxAverage = this.findMaxAverage(this.nums, this.k);
      this.finalCode.textContent = maxAverage.toFixed(5);
      resolve(maxAverage);
    });
  },
  runSimulation: function() {
    this.simulateSlidingWindow().then(() => this.displayFinalCode());
  },
};


const nums = [1, 12, -5, -6, 50, 3];
const k = 4;
const delay = 3000;

maxAverageSubI.init(nums, k, delay).runSimulation();
