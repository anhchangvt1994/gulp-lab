import _ = require('lodash');
import {Decoder, object, string, optional, number, boolean, isDecoderError} from '@mojotech/json-type-validation';
import APP from '@common/enum/source-enum';
import { RESOURCE } from '@common/config/resource-config';
import modules from '@common/define/module-define';
import '@src/dummy-data/data-construct';

interface RequestUrlInterface {
  [key:string]: string,
};

interface DataDummyInterface extends LayoutBodyInterface, LayoutHeaderInterface {
  response: ResponseInterface,
};

const DataDummyDecoder: Decoder<DataDummyInterface> = object(
  {
    title: string(),
    keywords: string(),
    desciption: string(),
    body_class_name: string(),
    response: object({
      success: boolean(),
      error: object(),
      data: object(),
    }),
  }
);

class DataManager {
  private _dataJSONFileUrl: RequestUrlInterface;

  constructor() {
    this._init();
  }

  private _init() {
    this._dataJSONFileUrl = {
      [RESOURCE.resource['home-page'].name]: APP.src.dummy_data + '/data-store/' + RESOURCE.resource['home-page'].name + '.json',
      [RESOURCE.resource['introduction-page'].name]: APP.src.dummy_data + '/data-store/' + RESOURCE.resource['introduction-page'].name + '.json',
    };
  };

  get(strFileName: string) {
    const self = this;

    if(_.isEmpty(self._dataJSONFileUrl[strFileName])) {
      return null;
    }

    return self._readDataJsonFile(self._dataJSONFileUrl[strFileName]);
  };

  _readDataJsonFile(strDataJsonFileUrl) {
    let data = null;

    try {
      const jsonContent = modules.fs.readFileSync(strDataJsonFileUrl, 'utf-8');
      data = DataDummyDecoder.run(JSON.parse(jsonContent));
    } catch(err) {
      console.log(err)
      return;
    }

    return data;
  };
}

export default DataManager;
