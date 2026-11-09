/** One task – the data model of the whole project. */
export interface Task {
  id: number;
  title: string;
  notes: string;
  done: boolean;
}

/** What the form edits: a task without id and status – the store adds those. */
export type TaskDraft = Pick<Task, 'title' | 'notes'>;
