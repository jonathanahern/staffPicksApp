class ShopifyGdprController < ActionController::Base

  include ShopifyApp::WebhookVerification

    def shop_redact
      if params['shop_domain'].present?
        shop = Shop.find_by(shopify_domain: params['shop_domain'])
        shop.delete if !shop.nil?
        render json: '{"message": "Success"}', status: 200
      else 
        render json: '{"message": "Bad Request"}', status: 400
      end
    end

    def customers_redact
      if params['customer'].present?
        render json: '{"message": "Success"}', status: 200
      else
        render json: '{"message": "Bad Request"}', status: 400
      end
    end

    def customers_data_request
      if params['customer'].present?
        render json: '{"message": "Success"}', status: 200
      else
        render json: '{"message": "Bad Request"}', status: 400
      end
    end

    end