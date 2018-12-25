import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiService } from '../emoji.service';

// TODO Компонент слишком тесно связан с сервисом... вроде это не хорошо
@Component({
  selector: 'app-emojimain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  // searchValue - переменная, содержащая вводимое пользователем имя искомого эмодзи. Связано с input-ом во вьюшке
  private searchValue = '';

  // currentList - отображаемый список эмодзи. Содержит индексы - указатели на модели, лежащие в emojiService.emojies.
  // Получается в результате поиска (метод seek). В дальнейшем нарезается при помощи метода pagination результат поиска эмодзи с именами
  // Отображается в цикле на вьюшке
  private currentList = [];

  // Тэг текущего списка. По умолчанию используется список 'Все'
  private currentListTag = this.emojiService.ALL;

  // Флаг загрузки данных
  private loading = false;

  // Флаг ошибки... какой-нибудь
  private error = false;

  // Размер страницы пагинации
  private paginationCount = 10;

  // Текущая страница пагинации
  private paginationPage = 0;

  // emojiService исползуется для манипуляций с данными о эмодзи
  // роутеры для роутинга и подписки на параметры роута
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private emojiService: EmojiService) {}

  // Этот метод используется для сортировки pipe 'keyvalue' на вьюшке. Отображение полей обьекта в цикле при помощи *ngFor
  nameOrdering(l1, l2) {
    return l1.value.name > l2.value.name;
  }

  // Метод пагинации, возвращает часть currentList, соответствующую paginationPage и paginationCount
  pagination () {
    const s = this.paginationPage * this.paginationCount;
    const e = s + this.paginationCount;
    const pagination = this.currentList.slice(s, e);

    // Этот элемент автоматически сменит страницу, при отсутствии элементов в pagination
    if (pagination.length === 0 && this.paginationPage > 0) {
      this.paginationChangePage(this.paginationPage - 1);
      return this.pagination();
    }

    return pagination;
  }

  // Метод смены страницы пагинации
  paginationChangePage (page) {
    if (page >= 0 && page * this.paginationCount < this.currentList.length) {
      this.paginationPage = page;
    }
  }

  // Сортировка текущего списка по имени. По идее должно происходить при каждом изменении currentList
  sort() {
    this.currentList = this.currentList.sort((i1, i2) => this.emojiService.emojies[i1].name > this.emojiService.emojies[i2].name ? 1 : -1);
  }

  // Метод смены списка
  changeList(tag) {
    this.currentListTag = tag;
    // Нет обработки ошибки :(

    // Поиск по вбитому в input значению
    this.seek();

    // Сброс страницы пагинации
    this.paginationChangePage(0);
  }

  // Метод смены состояния эмодзи. Самый ужасный метод
  // index - индекс эмодзи, который будет изменяться
  // status - новый стату эмодзи
  changeEmojiStatus(index, status) {
    // Нет проверки аргументов :(

    let i;
    const emoji = this.emojiService.emojies[index];
    // Предыдущий статус эмодзи
    const prevStatus = emoji.status;

    // Смена на новый статус
    this.emojiService.changeStatus(emoji, status);

    // Сложнейшая логика статусов эмодзи, отвечающая за добавление/удаление
    // Без сарказма. Я убил на эту кучку if-ов просто чудовищно много времени, наверное потому что было 6 утра или я глупый
    if (prevStatus === this.emojiService.ALL) {
      if (status !== this.emojiService.FAVORITE) {
        i = this.emojiService.lists[prevStatus].indices.indexOf(index);
        if (i >= 0) {
          this.emojiService.lists[prevStatus].indices.splice(i, 1);
        }
      }
      this.emojiService.lists[status].indices.push(index);
    } else {
      if (prevStatus !== this.emojiService.ALL) {
        i = this.emojiService.lists[prevStatus].indices.indexOf(index);
        if (i >= 0) {
          this.emojiService.lists[prevStatus].indices.splice(i, 1);
        }
      }
      if (prevStatus !== this.emojiService.FAVORITE) {
        this.emojiService.lists[status].indices.push(index);
      }
    }
    if (this.currentListTag !== this.emojiService.ALL || status === this.emojiService.DELETED) {
      // Удаление из отображаемого списка. Это быстрее, чем обновить при помощи seek
      i = this.currentList.indexOf(index);
      if (i >= 0) {
        this.currentList.splice(i, 1);
      }
      this.sort();
    }
  }

  // По идее это что-то вроде переписывания url-а без перезагрузки. Здесь дописывается queryParam с searchedValue
  setSearchQueryParams () {
    this.router.navigate([], {
      queryParams: { search: this.searchValue ? this.searchValue : null }
    });
  }

  // Метод поиска эмодзи с именем начинающемся на searchValue. Результат записывается в currentList
  // TODO может стоит проиндексировать данные? Но вроде и так быстро ищет...
  seek() {
    if (this.searchValue) {
      this.currentList = this.emojiService.lists[this.currentListTag].indices.filter(
        i => this.emojiService.emojies[i].name.startsWith(this.searchValue)
      );
    } else {
      // TODO Спросить у куратора про пагинацию Material
       this.currentList = this.emojiService.lists[this.currentListTag].indices;
    }
    this.sort();
  }

  // Метод индексирования списков в соответствии со статусами, хранимыми в storage
  syncStatus() {
    const statusesObject = this.emojiService.getStatusesFromStorage();

    // TODO Если в списке statusesObject всего один элемент все равно будет пробежка по всему массиву emojies, а он большой... Fix it
    if (statusesObject) {
      // Сброс индексов
      this.emojiService.lists[this.emojiService.ALL].indices = this.emojiService.emojies.map((emoji, i) => i);
      this.emojiService.lists[this.emojiService.DELETED].indices = [];
      this.emojiService.lists[this.emojiService.FAVORITE].indices = [];

      this.emojiService.emojies.forEach((emoji, index) => {
        if (statusesObject[emoji.name]) {
          this.changeEmojiStatus(index, statusesObject[emoji.name]);
        }
      });
    }
  }

  onEnter (e) {
    if (e.key === 'Enter') {
      this.setSearchQueryParams();
    }
  }

  // При инициализации происходит загрузка данных о эмодзи, инициализация списков, синхронизация с хранилищем
  ngOnInit() {
    this.loading = true;

    this.emojiService.getEmoji().then(() => {

      this.syncStatus();

      console.log('Emoji statuses synchronized with storage!');

      this.activatedRoute.queryParams.subscribe(data => {
        this.searchValue = data.search;
        this.seek();
      });

      this.activatedRoute.params.subscribe(data => {
        if (this.emojiService.lists[data.list]) {
          this.changeList(data.list);
        } else {
          this.changeList(this.emojiService.ALL);
        }
      });

      this.loading = false;
    }, error => {
      console.log(error);

      this.error = true;
    });
  }

}
