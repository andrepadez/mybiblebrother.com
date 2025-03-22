type Task = () => Promise<any>;
type TaskCallback = (result: any) => void;

export class Queue {
  private queue: { task: Task; callback?: TaskCallback }[] = [];
  private isProcessing = false;

  async add(task: Task, callback?: TaskCallback): Promise<void> {
    this.queue.push({ task, callback });
    await this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const { task, callback } = this.queue.shift()!;
      try {
        const result = await task(); // Get the result of the task
        if (callback) callback(result); // Pass the result to the callback
        await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for 1 second
      } catch (error) {
        console.error("Task failed:", error);
      }
    }
    this.isProcessing = false;
  }
}
