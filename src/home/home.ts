import './home.css';

import picture from '../components/picture';
import nav from '../components/nav';
import foo from '../components/footer';

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

/*Загружаем логотип для сайта */
const imageLogo = {
  class: 'logo',
  sourceSrcset: sourceLogoSrcset,
  imgSrc: imgLogoSrc,
  imgSrcset: `${imgLogoSrcset} 2x`,
  imgAlt: 'Яндекс дом'
};
const dataLogo = picture(imageLogo);
const logoHTML: HTMLElement = <HTMLElement>document.querySelector('.logo-href');
logoHTML.innerHTML = dataLogo;

/*Загружаем иконку меню для сайта*/
const imageIcon = {
  class: 'menu-icon',
  sourceSrcset: sourceMenuIconSrcset,
  imgSrc: imgMenuIconSrc,
  imgSrcset: `${imgMenuIconSrcset} 2x`,
  imgAlt: 'menu'
};
const dataIcon = picture(imageIcon);
const iconHTML: HTMLElement = <HTMLElement>document.querySelector('.menu-toggle');
iconHTML.innerHTML = dataIcon;

/*Загружаем данные для меню */
const dataNav = nav(headerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const navHtml: HTMLElement = <HTMLElement>document.querySelector('.nav-list');
navHtml.innerHTML = dataNav;

const dataFoo = foo(footerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const fooHtml: HTMLElement = <HTMLElement>document.querySelector('.foo-menu');
fooHtml.innerHTML = dataFoo;
