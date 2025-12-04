const accountValidation = (account:'string') => {
    try{
        //邮箱正则
        var emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        emailRegex.test(account)
        return true

    }catch(e){
        console.warn("账号验证失败:", e);
        return false;
    }
}

export { accountValidation };