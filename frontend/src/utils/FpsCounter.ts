import Queue from './Queue';

// Keeps track of the browser FPS by storing time stamps every animationFrame.
// This is used to skip frames for specific parts of the graph if there are performance issues
class FpsCounter {
  public fps: number;

  constructor() {
    this.fps = 0;
    this.fpsCounter();
  }

  fpsCounter = () => {
    const times = new Queue<number>(60);

    const refreshLoop = () => {
      window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length() > 1 && times.peek() <= now - 1000) {
          times.dequeue();
        }
        times.enqueue(now);
        this.fps = times.length();
        refreshLoop();
      });
    };
    refreshLoop();
  };
}

export default FpsCounter;
