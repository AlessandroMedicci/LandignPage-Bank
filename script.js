'use strict';

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// Pop up message
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.prepend(message);
message.style.width = '120%';
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//Smooth scrolling
const scrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
scrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  const behave = { behavior: 'smooth' };
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  //section1.scrollIntoView({ behavior: 'smooth' });
});

// Event delegation

document.querySelectorAll('.nav__link').forEach(function (element) {
  element.addEventListener('click', function (e) {
    e.preventDefault();
    const selector = this.getAttribute('href');
    document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const selector = e.target.getAttribute('href');
    document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
  }
});
//Tabbed components
//Selecting
const opTabContainer = document.querySelector('.operations__tab-container');
const opTabsChildren = document.querySelectorAll('.operations__tab');
const opContent = document.querySelectorAll('.operations__content');
//Delegating
opTabContainer.addEventListener('click', function (btn) {
  const click = btn.target.closest('.operations__tab');
  if (!click) return;
  //Removing
  opTabsChildren.forEach(active =>
    active.classList.remove('operations__tab--active')
  );
  opContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //Adding
  click.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${click.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Shading out
const navParent = document.querySelector('.nav');

const mouseHoverHandler = function (element) {
  if (element.target.classList.contains('nav__link')) {
    const link = element.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibs => {
      if (sibs !== link) sibs.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};
navParent.addEventListener('mouseover', mouseHoverHandler.bind(0.5));
navParent.addEventListener('mouseout', mouseHoverHandler.bind(1));

//Sticky nav old way
/*
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) navParent.classList.add('sticky');
  else navParent.classList.remove('sticky');
});
*/
//Sticky nav better way
const navHeight = navParent.getBoundingClientRect().height;
const stickNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navParent.classList.add('sticky');
  else navParent.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Uncovering sections using IntersectionObserver
const allSections = document.querySelectorAll('.section');
const toDoCallBack = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const toDoSettings = {
  root: null,
  threshold: 0.15,
};
const observeAllSections = new IntersectionObserver(toDoCallBack, toDoSettings);
allSections.forEach(function (section) {
  observeAllSections.observe(section);
  section.classList.add('section--hidden');
});
//LazyLoading Images
const lazyImages = document.querySelectorAll('img[data-src]');
const imgSwitcher = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const switchingOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};
const lazyImgObserver = new IntersectionObserver(imgSwitcher, switchingOptions);

lazyImages.forEach(target => lazyImgObserver.observe(target));

//Slider component
//Selecting elements
const slides = document.querySelectorAll('.slide');
const slideRight = document.querySelector('.slider__btn--right');
const slideLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');
//Creating variables
let currentSlide = 0;
let lastslide = slides.length;
//Creating functions
const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};
const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const displaySlides = function (slide) {
  slides.forEach(
    (sl, order) =>
      (sl.style.transform = `translateX(${100 * (order - slide)}%)`)
  );
};
const nextSlide = function () {
  if (currentSlide === lastslide - 1) currentSlide = 0;
  else currentSlide++;
  displaySlides(currentSlide);
  activateDots(currentSlide);
};
const prevSllide = function () {
  if (currentSlide === 0) currentSlide = lastslide - 1;
  else currentSlide--;
  displaySlides(currentSlide);
  activateDots(currentSlide);
};
const init = function () {
  displaySlides(0);
  createDots();
  activateDots(0);
};
init();
//Creating eventHandlers
slideRight.addEventListener('click', nextSlide);
slideLeft.addEventListener('click', prevSllide);
document.addEventListener('keydown', function (press) {
  press.key === 'ArrowRight' && nextSlide();
  press.key === 'ArrowLeft' && prevSllide();
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    displaySlides(slide);
    activateDots(slide);
  }
});
