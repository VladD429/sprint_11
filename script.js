import "./pages/index.css";
import API from './api.js';
import CardList from './cardlist.js';
import PopUp from './popup.js';

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5';
const api = new API({
  baseUrl: serverUrl,
  headers: {
    authorization: '6a4efc30-7d3d-4e8f-ba5d-868c10aa313e',
    'Content-Type': 'application/json'
  }
});
const placesList = document.querySelector('.places-list');
const popUp = document.querySelector('.popup');
const popUpEdit = document.querySelector('.popup__edit');
const popUpObject = new PopUp(popUp);
const editObject = new PopUp(popUpEdit);
const popUpButton = document.querySelector('.button');
const popUpEditButton = document.querySelector('.user-info__edit');
const imagePopUp = document.querySelector('.image-popup');
const formEdit = document.forms.edit;
const firstName = formEdit.elements.firstname;
const about = formEdit.elements.about;
const editButton = document.querySelector(".popup__button_edit");
const form = document.forms.new;
const link = form.elements.link;
const name = form.elements.name;
const newButton = document.querySelector(".popup__button_new");
const cardList = new CardList(placesList, []);

function unactive(firstInput, secondInput, button) {
  firstInput.addEventListener('input', () => {
    if (firstInput.value.length <= 1 || secondInput.value.length <= 1) {
      button.setAttribute('disabled', true);
      button.style.backgroundColor = "white";
      button.style.color = "rgba(0, 0, 0, .2)";
    } else {
      button.removeAttribute('disabled', true);
      button.style.backgroundColor = "black";
      button.style.color = "white";
    }
  });
}

function handleValidate(event) {
  validate(event.target);
}

function validate(element) {
  const error = document.querySelector(`.error-${element.name}`);
  if (element.value.length === 0) {
    error.textContent = 'Это обязательное поле';
    activateError(element);
  } else if (element.value.length === 1) {
    error.textContent = 'Должно быть от 2 до 30 символов';
    activateError(element);
  } else if (!element.checkValidity()) {
    error.textContent = 'Здесь должна быть ссылка';
    activateError(element);
  } else {
    element.parentNode.classList.remove('input__container_invalid');
  }
}

function activateError(element) {
  element.parentNode.classList.add('input__container_invalid');
}

popUpButton.addEventListener('click', function () {
  const button = document.querySelector(".popup__button");
  button.setAttribute('disabled', true);
  popUpObject.open();
});

popUpEditButton.addEventListener('click', function () {
  const userInfoName = document.querySelector('.user-info__name');
  const userInfoJob = document.querySelector('.user-info__job');

  firstName.setAttribute("value", userInfoName.textContent);
  about.setAttribute("value", userInfoJob.textContent);

  editObject.open();
});

document.forms.new.addEventListener('submit', function (event) {
  event.preventDefault();

  cardList.addCard(name.value, link.value);

  form.reset();

  popUpObject.close(popUp);
});

/*отправка данных для редактирования профиля*/
document.forms.edit.addEventListener('submit', (event) => {
  event.preventDefault();

  const { firstname, about } = event.currentTarget.elements;
  editButton.textContent = 'Загрузка...';

  api.patchPromise(firstname.value, about.value)
    /* Можно лучше: в ответ на отправку профиля пользователя сервер
           возвращает обновленные данные, нужно использовать их, а не делать запрос ещё раз*/
    .then((res) => {
      console.log(res);
    })
    .then(() => {
      document.querySelector('.user-info__name').textContent = firstname.value;
      document.querySelector('.user-info__job').textContent = about.value;
      editObject.close();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      editButton.textContent = 'Сохранить';
    })
  /* Надо исправить: обработка ошибок блоком catch должна быть здесь  */

  /* Можно лучше: задание для кнопки текста editButton.textContent = 'Сохранить';
     лучше поместить здесь в finally 
    Finally выполняется всегде, в независимости того была ли ошибка в цепочке then 
    https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
   */
});

/* Можно лучше: открытие попапа с картинкой тоже относится к функционалу карточки, так что
можно было добавить метод для этого в класс Card и отказаться от делегирования.
В этом случае проще было бы получать картинку которая должна открыться - не 
брать её из source.slice(5, (source.length - 2))
а просто запомнить в конструкторе класса Card (this.link = link ) 
*/
placesList.addEventListener('click', (event) => {
  if (event.target.classList.contains('place-card__image')) {
    const imageContent = document.querySelector('.image-popup__content');
    const source = event.target.style.backgroundImage;
    imagePopUp.classList.add('image-popup_is-open');
    imageContent.setAttribute('src', source.slice(5, (source.length - 2)));
  }
});

imagePopUp.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup__close_image')) {
    imagePopUp.classList.remove('image-popup_is-open');
  }
});

firstName.addEventListener('input', handleValidate);
about.addEventListener('input', handleValidate);
name.addEventListener('input', handleValidate);
link.addEventListener('input', handleValidate);

unactive(link, name, newButton);
unactive(name, link, newButton);
unactive(firstName, about, editButton);
unactive(about, firstName, editButton);

/*загрузки заданий 1 и 2*/
api.getData()
  .then((res) => {
    document.querySelector('.user-info__name').textContent = res.name;
    document.querySelector('.user-info__job').textContent = res.about;
    document.querySelector('.user-info__photo').style.backgroundImage = `url(${res.avatar})`;
  })
  .catch((err) => {
    console.log(err)
  });
/* Надо исправить: обработка ошибок блоком catch должна быть здесь  */

api.getCards()
  .then((res) => {
    /* Надо исправить: 
    при добавлении карточки падает ошибка
    ncaught ReferenceError: cardList is not defined
    at HTMLFormElement.<anonymous> (script.js:88)
    т.к. список карточек объявлен здесь, а не глобально.

    Нужно объявить его глобально, передав пустой массив, т.к. при запуске данные ещё не получены,
    а здесь добавлять карточки через метод addCard
    
    */
    for (let i = 0; i <= res.length - 1; i++) {
      cardList.addCard(res[i].name, res[i].link);
    }
  })
  .catch((err) => {
    console.log(err)
  });

  /* Надо исправить: обработка ошибок блоком catch должна быть здесь  */



/*
  Отлично, все замечания исправлены верно

  Если будет свободное время полезно будет ознакомиться с принципами SOLID
  применяемые для проектирования ООП программ https://ota-solid.now.sh/ ,
  а если уж совсем захотите погрузиться в то, как правильно проектировать
  программы, можете почитать про паттерны проектирования, вот неплохое
  руководство https://refactoring.guru/ru/design-patterns и там же хорошо
  про рефакторинг https://refactoring.guru/ru/refactoring
  Также, чтобы закрепить знания - недавно вышла отличная статья про ООП и SOLID https://habr.com/ru/post/446816/

  Успехов в дальнейшем обучении!
*/

/*
  В целом хорошая работа, необходимые классы созданы. Классы Card и CardList сделаны довольно хорошо,
  но класс Popup полоучился уж слишком простой, давайте это немного исправим передавая в конструктор класса
  элемент попапа, запоминая его и используя в методах open и close. При такоей реалищации
  нужно будет создавать экземплыр класса Popup для каждого попапа - добавления карточки, редактирования профиля, а не один
  на все попапы.

  При использовании классов важно уметь понимать проблему потери констекста в обработчиках
  и решать её с использованием bind или стрелочных функций
  https://learn.javascript.ru/bind#reshenie-2-privyazat-kontekst-s-pomoschyu-bind

*/


/*
Карточки с сервера приходят, данные пользователя тоже отображаются и редактируются,
отлично что класс Api вынесен в отдельный файл и сам не изменяет страницу, а только возвращает промисы.

Но есть следующие замечания:

Надо исправить:
- обработка ошибок должны быть в конце цепочки then
- при добавлении карточки падает ошибка, даже несмотря на то что они ещё не отправляются
на сервер, всеравно функционал не должен быть сломан

Можно лучше:
- в классе Api сделать метод для кажого эндпоинта
- изменение сосояния кнопки поместить в блок finally
- после отправки данных не вызывать api.getData(api.userUrl.first)
*/