import _ = require('lodash');
import {Decoder, object, string, boolean} from '@mojotech/json-type-validation';
import APP from '@common/enum/source-enum';
import { RESOURCE } from '@common/config/resource-config';
import modules from '@common/define/module-define';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import '@src/dummy-data/data-construct';

interface RequestUrlInterface {
  [key:string]: string,
};

interface DataDummyInterface extends DummyDataInfoInterface ,LayoutBodyInterface, LayoutHeaderInterface {
  response: ResponseInterface,
};

interface DataDummyResponseInterface {
  success: boolean,
  plugin: string,
  file: string,
  message: null | string,
  data: object,
};

class DataManager {
  private _dataJSONFileUrl: RequestUrlInterface;

  private _DataDummyDecoder: Decoder<DataDummyInterface> = object(
    {
      id: string(),
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

  private _TYPE_FILE_JSON:string = ARR_FILE_EXTENSION.JSON;

  constructor() {
    this._init();
  }

  private _init() {
    this._dataJSONFileUrl = {
      [RESOURCE.resource['home-page'].name]: APP.src.dummy_data + '/data-store/' + RESOURCE.resource['home-page'].name + '.json',
      [RESOURCE.resource['introduction-page'].name]: APP.src.dummy_data + '/data-store/' + RESOURCE.resource['introduction-page'].name + '.json',
    };
  }; // _init()

  private _generateDummyDataConstructFormatted(jsonContent) {
    if(_.isEmpty(jsonContent)) {
      return [];
    }

    const self = this;
    const error = (jsonContent.ok ? null : jsonContent.error);
    const data = (error ? error.input : jsonContent.result);
    const message = (error ? error.message : '');

    const DummyDataResponse: DataDummyResponseInterface = {
      success: jsonContent.ok,
      plugin: 'Dummy Data',
      file: RESOURCE.path.dummy_data + '/data-store/' + data.body_class_name + '.' + self._TYPE_FILE_JSON,
      message,
      data,
    };

    return DummyDataResponse;
  }; // _generateDummyDataConstructFormatted()

  private _readDataJsonFile(strDataJsonFileUrl) {
    const self = this;
    let data = null;

    try {
      const jsonContent = modules.fs.readFileSync(strDataJsonFileUrl, 'utf-8');
      data = self._generateDummyDataConstructFormatted(
        self._DataDummyDecoder.run(JSON.parse(jsonContent))
      );
    } catch(err) {
      console.log(err)
      return;
    }

    return data;
  }; // _readDataJsonFile()

  get(strFileName: string) {
    const self = this;

    if(_.isEmpty(self._dataJSONFileUrl[strFileName])) {
      return null;
    }

    return self._readDataJsonFile(self._dataJSONFileUrl[strFileName]);
  };
}

export default DataManager;
