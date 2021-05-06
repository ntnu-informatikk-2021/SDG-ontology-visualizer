/* 
  A simple Queue data structure, used for FpsCounter. Although a regular array would probably suffice, it just feels wrong to use arrays when we remove the elements from the start up to 60 times per second. Of course, JavaScript doesn't have support for Queues, so we made our own. 
*/
class Queue<T> {
  private queue: Array<T>;
  private maxLength: number;
  private head: number;
  private tail: number;

  constructor(maxLength: number) {
    this.maxLength = maxLength;
    this.queue = [];
    this.head = 0;
    this.tail = 0;
  }

  enqueue(item: T): void {
    this.queue[this.head] = item;
    this.head = (this.head + 1) % this.maxLength;
    if (this.head === this.tail) this.tail = (this.tail + 1) % this.maxLength;
  }

  dequeue(): T | undefined {
    if (this.head === this.tail) return undefined;

    const item = this.queue[this.tail];
    this.tail = (this.tail + 1) % this.maxLength;
    return item;
  }

  length(): number {
    if (this.head >= this.tail) return this.head - this.tail + 1;
    return this.head + (this.queue.length - this.tail) + 1;
  }

  peek(): T {
    return this.queue[this.tail];
  }
}

export default Queue;
