import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  wishlistCount = new BehaviorSubject(0) 
  cartCount = new BehaviorSubject(0)
  server_url = "https://cart-server-angular.onrender.com"
  
  constructor(private http:HttpClient) {
    if(sessionStorage.getItem("token")){
      this.getWishlistCount()
      this.getCartCount()
    }
   }

  getAllProduct(){
    return this.http.get(`${this.server_url}/all-products`)
  }

  registerApi(user:any){
    return this.http.post(`${this.server_url}/register`,user)
  }

  loginApi(user:any){
    return this.http.post(`${this.server_url}/login`,user)

  }

  getAproductApi(id:any){
    return this.http.get(`${this.server_url}/${id}/get-product`)
  }

//append token which return token in header
  appendtoken(){
    const token = sessionStorage.getItem("token")
    let headers = new HttpHeaders()
    if(token){
      headers = headers.append("Authorization", `Bearer ${token}`)
    }
    return {headers}
  }   

//user/add-to-wishlist
  addToWishlistapi(product:any){
    return this.http.post(`${this.server_url}/user/add-to-wishlist`,product,this.appendtoken())
  }

  getwishlistapi(){
    return this.http.get(`${this.server_url}/get-wishlist`,this.appendtoken())

  }

  getWishlistCount(){
    this.getwishlistapi().subscribe((result:any)=>{
      this.wishlistCount.next(result.length)
    })
  }
  
  removeWishlistApi(id:any){
    return this.http.delete(`${this.server_url}/remove-wishlist/${id}/item`,this.appendtoken())
  }

  addToCartAPI(product:any){
    return this.http.post(`${this.server_url}/user/add-to-cart`,product,this.appendtoken());

  }

  getCartApi(){
    return this.http.get(`${this.server_url}/get-cart`,this.appendtoken())
  }

  getCartCount(){
    this.getCartApi().subscribe((result:any)=>{
      this.cartCount.next(result.length)
    })
  }

  removeCartItemApi(id:any){
    return this.http.delete(`${this.server_url}/remove-cart/${id}/item`,this.appendtoken())
  }

  getIncrementCartApi(id:any){
    return this.http.get(`${this.server_url}/${id}/increment-cart`,this.appendtoken())
  }

  getDecrementCartApi(id:any){
    return this.http.get(`${this.server_url}/${id}/decrement-cart`,this.appendtoken())
  }

  emptyCartApi(){
    return this.http.delete(`${this.server_url}/empty-cart`,this.appendtoken())
  }


}
