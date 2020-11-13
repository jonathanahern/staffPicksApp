# frozen_string_literal: true
class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorage

  after_create :create_collection

    has_many :employees,
      class_name: :Employee,
      primary_key: :id,
      foreign_key: :shop_id

    has_many :products,
      class_name: :Product,
      primary_key: :id,
      foreign_key: :shop_id

  def create_collection
    ShopifyAPI::Session.setup(api_key: ShopifyApp.configuration.api_key, secret: ShopifyApp.configuration.secret)
    session = ShopifyAPI::Session.new(domain: self[:shopify_domain], token: self[:shopify_token], api_version: "2020-10")
    ShopifyAPI::Base.activate_session(session)
    ShopifyAPI::Base.api_version = ShopifyApp.configuration.api_version

    rule = ShopifyAPI::Rule.new
    rule.column = "tag"
    rule.relation = "equals"
    rule.condition = "Staff Pick App"
    collection = ShopifyAPI::SmartCollection.new
    collection.title = "Staff Picks"
    collection.template_suffix = ""
    collection.body_html = ""
    collection.rules = [rule]
    collection.save
  end

  def api_version
    ShopifyApp.configuration.api_version
  end

end

