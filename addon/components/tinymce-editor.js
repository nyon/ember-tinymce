import Ember from 'ember';
import layout from '../templates/components/tinymce-editor';

const {
  $,
  get,
  set,
  getOwner,
} = Ember;

export default Ember.Component.extend({
  layout,

  options: {},
  value: '',
  assetsPrefix: '',

  didInsertElement() {
    this._loadTinyMCEAsync().then(() => {
      // tinymce can't handle EmptyObject, so convert to Object by JSON marshalling
      let options = JSON.parse(JSON.stringify(get(this, 'options')));

      options.setup = (editor) => {
        editor.on('change', () => {
          set(this, 'value', editor.getContent());
        });
      };

      options.selector = `#${this.elementId}`;

      window.tinymce.init(options);
    });
  },

  _loadTinyMCEAsync() {
    if (typeof window.tinymce !== 'undefined') {
      return new Promise((resolve, reject) => { resolve(); });
    } else {
      const assetsPrefix = get(this, 'assetsPrefix');
      return $.getScript(`${assetsPrefix}assets/tinymce.min.js`).then(() => {
        window.tinymce.baseURL = `${assetsPrefix}assets`;
      });
    }
  },
});
