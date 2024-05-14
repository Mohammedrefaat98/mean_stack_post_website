import { Post } from "./posts.model";
import { Subject,Observable, map } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class PostsService{
    private posts:Post[]=[];
    private postsUpdated = new Subject<Post[]>();
    private post = new Subject<Post>();
    constructor(private http: HttpClient, private router: Router){}
    
    getPosts(pageSize:number| null,page:number| null){
        let url= 'http://localhost:3000/api/posts';
        let query = `?pagesize=${pageSize}&page=${page}`;
        this.http.get<{message: string, posts:any}>(url+query)
            .pipe(map((postData)=>{
                return postData.posts.map((post:any)=>{
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    }
                })
            }))
            .subscribe((postsData)=>
                {
                    this.posts=postsData;
                    this.postsUpdated.next([...this.posts])
                }
            )
    }

    getPost(id: string | null){
        return this.http.get<{
          imagePath: string,_id:string,title:string,content:string
}>('http://localhost:3000/api/posts/'+id);
    }

    getPostUpdatedListener(){
        return this.postsUpdated.asObservable();
    }
    
    addPost(title: string,content: string , image: File){
        const post=new FormData();
        post.append('title',title)
        post.append('content',content)
        post.append('image',image, title)
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts',post)
            .subscribe((postsData)=>
                {
                    const post= {
                        id: postsData.post.id,
                        title:title,
                        content:content,
                        imagePath:postsData.post.imagePath
                    }
                    this.posts.push(post);
                    this.postsUpdated.next([...this.posts])
                    this.router.navigate(["/"]); 
                }
            )
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
                    this.postsUpdated.next([...this.posts])
                    console.log(postsData.message);
                }
            )
    }
}