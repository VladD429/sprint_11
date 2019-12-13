class CardList {
  constructor(container, cardsArray) {
    this.container = container;
    this.cardsArray = cardsArray;
    /*this.render = this.render.call(this);*/
  }
  addCard(name, link) {
    const { cardElement } = new Card(name, link);
    this.container.appendChild(cardElement);
  }
  render() {
    for (let i = 0; i <= this.cardsArray.length - 1; i++) {
      this.addCard(this.cardsArray[i].name, this.cardsArray[i].link);
    }
  }
}