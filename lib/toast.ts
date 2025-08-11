import { showToast } from "nextjs-toast-notify";

export type ToastType = "success" | "error" | "warning" | "info";

export const handleShowToast = (text: string, type: ToastType = "success") => {
    showToast[type](text, {
        duration: 2000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
    })
}