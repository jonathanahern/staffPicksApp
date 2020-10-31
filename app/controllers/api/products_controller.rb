class Api::ProductsController < ShopifyApp::AuthenticatedController

  def index
    @products = Shop.find(session[:shop_id]).products
    render :index
  end

  def show
    @product = Product.find(params[:id])
    render :show
  end

  def update
    @product = Product.find(params[:id])
    
    if @product.update(product_params)
      render :show
    else
      render json: @product.errors.full_messages, status: 422
    end

  end

  def create
    shop_id = session[:shop_id]
    @product = Product.new(product_params)
    @product.shop_id = shop_id

    if @product.save
      add_tag()
      render json: @product, status: 200
    else
      render json: @product.errors.full_messages, status: 401
    end

  end

  def destroy
    @product = Product.find(params[:id])
    @product.destroy
    remove_tag()
    render :show
  end

  private
    def product_params
      params.require(:product).permit(:shopify_title, :shopify_image_url, :shopify_product_id, :review, :shopify_handle, :shop_id, :employee_id)
    end

    def add_tag
      id=product_params[:shopify_product_id]
      prod=ShopifyAPI::Product.find(id)
      newTags=prod.tags
      if newTags.length > 0
        newTags = newTags + ", Staff Pick App"
      else
        newTags = "Staff Pick App"
      end
      prod.tags = newTags
      prod.save
    end

    def remove_tag
      prod=ShopifyAPI::Product.find(@product.shopify_product_id)
      newTags=prod.tags
      newTags.sub!(', Staff Pick App', '')
      newTags.sub!('Staff Pick App', '')
      prod.tags = newTags
      prod.save
    end

end