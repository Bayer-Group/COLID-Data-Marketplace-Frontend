export class Favorites {
  id: string;
  userId: string;
  name: string;
  favoritesListEntries: FavoriteListEntryMetadata[];
  // personalNote: string;
  // pidUri: string;
  // favoritesListId: string;
  favoritesListEntryId: string;
}

export class FavoriteListEntry {
    id: string;
    pidUri: string;
    userId: string;
    personalNote: string;
    favoritesListId: string;
    favoritesListEntryId: string;
}

export class FavoriteListMetadata {
    name: string;
    favoritesListEntries: FavoriteListEntryMetadata[];
    id: string;
}

export class FavoriteListEntryMetadata {
    pidUri: string;
    personalNote: string;
    id: string;
}