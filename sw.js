//import idb from "idb";

var cacheID = "mws-restaruant-001";
let dbReady = false;

self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheID).then(cache => {
    return cache
      .addAll([
      "/",
      "/index.html",
      "/restaurant.html",
      "/review.html",
      "/css/basestyles.css",
      "/css/mainstyles.css",
      "/js/dbhelper.js",
      "/js/main.js",
      "/js/restaurant_info.js",
      "/js/review.js",
      "/img/na.png",
      "/js/register.js"
    ])
      .catch(error => {
        console.log("Caches open failed: " + error);
      });
  }));
});


self.addEventListener("fetch", event => {
  let cacheRequest = event.request;
  let cacheUrlObj = new URL(event.request.url);
  if (event.request.url.indexOf("restaurant.html") > -1) {
    const cacheURL = "restaurant.html";
    cacheRequest = new Request(cacheURL);
  }
  if (cacheUrlObj.hostname !== "localhost") {
    event.request.mode = "no-cors";
  }
  event.respondWith(
    caches.match(cacheRequest, {ignoreSearch :true}).then(response => {
      return(
        response ||
        fetch( event.request)
        .then(fetchResponse =>{
          return caches.open(cacheID)
          .then( cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
        .catch(error => {
          if(event.request.url.indexOf(".jpg"))
          return caches.match("/img/na.png");      
        return new Response("Application is not connected to the internet", {
          status :404,
          statusText :"Application is not connected to the internet "
        });
      })
      );
    })
  );
});
  