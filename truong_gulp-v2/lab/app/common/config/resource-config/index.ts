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
  'path': PathListItemDataConstruct,
  'resource': ResourceItemConstruct,
  'template': ResourceItemConstruct,
};

const RESOURCE: ResourceConstruct = {
  'path': {
    'src': generateDirFromRootPath('/src'),
    'njk': generateDirFromRootPath('/src/njk'),
    'layout': generateDirFromRootPath('/src/njk/_layout.njk'),
  },

  'resource': {
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
  },

  "template" : {
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
    },
  },
};

export default RESOURCE;
