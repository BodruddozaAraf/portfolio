/** A traced ink drawing: one path per stroke group, in draw order. */
export type Sketch = {
  viewBox: string;
  paths: string[];
};
