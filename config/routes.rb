Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
    namespace :api, defaults: {format: :json} do
      resources :employees
      resources :products
      resources :front_end
      resources :settings
      resources :emails, only: [:create]
      resources :pages, only: :index do
        member do
          get 'getStaff'
        end
      end
    end

  get 'activatecharge', to: 'charges#activate_charge'

  root to: 'static_pages#root'

  mount ShopifyApp::Engine, at: '/'
end
