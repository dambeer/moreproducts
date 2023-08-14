const buttonElement = document.querySelector('.nav__menu-btn');

buttonElement.addEventListener('click', function () {
  document.querySelector('.header').classList.toggle('header--active');
});

function toggleClass(element) {
  e.element.classList.toggle('slider__item--active');
}

startSlider('.header__slider', 0, true, 100, [
  { breakpoint: 630, settings: { vertical: false, marginBetweenItems: 50 } },
]);

startSlider('.product__content-slider', 0, true, 100, [
  { breakpoint: 560, settings: { vertical: false, marginBetweenItems: 50 } },
]);
