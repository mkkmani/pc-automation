export function generateRandomEmail() {
  const timestamp = Date.now();
  return `user${timestamp}@example.com`;
}

export function generateRandomPassword() {
  return `password${Math.floor(Math.random() * 10000)}`;
}
