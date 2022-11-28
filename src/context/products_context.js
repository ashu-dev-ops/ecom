import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
// we can rename default export as we want
import reducer from "../reducers/products_reducer";
// renaming named export
import { products_url as url } from "../utils/constants";
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR,
} from "../actions";

const initialState = {
  isSideBarOpen: false,
  products_loading: false,
  products_err: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const opendSideBar = () => {
    dispatch({
      type: SIDEBAR_OPEN,
    });
  };
  const closeSideBar = () => {
    dispatch({
      type: SIDEBAR_CLOSE,
    });
  };
  const fetchProducts = async (url) => {
    dispatch({
      type: GET_PRODUCTS_BEGIN,
    });
    try {
      const { data: products } = await axios.get(url);
      dispatch({
        type: GET_PRODUCTS_SUCCESS,
        payload: products,
      });
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
    // will fetch and convert api json to js object

    // console.log(data);
  };

  useEffect(() => {
    fetchProducts(url);
  }, []);
  const fetchSingleProduct = async (url) => {
    dispatch({
      type: GET_SINGLE_PRODUCT_BEGIN,
    });
    try {
      const { data: singleProduct } = await axios.get(url);
      dispatch({
        type: GET_SINGLE_PRODUCT_SUCCESS,
        payload: singleProduct,
      });
    } catch (error) {
      dispatch({
        type: GET_SINGLE_PRODUCT_ERROR,
      });
    }
  };
  return (
    <ProductsContext.Provider
      value={{ ...state, opendSideBar, closeSideBar, fetchSingleProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
