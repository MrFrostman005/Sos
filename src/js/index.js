document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.slider__link');
    const sections = {
        section1: document.getElementById('section1'),
        section2: document.getElementById('section2'),
        section3: document.getElementById('section3'),
        section4: document.getElementById('section4')
    };
    console.log(sections);

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const targetSection = sections[sectionId];

            if (targetSection) {
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - (window.innerHeight / 2) + (targetSection.offsetHeight / 2);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Обновляем активный элемент
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Обновление активного элемента при скролле
    window.addEventListener('scroll', function() {
        let index = Object.keys(sections).length;

        const offset = window.innerHeight / 2;

        while (--index && window.scrollY + offset < sections[Object.keys(sections)[index]].offsetTop - 50) {}

        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[index].classList.add('active');
    });
});

////Меню выбора языка
document.addEventListener('DOMContentLoaded', () => {
    const language = document.querySelector('.language');
    const languageButton = document.querySelector('.language__toggle');
    
    languageButton.addEventListener('click', () => {
      // Тогглим класс 'active' для открытия/закрытия списка
      language.classList.toggle('active');
    });
    
    // Дополнительно можно закрывать меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!language.contains(e.target)) {
        language.classList.remove('active');
      }
    });
  });