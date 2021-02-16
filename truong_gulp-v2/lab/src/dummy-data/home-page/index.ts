import * as DataConstruct from '@src/dummy-data/data-construct';
import {
  RESOURCE,
  BASE_STATIC_URL
} from '@common/config/resource-config';

interface ProductInterface {
  logo: string,
  title: string,
  sub_title: string,
  desc: string,
  url: string,
};

interface ResProductListInterface extends DataConstruct.ResponseInterface {
  data: {
    product_list: Array<ProductInterface>,
  },
};

interface HomePageInterface extends DataConstruct.LayoutBodyInterface, DataConstruct.LayoutHeaderInterface {
  resProductList: ResProductListInterface,
};

class HomePageDummyData extends DataConstruct.DummyData {
  private _objDummyData: HomePageInterface;

  getData() {
    this._strHostFileName = RESOURCE.resource['home-page'].name;

    if(!this._isValidFileName()) {
      return null;
    }

    this._objDummyData = {
      title: 'gulp lab home page',
      desciption: 'Design pattern for FE developer use (Nunjucks, Sass, Vue and Javascript)',
      keywords: 'gulp, Nunjucks, Sass, Vue, Javascript',
      body_class_name: RESOURCE.resource['home-page'].name,
      resProductList: {
        success: false,
        error: null,
        data: {
          product_list: [
            {
              logo: BASE_STATIC_URL + '/image/logo/gulp-logo.jpg',
              title: 'test',
              sub_title: 'A toolkit to automate & enhance your workflow',
              desc: 'Leverage gulp and the flexibility of JavaScript to automate slow, repetitive workflows and compose them into efficient build pipelines.',
              url: 'https://gulpjs.com',
            }
          ]
        }
      }
    };

    return this._objDummyData;
  };
};

export default HomePageDummyData;
