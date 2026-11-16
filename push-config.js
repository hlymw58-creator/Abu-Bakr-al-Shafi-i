// ============ إعدادات الإشعارات (املأ القيم دي مرة واحدة) ============
// الملف ده بيتحمّل من الصفحة ومن firebase-messaging-sw.js، فاملأه في مكان واحد بس.
// القيم دي مش أسرار (Firebase بيعرضها في أي موقع)، فمفيش مشكلة إنها تبقى ظاهرة.
self.PUSH_CONFIG = {
  firebase: {
    apiKey: "PASTE_API_KEY",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    projectId: "PASTE_PROJECT_ID",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  },
  // Firebase Console > Project settings > Cloud Messaging > Web Push certificates > Generate key pair
  vapidKey: "PASTE_VAPID_KEY",
  // رابط Push.gs بعد ما تنشره كـ Web app (بينتهي بـ /exec)
  scriptUrl: "https://script.google.com/macros/s/AKfycbyX1pHUPZjruebHLINcjwKNVLTbCUXFAGrH4ypn_mn6SP4m1koNy0is297kQJTeDdyl3A/exec"
};
