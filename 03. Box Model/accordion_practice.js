const easingFunctions = {
	// acceleration until halfway, then deceleration
	easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};

function animate({
	duration, timing, start, end, beforeDraw, draw, afterDraw, args,
}) {
	if (typeof beforeDraw === 'function') beforeDraw(args);

	const startTime = performance.now();

	requestAnimationFrame(function animation(time) {
		let timeFraction = (time - startTime) / duration; // timeFraction goes from 0 to 1
		if (timeFraction > 1) timeFraction = 1;
		const progress = timing(timeFraction); // current animation progress from 0 to 1
		const currentValue = (end - start) * progress + start; // current animation value

		draw(currentValue, args); // draw it

		if (timeFraction < 1) {
			requestAnimationFrame(animation);
		} else if (timeFraction === 1) {
			if (typeof afterDraw === 'function') afterDraw(args);
		}
	});
}

function toggleAccordion(e) {
	const { parentElement: parent, nextElementSibling: sibling } = e.target;
	const displayType = sibling.dataset.display || 'block';
	const labelClass = Array.from(parent.classList)
		.find((classText) => classText.includes('acc__'));
	const isActive = parent.classList.toggle(`${labelClass}--active`);
	const toggleIntent = isActive ? 'show' : 'hide';
	let startHeight = 0;
	let endHeight = 0;

	if (toggleIntent === 'show') {
		if (window.getComputedStyle(sibling).getPropertyValue('display') === 'none') {
			sibling.style.display = displayType;
		}

		startHeight = 0;
		endHeight = parseInt(window.getComputedStyle(sibling).getPropertyValue('height'), 10);
		sibling.style.display = 'none';
	} else {
		startHeight = parseInt(window.getComputedStyle(sibling).getPropertyValue('height'), 10);
		endHeight = 0;
		sibling.style.display = displayType;
	}

	animate({
		duration: 400,
		timing: easingFunctions.easeInOutQuad,
		start: startHeight,
		end: endHeight,
		beforeDraw: function beforeAnimation() {
			if (startHeight === 0) sibling.style.height = 0;
			sibling.style.display = displayType;
		},
		draw: function drawAnimation(currentValue) {
			sibling.style.height = `${currentValue}px`;
		},
		afterDraw: function afterAnimation() {
			if (endHeight === 0) sibling.style.display = 'none';
			sibling.style.height = null;
		},
	});
}

function initAccordion() {
	const categories = Array.from(document.querySelectorAll('.acc__button1'));

	for (const label of categories) {
		label.addEventListener('click', toggleAccordion);
	}
}

window.onload = function onload() {
	initAccordion();
};
