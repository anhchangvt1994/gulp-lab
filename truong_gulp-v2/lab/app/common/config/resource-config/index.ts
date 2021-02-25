import APP from '@common/enum/source-enum';

interface ResourceItemDataConstruct {
  'name'?: string,
  "arrCssFile": string[],
  "arrJsFile": string[],
  'dummy_data'?: boolean,
};

interface ResourceItemConstruct {
  [key:string]: ResourceItemDataConstruct,
  'home-page': ResourceItemDataConstruct,
  'introduction-page': ResourceItemDataConstruct,
};

interface PathListItemDataConstruct {
  'src': string,
  'dummy_data': string,
  'njk': string,
  'global': string,
  'layout': string,
};

interface ResourceConstruct {
  'project': string,
  'port': any, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'ip_address': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'host': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'local': string,
  'path': PathListItemDataConstruct,
  'resource': ResourceItemConstruct,
};

export let BASE_URL:string;
export let BASE_STATIC_URL:string;

export const RESOURCE: ResourceConstruct = {
  'project': 'gulp',
  'port': process.env.PORT || 3000,
  'ip_address': null,
  'host': 'dev.vn',
  'local': 'localhost',

  'path': {
    'src': APP.src.path,
    'dummy_data': APP.src.dummy_data,
    'njk': APP.src.njk,
    'global': APP.src.njk + '/global',
    'layout': APP.src.njk + '/_layout.njk',
  },

  'resource': {
    "libs" : {
      "arrCssFile": [],
      "arrJsFile": []
    },

    "common" : {
      "arrCssFile": [
        'vendor-style'
      ],
      "arrJsFile": []
    },

    "home-page" : {
      'name': 'home-page',
      "arrCssFile" : [
        "home-page-style"
      ],
      "arrJsFile" : [
        "home-page"
      ],
      'dummy_data': true,
    },

    "introduction-page" : {
      'name': 'introduction-page',
      "arrCssFile" : [
        "introduction-page-style"
      ],
      "arrJsFile" : [
        "introduction-page"
      ],
      'dummy_data': true,
    },
  },
};

//=======================================
// NOTE - generate External IP
//=======================================
const os = require('os');
const OSNetworkInterfaces = os.networkInterfaces();
const Ethernet = OSNetworkInterfaces.Ethernet || Object.values(OSNetworkInterfaces);

if(Ethernet) {
  Ethernet.some(function(ethernetItem) {
    const ethernetItemInfo = ethernetItem.family ? ethernetItem : ethernetItem[0];

    if(ethernetItemInfo.family.toLowerCase() === 'ipv4') {
      RESOURCE.ip_address = ethernetItemInfo.address;
      return true;
    }
  });
}

if(process.env.NODE_ENV === 'dev') {
  BASE_URL = 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port;
  BASE_STATIC_URL = 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port;
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://' + RESOURCE.host + ':' + RESOURCE.port;
  BASE_STATIC_URL = 'http://static.' + RESOURCE.host + ':' + RESOURCE.port;
}
