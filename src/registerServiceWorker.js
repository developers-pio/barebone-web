import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
  wb = new Workbox(`${process.env.BASE_URL}sw.js`);

  wb.addEventListener("controlling", () => {
    window.location.reload();
  });

  wb.register();
} else {
  wb = null;
}

// if ("setAppBadge" in navigator) {
//   let badgeCount = 24;
//   // set badge
//   navigator.setAppBadge(badgeCount).catch((error) => {
//     console.log(error);
//   });

//   // remove badge
//   // navigator.clearAppBadge().catch((error) => {
//   //   console.log(error);
//   // });
// }

export default wb;
