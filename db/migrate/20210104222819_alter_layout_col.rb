class AlterLayoutCol < ActiveRecord::Migration[5.2]
  def change
    remove_column :shops, :layout, :string
    add_column :shops, :layout, :string, default: "none"
  end
end
