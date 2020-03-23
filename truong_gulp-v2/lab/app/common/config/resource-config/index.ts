import { generateDirFromRootPath } from '@common/enum/path-enum';

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
  'layout': string,
};

interface ResourceConstruct {
  'path-list': PathListItemDataConstruct,
  'resource-list': ResourceItemConstruct,
};

const RESOURCE: ResourceConstruct = {
  'path-list': {
    'src': generateDirFromRootPath('/src'),
    'njk': generateDirFromRootPath('/src/njk'),
    'layout': generateDirFromRootPath('/src/njk/_layout.njk'),
  },

  'resource-list': {
    "libs" : {
      "arrCssFile": [],
      "arrJsFile": []
    },

    "common" : {
      "arrCssFile": [
        "header",
        "footer"
      ],
      "arrJsFile": []
    },

    "text-page" : {
      "arrCssFile" : [
        "text-style"
      ],
      "arrJsFile" : [
        "text",
        "test01"
      ]
    },

    "introduction-page" : {
      "arrCssFile" : [
        "introduction-style"
      ],
      "arrJsFile" : [
        "introduction"
      ]
    }
  }
};

export default RESOURCE;
