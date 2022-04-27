export function deepEqual(a: any, b: any): boolean {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val == b[index])
  )
}

export async function sleep(frames = 1) {
  for (let _ in [...Array(frames).keys()]) {
    await new Promise(requestAnimationFrame)
  }
}
