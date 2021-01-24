import '@src/dummy-data/data-construct';
import {
  RESOURCE
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
    product_list: Array<ProductInterface>,
  },
};

interface HomePageInterface extends LayoutBodyInterface, LayoutHeaderInterface {
  resProductList: ResProductListInterface,
};

abstract class DummyData {
  protected _strHostFileName: string;
  private _strFileName: string;

  constructor(strFileName?: string) {
    this._strFileName = strFileName;
  }

  protected _isValidFileName() {
    if(
      !this._strFileName ||
      !this._strHostFileName ||
      this._strFileName !== this._strHostFileName
    ) {
      return false;
    }

    return true;
  }; // _isValidFileName()

  abstract getData() : any; // getData()
}; // DummyData

class HomePageDummyData extends DummyData {
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

export default HomePageDummyData;
