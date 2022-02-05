export type GenericQuery<T extends Record<string, unknown>> = Partial<
  T & {
    limit: number;
    skip: number;
    select: string;
  }
>;
