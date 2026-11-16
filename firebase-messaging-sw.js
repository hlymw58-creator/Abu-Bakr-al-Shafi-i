// ملف لازم يتحط في نفس مكان index.html (الجذر) بالاسم ده بالظبط.
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
  "push-config.js"
);

firebase.initializeApp(self.PUSH_CONFIG.firebase);
var messaging = firebase.messaging();

// الإشعار بيوصل "data فقط" من السيرفر، وإحنا اللي بنعرضه هنا (يشتغل والمنصة مقفولة)
messaging.onBackgroundMessage(function (payload) {
  var d = (payload && payload.data) || {};
  return self.registration.showNotification(d.title || "منصة الشافعي الصغير", {
    body: d.body || "",
    icon: "favicon.png",
    badge: "favicon-48.png",
    tag: d.tag || undefined,
    dir: "rtl",
    lang: "ar",
    data: { url: d.url || "./" }
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      return clients.openWindow(url);
    })
  );
});
