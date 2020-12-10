class StaticPagesController < ShopifyApp::AuthenticatedController

    def root
        ShopifyAPI::Shop.current
    end

end