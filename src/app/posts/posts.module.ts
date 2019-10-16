import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../material.module';


import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';


@NgModule({
 declarations: [
    PostListComponent,
    PostCreateComponent
    ],
 imports: [
   CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
    ]
})
export class PostsModule{}