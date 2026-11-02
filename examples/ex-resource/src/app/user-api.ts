export interface User {
  id: number;
  name: string;
}

const USERS: User[] = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Alan Turing' },
];

/** Simulates a slow HTTP request (you don't need to change this file). */
export function fetchUser(id: number, abortSignal?: AbortSignal): Promise<User> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const user = USERS.find((u) => u.id === id);
      if (user) resolve(user);
      else reject(new Error(`User ${id} not found`));
    }, 400);
    abortSignal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(abortSignal.reason);
    });
  });
}
