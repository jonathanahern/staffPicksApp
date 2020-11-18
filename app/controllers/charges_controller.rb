class​ ​ChargesController < ShopifyApp::AuthenticatedController

    include​ ​ApplicationHelper

    before_action ​:set_shop
    
    ​def​ ​activate_charge
        # ​recurring_application_charge​ = ShopifyAPI​::​RecurringApplicationCharge​.​find​(​request​.params[​'charge_id'​])
        # ​recurring_application_charge​.​status​ == ​"accepted"​ ? recurring_application_charge​.activate : ​redirect(​root_path​)
        # ​redirect_to​(​root_path​)

        recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.find(request.params['charge_id'])
        recurring_application_charge.status == "accepted" ? recurring_application_charge.activate : redirect(root_path)
        redirect(root_path)
    ​end

end