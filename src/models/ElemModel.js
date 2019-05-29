export default class ElemModel {
  constructor(data) {
    this.elem = ElemModel.constrElem(data);
  }

  static constrElem(data) {
    const elem = document.createElement(data.elem);
    elem.className = data.cls;

    if ('attr' in data) elem.setAttribute(data.attr[0], data.attr[1]);

    return elem;
  }
}
