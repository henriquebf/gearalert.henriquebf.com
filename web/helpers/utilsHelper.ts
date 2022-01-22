type Name = string | undefined;

export const classNames = (names: Name[]): string => {
  return names.filter((n) => n).join(' ');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
