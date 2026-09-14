const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const motionButton = document.querySelector(".motion-button");
const heroArt = document.querySelector(".hero-art");
const robotArt = document.querySelector(".robot-art");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

motionButton?.addEventListener("click", () => {
  const paused = document.body.classList.toggle("motion-paused");
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.textContent = paused ? "Motion off" : "Motion on";
});

heroArt?.addEventListener("pointermove", (event) => {
  if (document.body.classList.contains("motion-paused")) return;
  const rect = heroArt.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  robotArt?.style.setProperty("--ry", `${x * 8}deg`);
  robotArt?.style.setProperty("--rx", `${y * -8}deg`);
});

heroArt?.addEventListener("pointerleave", () => {
  robotArt?.style.setProperty("--ry", "0deg");
  robotArt?.style.setProperty("--rx", "0deg");
});
