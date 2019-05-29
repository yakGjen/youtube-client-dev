export default class ElemItemView {
  constructor(snippet) {
    this.elem = ElemItemView.addItem(snippet);
  }

  static addItem(snippet) {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="top-section-item">
        <h1 class="header-item">${snippet.title}</h1>
        <img class="header-img" src="${snippet.thumbnails.default.url}" alt="title-picture">
      </div>
      <div class="bottom-section-item">
        <div class="author-item"><h2><i class="fas fa-male"></i> ${snippet.channelTitle}</h2></div>
        <div class="publish-item"><h2><i class="far fa-calendar-alt"></i> ${new Date(snippet.publishedAt).getFullYear()}-0${new Date(snippet.publishedAt).getMonth() + 1}-${new Date(snippet.publishedAt).getDate()}</h2></div>
        <div class="view-rate-item"><h2><i class="fas fa-eye"></i></h2></div>
        <p class="descrition-item">${snippet.description}</p>
      </div>
    `;
    return div;
  }
}
