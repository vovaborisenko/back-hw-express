export interface Paginated<Items> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Items;
}
