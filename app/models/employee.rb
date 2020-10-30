# == Schema Information
#
# Table name: employees
#
#  id          :bigint           not null, primary key
#  name        :string           not null
#  job_title   :string
#  description :string
#  profile_url :string
#  shop_id     :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Employee < ApplicationRecord

    validates :name, :description, :profile_url, :shop_id, presence: true
    validates :name, :job_title, length: { maximum: 24 }
    validates :description, length: { maximum: 500 }
    validates :name, uniqueness: { case_sensitive: false, scope: :shop_id, message: "already in use" }

    belongs_to :shop,
        class_name: :Shop,
        primary_key: :id,
        foreign_key: :shop_id

    has_many :products,
        class_name: :Product,
        primary_key: :id,
        foreign_key: :employee_id,
        dependent: :destroy
  
end
