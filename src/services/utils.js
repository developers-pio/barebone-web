import { toastController } from "@ionic/vue";
import SecureStorage from "secure-web-storage";
// import CryptoJS from "crypto-js";

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
const secureStorage=function() {
    var CryptoJS = require("crypto-js");

  var SECRET_KEY = "123456";
  return new SecureStorage(localStorage, {
    hash: function hash(key) {
      // key = CryptoJS.SHA256(key, SECRET_KEY);

      return key.toString();
    },
    encrypt: function encrypt(data) {
      data = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);

      data = data.toString();

      return data;
    },
    decrypt: function decrypt(data) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);

      data = data.toString(CryptoJS.enc.Utf8);

      return JSON.parse(data);
    },
  });
}

export { presentToast,secureStorage  };
