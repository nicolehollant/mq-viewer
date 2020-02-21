module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.colehollant.mqviewer",
        productName: "MQ Viewer",
        copyright: "Copyright © 2020 Cole Hollant",
        mac: {
          target: "zip"
        }
      }
    }
  }
}