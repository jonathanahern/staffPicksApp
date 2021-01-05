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
    @setting = Shop.find(session[:shop_id])

    if (params["auto"]["auto"] == "manual")
      @setting.sticker_theme = true
      if @setting.save
        render :show
      else
        @setting.error = "Shop not saved"
        render :show
      end
      return
    end

    theme_hash = get_theme_hash

    unless theme_hash
      @setting.error = "Shop's theme is not supported for automatic insertion."
      render :show
      return
    end

    theAsset = get_asset(theme_hash, "sticker")

    unless theAsset
      @setting.error = "Could not find asset file."
      render :show
      return
    end

    if theAsset.value.include?("staff-pick-alert")
      @setting.error = "File already contain Staff Pick code."
      render :show
      return
    end

    new_asset_value = new_asset_value(theAsset.value, theme_hash)

    unless new_asset_value
      @setting.error = "Theme file has been altered disabling automatic installation."
      render :show
      return
    end

    theAsset.value = new_asset_value
    
    if theAsset.save
      @setting.sticker_theme = true
      if @setting.save
        render :show
      else
        @setting.error = "Could not save shop information."
        render :show
      end
    else
      @setting.error = "Could not save asset file."
      render :show
    end

  end

  def clearStickers
    @setting = Shop.find(session[:shop_id])
    theme_hash = get_theme_hash

    unless theme_hash
      @setting.error = "Shop's theme is not supported for automatic deletion."
      render :show
      return
    end

    theAsset = get_asset(theme_hash, "sticker")

    unless theAsset
      @setting.error = "Could not find asset file."
      render :show
      return
    end

    unless theAsset.value.include?("staff-pick-alert")
      @setting.error = "Could not find code to delete."
      render :show
      return
    end

    new_asset_value = new_asset_value_no_sticker(theAsset.value)

    unless new_asset_value
      @setting.error = "Theme file has been altered disabling automatic installation."
      render :show
      return
    end

    theAsset.value = new_asset_value
    
    if theAsset.save
      @setting.sticker_theme = false
      if @setting.save
        render :show
      else
        @setting.error = "Could not save shop information."
        render :show
      end
    else
      @setting.error = "Could not save asset file."
      render :show
    end
  end

  def insertLayout

    layout = params["layout"]["layout"]
    @setting = Shop.find(session[:shop_id])
    theme_hash = get_theme_hash

    unless theme_hash
      @setting.error = "Shop's theme is not supported for automatic layout insertion."
      render :show
      return
    end

    theAsset = get_asset(theme_hash, "layout")

    unless theAsset
      @setting.error = "Could not find asset file."
      render :show
      return
    end

    newValue = add_layout(theAsset.value, layout, theme_hash, @setting.layout)
    
    unless newValue
      @setting.error = "Theme file has been altered disabling automatic installation."
      render :show
      return
    end

    theAsset.value = newValue

    if theAsset.save
      @setting.layout = layout
      if @setting.save
        render :show
      else
        @setting.error = "Could not save shop information."
        render :show
      end
    else
      @setting.error = "Could not save asset file."
      render :show
    end

  end

private

  def get_theme_hash
    name = ShopifyAPI::Theme.find(:all).where(role: "main").first.name

    themes_hash = {
      "Debut" => {
        :sticker_file => 'product-card-grid',
        :sticker_image_class => 'grid-view-item__image',
        :layout_file => 'product-template',
        :layout_side_div => 'grid product-single',
        :layout_bottom_div => 'grid product-single',
        :layout_inside_div => 'grid__item {{',
      }
    }

    return themes_hash[name]
  end

  def get_asset(theme_hash, file)
    allAssets = ShopifyAPI::Asset.find(:all)
    file_type = file == "layout" ? theme_hash[:layout_file] : theme_hash[:sticker_file]
    productGridAssets = allAssets.select do |asset|
      asset.key.include?(file_type)
    end

    if productGridAssets.length > 0
      assetKey = productGridAssets.first.key;
      theAsset = ShopifyAPI::Asset.find(assetKey)
      if theAsset
        return theAsset
      else
        return false
      end
    else
      return false
    end
  end

  def new_asset_value(old_value, theme_hash_ele)
    imgInd = old_value.index('<img')
    if (imgInd!=nil)
      stickerStr = '
          <div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>'
      newStr = old_value[imgInd..-1]
      insertPoint = newStr.index('>') + imgInd + 1
      newValue = old_value.insert(insertPoint, stickerStr)
      if old_value[imgInd..insertPoint].include?(theme_hash_ele[:sticker_image_class])
        return newValue
      else
        return false
      end
    else
      return false   
    end
  end

  def new_asset_value_no_sticker(old_value)
    stickerStr = '
          <div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>'
    stickerStrShort = '<div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>'
    
    if old_value.slice!(stickerStr)==nil
      if old_value.slice!(stickerStrShort)!=nil
        return old_value
      else
        return false
      end
    else
      return old_value;
    end
  end

  INTRO_SIDECOL = '<!--  This is code from the Staff Picks App Side Column  -->
    <div id="full-container-sp">
      <div id="main-content-sp">
<!--  Staff Picks App Side Column ends here  -->
  ';
  CLOSE_SIDECOL = '
<!--  This is closing code from the Staff Picks App Side Column  -->
    </div>
      <div id="staff-pick-ele"></div>
    </div>
<!--  Staff Picks App Side Column ends here  -->
  ';
  BOTTOM_ELE = '
<!--  This is code from the Staff Picks App Bottom Page  -->
    <div id="staff-pick-ele"></div>
<!--  Staff Picks App Bottom Page ends here  -->
  ';
  INSIDE_ELE = '
<!--  This is code from the Staff Picks App Inside Column  -->
    <div id="staff-pick-ele"></div>
<!--  Staff Picks App Inside Column ends here  -->
  ';

  def add_layout(old_value, layout_val, theme_hash, layout_setting)
    old_layout = current_layout(old_value)
    return false if layout_val == old_layout
    new_value = layout_setting == "none" ? old_value : remove_layout(old_value, old_layout)
    return false if new_value == false
    if layout_val == "side-col"
      classInd = new_value.index(theme_hash[:layout_side_div])
      return false unless classInd
      divInd = new_value[0..classInd].rindex('<div')
      searchStr = new_value[divInd..-1]
      divEndInd = get_closing_div_ind(searchStr) 
      return false unless divEndInd
      divEndInd = divEndInd + divInd + 1
      insertPoints = [divInd, divEndInd]
      newStr = new_value.insert(insertPoints[1], CLOSE_SIDECOL)
      newStr2 = newStr.insert(insertPoints[0], INTRO_SIDECOL)
      return newStr2
    elsif layout_val == "bottom-page"
      classInd = new_value.index(theme_hash[:layout_bottom_div])
      return false unless classInd
      divInd = new_value[0..classInd].rindex('<div')
      searchStr = new_value[divInd..-1]
      divEndInd = get_closing_div_ind(searchStr) 
      return false unless divEndInd
      divEndInd = divEndInd + divInd + 1
      newStr = new_value.insert(divEndInd, BOTTOM_ELE)
      return newStr
    elsif layout_val == "inside-col"
      classInd = new_value.index(theme_hash[:layout_inside_div])
      return false unless classInd
      divInd = new_value[0..classInd].rindex('<div')
      searchStr = new_value[divInd..-1]
      divEndInd = get_closing_div_ind(searchStr) 
      return false unless divEndInd
      divEndInd = divEndInd + divInd + 1
      divEndStartInd = new_value[0..divEndInd].rindex('</')
      newStr = new_value.insert(divEndStartInd, INSIDE_ELE)
      return newStr
    end

  end

  def get_closing_div_ind(str)
    div_count = 1
    (8..str.length).each do |i|
      if str[i-2..i] == "div" && str[i-5...i-2].include?('<')
        if str[i-3...i].include?('/')
          div_count -= 1
          if div_count == 0
            divStr = str[i..-1]
            return (divStr.index('>') + i)
            break
          end
        else
          div_count += 1
        end
      end
    end
    false 
  end

  def current_layout(old_value)
    if old_value.include?(INTRO_SIDECOL) && old_value.include?(CLOSE_SIDECOL)
      return "side-col"
    elsif old_value.include?(BOTTOM_ELE)
      return "bottom-page"
    elsif old_value.include?(INSIDE_ELE)
      return "inside-col"
    else
      return false
    end
  end

  def remove_layout(layout, type)
    if (type == "side-col")
      if layout.slice!(INTRO_SIDECOL)==nil
          return false
      else
        if layout.slice!(CLOSE_SIDECOL)==nil
          return false
        else
          return layout;
        end
      end
    else
      ele = type == "bottom-page" ? BOTTOM_ELE : INSIDE_ELE
      if layout.slice!(ele)==nil
          return false
      else
          return layout;
      end
    end
  end

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

