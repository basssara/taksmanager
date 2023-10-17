abstract class AbstractTask {
    name: string;
    time: number;
  
    constructor(id: string, time: number) {
      this.name = id;
      this.time = time;
    }
    abstract run(): Promise<unknown>;
  }
  
  class Task extends AbstractTask {
    constructor(name: string, time: number) {
      super(name, time);
    }
    async run(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        resolve(this.name);
      })
        .then((val) =>
          setTimeout(() => console.log(`resolved ${val}`), this.time)
        )
        .catch((err) => console.log("rejected", err));
    }
  }
  
  class TaskManager {
    private waiting: AbstractTask[] = [];
    private running: AbstractTask[] = [];
  
    constructor(private concurrency: number) {
      this.concurrency = concurrency; // concurrency parameter limit the numbers of tasks that can be executing in parallel.
    }
  
    push(tsk: AbstractTask) {
      this.waiting.push(tsk);
      if (this.running.length < this.concurrency) {
        this.next();
      } else {
        console.log(`${tsk.name} put on hold.`);
      }
    }
  
    private next() {
      const tk = this.waiting.shift();
      if (!tk) {
        if (!this.running.length) {
          console.log("All done!");
        }
        return;
      }
      this.running.push(tk);
      const runningTask = tk.run();
      console.log(`Currently running: ${this.running.map((v) => v.name)}`);
      runningTask.then(() => {
        this.running = this.running.filter((t) => t !== tk);
        console.log(`Currently running: ${this.running.map((v) => v.name)}`);
        this.next();
      });
    }
  }
  
  const a = new Task("A", 100);
  const b = new Task("B", 2000);
  const c = new Task("C", 400);
  const d = new Task("D", 5000);
  const e = new Task("E", 600);
  const manager = new TaskManager(3);
  manager.push(a);
  manager.push(b);
  manager.push(c);
  manager.push(d);
  manager.push(e);
  