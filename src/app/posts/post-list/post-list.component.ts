import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material'

import { PostsService } from './../post.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

 posts: Post[] = [];
 private postSub: Subscription;
 isLoading: boolean = false;
 public totalPost = 0;
 public postPerPage = 2;
 public pageSizeOptions = [1,2,5,10]
 currentPage: number = 1
 private authStatusSub: Subscription
 authenticatedUser:boolean = false
 userId:string

 constructor(
   public postsService: PostsService,
   private authService : AuthService) { }

  ngOnInit() {
    this.isLoading = true
    this.postsService.getPosts(this.postPerPage, this.currentPage)
    this.userId = this.authService.getUserId()
    this.postSub = this.postsService
    .getUpdatedPosts()
    .subscribe(
      (postData:{posts :  Post[], postCount: number})=> {
        this.isLoading = false
        this.totalPost = postData.postCount
        this.posts = postData.posts 
      }
    )
    this.authenticatedUser = this.authService.getIsAuth()
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.authenticatedUser = isAuth
      this.userId = this.authService.getUserId()
    })
  }

  ngOnDestroy(){
    this.postSub.unsubscribe()
    this.authStatusSub.unsubscribe()
  }

  onDelete(id: string){
    this.isLoading = true
    this.postsService.deletePost(id)
    .subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage)
    }, () => this.isLoading = false )
  }

  onPageChange(pageData: PageEvent){
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.postPerPage = pageData.pageSize
    this.postsService.getPosts(this.postPerPage, this.currentPage)
  }

}
