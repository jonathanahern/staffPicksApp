class AddErrorColSettings < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :error, :string
  end
end
