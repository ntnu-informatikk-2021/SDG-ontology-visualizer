class Queue {
  private queue: Array<number>;
  private maxLength: number;
  private head: number;
  private tail: number;

  constructor(maxLength: number) {
    this.maxLength = maxLength;
    this.queue = [];
    this.head = 0;
    this.tail = 0;
  }

  enqueue(item: number) {
    this.queue[this.head] = item;
    this.head = (this.head + 1) % this.maxLength;
    if (this.head === this.tail) this.tail = (this.tail + 1) % this.maxLength;
  }

  dequeue(): number | undefined {
    if (this.head === this.tail) return undefined;

    const item = this.queue[this.tail];
    this.tail = (this.tail + 1) % this.maxLength;
    return item;
  }

  length() {
    if (this.head >= this.tail) return this.head - this.tail + 1;
    return this.head + (this.queue.length - this.tail) + 1;
  }

  peek() {
    return this.queue[this.tail];
  }
}

export default Queue;
