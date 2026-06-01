export type PaginationParams = {
  page: number;
  pageSize: number;
};

export function toPagination(rawPage?: string, rawPageSize?: string): PaginationParams {
  const page = Math.max(Number(rawPage ?? 1) || 1, 1);
  const pageSize = Math.min(Math.max(Number(rawPageSize ?? 10) || 10, 1), 50);
  return { page, pageSize };
}
