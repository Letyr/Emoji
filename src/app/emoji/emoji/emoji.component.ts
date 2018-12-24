import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Emoji } from '../emoji';
import { Lightbox } from 'ngx-lightbox';
import { EmojiService } from '../emoji.service';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.css']
})
export class EmojiComponent {

  /*
   * Модель эмодзи
   */
  @Input() emoji: Emoji;

  /*
   * Событие для свзяи с родительским компонентом. Именно для уведомления о изменении статуса эмодзи
   */
  @Output() statusChanged = new EventEmitter<string>();

  /*
   * lightbox-а для отображения увеличенной картинки эмодзи по нажатию.
   * emojiService только для использования его статусов, дабы не путаться в строках... не лучший ход, но здесь сойдет
   */
  constructor(private _lightbox: Lightbox, private emojiService: EmojiService) { }

  /*
   * Событие смены статуса Эмодзи. Вызывается при нажатии на кнопку статуса
   */
  changeEmojiStatus (status: string) {
    // Конечно можно напрямую вызвать метод изменения статуса в сервисе или даже в модели,
    // но архитектура требует передачи события родителю, ведь мало ли, что он там делает...
    this.statusChanged.emit(status);
  }

  /*
   * Метод открытия lighbox-а с картинкой эмодзи. Копипаста с какого-то туториала
   */
  open () {
    this._lightbox.open([{
      src: this.emoji.link,
      caption: `Emoji ${this.emoji.name}`,
      thumb: this.emoji.link
    }], 0);
  }

}
