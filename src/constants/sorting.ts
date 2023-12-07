export const SortingDirection: {
  readonly ascending: 'ascending';
  readonly descending: 'descending';
} = {
  ascending: 'ascending',
  descending: 'descending',
};

export type SortingDirection = (typeof SortingDirection)[keyof typeof SortingDirection];
