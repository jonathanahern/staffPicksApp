class Api::SettingsController < ShopifyApp::AuthenticatedController

  def show
    @setting = Shop.find(session[:shop_id])
    render :show
  end

  def create
    createPage(page_params)
    render json: page_params
  end

  def update
    @setting = Shop.find(session[:shop_id])

    if @setting.update(setting_params)
      render :show
    else
      render json: {error: @setting.errors.full_messages, status: 422 }
    end

  end

private

    def setting_params
        params.require(:setting).permit(:sticker, :layout)
    end

    def page_params
        params.require(:pageData).permit(:page_title, :subtitle)
    end

    def createPage(pageData)
      title = pageData[:page_title]
      subtitle = pageData[:subtitle].gsub("\n", "<br />");
      @page = ShopifyAPI::Page.new
      @page.title = title
      @page.body_html =
          "<p id='staff-subtitle'>#{subtitle}</p>\n
          <div id='staff-profiles-ele'></div>\n
          <style>\n
          #staff-subtitle {\n
            text-align:center;\n
            margin-bottom: 32px;\n
          }\n
      .staff-member-container {\n
        width: 33%;\n
        padding-right: 32px;\n
        height: 380px;\n
        overflow: hidden;\n
        border-bottom: none !important;\n
      }\n
      .staff-img-container {\n
        width: 42%;\n
        padding-right: 6px;\n
        float: left;\n
      } \n
      #staff-profiles-ele {\n
        display: flex;\n
        flex-wrap: wrap;\n
      }\n
      .staff-img-container:: after {\n
        content: "";\n
        clear: both;\n
        display: table;\n
      }\n
      .staff-member-container h4{\n
        margin: 0;\n
        font-size: 16px;\n
      }
      .section-header {\n
        margin-bottom: 0px;\n
      }\n
      @media screen and (max-width: 900px) {\n
        #staff-profiles-ele {\n
          flex-direction: column;\n
          align-items: center;\n
        }\n
        .staff-member-container {\n
          width: 70%;\n
          height: inherit;\n
          margin-top: 24px;\n
        }\n
        .staff-img-container {\n
          width: 45%;\n
        }\n
        </style>"
      if @page.save
        return true
      else
        return false
      end

    end

end