import _ from 'lodash';
import { RESOURCE } from '@common/config/resource-config';
import {

} from '@src/dummy-data/home-page';

class DataManager {
  private _resource: Object;

  constructor(strFileName?: string) {
    if() {

    }

    this._resource = RESOURCE.resource;
  }

  private _isValidFileName(strFileName: string) {
    if(_.isEmpty(strFileName)) {
      return false;
    }

    return true;
  }; // _checkValidFileName()
}
