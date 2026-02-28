self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker ativado");
});

self.addEventListener("fetch", (event) => {
  // Aqui podemos colocar cache no futuro
});
