# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_12_31_170737) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "employees", force: :cascade do |t|
    t.string "name", null: false
    t.string "job_title"
    t.string "description", null: false
    t.string "profile_url"
    t.integer "shop_id", null: false
    t.bigint "shopify_page_id"
    t.string "page_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shop_id"], name: "index_employees_on_shop_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "shopify_title", null: false
    t.string "shopify_image_url"
    t.bigint "shopify_product_id", null: false
    t.string "review", null: false
    t.integer "shop_id", null: false
    t.integer "employee_id", null: false
    t.string "shopify_handle"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_products_on_employee_id"
    t.index ["shop_id"], name: "index_products_on_shop_id"
    t.index ["shopify_product_id"], name: "index_products_on_shopify_product_id"
  end

  create_table "shops", force: :cascade do |t|
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "layout", default: "side-col"
    t.string "sticker", default: "new"
    t.boolean "sticker_theme", default: false
    t.boolean "layout_theme", default: false
    t.string "error"
    t.index ["shopify_domain"], name: "index_shops_on_shopify_domain", unique: true
  end

end
