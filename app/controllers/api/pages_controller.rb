class Api::PagesController < ApplicationController

  def index
    @products = Employee.find(params[:employeeid]).products
    render :index
  end

  def getStaff
    @employees = Shop.find_by(shopify_domain: params[:shopDom]).employees
    render json: @employees, status: 200
  end

end
