import { Component , OnDestroy, OnInit} from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit,OnDestroy{
  posts:Post[]= [];
  isLoading = false;
  private postSub: Subscription = new Subscription;
  size=10;
  pageSizeOptions=[1,2,5,10];
  postsPerPage=2;

  constructor (public postService: PostsService){}
  
  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.size,1);
    this.postSub = this.postService.getPostUpdatedListener()
      .subscribe((arg:Post[]) =>{
        this.isLoading = false;
        this.posts = arg
      });
    
  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onDelete(id: String){
    this.postService.deletePost(id);
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.postService.getPosts(pageData.pageSize,pageData.pageIndex+1);
    this.postSub = this.postService.getPostUpdatedListener()
      .subscribe((arg:Post[]) =>{
        this.isLoading = false;
        this.posts = arg
      });
    console.log(pageData);
  }
}
