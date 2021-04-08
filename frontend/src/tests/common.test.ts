import colorSwitcher from '../common/colorSwitcher';
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

test('Color switcher B1', () => {
  expect(colorSwitcher('http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B1')).toBe('#E5243B');
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
});

test('Parse prefix from class ID', () => {
  expect(
    parsePrefixFromClassId('http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName'),
  ).toStrictEqual(testNode.prefix);
});

test('Parse name from class ID', () => {
  expect(
    parseNameFromClassId('http://www.semanticweb.org/aga/ontologies/2017/9/testPrefix#testName'),
  ).toBe('testName');
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
