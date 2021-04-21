export default () => {
  const detailView = document.getElementById('detailView');
  if (!detailView) {
    return;
  }
  detailView.scrollIntoView({ block: 'start', behavior: 'smooth' });
};
