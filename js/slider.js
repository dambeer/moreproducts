function startSlider(
  sliderItem,
  countSteps = 0,
  vertical = false,
  marginBetweenItems = 0,
  responsiveArray = null
) {
  // Объявление необходимых элементов DOM
  const slider = document.querySelector(sliderItem);
  const navSliderItems = slider.getElementsByClassName('slider__item');
  const contentList = slider.children[1];
  const contentItems = contentList.querySelectorAll('li');
  // Количество перемещений по элементу навигации слайдера,
  // countSteps Равен соответственно === индексу массива contentItems (.slider__item)
  // Текущий элемент массива контента
  let currentContentItem = contentItems[countSteps];

  // -------------Установка начальных стилей-------------
  if (responsiveArray) {
    let breakpointIndex = -1;
    responsiveArray.forEach(({ breakpoint } = item, index) => {
      if (breakpoint >= window.innerWidth) {
        //   console.log(window.innerWidth);
        //   console.log(setCountSteps, setVertical, setMarginBetweenItems);
        breakpointIndex = index;
      }
    });
    //Do you have at least one appropriate breakpoint?
    // Подошёл ли хоть один брейкпоинт?
    if (breakpointIndex === -1) {
      // Not found - we continue to work in a function - we initialize the slider
      // Не найдено - продолжаем работу в функции - инициализируем слайдер
      initSlider(
        slider,
        countSteps,
        navSliderItems,
        vertical,
        marginBetweenItems,
        contentList,
        currentContentItem,
        contentItems
      );
    } else {
      // Breakpoint found - call a function with new parameters adapted to the size of the screen
      // Breakpoint найден - вызываем функцию с новыми параметрами, адаптированными под размер экрана
      const {
        settings: {
          countSteps: setCountSteps = 0,
          vertical: setVertical = false,
          marginBetweenItems: setMarginBetweenItems = 0,
        },
      } = responsiveArray[breakpointIndex];
      startSlider(
        sliderItem,
        setCountSteps,
        setVertical,
        setMarginBetweenItems
      );

      return;
    }
  } else {
    initSlider(
      slider,
      countSteps,
      navSliderItems,
      vertical,
      marginBetweenItems,
      contentList,
      currentContentItem,
      contentItems
    );
  }
  // --------------------------------------------------
  //Обрабатываем нажатия по кнопкам (всплытие)
  /* The above code is handling the click event on a slider element. It contains logic to navigate
through the slider items and update the active item based on the button or slider item that was
clicked. It also updates the height or width of the slider content based on the current active item.
---
 Приведенный выше код обрабатывает событие Click на элементе слайдера. Он содержит логику для навигации через элементы ползунка и обновит активный элемент на основе кнопки или элемента ползунка, который был
щелкнул. Он также обновляет высоту или ширину содержания слайдера на основе текущего активного элемента.*/

  slider.addEventListener('click', function (e) {
    const button = e.target.closest('button');
    const arrayButtons = [
      ...navSliderItems[0].parentElement.querySelectorAll('button'),
    ];
    // Элементы навигации слайдера

    // Moving button (Arrow)
    // Кнопка перемещения (arrow)
    if (button.classList.contains('slider__button')) {
      // We determine which of the two are pressed
      // Определяем на какую из двух нажали
      e.target.closest('button').classList.contains('prev')
        ? (() => {
            // Переключаем выделение назад
            if (countSteps !== 0) {
              button.nextElementSibling.removeAttribute('disabled');
              // Текущий элемент слайда навигации - 1
              --countSteps;
              //  Add `--active` active navigation element. Добавляем `--active` активному элементу навигации.
              navSliderItems[countSteps].classList.toggle(
                'slider__item--active'
              );
              // We remove `--active` the previous slide navigation. Убираем `--active` у предыдущего слайда навигации
              navSliderItems[countSteps + 1].classList.toggle(
                'slider__item--active'
              );

              contentList.style.transform = getTransformSliderContent(
                countSteps + 1,
                countSteps,
                contentList,
                contentItems,
                vertical,
                marginBetweenItems
              )[1];
              // contentItems[countSteps + 1].setAttribute('hidden', '');
              // contentItems[countSteps].removeAttribute('hidden');
            }
          })()
        : (() => {
            // Переключаем выделение вперед
            if (navSliderItems.length - 1 > countSteps) {
              button.previousElementSibling.removeAttribute('disabled');
              // Текущий элемент слайда навигации + 1
              ++countSteps;

              navSliderItems[countSteps].classList.toggle(
                'slider__item--active'
              );
              navSliderItems[countSteps - 1].classList.toggle(
                'slider__item--active'
              );
              contentList.style.transform = getTransformSliderContent(
                countSteps - 1,
                countSteps,
                contentList,
                contentItems,
                vertical,
                marginBetweenItems
              )[1];
              // contentItems[countSteps - 1].setAttribute('hidden', '');
              // contentItems[countSteps].removeAttribute('hidden');
            }
          })();

      if (countSteps === 0) {
        button.setAttribute('disabled', '');
      }
      if (navSliderItems.length - 1 === countSteps) {
        button.setAttribute('disabled', '');
      }
    }

    // Change slides and navigation buttons slider. Меняем слайды и кнопки навигации слайдера
    // The pressed button is a side element of the slider switch (arrow). Нажатая кнопка является боковым элементом переключения слайдера (стрелочки)
    if (button.closest('.slider__item')) {
      //   console.log(arrayButtons);
      button
        .closest('.slider__wrapper')
        .children[1].removeAttribute('disabled');
      button
        .closest('.slider__wrapper')
        .children[2].removeAttribute('disabled');

      // Reduction of the slide. Перестановка слайда
      //   console.log(countSteps, ' ', arrayButtons.indexOf(button));
      contentList.style.transform = getTransformSliderContent(
        countSteps,
        arrayButtons.indexOf(button),
        contentList,
        contentItems,
        vertical,
        marginBetweenItems
      )[1];
      navSliderItems[countSteps].classList.toggle('slider__item--active');
      // Change the current active slide counter. Меняем текущий счётчик активного слайда
      countSteps = arrayButtons.indexOf(button);
      navSliderItems[countSteps].classList.toggle('slider__item--active');

      if (countSteps === 0) {
        button
          .closest('.slider__wrapper')
          .children[1].setAttribute('disabled', '');
      }
      if (navSliderItems.length - 1 === countSteps) {
        button
          .closest('.slider__wrapper')
          .children[2].setAttribute('disabled', '');
      }
    }

    // Update the element of the Slider content element
    // Обновить индекс элемента контента слайдера
    currentContentItem = contentItems[countSteps];
    //Update the height or width of the <ul></ul> content element
    // Обновить высоту или ширину элемента контента <ul></ul>
    if (vertical === true) {
      slider.style.maxHeight = `${currentContentItem.offsetHeight}px`;
    } else {
      contentList.style.maxWidth = `${currentContentItem.offsetWidth}px`;
    }
  });
}

/**
 ** The function initializes a slider by setting the overflow property of the slider element to 'hidden'
 * and the transform property of the contentList element to 'translate(0)'.
 * @param slider - The slider parameter is the element that contains the content list. It is the
 * container element for the slider functionality.
 * @param contentList - The contentList parameter is the element that contains the list of content
 * items that will be displayed in the slider.
 ---
 ** Функция инициализирует слайдер, установив свойство переполнения элемента ползунка на 'hidden'
 * и свойство transform элемента контента в 'translate(0)'.
 * @param slider - Параметр слайдера - это элемент, который содержит список контента. Это
 * Элемент контейнера для функциональности слайдера.
 * @param contentList - Параметр ContentList - это элемент, который содержит список контента
 * Предметы, которые будут отображаться в слайдере.
 */
function initSlider(
  slider,
  countSteps,
  navSliderItems,
  vertical,
  marginBetweenItems,
  contentList,
  currentContentItem,
  contentItems
) {
  slider.style.overflow = 'hidden';
  contentList.style.willChange = 'transform';
  contentList.style.transform = 'translate(0)';
  navSliderItems[countSteps].classList.toggle('slider__item--active');
  contentList.style.transform = getTransformSliderContent(
    0,
    countSteps,
    contentList,
    contentItems,
    vertical,
    marginBetweenItems
  )[1];
  /* This code block is responsible for setting the initial styles of the slider based on the `vertical`
parameter.
---
 Этот блок кода отвечает за установку начальных стилей ползунка на основе параметра `vertical`. */
  if (vertical === true) {
    slider.style.maxHeight = `${currentContentItem.offsetHeight}px`;
    /* The code block `contentItems.forEach((item) => { ... })` is iterating over each item in the
    `contentItems` array and setting the `margin-bottom` style property for each item. 
    ---
     Кодовый блок`contentItems.forEach((item) => { ... })`итерируется по каждому элементу в `contentItems` массиве и устанавливает `margin-bottom` свойство стиля для каждого предмета. */
    contentItems.forEach((item) => {
      // margin-bottom считаем в ручную, так как по-умолчанию % высчитывался от ширины
      item.style.marginBottom = `${
        item.offsetHeight * (marginBetweenItems / 100)
      }px`;
    });
  } else {
    // Заметка - li элементам слайда должен иметь min-width или слипнутся
    contentList.style.width = `${currentContentItem.offsetWidth}px`;
    contentList.style.display = 'flex';
    contentItems.forEach((item) => {
      item.style.marginRight = `${marginBetweenItems}%`;
      item.style.minWidth = '100%';
    });
  }
}

/**
 * * The function `getTransformSliderContent` calculates the accumulated translation value and the new
 * transform value based on the number of steps to move in the slider.
 * @param countStepsPrev - The `countStepsPrev` parameter represents the number of steps (or slides) to
 * move backwards from the current slide. It indicates how many slides to go back in the slider
 * navigation.
 * @param countStepsNext - The `countStepsNext` parameter represents the number of steps to move
 * forward in the slider. It determines how many slides to skip ahead when navigating the slider.
 * @returns The function `getTransformSliderContent` returns an array with three elements:
 * `accumulateTranslate`, a string representing the CSS transform value, and `currentTranslateValue`.
 * ---
 ** Функция `getTransformSliderContent` вычисляет накопленное значение `transform: translation` и новое
 * `transform: translation` значения на основе количества шагов для перемещения на слайдере.
 * @param countStepsPrev - Параметр `countStepsPrev` представляет количество шагов (или слайдов) до
 * Двигайтесь назад от текущего слайда, если идём от большего к меньшему.
 * @param countStepsNext - Параметр `countepsnext` представляет количество шагов для перемещения
 * вперед в слайдере.Он определяет, сколько слайдов пропустить вперед при навигации по слайдеру.
 * @returns Функция `getTransformSliderContent` возвращает массив с тремя элементами:
 * расстояние между двумя элементами (countStepsPrev, countStepsNext) `accumulatetranslate`, строка, представляющая значение `transform` CSS, и` currentTransLateValue` - текущее значение transform: translate.
 */
function getTransformSliderContent(
  countStepsPrev,
  countStepsNext,
  contentList,
  contentItems,
  vertical,
  marginBetweenItems
) {
  const currentTranslateValue =
    +contentList.style.transform.match(/[-.0-9]+(?=px)|0/)[0];
  let accumulateTranslate = 0;

  if (countStepsPrev < countStepsNext) {
    for (let index = countStepsPrev; index < countStepsNext; ++index) {
      // Минус, т.к. контент уходит справа налево при смене слайда навигации слева направо

      vertical
        ? (accumulateTranslate -=
            contentItems[index].offsetHeight +
            (marginBetweenItems / 100) * contentItems[index].offsetHeight)
        : ((accumulateTranslate -=
            (contentItems[index].offsetWidth +
              (marginBetweenItems / 100) * contentItems[index].offsetWidth) *
            (countStepsNext - countStepsPrev)),
          (index = countStepsNext));
      //   console.log(
      //     `${contentItems[index].offsetHeight}+(${marginBetweenItems} / 100) * ${contentItems[index].offsetHeight} = ${accumulateTranslate}`
      //   );
    }
  } else {
    // От большего по значению слайда до меньшего
    for (let index = countStepsPrev; countStepsNext < index; --index) {
      vertical
        ? (accumulateTranslate +=
            contentItems[index - 1].offsetHeight +
            (marginBetweenItems / 100) * contentItems[index - 1].offsetHeight)
        : ((accumulateTranslate +=
            (contentItems[index - 1].offsetWidth +
              (marginBetweenItems / 100) *
                contentItems[index - 1].offsetWidth) *
            (countStepsPrev - countStepsNext)),
          (index = countStepsNext));
      //   console.log(
      //     `${contentItems[index].offsetHeight}+(${marginBetweenItems} / 100) * ${contentItems[index].offsetHeight} = ${accumulateTranslate}`
      //   );
    }
  }
  return [
    accumulateTranslate,
    vertical
      ? `translateY(${accumulateTranslate + currentTranslateValue}px)`
      : `translateX(${accumulateTranslate + currentTranslateValue}px)`,
    currentTranslateValue,
  ];
}

// Заметка - li элементам слайда должен иметь min-width или слипнутся

/* Должна быть следующая вложенность 
.slider --- .slider__wrapper --- .slider__list --- .slider__item (.slider__item--active) --- button
                             --- button.slider__button .prev
                             --- button.slider__button .next
        --- ul.any__name --- li.any__name --- ...any...
        --- ...any...
 */
