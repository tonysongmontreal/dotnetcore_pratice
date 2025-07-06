import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MemberList } from './members/member-list/member-list';
import { Lists } from './lists/lists';
import { Messages } from './messages/messages';
import { MemberDetails } from './members/member-details/member-details';
import { authGuard } from './_guards/auth-guard';
import { TestErrors } from './errors/test-errors/test-errors';
import { NotFound } from './errors/not-found/not-found';
import { ServerError } from './errors/server-error/server-error';
import { MemberProfile } from './features/members/member-profile/member-profile';
import { MemberPhotos } from './features/members/member-photos/member-photos';
import { MemberMessages } from './features/members/member-messages/member-messages';
import { memberResolver } from './features/members/member-resolver-resolver';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes-guard';


export const routes: Routes = [
    {path: '', component: Home},
  {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberList },
            {
                path: 'members/:id',
                resolve: {member: memberResolver},
                runGuardsAndResolvers: 'always',
                component: MemberDetails,
                children: [
                    {path: '', redirectTo: 'profile', pathMatch: 'full'},
                      {path: 'profile', component: MemberProfile, title: 'Profile',
                        canDeactivate: [preventUnsavedChangesGuard]},
                    {path: 'photos', component: MemberPhotos, title: 'Photos'},
                    {path: 'messages', component: MemberMessages, title: 'Messages'},
                ]
            },
            { path: 'lists', component: Lists },
            { path: 'messages', component: Messages },
        ]
    },
    { path: 'errors', component: TestErrors },
    { path: 'not-found', component: NotFound },
    { path: 'server-error', component: ServerError },
    {path: '**', component: Home, pathMatch: 'full'},
];

