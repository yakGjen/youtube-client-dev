export default class HeadModel {
  static addLinks() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://use.fontawesome.com/releases/v5.8.2/css/all.css';
    link.crossorigin = 'anonymous';
    document.head.appendChild(link);

    const font = document.createElement('link');
    font.href = 'https://fonts.googleapis.com/css?family=Stylish&display=swap';
    font.rel = 'stylesheet';
    document.head.appendChild(font);
  }
}
