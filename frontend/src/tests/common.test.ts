import colorSwitcher from '../common/colorSwitcher';
import {
  createEdgeLabelText,
  makePredicateUnique,
  mapOntologyToGraphEdge,
  removeDuplicates,
} from '../common/d3';
import {
  isSubgoal,
  mapCorrelationToColor,
  mapCorrelationToName,
  mapIdToEdge,
  mapIdToNode,
  mapPrefixNameToNode,
  mapSustainabilityGoalToNode,
  parseNameFromClassId,
  parsePrefixFromClassId,
} from '../common/node';

/**
 * Color switcher tests
 */

test('Color switcher default case', () => {
  expect(colorSwitcher('invalid')).toBe('cyan.800');
});

test('Color switcher other cases', () => {
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B1')).toBe('#E5243B');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B2')).toBe('#DDA63A');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B3')).toBe('#4C9F38');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B4')).toBe('#C5192D');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B5')).toBe('#FF3A21');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B6')).toBe('#26BDE2');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B7')).toBe('#FCC30B');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B8')).toBe('#A21942');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B9')).toBe('#FD6925');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B10')).toBe('#DD1367');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B11')).toBe('#FD9D24');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B12')).toBe('#BF8B2E');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B13')).toBe('#3F7E44');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B14')).toBe('#0A97D9');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B15')).toBe('#56C02B');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B16')).toBe('#00689D');
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B17')).toBe('#19486A');
});

/**
 * Node tests
 */

const testNode = {
  prefix: {
    prefix: 'testPrefix',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#',
  },
  name: 'testName',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
  correlation: 2,
  type: 'testType',
};

test('Map Prefix to Node', () => {
  expect(mapPrefixNameToNode('testPrefix', 'testName', 2, 'testType')).toStrictEqual(testNode);
  const undefinedTypeAndCorrelationNode = { ...testNode, type: 'undefined', correlation: -1 };
  expect(mapPrefixNameToNode('testPrefix', 'testName', undefined, undefined)).toStrictEqual(
    undefinedTypeAndCorrelationNode,
  );
});

test('Parse prefix from class ID', () => {
  expect(
    parsePrefixFromClassId('http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName'),
  ).toStrictEqual(testNode.prefix);
  expect(parsePrefixFromClassId('')).toBeNull();
});

test('Parse name from class ID', () => {
  expect(
    parseNameFromClassId('http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName'),
  ).toBe('testName');
  expect(parseNameFromClassId('#')).toBe('');
});

test('Map ID to node', () => {
  expect(
    mapIdToNode(
      'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
      2,
      'testType',
    ),
  ).toStrictEqual(testNode);
});

const testSustainabilityNode = {
  prefix: {
    prefix: 'testPrefix',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#',
  },
  name: 'testName',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
  correlation: -1,
  type: 'undefined',
};

test('Map sustainability goal to node', () => {
  expect(
    mapSustainabilityGoalToNode({
      instancesOf: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
      label: 'testName',
      icon: 'testIcon',
    }),
  ).toStrictEqual(testSustainabilityNode);
  expect(
    mapSustainabilityGoalToNode({
      instancesOf: '',
      label: 'testName',
      icon: 'testIcon',
    }),
  ).toBeNull();
});

const testEdge = {
  prefix: {
    prefix: 'testPrefix',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#',
  },
  name: 'testName',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
};

test('Map ID to edge', () => {
  expect(
    mapIdToEdge('http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName'),
  ).toStrictEqual(testEdge);
  expect(mapIdToEdge('')).toBeNull();
});

/**
 * Correlation tests
 */

test('Map correlation to name', () => {
  expect(mapCorrelationToName(2)).toBe('høy');
  expect(mapCorrelationToName(1)).toBe('medium');
  expect(mapCorrelationToName(0)).toBe('lav');
  expect(mapCorrelationToName(-1)).toBe('');
});

test('Map correlation to color', () => {
  expect(mapCorrelationToColor(2)).toBe('.600');
  expect(mapCorrelationToColor(1)).toBe('.500');
  expect(mapCorrelationToColor(0)).toBe('.400');
  expect(mapCorrelationToColor(-1)).toBe('.300');
});

/**
 * Subgoal tests
 */

test('Is node subgoal', () => {
  expect(isSubgoal(testNode)).toBe(false);
  const testNodeSubGoal = { ...testNode, type: 'Delmål' };
  expect(isSubgoal(testNodeSubGoal)).toBe(true);
});

/**
 * D3 tests
 */

test('Map ontology to graph edge', () => {
  expect(
    mapOntologyToGraphEdge({ Object: testNode, Predicate: testEdge, Subject: testNode }),
  ).toStrictEqual({
    ...testEdge,
    source: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
    target: 'http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName',
    sourceToTarget: [testEdge],
    targetToSource: [],
  });
});

const testNodeArray = [testNode, testNode];

const testOntology = { Object: testNode, Predicate: testEdge, Subject: testNode };

test('Remove duplicate nodes', () => {
  expect(testNodeArray.filter(removeDuplicates)).toStrictEqual([testNode]);
});

test('Make predicate unique', () => {
  expect(
    makePredicateUnique({ Object: testNode, Predicate: testEdge, Subject: testNode }),
  ).toStrictEqual({
    ...testOntology,
    Predicate: {
      ...testEdge,
      id: testEdge.id + testNode.id + testNode.id,
    },
  });
});

test('Create edge label text', () => {
  expect(createEdgeLabelText([testEdge], true)).toBe(`<-- ${testEdge.name}`);
  expect(createEdgeLabelText([testEdge], false)).toBe(`${testEdge.name} -->`);
  expect(createEdgeLabelText([], false)).toBe('');
  expect(createEdgeLabelText([], true)).toBe('');
  expect(createEdgeLabelText([testEdge, testEdge], false)).toBe('2 Predicates -->');
  expect(createEdgeLabelText([testEdge, testEdge, testEdge], true)).toBe('<-- 3 Predicates');
});
