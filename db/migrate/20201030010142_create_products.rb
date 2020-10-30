class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.string :shopify_title, null: false
      t.string :shopify_image_url
      t.bigint :shopify_product_id, null: false
      t.string :review, null: false
      t.integer :shop_id, null: false
      t.integer :employee_id, null: false
      t.string :shopify_handle

      t.timestamps
    end
    add_index :products, :shop_id
    add_index :products, :employee_id
    add_index :products, :shopify_product_id
  end
end
