import '@src/dummy-data/data-construct';
import {
  BASE_STATIC_URL
} from '@common/config/resource-config';

interface ProductInterface {
  logo: string,
  title: string,
  sub_title: string,
  desc: string,
  url: string,
};

interface ResProductListInterface extends ResponseInterface {
  data: {
    product_list: Array<ProductInterface>
  },
};

interface HomePageInterface extends LayoutBodyInterface, LayoutHeaderInterface {
  resProductList: ResProductListInterface,
};

export const HomePage: HomePageInterface = {
  title: 'gulp lab home page',
  desciption: 'Design pattern for FE developer use (Nunjucks, Sass, Vue and Javascript)',
  keywords: 'gulp, Nunjucks, Sass, Vue, Javascript',
  body_class_name: 'home-page',
  resProductList: {
    success: true,
    error: null,
    data: {
      product_list: [
        {
          logo: BASE_STATIC_URL + 'image/logo/gulp-logo.jpg',
          title: 'Gulp',
          sub_title: 'A toolkit to automate & enhance your workflow',
          desc: 'gulp is an open-source JavaScript toolkit created by Eric Schoffstall used as a streaming build system in front-end web development.',
          url: 'https://gulpjs.com/',
        }
      ]
    }
  }
};
