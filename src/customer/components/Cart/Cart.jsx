import React from "react";
import CartItem from "./CartItem";
import { mens_kurta } from "../../../Data/mens-kurta";
import { Button } from "@mui/material";

const Cart = () => {
  return (
    <div>
      <div className="lg:grid grid-cols-3 lg:px-16 relative">
        <div className="col-span-2">
          {mens_kurta.map((item) => (
            <CartItem product={item} />
          ))}
        </div>
        <div className="px-5 sticky lg:mt-3 sm:mt-0 col-span-1">
          <div className="shadow-lg border-2 p-5 border-gray-300 col-span-1 rounded-md">
            <p className="uppercase font-bold opacity-60 pb-4">Price Details</p>
            <hr style={{ border: "none", borderTop: "1px solid #d7d7d7" }} />

            <div className="space-y-3 font-semibold">
              <div className="flex justify-between pt-3 text-black">
                <span className="font-semibold">Price</span>
                <span className="font-semibold">$4697</span>
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span className="font-semibold">Discount</span>
                <span className="font-semibold text-green-500">-$3419</span>
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span className="font-semibold">Delivery Charges </span>
                <span className="font-semibold  text-green-500">Free</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #d7d7d7" }} />
              <div className="flex justify-between pt-3 text-black">
                <span className="font-bold">Total Amount</span>
                <span className="font-semibold  text-green-500">$1278</span>
              </div>
              <Button sx={{backgroundColor:'#9154fd', color:'white', fontSize:'15px',display:'flex', justifyContent:'center', mx:'auto', ':hover':{bgcolor:'#7e3bf2'}}} >CHECK OUT</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
