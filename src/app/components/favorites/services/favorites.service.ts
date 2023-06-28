import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { MessageDto } from "src/app/shared/models/user/message-dto";
import {
  FavoriteListEntry,
  FavoriteListMetadata,
  Favorites,
} from "src/app/shared/models/favorites";

@Injectable({
  providedIn: "root",
})
export class FavoritesService {
  constructor(private httpClient: HttpClient) {}

  //This endpoint fetches all the favorite lists
  getFavorites(userId: string): Observable<FavoriteListMetadata[]> {
    const url = `${environment.appDataApiUrl}/Users/favoritesList/${userId}`;
    return this.httpClient.get<FavoriteListMetadata[]>(url);
  }

  //This endpoint creates a Favorites List - if only provided name it creates a blank list
  createFavoritesList(userId: string, payload: any): Observable<Favorites[]> {
    const url = `${environment.appDataApiUrl}/Users/favoritesList/${userId}`;
    return this.httpClient.put<Favorites[]>(url, payload);
  }

  //This endpoint edits the name of the list
  editFavoritesList(
    userId: string,
    favoritesListId: string,
    payload: any
  ): Observable<Favorites> {
    const url = `${environment.appDataApiUrl}/Users/favoritesList/${userId}/${favoritesListId}`;
    return this.httpClient.put<Favorites>(url, payload);
  }

  //This endpoint adds multiple entries inside favorite list
  addFavoriteEntries(userId: string, payload: any): Observable<Favorites> {
    const url = `${environment.appDataApiUrl}/Users/favoritesListEntries/${userId}`;
    return this.httpClient.put<Favorites>(url, payload);
  }

  //This endpoint adds the entry inside a favorite list
  addFavoriteListEntry(
    userId: string,
    favoritesListId: string,
    payload: any
  ): Observable<Favorites> {
    const url = `${environment.appDataApiUrl}/Users/favoritesList/${userId}/${favoritesListId}`;
    return this.httpClient.post<Favorites>(url, payload);
  }

  //This endpoint edits the note of the list
  editFavoritesListEntry(
    userId: string,
    favoritesListEntryId: string,
    payload: any
  ): Observable<Favorites> {
    const url = `${environment.appDataApiUrl}/Users/favoritesListEntry/${userId}/${favoritesListEntryId}`;
    return this.httpClient.put<Favorites>(url, payload);
  }

  //This endpoit returns all PidUri's from Favorites Lists
  getFavoritesListPIDUris(userId: string): Observable<Favorites[]> {
    const url = `${environment.appDataApiUrl}/Users/favoritesListPIDUris/${userId}`;
    return this.httpClient.get<Favorites[]>(url);
  }

  //This endpoint gets the entries inside of a Favorite List. Used on expand click
  getFavoritesListDetails(
    userId: string,
    favoritesListId: string
  ): Observable<{ [pidUri: string]: any }> {
    const url = `${environment.appDataApiUrl}/Users/favoritesListDetails/${userId}/${favoritesListId}`;
    return this.httpClient.get<{ [pidUri: string]: any }>(url);
  }

  //This endpoint returns the Favorites List Id's that a resource is.
  getFavoritesListIDs(
    userId: string,
    pidUri: string
  ): Observable<FavoriteListEntry[]> {
    const url = `${environment.appDataApiUrl}/Users/favorites/resourceFavoritesLists/${userId}/${pidUri}`;
    return this.httpClient.get<FavoriteListEntry[]>(url);
  }

  //This endpoint deletes a favorite list meaning that the entries inside will also be deleted with it
  deleteFavoriteList(
    userId: string,
    favoritesListId: string
  ): Observable<MessageDto> {
    const url = `${environment.appDataApiUrl}/Users/${userId}/favoritesList/${favoritesListId}`;
    return this.httpClient.delete<MessageDto>(url);
  }

  //This endpoint removes an entry that is inside a favorite list
  removeFavoriteListEntry(
    userId: string,
    favoritesListEntryId: string
  ): Observable<MessageDto> {
    const url = `${environment.appDataApiUrl}/Users/${userId}/favoritesListEntries/${favoritesListEntryId}`;
    return this.httpClient.delete<MessageDto>(url);
  }

  //This endpoint removes multiple entries from a favorite list
  removeFavoriteListEntries(
    userId: string,
    payload: any
  ): Observable<MessageDto> {
    const url = `${environment.appDataApiUrl}/Users/removeFavoritesListEntries/${userId}`;
    return this.httpClient.post<MessageDto>(url, payload);
  }
}
