type GetAllOptions = {
  maxPageSize?: number;
  select?: string[];
  filter?: string;
  orderBy?: string[];
  top?: number;
  skip?: number;
  count?: boolean;
  skipToken?: string;
};

type PagedResult<T> = {
  success?: boolean;
  data?: T[];
  skipToken?: string;
  error?: unknown;
};

type GetAllService<T> = {
  getAll: (options?: GetAllOptions) => Promise<PagedResult<T>>;
};

const DEFAULT_MAX_PAGES = 200;

export async function getAllPages<T>(
  service: GetAllService<T>,
  options: GetAllOptions = {},
  maxPages = DEFAULT_MAX_PAGES,
): Promise<PagedResult<T>> {
  const first = await service.getAll(options);
  if (!first?.success) {
    return first;
  }

  const allRows = [...(first.data ?? [])];
  let skipToken = first.skipToken;
  let pageCount = 1;

  while (skipToken && pageCount < maxPages) {
    const next = await service.getAll({
      ...options,
      skipToken,
    });

    if (!next?.success) {
      return {
        ...next,
        data: allRows,
      };
    }

    allRows.push(...(next.data ?? []));
    skipToken = next.skipToken;
    pageCount += 1;
  }

  return {
    ...first,
    data: allRows,
    skipToken,
  };
}
