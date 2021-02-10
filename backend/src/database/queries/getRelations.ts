export default (className: string): string => `
  PREFIX : <http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#>
  SELECT *
  WHERE {
    {
      ${className} ?Predicate ?Object
    }
    UNION
    {
      ?Subject ?Predicate ${className}
    }
  }`;
