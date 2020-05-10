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
  'path': PathListItemDataConstruct,
  'resource': ResourceItemConstruct,
};

const RESOURCE: ResourceConstruct = {
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

export default RESOURCE;
