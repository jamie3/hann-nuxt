const STORAGE_KEY = 'referral-filters';

interface ReferralFiltersState {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string[];
  assignedToFilter: string;
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
}

const DEFAULT_FILTERS: ReferralFiltersState = {
  searchQuery: '',
  typeFilter: 'all',
  statusFilter: ['new', 'unassigned', 'opened', 'closed'],
  assignedToFilter: 'all',
  itemsPerPage: 100,
  sortBy: 'updated_at',
  sortOrder: 'desc',
  currentPage: 1,
};

const loadFromStorage = (): Partial<ReferralFiltersState> => {
  if (import.meta.server) return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const loadFromUrl = (query: Record<string, any>): Partial<ReferralFiltersState> => {
  const result: Partial<ReferralFiltersState> = {};
  if (query.search !== undefined) result.searchQuery = String(query.search);
  if (query.type !== undefined) result.typeFilter = String(query.type);
  if (query.status !== undefined) {
    const statusVal = String(query.status);
    result.statusFilter = statusVal === 'all' ? [] : statusVal.split(',').filter(Boolean);
  }
  if (query.assignedTo !== undefined) result.assignedToFilter = String(query.assignedTo);
  if (query.limit !== undefined) result.itemsPerPage = Number(query.limit);
  if (query.sortBy !== undefined) result.sortBy = String(query.sortBy);
  if (query.sortOrder !== undefined) result.sortOrder = String(query.sortOrder) as 'asc' | 'desc';
  if (query.page !== undefined) result.currentPage = Number(query.page);
  return result;
};

export const useReferralFilters = () => {
  const route = useRoute();
  const router = useRouter();

  const fromUrl = loadFromUrl(route.query);
  const stored = loadFromStorage();

  // Priority: URL params > localStorage > defaults
  const hasUrlParams = Object.keys(fromUrl).length > 0;
  const merged: ReferralFiltersState = hasUrlParams
    ? { ...DEFAULT_FILTERS, ...stored, ...fromUrl }
    : { ...DEFAULT_FILTERS, ...stored };

  const searchQuery = ref<string>(merged.searchQuery);
  const typeFilter = ref<string>(merged.typeFilter);
  const statusFilter = ref<string[]>([...merged.statusFilter]);
  const assignedToFilter = ref<string>(merged.assignedToFilter);
  const itemsPerPage = ref<number>(merged.itemsPerPage);
  const sortBy = ref<string>(merged.sortBy);
  const sortOrder = ref<'asc' | 'desc'>(merged.sortOrder);
  const currentPage = ref<number>(merged.currentPage);

  const saveToStorage = () => {
    if (import.meta.server) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          searchQuery: searchQuery.value,
          typeFilter: typeFilter.value,
          statusFilter: statusFilter.value,
          assignedToFilter: assignedToFilter.value,
          itemsPerPage: itemsPerPage.value,
          sortBy: sortBy.value,
          sortOrder: sortOrder.value,
          currentPage: currentPage.value,
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const updateUrl = () => {
    const query: Record<string, string> = {};
    if (searchQuery.value) query.search = searchQuery.value;
    if (typeFilter.value !== 'all') query.type = typeFilter.value;
    if (statusFilter.value.length > 0) query.status = statusFilter.value.join(',');
    if (assignedToFilter.value !== 'all') query.assignedTo = assignedToFilter.value;
    if (itemsPerPage.value !== DEFAULT_FILTERS.itemsPerPage)
      query.limit = String(itemsPerPage.value);
    if (sortBy.value !== DEFAULT_FILTERS.sortBy) query.sortBy = sortBy.value;
    if (sortOrder.value !== DEFAULT_FILTERS.sortOrder) query.sortOrder = sortOrder.value;
    if (currentPage.value !== 1) query.page = String(currentPage.value);

    router.replace({ query });
  };

  watch(
    [
      searchQuery,
      typeFilter,
      statusFilter,
      assignedToFilter,
      itemsPerPage,
      sortBy,
      sortOrder,
      currentPage,
    ],
    () => {
      saveToStorage();
      updateUrl();
    },
    { deep: true }
  );

  const isFiltered = computed(
    () =>
      searchQuery.value !== DEFAULT_FILTERS.searchQuery ||
      typeFilter.value !== DEFAULT_FILTERS.typeFilter ||
      JSON.stringify([...statusFilter.value].sort()) !==
        JSON.stringify([...DEFAULT_FILTERS.statusFilter].sort()) ||
      assignedToFilter.value !== DEFAULT_FILTERS.assignedToFilter ||
      itemsPerPage.value !== DEFAULT_FILTERS.itemsPerPage ||
      sortBy.value !== DEFAULT_FILTERS.sortBy ||
      sortOrder.value !== DEFAULT_FILTERS.sortOrder
  );

  const clearFilters = () => {
    searchQuery.value = DEFAULT_FILTERS.searchQuery;
    typeFilter.value = DEFAULT_FILTERS.typeFilter;
    statusFilter.value = [...DEFAULT_FILTERS.statusFilter];
    assignedToFilter.value = DEFAULT_FILTERS.assignedToFilter;
    itemsPerPage.value = DEFAULT_FILTERS.itemsPerPage;
    sortBy.value = DEFAULT_FILTERS.sortBy;
    sortOrder.value = DEFAULT_FILTERS.sortOrder;
    currentPage.value = 1;
  };

  return {
    searchQuery,
    typeFilter,
    statusFilter,
    assignedToFilter,
    itemsPerPage,
    sortBy,
    sortOrder,
    currentPage,
    isFiltered,
    clearFilters,
  };
};
