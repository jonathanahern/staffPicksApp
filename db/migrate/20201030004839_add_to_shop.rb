class AddToShop < ActiveRecord::Migration[5.2]
  def change
      add_column :shops, :sticker, :string, default: "red"
      add_column :shops, :layout, :string, default: "side-col"
  end
end
