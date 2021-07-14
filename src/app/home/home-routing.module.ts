import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ExploreComponent } from './explore/explore.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'explore', component: ExploreComponent },
    { path: 'artists', component: ArtistsComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'contact-us', component: ContactusComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
