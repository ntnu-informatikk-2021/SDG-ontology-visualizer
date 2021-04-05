// used to change attribute types in a derived type.
// For example D3Edge extends GraphEdge, and the only difference is it changes the type of source and target from string to Edge
// See ../../types/d3/simulation
export type Modify<T, R> = Omit<T, keyof R> & R;
