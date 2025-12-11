import { defineStore } from "pinia"
import { ref } from "vue"

export const userStore = defineStore('user', () => {
    const puzzle_isSuccess = ref(false)
    const isLoggedIn = ref(false)

    const userLogin = (token:string) => {
        localStorage.setItem('token', token)
        isLoggedIn.value = true
    }

    const userLogout = () => {
        localStorage.removeItem('token')
        isLoggedIn.value = false
    }

    return {
        isLoggedIn,
        puzzle_isSuccess,
        userLogin,
        userLogout
    }
})