/*!
  @author Mohamed Muntasir
  @link https://github.com/devmotheg
  */

const LOADING_PERCENTAGE_EL = document.querySelector(".loading-percentage"),
  LOADING_BACKGROUND_BAR_EL = document.querySelector(
    ".loading-background__bar"
  );

function grab() {
  "mousedown touchstart".split(" ").forEach(cE => {
    LOADING_PERCENTAGE_EL.firstElementChild.addEventListener(cE, function () {
      const CONTROLLER = new AbortController();
      let percentage = 0;
      this.classList.add("--grabbing");

      "mousemove touchmove".split(" ").forEach(cE => {
        this.addEventListener(
          cE,
          e => {
            const NEW_POS =
              (cE === "mousemove" ? e.clientX : e.touches[0].clientX) -
              this.parentNode.offsetLeft,
              END_POS = this.parentNode.offsetWidth;
            if (NEW_POS >= 0 && NEW_POS <= END_POS) {
              this.style.marginLeft = `${NEW_POS}px`;
              percentage =
                Math.floor((NEW_POS / this.parentNode.offsetWidth) * 100) + "%";
              this.setAttribute("data-percentage", percentage);
            }
          },
          { signal: CONTROLLER.signal }
        );
      });

      "mouseleave mouseup touchend".split(" ").forEach(cE => {
        this.addEventListener(
          cE,
          () => {
            this.classList.remove("--grabbing");
            CONTROLLER.abort();
            if (percentage) updateLoadingBar(percentage);
          },
          { signal: CONTROLLER.signal }
        );
      });
    });
  });
}

function updateLoadingBar(percentage) {
  const NUM =
    toNum(percentage) - toNum(LOADING_BACKGROUND_BAR_EL.style.width) < 0
      ? -1
      : 1,
    LOADING = setInterval(() => {
      if (LOADING_BACKGROUND_BAR_EL.style.width === percentage)
        clearInterval(LOADING);
      else
        LOADING_BACKGROUND_BAR_EL.style.width =
          toNum(LOADING_BACKGROUND_BAR_EL.style.width) + NUM + "%";
    }, 8);
}

function toNum(str) {
  return str.slice(0, str.length - 1) - "0";
}

grab();
