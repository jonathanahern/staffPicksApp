# == Schema Information
#
# Table name: products
#
#  id                 :bigint           not null, primary key
#  shopify_title      :string           not null
#  shopify_image_url  :string
#  shopify_product_id :integer          not null
#  review             :string
#  shop_id            :integer          not null
#  employee_id        :integer          not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
class Product < ApplicationRecord

    validates :shopify_title, :shopify_image_url, :shopify_product_id, :review, :shop_id, :employee_id,  presence: true
    validates :review, length: { maximum: 400 }
    validates :shopify_product_id, uniqueness: { scope: :shop_id, message: "already reviewed" }

    belongs_to :shop,
        class_name: :Shop,
        primary_key: :id,
        foreign_key: :shop_id

    belongs_to :employee,
        class_name: :Employee,
        primary_key: :id,
        foreign_key: :employee_id

    def self.pickInfo(data)
        Product.select(:shopify_title, :shopify_image_url, :shopify_product_id, :shopify_handle, :review, :shop_id, :employee_id, "employees.name, employees.job_title, employees.profile_url, employees.description, employees.page_url").joins(:employee).where("products.shopify_product_id = #{data}")
    end

    def self.getProductIDsSettings(shopDomain)
        products = Product.joins(:shop).where("shops.shopify_domain = '#{shopDomain}'").pluck(:shopify_product_id)
        shop = Shop.find_by(shopify_domain: shopDomain)
        {ids: products, settings: {sticker: shop[:sticker], layout: shop[:layout]}}
        # {shop: shopDomain}
    end

    def self.webhookChange(prodID, img, title)
        # prod = Product.find_by_shopify_product_id(prodID);
        # if prod == nil
        #     if img != prod.shopify_image_url
        #         prod.update(:shopify_image_url => img);
        #     elsif title != prod.shopify_title
        #         prod.update(:shopify_title => title);
        #     end
        # end
    end

end
