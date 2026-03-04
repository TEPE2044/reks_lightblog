// 邮箱正则
const emailValidation = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 手机号正则
const phoneRegex = (phone: string) => {
  try {
    // 请求
    var phoneR =
      /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[6]|17[0-8]|18[0-9]|19[8,9])\d{8}$/;
    return phoneR.test(phone);
  } catch (e) {
    console.warn("手机号验证失败:", e);
    return false;
  }
};

export { emailValidation, phoneRegex };
