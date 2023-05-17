const arraySquares = {

  init:function(input){
    this.input= input,
    this.squared= [],
    this.final= []
    this.squaredCode = document.getElementById('squared-code')
    this.inputCode = document.getElementById('input-code');
    this.finalCode = document.getElementById('final-code');
    return this
  },

  // Function to square each number in the input array
  squareNumbers: function() {
    this.squaredCode.textContent = JSON.stringify(this.squared);

    return new Promise((resolve) => {
      let currentIndex = 0;
      const animateSquared = () => {
        setTimeout(() => {
          if (currentIndex < this.input.length) {
            this.squared[currentIndex] = this.input[currentIndex] * this.input[currentIndex];
            this.squaredCode.textContent = JSON.stringify(this.squared);
            currentIndex++;
            animateSquared();
          } else {
            resolve();
          }
        }, 500);
      };

      animateSquared();
    });
  },

  // Function to sort the squared numbers in ascending order
  sortNumbers: function(nums) {
    let left = 0;
    let right = nums.length - 1;
    const sorted = [];

    for (let i = right; i >= 0; i--) {
      if (Math.abs(nums[left]) > Math.abs(nums[right])) {
        sorted[i] = nums[left];
        left++;
      } else {
        sorted[i] = nums[right];
        right--;
      }
    }

    return sorted;
  },

  // Function to display the simulation of squaring and sorting
  displaySimulation: async function() {
    
    this.inputCode.textContent = JSON.stringify(this.input);
    this.finalCode.textContent = JSON.stringify(this.final)

    // Simulate the process of squaring
    await this.squareNumbers();

    // Sort the squared numbers and display them one at a time
    const sorted = this.sortNumbers(this.squared);

    let currentIndex = sorted.length - 1;

    const displayNextNumber = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (currentIndex >= 0) {
            const number = sorted[currentIndex];
            this.final.unshift(number);
           this.finalCode.textContent = JSON.stringify(this.final);
            currentIndex--;
            resolve(displayNextNumber());
          }
        }, 500);
      });
    };

    await displayNextNumber();
  },
};

const nums = [-4, -1, 0, 3, 10]

arraySquares.init(nums).displaySimulation()

