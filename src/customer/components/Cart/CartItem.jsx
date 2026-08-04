import React from "react";
import { IconButton, Button } from "@mui/material";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const CartItem = ({ product }) => {
  return (
    <div className="p-5 shadow-lg border-2 border-gray-200 rounded-md m-3 ">
      <div className="flex items-center">
        <div className="w-20 h-20 lg:w-36 lg:h-36">
          <img
            className="w-full h-full object-cover object-top"
            src={product.imageUrl}
          />
        </div>

        <div className="ml-5 space-y-1">
          <p className="font-semibold">
           {product.title}
          </p>
          <p className="opacity-70">Size: L, White</p>
          <p className="opacity-70 mt-2">Seller: {product.brand}</p>
          <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 pt-6">
            <p className="opacity-60 line-through">${product.price}</p>
            <p className="font-semibold">${product.discountedPrice}</p>
            <p className="text-green-500 font-semibold">{product.discountPersent}% Off</p>
          </div>
        </div>
      </div>
      <div className="lg:flex items-center lg:space-x-10 pt-4">
        <div className="flex items-center space-x-2">
          <IconButton sx={{color:''}}>
            <RemoveCircleOutlineOutlinedIcon />
          </IconButton>
          <span className="py-1 px-7 border border-gray-300 rounded-sm">3</span>
          <IconButton sx={{color:'#9933CC'}}>
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </div>          

        <Button sx={{backgroundColor:'#fff', color:'#3399FF' }}>
            REMOVE
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
