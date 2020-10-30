json.extract! product, :id, :shopify_title, :shopify_image_url, :shopify_product_id, :shopify_handle, :review, :shop_id, :employee_id, :page_url

json.url api_product_url ( product, format: :json )