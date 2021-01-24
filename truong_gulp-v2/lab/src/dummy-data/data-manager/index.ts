import _ from 'lodash';
import { RESOURCE } from '@common/config/resource-config';
import HomePageDummyData from '@src/dummy-data/home-page';

class DataManager {
  constructor() {}

  data(strFileName: string) {
    const self = this;

    switch(strFileName) {
      case RESOURCE.resource['home-page'].name:
        return new HomePageDummyData(strFileName);
    }
  };
}

export default DataManager;
