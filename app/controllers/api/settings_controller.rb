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
    setting_obj = setting_params[:sticker].length > 1 ? {sticker: setting_params[:sticker]} : {layout: setting_params[:layout]}
    if @setting.update(setting_obj)
      render :show
    else
      render json: {error: @setting.errors.full_messages, status: 422 }
    end

  end

  def insertStickers
    # themeID = ShopifyAPI::Theme.find(:all).where(role: "main").first.theme_store_id
    allAssets = ShopifyAPI::Asset.find(:all)
    productGridAssets = allAssets.select do |asset|
      asset.key.include?("product") && (asset.key.include?("grid"))
    end
    assetKey = productGridAssets.first.key;
    theAsset = ShopifyAPI::Asset.find(assetKey)
    stickerStr = '
          <div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>'
    imgInd = theAsset.value.index('<img')
    if (imgInd!=nil) 
      newStr = theAsset.value[imgInd..-1]
      insertPoint = newStr.index('>') + imgInd + 1
      newValue = theAsset.value.insert(insertPoint, stickerStr)
      theAsset.value = newValue + ""
    end
    if (imgInd!=nil)
      if theAsset.save
        @setting = Shop.find(session[:shop_id])
        @setting.sticker_theme = true
        if @setting.save
          render :show
        else
          render json: {error: "Shop not saved", status: 422 }
        end
      else
        render json: {error: "Could not save theme", status: 422 }
      end
    else
        render json: {error: "Could not find img element", status: 422 }
    end
  end

  def clearStickers
    foundIt = false
    allAssets = ShopifyAPI::Asset.find(:all)
    productGridAssets = allAssets.select do |asset|
      asset.key.include?("product") && (asset.key.include?("grid"))
    end
    assetKey = productGridAssets.first.key;
    theAsset = ShopifyAPI::Asset.find(assetKey)
    stickerStr = '
          <div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>'
    stickerStrShort = '<div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>'
    
    if theAsset.value.slice!(stickerStr)==nil
      if theAsset.value.slice!(stickerStrShort)!=nil
        foundIt = true;
      end
    else
      foundIt = true;
    end

    if (foundIt)
      if theAsset.save
        @setting = Shop.find(session[:shop_id])
        @setting.sticker_theme = false
        if @setting.save
          render :show
        else
          render json: {error: "Shop not saved", status: 422 }
        end
      else
        render json: {error: "Could not alter theme file", status: 422 }
      end
    else
        render json: {error: "Could not alter theme file", status: 422 }
    end
  end

  def insertLayout
    foundIt = false
    allAssets = ShopifyAPI::Asset.find(:all)
    productGridAssets = allAssets.select do |asset|
      asset.key.include?("product") && !(asset.key.include?("featured") || asset.key.include?("recommend") || asset.key.include?("card") || asset.key.include?("price"))
    end
    assetKey = productGridAssets.first.key;
    theAsset = ShopifyAPI::Asset.find(assetKey)
    sideColStr = '<div id="full-container-sp">
      <div id="main-content-sp">
          
	'
    if (params[:layout][:layout] == "side-col")
      classInd = theAsset.value.index('grid product-single')
      divInd = theAsset.value[0..classInd].rindex('<div')
      searchStr = theAsset.value[divInd]



      newValue = theAsset.value.insert(divInd, sideColStr)
      theAsset.value = newValue + ""
      if theAsset.save
        @setting = Shop.find(session[:shop_id])
        @setting.layout = "side-col"
        @setting.layout_theme = true
        if @setting.save
          render :show
        else
          render json: {error: "Shop not saved", status: 422 }
        end
      else
        render json: {error: "Could not save theme", status: 422 }
      end
    end
    debugger
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
        font-style: italic;\n
      }\n
      .staff-member-container {\n
        width: 33%;\n
        height: 350px;\n
        overflow: hidden;\n
        border-bottom: none !important;\n
      }\n
      .staff-member-container:nth-child(3n+1) {\n
        padding-right: 28px;\n
      }\n
      .staff-member-container:nth-child(3n+2) {\n
        padding-right: 14px;\n
        padding-left: 14px;\n
      }\n
      .staff-member-container:nth-child(3n+0) {\n
        padding-left: 28px;\n
      }\n
      .staff-img-container {\n
        padding-right: 6px;\n
        padding-top: 0px;\n
        margin-bottom: -10px;\n
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

      .description-staff-pick{\n
        line-height: 1.4;\n
      }\n
      .staff-img-container img{\n
          max-height: 150px;\n
          max-width: 120px;\n
      }\n
      .staff-member-container .job-title {\n
        margin-bottom: 6px;\n
      }\n

      @media screen and (max-width: 960px) {\n
        #staff-profiles-ele {\n
          flex-direction: column;\n
          align-items: center;\n
        }\n
        .staff-member-container {\n
          width: 320px;\n
          height: inherit;\n
          margin-top: 24px;\n
        }\n
        .staff-member-container:nth-child(3n+1) {\n
          padding-right: 0px;\n
        }\n
        .staff-member-container:nth-child(3n+2) {\n
          padding-right: 0px;\n
          padding-left: 0px;\n
        }\n
        .staff-member-container:nth-child(3n+0) {\n
          padding-left: 0px;\n
        }\n
        </style>"

      if @page.save
        return true
      else
        return false
      end

    end

end

