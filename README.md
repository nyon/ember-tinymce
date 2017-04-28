WARNING: currently WIP. API might change

# ember-tinymce

This ember addon tries to handle the external loading routines that the tinymce editor uses.

Just run `ember install ember-tinymce` and use `{{tinymce-editor value=myHtmlContent}}`.

# API

## `assetsPrefix`


# use cases

## Override tinymce options

1. `{{tinymce-editor options=(hash skin='my-skin')}}`
2. Create a new component that inherits tinymce-editor

## Use custom skin

In your `ember-cli-build.js` add code like the following:

```javascript
/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['skins']
    }
  });

  let tinymceExtraAssets = funnel('vendor/tinymce/', {
    destDir: '/assets'
  });


  return app.toTree([tinymceExtraAssets]);
};

```

Now add your skin to `vendor/tinymce/skins/`.

`{{tinymce-editor options=(hash skin='my-skin')}}`

## Use custom language

In your `ember-cli-build.js` add code like the following:

```javascript
/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['langs']
    }
  });

  let tinymceExtraAssets = funnel('vendor/tinymce/', {
    destDir: '/assets'
  });


  return app.toTree([tinymceExtraAssets]);
};

```

Now add your language to `vendor/tinymce/langs/`.

`{{tinymce-editor options=(hash language='borg')}}`


