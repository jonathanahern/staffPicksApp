# frozen_string_literal: true
class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorage

    has_many :employees,
      class_name: :Employee,
      primary_key: :id,
      foreign_key: :shop_id

    has_many :products,
      class_name: :Product,
      primary_key: :id,
      foreign_key: :shop_id

  def api_version
    ShopifyApp.configuration.api_version
  end
end

