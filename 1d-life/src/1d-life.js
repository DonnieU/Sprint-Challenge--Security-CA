(function () {

  /**
   * For a given x coordinate, look at the surrounding values in
   * lifeState and figure out the new value.
   * 
   * lifeState is a 1D array of life values. 0 for dead, 1 for alive.
   * 
   * Life rules:
   * 
   *   Look at the x-1 (left), x (current). and x+1 (right) pixels.
   * 
   *   Careful: if x is < 1 then lifeState[x-1] is out of range! if x
   *   is >= lifeState.length - 1, lifeState[x+1] is out of range!
   * 
   *   (Out of range values are assumed to be 0.)
   * 
   *   Return the new pixel value at X depending on if the 3 pixels
   *   are on or off in a particular pattern.
   * 
   *   Surrounding    New   Return
   *       ...         .      0
   *       ..x         x      1
   *       .x.         x      1
   *       .xx         x      1
   *       x..         x      1
   *       x.x         x      1
   *       xx.         x      1
   *       xxx         .      0
   * 
   * Optimal solution is 5 lines of code, but you can use more if you
   * want to. :)
   * 
   * Hint 1: the short solution uses bit shifting and ORing.
   * 
   * Hint 2: Look at the pattern in "Surrounding", above. Remind you
   * of anything?
   * 
   * @param {*} x the current x coordinate in question
   */
  function getNewVal(lifeState, x) {
    const a = lifeState[x - 1];
    const b = lifeState[x];
    const c = lifeState[x + 1];

    // F(a, b, c) = (a and !c) or (!b and c) or (!a and b)
    // - Derived and simplified from truth table and Karnaugh map
    // return (a && !c) || (!b && c) || (!a && b);  // original and it works
    // return !((a && !c) || (!b && c) || (!a && b)); // interesting graphic

   /* Now I'm going to try...
   *   Surrounding    New   Return
   *       ...         .      0
   *       ..x         .      0
   *       .x.         x      1
   *       .xx         x      1
   *       x..         x      1
   *       x.x         x      1
   *       xx.         .      0
   *       xxx         .      0
   */
    // F(a, b, c) = (a and !b) or (!a and b):
    // return (a && !b) || (!a && b); // creates right triangle -- kinda neat!
   
  /* and inverse of above (sort of)...
   *   Surrounding    New   Return
   *       ...         x      1
   *       ..x         x      1
   *       .x.         .      0
   *       .xx         .      0
   *       x..         .      0
   *       x.x         .      0
   *       xx.         x      1
   *       xxx         x      1
   */
    // F(a, b, c) = (not a and not b) or (a and b)
    // return (!a && !b) || (a && b);  // creates color inverse of above!
    
  /* And now this...
   *   Surrounding    New   Return
   *       ...         x      1
   *       ..x         .      0
   *       .x.         x      1
   *       .xx         .      0
   *       x..         x      1
   *       x.x         .      0
   *       xx.         x      0
   *       xxx         .      1
   */
  // F(a, b, c) = not c:
  // return !c; // displays a "gray" image (alternating black and white lines though very small)

 /* And this...
   *   Surrounding    New   Return
   *       ...         x      1
   *       ..x         x      1
   *       .x.         x      1
   *       .xx         .      0
   *       x..         .      0
   *       x.x         x      1
   *       xx.         x      1
   *       xxx         x      1
   */
  // F(a, b, c) = (not a and not c) or (not b and c) or (a and b)
  return (!a && !c) || (!b && c) || (a && b); // a diagonal line sloping down and to the right
  }

  /**
   * Draw life
   */
  function drawLife() {

    // Get canvas info
    const canvas = document.querySelector('#life');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Get our double buffer life states
    const lifeState = [
      new Array(canvas.width).fill(0),
      new Array(canvas.width).fill(0),
    ];

    let curStateIdx = 0, backStateIdx = 1;
    let curState = lifeState[curStateIdx];
    let backState = lifeState[backStateIdx];

    curState[canvas.width >> 1] = 1; // >>1 is an integer div 2

    // Go through all our generations
    for (let generation = 0; generation < canvas.height; generation++) {

      // Go through all the pixels
      for (let x = 0; x < canvas.width; x++) {

        // Compute the new value
        let newVal = getNewVal(curState, x);
        backState[x] = newVal;

        index = (generation * canvas.width + x) * 4;

        color = newVal == 0? 0: 0xff;

        imageData.data[index+0] = color;
        imageData.data[index+1] = color;
        imageData.data[index+2] = color;
        imageData.data[index+3] = 0xff;

      }

      curStateIdx = curStateIdx == 0? 1: 0;
      backStateIdx = curStateIdx == 0? 1: 0;
      curState = lifeState[curStateIdx];
      backState = lifeState[backStateIdx];
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Handle window load
   */
  function onLoad() {
    drawLife();
  }
  
  // Main

	window.addEventListener('load', onLoad);

}());