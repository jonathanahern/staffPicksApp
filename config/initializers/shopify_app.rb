ShopifyApp.configure do |config|
  config.application_name = "My Shopify App"
  config.api_key = ENV['api_key']
  config.secret = ENV['api_secret']
  config.old_secret = ""
  config.scope = "read_products, write_products, read_script_tags, write_script_tags, read_content, write_content, read_product_listings" 
  config.embedded_app = true
  config.after_authenticate_job = false
  config.api_version = "2020-10"
  config.shop_session_repository = 'Shop'
  config.allow_jwt_authentication = true
  config.scripttags = [
    {event:'onload', src: 'https://staff-picks-app.herokuapp.com/insert.js'}
  ]
  # config.webhooks = [
  #   {topic: 'products/update', address: 'https://staff-picks-app.herokuapp.com/webhooks/products_update', fields: ['id','image', 'title'], format: 'json'},
  # ]
end

# ShopifyApp::Utils.fetch_known_api_versions                        # Uncomment to fetch known api versions from shopify servers on boot
# ShopifyAPI::ApiVersion.version_lookup_mode = :raise_on_unknown    # Uncomment to raise an error if attempting to use an api version that was not previously known
