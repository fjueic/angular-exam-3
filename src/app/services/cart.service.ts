import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment} from "../environments/environment";

@Injectable({
	providedIn: "root",
})
interface CartItem{
  name:string;
  quantitiy:number;
  price:number
}
export class CartService {
  private dbUrl:string = environment.firebase.databaseURL;
  private emailid:string = localStorage.getItem("emailID")
	constructor(private http:HttpClient) {}
  addToCart(item:CartItem):Observable<any>{
    if(!this.emailid){
      throw new Error('Loggin first')
    }
    return this.http.post(`${this.dbUrl}/cart/${this.emailid}.json`,item)
  }
  getCart():Observable<
}
