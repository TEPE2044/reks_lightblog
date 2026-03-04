export const formatPlayerTime = (time: number) => {
  // 计算小时、分钟、秒
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

    // padStart 如果不足两位在头部补充0
  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    // HH:MM:SS 格式
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    // MM:SS 格式
    return `${pad(minutes)}:${pad(seconds)}`;
  }
};
