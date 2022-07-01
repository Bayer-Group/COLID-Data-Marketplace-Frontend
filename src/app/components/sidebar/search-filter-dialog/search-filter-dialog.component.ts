import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AddSearchFilterDataMarketplace, AddStoredQueryToSearchFiltersDataMarketplace, FetchSearchFilterDataMarketplace } from 'src/app/states/user-info.state';
import { ActiveRangeFilters } from 'src/app/shared/models/active-range-filters';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { SearchFilterCollectionDto } from 'src/app/shared/models/user/search-filter-collection-dto';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { StoredQueryDto } from 'src/app/shared/models/user/stored-query-dto';



export interface DialogData {
  searchText: string;
  activeRangeFilters: ActiveRangeFilters;
  activeAggregationFilters: Map<string, string[]>;
}

@Component({
  selector: 'app-search-filter-dialog',
  templateUrl: './search-filter-dialog.component.html',
  styleUrls: ['./search-filter-dialog.component.scss']
})

export class SearchFilterDialogComponent implements OnInit {
  filterData: DialogData;
  searchFilterName: string;
  selectedSubscriptionValue: any;
  sendIntervals:string[] = ['Daily', 'Weekly', 'Monthly', '- -'];
  
  constructor( public dialogRef: MatDialogRef<SearchFilterDialogComponent>,
    private snackBar: ColidMatSnackBarService,
    private dialog: MatDialog,
    private store: Store, 
            @Inject(MAT_DIALOG_DATA) public data: DialogData ) {
              this.filterData = data;
              
            }
     
     ngOnInit() {
       this.filterData;
       this.selectedSubscriptionValue="- -"
       this.searchFilterName = `Search saved at ${new Date().toISOString().slice(0,-5)+"Z"}`;
    }   
    addSearchFilter() {
    const newSearchFilter = new SearchFilterDataMarketplaceDto(this.searchFilterName, this.filterData.searchText, new SearchFilterCollectionDto(this.filterData.activeAggregationFilters, this.filterData.activeRangeFilters));
    
    if(this.selectedSubscriptionValue=="- -"){
      this.dialogRef.close(this.store.dispatch(new AddSearchFilterDataMarketplace(newSearchFilter)).subscribe(() => {
        this.snackBar.success('Search Saved', 'The selected search has been saved.');
      }));
    }else{
      this.dialogRef.close(this.store.dispatch(new AddSearchFilterDataMarketplace(newSearchFilter)).subscribe((res:SearchFilterDataMarketplaceDto) => {
        const storedQuery=new StoredQueryDto(this.selectedSubscriptionValue,0);
        this.store.dispatch(new AddStoredQueryToSearchFiltersDataMarketplace(storedQuery)).subscribe(()=>{
          this.snackBar.success('Search Saved', 'The selected search has been saved.');
        });
        
      }));
    }
   
    }
    closeDialog(): void {
      this.dialogRef.close();
    }
    
    
}

