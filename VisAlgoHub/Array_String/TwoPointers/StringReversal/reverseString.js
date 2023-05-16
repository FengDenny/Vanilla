const ReversalAnimation = {
  init() {
    this.inputCode = document.getElementById("input-code");
    this.outputCode = document.getElementById("output-code");
    this.intervalAnimationId = null;
    this.startPointer = document.getElementById("front-pointer");
    this.endPointer = document.getElementById("back-pointer");
  },

  animateStringReverse(charArray) {
    const length = charArray.length;
    let startIndex = 0;
    let endIndex = length - 1;

    this.pointers(charArray, startIndex, endIndex);
    
    this.intervalAnimationId = setInterval(() => {
      if (startIndex >= endIndex) {
        clearInterval(this.intervalAnimationId);
        setTimeout(() => {
          this.pointers(charArray, -1, -1); 
        }, 2000);
        return;
      }
      this.swapCharacters(charArray, startIndex, endIndex);
      startIndex += 1;
      endIndex -= 1;
      setTimeout(() => {
        this.pointers(charArray, startIndex, endIndex);
      }, 2000);

    }, 3000);

    setTimeout(() => {
      this.outputCode.classList.add("show-output");
    }, 0);
  },

  swapCharacters(array, left, right) {
    const temp = array[left];
    array[left] = array[right];
    array[right] = temp;
  },
  pointers(array, start, end) {
    const outputArray = array.map((char, index) => {
      let element = char;
      if (index === start) {
        element = `<span class="start-arrow">↓</span>${char}`;
      } else if (index === end) {
        element = `${char}<span class="end-arrow">↑</span>`;
      }
      return `"${element}"`;
    });
  
    const outputString = `[${outputArray.join(", ")}]`;
    this.outputCode.innerHTML = outputString;
  },  
  
  

  applyAnimation(array) {
    this.inputCode.textContent = JSON.stringify(array);
    const charArray = array.slice();
    this.outputCode.textContent = JSON.stringify(charArray);
    this.animateStringReverse(charArray);
  },

  createAnimation() {
    const animation = Object.create(ReversalAnimation);
    animation.init();
    return animation;
  },
};

const animation = ReversalAnimation.createAnimation();

const sr = ["D", "e", "n", "n", "y", "F"];

animation.applyAnimation(sr);
