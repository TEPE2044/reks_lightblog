type RNext = () => void | Promise<void>

export type {RNext}

// // 1. 会返回具体数据
// async function getUserName(): Promise<string> {
//   const res = await api.get('/user')
//   return res.data.name      // 盒子打开有字符串
// }

// // 2. 只返回“完成了”，不带数据
// async function logout(): Promise<void> {
//   await api.post('/logout') // 调用完就行，不需要返回内容
//   // 不写 return 等价于 return Promise<void>
// }
