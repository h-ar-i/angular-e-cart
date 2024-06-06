import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  public payPalConfig ? : IPayPalConfig;

  checkOutStatus:boolean = false
  totalAmount:string = ""
  checkOutForm = this.fb.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    address:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 ,]*')]],
    pincode:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb: FormBuilder,private toaster:ToastrService,private api:ApiService,private router:Router) {} 


  cancel(){
     this.checkOutForm.reset() 
  }

  proceedToBuy(){
   if(this.checkOutForm.valid){
    this.checkOutStatus = true
    if(sessionStorage.getItem("cartTotal")){
      this.totalAmount = sessionStorage.getItem("cartTotal") || ""
      this.initConfig()
    }
   }else{
    this.toaster.info("Invaild form")
   }
  }

  

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: this.totalAmount,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: this.totalAmount
                        }
                    }
                }
               
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    //steps to follow when transction completed succesfully
            this.api.emptyCartApi().subscribe((res:any)=>{
              this.api.getCartApi()
              this.toaster.success("Transaction completed successfully....Thankyou for chossing us !!")
              this.checkOutStatus = false
              this.checkOutForm.reset()
              this.router.navigateByUrl("/")
            })
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.toaster.warning("Transaction cancelled would like to continue")
            this.checkOutStatus = false

        },
        onError: err => {
            console.log('OnError', err);
            this.toaster.warning("Transaction failed please try after some time!!!")

        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
          
        }
    };
}

}


