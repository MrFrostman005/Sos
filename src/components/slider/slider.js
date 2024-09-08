import Swiper from 'swiper/bundle';

document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.swiper-container', {
        loop: true, // Бесконечный цикл
        slidesPerView: 1, // Один слайд за раз
        autoplay: {
            delay: 5000, // Задержка между слайдами
            disableOnInteraction: false, // Автопрокрутка не прекращается при взаимодействии
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet', // Класс для пагинации
            bulletActiveClass: 'swiper-pagination-bullet-active', // Активный класс
            renderBullet: (index, className) => {
                return `<span class="${className}"></span>`;
            },
        },
        on: {
            slideChangeTransitionStart: () => {
                resetAnimation();
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
        },
    });
  
    function resetAnimation() {
        const line = document.querySelector('.pagination-line:before');
        if (line) {
            line.style.animation = 'none';
            line.offsetHeight; // Трюк для перезапуска анимации
            line.style.animation = '';
        }
    }
});