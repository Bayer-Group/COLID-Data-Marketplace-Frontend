import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserPreferencesComponent } from './components/user-preferences/user-preferences.component';
import { ResourceSubscriptionsComponent } from './components/resource-subscriptions/resource-subscriptions.component';
import { SearchSubscriptionsComponent } from './components/search-subscriptions/search-subscriptions.component';
import { SearchFilterDataMarketplaceComponent } from './components/search-filter-data-marketplace/search-filter-data-marketplace.component';
import { UserPreferencesGeneralComponent } from './components/user-preferences-general/user-preferences-general.component';

const routes: Routes = [
    {
        path: '',
        component: UserPreferencesComponent,
        children: [
            {
                path: 'resourceSubscriptions',
                component: ResourceSubscriptionsComponent,
                pathMatch: 'full'
            },
            {
                path: 'storedQueries',
                component: SearchSubscriptionsComponent,
                pathMatch: 'full'
            },
            {
                path: 'searchFiltersDataMarketplace',
                component: SearchFilterDataMarketplaceComponent,
                pathMatch: 'full'
            },
            {
                path: '',
                component: UserPreferencesGeneralComponent,
                pathMatch: 'full',
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserPreferencesRoutingModule { }
