import { defineStore } from "pinia"
import { ref } from "vue"

export const userStore = defineStore('user', () => {
    const puzzle_isSuccess = ref(false)
    const isLoggedIn = ref(false)

    const userLogin = () => {
        isLoggedIn.value = true
    }

    const userLogout = () => {
        isLoggedIn.value = false
    }

    return {
        isLoggedIn,
        puzzle_isSuccess,
        userLogin,
        userLogout
    }
})