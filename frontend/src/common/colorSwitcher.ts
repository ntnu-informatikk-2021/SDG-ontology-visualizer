const colorSwitcher = (color: string) => {
  switch (color) {
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B1':
      return '#E5243B';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B2':
      return '#DDA63A';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B3':
      return '#4C9F38';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B4':
      return '#C5192D';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B5':
      return '#FF3A21';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B6':
      return '#26BDE2';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B7':
      return '#FCC30B';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B8':
      return '#A21942';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B9':
      return '#FD6925';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B10':
      return '#DD1367';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B11':
      return '#FD9D24';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B12':
      return '#BF8B2E';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B13':
      return '#3F7E44';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B14':
      return '#0A97D9';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B15':
      return '#56C02B';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B16':
      return '#00689D';
    case 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B17':
      return '#19486A';

    default:
      return 'cyan.800';
  }
};

export default colorSwitcher;
