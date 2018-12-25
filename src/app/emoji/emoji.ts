// Модель данных эмодзи
export class Emoji {

  // Имя
  name: string;

  // Ссылка на картиночку
  link: string;

  // Статус.
  // Была идея использовать систему флагов/тэгов, но ее сложнее контролировать, тогда как здесь проще использовать state machine
  private _status = 'all'; // здесь самый страшный (как мне кажется) косяк с архитектурой...

  constructor (name, link) {
    this.name = name;
    this.link = link;
  }

  set status (status) {
    this._status = status;

    console.log(`Emoji "${this.name}" status set to: ${status}`);
  }

  get status () {
    return this._status;
  }

}
