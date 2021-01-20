import '@src/dummy-data/data-construct';

interface ProductInterface {
  logo: string,
  title: string,
  sub_title: string,
  desc: string,
  url: string,
};

interface ResProductListInterface extends ResponseInterface {
  data: {
    product_list: Array<ProductInterface>,
  },
};

interface HomePageInterface extends LayoutBodyInterface, LayoutHeaderInterface {
  resProductList: ResProductListInterface,
};

class HomePageDummyData extends DummyData {
  private _objDummyData: HomePageInterface;

  strHostFileName = 'home-page';

  getData() {
    this._objDummyData = {
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

    return this._objDummyData;
  };
};
