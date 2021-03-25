const colorSwitcher = (color: string) => {
  switch (color) {
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B3':
      return '#4C9F38';
    default:
      return 'cyan.800';
  }
};

export default colorSwitcher;
