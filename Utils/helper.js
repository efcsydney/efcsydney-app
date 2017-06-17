import _ from 'lodash';
import { Image } from 'react-native';

export function decode(str) {
  if (!str) {
    return str;
 }
  return unescape(decodeURI(str));
}

export function getImageSize(url) {
  return new Promise((resolve, reject) => {
    Image.getSize(
      url,
      (width, height) => {
        resolve({
          height,
          isLoaded: true,
          url,
          width
        });
      },
      err => {
        resolve({
          isLoaded: false,
          error: err
        });
      }
    );
  });
}

export function filterList(items) {
  return (items = _(items)
    .filter({ isdir: '1' })
    .filter(item => !item.ishide || item.ishide === '0')
    .filter(item => !_.isUndefined(item.grouptag))
    .orderBy('grouptag', 'desc')
    .value());
}

export function mapImageSizes(urls) {
  const tasks = urls.map(getImageSize);

  return Promise.all(tasks);
}

export function getColor(str) {
  let hash = 0;

  if (!str.length) {
    return hash;
  }

  str.split('').forEach(c => {
    hash = (hash << 5) - hash + c;
    hash = hash & hash; // Convert to 32bit integer
  });

  colors = [
    '#9b6bcc',
    '#3e76bb',
    '#96b556',
    '#ff894f',
    '#6bc7cc',
    '#b56d56',
    '#f94c83',
    '#bd2f2f'
  ];

  return colors[Math.abs(hash) % 8];
}

export function normalizeItem(item, path = '/sermon') {
  path = `/${path}/${item.grouptag}`;
  return {
    _raw: item,
    date: item.date,
    dirinfo: item.dirinfo,
    file: item.grouptag,
    key: `${item.grouptag}-${item.name}`,
    name: _.capitalize(item.grouptag),
    path,
    speaker: decode(item.Speaker || ''),
    thumb: `http://media.efcsydney.org/data/thumb/200x200${path}/.thumb.jpg`,
    title: decode(item.title || item.name || 'Untitled')
  };
}

export function findNameByExtension(items = [], extension, isDir = false) {
  const itemInfo =
    _.find(items, item => {
      if (isDir) {
        return (
          item.isdir === '1' &&
          item.name.toLowerCase().indexOf(`.${extension}`) !== -1
        );
      } else {
        return (
          item.isdir === '0' &&
          item.name.toLowerCase().indexOf(`.${extension}`) !== -1
        );
      }
    }) || {};

  return _.get(itemInfo, 'name');
}
