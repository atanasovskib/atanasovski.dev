(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const counter = document.getElementById("slide-counter");
  const progressBar = document.getElementById("progress-bar");
  if (!slides.length) return;

  let index = 0;

  function go(to) {
    if (to < 0 || to >= slides.length) return;
    slides[index].classList.remove("is-active");
    index = to;
    slides[index].classList.add("is-active");
    updateChrome();
    history.replaceState(null, "", "#slide-" + (index + 1));
  }

  function updateChrome() {
    if (counter) {
      counter.textContent = index + 1 + " / " + slides.length;
    }
    if (progressBar) {
      progressBar.style.width = ((index + 1) / slides.length) * 100 + "%";
    }
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  }

  function next() {
    go(index + 1);
  }

  function prev() {
    go(index - 1);
  }

  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides.length - 1);
    }
  });

  let touchX = null;
  document.addEventListener(
    "touchstart",
    function (e) {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  document.addEventListener(
    "touchend",
    function (e) {
      if (touchX === null) return;
      const dx = e.changedTouches[0].screenX - touchX;
      touchX = null;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true }
  );

  const hashMatch = location.hash.match(/slide-(\d+)/i);
  if (hashMatch) {
    const n = parseInt(hashMatch[1], 10) - 1;
    if (n >= 0 && n < slides.length) index = n;
  }

  slides[index].classList.add("is-active");
  updateChrome();
})();
