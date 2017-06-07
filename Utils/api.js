const api = {
  getCategories() {
    const url = `http://media.efcsydney.org/app/handler/folderlist.ashx`;

    const form = new FormData();
    form.append('p', '/sermon');
    form.append('path', '');
    form.append('reload', false);
    form.append('part', 1);
    form.append('email', '');

    const headers = new Headers({
      'Content-Type': 'x-www-form-urlencoded'
    });

    return fetch(url, {
      headers: headers,
      method: 'post',
      body: form
    })
    .then(res => res.json())
    .catch(e => {
      console.info(e);
    });
  },
    getSermonList(type) {
    const url = `http://media.efcsydney.org/app/handler/folderlist.ashx`;

    const form = new FormData();
    form.append('p', `/sermon/${type}`);
    form.append('path', '');
    form.append('reload', false);
    form.append('part', 1);
    form.append('email', '');

    const headers = new Headers({
      'Content-Type': 'x-www-form-urlencoded'
    });

    return fetch(url, {
      headers: headers,
      method: 'post',
      body: form
    })
    .then(res => res.json())
    .catch(e => {
      console.info(e);
    });
    },
  getSermon(type, date) {
    const url = `http://media.efcsydney.org/app/handler/folderlist.ashx`;

    const form = new FormData();
    form.append('p', `/sermon/${type}/${date}`);
    form.append('path', '');
    form.append('reload', false);
    form.append('part', 1);
    form.append('email', '');

    const headers = new Headers({
      'Content-Type': 'x-www-form-urlencoded'
    });

    return fetch(url, {
      headers: headers,
      method: 'post',
      body: form
    })
    .then(res => res.json())
    .catch(e => {
      console.info(e);
    });
  },
  getSermonSlides(type, date, file) {
    const url = `http://media.efcsydney.org/app/handler/folderlist.ashx`;

    const form = new FormData();
    form.append('p', `/sermon/${type}/${date}/${file}`);
    form.append('path', '');
    form.append('reload', false);
    form.append('part', 1);
    form.append('email', '');

    const headers = new Headers({
      'Content-Type': 'x-www-form-urlencoded'
    });

    return fetch(url, {
      headers: headers,
      method: 'post',
      body: form
    })
    .then(res => res.json())
    .catch(e => {
      console.info(e);
    });
  }
};

module.exports = api;
