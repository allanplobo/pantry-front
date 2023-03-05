import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'pantry',
        loadChildren: () =>
          import('../pages/pantry/pantry.module').then(
            (m) => m.PantryPageModule
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('../pages/about/about.module').then((m) => m.AboutPageModule),
      },
      {
        path: '**',
        loadChildren: () =>
          import('../pages/not-found/not-found.module').then(
            (m) => m.NotFoundPageModule
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/pantry',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
