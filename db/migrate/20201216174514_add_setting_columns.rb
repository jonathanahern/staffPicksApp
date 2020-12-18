class AddSettingColumns < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :sticker_theme, :boolean, default: false
    add_column :shops, :layout_theme, :boolean, default: false
  end
end
