class Api::EmailsController < ShopifyApp::AuthenticatedController

  def create
    @email = Email.new()
    @email.name = params[:data][:name]
    @email.email = params[:data][:email]
    @email.message = params[:data][:message]
    @email.shop_name = session[:shopify_domain]
    if @email.deliver
      render json: { message: "Email sent successfully" }
    else
      render json: @email.errors.full_messages
    end
  end

end
