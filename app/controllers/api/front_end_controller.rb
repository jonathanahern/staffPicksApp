class Api::FrontEndController < ApplicationController

    def index
        @shopsProducts = Product.getProductIDsSettings(params[:shop])
        render json: @shopsProducts
    end

    def show
        # @picks = Product.pickInfo(params[:prodID]).first
        @pick = Product.find_by(shopify_product_id: params[:prodID])
        @employee = Employee.find(@pick.employee_id)
        render json: { pick: @pick, employee: @employee }
    end

    private

    def front_end_params()
        params.permit(:shop, :prodID);
    end

end
