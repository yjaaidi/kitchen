export function assertNonNullable<T>(
  value: T,
  message: string
): NonNullable<T> {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
