/* global hexo */

'use strict';

hexo.extend.filter.register('before_generate', async () => {
  const Data = hexo.model('Data');
  for (const type of ['links', 'demos', 'blogs', 'resources']) {
    const arr = [];
    Data.forEach(({_id, data}) => {
      if (_id.startsWith(type + '/')) {

        // arr.sort((a, b) => {
        //   const nameA = a._id.toUpperCase();
        //   const nameB = b._id.toUpperCase();
        //   nameA < nameB ? -1 : 1;
        // });

        arr.push({
          name: _id.replace(type + '/', ''),
          ...data
        });

        // arr.sort((a, b) => a.name.localeCompare(b.name));

      }
    });
    if (Data.has(type)) {
      await Data.replaceById(type, { data: arr });
    } else {
      await Data.insert({
        _id: type,
        data: arr
      });
    }
  }
}, 0);


// hexo.extend.tag.register('preview', args => {
//   const id = args[0];
//   return (
//     '<div class="plugin-screenshot"><img data-src="/links/screenshots/' + id + '.png" data-sizes="auto" class="plugin-screenshot-img lazyload" alt="' + id + '" data-zoom-src="/links/screenshots/' + id + '@2x.jpg" data-zoomable><div class="plugin-screenshot-mask"><i class="fa fa-eye"></i></div></div>'
//   );
// });
