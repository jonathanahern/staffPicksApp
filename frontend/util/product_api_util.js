export const fetchProducts = () => {
    return $.ajax({
        url: "api/products",
        method: "GET"
    });
};

export const fetchProduct = (productId) => {
  return $.ajax({
    url: `api/products/${productId}`,
    method: "GET",
  });
};

export const updateProduct = (product) =>
         $.ajax({
           url: `/api/products/${product.id}`,
           headers: {
             "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
           },
           method: "patch",
           data: { product },
         });

export const createProduct = (product) =>
         $.ajax({
           url: `api/products/`,
           method: "POST",
           headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
           data: { product },
         });

export const deleteProduct = (productId) =>
         $.ajax({
           url: `/api/products/${productId}/`,
           headers: {
             "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
           },
           method: "DELETE",
         });