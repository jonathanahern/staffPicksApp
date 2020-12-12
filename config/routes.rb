Rails.application.routes.draw do

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
    namespace :api, defaults: {format: :json} do
      resources :employees
      resources :products
      resources :front_end, only: [:index, :show]
      resources :settings, only: [:show, :create, :update] do
        member do
          post 'insertStickers'
        end
      end
      resources :emails, only: [:create]
      resources :pages, only: [:index] do
        member do
          get 'getStaff'
        end
      end
    end

  post 'customers_data_request', to: 'shopify_gdpr#customers_data_request'
  post 'customers_redact', to: 'shopify_gdpr#customers_redact'
  post 'shop_redact', to: 'shopify_gdpr#shop_redact'

  get 'activatecharge', to: 'charges#activate_charge'

  root to: 'static_pages#root'

  mount ShopifyApp::Engine, at: '/'
end
