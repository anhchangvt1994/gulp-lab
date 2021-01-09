import APP from '@common/enum/source-enum';

interface ResourceItemDataConstruct {
  "arrCssFile": string[],
  "arrJsFile": string[],
};

interface ResourceItemConstruct {
  [key:string]: ResourceItemDataConstruct,
};

interface PathListItemDataConstruct {
  'src': string,
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

const RESOURCE: ResourceConstruct = {
  'project': 'gulp',
  'port': process.env.PORT || 3000,
  'ip_address': null,
  'host': 'dev.vn',
  'local': 'localhost',

  'path': {
    'src': APP.src.path,
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
      "arrCssFile": [],
      "arrJsFile": []
    },

    "introduction-page" : {
      "arrCssFile" : [
        "introduction-page-style"
      ],
      "arrJsFile" : [
        "introduction-page"
      ]
    },

    // NOTE component css, js
    "cooking-loading-page" : {
      'arrCssFile': [
        'cooking-loading-page-style',
      ],
      'arrJsFile': [
        'cooking-loading-page',
      ],
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

export default RESOURCE;
