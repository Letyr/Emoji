export default class Emoji {

  name: string;

  link: string;

  constructor (name, link) {
    this.name = name;
    this.link = link;
  }

  // TODO
  public toString = (): string => {
    return `Emoji ${this.name}`;
  }

}
