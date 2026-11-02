export interface User {
  id: number;
  name: string;
  email: string;
}

const USERS: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com' },
  { id: 3, name: 'Grace Hopper', email: 'grace@example.com' },
];

/** Simulates a slow HTTP request that can be cancelled. */
export function fetchUser(id: number, abortSignal: AbortSignal): Promise<User> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const user = USERS.find((u) => u.id === id);
      if (user) resolve(user);
      else reject(new Error(`User ${id} not found`));
    }, 800);
    abortSignal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(abortSignal.reason);
    });
  });
}
