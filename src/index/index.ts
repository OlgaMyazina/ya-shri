//import index from './index.hbs';
//todo: удалить неиспользуемые файлы и проверить стили
import './index.css';

import foo from '../components/footer';
import header from '../components/header';

import headerData from '../data/header.json';
import footerData from '../data/footer.json';

/*Импортируем изображения для логотипа */
import imgLogoSrc from '../images/logo@1x.png';
import imgLogoSrcset from '../images/logo@2x.png';
import sourceLogoSrcset from '../images/logo.svg';

/*Импортируем изображения для меню */
import imgMenuIconSrc from '../images/icon_list_m.png';
import imgMenuIconSrcset from '../images/icon_list_m@2x.png';
import sourceMenuIconSrcset from '../images/icon_list_m@1x.svg';

export class Page {
  onChangePage: any;
  constructor(onChangePage: any) {
    this.render();
    this.onChangePage = onChangePage;
  }
  render() {
    /*Загружаем логотип для сайта */
    const imageLogo = {
      class: 'logo__picture',
      sourceSrcset: sourceLogoSrcset,
      imgSrc: imgLogoSrc,
      imgSrcset: `${imgLogoSrcset} 2x`,
      imgAlt: 'Яндекс дом'
    };

    /*Загружаем иконку меню для сайта*/
    const imageIcon = {
      class: 'menu-toggle__picture',
      sourceSrcset: sourceMenuIconSrcset,
      imgSrc: imgMenuIconSrc,
      imgSrcset: `${imgMenuIconSrcset} 2x`,
      imgAlt: 'menu'
    };

    /*Шаблонизатор header */
    headerData.logo = imageLogo;
    headerData.icon = imageIcon;
    /*Получаем результат шаблонизатора и вставлем в html*/
    const headerHTML = header(headerData);
    const headerElement: HTMLElement = <HTMLElement>document.querySelector('.header-wrap');
    headerElement.innerHTML = headerHTML;

    /*Перехватываем клик на ссылки */
    const navElements = headerElement.querySelectorAll<HTMLElement>('nav a');
    if (navElements) {
      navElements.forEach(element => {
        element.addEventListener('click', e => {
          const link: HTMLElement = <HTMLElement>e.target;
          let pageLink = '';
          if (link) pageLink = link.innerHTML; // console.log(link.innerHTML);
          e.preventDefault();
          this.onChangePage({
            type: 'pageChange',
            page: pageLink
          });
        });
      });
    }

    const dataFoo = foo(footerData);
    /*Получаем результат шаблонизатора и вставлем в html*/
    const fooHtml: HTMLElement = <HTMLElement>document.querySelector('.foo-menu');
    fooHtml.innerHTML = dataFoo;

    //export default index;
  }
}
