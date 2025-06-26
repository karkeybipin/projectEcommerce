

import React from "react";
import { ShopContext } from "../context/ShopContext";
import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [products]);

  return (
    <div className="my-10">
      {/* Header section with fade-in animation */}
      <div 
        className={`text-center py-8 text-3xl transition-all duration-1000 ease-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p 
          className={`w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 transition-all duration-1000 ease-out transform delay-300 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          Discover our latest collections, featuring the newest trends and
          timeless classics.
        </p>
      </div>

      {/* Products grid with staggered animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-out transform ${
              isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              transitionDelay: `${index * 100 + 500}ms`
            }}
          >
            <div className="group cursor-pointer transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-2">
              <ProductItem 
                id={item._id} 
                image={item.image} 
                name={item.name} 
                price={item.price} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;