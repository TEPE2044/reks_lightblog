import { defineStore } from "pinia";
import type { EventSnapshot } from "../Utils/reks-interface";
import { ref } from "vue";
import { useToggle } from "@vueuse/core";

export const noticeStore = defineStore('notice',() => {
    const latest = ref<EventSnapshot|null>(null)
    const [isNew,toggleNew] = useToggle()
    const setLatest = (event: EventSnapshot | null) => {
        latest.value = event
        toggleNew()
    }
    const readAlready = () => {{
        isNew.value = true
    }}

    return {
        latest,
        isNew,
        setLatest,
        readAlready
    }
})