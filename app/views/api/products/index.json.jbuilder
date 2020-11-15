@products.each do |product|
  json.set! product.shopify_title do
    json.partial! 'product', product: product
  end
end