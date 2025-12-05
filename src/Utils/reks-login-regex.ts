// 邮箱正则
const accountValidation = (account: string, password: string) => {
  try {
    if (
      account.length == 0 &&
      account.length > 2 &&
      password.length == 0 &&
      password.length < 6
    ) {
      return false;
    }
    var emailRegex =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    emailRegex.test(account) ? true : false;
  } catch (e) {
    console.warn("账号验证失败:", e);
    return false;
  }
};

// 手机号正则
const phoneValidation = (phone: string) => {
  try {
    // 请求
    var phoneRegex = /^1[3-9]\d{9}$/;

    phoneRegex.test(phone) ? true : false;
  } catch (e) {
    console.warn("手机号验证失败:", e);
    return false;
  }
};

export { accountValidation, phoneValidation };
