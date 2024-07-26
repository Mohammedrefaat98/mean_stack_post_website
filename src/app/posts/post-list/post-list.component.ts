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
  currentPage=1;
  constructor (public postService: PostsService){}
  
  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postService
      .getPostUpdatedListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.size = postData.postCount;
        this.posts = postData.posts;
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
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
