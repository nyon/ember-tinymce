/* eslint-env node */
'use strict';

const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

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

    trees.push(
      funnel('node_modules/tinymce', {
        destDir: '/assets',
        exclude: ['*.txt', '*.md']
      })
    );

    return mergeTrees(trees);
  },

};
