import Ember from 'ember';
import layout from '../templates/components/tinymce-editor';

const {
  $,
  get,
  set,
  getOwner,
} = Ember;

const tinymceAssetMap = window.__tinymce_addon_asset_map || {};
let tinymcePromise = null;

export default Ember.Component.extend({
  layout,

  options: null,
  value: '',
  assetsPrefix: '',

  didInsertElement() {
    this._loadTinyMCEAsync().then(() => {
      // tinymce can't handle EmptyObject, so convert to Object by JSON marshalling
      let options = JSON.parse(JSON.stringify(get(this, 'options') || {}));

      options.setup = (editor) => {
        editor.on('change', () => {
          set(this, 'value', editor.getContent());
        });
      };

      options.target = this.$('textarea')[0];
      Ember.run.scheduleOnce('afterRender', this, function() {
        console.log('INIT', options, $(`#${this.elementId} textarea`));
        console.log(window.tinymce.init(options));
      });
    });
  },

  _loadTinyMCEAsync() {
    if (typeof window.tinymce !== 'undefined') {
      return new Promise((resolve, reject) => { resolve(); });
    } /*else if(tinymcePromise !== null) {
      return tinymcePromise;
    } */else {
      const assetsPrefix = get(this, 'assetsPrefix');
      tinymcePromise = $.getScript(`${assetsPrefix}assets/tinymce.js`).then(() => {
        window.tinymce.baseURL = `${assetsPrefix}assets`;
        let oldLoadMethod = tinymce.ScriptLoader.loadScripts;
        tinymce.ScriptLoader.loadScripts = function(scripts, a, b, c) {
          scripts = scripts.map(url => {
            url = url.replace(assetsPrefix, '');
            // console.log(url, tinymceAssetMap[url] || url);
            return `${assetsPrefix}${tinymceAssetMap[url] || url}`;
          });

          return oldLoadMethod(scripts, a, b, c);
        };
      });
      return tinymcePromise;
    }
  },
});
