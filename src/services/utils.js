import { toastController } from "@ionic/vue";

const presentToast = async function (
  position = "top" | "middle" | "bottom",
  message,
  status
) {
  const toast = await toastController.create({
    message: `${message}`,
    duration: 1500,
    position: position,
    color: status,
    cssClass: "toast-custom-class",
  });
  await toast.present();
};

export { presentToast };
