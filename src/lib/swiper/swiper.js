/* eslint no-restricted-syntax: ["off", "ForOfStatement"] */
function Swiper(swiperContainer, options = null) {
  if (typeof swiperContainer === "string") {
    const elements = document.querySelectorAll(swiperContainer);

    if (elements.length > 1) {
      return [...elements].map((e) => new Swiper(e, options));
    }

    if (elements.length === 1) {
      return new Swiper(elements[0], options);
    }

    throw new Error("Invalid selector");
  } else if (
    swiperContainer instanceof HTMLElement &&
    swiperContainer.classList.contains("swiper")
  ) {
    this.swiper = swiperContainer;
  } else {
    throw new Error("Invalid swiperContainer");
  }

  this.swiperWrapper = this.swiper.querySelector(".swiper__wrapper");
  this.swiperSlides = this.swiperWrapper.children;

  this.btnPrev = this.swiper.querySelector("[data-slide='prev']");
  this.btnNext = this.swiper.querySelector("[data-slide='next']");

  this.btnPrevPressed = false;
  this.btnNextPressed = false;

  this.options = {
    auto: options?.auto ?? false,
    interval:
      options?.interval && typeof options.interval === "number"
        ? options.interval
        : null,
    reverse: options?.reverse ?? false,
    speed:
      options?.speed && typeof options.speed === "number" ? options.speed : 500,
  };

  this.nextActiveSlideIdx = null;

  [...this.swiperSlides].forEach((s, i) => {
    if (i === 0) {
      s.classList.add("active");
    }

    s.style.transitionDuration = `${this.options.speed}ms`; // eslint-disable-line no-param-reassign

    s.addEventListener("transitionstart", () => {
      if (!s.classList.contains("active")) {
        return;
      }

      const lastSlideIdx = this.swiperSlides.length - 1;

      if (this.btnPrevPressed) {
        this.nextActiveSlideIdx = i === 0 ? lastSlideIdx : i - 1;
        this.swiperSlides[this.nextActiveSlideIdx].classList.add(
          "swiper__slide_right"
        );
      } else if (this.btnNextPressed) {
        this.nextActiveSlideIdx = i === lastSlideIdx ? 0 : i + 1;
        this.swiperSlides[this.nextActiveSlideIdx].classList.add(
          "swiper__slide_left"
        );
      }
    });

    s.addEventListener("transitionend", () => {
      if (!s.classList.contains("active")) {
        return;
      }

      if (this.btnPrevPressed) {
        s.classList.remove("active", "swiper__slide_right");
        this.swiperSlides[this.nextActiveSlideIdx].classList.add("active");
        this.swiperSlides[this.nextActiveSlideIdx].classList.remove(
          "swiper__slide_prev",
          "swiper__slide_right"
        );

        this.btnPrevPressed = false;
      } else if (this.btnNextPressed) {
        s.classList.remove("active", "swiper__slide_left");
        this.swiperSlides[this.nextActiveSlideIdx].classList.add("active");
        this.swiperSlides[this.nextActiveSlideIdx].classList.remove(
          "swiper__slide_next",
          "swiper__slide_left"
        );

        this.btnNextPressed = false;
      }
    });
  });

  this.btnPrev.onclick = this.slidePrev.bind(this);
  this.btnNext.onclick = this.slideNext.bind(this);

  if (this.options.auto && this.options.interval) {
    setInterval(() => {
      if (this.options.reverse) {
        this.btnPrev.dispatchEvent(new Event("click"));
      } else {
        this.btnNext.dispatchEvent(new Event("click"));
      }
    }, this.options.interval);
  }
}

Swiper.prototype.slidePrev = function slidePrev() {
  if (
    this.btnPrevPressed ||
    this.btnNextPressed ||
    this.swiperSlides.length <= 1
  ) {
    return;
  }

  this.btnPrevPressed = true;

  const lastSlideIdx = this.swiperSlides.length - 1;

  for (const [i, s] of Object.entries(this.swiperSlides)) {
    if (s.classList.contains("active")) {
      const showedSlideIdx = +i === 0 ? lastSlideIdx : +i - 1;

      this.swiperSlides[showedSlideIdx].classList.add("swiper__slide_prev");
      s.classList.add("swiper__slide_right");

      break;
    }
  }
};

Swiper.prototype.slideNext = function slideNext() {
  if (
    this.btnPrevPressed ||
    this.btnNextPressed ||
    this.swiperSlides.length <= 1
  ) {
    return;
  }

  this.btnNextPressed = true;

  const lastSlideIdx = this.swiperSlides.length - 1;

  for (const [i, s] of Object.entries(this.swiperSlides)) {
    if (s.classList.contains("active")) {
      const showedSlideIdx = +i === lastSlideIdx ? 0 : +i + 1;

      this.swiperSlides[showedSlideIdx].classList.add("swiper__slide_next");
      s.classList.add("swiper__slide_left");

      break;
    }
  }
};

export default Swiper;
