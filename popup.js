class PopUp {
  constructor(element) {
    this.element = element;
    this.close = this.close.bind(this);
    this.element.querySelector('.popup__close').addEventListener('click', this.close);
  }
  open() {
    this.element.classList.add('popup_is-opened');
  }
  close() {
    this.element.classList.remove('popup_is-opened');
  }
}