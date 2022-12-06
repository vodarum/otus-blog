/* eslint no-use-before-define: ["error", { "functions": false }] */
Slider.prototype.slidePrev = function slidePrev(translateX) {
  const sliderWrapper = this.parentElement.querySelector(".slider__wrapper");
  const matchesTranslateX = sliderWrapper.style.transform.match(
    /(?<=translateX\()-*[\d]+(?=px\))/
  );
  const currentTranslateX = matchesTranslateX ? +matchesTranslateX[0] : 0;

  sliderWrapper.style.transform = `translateX(${
    currentTranslateX - translateX
  }px)`;
};

Slider.prototype.slideNext = function slideNext(translateX) {
  const sliderWrapper = this.parentElement.querySelector(".slider__wrapper");
  const matchesTranslateX = sliderWrapper.style.transform.match(
    /(?<=translateX\()-*[\d]+(?=px\))/
  );
  const currentTranslateX = matchesTranslateX ? +matchesTranslateX[0] : 0;

  sliderWrapper.style.transform = `translateX(${
    currentTranslateX + translateX
  }px)`;
};

function Slider(selector, options = null) {
  const elements = document.querySelectorAll(selector);

  if (elements.length === 0) {
    throw new Error("Invalid selector");
  }

  if (options) {
    this.options = {
      loop: options.loop ?? false,
      auto: options.auto ?? false,
      duration: options.duration ?? "500ms",
      slidesPerView: options.slidesPerView ?? 1,
      spaceBetween: (options.slidesPerView && options.spaceBetween) || 0,
    };
  }

  if (elements.length === 1) {
    this.slider = elements[0];
    this.sliderWrapper = this.slider.querySelector(".slider__wrapper");
    this.slides = this.sliderWrapper.children;
    this.slideControlPrev = this.slider.querySelector("[data-slide='prev']");
    this.slideControlNext = this.slider.querySelector("[data-slide='next']");

    const translateX = this.options
      ? this.options.slidesPerView * this.slides[0].scrollWidth
      : this.slides[0].scrollWidth;

    this.slideControlPrev.addEventListener("click", (event) =>
      this.slidePrev.call(event.target, translateX)
    );
    this.slideControlNext.addEventListener("click", (event) =>
      this.slideNext.call(event.target, translateX)
    );
  }
}
