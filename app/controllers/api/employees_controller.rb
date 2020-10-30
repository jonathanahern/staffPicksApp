class Api::EmployeesController < ShopifyApp::AuthenticatedController

  def index
    @employees = Shop.find(session[:shop_id]).employees
    render :index
  end

  def show
    @employee = Employee.find(params[:id])
    render :show
  end

  def update
    @employee = Employee.find(params[:id])
    
    if @employee.update(employee_params)
      render :show
    else
      render json: {error: @employee.errors.full_messages, status: 422 }
    end

  end

  def create
    shop_id = session[:shop_id]
    @employee = Employee.new(employee_params)
    @employee.shop_id = shop_id
    if @employee.save

      if createPage(@employee)
        render json: @employee, status: 200
      else
        render json: {error: "Page didn't save"}, status: 422
      end

    else

      render json: {error: @employee.errors.full_messages, status: 422 }

    end

  end

  def destroy
    @employee = Employee.find(params[:id])
    if @employee.destroy
      deletePage(@employee.shopify_page_id)
    end
    render :show
  end

  private

    def employee_params
      params.require(:employee).permit(:name, :job_title, :description, :shop_id, :shopify_page_id, :profile_url)
    end

    def deletePage(pageID)
      result = ShopifyAPI::Page.find(pageID)
      result.destroy
    end

    def createPage(employee)
      description = employee.description.gsub("\n", "<br />");
      @page = ShopifyAPI::Page.new
      @page.title = employee.name
      @page.body_html =
          "<div id='profile-container'>\n
            <img src=#{employee.profile_url} alt='Staff Pic' width='200px' class='staff-profile-img'>\n
            <p>#{description}<p/>\n
          </div>\n
          <h2 id='my-picks-header'>My Picks:</h2>\n
          <div class='staff-picks-products' data-staffid='#{employee.id}'></div>\n
          <style>\n
            #profile-container {\n
                display: flex;\n
                justify-content: center;\n
            }\n
            #profile-container p {\n
                max-width: 500px;\n
            }\n
            #profile-container img {\n
                width: 220px;\n
                margin-right: 20px;\n
                margin-bottom: 20px;\n
            }\n
            #my-picks-header {\n
                text-align: center;\n
            }\n

            .pick-container {\n
                height: 320px;\n
                width: 280px;\n
                border-bottom: none !important;\n
                overflow: hidden; \n
            }\n
            .staff-picks-products {\n
                width: 100%;\n
                display: flex;\n
                flex-wrap: wrap;\n
                justify-content: space-between;\n
                align-items: center;\n
            }\n
            .clearfix:: after {\n
                content: "";\n
                clear: both;\n
                display: table;\n
            }\n
            .img-container {\n
                float: left;\n
                width: 120px;\n
                align-items: center;\n
                margin-top: 4px;\n
                margin-right: 8px;\n
            }\n
            .pick-container h4  {\n
                margin: 6px 0;\n
                font-size: 18px;\n
            }\n
            @media screen and (max-width: 790px) {\n
                #profile-container {\n
                    flex-direction: column;\n
                    align-items: center;\n
                }\n
                .staff-picks-products {\n
                  flex-direction: column;\n
                }\n
            };\n
        </style>"
      if @page.save
        employee.update(:shopify_page_id => @page.id, :page_url => @page.handle);
        return true
      else
        return false
      end
    end

end