interface ResourceItemConstruct {
  "arrCssFile": string[],
  "arrJsFile": string[],
};

interface ResourceConstruct {
  [key:string]: ResourceItemConstruct,
};

const RESOURCE: ResourceConstruct = {
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
};

export default RESOURCE;
