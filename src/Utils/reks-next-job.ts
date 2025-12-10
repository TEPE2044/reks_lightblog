type RNext = () => void | Promise<void>

export type {RNext}

// // 1. 符合 RNext 的同步例子
// const func1: RNext = () => {
//   console.log('hello')
//   // 没有 return，默认 void
// }

// // 2. 符合 RNext 的异步例子
// const func2: RNext = async () => {
//   await sleep(1000)
//   // async 函数默认返回 Promise<void>
// }
