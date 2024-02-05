class Api {
  constructor(options) {
    this._headers = options.headers;
    this._baseUrl = options.baseUrl;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  getProfileInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._getResponseData);
  }

  loadCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._getResponseData);
  }

  editProfile(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._getResponseData);
  }

  addCard(name, link) {
    console.log(name, link)
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._getResponseData);
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._getResponseData);
  }

  likeCard(id) {
    console.log(12321321323123121)
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this._getResponseData);
  }

  unlikeCard(id) {
    console.log(12321321321126)
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._getResponseData);
  }

  changeLikeCardStatus(id, isLiked) {
    return !isLiked ? this.likeCard(id) : this.unlikeCard(id);
  }

  changeAvatar(url) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: url,
      }),
    }).then(this._getResponseData);
  }
}

const api = new Api({
  // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-76",
  // baseUrl: "http://localhost:3000",
  baseUrl: "https://api.mesto-eugenebananas.nomoredomainswork.ru" ,
  headers: {
    authorization: localStorage.getItem("token")
      ? "Bearer " + localStorage.getItem("token")
      : null,
    "Content-Type": "application/json",
  },
});

export default api;
