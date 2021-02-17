import {
  mapIdToOntologyEntity,
  parseOntologyEntityToQuery,
  parsePrefixesToQuery,
} from '../../common/database';

export default (classId: string): string => {
  const node = mapIdToOntologyEntity(classId);
  if (!node) return '';

  const fullClassName = parseOntologyEntityToQuery(node);
  const prefixString = parsePrefixesToQuery(node.prefix);

  return `
  ${prefixString}
  SELECT *
  WHERE {
    {
      ${fullClassName} ?Predicate ?Object
    }
    UNION
    {
      ?Subject ?Predicate ${fullClassName}
    }
  }`;
};
