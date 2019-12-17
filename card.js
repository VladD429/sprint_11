export default class Card {
    /* Можно лучше: передавать в конструктор не параметры по отдельности, а сразу весь объект карточки
    т.к. в этом случае если в будущем у карточки появятся ещё какието данные не придется в программе менять везде 
    вызовы с Card(name, link)  на Card(name, link, someOtherData) , будет просто передаваться объект - Card(cardData)  */
    constructor(name, link) {
      this.cardElement = this.create(name, link);
      this.remove = this.remove.bind(this);
      this.like = this.like.bind(this);
  
      this.cardElement
        .querySelector('.place-card__like-icon')
        .addEventListener('click', this.like);
      this.cardElement
        .querySelector('.place-card__delete-icon')
        .addEventListener('click', this.remove);
    }
    like() {
      this.cardElement
        .querySelector('.place-card__like-icon').classList
        .toggle('place-card__like-icon_liked');
    }
    remove() {
      this.cardElement.remove();
    }
    create(nameValue, linkValue) {
      const placeCard = document.createElement("div");
      placeCard.classList.add("place-card");
      placeCard.innerHTML = `
        <div class="place-card__image">
          <button class="place-card__delete-icon"></button>
        </div>
        <div class="place-card__description">
          <h3 class="place-card__name"></h3>
          <button class="place-card__like-icon"></button>
        </div>`;
      placeCard.querySelector(".place-card__name").textContent = nameValue;
      placeCard.querySelector(".place-card__image").style.backgroundImage = `url(${linkValue})`;
      /*
        Альтернативный способ создания карточки. При нем не требуется создавать вручную все
        элементы с помощью createElement и пользовательские данные не вставляются через innerHTML
        const placeCard = document.createElement("div");
        placeCard.classList.add("place-card");
        placeCard.innerHTML = `
          <div class="place-card__image">
            <button class="place-card__delete-icon"></button>
          </div>
          <div class="place-card__description">
            <h3 class="place-card__name"></h3>
            <button class="place-card__like-icon"></button>
          </div>`;
        placeCard.querySelector(".place-card__name").textContent = place.name;
        placeCard.querySelector(".place-card__image").style.backgroundImage = `url(${place.link})`;
      */
      return placeCard;
    }
  }
  
  