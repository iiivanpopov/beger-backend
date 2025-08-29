export const hash = (password: string): Promise<string> =>
  Bun.password.hash(password)
export const compare = (
  password: string,
  passwordHash: string
): Promise<boolean> => Bun.password.verify(password, passwordHash)
