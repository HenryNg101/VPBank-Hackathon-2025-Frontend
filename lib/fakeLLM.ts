export async function* getFakeResponseStream(input: string): AsyncGenerator<string> {
  const words = `Echo: ${input}`.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise((res) => setTimeout(res, 150));
  }
}
