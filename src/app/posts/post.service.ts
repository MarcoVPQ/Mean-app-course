import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/Operators';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';


@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<{posts:Post[], postCount: number}>();

    constructor(
        private http: HttpClient, 
        private router : Router,
        private authService: AuthService
        ){ }

    getPosts(postPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`
        this.http.get<{message:string, posts: any, maxPosts: number}>(`http://localhost:8000/api/posts${queryParams}`)
        .pipe(
            map((postData) => {
            return { posts: postData.posts.map( post => {
                return{
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imgPath: post.imgPath,
                    creator: post.creator
                }
            }), 
            maxPosts: postData.maxPosts
        }
        }))
        .subscribe((newPostData) => {
            this.posts = newPostData.posts;
            this.postUpdated.next({posts:[...this.posts ], postCount: newPostData.maxPosts})
         })
    }

    getUpdatedPosts(){
        return this.postUpdated.asObservable()
    }

    addPost(title: string, content: string, file: File){

        const postData = new FormData()

        postData.append('title', title)
        postData.append('content', content)
        postData.append('file', file , title)


        this.http
        .post<{message: string, post: Post}>(
            'http://localhost:8000/api/posts',
             postData
        )
        .subscribe((responseData) => {
            //console.log(responseData)
            this.router.navigate(['/'])
        })
    }

    deletePost(postId: string){
        return this.http.delete(`http://localhost:8000/api/posts/${postId}`)
    }

    getPost(id:string){
        return this.http
        .get<{_id: string , title:string, content:string, imgPath: string, creator: string}>(`http://localhost:8000/api/posts/${id}`)
    }

    updatePost(id:string, title:string, content:string, file:File | string){
        let formData: Post | FormData
        if(typeof file === 'object'){
            formData = new FormData()
            formData.append('id', id)
            formData.append('title',title )
            formData.append('content',content )
            formData.append('file', file, title )

        }else{
             formData= {
                id,
                title,
                content,
                imgPath:file
            }
        }
        this.http
        .put(`http://localhost:8000/api/posts/${id}`, formData)
        .subscribe( response => {
            const updatedPosts = [...this.posts]
            this.router.navigate(['/'])
        })
    }
}