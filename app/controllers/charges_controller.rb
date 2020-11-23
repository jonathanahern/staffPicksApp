class ChargesController < ShopifyApp::AuthenticatedController

    def activate_charge
        recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.find(request.params['charge_id'])
        recurring_application_charge.status == "accepted" ? recurring_application_charge.activate : redirect_to(root_path)
        redirect_to(root_path)
    end

end

