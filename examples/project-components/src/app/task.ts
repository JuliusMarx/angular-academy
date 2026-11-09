/** One task – the data model of the whole project. */
export interface Task {
  id: number;
  title: string;
  notes: string;
  done: boolean;
}
