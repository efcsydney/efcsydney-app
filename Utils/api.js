export function fetchFile(path = '/sermon') {
  const url = 'http://media.efcsydney.org/app/handler/folderlist.ashx';
  const query = `p=${encodeURIComponent(path)}&path=&reload=false&part=1&email=`
  return fetch(`${url}?${query}`)
    .then(res => res.json())
    .catch(e => {
      console.info(e);
    });
}
