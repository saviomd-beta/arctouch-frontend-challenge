/* eslint-disable no-use-before-define */
const challenge = challenge || {};
/* eslint-enable no-use-before-define */

challenge.carousel = (function () {
	const carousels = document.querySelectorAll('.js-carousel');

	for (const carousel of carousels) {
		const carouselList = carousel.querySelector('ul');
		const carouselListItems = carouselList.querySelectorAll('li');
		carouselList.classList.add('js-carousel__list');
		let carouselRotation = null;
		let currentItem = 0;

		// Change current visible item
		const navigate = function (index, stopRotation) {
			const carouselNavItems = carousel.querySelectorAll('.js-carousel__nav-item');
			for (const item of carouselListItems) {
				item.classList.remove('active');
			}
			for (const item of carouselNavItems) {
				item.classList.remove('active');
			}
			carouselListItems[index].classList.add('active');
			carouselNavItems[index].classList.add('active');
			currentItem = index;
			if (stopRotation) {
				clearInterval(carouselRotation);
			}
		};

		// Automatic carousel rotation
		const navigateToNext = function () {
			const index = (currentItem + 1 < carouselListItems.length ? currentItem + 1 : 0);
			navigate(index, false);
		};
		carouselRotation = setInterval(navigateToNext, 4000);

		// Set carousel height using a resize throttler
		let resizeTimeout;
		const setCarouselHeight = function () {
			if (!resizeTimeout) {
				resizeTimeout = setTimeout(() => {
					resizeTimeout = null;
					let carouselListHeight = 0;
					for (const item of carouselListItems) {
						if (item.offsetHeight > carouselListHeight) {
							carouselListHeight = item.offsetHeight;
						}
					}
					carouselList.style.height = `${carouselListHeight}px`;
				}, 100);
			}
		};
		window.onresize = setCarouselHeight;

		if (carouselListItems.length) {
			setCarouselHeight();

			// Show first carousel item
			for (const item of carouselListItems) {
				item.classList.add('js-carousel__list-item');
			}
			carouselListItems[0].classList.add('active');

			// Create carousel navigation
			const carouselNav = document.createElement('ol');
			carouselNav.classList.add('js-carousel__nav');
			for (const index of carouselListItems.keys()) {
				const navItem = document.createElement('li');
				navItem.classList.add('js-carousel__nav-item');
				if (index === 0) {
					navItem.classList.add('active');
				}
				navItem.setAttribute('data-item', index);
				navItem.addEventListener('click', function () {
					const item = this.getAttribute('data-item');
					navigate(item, true);
				});
				carouselNav.appendChild(navItem);
			}
			carousel.appendChild(carouselNav);
		}
	}
})();
