import { Post } from "./posts.model";
import { Subject,Observable, map } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class PostsService{
    private posts:Post[]=[];
    private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
    private post = new Subject<Post>();
    constructor(private http: HttpClient, private router: Router){}
    
    getPosts(pageSize:number| null, page:number| null){
        const queryParams = `?pagesize=${pageSize}&page=${page}`;
        this.http
        .get<{ message: string; posts: any; maxPosts: number }>(
            "http://localhost:3000/api/posts" + queryParams
        )
        .pipe(
            map(postData => {
            return {
                posts: postData.posts.map((post:any) => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                };
                }),
                maxPosts: postData.maxPosts
            };
            })
        )
        .subscribe(transformedPostData => {
            this.posts = transformedPostData.posts;
            this.postsUpdated.next({
            posts: [...this.posts],
            postCount: transformedPostData.maxPosts
            });
        });
    }

    getPost(id: string | null){
        return this.http.get<{
          imagePath: string,
          _id:string,
          title:string,
          content:string
        }>('http://localhost:3000/api/posts/'+id);
    }

    getPostUpdatedListener(){
        return this.postsUpdated.asObservable();
    }
    
    addPost(title: string,content: string , image: File){
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http
        .post<{ message: string; post: Post }>(
            "http://localhost:3000/api/posts",
            postData
        )
        .subscribe(responseData => {
            this.router.navigate(["/"]);
        });
    }

    editPost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof image === "object") {
          postData = new FormData();
          postData.append("id", id);
          postData.append("title", title);
          postData.append("content", content);
          postData.append("image", image, title);
        } else {
          postData = {
            id: id,
            title: title,
            content: content,
            imagePath: image
          };
        }
        this.http
          .put("http://localhost:3000/api/posts/" + id, postData)
          .subscribe(response => {
            this.router.navigate(["/"]);
          });
      }
    

    deletePost(id: String){
        this.http.delete<{message: string}>('http://localhost:3000/api/posts/'+id)
            .subscribe((postsData)=>
                {
                    const updatedPosts= this.posts.filter((post)=> post.id != id);
                    this.posts=updatedPosts;
                    let length=this.posts.length
                    this.postsUpdated.next({posts:[...this.posts],postCount:length})
                    console.log(postsData.message);
                }
            )
    }
}