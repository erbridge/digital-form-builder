module.exports = {
  // settings: {
  //   "import/resolver": {
  //       "workspaces": {
  //         "extensions',".mjs", ".js", ".ts", ".tsx", ".json"],
  //         "sources": {
  //           ['@xgovformbuilder/model',"model"],
  //           ['@xgovformbuilder/runner',"runner"],
  //           ['@xgovformbuilder/engine',"engine"],
  //           ['@xgovformbuilder/designer',"designer"],
  //         }
  //       }
  //     }
  // }
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@xgovformbuilder/model',"model"],
          ['@xgovformbuilder/runner',"runner"],
          ['@xgovformbuilder/engine',"engine"],
          ['@xgovformbuilder/designer',"designer"],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json']
      }
    }
  },
  rules: {
    "no-duplicate-imports": 0
  }
}
