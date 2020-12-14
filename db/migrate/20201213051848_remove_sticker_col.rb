class RemoveStickerCol < ActiveRecord::Migration[5.2]
  def change
    remove_column :shops, :sticker, :string
    add_column :shops, :sticker, :string, default: "new"
  end
end
