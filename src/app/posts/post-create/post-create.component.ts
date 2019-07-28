import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { mimeType } from './mime.validator'
import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  
  private mode: string = 'create';
  private postId: string = "";
  private authStatusSub: Subscription
  disabled: boolean = true;
  post: Post;
  isLoading: boolean = false;
  form: FormGroup
  imgPreview: string | ArrayBuffer;

  constructor(public postsService: PostsService, 
              public route: ActivatedRoute, 
              public router:Router,
              private auth: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusListener()
    .subscribe( status => {
      this.isLoading = false
    })
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'file': new FormControl(null, {
        validators: [Validators.required]/*,
        asyncValidators: [mimeType]*/
      })
    })

    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if(paramMap.has('id')){
          this.mode = "edit";
          this.postId = paramMap.get('id');
          ///Show spinner
          this.isLoading = true;
          this.postsService.getPost(this.postId)
          .subscribe(postData => {
            ///hide spinner
            this.isLoading = false;
            this.post = { 
              id: postData._id,
              title: postData.title, 
              content: postData.content,
              imgPath:postData.imgPath
            }
           this.form.setValue({
             'title': this.post.title,
             'content': this.post.content,
             'file': this.post.imgPath
           }) 
          })
        }else{
          this.mode = 'create';
          this.postId = null;
        }
      }
    )
  }

  addPost(){
    if(this.form.invalid){
      return
    }
    if(this.mode === 'create'){
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.file,

      )
    } else{
      this.postsService.updatePost(
        this.postId ,
        this.form.value.title, 
        this.form.value.content,
        this.form.value.file
       )
    }
    
    this.router.navigate([''])

    this.form.reset();
  }

  onFilePicked(e: Event){
    const file = (e.target as HTMLInputElement).files[0]
    this.form.patchValue({file})
    this.form.get('file').updateValueAndValidity()
    
    const reader = new FileReader()
    reader.onload = () => {
      this.imgPreview = <string>reader.result
    }

    reader.readAsDataURL(file)

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authStatusSub.unsubscribe()
  }

}
