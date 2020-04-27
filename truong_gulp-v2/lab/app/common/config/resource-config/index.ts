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
      "arrCssFile": [],
      "arrJsFile": []
    },
    "text-page" : {
      "arrCssFile" : [
        "text-page-style"
      ],
      "arrJsFile" : [
        "text-page",
      ]
    },

    "introduction-page" : {
      "arrCssFile" : [
        "introduction-page-style"
      ],
      "arrJsFile" : [
        "introduction-page"
      ]
    },
  },
};

export default RESOURCE;
