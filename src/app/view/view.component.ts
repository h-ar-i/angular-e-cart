import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit{
product:any = {}
constructor(private route:ActivatedRoute,private api:ApiService,private toaster:ToastrService){}

ngOnInit(): void {
  this.route.params.subscribe((res:any)=>{
    const {id} = res
    this.getProductdetails(id)
  })
}

getProductdetails(id:any){
this.api.getAproductApi(id).subscribe((res:any)=>{
this.product = res
})
}

addToWishlist(product:any){
  if(sessionStorage.getItem("token")){
    this.api.addToWishlistapi(product).subscribe({
      next:(result:any)=>{
        this.toaster.success(`product ${result.title} has been added to ur wishlist`)
        this.api.getWishlistCount()
      },
      error:(reason:any)=>{
        console.log(reason);
        this.toaster.warning(reason.error)
        
      }
    })
  }else{
    this.toaster.warning("please Login")
  }
}

addToCart(product:any){
  if(sessionStorage.getItem("token")){
    product.quantity=1
    this.api.addToCartAPI(product).subscribe({
      next:(result:any)=>{
        this.toaster.success(result)
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        this.toaster.warning(reason.error)
      }
    })
  
 
  }else{
    this.toaster.warning("please Login")
  }
}

}


