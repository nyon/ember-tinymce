/* eslint-env node */
'use strict';

const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const resolve = require('resolve');
const dirname = require('path').dirname;
const fs = require('fs');
const glob = require('glob');

module.exports = {
  name: 'ember-tinymce',

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    return app;
  },

  treeForPublic() {
    let publicTree = this._super.treeForPublic.apply(this, arguments);

    let trees = [];

    if (publicTree) {
      trees.push(publicTree);
    }

    let tinymceDir = dirname(resolve.sync('tinymce'));

    trees.push(
      funnel(tinymceDir, {
        destDir: '/assets',
        exclude: [
          '*.txt',
          '*.md',
          '**/*.min.js',
          'tinymce.jquery.js',
          'jquery.tinymce.js'
        ]
      })
    );

    return mergeTrees(trees);
  },

  postBuild(build) {
    this._super.included.apply(this, arguments);

    let fingerprintPrepend = '/';
    let indexFilePath = build.directory + '/index.html';
    let testIndexFilePath = build.directory + '/tests/index.html';

    let indexFile = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});

    let testIndexFile;
    if (fs.existsSync(testIndexFilePath)) {
      testIndexFile = fs.readFileSync(testIndexFilePath, {encoding: 'utf-8'});
    }

    let files = glob.sync(build.directory + '/assets/**/*', { follow: true });
    files = files.filter(e => {
      return fs.statSync(e).isFile();
    });

    files = files.map(e => {
      return e.replace(build.directory + '/', '');
    });

    let totalFiles = files.length;

    let assetMap = {};

    let assetFileName = null;
    for (let i = 0; i < totalFiles; i++) {
      let m;
      if (m = files[i].match(/(.*)-([0-9a-f]+)\.(.*)/i)) {
        assetMap[`${m[1]}.${m[3]}`] = files[i];
      }
    }

    let assetMapPlaceholder = JSON.stringify(assetMap);


    fs.writeFileSync(indexFilePath, indexFile.replace(/__ember_tinymce_placeholder__/, assetMapPlaceholder));

    if (testIndexFile) {
      fs.writeFileSync(testIndexFilePath, testIndexFile.replace(/__ember_tinymce_placeholder__/, assetMapPlaceholder));
    }
  },

  contentFor(type, config) {
    if (type === 'head-footer') {
      return '<script>var __tinymce_addon_asset_map = __ember_tinymce_placeholder__;</script>';
    }
    return '';
  }
};
