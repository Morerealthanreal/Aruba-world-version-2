/** Binary min-heap for A*. Zero allocations after construction. */
export class MinHeap<T> {
  private data: T[] = [];
  private scores: number[] = [];
  private size = 0;

  constructor(capacity = 1024) {
    this.data = new Array(capacity);
    this.scores = new Array(capacity);
  }

  clear(): void {
    this.size = 0;
  }

  push(item: T, score: number): void {
    if (this.size >= this.data.length) {
      this.data.length = this.size * 2;
      this.scores.length = this.size * 2;
    }
    this.data[this.size] = item;
    this.scores[this.size] = score;
    this.bubbleUp(this.size++);
  }

  pop(): T | undefined {
    if (this.size === 0) return undefined;
    const top = this.data[0];
    this.size--;
    if (this.size > 0) {
      this.data[0] = this.data[this.size];
      this.scores[0] = this.scores[this.size];
      this.bubbleDown(0);
    }
    return top;
  }

  get length(): number {
    return this.size;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.scores[p] <= this.scores[i]) break;
      this.swap(i, p);
      i = p;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.size;
    while (true) {
      let s = i;
      const l = i * 2 + 1;
      const r = l + 1;
      if (l < n && this.scores[l] < this.scores[s]) s = l;
      if (r < n && this.scores[r] < this.scores[s]) s = r;
      if (s === i) break;
      this.swap(i, s);
      i = s;
    }
  }

  private swap(a: number, b: number): void {
    const td = this.data[a];
    this.data[a] = this.data[b];
    this.data[b] = td;
    const ts = this.scores[a];
    this.scores[a] = this.scores[b];
    this.scores[b] = ts;
  }
}
