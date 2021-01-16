import '@src/dummy-data/data-construct';

interface ProductInterface {
  logo: string,
  title: string,
  sub_title: string,
  desc: string,
  url: string,
};

interface ProductListInterface {
  product_list: Array<ProductInterface>,
};

interface ResProductListInterface extends ResponseInterface {
  data: ProductListInterface,
};

interface HomePageInterface extends LayoutBodyInterface, LayoutHeaderInterface {
  resProductList: ResProductListInterface,
};

export const objHomePage: HomePageInterface = {
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
          logo: '',
          title: '',
          sub_title: '',
          desc: '',
          url: '',
        }
      ]
    }
  }
};
