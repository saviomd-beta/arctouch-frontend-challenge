/* eslint-disable no-use-before-define */
const challenge = challenge || {};
/* eslint-enable no-use-before-define */

challenge.carousel = (function () {
	const carousels = document.querySelectorAll('.js-carousel');

	for (const carousel of carousels) {
		const carouselList = carousel.querySelector('ul');
		const carouselListItems = carouselList.querySelectorAll('li');
		carouselList.classList.add('js-carousel__list');

		const navigate = function (index) {
			const carouselNavItems = carousel.querySelectorAll('.js-carousel__nav-item');
			for (const item of carouselListItems) {
				item.classList.remove('active');
			}
			for (const item of carouselNavItems) {
				item.classList.remove('active');
			}
			carouselListItems[index].classList.add('active');
			carouselNavItems[index].classList.add('active');
		};

		if (carouselListItems.length) {
			for (const item of carouselListItems) {
				item.classList.add('js-carousel__list-item');
			}
			carouselListItems[0].classList.add('active');

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
					navigate(item);
				});
				carouselNav.appendChild(navItem);
			}
			carousel.appendChild(carouselNav);
		}
	}
})();
