/* eslint no-restricted-syntax: ["off", "ForOfStatement"] */
/* eslint no-underscore-dangle: ["error", { "allow": ["_ontransitionstart", "_ontransitionend", "_parseOptions", "_setAutoSlideTimeoutID"] }] */

function _ontransitionstart(target, context) {
  if (!target.classList.contains("active")) {
    return;
  }

  const lastSlideIdx = context.swiperSlides.length - 1;
  const idx = [...context.swiperSlides].findIndex((slide) => slide === target);

  if (context.btnPrevPressed) {
    context.nextActiveSlideIdx = idx === 0 ? lastSlideIdx : idx - 1;
    context.swiperSlides[context.nextActiveSlideIdx].classList.add(
      "swiper__slide_right"
    );

    return;
  }

  if (context.btnNextPressed) {
    context.nextActiveSlideIdx = idx === lastSlideIdx ? 0 : idx + 1;
    context.swiperSlides[context.nextActiveSlideIdx].classList.add(
      "swiper__slide_left"
    );
  }
}

function _ontransitionend(target, context) {
  if (!target.classList.contains("active")) {
    return;
  }

  if (context.btnPrevPressed) {
    target.classList.remove("active", "swiper__slide_right");
    context.swiperSlides[context.nextActiveSlideIdx].classList.add("active");
    context.swiperSlides[context.nextActiveSlideIdx].classList.remove(
      "swiper__slide_prev",
      "swiper__slide_right"
    );

    context.btnPrevPressed = false;
    return;
  }

  if (context.btnNextPressed) {
    target.classList.remove("active", "swiper__slide_left");
    context.swiperSlides[context.nextActiveSlideIdx].classList.add("active");
    context.swiperSlides[context.nextActiveSlideIdx].classList.remove(
      "swiper__slide_next",
      "swiper__slide_left"
    );

    context.btnNextPressed = false;
  }
}

function _parseOptions(options) {
  return {
    auto: options?.auto ?? false,
    interval:
      options?.interval && typeof options.interval === "number"
        ? options.interval
        : null,
    reverse: options?.reverse ?? false,
    speed:
      options?.speed && typeof options.speed === "number" ? options.speed : 500,
  };
}

function _setAutoSlideTimeoutID(context) {
  if (!context.options.auto || !context.options.interval) {
    return;
  }

  clearTimeout(context.autoSlideTimeoutID);

  context.autoSlideTimeoutID = setTimeout(() => {
    if (context.options.reverse) {
      context.btnPrev.dispatchEvent(new Event("click"));
    } else {
      context.btnNext.dispatchEvent(new Event("click"));
    }
  }, context.options.interval);
}

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

  this.options = _parseOptions(options);

  this.nextActiveSlideIdx = null;

  [...this.swiperSlides].forEach((slide, i) => {
    if (i === 0) {
      slide.classList.add("active");
    }

    slide.style.transitionDuration = `${this.options.speed}ms`; // eslint-disable-line no-param-reassign

    slide.addEventListener("transitionstart", () =>
      _ontransitionstart(slide, this)
    );
    slide.addEventListener("transitionend", () =>
      _ontransitionend(slide, this)
    );
  });

  this.btnPrev.onclick = this.slidePrev.bind(this);
  this.btnNext.onclick = this.slideNext.bind(this);

  _setAutoSlideTimeoutID(this);
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

      _setAutoSlideTimeoutID(this);

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

      _setAutoSlideTimeoutID(this);

      break;
    }
  }
};

export default Swiper;
