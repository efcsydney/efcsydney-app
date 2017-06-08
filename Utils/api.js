export function fetchFile(path = '/sermon') {
  const url = `http://media.efcsydney.org/app/handler/folderlist.ashx`;

  const form = new FormData();
  form.append('p', path);
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
