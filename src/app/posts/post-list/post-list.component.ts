import { Component , OnDestroy, OnInit} from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

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
  userIsAuthenticated = false;
  private authStatSubs: Subscription;
  constructor (public postService: PostsService, public authService: AuthService){}
  
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
      this.userIsAuthenticated= this.authService.getIsAuth();
      this.authStatSubs= this.authService.getAuthStateListener().subscribe(isAuthenticated => 
      {
        console.log("blyat");
        this.userIsAuthenticated=isAuthenticated
      }
    )
  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatSubs.unsubscribe();
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
