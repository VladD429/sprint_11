class API {
  constructor(options) {
    this.url = options.baseUrl;
    this.headers = options.headers;
  }

  getResponseJson(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  /* Надо исправить: обработка ошибок должна быть в самом конце цепочки then
    Если она будет в середине, то ошибка обработается и выполнение будет продолжено как будто ошибок не было
    Например должно быть так:

      getUserData() {
        return fetch(`${this.baseUrl}/users/me`,{ // <-- возвращаем промис с данными
          headers: this.headers
        })
        .then(getResponseJson
      }

      Использование метода:
        api.getUserData()
        .then((obj) => {
          ....................
        })
        .catch((err) => console.log(err));  // <-- обработка ошибок здесь, в самом конце цепочки then
      }

    */

  /* Можно лучше: методы получились слишком абстрактные, из за этого при из вызове требуется передать адрес ендпонита.
  Получается, что другие части программы знают какие данные по какому эндпоиту лежат, это не совсем верно т.к. 
  обмен с сервером - ответственность класса Api и об этом должен знать только он.
  Лучше создать дополнительно по методы для каждого запроса: getUserData   getCards   patchProfile и прописать эндпоинты в них 
  */
  getData() {
    return fetch(`${this.url}/users/me`, {
      headers: this.headers,
    })
      /* Можно лучше: можно записать так .then(this.getResponseJson)  */
      .then(this.getResponseJson);
  }

  getCards() {
    return fetch(`${this.url}/cards`, {
      headers: this.headers,
    })
      .then(this.getResponseJson);
  }

  patchPromise(name, about) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(this.getResponseJson);
  }
}