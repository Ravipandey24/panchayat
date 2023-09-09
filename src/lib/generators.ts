export function generateRandomNumber({ digits }: { digits: number }) {
  const min = 10 * digits;
  const max = 10 * digits - 1;
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateRandomUsername(name: string | null | undefined) {
  return (name?.split(" ").join().replaceAll(",", "").toLowerCase() as string) +
    generateRandomNumber({ digits: 2 });
}
